import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getUsers, updateUserRoles, deleteUser } from "../services/userService";
import { formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../contexts/ToastContext";

export default function Users() {
  const { showToast } = useToast();

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
    <div className="min-h-screen bg-[#F8F8F8] font-sans">
      <Sidebar />

      <main className="lg:ml-72 min-h-screen">
        <AdminHeader
          title="Quản lý người dùng"
          subtitle="Trang chủ / Người dùng"
        />

        <div className="px-4 lg:px-8 pb-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border border-[#EAEAEA] p-6 flex flex-col justify-between hover:border-[#111111] transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-light mb-2">Tổng người dùng</p>
              <h4 className="text-3xl font-serif text-[#111111]">{users.length}</h4>
            </div>
            <div className="bg-white border border-[#EAEAEA] p-6 flex flex-col justify-between hover:border-[#111111] transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-light mb-2">Admin</p>
              <h4 className="text-3xl font-serif text-[#111111]">{users.filter((u) => u.roles?.includes("Admin")).length}</h4>
            </div>
            <div className="bg-white border border-[#EAEAEA] p-6 flex flex-col justify-between hover:border-[#111111] transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-light mb-2">Email xác thực</p>
              <h4 className="text-3xl font-serif text-[#111111]">{users.filter((u) => u.emailConfirmed).length}</h4>
            </div>
            <div className="bg-white border border-[#EAEAEA] p-6 flex flex-col justify-between hover:border-[#111111] transition-colors">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-light mb-2">Khách hàng</p>
              <h4 className="text-3xl font-serif text-[#111111]">
                {users.filter((u) => u.roles?.includes("User") && !u.roles?.includes("Admin")).length}
              </h4>
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
            <div className="bg-white border border-[#EAEAEA] overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-[#F8F8F8] border-b border-[#EAEAEA]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Người dùng
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Quyền
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Trạng thái
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Ngày tạo
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-widest">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAEAEA]">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-[#F8F8F8] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-[#111111] flex items-center justify-center text-white font-serif text-lg">
                            {user.fullName?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-[#111111]">
                              {user.fullName || "Chưa cập nhật"}
                            </p>
                            <p className="text-xs text-gray-500 font-light mt-0.5">
                              ID: {String(user.id).substring(0, 8)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#111111] font-medium">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-light">
                        {user.phoneNumber || "—"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {user.roles && user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <span
                                key={role}
                                className={`inline-block px-3 py-1 text-xs font-medium border uppercase tracking-wider ${
                                  role === "Admin"
                                    ? "bg-[#111111] border-[#111111] text-white"
                                    : "bg-white border-[#EAEAEA] text-[#111111]"
                                }`}
                              >
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
                          className={`inline-block px-3 py-1 text-xs font-medium border uppercase tracking-wider ${
                            user.emailConfirmed
                              ? "bg-[#F8F8F8] border-[#111111] text-[#111111]"
                              : "bg-[#F8F8F8] border-[#EAEAEA] text-gray-500"
                          }`}
                        >
                          {user.emailConfirmed ? "Đã xác thực" : "Chưa xác thực"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 font-light">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEditRoles(user)}
                            className="text-gray-400 hover:text-[#111111] transition-colors"
                            title="Chỉnh sửa quyền"
                          >
                            <Icon icon="solar:shield-user-outline" className="text-lg" />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Xóa người dùng"
                          >
                            <Icon icon="solar:trash-bin-trash-outline" className="text-lg" />
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
