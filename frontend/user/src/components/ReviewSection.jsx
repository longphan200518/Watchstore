import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function ReviewSection({
  productId,
  isDark = false,
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

  // Fetch reviews từ API
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
          setError(result.message || "Lỗi khi tải đánh giá");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Không thể tải đánh giá");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    try {
      setSubmitting(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");

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
        setShowReviewForm(false);

        alert(
          language === "vi"
            ? isEditing
              ? "Đã cập nhật đánh giá!"
              : "Cảm ơn đánh giá của bạn!"
            : isEditing
            ? "Review updated!"
            : "Thank you for your review!"
        );
      } else {
        alert(
          result.message ||
            (language === "vi"
              ? "Lỗi khi gửi đánh giá"
              : "Error submitting review")
        );
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert(
        language === "vi" ? "Lỗi khi gửi đánh giá" : "Error submitting review"
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
      !confirm(language === "vi" ? "Xóa đánh giá này?" : "Delete this review?")
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
        alert(language === "vi" ? "Đã xóa đánh giá" : "Review deleted");
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
              star <= rating ? "text-amber-500" : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`rounded-lg border p-8 ${
        isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-8 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {language === "vi" ? "Đánh Giá & Nhận Xét" : "Reviews & Ratings"}
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Icon
            icon="mdi:loading"
            className="w-8 h-8 text-amber-600 animate-spin"
          />
          <p className={`ml-3 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
            {language === "vi" ? "Đang tải đánh giá..." : "Loading reviews..."}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div
          className={`p-4 rounded-lg border mb-8 ${
            isDark
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-red-50 border-red-200 text-red-600"
          }`}
        >
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && reviews.length === 0 && !error && (
        <div className="text-center py-12">
          <Icon
            icon="mdi:star-outline"
            className="w-12 h-12 mx-auto text-gray-400 mb-3"
          />
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            {language === "vi" ? "Chưa có đánh giá nào" : "No reviews yet"}
          </p>
        </div>
      )}

      {/* Rating Summary - chỉ hiển thị khi có reviews */}
      {!loading && reviews.length > 0 && (
        <div className="grid md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-gray-700/50">
          {/* Overall Rating */}
          <div>
            <div className="flex items-end gap-4">
              <div>
                <div className="text-5xl font-bold text-amber-500">
                  {avgRating}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  {language === "vi" ? "trên 5 sao" : "out of 5"}
                </div>
              </div>
              <div className="mb-2">{renderStars(Math.round(avgRating))}</div>
            </div>
            <p
              className={`text-sm mt-4 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "vi"
                ? `Dựa trên ${totalReviews} đánh giá`
                : `Based on ${totalReviews} reviews`}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center gap-3">
                <span
                  className={`text-sm w-12 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {rating} ⭐
                </span>
                <div
                  className={`flex-1 h-2 rounded-full ${
                    isDark ? "bg-gray-700" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="h-full bg-amber-500 rounded-full transition-all"
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
                  className={`text-sm w-8 text-right ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
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
          className={`mb-8 px-6 py-3 rounded-lg border transition-all ${
            isDark
              ? "border-amber-600 text-amber-500 hover:bg-amber-600/20"
              : "border-amber-500 text-amber-600 hover:bg-amber-100"
          }`}
        >
          {language === "vi" ? "✍️ Viết Đánh Giá" : "✍️ Write Review"}
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
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Đánh giá" : "Rating"}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {star <= formData.rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Tiêu đề" : "Title"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-neutral-800 border-gray-700 text-white focus:border-amber-600"
                    : "bg-white border-gray-300 focus:border-amber-600"
                }`}
                placeholder={
                  language === "vi"
                    ? "Ví dụ: Sản phẩm tuyệt vời!"
                    : "e.g., Great product!"
                }
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Nội dung" : "Content"}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-neutral-800 border-gray-700 text-white focus:border-amber-600"
                    : "bg-white border-gray-300 focus:border-amber-600"
                }`}
                placeholder={
                  language === "vi"
                    ? "Chia sẻ trải nghiệm của bạn..."
                    : "Share your experience..."
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className={`px-6 py-2 bg-amber-600 text-white rounded-lg transition-colors ${
                  submitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-amber-700"
                }`}
              >
                {submitting
                  ? language === "vi"
                    ? "Đang gửi..."
                    : "Submitting..."
                  : language === "vi"
                  ? "Gửi Đánh Giá"
                  : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={submitting}
                className={`px-6 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                } ${submitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {language === "vi" ? "Hủy" : "Cancel"}
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
            className={`pb-6 border-b border-gray-700/50 last:border-b-0 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {review.author}
                  </h3>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                      <Icon icon="mdi:check-circle" className="w-3 h-3" />
                      {language === "vi" ? "Đã mua" : "Verified"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
              {renderStars(review.rating)}
            </div>

            <h4
              className={`font-medium mb-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {review.title}
            </h4>
            <p className="text-sm leading-relaxed mb-4">{review.content}</p>

            <div className="flex items-center gap-4">
              {review.userId === currentUserId && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(review)}
                    className="text-xs text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    ✏️ {language === "vi" ? "Sửa" : "Edit"}
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-xs text-red-600 hover:text-red-700 transition-colors"
                  >
                    🗑️ {language === "vi" ? "Xóa" : "Delete"}
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
