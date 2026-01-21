import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getUsers, updateUserRoles, deleteUser } from "../services/userService";
import { formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../contexts/ToastContext";

export default function Users() {
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

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20 });
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedRoles, setSelectedRoles] = useState([]);

  const availableRoles = ["Admin", "User"];

  useEffect(() => {
    fetchUsers();
  }, [pagination.pageNumber]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      if (response.success) {
        setUsers(response.data.items || []);
      } else {
        setError("Không tải được người dùng");
      }
    } catch (err) {
      setError("Lỗi khi tải người dùng");
    } finally {
      setLoading(false);
    }
  };

  const handleEditRoles = (user) => {
    setEditingUser(user);
    setSelectedRoles(user.roles || []);
    setShowRoleModal(true);
  };

  const handleUpdateRoles = async () => {
    if (!editingUser) return;

    try {
      const response = await updateUserRoles(editingUser.id, selectedRoles);
      if (response.success) {
        showToast("Cập nhật quyền thành công!", "success");
        setShowRoleModal(false);
        fetchUsers();
      } else {
        showToast(response.message || "Không thể cập nhật", "error");
      }
    } catch (err) {
      showToast("Lỗi khi cập nhật", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const response = await deleteUser(id);
      if (response.success) {
        showToast("Xóa người dùng thành công!", "success");
        fetchUsers();
      } else {
        showToast("Không thể xóa người dùng", "error");
      }
    } catch (err) {
      showToast("Lỗi khi xóa người dùng", "error");
    }
  };

  const toggleRole = (role) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      <main className="lg:ml-72 min-h-screen">
        <AdminHeader
          title="Quản lý người dùng"
          subtitle="Trang chủ / Người dùng"
        />

        <div className="px-4 lg:px-8 pb-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-3">
                <Icon
                  icon="solar:users-group-rounded-bold-duotone"
                  className="text-xl text-white"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              <p className="text-xs text-gray-500 mt-1">Tổng người dùng</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-3">
                <Icon
                  icon="solar:shield-user-bold-duotone"
                  className="text-xl text-white"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.roles?.includes("Admin")).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Admin</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <Icon
                  icon="solar:check-circle-bold-duotone"
                  className="text-xl text-white"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter((u) => u.emailConfirmed).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">Email xác thực</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                <Icon
                  icon="solar:user-bold-duotone"
                  className="text-xl text-white"
                />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {
                  users.filter(
                    (u) =>
                      u.roles?.includes("User") && !u.roles?.includes("Admin")
                  ).length
                }
              </p>
              <p className="text-xs text-gray-500 mt-1">Khách hàng</p>
            </div>
          </div>

          {loading && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600 flex items-center gap-3">
              <Icon
                icon="svg-spinners:ring-resize"
                className="text-2xl text-amber-500"
              />
              <span>Đang tải...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-3">
              <Icon icon="solar:danger-circle-bold" className="text-xl" />
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:user-bold-duotone" />
                        Người dùng
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Quyền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50/50 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {user.fullName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-500">
                              ID: {user.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="solar:letter-bold-duotone"
                            className="text-gray-400"
                          />
                          <span className="text-gray-700">{user.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon="solar:phone-bold-duotone"
                            className="text-gray-400"
                          />
                          <span className="text-gray-700">
                            {user.phoneNumber || "—"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1.5">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                                  role === "Admin"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : "bg-blue-50 text-blue-700 border border-blue-200"
                                }`}
                              >
                                <Icon
                                  icon={
                                    role === "Admin"
                                      ? "solar:shield-user-bold"
                                      : "solar:user-bold"
                                  }
                                />
                                {role}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            user.emailConfirmed
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          }`}
                        >
                          <Icon
                            icon={
                              user.emailConfirmed
                                ? "solar:check-circle-bold"
                                : "solar:close-circle-bold"
                            }
                          />
                          {user.emailConfirmed
                            ? "Đã xác thực"
                            : "Chưa xác thực"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Icon
                            icon="solar:calendar-bold-duotone"
                            className="text-gray-400"
                          />
                          <span className="text-sm">
                            {formatDate(user.createdAt)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditRoles(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa quyền"
                          >
                            <Icon
                              icon="solar:shield-user-bold-duotone"
                              className="text-lg"
                            />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa người dùng"
                          >
                            <Icon
                              icon="solar:trash-bin-trash-bold-duotone"
                              className="text-lg"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Role Modal */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Icon
                    icon="solar:shield-user-bold-duotone"
                    className="text-2xl text-white"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Cập nhật quyền
                  </h3>
                  <p className="text-sm text-white/80">
                    {editingUser.fullName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <Icon
                  icon="solar:close-circle-bold"
                  className="text-2xl text-white"
                />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-3">
              {availableRoles.map((role) => (
                <label
                  key={role}
                  className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    selectedRoles.includes(role)
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Icon
                      icon={
                        role === "Admin"
                          ? "solar:shield-user-bold-duotone"
                          : "solar:user-bold-duotone"
                      }
                      className={`text-xl ${
                        selectedRoles.includes(role)
                          ? "text-purple-600"
                          : "text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-medium ${
                        selectedRoles.includes(role)
                          ? "text-purple-900"
                          : "text-gray-700"
                      }`}
                    >
                      {role}
                    </span>
                  </div>
                </label>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Icon
                  icon="solar:close-circle-bold-duotone"
                  className="text-lg"
                />
                Hủy
              </button>
              <button
                onClick={handleUpdateRoles}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/30 transition-all duration-200 flex items-center justify-center gap-2"
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
    </div>
  );
}
