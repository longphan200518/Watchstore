import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getOrders } from "../services/orderService";
import { formatCurrency, formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../contexts/ToastContext";

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
  const { showToast } = useToast();
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
    { label: "Cài đặt Website", path: "/website-settings" },
  ];

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20 });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState(1);

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

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setShowStatusModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedOrder) return;

    try {
      // TODO: Implement updateOrderStatus API call
      // const response = await updateOrderStatus(selectedOrder.id, newStatus);
      // if (response.success) {
      //   fetchOrders();
      //   setShowStatusModal(false);
      //   alert("Cập nhật trạng thái thành công");
      // }

      // Temporary: Update locally
      setOrders(
        orders.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: newStatus } : o
        )
      );
      setShowStatusModal(false);
      showToast("Cập nhật trạng thái thành công!", "success");
    } catch (err) {
      showToast("Lỗi khi cập nhật trạng thái", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        <AdminHeader title="Quản lý đơn hàng" subtitle="Trang chủ / Đơn hàng" />

        <div className="px-4 lg:px-8 pb-8 space-y-6">
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
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetail(o)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Xem chi tiết"
                            >
                              <Icon
                                icon="solar:eye-bold-duotone"
                                className="text-lg"
                              />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(o)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Cập nhật trạng thái"
                            >
                              <Icon
                                icon="solar:restart-bold-duotone"
                                className="text-lg"
                              />
                            </button>
                          </div>
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

      {/* Status Update Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon
                    icon="solar:restart-bold-duotone"
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Cập nhật trạng thái
                  </h3>
                  <p className="text-sm text-white/80">
                    Đơn hàng #{selectedOrder.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStatusModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-2xl text-white"
                />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Chọn trạng thái mới:
                </label>
                <div className="space-y-2">
                  {Object.entries(statusMap).map(([status, info]) => (
                    <label
                      key={status}
                      className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        newStatus === parseInt(status)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-green-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status}
                        checked={newStatus === parseInt(status)}
                        onChange={(e) => setNewStatus(parseInt(e.target.value))}
                        className="w-5 h-5 text-green-600"
                      />
                      <Icon
                        icon={info.icon}
                        className={`text-xl ${
                          newStatus === parseInt(status)
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          newStatus === parseInt(status)
                            ? "text-green-900"
                            : "text-gray-700"
                        }`}
                      >
                        {info.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon
                  icon="solar:close-circle-bold-duotone"
                  className="text-lg"
                />
                Hủy
              </button>
              <button
                onClick={handleSaveStatus}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-600 shadow-lg shadow-green-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon
                  icon="solar:check-circle-bold-duotone"
                  className="text-lg"
                />
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon
                    icon="solar:document-text-bold-duotone"
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Chi tiết đơn hàng
                  </h3>
                  <p className="text-sm text-white/80">#{selectedOrder.id}</p>
                </div>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-2xl text-white"
                />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Customer Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Icon icon="solar:user-bold-duotone" />
                  Thông tin khách hàng
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Họ tên:</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.customerName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.customerEmail || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-medium text-gray-900">
                      {selectedOrder.customerPhone || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Địa chỉ:</span>
                    <span className="font-medium text-gray-900 text-right max-w-xs">
                      {selectedOrder.shippingAddress || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Icon icon="solar:cart-large-4-bold-duotone" />
                  Thông tin đơn hàng
                </h4>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày đặt:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(selectedOrder.orderDate)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                        statusMap[selectedOrder.status]?.color
                      }`}
                    >
                      {statusMap[selectedOrder.status]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-gray-600">Tổng tiền:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(selectedOrder.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-sm font-semibold text-gray-500 uppercase mb-3 flex items-center gap-2">
                  <Icon icon="solar:box-bold-duotone" />
                  Sản phẩm ({selectedOrder.items?.length || 0})
                </h4>
                <div className="space-y-3">
                  {selectedOrder.items && selectedOrder.items.length > 0 ? (
                    selectedOrder.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-4 bg-gray-50 rounded-xl p-4"
                      >
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Icon
                            icon="solar:watch-bold-duotone"
                            className="text-3xl text-gray-400"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">
                            {item.watchName || "Sản phẩm"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Số lượng: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">
                            {formatCurrency(item.price)}
                          </p>
                          <p className="text-xs text-gray-500">
                            x {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      Không có sản phẩm
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6 border-t border-gray-200 pt-4">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon
                  icon="solar:close-circle-bold-duotone"
                  className="text-lg"
                />
                Đóng
              </button>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleUpdateStatus(selectedOrder);
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-600 shadow-lg shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon icon="solar:restart-bold-duotone" className="text-lg" />
                Cập nhật trạng thái
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
