import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

const statusLabels = {
 1: "Chờ xác nhận",
 2: "Đang xử lý",
 3: "Đang giao",
 4: "Đã giao",
 5: "Đã hủy",
};

const steps = [
 { step: 1, label: "Chờ xác nhận", icon: "teenyicons:clipboard-outline" },
 { step: 2, label: "Đang xử lý", icon: "teenyicons:box-outline" },
 { step: 3, label: "Đang giao", icon: "lucide:truck" },
 { step: 4, label: "Đã giao", icon: "teenyicons:tick-circle-outline" },
];

const fmtCurrency = (n) =>
 new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);
const fmtDate = (d) => new Date(d).toLocaleString("vi-VN");

export default function OrderDetail() {
 const { id } = useParams();
 const navigate = useNavigate();
 const [order, setOrder] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");
 const [cancelling, setCancelling] = useState(false);
 const [reordering, setReordering] = useState(false);

 useEffect(() => {
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) {
 navigate("/login?redirect=/orders");
 return;
 }
 fetchOrder(token);
 }, [id, navigate]);

 const fetchOrder = async (token) => {
 setLoading(true);
 try {
 const res = await fetch(`http://localhost:5221/api/orders/${id}`, {
 headers: { Authorization: `Bearer ${token}` },
 });
 const json = await res.json();
 if (json.success) {
 setOrder(json.data);
 } else {
 setError(json.message || "Không tìm thấy đơn hàng");
 }
 } catch {
 setError("Lỗi kết nối");
 } finally {
 setLoading(false);
 }
 };

 const handleCancel = async () => {
 if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) return;
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 setCancelling(true);
 try {
 const res = await fetch(
 `http://localhost:5221/api/orders/${id}/cancel`,
 {
 method: "POST",
 headers: { Authorization: `Bearer ${token}` },
 }
 );
 const json = await res.json();
 if (json.success) {
 fetchOrder(token);
 } else {
 alert(json.message || "Không thể hủy đơn hàng");
 }
 } catch {
 alert("Có lỗi xảy ra");
 } finally {
 setCancelling(false);
 }
 };

 const handleReorder = async () => {
 if (!order) return;
 setReordering(true);
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");

 try {
 // Add all items back to cart
 const addPromises = order.orderItems.map((item) =>
 fetch("http://localhost:5221/api/cart/items", {
 method: "POST",
 headers: {
 Authorization: `Bearer ${token}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ watchId: item.watchId, quantity: item.quantity }),
 })
 );
 await Promise.all(addPromises);
 navigate("/cart");
 } catch {
 alert("Có lỗi khi thêm lại vào giỏ hàng");
 } finally {
 setReordering(false);
 }
 };

 const card = "bg-white border-black/5";
 const text = "text-black";
 const sub = "text-neutral-500";

 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />

 <main className="max-w-[900px] mx-auto px-6 lg:px-12 py-12">
 {/* Breadcrumb */}
 <nav className={`flex items-center gap-2 text-sm mb-8 ${sub}`}>
 <Link to="/orders" className="hover:underline">
 Đơn hàng của tôi
 </Link>
 <Icon icon="teenyicons:chevron-right-outline" width={14} />
 <span className={text}>Chi tiết đơn hàng #{id}</span>
 </nav>

 {loading ? (
 <div className="flex items-center justify-center py-24">
 <div className="w-10 h-10 rounded-full border-2 border-current border-t-transparent animate-spin opacity-40" />
 </div>
 ) : error ? (
 <div className="text-center py-16">
 <p className="text-red-500 mb-4">{error}</p>
 <Link to="/orders" className={`underline ${text}`}>
 ← Quay lại danh sách đơn
 </Link>
 </div>
 ) : order ? (
 <div className="space-y-6">
 {/* Header card */}
 <div className={`rounded-xl border p-6 ${card}`}>
 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 <div>
 <h1 className={`text-2xl font-semibold ${text}`}>
 Đơn hàng #{order.id}
 </h1>
 <p className={`text-sm mt-1 ${sub}`}>
 Đặt ngày {fmtDate(order.createdAt)}
 </p>
 </div>
 <div className="flex items-center gap-3">
 {order.status === 1 && (
 <button
 onClick={handleCancel}
 disabled={cancelling}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition border bg-white text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50`}
 >
 {cancelling ? "Đang hủy..." : "Hủy đơn"}
 </button>
 )}
 {(order.status === 4 || order.status === 5) && (
 <button
 onClick={handleReorder}
 disabled={reordering}
 className={`px-4 py-2 rounded-lg text-sm font-medium transition bg-black text-white hover:bg-neutral-800 disabled:opacity-50`}
 >
 {reordering ? "Đang thêm..." : "🔁 Mua lại"}
 </button>
 )}
 </div>
 </div>
 </div>

 {/* Order Timeline */}
 <div className={`rounded-xl border p-6 ${card}`}>
 <h2 className={`text-base font-semibold mb-6 ${text}`}>
 Trạng thái đơn hàng
 </h2>

 {order.status !== 5 ? (
 <div className="relative flex items-start justify-between w-full pt-2 pb-8">
 {/* Background track */}
 <div className="absolute left-5 right-5 top-5 h-0.5 bg-neutral-200 " />
 {/* Progress track */}
 <div
 className="absolute left-5 top-5 h-0.5 bg-black transition-all duration-700"
 style={{
 width: `${
 ((Math.min(order.status, 4) - 1) /
 3) *
 (100 - (10 / steps.length))
 }%`,
 }}
 />

 {steps.map((s) => {
 const isCompleted = order.status >= s.step;
 const isCurrent = order.status === s.step;
 return (
 <div
 key={s.step}
 className="relative z-10 flex flex-col items-center gap-3 flex-1"
 >
 <div
 className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
 isCompleted
 ? "bg-black border-black text-white "
 : "bg-white border-neutral-300 text-neutral-400 "
 }`}
 >
 <Icon icon={s.icon} width={20} />
 {isCurrent && (
 <span className="absolute w-10 h-10 rounded-full border-2 border-black animate-ping opacity-20" />
 )}
 </div>
 <span
 className={`text-xs text-center font-medium ${
 isCompleted
 ? text
 : "text-neutral-400 "
 }`}
 >
 {s.label}
 </span>
 </div>
 );
 })}
 </div>
 ) : (
 <div className="flex items-center gap-3 p-4 bg-red-50 /10 border border-red-100 /30 rounded-lg text-red-600 ">
 <Icon icon="teenyicons:x-circle-outline" width={24} />
 <div>
 <p className="font-semibold">Đơn hàng đã bị hủy</p>
 <p className="text-sm opacity-75">
 Rất tiếc, đơn hàng này đã bị hủy.
 </p>
 </div>
 </div>
 )}
 </div>

 {/* Sản phẩm */}
 <div className={`rounded-xl border p-6 ${card}`}>
 <h2 className={`text-base font-semibold mb-4 ${text}`}>
 Sản phẩm đã đặt
 </h2>
 <div className="space-y-4">
 {order.orderItems?.map((item) => (
 <div
 key={item.id}
 className={`flex items-center gap-4 py-4 border-b last:border-b-0 border-black/5`}
 >
 <div
 className={`w-14 h-14 rounded-lg flex items-center justify-center flex-shrink-0 bg-neutral-100`}
 >
 <Icon
 icon="teenyicons:watch-outline"
 width={28}
 className="opacity-40"
 />
 </div>
 <div className="flex-1 min-w-0">
 <p className={`font-medium truncate ${text}`}>
 {item.watchName}
 </p>
 <p className={`text-sm mt-0.5 ${sub}`}>
 Số lượng: {item.quantity}
 </p>
 </div>
 <div className="text-right flex-shrink-0">
 <p className={`font-semibold ${text}`}>
 {fmtCurrency(item.subtotal)}
 </p>
 <p className={`text-xs mt-0.5 ${sub}`}>
 {fmtCurrency(item.price)} / cái
 </p>
 </div>
 </div>
 ))}
 </div>
 </div>

 {/* Thông tin giao hàng + Thanh toán */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className={`rounded-xl border p-6 ${card}`}>
 <h2 className={`text-base font-semibold mb-4 ${text}`}>
 Thông tin giao hàng
 </h2>
 <div className={`space-y-2 text-sm ${sub}`}>
 <p>
 <span className={`font-medium ${text}`}>Địa chỉ: </span>
 {order.shippingAddress}
 </p>
 {order.notes && (
 <p>
 <span className={`font-medium ${text}`}>Ghi chú: </span>
 {order.notes}
 </p>
 )}
 <p>
 <span className={`font-medium ${text}`}>Đơn vị vận chuyển: </span>
 {order.shippingProvider || "Miễn phí"}
 </p>
 </div>
 </div>

 <div className={`rounded-xl border p-6 ${card}`}>
 <h2 className={`text-base font-semibold mb-4 ${text}`}>
 Tổng thanh toán
 </h2>
 <div className={`space-y-3 text-sm ${sub}`}>
 <div className="flex justify-between">
 <span>Tạm tính</span>
 <span className={text}>
 {fmtCurrency(order.totalAmount - order.shippingFee)}
 </span>
 </div>
 <div className="flex justify-between">
 <span>Phí vận chuyển</span>
 <span className={text}>
 {order.shippingFee > 0
 ? fmtCurrency(order.shippingFee)
 : "Miễn phí"}
 </span>
 </div>
 <div
 className={`flex justify-between pt-3 border-t font-semibold text-base border-black/10 ${text}`}
 >
 <span>Tổng cộng</span>
 <span>{fmtCurrency(order.totalAmount)}</span>
 </div>
 </div>
 </div>
 </div>

 {/* Back button */}
 <div className="pt-2">
 <Link
 to="/orders"
 className={`inline-flex items-center gap-2 text-sm ${sub} hover:underline transition-colors`}
 >
 <Icon icon="teenyicons:arrow-left-outline" width={16} />
 Quay lại danh sách đơn hàng
 </Link>
 </div>
 </div>
 ) : null}
 </main>
 </div>
 );
}
