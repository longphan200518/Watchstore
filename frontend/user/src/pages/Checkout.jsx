import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Checkout() {
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD, BANK, or VNPAY
  const navigate = useNavigate();
  const { cart, getTotalPrice, getTotalItems, clearCart } = useCart();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    shippingAddress: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);

    // Load user data
    const userData =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData((prev) => ({
          ...prev,
          fullName: parsedUser.fullName || "",
          email: parsedUser.email || "",
          phoneNumber: parsedUser.phoneNumber || "",
        }));
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (cart.length === 0) {
      setError("Giỏ hàng trống");
      addToast("Giỏ hàng trống", "warning", 2000);
      setLoading(false);
      return;
    }

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập");
        addToast("Vui lòng đăng nhập", "warning", 2000);
        navigate("/login");
        return;
      }

      const orderData = {
        shippingAddress: formData.shippingAddress,
        phoneNumber: formData.phoneNumber,
        notes: formData.notes,
        orderItems: cart.map((item) => ({
          watchId: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("http://localhost:5221/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        const orderId = result.data.id;

        // If VNPay payment, redirect to VNPay gateway
        if (paymentMethod === "VNPAY") {
          try {
            const paymentResponse = await fetch("http://localhost:5221/api/payment/create-vnpay-url", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ orderId }),
            });

            const paymentResult = await paymentResponse.json();
            if (paymentResult.success) {
              clearCart();
              window.location.href = paymentResult.data.paymentUrl;
              return;
            }
          } catch (paymentErr) {
            console.error("VNPay error:", paymentErr);
            setError("Không thể kết nối VNPay. Vui lòng thử lại.");
            addToast("Lỗi thanh toán VNPay", "error", 3000);
            setLoading(false);
            return;
          }
        }

        setSuccess("Đặt hàng thành công!");
        addToast("✓ Đặt hàng thành công! Chuyển hướng...", "success", 3000);
        clearCart();
        setTimeout(() => {
          navigate(`/order-confirmation?orderId=${orderId}`);
        }, 2000);
      } else {
        setError(result.message || "Đặt hàng thất bại");
        addToast(result.message || "Đặt hàng thất bại", "error", 3000);
      }
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      addToast(err.message || "Có lỗi xảy ra", "error", 3000);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div
        className={`min-h-screen ${
          isDark
            ? "bg-neutral-950 text-neutral-50"
            : "bg-stone-50 text-stone-900"
        }`}
      >
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 text-center">
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Giỏ hàng trống.{" "}
            <a href="/products" className="text-amber-600 hover:underline">
              Tiếp tục mua sắm
            </a>
          </p>
        </main>
      </div>
    );
  }

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
          Thanh toán
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-100 text-green-700 rounded-lg">
                  {success}
                </div>
              )}

              {/* Personal Info */}
              <div
                className={`rounded-lg border p-6 ${
                  isDark
                    ? "bg-neutral-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                <h2
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Thông tin người nhận
                </h2>
                <div className="space-y-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white"
                          : "bg-white border-black/10 text-black"
                      }`}
                      disabled
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white"
                          : "bg-white border-black/10 text-black"
                      }`}
                      disabled
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 rounded-lg border ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white"
                          : "bg-white border-black/10 text-black"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div
                className={`rounded-lg border p-6 ${
                  isDark
                    ? "bg-neutral-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                <h2
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Địa chỉ giao hàng
                </h2>
                <div>
                  <textarea
                    required
                    rows="3"
                    value={formData.shippingAddress}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shippingAddress: e.target.value,
                      })
                    }
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark
                        ? "bg-neutral-800 border-white/10 text-white"
                        : "bg-white border-black/10 text-black"
                    }`}
                    placeholder="Nhập địa chỉ giao hàng đầy đủ"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div
                className={`rounded-lg border p-6 ${
                  isDark
                    ? "bg-neutral-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                <h2
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Phương thức thanh toán
                </h2>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === "COD"
                        ? isDark
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-amber-500 bg-amber-50"
                        : isDark
                        ? "border-white/10 hover:border-white/20"
                        : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-amber-600"
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        💵 Thanh toán khi nhận hàng (COD)
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Thanh toán bằng tiền mặt khi nhận hàng
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === "BANK"
                        ? isDark
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-amber-500 bg-amber-50"
                        : isDark
                        ? "border-white/10 hover:border-white/20"
                        : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK"
                      checked={paymentMethod === "BANK"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-amber-600"
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        🏦 Chuyển khoản ngân hàng
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Thanh toán trước qua chuyển khoản
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition ${
                      paymentMethod === "VNPAY"
                        ? isDark
                          ? "border-amber-500 bg-amber-500/10"
                          : "border-amber-500 bg-amber-50"
                        : isDark
                        ? "border-white/10 hover:border-white/20"
                        : "border-black/10 hover:border-black/20"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="VNPAY"
                      checked={paymentMethod === "VNPAY"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-amber-600"
                    />
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        💳 VNPay
                      </div>
                      <div
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Thanh toán qua cổng VNPay (ATM, Visa, MasterCard)
                      </div>
                    </div>
                  </label>

                  {paymentMethod === "BANK" && (
                    <div
                      className={`p-4 rounded-lg ${
                        isDark ? "bg-neutral-800" : "bg-gray-50"
                      }`}
                    >
                      <div
                        className={`text-sm space-y-2 ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        <p className="font-semibold">Thông tin chuyển khoản:</p>
                        <p>
                          Ngân hàng: <strong>Vietcombank</strong>
                        </p>
                        <p>
                          Số tài khoản: <strong>1234567890</strong>
                        </p>
                        <p>
                          Chủ tài khoản: <strong>WATCHSTORE</strong>
                        </p>
                        <p
                          className={
                            isDark ? "text-amber-400" : "text-amber-600"
                          }
                        >
                          Nội dung: <strong>WATCHSTORE [SĐT]</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div
                className={`rounded-lg border p-6 ${
                  isDark
                    ? "bg-neutral-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                <h2
                  className={`text-lg font-semibold mb-4 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Ghi chú (tùy chọn)
                </h2>
                <textarea
                  rows="2"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark
                      ? "bg-neutral-800 border-white/10 text-white"
                      : "bg-white border-black/10 text-black"
                  }`}
                  placeholder="Ghi chú cho đơn hàng"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition font-semibold ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : isDark
                    ? "bg-amber-600 hover:bg-amber-700 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white"
                }`}
              >
                {loading ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
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
              Đơn hàng
            </h2>

            <div className="space-y-3 pb-4 border-b mb-4 border-white/10">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    {item.name} x{item.quantity}
                  </span>
                  <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
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

            <div className="border-t border-white/10 mt-4 pt-4 flex justify-between text-lg font-semibold">
              <span>Tổng:</span>
              <span className="text-amber-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(getTotalPrice())}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
