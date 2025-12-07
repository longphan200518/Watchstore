import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
          setError("Vui lòng đăng nhập");
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
          setError(result.message || "Không tìm thấy đơn hàng");
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen ${
          isDark
            ? "bg-neutral-950 text-neutral-50"
            : "bg-stone-50 text-stone-900"
        }`}
      >
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Đang tải...
          </p>
        </main>
      </div>
    );
  }

  if (error || !order) {
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
          <p
            className={`text-xl mb-4 ${
              isDark ? "text-red-400" : "text-red-600"
            }`}
          >
            {error}
          </p>
          <button
            onClick={() => navigate("/products")}
            className={`px-6 py-3 rounded-lg transition ${
              isDark
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Quay lại mua sắm
          </button>
        </main>
      </div>
    );
  }

  // OrderStatus: 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled
  const statusLabels = {
    1: "Đang chờ xác nhận",
    2: "Đang xử lý",
    3: "Đang giao hàng",
    4: "Đã giao hàng",
    5: "Đã hủy",
  };

  const statusColors = {
    1: isDark
      ? "bg-yellow-900/80 text-yellow-100"
      : "bg-yellow-100 text-yellow-800",
    2: isDark ? "bg-blue-900/80 text-blue-100" : "bg-blue-100 text-blue-800",
    3: isDark
      ? "bg-purple-900/80 text-purple-100"
      : "bg-purple-100 text-purple-800",
    4: isDark
      ? "bg-green-900/80 text-green-100"
      : "bg-green-100 text-green-800",
    5: isDark ? "bg-red-900/80 text-red-100" : "bg-red-100 text-red-800",
  };

  const totalPrice = order.orderItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1000px] mx-auto px-6 lg:px-12 py-32">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div
              className={`w-24 h-24 rounded-full flex items-center justify-center ${
                isDark
                  ? "bg-green-900/30 text-green-400"
                  : "bg-green-100 text-green-600"
              }`}
            >
              <Icon icon="teenyicons:tick-circle-outline" width={64} />
            </div>
          </div>
          <h1
            className={`text-4xl font-light tracking-tight mb-4 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Đặt hàng thành công!
          </h1>
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>
            Cảm ơn bạn đã mua sắm tại Watchstore. Chúng tôi đã nhận đơn hàng của
            bạn.
          </p>
        </div>

        {/* Order Details */}
        <div
          className={`rounded-lg border p-8 mb-8 ${
            isDark
              ? "bg-neutral-900 border-white/10"
              : "bg-white border-black/5"
          }`}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <p
                className={`text-sm uppercase tracking-widest mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Mã đơn hàng
              </p>
              <p className="text-2xl font-semibold">{order.id}</p>
            </div>
            <div>
              <p
                className={`text-sm uppercase tracking-widest mb-2 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Trạng thái
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
            className={`border-t border-b ${
              isDark ? "border-white/10" : "border-black/5"
            } py-6 mb-6`}
          >
            <h3
              className={`text-lg font-semibold mb-4 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Chi tiết đơn hàng
            </h3>
            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{item.watchName}</p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Số lượng: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                Tạm tính:
              </span>
              <span>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                Vận chuyển:
              </span>
              <span className={isDark ? "text-green-400" : "text-green-600"}>
                Miễn phí
              </span>
            </div>
            <div
              className={`border-t ${
                isDark ? "border-white/10" : "border-black/5"
              } pt-3 flex justify-between text-lg font-semibold`}
            >
              <span>Tổng cộng:</span>
              <span className="text-amber-600">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(totalPrice)}
              </span>
            </div>
          </div>

          {/* Shipping Information */}
          <div
            className={`border-t ${
              isDark ? "border-white/10" : "border-black/5"
            } pt-6`}
          >
            <h4
              className={`font-semibold mb-3 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Thông tin giao hàng
            </h4>
            <div className="space-y-2">
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Địa chỉ:
                </span>{" "}
                {order.shippingAddress}
              </p>
              <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                  Điện thoại:
                </span>{" "}
                {order.phoneNumber}
              </p>
              {order.notes && (
                <p className={isDark ? "text-gray-300" : "text-gray-700"}>
                  <span className={isDark ? "text-gray-400" : "text-gray-600"}>
                    Ghi chú:
                  </span>{" "}
                  {order.notes}
                </p>
              )}
              <p
                className={`text-sm ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                <span>Ngày đặt hàng:</span>{" "}
                {new Date(order.createdAt).toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/orders")}
            className={`px-8 py-3 rounded-lg font-medium transition ${
              isDark
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            Xem đơn hàng
          </button>
          <button
            onClick={() => navigate("/products")}
            className={`px-8 py-3 rounded-lg font-medium transition border ${
              isDark
                ? "border-white/10 text-gray-300 hover:bg-white/5"
                : "border-black/10 text-gray-700 hover:bg-black/5"
            }`}
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </main>
    </div>
  );
}
