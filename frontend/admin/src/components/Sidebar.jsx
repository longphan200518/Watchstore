import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const menuIcons = {
  Dashboard: "solar:graph-new-bold-duotone",
  "Quản lý sản phẩm": "solar:box-bold-duotone",
  "Quản lý đơn hàng": "solar:cart-large-4-bold-duotone",
  "Quản lý thương hiệu": "solar:tag-bold-duotone",
  "Quản lý người dùng": "solar:users-group-rounded-bold-duotone",
  "Quản lý đánh giá": "solar:star-bold-duotone",
};

export default function Sidebar({ navItems }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-slate-900 text-white rounded-lg shadow-lg"
      >
        <Icon icon={isMobileMenuOpen ? "solar:close-square-bold" : "solar:hamburger-menu-bold"} className="text-2xl" />
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 w-72 h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white shadow-2xl flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
      {/* Logo Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
            <Icon icon="solar:watch-bold" className="text-2xl text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Watchstore
            </h1>
            <p className="text-xs text-gray-400">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            const icon = menuIcons[item.label] || "solar:chart-2-bold-duotone";
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30"
                    : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon
                  icon={icon}
                  className={`text-xl transition-transform duration-200 ${
                    active ? "scale-110" : "group-hover:scale-110"
                  }`}
                />
                <span>{item.label}</span>
                {active && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Admin Info & Logout */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin</p>
            <p className="text-xs text-gray-400 truncate">admin@gmail.com</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full px-4 py-2.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 group"
        >
          <Icon
            icon="solar:logout-2-bold-duotone"
            className="text-lg group-hover:rotate-12 transition-transform"
          />
          <span>Đăng xuất</span>
        </button>
      </nav>
      </aside>
    </>
  );
}
