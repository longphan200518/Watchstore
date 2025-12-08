import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

export default function PaymentSuccess() {
  const [isDark, setIsDark] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div
          className={`rounded-2xl border p-12 ${
            isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"
          }`}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <Icon icon="solar:check-circle-bold" className="text-6xl text-green-600" />
          </div>

          <h1
            className={`text-3xl font-light mb-4 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Thanh toán thành công!
          </h1>

          <p
            className={`text-lg mb-6 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Cảm ơn bạn đã thanh toán qua VNPay.
            <br />
            Đơn hàng #{orderId} của bạn đang được xử lý.
          </p>

          <div className="space-y-3 mt-8">
            <button
              onClick={() => navigate(`/order-confirmation?orderId=${orderId}`)}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-600 transition-all"
            >
              Xem chi tiết đơn hàng
            </button>
            <button
              onClick={() => navigate("/products")}
              className={`w-full py-3 border rounded-lg font-medium transition-all ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/5"
                  : "border-black/20 text-black hover:bg-black/5"
              }`}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
