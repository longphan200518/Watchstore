import { Link, useLocation, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";

const navItems = [
  { label: "Dashboard", path: "/" },
  { label: "Quản lý sản phẩm", path: "/products" },
  { label: "Thương hiệu", path: "/brands" },
  { label: "Danh mục", path: "/categories" },
  { label: "Tồn kho", path: "/inventory" },
  { label: "Đơn hàng", path: "/orders" },
  { label: "Khách hàng", path: "/users" },
  { label: "Đánh giá", path: "/reviews" },
  { label: "Cài đặt", path: "/website-settings" },
];

const menuIcons = {
  Dashboard: "solar:graph-new-bold-duotone",
  "Quản lý sản phẩm": "solar:box-bold-duotone",
  "Thương hiệu": "solar:tag-bold-duotone",
  "Danh mục": "solar:folder-2-bold-duotone",
  "Tồn kho": "solar:widget-bold-duotone",
  "Đơn hàng": "solar:cart-large-4-bold-duotone",
  "Khách hàng": "solar:users-group-rounded-bold-duotone",
  "Đánh giá": "solar:star-bold-duotone",
  "Cài đặt": "solar:settings-bold-duotone",
};

export default function Sidebar() {
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
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[#111111] text-white rounded-lg shadow-lg"
      >
        <Icon
          icon={isMobileMenuOpen ? "solar:close-square-bold" : "solar:hamburger-menu-bold"}
          className="text-2xl"
        />
      </button>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
        />
      )}

      <aside
        className={`fixed left-0 top-0 w-72 h-screen bg-[#111111] text-gray-300 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 border-r border-[#222222] ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-8 border-b border-[#222222]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <span className="text-[#111111] font-black text-xl font-serif">W</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
                Watchstore
              </h1>
              <p className="text-xs text-gray-400 font-light mt-1 uppercase tracking-widest">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== "/");
              // Fix for root path exactly matching
              const isActive = item.path === "/" ? location.pathname === "/" : location.pathname.startsWith(item.path);
              
              const icon = menuIcons[item.label] || "solar:chart-2-bold-duotone";
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-4 px-4 py-3 rounded text-sm transition-colors ${
                    isActive
                      ? "bg-white text-[#111111] font-medium"
                      : "text-gray-400 hover:bg-[#222222] hover:text-white font-light"
                  }`}
                >
                  <Icon
                    icon={icon}
                    className={`text-xl ${
                      isActive ? "text-[#111111]" : "text-gray-500 group-hover:text-white"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin Info & Logout */}
        <div className="p-4 border-t border-[#222222] space-y-3">
          <div className="flex items-center gap-3 px-3 py-3 rounded">
            <div className="w-10 h-10 bg-[#222222] flex items-center justify-center text-sm font-bold text-white uppercase font-serif">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-[#222222] rounded transition-colors flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
          >
            <Icon icon="solar:logout-2-outline" className="text-lg" />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>
    </>
  );
}
