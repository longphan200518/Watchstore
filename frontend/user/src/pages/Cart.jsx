import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Cart() {
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, getTotalPrice, getTotalItems } =
    useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleCheckout = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <h1
          className={`text-4xl font-light tracking-tight mb-8 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          Giỏ hàng
        </h1>

        {cart.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg border ${
              isDark
                ? "bg-neutral-900 border-white/10"
                : "bg-white border-black/5"
            }`}
          >
            <Icon
              icon="teenyicons:cart-outline"
              width={48}
              className="mx-auto mb-4 opacity-50"
            />
            <p
              className={`text-lg mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Giỏ hàng của bạn trống
            </p>
            <button
              onClick={() => navigate("/products")}
              className={`px-6 py-3 rounded-lg transition ${
                isDark
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex gap-4 p-4 rounded-lg border ${
                    isDark
                      ? "bg-neutral-900 border-white/10"
                      : "bg-white border-black/5"
                  }`}
                >
                  {/* Image */}
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                  ) : (
                    <div
                      className={`w-24 h-24 rounded-lg flex items-center justify-center ${
                        isDark ? "bg-neutral-800" : "bg-gray-100"
                      }`}
                    >
                      <Icon icon="teenyicons:image-outline" width={32} />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`font-semibold line-clamp-1 ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {item.brandName}
                    </p>
                    <p className="text-lg font-semibold text-amber-600 mt-2">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price)}
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.id, Math.max(1, item.quantity - 1))
                      }
                      className={`w-8 h-8 rounded flex items-center justify-center transition ${
                        isDark
                          ? "bg-neutral-800 hover:bg-neutral-700"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Icon icon="teenyicons:minus-outline" width={16} />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className={`w-8 h-8 rounded flex items-center justify-center transition ${
                        isDark
                          ? "bg-neutral-800 hover:bg-neutral-700"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      <Icon icon="teenyicons:plus-outline" width={16} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      addToast(
                        `${item.name} đã được xóa khỏi giỏ hàng`,
                        "info",
                        2000
                      );
                    }}
                    className={`w-8 h-8 rounded flex items-center justify-center transition ${
                      isDark
                        ? "text-red-400 hover:bg-red-400/10"
                        : "text-red-600 hover:bg-red-100"
                    }`}
                  >
                    <Icon icon="teenyicons:trash-outline" width={16} />
                  </button>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div
              className={`rounded-lg border p-6 h-fit ${
                isDark
                  ? "bg-neutral-900 border-white/10"
                  : "bg-white border-black/5"
              }`}
            >
              <h2
                className={`text-xl font-semibold mb-4 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Tóm tắt
              </h2>

              <div
                className={`space-y-3 pb-4 border-b ${
                  isDark ? "border-white/10" : "border-black/5"
                }`}
              >
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Số sản phẩm:
                  </span>
                  <span>{getTotalItems()}</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Tiền hàng:
                  </span>
                  <span>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(getTotalPrice())}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Phí vận chuyển:
                  </span>
                  <span className="text-amber-600">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 mb-6 text-lg font-semibold">
                <span>Tổng cộng:</span>
                <span className="text-amber-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(getTotalPrice())}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition font-semibold ${
                  isDark
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
              >
                <Icon icon="teenyicons:arrow-right-outline" width={16} />
                Thanh toán
              </button>

              <button
                onClick={() => navigate("/products")}
                className={`w-full mt-2 py-3 rounded-lg transition ${
                  isDark
                    ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-black"
                }`}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
