import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

export default function PaymentFailed() {
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
 <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
 <Icon
 icon="solar:close-circle-bold"
 className="text-6xl text-red-600"
 />
 </div>

 <h1
 className={`text-3xl font-light mb-4 text-black`}
 >
 Thanh toÃ¡n tháº¥t báº¡i
 </h1>

 <p
 className={`text-lg mb-6 text-black`}
 >
 Ráº¥t tiáº¿c, thanh toÃ¡n cá»§a báº¡n khÃ´ng thÃ nh cÃ´ng.
 <br />
 Vui lÃ²ng thá»­ láº¡i hoáº·c chá»n phÆ°Æ¡ng thá»©c thanh toÃ¡n khÃ¡c.
 </p>

 <div className="space-y-3 mt-8">
 <button
 onClick={() => navigate("/checkout")}
 className="w-full py-3 bg-black text-white rounded-lg font-medium hover:bg-neutral-800 transition-all"
 >
 Thá»­ láº¡i thanh toÃ¡n
 </button>
 <button
 onClick={() => navigate("/cart")}
 className={`w-full py-3 border rounded-lg font-medium transition-all border-black/20 text-black hover:bg-black/5`}
 >
 Quay láº¡i giá» hÃ ng
 </button>
 </div>
 </div>
 </main>
 </div>
 );
}

