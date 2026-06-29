import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

// OrderStatus enum mapping: 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled
const statusColors = {
 1: "bg-gray-100 text-gray-900",
 2: "bg-blue-100 text-blue-700",
 3: "bg-purple-100 text-purple-700",
 4: "bg-green-100 text-green-700",
 5: "bg-red-100 text-red-700",
};

const statusLabels = {
 1: "Chờ xác nhận",
 2: "Đang xử lý",
 3: "Đang giao",
 4: "Đã giao",
 5: "Đã hủy",
};

export default function Orders() {
 const [orders, setOrders] = useState([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const navigate = useNavigate();

 useEffect(() => {
 // Check if user is logged in
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) {
 navigate("/login?redirect=/orders");
 return;
 }

 fetchOrders(token);
 }, [navigate]);

 const fetchOrders = async (token) => {
 setLoading(true);
 try {
 const response = await fetch(
 "http://localhost:5221/api/orders/my-orders?pageSize=100",
 {
 headers: {
 Authorization: `Bearer ${token}`,
 },
 }
 );
 const result = await response.json();
 if (result.success) {
 setOrders(result.data?.items || []);
 setError("");
 } else {
 setError(result.message || "Không thể tải đơn hàng");
 }
 } catch (err) {
 setError("Không thể tải đơn hàng");
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 const handleCancel = async (orderId) => {
 if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;

 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 try {
 const response = await fetch(
 `http://localhost:5221/api/orders/${orderId}/cancel`,
 {
 method: "POST",
 headers: {
 Authorization: `Bearer ${token}`,
 },
 }
 );
 const result = await response.json();
 if (result.success) {
 // Refresh orders
 fetchOrders(token);
 } else {
 alert(result.message || "Không thể hủy đơn hàng");
 }
 } catch (err) {
 alert("Có lỗi xảy ra");
 }
 };

 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />

 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
 <h1
 className={`text-4xl font-light tracking-tight mb-8 text-black`}
 >
 Đơn hàng của tôi
 </h1>

 {error && (
 <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
 {error}
 </div>
 )}

 {loading ? (
 <div className="text-center py-12">
 <p className={"text-black"}>
 Đang tải...
 </p>
 </div>
 ) : orders.length === 0 ? (
 <div
 className={`text-center py-16 rounded-lg border bg-white border-black/5`}
 >
 <Icon
 icon="teenyicons:box-outline"
 width={48}
 className="mx-auto mb-4 opacity-50"
 />
 <p
 className={`text-lg mb-6 text-black`}
 >
 Bạn chưa có đơn hàng nào
 </p>
 <button
 onClick={() => navigate("/products")}
 className={`px-6 py-3 rounded-lg transition bg-black hover:bg-neutral-800 text-white`}
 >
 Tiếp tục mua sắm
 </button>
 </div>
 ) : (
 <div className="space-y-4">
 {orders.map((order) => (
 <div
 key={order.id}
 className={`rounded-lg border p-6 bg-white border-black/5`}
 >
 <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
 <div>
 <h3
 className={`text-lg font-semibold text-black`}
 >
 Đơn hàng #{order.id}
 </h3>
 <p
 className={`text-sm mt-1 text-black`}
 >
 {new Date(order.createdAt).toLocaleDateString("vi-VN")}
 </p>
 </div>
 </div>
 {/* Order Stepper Timeline */}
 {order.status !== 5 ? (
 <div className="mb-6 pt-4 pb-2">
 <div className="relative flex items-center justify-between w-full">
 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-neutral-200 rounded-full"></div>
 <div
 className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black rounded-full transition-all duration-500 ease-in-out"
 style={{
 width: `${((Math.min(order.status, 4) - 1) / 3) * 100}%`,
 }}
 ></div>

 {[
 { step: 1, label: "Chờ xác nhận", icon: "teenyicons:clipboard-outline" },
 { step: 2, label: "Đang xử lý", icon: "teenyicons:box-outline" },
 { step: 3, label: "Đang giao", icon: "lucide:truck" },
 { step: 4, label: "Đã giao", icon: "teenyicons:tick-circle-outline" },
 ].map((s) => {
 const isCompleted = order.status >= s.step;
 const isCurrent = order.status === s.step;

 return (
 <div key={s.step} className="relative z-10 flex flex-col items-center group">
 <div
 className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-300 ${
 isCompleted
 ? "bg-black border-black text-white "
 : "bg-white border-neutral-300 text-neutral-400 "
 }`}
 >
 <Icon icon={s.icon} width={20} />
 {isCurrent && (
 <span className="absolute w-10 h-10 rounded-full border-2 border-black animate-ping opacity-20"></span>
 )}
 </div>
 <span
 className={`absolute -bottom-6 w-max text-xs md:text-sm font-medium transition-colors ${
 isCompleted
 ? "text-black "
 : "text-neutral-400 "
 }`}
 >
 {s.label}
 </span>
 </div>
 );
 })}
 </div>
 </div>
 ) : (
 <div className="mb-6 pt-2 pb-2">
 <div className="p-3 bg-red-50 /10 border border-red-100 /30 rounded-lg flex items-center gap-3 text-red-600 ">
 <Icon icon="teenyicons:x-circle-outline" width={24} />
 <div>
 <p className="font-semibold">Đơn hàng đã hủy</p>
 <p className="text-sm opacity-80">Rất tiếc, đơn hàng này đã bị hủy.</p>
 </div>
 </div>
 </div>
 )}

 {/* Items */}
 <div className="mb-4 pb-4 border-b border-neutral-200 /10 mt-8">
 <div className="space-y-3">
 {order.orderItems &&
 order.orderItems.map((item) => (
 <div
 key={item.id}
 className="flex justify-between text-sm items-center"
 >
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 bg-neutral-100 rounded-md flex items-center justify-center overflow-hidden">
 <Icon icon="teenyicons:watch-outline" width={24} className="opacity-50" />
 </div>
 <span className={"text-black font-medium"}>
 {item.watchName} <span className="text-neutral-500 font-normal">x{item.quantity}</span>
 </span>
 </div>
 <span className={`text-black font-medium`}>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(item.subtotal)}
 </span>
 </div>
 ))}
 </div>
 </div>

 {/* Summary */}
 <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
 <div className="space-y-1">
 <p className={`text-sm text-neutral-600`}>
 <span className="font-medium mr-2">Địa chỉ giao hàng:</span> {order.shippingAddress}
 </p>
 {order.notes && (
 <p className={`text-sm text-neutral-600`}>
 <span className="font-medium mr-2">Ghi chú:</span> {order.notes}
 </p>
 )}
 </div>
 <div className="flex items-center gap-6">
 <div className="text-right">
 <p className={`text-xs uppercase tracking-wider mb-1 text-neutral-500`}>
 Tổng thanh toán
 </p>
 <p className={`text-2xl font-bold text-black`}>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(order.totalAmount)}
 </p>
 </div>
 <div className="flex flex-col sm:flex-row items-center gap-2">
 <Link
 to={`/orders/${order.id}`}
 className={`px-5 py-2.5 rounded-lg text-sm font-medium transition bg-black/5 text-black hover:bg-black/10 border border-black/10`}
 >
 Xem chi tiết
 </Link>
 {order.status === 1 && (
 <button
 onClick={() => handleCancel(order.id)}
 className={`px-5 py-2.5 rounded-lg text-sm font-medium transition bg-white border border-red-200 text-red-600 hover:bg-red-50`}
 >
 Hủy đơn
 </button>
 )}
 </div>
 </div>
 </div>
 </div>
 ))}
 </div>
 )}
 </main>
 </div>
 );
}
