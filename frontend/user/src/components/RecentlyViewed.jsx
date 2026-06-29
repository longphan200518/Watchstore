import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function RecentlyViewed({ language }) {
 const [recentlyViewed, setRecentlyViewed] = useState([]);

 useEffect(() => {
 const loadRecentlyViewed = () => {
 try {
 const stored = localStorage.getItem("recentlyViewed");
 if (stored) {
 setRecentlyViewed(JSON.parse(stored));
 }
 } catch (e) {
 console.error("Lỗi parse recentlyViewed", e);
 }
 };
 loadRecentlyViewed();
 }, []);

 if (recentlyViewed.length === 0) return null;

 return (
 <section className={`py-16 bg-white`}>
 <div className="max-w-[1800px] mx-auto px-6 lg:px-12">
 <div className="text-center mb-12">
 <h2 className={`font-serif text-3xl font-light text-gray-900`}>
 {language === "vi" ? "Sản Phẩm Đã Xem" : "Recently Viewed"}
 </h2>
 </div>

 <div className="flex overflow-x-auto gap-6 pb-4 hide-scrollbar">
 {recentlyViewed.map((item) => (
 <Link
 key={item.id}
 to={`/products/${item.id}`}
 className={`group min-w-[200px] sm:min-w-[250px] flex-shrink-0 border border-gray-200 p-4 transition-all duration-300 hover:border-black `}
 >
 <div className="aspect-square overflow-hidden mb-4 bg-gray-50 ">
 <img
 src={item.imageUrl || "https://placehold.co/300x300"}
 alt={item.name}
 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
 />
 </div>
 <div className="text-center">
 <h3 className={`text-sm font-medium line-clamp-2 mb-2 text-black`}>
 {item.name}
 </h3>
 <p className={`text-sm font-semibold text-gray-900`}>
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
 );
}
