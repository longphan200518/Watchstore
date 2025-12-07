import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getOrders } from "../services/orderService";
import { formatCurrency, formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

// OrderStatus: 1=Pending, 2=Processing, 3=Shipped, 4=Delivered, 5=Cancelled
const statusMap = {
  1: {
    label: "Chờ xác nhận",
    color: "bg-yellow-50 text-yellow-700 border border-yellow-200",
    icon: "solar:clock-circle-bold-duotone",
  },
  2: {
    label: "Đang xử lý",
    color: "bg-blue-50 text-blue-700 border border-blue-200",
    icon: "solar:widget-5-bold-duotone",
  },
  3: {
    label: "Đang giao",
    color: "bg-purple-50 text-purple-700 border border-purple-200",
    icon: "solar:delivery-bold-duotone",
  },
  4: {
    label: "Đã giao",
    color: "bg-green-50 text-green-700 border border-green-200",
    icon: "solar:check-circle-bold-duotone",
  },
  5: {
    label: "Đã hủy",
    color: "bg-red-50 text-red-700 border border-red-200",
    icon: "solar:close-circle-bold-duotone",
  },
};

export default function Orders() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
  ];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20 });

  useEffect(() => {
    fetchOrders();
  }, [pagination.pageNumber]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrders({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      if (response.success) {
        setOrders(response.data.items || []);
      } else {
        setError("Không tải được đơn hàng");
      }
    } catch (err) {
      setError("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      {/* Main content */}
      <main className="ml-72 min-h-screen">
        <AdminHeader title="Quản lý đơn hàng" subtitle="Trang chủ / Đơn hàng" />

        <div className="px-8 pb-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                label: "Chờ xác nhận",
                count: orders.filter((o) => o.status === 1).length,
                color: "from-yellow-500 to-amber-500",
                icon: "solar:clock-circle-bold-duotone",
              },
              {
                label: "Đang xử lý",
                count: orders.filter((o) => o.status === 2).length,
                color: "from-blue-500 to-cyan-500",
                icon: "solar:widget-5-bold-duotone",
              },
              {
                label: "Đang giao",
                count: orders.filter((o) => o.status === 3).length,
                color: "from-purple-500 to-pink-500",
                icon: "solar:delivery-bold-duotone",
              },
              {
                label: "Đã giao",
                count: orders.filter((o) => o.status === 4).length,
                color: "from-green-500 to-emerald-500",
                icon: "solar:check-circle-bold-duotone",
              },
              {
                label: "Đã hủy",
                count: orders.filter((o) => o.status === 5).length,
                color: "from-red-500 to-rose-500",
                icon: "solar:close-circle-bold-duotone",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow"
              >
                <div
                  className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center mb-3`}
                >
                  <Icon icon={stat.icon} className="text-xl text-white" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <span className="text-sm text-gray-600">Tổng: </span>
              <span className="text-sm font-bold text-gray-900">
                {orders.length}
              </span>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2.5 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white shadow-sm transition-all duration-200 flex items-center gap-2">
                <Icon icon="solar:export-bold-duotone" className="text-lg" />
                Xuất Excel
              </button>
            </div>
          </div>

          {/* Loading / Error */}
          {loading && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600 flex items-center gap-3">
              <Icon
                icon="svg-spinners:ring-resize"
                className="text-2xl text-amber-500"
              />
              <span>Đang tải đơn hàng...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-3">
              <Icon icon="solar:danger-circle-bold" className="text-xl" />
              {error}
            </div>
          )}

          {/* Orders table */}
          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <span className="text-lg">🧾</span>
                  <div>
                    <p className="text-sm text-gray-500">Tổng số đơn</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {orders.length} đơn
                    </p>
                  </div>
                </div>
                <button className="text-sm text-secondary hover:underline">
                  Bộ lọc nhanh
                </button>
              </div>
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 text-left">Mã đơn</th>
                    <th className="px-6 py-3 text-left">Khách hàng</th>
                    <th className="px-6 py-3 text-left">Tổng tiền</th>
                    <th className="px-6 py-3 text-left">Ngày giờ</th>
                    <th className="px-6 py-3 text-left">Trạng thái</th>
                    <th className="px-6 py-3 text-right">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((o) => {
                    const statusInfo = statusMap[o.status] || statusMap[1];
                    return (
                      <tr key={o.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          #{o.id}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {o.customerName}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold">
                          {formatCurrency(o.totalAmount)}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {formatDate(o.orderDate)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
                          >
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white shadow-sm">
                            Xem
                          </button>
                          <button className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white shadow-sm">
                            Cập nhật
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
