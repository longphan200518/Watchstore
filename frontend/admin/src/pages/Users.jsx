import { useEffect, useState } from "react";
import { getUsers, updateUserRoles, deleteUser } from "../services/userService";
import { formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";

export default function Users() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
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
        setShowRoleModal(false);
        fetchUsers();
        alert("Cập nhật quyền thành công");
      } else {
        alert(response.message || "Không thể cập nhật");
      }
    } catch (err) {
      alert("Lỗi khi cập nhật");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;
    try {
      const response = await deleteUser(id);
      if (response.success) {
        fetchUsers();
      } else {
        alert("Không thể xóa người dùng");
      }
    } catch (err) {
      alert("Lỗi khi xóa người dùng");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar navItems={navItems} />

      <main className="ml-64 p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Quản lý người dùng hệ thống</p>
            <h2 className="text-3xl font-semibold text-gray-900">Người dùng</h2>
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600">
            Đang tải...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách người dùng
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {users.length} người dùng
                  </p>
                </div>
              </div>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Họ tên</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Số điện thoại</th>
                  <th className="px-6 py-3 text-left">Quyền</th>
                  <th className="px-6 py-3 text-left">Trạng thái</th>
                  <th className="px-6 py-3 text-left">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {user.fullName}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {user.phoneNumber || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {user.roles && user.roles.length > 0 ? (
                          user.roles.map((role) => (
                            <span
                              key={role}
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                role === "Admin"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-blue-100 text-blue-700"
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
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.isEmailVerified
                            ? "bg-green-50 text-green-700 border border-green-100"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                        }`}
                      >
                        {user.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEditRoles(user)}
                        className="px-3 py-1.5 text-xs rounded border border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Quyền
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-3 py-1.5 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Role Modal */}
      {showRoleModal && editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Cập nhật quyền: {editingUser.fullName}
            </h3>
            <div className="space-y-3 mb-6">
              {availableRoles.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedRoles.includes(role)}
                    onChange={() => toggleRole(role)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-700 font-medium">{role}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleUpdateRoles}
                className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-600"
              >
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
