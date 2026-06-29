import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function ReviewSection({
 productId,
 language = "vi",
}) {
 const [reviews, setReviews] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [showReviewForm, setShowReviewForm] = useState(false);
 const [submitting, setSubmitting] = useState(false);
 const [totalReviews, setTotalReviews] = useState(0);
 const [editingReview, setEditingReview] = useState(null);
 const [currentUserId, setCurrentUserId] = useState(null);
 const [selectedImages, setSelectedImages] = useState([]);
 const [formData, setFormData] = useState({
 title: "",
 content: "",
 rating: 5,
 });

 // Fetch current user
 useEffect(() => {
 const fetchCurrentUser = async () => {
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) return;

 try {
 const response = await fetch(
 "http://localhost:5221/api/users/profile",
 {
 headers: { Authorization: `Bearer ${token}` },
 }
 );
 const result = await response.json();
 if (result.success) {
 setCurrentUserId(result.data.id);
 }
 } catch (err) {
 console.error("Error fetching user:", err);
 }
 };

 fetchCurrentUser();
 }, []);

 // Fetch reviews tá»« API
 useEffect(() => {
 const fetchReviews = async () => {
 try {
 setLoading(true);
 const response = await fetch(
 `http://localhost:5221/api/reviews/watch/${productId}?pageNumber=1&pageSize=10`
 );
 const result = await response.json();

 if (result.success) {
 setReviews(result.data.items || []);
 setTotalReviews(
 result.data.totalRecords || result.data.items?.length || 0
 );
 } else {
 setError(result.message || "Lá»—i khi táº£i Ä‘Ã¡nh giÃ¡");
 }
 } catch (err) {
 console.error("Error fetching reviews:", err);
 setError("KhÃ´ng thá»ƒ táº£i Ä‘Ã¡nh giÃ¡");
 setReviews([]);
 } finally {
 setLoading(false);
 }
 };

 if (productId) {
 fetchReviews();
 }
 }, [productId]);

 const avgRating =
 reviews.length > 0
 ? (
 reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
 ).toFixed(1)
 : 0;

 const ratingCounts = {
 5: reviews.filter((r) => r.rating === 5).length,
 4: reviews.filter((r) => r.rating === 4).length,
 3: reviews.filter((r) => r.rating === 3).length,
 2: reviews.filter((r) => r.rating === 2).length,
 1: reviews.filter((r) => r.rating === 1).length,
 };

 const handleImageChange = (e) => {
 if (e.target.files) {
 const filesArray = Array.from(e.target.files);
 const availableSlots = 3 - selectedImages.length;
 const filesToAdd = filesArray.slice(0, availableSlots);
 setSelectedImages([...selectedImages, ...filesToAdd]);
 }
 };

 const removeImage = (index) => {
 const newImages = [...selectedImages];
 newImages.splice(index, 1);
 setSelectedImages(newImages);
 };

 const handleSubmit = async (e) => {
 e.preventDefault();
 if (!formData.title.trim() || !formData.content.trim()) return;

 try {
 setSubmitting(true);
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");

 let finalImageUrls = "";

 // Upload images if any
 if (selectedImages.length > 0) {
 const formDataUpload = new FormData();
 selectedImages.forEach(img => {
 formDataUpload.append("files", img);
 });

 const uploadResponse = await fetch("http://localhost:5221/api/upload/reviews", {
 method: "POST",
 headers: { Authorization: `Bearer ${token}` },
 body: formDataUpload
 });
 const uploadResult = await uploadResponse.json();
 if (uploadResult.success && uploadResult.data) {
 finalImageUrls = uploadResult.data.join(",");
 } else {
 throw new Error("Táº£i áº£nh tháº¥t báº¡i");
 }
 }

 const isEditing = editingReview !== null;
 const url = isEditing
 ? `http://localhost:5221/api/reviews/${editingReview.id}`
 : "http://localhost:5221/api/reviews";
 const method = isEditing ? "PUT" : "POST";

 const response = await fetch(url, {
 method,
 headers: {
 "Content-Type": "application/json",
 Authorization: `Bearer ${token}`,
 },
 body: JSON.stringify({
 watchId: productId,
 rating: formData.rating,
 title: formData.title,
 content: formData.content,
 imageUrls: finalImageUrls || null,
 }),
 });

 const result = await response.json();

 if (result.success) {
 if (isEditing) {
 // Update review in list
 setReviews(
 reviews.map((r) => (r.id === editingReview.id ? result.data : r))
 );
 setEditingReview(null);
 } else {
 // Add new review to list
 setReviews([result.data, ...reviews]);
 }
 setFormData({ title: "", content: "", rating: 5 });
 setSelectedImages([]);
 setShowReviewForm(false);

 alert(
 language === "vi"
 ? isEditing
 ? "ÄÃ£ cáº­p nháº­t Ä‘Ã¡nh giÃ¡!"
 : "Cáº£m Æ¡n Ä‘Ã¡nh giÃ¡ cá»§a báº¡n!"
 : isEditing
 ? "Review updated!"
 : "Thank you for your review!"
 );
 } else {
 alert(
 result.message ||
 (language === "vi"
 ? "Lá»—i khi gá»­i Ä‘Ã¡nh giÃ¡"
 : "Error submitting review")
 );
 }
 } catch (err) {
 console.error("Error submitting review:", err);
 alert(
 language === "vi" ? "Lá»—i khi gá»­i Ä‘Ã¡nh giÃ¡" : "Error submitting review"
 );
 } finally {
 setSubmitting(false);
 }
 };

 const handleEdit = (review) => {
 setEditingReview(review);
 setFormData({
 title: review.title,
 content: review.content,
 rating: review.rating,
 });
 setShowReviewForm(true);
 };

 const handleDelete = async (reviewId) => {
 if (
 !confirm(language === "vi" ? "XÃ³a Ä‘Ã¡nh giÃ¡ nÃ y?" : "Delete this review?")
 ) {
 return;
 }

 try {
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 const response = await fetch(
 `http://localhost:5221/api/reviews/${reviewId}`,
 {
 method: "DELETE",
 headers: { Authorization: `Bearer ${token}` },
 }
 );

 const result = await response.json();
 if (result.success) {
 setReviews(reviews.filter((r) => r.id !== reviewId));
 alert(language === "vi" ? "ÄÃ£ xÃ³a Ä‘Ã¡nh giÃ¡" : "Review deleted");
 } else {
 alert(result.message || "Error deleting review");
 }
 } catch (err) {
 console.error("Error deleting review:", err);
 alert("Error deleting review");
 }
 };

 const handleCancelEdit = () => {
 setEditingReview(null);
 setFormData({ title: "", content: "", rating: 5 });
 setSelectedImages([]);
 setShowReviewForm(false);
 };

 const renderStars = (rating) => {
 return (
 <div className="flex gap-1">
 {[1, 2, 3, 4, 5].map((star) => (
 <Icon
 key={star}
 icon={star <= rating ? "mdi:star" : "mdi:star-outline"}
 className={`w-4 h-4 ${
 star <= rating ? `text-black font-medium` : "text-black"
 }`}
 />
 ))}
 </div>
 );
 };

 return (
 <div
 className={`rounded-lg border p-8 bg-white border-black/5`}
 >
 <h2
 className={`text-2xl font-semibold mb-8 text-black`}
 >
 {language === "vi" ? "ÄÃ¡nh GiÃ¡ & Nháº­n XÃ©t" : "Reviews & Ratings"}
 </h2>

 {/* Loading State */}
 {loading && (
 <div className="flex justify-center items-center py-12">
 <Icon
 icon="mdi:loading"
 className={`w-8 h-8 text-black font-medium animate-spin`}
 />
 <p className={`ml-3 text-black`}>
 {language === "vi" ? "Äang táº£i Ä‘Ã¡nh giÃ¡..." : "Loading reviews..."}
 </p>
 </div>
 )}

 {/* Error State */}
 {error && !loading && (
 <div
 className={`p-4 rounded-lg border mb-8 bg-red-50 border-red-200 text-red-600`}
 >
 {error}
 </div>
 )}

 {/* Empty State */}
 {!loading && reviews.length === 0 && !error && (
 <div className="text-center py-12">
 <Icon
 icon="mdi:star-outline"
 className={`w-12 h-12 mx-auto text-black mb-3`}
 />
 <p className={"text-black"}>
 {language === "vi" ? "ChÆ°a cÃ³ Ä‘Ã¡nh giÃ¡ nÃ o" : "No reviews yet"}
 </p>
 </div>
 )}

 {/* Rating Summary - chá»‰ hiá»ƒn thá»‹ khi cÃ³ reviews */}
 {!loading && reviews.length > 0 && (
 <div className="grid md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-gray-700/50">
 {/* Overall Rating */}
 <div>
 <div className="flex items-end gap-4">
 <div>
 <div className={`text-5xl font-bold text-black font-medium`}>
 {avgRating}
 </div>
 <div className={`text-sm text-black mt-1`}>
 {language === "vi" ? "trÃªn 5 sao" : "out of 5"}
 </div>
 </div>
 <div className="mb-2">{renderStars(Math.round(avgRating))}</div>
 </div>
 <p
 className={`text-sm mt-4 text-black`}
 >
 {language === "vi"
 ? `Dá»±a trÃªn ${totalReviews} Ä‘Ã¡nh giÃ¡`
 : `Based on ${totalReviews} reviews`}
 </p>
 </div>

 {/* Rating Distribution */}
 <div className="space-y-2">
 {[5, 4, 3, 2, 1].map((rating) => (
 <div key={rating} className="flex items-center gap-3">
 <span
 className={`text-sm w-12 text-black`}
 >
 {rating} â­
 </span>
 <div
 className={`flex-1 h-2 rounded-full bg-gray-200`}
 >
 <div
 className="h-full bg-black rounded-full transition-all"
 style={{
 width: `${
 reviews.length > 0
 ? (ratingCounts[rating] / reviews.length) * 100
 : 0
 }%`,
 }}
 />
 </div>
 <span
 className={`text-sm w-8 text-right text-black`}
 >
 {ratingCounts[rating]}
 </span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Write Review Button */}
 {!loading && !showReviewForm && currentUserId && (
 <button
 onClick={() => setShowReviewForm(true)}
 className={`mb-8 px-6 py-3 rounded-lg border transition-all border-black ${"text-black"} font-medium hover:bg-gray-100 `}
 >
 {language === "vi" ? "âœï¸ Viáº¿t ÄÃ¡nh GiÃ¡" : "âœï¸ Write Review"}
 </button>
 )}

 {/* Review Form */}
 {showReviewForm && (
 <form
 onSubmit={handleSubmit}
 className="mb-8 pb-8 border-b border-gray-700/50"
 >
 <div className="space-y-4">
 <div>
 <label
 className={`block text-sm font-medium mb-2 text-black`}
 >
 {language === "vi" ? "ÄÃ¡nh giÃ¡" : "Rating"}
 </label>
 <div className="flex gap-2">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => setFormData({ ...formData, rating: star })}
 className="text-3xl transition-transform hover:scale-110"
 >
 {star <= formData.rating ? "â­" : "â˜†"}
 </button>
 ))}
 </div>
 </div>

 <div>
 <label
 className={`block text-sm font-medium mb-2 text-black`}
 >
 {language === "vi" ? "TiÃªu Ä‘á»" : "Title"}
 </label>
 <input
 type="text"
 value={formData.title}
 onChange={(e) =>
 setFormData({ ...formData, title: e.target.value })
 }
 className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors bg-white border-gray-300 focus:border-black `}
 placeholder={
 language === "vi"
 ? "VÃ­ dá»¥: Sáº£n pháº©m tuyá»‡t vá»i!"
 : "e.g., Great product!"
 }
 />
 </div>

 <div>
 <label
 className={`block text-sm font-medium mb-2 text-black`}
 >
 {language === "vi" ? "Ná»™i dung" : "Content"}
 </label>
 <textarea
 value={formData.content}
 onChange={(e) =>
 setFormData({ ...formData, content: e.target.value })
 }
 rows="4"
 className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors bg-white border-gray-300 focus:border-black `}
 placeholder={
 language === "vi"
 ? "Chia sáº» tráº£i nghiá»‡m cá»§a báº¡n..."
 : "Share your experience..."
 }
 />
 </div>

 {/* Image Upload UI */}
 <div>
 <label
 className={`block text-sm font-medium mb-2 text-black`}
 >
 {language === "vi" ? "HÃ¬nh áº£nh thá»±c táº¿ (Tá»‘i Ä‘a 3 áº£nh)" : "Photos (Max 3)"}
 </label>
 <div className="flex flex-wrap gap-4">
 {selectedImages.map((img, index) => (
 <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden border border-gray-300 ">
 <img src={URL.createObjectURL(img)} alt={`preview-${index}`} className="w-full h-full object-cover" />
 <button
 type="button"
 onClick={() => removeImage(index)}
 className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
 >
 <Icon icon="teenyicons:x-outline" width={12} />
 </button>
 </div>
 ))}
 {selectedImages.length < 3 && (
 <label className={`w-24 h-24 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 transition-colors border-gray-300 text-gray-500`}>
 <Icon icon="teenyicons:camera-outline" width={24} className="mb-1" />
 <span className="text-[10px] font-medium uppercase tracking-wider">ThÃªm áº£nh</span>
 <input
 type="file"
 accept="image/*"
 multiple
 className="hidden"
 onChange={handleImageChange}
 disabled={submitting}
 />
 </label>
 )}
 </div>
 </div>

 <div className="flex gap-3 pt-4">
 <button
 type="submit"
 disabled={submitting}
 className={`px-6 py-2 bg-black text-white rounded-lg transition-colors ${
 submitting
 ? "opacity-50 cursor-not-allowed"
 : "hover:bg-neutral-900 "
 }`}
 >
 {submitting
 ? language === "vi"
 ? "Äang gá»­i..."
 : "Submitting..."
 : language === "vi"
 ? "Gá»­i ÄÃ¡nh GiÃ¡"
 : "Submit Review"}
 </button>
 <button
 type="button"
 onClick={handleCancelEdit}
 disabled={submitting}
 className={`px-6 py-2 rounded-lg border transition-colors border-gray-300 text-gray-700 hover:bg-gray-100 ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
 >
 {language === "vi" ? "Há»§y" : "Cancel"}
 </button>
 </div>
 </div>
 </form>
 )}

 {/* Reviews List */}
 <div className="space-y-6">
 {reviews.map((review) => (
 <div
 key={review.id}
 className={`pb-6 border-b border-gray-700/50 last:border-b-0 text-black`}
 >
 <div className="flex items-start justify-between mb-3">
 <div>
 <div className="flex items-center gap-2">
 <h3
 className={`font-semibold text-black`}
 >
 {review.author}
 </h3>
 {review.verified && (
 <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
 <Icon icon="mdi:check-circle" className="w-3 h-3" />
 {language === "vi" ? "ÄÃ£ mua" : "Verified"}
 </span>
 )}
 </div>
 <p className={`text-xs text-black mt-1`}>{review.date}</p>
 </div>
 {renderStars(review.rating)}
 </div>

 <h4
 className={`font-medium mb-2 text-gray-800`}
 >
 {review.title}
 </h4>
 <p className="text-sm leading-relaxed mb-4">{review.content}</p>
 {review.imageUrls && (
 <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
 {review.imageUrls.split(',').map((url, i) => (
 <a key={i} href={url.trim()} target="_blank" rel="noopener noreferrer" className="block w-20 h-20 shrink-0 rounded-md overflow-hidden border border-gray-300 ">
 <img src={url.trim()} alt="Review photo" className="w-full h-full object-cover hover:scale-110 transition-transform" />
 </a>
 ))}
 </div>
 )}

 <div className="flex items-center gap-4">
 {review.userId === currentUserId && (
 <div className="flex gap-2">
 <button
 onClick={() => handleEdit(review)}
 className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
 >
 âœï¸ {language === "vi" ? "Sá»­a" : "Edit"}
 </button>
 <button
 onClick={() => handleDelete(review.id)}
 className="text-xs text-red-600 hover:text-red-700 transition-colors"
 >
 ðŸ—‘ï¸ {language === "vi" ? "XÃ³a" : "Delete"}
 </button>
 </div>
 )}
 </div>
 </div>
 ))}
 </div>
 </div>
 );
}

