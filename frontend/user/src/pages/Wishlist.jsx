import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Wishlist() {
 const [language, setLanguage] = useState("vi");
 const navigate = useNavigate();
 // API mới: item = { watchId, watchName, price, imageUrl, brandName, addedAt }
 const { wishlist, removeFromWishlist, getTotalWishlist, loading } = useWishlist();
 const { addToCart } = useCart();
 const { addToast } = useToast();

 useEffect(() => {
 const savedLang = localStorage.getItem("language") || "vi";
 setLanguage(savedLang);
 }, []);

 const handleAddToCart = async (item) => {
 const result = await addToCart(item.watchId, 1);
 if (result.success) {
 addToast(
 language === "vi"
 ? `${item.watchName} đã được thêm vào giỏ hàng`
 : `${item.watchName} added to cart`,
 "success",
 2000
 );
 } else {
 addToast(result.message, "error");
 if (result.requireLogin) navigate("/login");
 }
 };

 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />
 <ToastContainer />

 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 pt-32">
 <h1
 className={`text-4xl font-light tracking-tight mb-8 text-black`}
 >
 {language === "vi" ? "❤️ Danh Sách Yêu Thích" : "❤️ Wishlist"}
 </h1>

 {loading ? (
 <div className="flex items-center justify-center py-24">
 <div className="w-10 h-10 rounded-full border-2 border-current border-t-transparent animate-spin opacity-40" />
 </div>
 ) : wishlist.length === 0 ? (
 <div
 className={`text-center py-16 rounded-lg border bg-white border-black/5`}
 >
 <Icon
 icon="teenyicons:heart-outline"
 width={48}
 className="mx-auto mb-4 opacity-50"
 />
 <p className={`text-lg mb-6 text-black`}>
 {language === "vi"
 ? "Danh sách yêu thích của bạn trống"
 : "Your wishlist is empty"}
 </p>
 <button
 onClick={() => navigate("/products")}
 className={`px-6 py-3 rounded-lg transition bg-black hover:bg-neutral-800 text-white`}
 >
 {language === "vi" ? "Khám phá sản phẩm" : "Explore Products"}
 </button>
 </div>
 ) : (
 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
 {wishlist.map((item) => (
 <div
 key={item.watchId}
 className={`rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300 group bg-white border-black/5`}
 >
 {/* Image */}
 <div className="relative overflow-hidden bg-gray-100 h-64">
 {item.imageUrl ? (
 <img
 src={item.imageUrl}
 alt={item.watchName}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
 onClick={() => navigate(`/products/${item.watchId}`)}
 />
 ) : (
 <div
 className="w-full h-full flex items-center justify-center cursor-pointer"
 onClick={() => navigate(`/products/${item.watchId}`)}
 >
 <Icon icon="teenyicons:watch-outline" width={48} className="opacity-30" />
 </div>
 )}
 {/* Remove button */}
 <button
 onClick={() => removeFromWishlist(item.watchId)}
 className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
 >
 <Icon icon="mdi:heart-fill" className="w-5 h-5" />
 </button>
 </div>

 {/* Info */}
 <div className="p-4">
 <p className={`text-xs mb-2 text-neutral-500`}>
 {item.brandName}
 </p>
 <h3
 className={`font-semibold line-clamp-2 mb-3 cursor-pointer hover:opacity-70 transition-opacity text-black`}
 onClick={() => navigate(`/products/${item.watchId}`)}
 >
 {item.watchName}
 </h3>

 <div className="flex items-center justify-between mb-4">
 <span className={`text-2xl font-bold text-black`}>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(item.price || 0)}
 </span>
 </div>

 <div className="space-y-2">
 <button
 onClick={() => navigate(`/products/${item.watchId}`)}
 className={`w-full py-2 rounded-lg transition-colors text-sm bg-gray-100 hover:bg-gray-200 text-black`}
 >
 {language === "vi" ? "Xem Chi Tiết" : "View Details"}
 </button>
 <button
 onClick={() => handleAddToCart(item)}
 className={`w-full py-2 rounded-lg transition-colors font-semibold text-sm bg-black hover:bg-neutral-800 text-white`}
 >
 {language === "vi" ? "➕ Thêm vào giỏ" : "➕ Add to Cart"}
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 <div
 className={`mt-12 p-6 rounded-lg border bg-white border-black/5`}
 >
 <p className={`text-sm text-black`}>
 {language === "vi"
 ? `Bạn có ${getTotalWishlist()} sản phẩm trong danh sách yêu thích`
 : `You have ${getTotalWishlist()} items in your wishlist`}
 </p>
 </div>
 </main>
 </div>
 );
}
