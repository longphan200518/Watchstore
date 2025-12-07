import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useToast } from "../contexts/ToastContext";

export default function Profile() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("info"); // info, password, addresses
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);

    // Check auth
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
          fullName: parsedUser.fullName || "",
          email: parsedUser.email || "",
          phoneNumber: parsedUser.phoneNumber || "",
        });
      } catch (e) {
        console.error("Failed to load user:", e);
      }
    }
    setLoading(false);
  }, [navigate]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateInfo = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("http://localhost:5221/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      const result = await response.json();
      if (result.success) {
        const updatedUser = { ...user, ...formData };
        const storage = localStorage.getItem("token") ? "localStorage" : "sessionStorage";
        (storage === "localStorage" ? localStorage : sessionStorage).setItem(
          "user",
          JSON.stringify(updatedUser)
        );
        setUser(updatedUser);
        addToast("Cập nhật thông tin thành công!", "success", 2000);
      } else {
        addToast(result.message || "Cập nhật thất bại", "error", 2000);
      }
    } catch (err) {
      addToast(err.message || "Có lỗi xảy ra", "error", 2000);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("Mật khẩu không trùng khớp", "warning", 2000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      addToast("Mật khẩu phải có ít nhất 6 ký tự", "warning", 2000);
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await fetch("http://localhost:5221/api/users/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const result = await response.json();
      if (result.success) {
        addToast("Đổi mật khẩu thành công!", "success", 2000);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        addToast(result.message || "Đổi mật khẩu thất bại", "error", 2000);
      }
    } catch (err) {
      addToast(err.message || "Có lỗi xảy ra", "error", 2000);
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"}`}>
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          <p className={isDark ? "text-gray-400" : "text-gray-600"}>Đang tải...</p>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"}`}>
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1000px] mx-auto px-6 lg:px-12 py-12">
        <h1 className={`text-4xl font-light tracking-tight mb-12 ${isDark ? "text-white" : "text-black"}`}>
          Tài khoản của bạn
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 space-y-2 h-fit ${isDark ? "bg-neutral-900" : "bg-white"} rounded-lg p-4 border ${isDark ? "border-white/10" : "border-black/5"}`}>
            <button
              onClick={() => setTab("info")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 ${
                tab === "info"
                  ? isDark
                    ? "bg-amber-600 text-white"
                    : "bg-amber-500 text-white"
                  : isDark
                  ? "text-gray-300 hover:bg-neutral-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon icon="teenyicons:user-outline" width={16} />
              Thông tin cá nhân
            </button>
            <button
              onClick={() => setTab("password")}
              className={`w-full text-left px-4 py-3 rounded-lg transition flex items-center gap-2 ${
                tab === "password"
                  ? isDark
                    ? "bg-amber-600 text-white"
                    : "bg-amber-500 text-white"
                  : isDark
                  ? "text-gray-300 hover:bg-neutral-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <Icon icon="teenyicons:lock-outline" width={16} />
              Đổi mật khẩu
            </button>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {tab === "info" && (
              <div className={`rounded-lg p-8 border ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${isDark ? "text-white" : "text-black"}`}>
                  Thông tin cá nhân
                </h2>
                <form onSubmit={handleUpdateInfo} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Họ tên
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white placeholder-gray-500"
                          : "bg-white border-black/10 text-black placeholder-gray-400"
                      }`}
                      placeholder="Nhập họ tên"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className={`w-full px-4 py-2 rounded-lg border transition ${
                        isDark
                          ? "bg-neutral-700 border-white/10 text-gray-400"
                          : "bg-gray-100 border-black/10 text-gray-600"
                      }`}
                    />
                    <p className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      Email không thể thay đổi
                    </p>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-2 rounded-lg border transition ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white placeholder-gray-500"
                          : "bg-white border-black/10 text-black placeholder-gray-400"
                      }`}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full py-3 rounded-lg font-semibold uppercase tracking-widest transition ${
                      isDark
                        ? "bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-700 disabled:text-gray-400"
                        : "bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    }`}
                  >
                    {saving ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </form>
              </div>
            )}

            {tab === "password" && (
              <div className={`rounded-lg p-8 border ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"}`}>
                <h2 className={`text-2xl font-semibold mb-6 ${isDark ? "text-white" : "text-black"}`}>
                  Đổi mật khẩu
                </h2>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 rounded-lg border transition ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white placeholder-gray-500"
                          : "bg-white border-black/10 text-black placeholder-gray-400"
                      }`}
                      placeholder="Nhập mật khẩu hiện tại"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 rounded-lg border transition ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white placeholder-gray-500"
                          : "bg-white border-black/10 text-black placeholder-gray-400"
                      }`}
                      placeholder="Nhập mật khẩu mới"
                      required
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                      Xác nhận mật khẩu
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className={`w-full px-4 py-2 rounded-lg border transition ${
                        isDark
                          ? "bg-neutral-800 border-white/10 text-white placeholder-gray-500"
                          : "bg-white border-black/10 text-black placeholder-gray-400"
                      }`}
                      placeholder="Xác nhận mật khẩu mới"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className={`w-full py-3 rounded-lg font-semibold uppercase tracking-widest transition ${
                      isDark
                        ? "bg-amber-600 hover:bg-amber-700 text-white disabled:bg-gray-700 disabled:text-gray-400"
                        : "bg-amber-500 hover:bg-amber-600 text-white disabled:bg-gray-300 disabled:text-gray-500"
                    }`}
                  >
                    {saving ? "Đang xử lý..." : "Đổi mật khẩu"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
