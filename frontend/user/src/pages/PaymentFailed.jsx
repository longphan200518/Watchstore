import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

export default function PaymentFailed() {
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
            isDark
              ? "bg-neutral-900 border-white/10"
              : "bg-white border-black/5"
          }`}
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <Icon
              icon="solar:close-circle-bold"
              className="text-6xl text-red-600"
            />
          </div>

          <h1
            className={`text-3xl font-light mb-4 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Thanh toán thất bại
          </h1>

          <p
            className={`text-lg mb-6 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Rất tiếc, thanh toán của bạn không thành công.
            <br />
            Vui lòng thử lại hoặc chọn phương thức thanh toán khác.
          </p>

          <div className="space-y-3 mt-8">
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 text-white rounded-lg font-medium hover:from-amber-700 hover:to-amber-600 transition-all"
            >
              Thử lại thanh toán
            </button>
            <button
              onClick={() => navigate("/cart")}
              className={`w-full py-3 border rounded-lg font-medium transition-all ${
                isDark
                  ? "border-white/20 text-white hover:bg-white/5"
                  : "border-black/20 text-black hover:bg-black/5"
              }`}
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
