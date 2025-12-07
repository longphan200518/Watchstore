import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useCart } from "../contexts/CartContext";

export default function Header({ isDark = false, onThemeToggle = () => {} }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const cartCount = getTotalItems();

  useEffect(() => {
    // Kiểm tra token khi component mount
    checkAuth();
  }, []);

  const checkAuth = () => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (token) {
      const userData =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
          setIsLoggedIn(true);
        } catch (e) {
          setIsLoggedIn(false);
        }
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    // Xóa token và user data
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExpiresAt");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshTokenExpiresAt");
    sessionStorage.removeItem("user");

    setIsLoggedIn(false);
    setUser(null);
    setDropdownOpen(false);
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const getInitials = (fullName) => {
    return fullName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-md ${
        isDark
          ? "bg-black/90 border-b border-white/10"
          : "bg-white/95 border-b border-black/5 shadow-sm"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white font-black text-xl">W</span>
            </div>
            <div
              className={`text-xl font-light tracking-[0.2em] uppercase ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Watchstore
            </div>
          </a>

          <nav
            className={`hidden lg:flex items-center gap-10 text-sm font-normal tracking-wide ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <a
              className={`transition hover:text-amber-600 uppercase ${
                isDark ? "hover:text-amber-400" : ""
              }`}
              href="#collections"
            >
              Bộ sưu tập
            </a>
            <a
              className={`transition hover:text-amber-600 uppercase ${
                isDark ? "hover:text-amber-400" : ""
              }`}
              href="/products"
            >
              Sản phẩm
            </a>
            <a
              className={`transition hover:text-amber-600 uppercase ${
                isDark ? "hover:text-amber-400" : ""
              }`}
              href="#brands"
            >
              Thương hiệu
            </a>
            <a
              className={`transition hover:text-amber-600 uppercase ${
                isDark ? "hover:text-amber-400" : ""
              }`}
              href="#about"
            >
              Giới thiệu
            </a>
          </nav>

          <div className="flex items-center gap-6">
            <button
              className={`hidden lg:flex items-center gap-2 text-sm tracking-wide transition ${
                isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Icon icon="teenyicons:search-outline" width={16} />
              Search
            </button>

            {/* Auth Section */}
            {!isLoggedIn ? (
              <a
                href="/login"
                className={`flex items-center gap-2 text-sm tracking-wide transition ${
                  isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                <Icon icon="teenyicons:user-outline" width={16} />
                Đăng nhập
              </a>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition ${
                    isDark
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-amber-500 text-white hover:bg-amber-600"
                  }`}
                >
                  {getInitials(user?.fullName || "User")}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-56 rounded-lg shadow-lg overflow-hidden ${
                      isDark
                        ? "bg-neutral-900 border border-white/10"
                        : "bg-white border border-black/5"
                    }`}
                  >
                    <div
                      className={`px-4 py-3 border-b ${
                        isDark ? "border-white/10" : "border-black/5"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        Xin chào {user?.fullName}!
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <a
                        href="/profile"
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                          isDark
                            ? "text-gray-300 hover:bg-white/5"
                            : "text-gray-700 hover:bg-black/5"
                        }`}
                      >
                        <Icon
                          icon="teenyicons:user-circle-outline"
                          width={16}
                        />
                        Tài khoản của tôi
                      </a>
                      <a
                        href="/orders"
                        className={`flex items-center gap-2 px-4 py-2 text-sm transition ${
                          isDark
                            ? "text-gray-300 hover:bg-white/5"
                            : "text-gray-700 hover:bg-black/5"
                        }`}
                      >
                        <Icon icon="teenyicons:box-outline" width={16} />
                        Đơn hàng của tôi
                      </a>
                    </div>

                    <div
                      className={`py-2 border-t ${
                        isDark ? "border-white/10" : "border-black/5"
                      }`}
                    >
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition ${
                          isDark
                            ? "text-red-400 hover:bg-white/5"
                            : "text-red-600 hover:bg-black/5"
                        }`}
                      >
                        <Icon icon="teenyicons:logout-outline" width={16} />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => navigate("/cart")}
              className={`relative px-6 py-3 text-sm tracking-wider font-normal transition flex items-center gap-2 ${
                isDark
                  ? "bg-white text-black hover:bg-gray-100"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              <Icon icon="teenyicons:cart-outline" width={16} />
              CART
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={onThemeToggle}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
                isDark
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-black/5 hover:bg-black/10 text-black"
              }`}
              aria-label="Toggle theme"
            >
              <Icon
                icon={
                  isDark ? "teenyicons:sun-outline" : "teenyicons:moon-outline"
                }
                width={16}
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
