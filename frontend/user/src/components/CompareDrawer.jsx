import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useCompare } from "../contexts/CompareContext";

export default function CompareDrawer({ isOpen, onClose, language }) {
 const { compareList, removeFromCompare, clearCompare } = useCompare();

 const formatPrice = (price) => {
 return new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(price);
 };

 const attributes = [
 { key: "brandName", label: language === "vi" ? "Thương hiệu" : "Brand" },
 { key: "categoryName", label: language === "vi" ? "Danh mục" : "Category" },
 { key: "movement", label: language === "vi" ? "Loại máy" : "Movement" },
 { key: "caseSize", label: language === "vi" ? "Kích thước" : "Case Size" },
 { key: "caseMaterial", label: language === "vi" ? "Chất liệu vỏ" : "Case Material" },
 { key: "crystal", label: language === "vi" ? "Mặt kính" : "Crystal" },
 { key: "waterResistance", label: language === "vi" ? "Chống nước" : "Water Res" },
 ];

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

 {/* Drawer (Bottom up or right to left, let's use bottom-up for compare) */}
 <motion.div
 initial={{ y: "100%" }}
 animate={{ y: 0 }}
 exit={{ y: "100%" }}
 transition={{ type: "tween", duration: 0.4, ease: "easeInOut" }}
 className={`fixed bottom-0 left-0 w-full h-[80vh] shadow-2xl z-[70] flex flex-col bg-white`}
 >
 {/* Header */}
 <div className={`flex items-center justify-between p-6 border-b border-gray-100`}>
 <div className="flex items-center gap-4">
 <h2 className={`font-serif text-2xl text-gray-900`}>
 {language === "vi" ? "So sánh sản phẩm" : "Compare Products"}
 </h2>
 {compareList.length > 0 && (
 <button
 onClick={clearCompare}
 className="text-sm text-red-500 hover:text-red-600 transition-colors underline"
 >
 {language === "vi" ? "Xóa tất cả" : "Clear all"}
 </button>
 )}
 </div>
 <button
 onClick={onClose}
 className={`p-2 hover:bg-gray-100 rounded-full transition-colors text-black`}
 >
 <Icon icon="mdi:close" className="w-6 h-6" />
 </button>
 </div>

 {/* Compare Content */}
 <div className="flex-1 overflow-auto p-6">
 {compareList.length === 0 ? (
 <div className="h-full flex flex-col items-center justify-center space-y-4">
 <Icon icon="mdi:scale-balance" className={`w-16 h-16 text-gray-400`} />
 <p className={`font-light text-gray-500`}>
 {language === "vi" ? "Chưa có sản phẩm nào để so sánh" : "No products to compare"}
 </p>
 <button
 onClick={onClose}
 className={`mt-4 px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors uppercase text-xs tracking-widest`}
 >
 {language === "vi" ? "Khám phá ngay" : "Explore now"}
 </button>
 </div>
 ) : (
 <div className="flex gap-6 min-w-max pb-8">
 {/* Cột tiêu đề thuộc tính (Cố định) */}
 <div className="w-48 flex flex-col mt-[240px] shrink-0 border-r border-gray-200 ">
 {attributes.map((attr, idx) => (
 <div key={idx} className={`h-16 flex items-center border-b border-gray-100 text-gray-500 text-sm font-medium`}>
 {attr.label}
 </div>
 ))}
 </div>

 {/* Cột sản phẩm */}
 {compareList.map((product) => (
 <div key={product.id} className="w-64 flex flex-col shrink-0">
 {/* Product Header */}
 <div className="h-[240px] flex flex-col items-center p-4 relative group border border-gray-200 rounded-lg mb-4">
 <button
 onClick={() => removeFromCompare(product.id)}
 className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
 >
 <Icon icon="mdi:close" />
 </button>
 <img src={product.imageUrl || "https://placehold.co/150x150/f5f5f5/a3a3a3"} alt={product.name} className="h-32 object-contain mb-4" />
 <Link to={`/products/${product.id}`} onClick={onClose} className={`text-sm font-medium text-center line-clamp-2 hover:underline text-black`}>
 {product.name}
 </Link>
 <p className="font-semibold mt-2 text-red-600">{formatPrice(product.price)}</p>
 </div>

 {/* Product Attributes */}
 {attributes.map((attr, idx) => (
 <div key={idx} className={`h-16 flex items-center justify-center text-center px-2 border-b border-gray-100 text-black text-sm`}>
 {product[attr.key] || "-"}
 </div>
 ))}
 </div>
 ))}

 {/* Empty Slot (nếu < 3 sp) */}
 {Array.from({ length: 3 - compareList.length }).map((_, idx) => (
 <div key={`empty-${idx}`} className="w-64 shrink-0 flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg">
 <div className="text-center text-gray-400">
 <Icon icon="mdi:plus" className="w-12 h-12 mx-auto mb-2 opacity-50" />
 <p className="text-sm">
 {language === "vi" ? "Thêm sản phẩm" : "Add product"}
 </p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );

 return createPortal(drawerContent, document.body);
}
