import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Cart() {
 const navigate = useNavigate();
 const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } =
 useCart();
 const { addToast } = useToast();

 const handleCheckout = () => {
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) {
 navigate("/login?redirect=/checkout");
 } else {
 navigate("/checkout");
 }
 };

 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />
 <ToastContainer />

 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
 <h1
 className={`text-4xl font-light tracking-tight mb-8 text-black`}
 >
 Giá» hÃ ng
 </h1>

 {cartItems.length === 0 ? (
 <div
 className={`text-center py-16 rounded-lg border bg-white border-black/5`}
 >
 <Icon
 icon="teenyicons:cart-outline"
 width={48}
 className="mx-auto mb-4 opacity-50"
 />
 <p
 className={`text-lg mb-6 text-black`}
 >
 Giá» hÃ ng cá»§a báº¡n trá»‘ng
 </p>
 <button
 onClick={() => navigate("/products")}
 className={`px-6 py-3 rounded-lg transition bg-black hover:bg-neutral-800 text-white`}
 >
 Tiáº¿p tá»¥c mua sáº¯m
 </button>
 </div>
 ) : (
 <div className="grid lg:grid-cols-3 gap-8">
 {/* Cart Items */}
 <div className="lg:col-span-2 space-y-4">
 {cartItems.map((item) => (
 <div
 key={item.id}
 className={`flex gap-4 p-4 rounded-lg border bg-white border-black/5`}
 >
 {/* Image */}
 {item.watchImageUrl ? (
 <img
 src={item.watchImageUrl}
 alt={item.watchName}
 className="w-24 h-24 object-cover rounded-lg"
 />
 ) : (
 <div
 className={`w-24 h-24 rounded-lg flex items-center justify-center bg-gray-100`}
 >
 <Icon icon="teenyicons:image-outline" width={32} />
 </div>
 )}

 {/* Info */}
 <div className="flex-1 min-w-0">
 <h3
 className={`font-semibold line-clamp-1 text-black`}
 >
 {item.watchName}
 </h3>
 <p
 className={`text-sm text-black`}
 >
 {item.brandName}
 </p>
 <p className={`text-lg font-semibold text-black font-medium mt-2`}>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(item.unitPrice)}
 </p>
 </div>

 {/* Quantity */}
 <div className="flex items-center gap-2">
 <button
 onClick={() =>
 updateQuantity(item.id, Math.max(1, item.quantity - 1))
 }
 className={`w-8 h-8 rounded flex items-center justify-center transition bg-gray-100 hover:bg-gray-200`}
 >
 <Icon icon="mdi:minus" width={16} />
 </button>
 <span className="w-8 text-center">{item.quantity}</span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 className={`w-8 h-8 rounded flex items-center justify-center transition bg-gray-100 hover:bg-gray-200`}
 >
 <Icon icon="mdi:plus" width={16} />
 </button>
 </div>

 {/* Remove */}
 <button
 onClick={() => {
 removeFromCart(item.id);
 addToast(
 `${item.watchName} Ä‘Ã£ Ä‘Æ°á»£c xÃ³a khá»i giá» hÃ ng`,
 "info",
 2000
 );
 }}
 className={`w-8 h-8 rounded flex items-center justify-center transition text-red-600 hover:bg-red-100`}
 >
 <Icon icon="mdi:trash-can-outline" width={16} />
 </button>
 </div>
 ))}
 </div>

 {/* Summary */}
 <div
 className={`rounded-lg border p-6 h-fit bg-white border-black/5`}
 >
 <h2
 className={`text-xl font-semibold mb-4 text-black`}
 >
 TÃ³m táº¯t
 </h2>

 <div
 className={`space-y-3 pb-4 border-b border-black/5`}
 >
 <div className="flex justify-between">
 <span className={"text-black"}>
 Sá»‘ sáº£n pháº©m:
 </span>
 <span>{getTotalItems()}</span>
 </div>
 <div className="flex justify-between">
 <span className={"text-black"}>
 Tiá»n hÃ ng:
 </span>
 <span>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(getTotalPrice())}
 </span>
 </div>
 <div className="flex justify-between">
 <span className={"text-black"}>
 PhÃ­ váº­n chuyá»ƒn:
 </span>
 <span className={`text-black font-medium`}>Miá»…n phÃ­</span>
 </div>
 </div>

 <div className="flex justify-between pt-4 mb-6 text-lg font-semibold">
 <span>Tá»•ng cá»™ng:</span>
 <span className={`text-black font-medium`}>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(getTotalPrice())}
 </span>
 </div>

 <button
 onClick={handleCheckout}
 className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition font-semibold bg-black hover:bg-neutral-800 text-white`}
 >
 <Icon icon="teenyicons:arrow-right-outline" width={16} />
 Thanh toÃ¡n
 </button>

 <button
 onClick={() => navigate("/products")}
 className={`w-full mt-2 py-3 rounded-lg transition bg-gray-100 hover:bg-gray-200 text-black`}
 >
 Tiáº¿p tá»¥c mua sáº¯m
 </button>
 </div>
 </div>
 )}
 </main>
 </div>
 );
}


