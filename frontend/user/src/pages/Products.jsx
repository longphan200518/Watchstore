import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header";
import Skeleton from "../components/Skeleton";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useWishlist } from "../contexts/WishlistContext";

export default function Products() {
 const navigate = useNavigate();
 const [searchParams, setSearchParams] = useSearchParams();
 const [watches, setWatches] = useState([]);
 const [brands, setBrands] = useState([]);
 const [categories, setCategories] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [totalPages, setTotalPages] = useState(1);
 const [language, setLanguage] = useState("vi");
 const { addToCart } = useCart();
 const { addToast } = useToast();
 const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
 const [wishlistItems, setWishlistItems] = useState(new Set());
 const [isFilterOpen, setIsFilterOpen] = useState(false);

 useEffect(() => {
 const saved = localStorage.getItem("theme");
 const savedLang = localStorage.getItem("language") || "vi";
 setLanguage(savedLang);
 }, []);

 useEffect(() => {
 const newSet = new Set(
 watches
 .map((watch) => (isInWishlist(watch.id) ? watch.id : null))
 .filter(Boolean)
 );
 setWishlistItems(newSet);
 }, [watches, isInWishlist]);

 const page = parseInt(searchParams.get("page")) || 1;
 const search = searchParams.get("search") || "";
 const brandId = searchParams.get("brandId") || "";
 const categoryId = searchParams.get("categoryId") || "";
 const minPrice = searchParams.get("minPrice") || "";
 const maxPrice = searchParams.get("maxPrice") || "";
 const sortBy = searchParams.get("sortBy") || "latest";

 // Fetch brands
 useEffect(() => {
 const fetchBrands = async () => {
 try {
 const response = await fetch(
 "http://localhost:5221/api/brands?pageSize=100"
 );
 const result = await response.json();
 if (result.success) {
 setBrands(result.data?.items || []);
 }
 } catch (err) {
 console.error("Failed to load brands:", err);
 }
 };
 fetchBrands();
 }, []);

 // Fetch categories
 useEffect(() => {
 const fetchCategories = async () => {
 try {
 const response = await fetch("http://localhost:5221/api/categories");
 const result = await response.json();
 if (result.success) {
 setCategories(result.data || []);
 }
 } catch (err) {
 console.error("Failed to load categories:", err);
 }
 };
 fetchCategories();
 }, []);

 // Fetch watches
 useEffect(() => {
 const fetchWatches = async () => {
 setLoading(true);
 try {
 const params = new URLSearchParams({
 pageNumber: page,
 pageSize: 12,
 ...(search && { searchTerm: search }),
 ...(brandId && { brandId }),
 ...(categoryId && { categoryId }),
 ...(minPrice && { minPrice }),
 ...(maxPrice && { maxPrice }),
 sortBy: sortBy,
 });

 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 const headers = token ? { Authorization: `Bearer ${token}` } : {};

 const response = await fetch(
 `http://localhost:5221/api/watches?${params}`,
 { headers }
 );
 const result = await response.json();

 if (result.success) {
 setWatches(result.data?.items || []);
 setTotalPages(result.data?.totalPages || 1);
 setError("");
 } else {
 setError(result.message || "Failed to load watches");
 }
 } catch (err) {
 setError("Failed to load products");
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 fetchWatches();
 }, [page, search, brandId, categoryId, minPrice, maxPrice, sortBy]);

 const updateFilter = (key, value) => {
 const newParams = new URLSearchParams(searchParams);
 if (value) {
 newParams.set(key, value);
 } else {
 newParams.delete(key);
 }
 // Only reset to page 1 if NOT changing page
 if (key !== "page") {
 newParams.set("page", "1");
 }
 setSearchParams(newParams);
 };

 const handleAddToCart = async (watch) => {
 const result = await addToCart(watch.id, 1);
 if (result.success) {
 addToast(
 language === "vi"
 ? `${watch.name} đã được thêm vào giỏ hàng`
 : `${watch.name} added to cart`,
 "success",
 2000
 );
 } else {
 addToast(result.message, "error");
 if (result.requireLogin) {
 navigate("/login");
 }
 }
 };

 const handleWishlist = (watch) => {
 if (wishlistItems.has(watch.id)) {
 removeFromWishlist(watch.id);
 setWishlistItems((prev) => {
 const newSet = new Set(prev);
 newSet.delete(watch.id);
 return newSet;
 });
 addToast(
 language === "vi"
 ? "Đã xóa khỏi danh sách yêu thích"
 : "Removed from wishlist",
 "success"
 );
 } else {
 const result = addToWishlist(watch);
 if (result.success) {
 setWishlistItems((prev) => new Set(prev).add(watch.id));
 addToast(
 language === "vi"
 ? "Đã thêm vào danh sách yêu thích"
 : "Added to wishlist",
 "success"
 );
 } else {
 addToast(result.message, "error");
 }
 }
 };

 return (
 <div
 className={`min-h-screen transition-colors duration-500 bg-gray-50 text-gray-900`}
 >
 <Header />
 <ToastContainer />

 <main className="max-w-[1800px] mx-auto px-6 lg:px-12 pt-32 pb-20">
 <div className="mb-16">
 <h1
 className={`font-serif text-5xl tracking-tight mb-3 text-gray-900`}
 >
 {language === "vi" ? "Bộ Sưu Tập Đồng Hồ" : "Watch Collections"}
 </h1>
 <div className="w-24 h-1 bg-black"></div>
 </div>

 {/* Filter Drawer */}
 {createPortal(
 <AnimatePresence>
 {isFilterOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setIsFilterOpen(false)}
 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
 />

 {/* Drawer */}
 <motion.div
 initial={{ x: "-100%" }}
 animate={{ x: 0 }}
 exit={{ x: "-100%" }}
 transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
 className={`fixed top-0 left-0 h-full w-full max-w-sm z-50 p-8 overflow-y-auto bg-white shadow-2xl`}
 >
 <div className="flex justify-between items-center mb-10">
 <h2 className="font-serif text-2xl">Bộ Lọc</h2>
 <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors ">
 <Icon icon="mdi:close" className="w-6 h-6" />
 </button>
 </div>

 <div className="space-y-8">
 <div>
 <label
 className={`block text-xs tracking-wider uppercase font-semibold mb-3 text-black`}
 >
 {language === "vi" ? "Tìm Kiếm" : "Search"}
 </label>
 <input
 type="text"
 placeholder={
 language === "vi" ? "Tên đồng hồ..." : "Watch name..."
 }
 value={search}
 onChange={(e) => updateFilter("search", e.target.value)}
 className={`w-full px-4 py-3 border focus:border-black focus:outline-none transition-colors duration-300 bg-white border-gray-300 text-gray-900 placeholder-gray-400`}
 />
 </div>

 <div>
 <label
 className={`block text-xs tracking-wider uppercase font-semibold mb-3 text-black`}
 >
 {language === "vi" ? "Thương Hiệu" : "Brand"}
 </label>
 <select
 value={brandId}
 onChange={(e) => updateFilter("brandId", e.target.value)}
 className={`w-full px-4 py-3 border focus:border-black focus:outline-none transition-colors duration-300 bg-white border-gray-300 text-gray-900`}
 >
 <option value="">
 {language === "vi" ? "Tất cả thương hiệu" : "All brands"}
 </option>
 {brands.map((brand) => (
 <option key={brand.id} value={brand.id}>
 {brand.name}
 </option>
 ))}
 </select>
 </div>

 {/* Category Filter */}
 <div>
 <label
 className={`block text-xs tracking-wider uppercase font-semibold mb-3 text-black`}
 >
 {language === "vi" ? "Danh Mục" : "Category"}
 </label>
 <select
 value={categoryId}
 onChange={(e) => updateFilter("categoryId", e.target.value)}
 className={`w-full px-4 py-3 border focus:border-black focus:outline-none transition-colors duration-300 bg-white border-gray-300 text-gray-900`}
 >
 <option value="">
 {language === "vi" ? "Tất cả danh mục" : "All categories"}
 </option>
 {categories.map((category) => (
 <option key={category.id} value={category.id}>
 {category.name}
 </option>
 ))}
 </select>
 </div>

 <div>
 <label
 className={`block text-xs tracking-wider uppercase font-semibold mb-3 text-black`}
 >
 {language === "vi" ? "Giá Tối Thiểu" : "Min Price"}
 </label>
 <input
 type="number"
 placeholder="0"
 value={minPrice}
 onChange={(e) => updateFilter("minPrice", e.target.value)}
 className={`w-full px-4 py-3 border focus:border-black focus:outline-none transition-colors duration-300 bg-white border-gray-300 text-gray-900 placeholder-gray-400`}
 />
 </div>

 <div>
 <label
 className={`block text-xs tracking-wider uppercase font-semibold mb-3 text-black`}
 >
 {language === "vi" ? "Giá Tối Đa" : "Max Price"}
 </label>
 <input
 type="number"
 placeholder={language === "vi" ? "Không giới hạn" : "No limit"}
 value={maxPrice}
 onChange={(e) => updateFilter("maxPrice", e.target.value)}
 className={`w-full px-4 py-3 border focus:border-black focus:outline-none transition-colors duration-300 bg-white border-gray-300 text-gray-900 placeholder-gray-400`}
 />
 </div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>,
 document.body
 )}

 <div className="mb-12">
 <div className="border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
 <div className="flex items-center gap-4">
 <button
 onClick={() => setIsFilterOpen(true)}
 className={`flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-widest text-xs transition-colors border-2 bg-white border-gray-200 hover:border-black `}
 >
 <Icon icon="mdi:filter-variant" className="w-5 h-5" />
 {language === "vi" ? "Bộ Lọc" : "Filters"}
 </button>
 <span className={`text-sm font-medium whitespace-nowrap text-black`}>
 {watches.length} {language === "vi" ? "sản phẩm" : "products"}
 </span>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <span className={`text-sm font-semibold mr-2 text-black`}>
 {language === "vi" ? "Sắp xếp theo:" : "Sort by:"}
 </span>
 {[
 { id: "latest", labelVi: "Nổi bật", labelEn: "Featured" },
 { id: "best-selling", labelVi: "Bán chạy", labelEn: "Best Selling" },
 { id: "newest", labelVi: "Mới", labelEn: "Newest" },
 { id: "price-asc", labelVi: "Giá thấp - cao", labelEn: "Price Low-High" },
 { id: "price-desc", labelVi: "Giá cao - thấp", labelEn: "Price High-Low" },
 ].map((opt) => (
 <button
 key={opt.id}
 onClick={() => updateFilter("sortBy", opt.id)}
 className={`px-4 py-2 text-sm font-medium rounded transition-all duration-300 ${
 sortBy === opt.id || (!sortBy && opt.id === "latest")
 ? "bg-black text-white shadow-md shadow-black/10"
 : "bg-white text-black hover:bg-gray-100 border border-gray-200"
 }`}
 >
 {language === "vi" ? opt.labelVi : opt.labelEn}
 </button>
 ))}
 </div>
 </div>
 </div>

 {error && (
 <div className="mb-12 p-6 bg-red-900/20 border border-red-500/50 text-red-400">
 {error}
 </div>
 )}

 {loading ? (
 <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20">
 {Array(12)
 .fill(0)
 .map((_, i) => (
 <Skeleton key={i} type="card" />
 ))}
 </div>
 ) : watches.length === 0 ? (
 <div className="text-center py-32">
 <Icon
 icon="mdi:watch-variant-outline"
 className={`w-20 h-20 mx-auto mb-6 text-black`}
 />
 <p
 className={`text-lg font-medium text-black`}
 >
 {language === "vi"
 ? "Không tìm thấy sản phẩm"
 : "No products found"}
 </p>
 <p
 className={`text-sm mt-2 text-black`}
 >
 {language === "vi"
 ? "Vui lòng điều chỉnh bộ lọc tìm kiếm"
 : "Please adjust your search filters"}
 </p>
 </div>
 ) : (
 <>
 <motion.div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-20"
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 transition={{ duration: 0.5 }}
 >
 {watches.map((watch, index) => (
 <motion.div
 key={watch.id}
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: index * 0.05 }}
 >
 <Link
 to={`/products/${watch.id}`}
 className="group block"
 >
 <div
 className={`relative aspect-[3/4] overflow-hidden mb-6 bg-gray-100`}
 >
 {watch.images && watch.images.length > 0 ? (
 <img
 src={watch.images[0].imageUrl}
 alt={watch.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />
 ) : (
 <div className="w-full h-full flex items-center justify-center">
 <Icon
 icon="mdi:watch-variant-outline"
 className={`w-16 h-16 text-black`}
 />
 </div>
 )}

 {watch.status === "Limited" && (
 <div className="absolute top-4 left-4 px-4 py-2 bg-black text-white text-xs tracking-wider uppercase font-semibold shadow-lg">
 {language === "vi"
 ? "Số Lượng Có Hạn"
 : "Limited Edition"}
 </div>
 )}
 </div>

 <div className="space-y-3">
 <p className={`text-black font-medium text-xs tracking-widest uppercase font-semibold`}>
 {watch.brandName} <span className={`text-black mx-1`}>|</span> <span className={"text-black"}>{watch.categoryName}</span>
 </p>
 <h3
 className={`font-serif text-xl leading-tight group-hover:text-black font-medium transition-colors duration-300 text-gray-900`}
 >
 {watch.name}
 </h3>

 <div
 className={`flex items-center gap-2 text-xs text-black`}
 >
 {watch.caseSize && (
 <>
 <span>{watch.caseSize}</span>
 <span>•</span>
 </>
 )}
 <span>{watch.waterResistance}</span>
 </div>

 <div
 className={`flex items-center justify-between pt-3 border-t gap-2 border-gray-200`}
 >
 <p
 className={`text-lg font-semibold text-gray-900`}
 >
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(watch.price)}
 </p>
 <div className="flex gap-2">
 <button
 onClick={(e) => {
 e.preventDefault();
 handleAddToCart(watch);
 }}
 className={`p-3 border-2 border-black text-black font-medium hover:bg-black hover:text-white transition-all duration-300`}
 title={
 language === "vi"
 ? "Thêm vào giỏ hàng"
 : "Add to Cart"
 }
 >
 <Icon icon="mdi:cart-outline" className="w-5 h-5" />
 </button>
 <button
 onClick={(e) => {
 e.preventDefault();
 handleWishlist(watch);
 }}
 className={`p-3 border-2 transition-all duration-300 ${
 wishlistItems.has(watch.id)
 ? "bg-red-600 border-red-600 text-white"
 : `border-gray-300 text-black hover:border-gray-400`
 }`}
 title={language === "vi" ? "Yêu thích" : "Wishlist"}
 >
 <Icon
 icon={
 wishlistItems.has(watch.id)
 ? "mdi:heart"
 : "mdi:heart-outline"
 }
 className="w-5 h-5"
 />
 </button>
 </div>
 </div>
 </div>
 </Link>
 </motion.div>
 ))}
 </motion.div>

 {/* Pagination */}
 {totalPages > 1 && (
 <div className="flex justify-center items-center gap-2 mt-12">
 {/* Previous Button */}
 <button
 onClick={() => updateFilter("page", String(page - 1))}
 disabled={page === 1}
 className={`w-10 h-10 border-2 font-semibold transition-all duration-300 flex items-center justify-center ${
 page === 1 ? "opacity-50 cursor-not-allowed" : ""
 } border-gray-300 ${"text-black"} hover:border-black hover:text-black font-medium`}
 >
 <Icon icon="solar:alt-arrow-left-bold" />
 </button>

 {/* Page Numbers */}
 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
 let pageNum;
 if (totalPages <= 5) {
 pageNum = i + 1;
 } else if (page <= 3) {
 pageNum = i + 1;
 } else if (page >= totalPages - 2) {
 pageNum = totalPages - 4 + i;
 } else {
 pageNum = page - 2 + i;
 }
 return (
 <button
 key={pageNum}
 onClick={() => updateFilter("page", String(pageNum))}
 className={`w-12 h-12 border-2 font-semibold transition-all duration-300 ${
 page === pageNum
 ? "bg-black border-black text-white"
 : "border-gray-300 text-black hover:border-black hover:text-black font-medium"
 }`}
 >
 {pageNum}
 </button>
 );
 })}

 {/* Next Button */}
 <button
 onClick={() => updateFilter("page", String(page + 1))}
 disabled={page === totalPages}
 className={`w-10 h-10 border-2 font-semibold transition-all duration-300 flex items-center justify-center ${
 page === totalPages ? "opacity-50 cursor-not-allowed" : ""
 } border-gray-300 ${"text-black"} hover:border-black hover:text-black font-medium`}
 >
 <Icon icon="solar:alt-arrow-right-bold" />
 </button>
 </div>
 )}
 </>
 )}
 </main>
 </div>
 );
}
