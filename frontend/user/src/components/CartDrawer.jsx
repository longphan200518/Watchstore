import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../contexts/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
 const { cartItems, updateQuantity, removeFromCart, getTotalPrice } = useCart();
 const navigate = useNavigate();

 const handleCheckout = () => {
 onClose();
 navigate("/checkout");
 };

 const formatPrice = (price) => {
 return new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(price);
 };

 const drawerContent = (
 <AnimatePresence>
 {isOpen && (
 <>
 {/* Backdrop */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.3 }}
 className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
 onClick={onClose}
 />

 {/* Drawer */}
 <motion.div
 initial={{ x: "100%" }}
 animate={{ x: 0 }}
 exit={{ x: "100%" }}
 transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
 className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] flex flex-col"
 >
 {/* Header */}
 <div className="flex items-center justify-between p-6 border-b border-gray-100">
 <h2 className="font-serif text-2xl text-gray-900">Giỏ hàng</h2>
 <button
 onClick={onClose}
 className="p-2 hover:bg-gray-100 rounded-full transition-colors"
 >
 <Icon icon="mdi:close" className={`w-6 h-6 text-black`} />
 </button>
 </div>

 {/* Cart Items */}
 <div className="flex-1 overflow-y-auto p-6 space-y-6">
 {cartItems?.length === 0 ? (
 <div className={`h-full flex flex-col items-center justify-center text-black space-y-4`}>
 <Icon icon="mdi:cart-outline" className="w-16 h-16" />
 <p className="font-light">Giỏ hàng của bạn đang trống</p>
 <button
 onClick={() => {
 onClose();
 navigate("/products");
 }}
 className="mt-4 px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors uppercase text-xs tracking-widest"
 >
 Tiếp tục mua sắm
 </button>
 </div>
 ) : (
 cartItems?.map((item) => (
 <motion.div
 key={item.id}
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="flex gap-4 items-center bg-gray-50 p-3"
 >
 <img
 src={item.watchImageUrl || "https://placehold.co/150x150/f5f5f5/a3a3a3?text=No+Image"}
 alt={item.watchName}
 className="w-20 h-24 object-cover"
 />
 <div className="flex-1">
 <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
 {item.watchName}
 </h3>
 <p className={`text-black font-medium font-semibold text-sm mt-1`}>
 {formatPrice(item.unitPrice)}
 </p>
 <div className="flex items-center justify-between mt-3">
 {/* Quantity Control */}
 <div className="flex items-center border border-gray-300">
 <button
 onClick={() => updateQuantity(item.id, item.quantity - 1)}
 className={`px-2 py-1 text-black hover:text-black transition-colors`}
 >
 <Icon icon="mdi:minus" />
 </button>
 <span className="px-3 py-1 text-sm text-gray-900 font-medium">
 {item.quantity}
 </span>
 <button
 onClick={() => updateQuantity(item.id, item.quantity + 1)}
 className={`px-2 py-1 text-black hover:text-black transition-colors`}
 >
 <Icon icon="mdi:plus" />
 </button>
 </div>
 {/* Remove Button */}
 <button
 onClick={() => removeFromCart(item.id)}
 className={`text-black hover:text-red-500 transition-colors`}
 title="Xóa"
 >
 <Icon icon="mdi:trash-can-outline" className="w-5 h-5" />
 </button>
 </div>
 </div>
 </motion.div>
 ))
 )}
 </div>

 {/* Footer */}
 {cartItems?.length > 0 && (
 <div className="border-t border-gray-100 p-6 bg-white space-y-4">
 <div className="flex justify-between items-end">
 <span className={`text-sm text-black uppercase tracking-wider`}>Tổng cộng</span>
 <span className="font-serif text-2xl text-gray-900">
 {formatPrice(getTotalPrice())}
 </span>
 </div>
 <p className={`text-xs text-black font-light text-center`}>
 Phí vận chuyển và thuế sẽ được tính khi thanh toán
 </p>
 <button
 onClick={handleCheckout}
 className="w-full py-4 bg-black text-white hover:bg-gray-900 transition-colors uppercase tracking-[0.2em] text-sm font-medium flex items-center justify-center gap-2"
 >
 <Icon icon="solar:lock-bold-duotone" className={`w-5 h-5 text-black`} />
 Tiến hành thanh toán
 </button>
 </div>
 )}
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );

 return createPortal(drawerContent, document.body);
}
