import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import SearchBox from "./SearchBox";

export default function Header({ isDark = false, onThemeToggle = () => {} }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState("vi");
  const [megaMenuOpen, setMegaMenuOpen] = useState(null); // 'men', 'women', 'brands', 'collections'
  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { getTotalWishlist } = useWishlist();
  const cartCount = getTotalItems();
  const wishlistCount = getTotalWishlist();

  useEffect(() => {
    const savedLang = localStorage.getItem("language") || "vi";
    setLanguage(savedLang);
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "vi" ? "en" : "vi";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  useEffect(() => {
    checkAuth();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const isHomePage = location.pathname === "/";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || !isHomePage
          ? isDark
            ? "bg-black/95 backdrop-blur-xl border-b border-gray-900 shadow-2xl"
            : "bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center">
              <span
                className={`font-serif text-3xl tracking-tight group-hover:text-amber-600 transition-colors duration-300 ${
                  isDark ? "text-amber-500" : "text-amber-600"
                }`}
              >
                WatchStore
              </span>
            </div>
          </Link>

          {/* Search Box - Desktop */}
          <div className="hidden lg:block flex-1 max-w-sm mx-12">
            <SearchBox isDark={isDark} language={language} />
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {/* Nam - Men's Watches */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen("men")}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                className={`hover:text-amber-600 transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Nam" : "Men"}
              </button>
              {megaMenuOpen === "men" && (
                <div className="absolute left-0 top-full w-[600px] pt-6">
                  <div
                    className={`border shadow-2xl animate-fade-in ${
                      isDark
                        ? "bg-black border-gray-900"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="px-8 pb-8 grid grid-cols-2 gap-8">
                      <div>
                        <h3
                          className={`text-xs tracking-[0.2em] uppercase mb-6 font-semibold ${
                            isDark ? "text-amber-500" : "text-amber-600"
                          }`}
                        >
                          {language === "vi" ? "Danh Mục" : "Categories"}
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { vi: "Dress Watch", en: "Dress Watch" },
                            { vi: "Diver Watch", en: "Diver Watch" },
                            { vi: "Chronograph", en: "Chronograph" },
                            { vi: "Luxury Line", en: "Luxury Line" },
                            { vi: "Sport / Casual", en: "Sport / Casual" },
                          ].map((item, index) => (
                            <li key={index}>
                              <Link
                                to={`/products?category=men-${item.en
                                  .toLowerCase()
                                  .replace(/ /g, "-")}`}
                                className={`text-sm hover:text-amber-600 transition-colors duration-300 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                                onClick={() => setMegaMenuOpen(null)}
                              >
                                {language === "vi" ? item.vi : item.en}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className={`text-center p-6 border ${
                            isDark ? "border-gray-900" : "border-gray-200"
                          }`}
                        >
                          <Icon
                            icon="mdi:watch"
                            className={`w-16 h-16 mx-auto mb-4 ${
                              isDark ? "text-amber-500" : "text-amber-600"
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {language === "vi"
                              ? "Khám phá bộ sưu tập"
                              : "Explore Collection"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Nữ - Women's Watches */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen("women")}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                className={`hover:text-amber-600 transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Nữ" : "Women"}
              </button>
              {megaMenuOpen === "women" && (
                <div className="absolute left-0 top-full w-[500px] pt-6">
                  <div
                    className={`border shadow-2xl animate-fade-in ${
                      isDark
                        ? "bg-black border-gray-900"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="px-8 pb-8 grid grid-cols-2 gap-8">
                      <div>
                        <h3
                          className={`text-xs tracking-[0.2em] uppercase mb-6 font-semibold ${
                            isDark ? "text-amber-500" : "text-amber-600"
                          }`}
                        >
                          {language === "vi" ? "Danh Mục" : "Categories"}
                        </h3>
                        <ul className="space-y-3">
                          {[
                            { vi: "Elegant", en: "Elegant" },
                            { vi: "Classic", en: "Classic" },
                            { vi: "Minimalist", en: "Minimalist" },
                            { vi: "Luxury", en: "Luxury" },
                          ].map((item, index) => (
                            <li key={index}>
                              <Link
                                to={`/products?category=women-${item.en.toLowerCase()}`}
                                className={`text-sm hover:text-amber-600 transition-colors duration-300 ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                }`}
                                onClick={() => setMegaMenuOpen(null)}
                              >
                                {item.vi}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex items-center justify-center">
                        <div
                          className={`text-center p-6 border ${
                            isDark ? "border-gray-900" : "border-gray-200"
                          }`}
                        >
                          <Icon
                            icon="mdi:watch-variant"
                            className={`w-16 h-16 mx-auto mb-4 ${
                              isDark ? "text-amber-500" : "text-amber-600"
                            }`}
                          />
                          <p
                            className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            {language === "vi"
                              ? "Khám phá bộ sưu tập"
                              : "Explore Collection"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thương hiệu - Brands */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen("brands")}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                className={`hover:text-amber-600 transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Thương Hiệu" : "Brands"}
              </button>
              {megaMenuOpen === "brands" && (
                <div className="absolute left-0 top-full w-[700px] pt-6">
                  <div
                    className={`border shadow-2xl animate-fade-in ${
                      isDark
                        ? "bg-black border-gray-900"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="px-8 pb-8 grid grid-cols-3 gap-8">
                      {[
                        ["Rolex", "Omega", "Patek Philippe"],
                        ["Seiko", "Casio", "Tissot"],
                        ["Citizen", "Tag Heuer", "Daniel Wellington"],
                      ].map((column, colIndex) => (
                        <div key={colIndex}>
                          <ul className="space-y-3">
                            {column.map((brand, index) => (
                              <li key={index}>
                                <Link
                                  to={`/products?brand=${brand
                                    .toLowerCase()
                                    .replace(/ /g, "-")}`}
                                  className={`text-sm hover:text-amber-600 transition-colors duration-300 ${
                                    isDark ? "text-gray-400" : "text-gray-600"
                                  }`}
                                  onClick={() => setMegaMenuOpen(null)}
                                >
                                  {brand}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bộ sưu tập - Collections */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen("collections")}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <Link
                to="/products"
                className={`hover:text-amber-600 transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Bộ Sưu Tập" : "Collections"}
              </Link>
              {megaMenuOpen === "collections" && (
                <div className="absolute left-0 top-full w-[500px] pt-6">
                  <div
                    className={`border shadow-2xl animate-fade-in ${
                      isDark
                        ? "bg-black border-gray-900"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="px-8 pb-8">
                      <ul className="space-y-3">
                        {[
                          { vi: "Limited Edition", en: "Limited Edition" },
                          { vi: "New Arrivals", en: "New Arrivals" },
                          { vi: "Trending", en: "Trending" },
                          { vi: "Best Sellers", en: "Best Sellers" },
                        ].map((item, index) => (
                          <li key={index}>
                            <Link
                              to={`/products?collection=${item.en
                                .toLowerCase()
                                .replace(/ /g, "-")}`}
                              className={`text-sm hover:text-amber-600 transition-colors duration-300 flex items-center gap-3 ${
                                isDark ? "text-gray-400" : "text-gray-600"
                              }`}
                              onClick={() => setMegaMenuOpen(null)}
                            >
                              <Icon
                                icon="mdi:star"
                                className="w-4 h-4 text-amber-600"
                              />
                              {language === "vi" ? item.vi : item.en}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Phụ kiện - Accessories */}
            <Link
              to="/products?category=accessories"
              className={`hover:text-amber-600 transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {language === "vi" ? "Phụ Kiện" : "Accessories"}
            </Link>

            {/* Sale / Ưu đãi */}
            <Link
              to="/products?sale=true"
              className={`hover:text-amber-600 transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium flex items-center gap-2 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <Icon icon="mdi:tag" className="w-4 h-4" />
              {language === "vi" ? "Sale" : "Sale"}
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/wishlist" className="relative group">
              <Icon
                icon="mdi:heart-outline"
                className={`w-6 h-6 group-hover:text-red-500 transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative group">
              <Icon
                icon="mdi:cart-outline"
                className={`w-6 h-6 group-hover:text-amber-600 transition-colors duration-300 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-semibold">
                  {cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-semibold group-hover:bg-amber-600 transition-colors duration-300">
                    {user?.fullName ? getInitials(user.fullName) : "U"}
                  </div>
                </button>

                {dropdownOpen && (
                  <div
                    className={`absolute right-0 top-full mt-6 w-64 border shadow-2xl animate-fade-in ${
                      isDark
                        ? "bg-black border-gray-900"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div
                      className={`p-6 border-b ${
                        isDark ? "border-gray-900" : "border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-sm font-semibold mb-1 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {user?.fullName || "User"}
                      </p>
                      <p
                        className={`text-xs ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {user?.email || ""}
                      </p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className={`flex items-center gap-3 px-4 py-3 hover:text-amber-600 transition-all duration-300 text-sm ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Icon icon="mdi:account" className="w-5 h-5" />
                        <span>
                          {language === "vi" ? "Tài khoản" : "Profile"}
                        </span>
                      </Link>
                      <Link
                        to="/orders"
                        className={`flex items-center gap-3 px-4 py-3 hover:text-amber-600 transition-all duration-300 text-sm ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => setDropdownOpen(false)}
                      >
                        <Icon icon="mdi:package-variant" className="w-5 h-5" />
                        <span>{language === "vi" ? "Đơn hàng" : "Orders"}</span>
                      </Link>
                      <button
                        onClick={() => {
                          onThemeToggle();
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 hover:text-amber-600 transition-all duration-300 text-sm text-left ${
                          isDark
                            ? "text-gray-300 hover:bg-gray-900"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <Icon
                          icon={
                            isDark
                              ? "mdi:white-balance-sunny"
                              : "mdi:moon-waning-crescent"
                          }
                          className="w-5 h-5"
                        />
                        <span>
                          {isDark
                            ? language === "vi"
                              ? "Chế độ sáng"
                              : "Light Mode"
                            : language === "vi"
                            ? "Chế độ tối"
                            : "Dark Mode"}
                        </span>
                      </button>
                      <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 transition-all duration-300 text-sm text-left ${
                          isDark ? "hover:bg-gray-900" : "hover:bg-gray-50"
                        }`}
                      >
                        <Icon icon="mdi:logout" className="w-5 h-5" />
                        <span>
                          {language === "vi" ? "Đăng xuất" : "Logout"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-6 py-3 border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white transition-all duration-300 text-xs tracking-[0.15em] uppercase font-medium"
              >
                {language === "vi" ? "Đăng nhập" : "Sign In"}
              </Link>
            )}

            <button
              onClick={toggleLanguage}
              className={`px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold border ${
                isDark
                  ? "bg-black text-gray-300 hover:text-amber-500 border-gray-800"
                  : "bg-gray-100 text-gray-700 hover:text-amber-600 border-gray-200"
              }`}
              aria-label="Toggle language"
            >
              {language === "vi" ? "EN" : "VI"}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden transition-colors ${
                isDark
                  ? "text-gray-300 hover:text-amber-500"
                  : "text-gray-700 hover:text-amber-600"
              }`}
            >
              <Icon
                icon={mobileMenuOpen ? "mdi:close" : "mdi:menu"}
                className="w-7 h-7"
              />
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            className={`lg:hidden border-t animate-fade-in ${
              isDark ? "border-gray-800" : "border-gray-200"
            }`}
          >
            <div className="py-6 space-y-4 px-6">
              {/* Mobile Search */}
              <div className="mb-4">
                <SearchBox isDark={isDark} language={language} />
              </div>

              <Link
                to="/products"
                className={`block py-3 hover:text-amber-600 transition-colors text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "vi" ? "Bộ Sưu Tập" : "Collections"}
              </Link>
              <Link
                to="/about"
                className={`block py-3 hover:text-amber-600 transition-colors text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "vi" ? "Giới Thiệu" : "About"}
              </Link>
              <Link
                to="/contact"
                className={`block py-3 hover:text-amber-600 transition-colors text-sm tracking-[0.15em] uppercase font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "vi" ? "Liên Hệ" : "Contact"}
              </Link>
              <Link
                to="/wishlist"
                className={`block py-3 hover:text-red-500 transition-colors text-sm tracking-[0.15em] uppercase font-medium flex items-center gap-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Icon icon="mdi:heart-outline" className="w-5 h-5" />
                {language === "vi" ? "Danh sách yêu thích" : "Wishlist"}
                {wishlistCount > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
