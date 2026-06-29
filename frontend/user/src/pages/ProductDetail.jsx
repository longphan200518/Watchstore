import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import ToastContainer from "../components/ToastContainer";
import ReviewSection from "../components/ReviewSection";
import RecentlyViewed from "../components/RecentlyViewed";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useWishlist } from "../contexts/WishlistContext";
import { useCompare } from "../contexts/CompareContext";

export default function ProductDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [language, setLanguage] = useState("vi");
 const [product, setProduct] = useState(null);
 const [quantity, setQuantity] = useState(1);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [selectedImage, setSelectedImage] = useState(0);
 const [relatedProducts, setRelatedProducts] = useState([]);
 const { addToCart } = useCart();
 const { addToast } = useToast();
 const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
 const { addToCompare, removeFromCompare, isInCompare } = useCompare();
 const [inWishlist, setInWishlist] = useState(false);
 const [reviewSummary, setReviewSummary] = useState({
 totalReviews: 0,
 averageRating: 0,
 });
 const [socialProof, setSocialProof] = useState(0);

 useEffect(() => {
 const savedTheme = localStorage.getItem("theme");
 const savedLang = localStorage.getItem("language") || "vi";
 if (savedTheme === "dark") setLanguage(savedLang);
 }, []);

 useEffect(() => {
 if (product) {
 setInWishlist(isInWishlist(product.id));
 }
 }, [product, isInWishlist]);

 useEffect(() => {
 const fetchProduct = async () => {
 try {
 const response = await fetch(`http://localhost:5221/api/watches/${id}`);
 const result = await response.json();
 if (result.success) {
 setProduct(result.data);
 // Fetch related products using new API
 fetchRelatedProducts(id);
 // Save to Recently Viewed
 saveToRecentlyViewed(result.data);

 // Fetch review summary
 fetchReviewSummary(id);

 // Fetch social proof
 fetchSocialProof(id);
 } else {
 setError(result.message || "Không tìm thấy sản phẩm");
 }
 } catch (err) {
 console.error("Fetch error:", err);
 setError(err.message || "Có lỗi xảy ra");
 } finally {
 setLoading(false);
 }
 };

 if (id) fetchProduct();
 }, [id]);

 const fetchRelatedProducts = async (watchId) => {
 try {
 const response = await fetch(
 `http://localhost:5221/api/watches/${watchId}/cross-sell?limit=4`
 );
 const result = await response.json();
 if (result.success) {
 setRelatedProducts(result.data || []);
 }
 } catch (err) {
 console.error("Error fetching related products:", err);
 }
 };

 const fetchSocialProof = async (watchId) => {
 try {
 const response = await fetch(`http://localhost:5221/api/watches/${watchId}/social-proof`);
 const result = await response.json();
 if (result.success) {
 setSocialProof(result.data);
 }
 } catch (err) {
 console.error("Error fetching social proof:", err);
 }
 };

 const saveToRecentlyViewed = (watch) => {
 try {
 const stored = localStorage.getItem("recentlyViewed");
 let viewed = stored ? JSON.parse(stored) : [];
 // Xóa nếu đã tồn tại để đưa lên đầu
 viewed = viewed.filter((item) => item.id !== watch.id);
 viewed.unshift({
 id: watch.id,
 name: watch.name,
 price: watch.price,
 imageUrl: watch.images?.[0]?.imageUrl || "",
 });
 // Giữ tối đa 10 sản phẩm
 if (viewed.length > 10) {
 viewed.pop();
 }
 localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
 } catch (e) {
 console.error("Lỗi khi lưu recentlyViewed", e);
 }
 };

 const fetchReviewSummary = async (watchId) => {
 try {
 const response = await fetch(
 `http://localhost:5221/api/reviews/watch/${watchId}/summary`
 );
 const result = await response.json();
 if (result.success && result.data) {
 setReviewSummary({
 totalReviews: result.data.totalReviews || 0,
 averageRating: result.data.averageRating || 0,
 });
 }
 } catch (err) {
 console.error("Error fetching review summary:", err);
 }
 };

 const handleAddToCart = async () => {
 if (quantity > 0 && product.status === 1) {
 const result = await addToCart(product.id, quantity);
 if (result.success) {
 addToast(
 language === "vi"
 ? `${product.name} x${quantity} đã được thêm vào giỏ hàng`
 : `${product.name} x${quantity} added to cart`,
 "success",
 2000
 );
 setQuantity(1);
 } else {
 addToast(result.message, "error");
 if (result.requireLogin) {
 navigate("/login");
 }
 }
 }
 };

 const handleBuyNow = async () => {
 if (quantity > 0 && product.status === 1) {
 const result = await addToCart(product.id, quantity);
 if (result.success) {
 navigate("/cart");
 } else {
 addToast(result.message, "error");
 if (result.requireLogin) {
 navigate("/login");
 }
 }
 }
 };

 const handleWishlist = async () => {
 if (inWishlist) {
 await removeFromWishlist(product.id);
 setInWishlist(false);
 addToast(
 language === "vi"
 ? "Đã xóa khỏi danh sách yêu thích"
 : "Removed from wishlist",
 "success"
 );
 } else {
 const result = await addToWishlist(product);
 if (result.success) {
 setInWishlist(true);
 addToast(
 language === "vi"
 ? "Đã thêm vào danh sách yêu thích"
 : "Added to wishlist",
 "success"
 );
 } else {
 addToast(result.message, "error");
 if (!result.success && !localStorage.getItem("token")) {
 navigate("/login");
 }
 }
 }
 };

 const handleCompareToggle = () => {
 if (isInCompare(product.id)) {
 removeFromCompare(product.id);
 } else {
 addToCompare(product);
 }
 };

 if (loading) {
 return (
 <div className={`min-h-screen bg-gray-50 text-gray-900`}>
 <Header />
 <main className="max-w-[1800px] mx-auto px-6 lg:px-12 py-32">
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
 <div className="flex flex-col md:flex-row gap-6">
 <div className="hidden md:flex flex-col gap-4 w-24">
 <Skeleton className="w-24 h-32 rounded-lg" />
 <Skeleton className="w-24 h-32 rounded-lg" />
 <Skeleton className="w-24 h-32 rounded-lg" />
 </div>
 <Skeleton className="flex-1 aspect-[3/4] rounded-lg" />
 </div>
 <div className="space-y-6">
 <Skeleton className="w-32 h-6" />
 <Skeleton className="w-3/4 h-12" />
 <Skeleton className="w-1/2 h-8" />
 <Skeleton className="w-full h-32" />
 </div>
 </div>
 </main>
 </div>
 );
 }

 if (error || !product) {
 return (
 <div className={`min-h-screen bg-gray-50`}>
 <Header />
 <main className="max-w-[1800px] mx-auto px-6 lg:px-12 py-32 text-center">
 <Icon
 icon="mdi:alert-circle-outline"
 className={`w-24 h-24 mx-auto mb-8 text-red-600`}
 />
 <h2
 className={`text-3xl font-serif mb-4 text-gray-900`}
 >
 {language === "vi"
 ? "Không tìm thấy sản phẩm"
 : "Product Not Found"}
 </h2>
 <p className={`mb-8 text-black`}>
 {error ||
 (language === "vi"
 ? "Sản phẩm không tồn tại"
 : "Product does not exist")}
 </p>
 <Link
 to="/products"
 className="inline-block px-10 py-4 bg-black text-white hover:bg-neutral-800 transition-all duration-300 text-sm tracking-[0.2em] uppercase font-medium"
 >
 {language === "vi" ? "Quay lại sản phẩm" : "Back to Products"}
 </Link>
 </main>
 </div>
 );
 }

 const images =
 product.images && product.images.length > 0
 ? product.images.map((img) => img.imageUrl)
 : ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800"];

 const specifications = [
 {
 category: language === "vi" ? "Thông Số Máy" : "Movement",
 items: [
 {
 label: language === "vi" ? "Loại máy" : "Type",
 value: product.movement || "N/A",
 },
 ...(product.functions
 ? [
 {
 label: language === "vi" ? "Chức năng" : "Function",
 value: product.functions,
 },
 ]
 : []),
 ],
 },
 {
 category: language === "vi" ? "Kích Thước" : "Dimensions",
 items: [
 {
 label: language === "vi" ? "Size mặt" : "Case Size",
 value: product.caseSize || "N/A",
 },
 ...(product.thickness
 ? [
 {
 label: language === "vi" ? "Độ dày" : "Thickness",
 value: product.thickness,
 },
 ]
 : []),
 ...(product.bandWidth
 ? [
 {
 label: language === "vi" ? "Độ rộng dây" : "Band Width",
 value: product.bandWidth,
 },
 ]
 : []),
 ],
 },
 {
 category: language === "vi" ? "Chất Liệu" : "Materials",
 items: [
 ...(product.crystal
 ? [
 {
 label: language === "vi" ? "Mặt kính" : "Crystal",
 value: product.crystal,
 },
 ]
 : []),
 ...(product.caseMaterial
 ? [
 {
 label: language === "vi" ? "Vỏ" : "Case",
 value: product.caseMaterial,
 },
 ]
 : []),
 ...(product.bandMaterial
 ? [
 {
 label: language === "vi" ? "Dây" : "Band",
 value: product.bandMaterial,
 },
 ]
 : []),
 ],
 },
 {
 category: language === "vi" ? "Khác" : "Other",
 items: [
 ...(product.waterResistance
 ? [
 {
 label: language === "vi" ? "Chống nước" : "Water Resistance",
 value: product.waterResistance,
 },
 ]
 : []),
 ...(product.warranty
 ? [
 {
 label: language === "vi" ? "Bảo hành" : "Warranty",
 value: product.warranty,
 },
 ]
 : []),
 ],
 },
 ];

 return (
 <div className={`min-h-screen bg-gray-50 text-gray-900`}>
 <Header />
 <ToastContainer />

 <main className="pt-32">
 {/* Breadcrumb */}
 <div className="max-w-[1800px] mx-auto px-6 lg:px-12 mb-8">
 <div
 className={`flex gap-2 text-sm text-black`}
 >
 <Link to="/" className={`hover:text-black font-medium transition-colors`}>
 {language === "vi" ? "Trang chủ" : "Home"}
 </Link>
 <span>/</span>
 <Link
 to="/products"
 className={`hover:text-black font-medium transition-colors`}
 >
 {language === "vi" ? "Sản phẩm" : "Products"}
 </Link>
 <span>/</span>
 <span className={`text-black font-medium`}>{product.name}</span>
 </div>
 </div>

 {/* HERO PRODUCT SECTION */}
 <section className={`py-16 bg-white`}>
 <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
 <div className="grid lg:grid-cols-2 gap-16 items-start">
 {/* LEFT: Image Stack - 55% */}
 <div className="lg:pr-8 space-y-4">
 {images.map((img, idx) => (
 <div
 key={idx}
 className={`w-full overflow-hidden bg-gray-100`}
 >
 <img
 src={img}
 alt={`${product.name} ${idx + 1}`}
 className="w-full h-auto object-cover hover:scale-110 transition-transform duration-700 cursor-crosshair"
 />
 </div>
 ))}
 </div>

 {/* RIGHT: Product Info - 45% */}
 <div className="lg:pl-8 sticky top-32">
 {/* Brand & Product Code */}
 <div className="mb-6">
 <span
 className={`text-xs tracking-[0.3em] uppercase text-black`}
 >
 {product.brand?.name || `LUXURY WATCH`} <span className={`text-black mx-2`}>|</span> <span className={"text-black"}>{product.categoryName}</span>
 </span>
 <p
 className={`text-xs mt-2 text-black`}
 >
 {language === "vi" ? "Mã" : "SKU"}:{" "}
 {String(product.id).substring(0, 8).toUpperCase()}
 </p>
 </div>

 {/* Product Name */}
 <h1
 className={`font-serif text-5xl lg:text-6xl font-light mb-6 leading-tight text-gray-900`}
 >
 {product.name}
 </h1>

 {/* Price */}
 <div className="mb-6">
 <p
 className={`text-4xl font-light text-black`}
 >
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(product.price)}
 </p>
 </div>

 {/* Social Proof */}
 {socialProof > 0 && (
 <motion.div initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 className="mb-8"
 >
 <div className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-50 text-red-600 border border-red-100 rounded-lg`}>
 <Icon icon="mdi:fire" className="w-5 h-5 animate-pulse" />
 {language === "vi" ? `Đã có ${socialProof} người mua trong tuần` : `${socialProof} people bought this week`}
 </div>
 </motion.div>
 )}

 {/* Rating */}
 <div className="flex items-center gap-3 mb-8">
 <div className="flex gap-1">
 {[1, 2, 3, 4, 5].map((star) => (
 <Icon
 key={star}
 icon="mdi:star"
 className={`w-5 h-5 text-black font-medium`}
 />
 ))}
 </div>
 <span
 className={`text-sm text-black`}
 >
 ({reviewSummary.totalReviews}{" "}
 {language === "vi" ? "đánh giá" : "reviews"})
 </span>
 </div>

 {/* Short Description */}
 <p
 className={`text-lg leading-relaxed mb-8 text-black`}
 >
 {product.description ||
 (language === "vi"
 ? "Đồng hồ Automatic cao cấp, mặt Sapphire chống trầy, chống nước 10ATM. Thiết kế tinh tế dành cho những người đam mê sự hoàn hảo."
 : "Premium Automatic watch with scratch-resistant Sapphire crystal, 10ATM water resistance. Refined design for perfection lovers.")}
 </p>

 {/* Status */}
 <div className="mb-8">
 <div
 className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
 product.status === 1
 ? "bg-green-100 text-green-700 border border-green-300"
 : "bg-red-100 text-red-700 border border-red-300"
 }`}
 >
 <Icon
 icon={
 product.status === 1
 ? "mdi:check-circle"
 : "mdi:alert-circle"
 }
 className="w-4 h-4"
 />
 {product.status === 1
 ? language === "vi"
 ? "Còn hàng"
 : "In Stock"
 : language === "vi"
 ? "Hết hàng"
 : "Out of Stock"}
 </div>
 </div>

 {/* Quantity Selector */}
 <div className="mb-8">
 <label
 className={`block text-sm mb-3 tracking-[0.1em] uppercase text-black`}
 >
 {language === "vi" ? "Số lượng" : "Quantity"}
 </label>
 <div className="flex items-center gap-4">
 <button
 onClick={() => setQuantity(Math.max(1, quantity - 1))}
 className={`w-12 h-12 border flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300 border-gray-300 bg-white ${"text-black"} hover:bg-black hover:border-black `}
 >
 <Icon icon="mdi:minus" className="w-5 h-5" />
 </button>
 <span
 className={`text-2xl font-light w-16 text-center text-gray-900`}
 >
 {quantity}
 </span>
 <button
 onClick={() => setQuantity(quantity + 1)}
 className={`w-12 h-12 border flex items-center justify-center hover:bg-black hover:border-black hover:text-white transition-all duration-300 border-gray-300 bg-white ${"text-black"} hover:bg-black hover:border-black `}
 >
 <Icon icon="mdi:plus" className="w-5 h-5" />
 </button>
 </div>
 </div>

 {/* CTA Buttons */}
 <div className="space-y-4 mb-12">
 <button
 onClick={handleAddToCart}
 disabled={product.status !== 1}
 className={`w-full py-5 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase font-medium transition-all duration-300 ${
 product.status === 1
 ? "bg-black text-white hover:bg-gray-900 border-2 border-black"
 : "bg-gray-300 text-black cursor-not-allowed border-2 border-gray-300"
 }`}
 >
 <Icon icon="mdi:cart-outline" className="w-5 h-5" />
 {language === "vi" ? "Thêm vào giỏ hàng" : "Add to Cart"}
 </button>

 <div className="flex gap-4">
 <button
 onClick={handleBuyNow}
 disabled={product.status !== 1}
 className={`flex-1 py-5 flex items-center justify-center gap-3 text-sm tracking-[0.2em] uppercase font-medium border-2 transition-all duration-300 ${
 product.status === 1
 ? "border-black text-black font-medium hover:bg-black hover:text-white"
 : "border-gray-300 text-black cursor-not-allowed"
 }`}
 >
 <Icon icon="mdi:lightning-bolt" className="w-5 h-5" />
 {language === "vi" ? "Mua ngay" : "Buy Now"}
 </button>

 <button
 onClick={handleWishlist}
 className={`px-6 py-5 flex items-center justify-center gap-2 text-sm tracking-[0.2em] uppercase font-medium border-2 transition-all duration-300 ${
 inWishlist
 ? "bg-red-600 border-red-600 text-white hover:bg-red-700"
 : "border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50"
 }`}
 >
 <Icon
 icon={inWishlist ? "mdi:heart" : "mdi:heart-outline"}
 className="w-5 h-5"
 />
 </button>

 <button
 onClick={handleCompareToggle}
 className={`px-6 py-5 flex items-center justify-center gap-2 text-sm tracking-[0.2em] uppercase font-medium border-2 transition-all duration-300 ${
 isInCompare(product.id)
 ? "bg-black border-black text-white hover:bg-gray-900"
 : "border-gray-300 bg-white text-black hover:border-gray-400 hover:bg-gray-50"
 }`}
 title={language === "vi" ? "So sánh" : "Compare"}
 >
 <Icon
 icon="mdi:scale-balance"
 className="w-5 h-5"
 />
 </button>
 </div>
 </div>

 {/* Benefits */}
 <div
 className={`grid grid-cols-2 gap-4 pt-8 border-t border-gray-200`}
 >
 {[
 {
 icon: "mdi:truck-fast",
 text:
 language === "vi"
 ? "Giao nhanh 2 giờ"
 : "2-hour delivery",
 },
 {
 icon: "mdi:shield-check",
 text:
 language === "vi"
 ? "Bảo hành 24 tháng"
 : "24-month warranty",
 },
 {
 icon: "mdi:swap-horizontal",
 text:
 language === "vi" ? "Đổi trả 7 ngày" : "7-day return",
 },
 {
 icon: "mdi:certificate",
 text:
 language === "vi"
 ? "Chính hãng 100%"
 : "100% Authentic",
 },
 ].map((benefit, index) => (
 <div key={index} className="flex items-center gap-3">
 <Icon
 icon={benefit.icon}
 className={`w-5 h-5 text-black`}
 />
 <span
 className={`text-xs text-black`}
 >
 {benefit.text}
 </span>
 </div>
 ))}
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* SPECIFICATIONS SECTION */}
 <section className={`py-24 bg-gray-100`}>
 <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
 <div className="text-center mb-16">
 <span
 className={`inline-block text-xs tracking-[0.3em] uppercase mb-4 text-black`}
 >
 {language === "vi" ? "Thông Số Kỹ Thuật" : "Specifications"}
 </span>
 <h2
 className={`font-serif text-4xl font-light text-gray-900`}
 >
 {language === "vi" ? "Chi Tiết Sản Phẩm" : "Product Details"}
 </h2>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
 {specifications.map((spec, idx) => (
 <div
 key={idx}
 className={`p-8 border bg-white border-gray-200`}
 >
 <h3
 className={`text-sm tracking-[0.2em] uppercase mb-6 font-semibold text-black`}
 >
 {spec.category}
 </h3>
 <div className="space-y-4">
 {spec.items.map((item, itemIdx) => (
 <div key={itemIdx} className="flex flex-col gap-1">
 <span
 className={`text-xs text-black`}
 >
 {item.label}
 </span>
 <span
 className={`text-sm font-medium text-black`}
 >
 {item.value}
 </span>
 </div>
 ))}
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* DESCRIPTION & STORY */}
 <section className={`py-24 bg-white`}>
 <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
 <div className="grid lg:grid-cols-2 gap-16 items-center">
 <div>
 <img
 src={images[0]}
 alt="Product Detail"
 className="w-full rounded-lg"
 />
 </div>
 <div>
 <span
 className={`inline-block text-xs tracking-[0.3em] uppercase mb-4 text-black`}
 >
 {language === "vi" ? "Câu Chuyện" : "Story"}
 </span>
 <h2
 className={`font-serif text-4xl font-light mb-8 text-gray-900`}
 >
 {language === "vi"
 ? "Nghệ Thuật Chế Tác"
 : "The Art of Craftsmanship"}
 </h2>
 <div
 className={`space-y-6 text-lg leading-relaxed text-black`}
 >
 <p>
 {language === "vi"
 ? "Được chế tác từ thép không gỉ 316L với độ bền cao, mặt kính Sapphire chống trầy gần như tuyệt đối. Mỗi chi tiết đều được hoàn thiện thủ công bởi những nghệ nhân lành nghề với hơn 20 năm kinh nghiệm."
 : "Crafted from high-grade 316L stainless steel with scratch-resistant Sapphire crystal. Every detail is hand-finished by master craftsmen with over 20 years of experience."}
 </p>
 <p className="italic border-l-2 border-black pl-6">
 {language === "vi"
 ? '"Phong cách lịch lãm dành cho người đàn ông hiện đại."'
 : '"Timeless elegance for the modern gentleman."'}
 </p>
 <p>
 {language === "vi"
 ? "Bộ máy Automatic tự động lên dây cót qua chuyển động tay, không cần pin, thể hiện đẳng cấp của nghệ thuật chế tác đồng hồ truyền thống."
 : "Automatic movement self-winds through wrist motion, battery-free, representing the pinnacle of traditional watchmaking craftsmanship."}
 </p>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* RELATED PRODUCTS */}
 {relatedProducts.length > 0 && (
 <section
 className={`py-24 bg-gray-100`}
 >
 <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
 <div className="text-center mb-16">
 <span
 className={`inline-block text-xs tracking-[0.3em] uppercase mb-4 text-black`}
 >
 {language === "vi" ? "Gợi Ý" : "Suggestions"}
 </span>
 <h2
 className={`font-serif text-4xl font-light text-gray-900`}
 >
 {language === "vi"
 ? "Khách Hàng Cũng Mua"
 : "Customers Also Bought"}
 </h2>
 </div>

 <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
 {relatedProducts.slice(0, 4).map((item) => (
 <Link
 key={item.id}
 to={`/products/${item.id}`}
 className="group"
 >
 <div
 className={`aspect-square overflow-hidden mb-4 bg-white`}
 >
 <img
 src={
 item.images?.[0]?.imageUrl ||
 "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500"
 }
 alt={item.name}
 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
 />
 </div>
 <div className="text-center">
 <p
 className={`text-xs tracking-[0.2em] uppercase mb-2 text-black`}
 >
 {item.brand?.name}
 </p>
 <h3
 className={`font-serif text-lg mb-3 group-hover:text-black font-medium transition-colors text-gray-900`}
 >
 {item.name}
 </h3>
 <p
 className={`text-sm font-medium text-black`}
 >
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(item.price)}
 </p>
 </div>
 </Link>
 ))}
 </div>
 </div>
 </section>
 )}

 {/* RECENTLY VIEWED PRODUCTS */}
 <RecentlyViewed language={language} />

 {/* WARRANTY & SUPPORT */}
 <section className={`py-16 bg-white`}>
 <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
 <div
 className={`grid md:grid-cols-5 gap-8 p-12 border border-gray-200`}
 >
 {[
 {
 icon: "mdi:shield-check",
 title:
 language === "vi"
 ? "Bảo Hành 24 Tháng"
 : "24-Month Warranty",
 },
 {
 icon: "mdi:swap-horizontal",
 title: language === "vi" ? "Đổi Trả 7 Ngày" : "7-Day Return",
 },
 {
 icon: "mdi:truck-fast",
 title:
 language === "vi" ? "Miễn Phí Vận Chuyển" : "Free Shipping",
 },
 {
 icon: "mdi:certificate-outline",
 title:
 language === "vi" ? "100% Chính Hãng" : "100% Authentic",
 },
 {
 icon: "mdi:headset",
 title: language === "vi" ? "Hỗ Trợ 24/7" : "24/7 Support",
 },
 ].map((item, index) => (
 <div key={index} className="text-center">
 <Icon
 icon={item.icon}
 className={`w-12 h-12 mx-auto mb-4 text-black`}
 />
 <p
 className={`text-sm font-medium text-black`}
 >
 {item.title}
 </p>
 </div>
 ))}
 </div>
 </div>
 </section>

 {/* Reviews Section */}
 <section className="mt-20">
 <ReviewSection productId={id} language={language} />
 </section>
 </main>
 </div>
 );
}
