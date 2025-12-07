import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const statusLabels = {
  Pending: "Chờ xác nhận",
  Confirmed: "Đã xác nhận",
  Shipped: "Đang giao",
  Delivered: "Đã giao",
  Cancelled: "Đã hủy",
};

export default function Orders() {
  const [isDark, setIsDark] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);

    // Check if user is logged in
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login?redirect=/orders");
      return;
    }

    fetchOrders(token);
  }, [navigate]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

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
        setError(result.message || "Failed to load orders");
      }
    } catch (err) {
      setError("Failed to load orders");
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
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        <h1
          className={`text-4xl font-light tracking-tight mb-8 ${
            isDark ? "text-white" : "text-black"
          }`}
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
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Đang tải...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg border ${
              isDark
                ? "bg-neutral-900 border-white/10"
                : "bg-white border-black/5"
            }`}
          >
            <Icon
              icon="teenyicons:box-outline"
              width={48}
              className="mx-auto mb-4 opacity-50"
            />
            <p
              className={`text-lg mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Bạn chưa có đơn hàng nào
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
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`rounded-lg border p-6 ${
                  isDark
                    ? "bg-neutral-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3
                      className={`text-lg font-semibold ${
                        isDark ? "text-white" : "text-black"
                      }`}
                    >
                      Đơn hàng #{order.id}
                    </h3>
                    <p
                      className={`text-sm mt-1 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        statusColors[order.status] || statusColors.Pending
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="mb-4 pb-4 border-b border-white/10">
                  <div className="space-y-2">
                    {order.orderItems &&
                      order.orderItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span
                            className={
                              isDark ? "text-gray-300" : "text-gray-700"
                            }
                          >
                            {item.watchName} x{item.quantity}
                          </span>
                          <span className="text-amber-600">
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
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      Địa chỉ: {order.shippingAddress}
                    </p>
                    {order.notes && (
                      <p
                        className={`text-sm mt-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Ghi chú: {order.notes}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        Tổng cộng
                      </p>
                      <p className="text-lg font-semibold text-amber-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(order.totalAmount)}
                      </p>
                    </div>
                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleCancel(order.id)}
                        className={`px-4 py-2 rounded-lg text-sm transition ${
                          isDark
                            ? "bg-red-900/20 text-red-400 hover:bg-red-900/30"
                            : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      >
                        Hủy
                      </button>
                    )}
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
