import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export default function MyWatchBox({}) {
 const [watches, setWatches] = useState([]);
 const [loading, setLoading] = useState(true);
 const navigate = useNavigate();

 useEffect(() => {
 fetchMyWatches();
 }, []);

 const fetchMyWatches = async () => {
 try {
 const token = localStorage.getItem("token") || sessionStorage.getItem("token");
 // Fetch all delivered orders to extract watches
 const response = await fetch("http://localhost:5221/api/orders/my-orders?pageSize=100", {
 headers: { Authorization: `Bearer ${token}` },
 });
 const result = await response.json();
 if (result.success) {
 const deliveredOrders = result.data.items.filter(o => o.status === 4); // 4 = Delivered
 const uniqueWatchesMap = new Map();

 deliveredOrders.forEach(order => {
 if (order.orderItems) {
 order.orderItems.forEach(item => {
 if (!uniqueWatchesMap.has(item.watchId)) {
 uniqueWatchesMap.set(item.watchId, {
 id: item.watchId,
 name: item.watchName,
 imageUrl: item.imageUrl || null, // Assuming imageUrl might be available, otherwise we use placeholder
 purchaseDate: order.createdAt
 });
 }
 });
 }
 });

 setWatches(Array.from(uniqueWatchesMap.values()));
 }
 } catch (err) {
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 if (loading) return <div>Đang tải bộ sưu tập...</div>;

 return (
 <div className={`rounded-lg p-8 border bg-white border-black/5`}>
 <h2 className={`text-2xl font-semibold mb-2 text-black`}>Bộ sưu tập của tôi (My Watch Box)</h2>
 <p className={`text-sm mb-8 text-neutral-500`}>Những chiếc đồng hồ sang trọng bạn đã sở hữu từ Watchstore.</p>

 {watches.length === 0 ? (
 <div className="text-center py-16">
 <Icon icon="teenyicons:box-outline" width={48} className={`mx-auto mb-4 text-neutral-300`} />
 <p className={`text-neutral-500 mb-6`}>Bộ sưu tập của bạn hiện đang trống.</p>
 <button
 onClick={() => navigate("/products")}
 className={`px-6 py-3 rounded-lg font-medium transition bg-black text-white hover:bg-neutral-800`}
 >
 Khám phá bộ sưu tập mới
 </button>
 </div>
 ) : (
 <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
 {watches.map(watch => (
 <div key={watch.id} onClick={() => navigate(`/product/${watch.id}`)}
 className={`group cursor-pointer rounded-xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-xl bg-neutral-50 border-black/5 hover:border-black/20`}
 >
 <div className={`aspect-square flex items-center justify-center p-6 bg-white`}>
 {watch.imageUrl ? (
 <img src={watch.imageUrl} alt={watch.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
 ) : (
 <Icon icon="teenyicons:watch-outline" width={64} className={`opacity-20 group-hover:scale-110 transition-transform duration-500 text-black`} />
 )}
 </div>
 <div className={`p-4 border-t bg-neutral-50 border-black/5`}>
 <h3 className={`font-medium truncate text-black`}>{watch.name}</h3>
 <p className={`text-xs mt-1 text-neutral-500`}>Sở hữu từ: {new Date(watch.purchaseDate).toLocaleDateString("vi-VN")}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 );
}
