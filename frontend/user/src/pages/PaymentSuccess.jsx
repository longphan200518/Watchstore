import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

export default function PaymentSuccess() {
 const [searchParams] = useSearchParams();
 const navigate = useNavigate();
 const orderId = searchParams.get("orderId");

 return (
 <div
 className={`min-h-screen bg-[#F8F8F8] text-[#111111]`}
 >
 <Header />

 <main className="max-w-2xl mx-auto px-6 py-20 text-center">
 <div
 className={`rounded-2xl border p-12 bg-white border-black/5`}
 >
 <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
 <Icon
 icon="solar:check-circle-bold"
 className="text-6xl text-green-600"
 />
 </div>

 <h1
 className={`text-3xl font-light mb-4 text-black`}
 >
 Thanh toÃ¡n thÃ nh cÃ´ng!
 </h1>

 <p
 className={`text-lg mb-6 text-black`}
 >
 Cáº£m Æ¡n báº¡n Ä‘Ã£ thanh toÃ¡n qua VNPay.
 <br />
 ÄÆ¡n hÃ ng #{orderId} cá»§a báº¡n Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½.
 </p>

 <div className="space-y-3 mt-8">
 <button
 onClick={() => navigate(`/order-confirmation?orderId=${orderId}`)}
 className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
 >
 Xem chi tiáº¿t Ä‘Æ¡n hÃ ng
 </button>
 <button
 onClick={() => navigate("/products")}
 className={`w-full py-3 border rounded-lg font-medium transition-all border-black/20 text-black hover:bg-black/5`}
 >
 Tiáº¿p tá»¥c mua sáº¯m
 </button>
 </div>
 </div>
 </main>
 </div>
 );
}

