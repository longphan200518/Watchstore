import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";

export default function OrderConfirmation() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const [order, setOrder] = useState(null);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState("");

 const orderId = searchParams.get("orderId");

 useEffect(() => {
 const fetchOrder = async () => {
 try {
 const token =
 localStorage.getItem("token") || sessionStorage.getItem("token");
 if (!token) {
 setError("Vui lÃ²ng Ä‘Äƒng nháº­p");
 setLoading(false);
 return;
 }

 const response = await fetch(
 `http://localhost:5221/api/orders/${orderId}`,
 {
 headers: {
 Authorization: `Bearer ${token}`,
 },
 }
 );
 const result = await response.json();
 if (result.success) {
 setOrder(result.data);
 } else {
 setError(result.message || "KhÃ´ng tÃ¬m tháº¥y Ä‘Æ¡n hÃ ng");
 }
 } catch (err) {
 setError(err.message || "CÃ³ lá»—i xáº£y ra");
 console.error(err);
 } finally {
 setLoading(false);
 }
 };

 if (orderId) {
 fetchOrder();
 }
 }, [orderId]);

 if (loading) {
 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />
 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
 <p className={"text-black"}>
 Äang táº£i...
 </p>
 </main>
 </div>
 );
 }

 if (error || !order) {
 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />
 <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 text-center">
 <p
 className={`text-xl mb-4 text-red-600`}
 >
 {error}
 </p>
 <button
 onClick={() => navigate("/products")}
 className={`px-6 py-3 rounded-lg transition bg-black hover:bg-neutral-800 text-white`}
 >
 Quay láº¡i mua sáº¯m
 </button>
 </main>
 </div>
 );
 }

 // OrderStatus: 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled
 const statusLabels = {
 1: "Äang chá» xÃ¡c nháº­n",
 2: "Äang xá»­ lÃ½",
 3: "Äang giao hÃ ng",
 4: "ÄÃ£ giao hÃ ng",
 5: "ÄÃ£ há»§y",
 };

 const statusColors = {
 1: "bg-gray-100 text-gray-900",
 2: "bg-blue-100 text-blue-800",
 3: "bg-purple-100 text-purple-800",
 4: "bg-green-100 text-green-800",
 5: "bg-red-100 text-red-800",
 };

 const totalItemsPrice = order.orderItems.reduce(
 (sum, item) => sum + item.price * item.quantity,
 0
 );
 const shippingFee = order.shippingFee ?? 0;

 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />
 <ToastContainer />

 <main className="max-w-[1000px] mx-auto px-6 lg:px-12 py-32">
 {/* Success Message */}
 <div className="text-center mb-12">
 <div className="flex justify-center mb-6">
 <div
 className={`w-24 h-24 rounded-full flex items-center justify-center bg-green-100 text-green-600`}
 >
 <Icon icon="teenyicons:tick-circle-outline" width={64} />
 </div>
 </div>
 <h1
 className={`text-4xl font-light tracking-tight mb-4 text-black`}
 >
 Äáº·t hÃ ng thÃ nh cÃ´ng!
 </h1>
 <p className={"text-black"}>
 Cáº£m Æ¡n báº¡n Ä‘Ã£ mua sáº¯m táº¡i Watchstore. ChÃºng tÃ´i Ä‘Ã£ nháº­n Ä‘Æ¡n hÃ ng cá»§a
 báº¡n.
 </p>
 </div>

 {/* Order Details */}
 <div
 className={`rounded-lg border p-8 mb-8 bg-white border-black/5`}
 >
 <div className="grid md:grid-cols-2 gap-8 mb-8">
 <div>
 <p
 className={`text-sm uppercase tracking-widest mb-2 text-black`}
 >
 MÃ£ Ä‘Æ¡n hÃ ng
 </p>
 <p className="text-2xl font-semibold">{order.id}</p>
 </div>
 <div>
 <p
 className={`text-sm uppercase tracking-widest mb-2 text-black`}
 >
 Tráº¡ng thÃ¡i
 </p>
 <div
 className={`inline-block px-4 py-2 rounded-lg text-sm font-semibold ${
 statusColors[order.status]
 }`}
 >
 {statusLabels[order.status] || order.status}
 </div>
 </div>
 </div>

 {/* Order Items */}
 <div
 className={`border-t border-b border-black/5 py-6 mb-6`}
 >
 <h3
 className={`text-lg font-semibold mb-4 text-black`}
 >
 Chi tiáº¿t Ä‘Æ¡n hÃ ng
 </h3>
 <div className="space-y-3">
 {order.orderItems.map((item, idx) => (
 <div key={idx} className="flex justify-between items-center">
 <div>
 <p className="font-medium">{item.watchName}</p>
 <p
 className={`text-sm text-black`}
 >
 Sá»‘ lÆ°á»£ng: {item.quantity}
 </p>
 </div>
 <p className="font-medium">
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(item.price * item.quantity)}
 </p>
 </div>
 ))}
 </div>
 </div>

 {/* Order Summary */}
 <div className="space-y-3 mb-6">
 <div className="flex justify-between">
 <span className={"text-black"}>
 Táº¡m tÃ­nh:
 </span>
 <span>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(totalItemsPrice)}
 </span>
 </div>
 <div className="flex justify-between">
 <span className={"text-black"}>
 Váº­n chuyá»ƒn:
 </span>
 <span className={shippingFee > 0 ? ("text-black") : ("text-green-600")}>
 {shippingFee > 0
 ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingFee)
 : "Miá»…n phÃ­"}
 </span>
 </div>
 <div
 className={`border-t border-black/5 pt-3 flex justify-between text-lg font-semibold`}
 >
 <span>Tá»•ng cá»™ng:</span>
 <span className={`text-black font-medium`}>
 {new Intl.NumberFormat("vi-VN", {
 style: "currency",
 currency: "VND",
 }).format(order.totalAmount ?? (totalItemsPrice + shippingFee))}
 </span>
 </div>
 </div>

 {/* Shipping Information */}
 <div
 className={`border-t border-black/5 pt-6`}
 >
 <h4
 className={`font-semibold mb-3 text-black`}
 >
 ThÃ´ng tin giao hÃ ng
 </h4>
 <div className="space-y-2">
 <p className={"text-black"}>
 <span className={"text-black"}>
 Äá»‹a chá»‰:
 </span>{" "}
 {order.shippingAddress}
 </p>
 <p className={"text-black"}>
 <span className={"text-black"}>
 Äiá»‡n thoáº¡i:
 </span>{" "}
 {order.phoneNumber}
 </p>
 {order.notes && (
 <p className={"text-black"}>
 <span className={"text-black"}>
 Ghi chÃº:
 </span>{" "}
 {order.notes}
 </p>
 )}
 <p
 className={`text-sm text-black`}
 >
 <span>NgÃ y Ä‘áº·t hÃ ng:</span>{" "}
 {new Date(order.createdAt).toLocaleString("vi-VN")}
 </p>
 </div>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row gap-4 justify-center">
 <button
 onClick={() => navigate("/orders")}
 className={`px-8 py-3 rounded-lg font-medium transition bg-black hover:bg-neutral-800 text-white`}
 >
 Xem Ä‘Æ¡n hÃ ng
 </button>
 <button
 onClick={() => navigate("/products")}
 className={`px-8 py-3 rounded-lg font-medium transition border border-black/10 text-gray-700 hover:bg-black/5`}
 >
 Tiáº¿p tá»¥c mua sáº¯m
 </button>
 </div>
 </main>
 </div>
 );
}

