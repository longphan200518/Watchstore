import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@iconify/react";
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import SearchBox from "./SearchBox";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isDark = false;
  const [language, setLanguage] = useState("vi");
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [megaMenuOpen, setMegaMenuOpen] = useState(null); // 'categories', 'brands'
  const dropdownRef = useRef(null);
  const megaMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { getTotalItems } = useCart();
  const { getTotalWishlist, clearWishlist } = useWishlist();
  const cartCount = getTotalItems();
  const wishlistCount = getTotalWishlist();

  useEffect(() => {
    fetch('http://localhost:5221/api/categories?pageSize=100')
      .then(res => res.json())
      .then(res => setCategories(res.data?.items || res.data || []));
    fetch('http://localhost:5221/api/brands?pageSize=100')
      .then(res => res.json())
      .then(res => setBrands(res.data?.items || res.data || []));
  }, []);

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
    localStorage.removeItem("cart");
    localStorage.removeItem("wishlist");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("refreshTokenExpiresAt");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("wishlist");
    clearWishlist();
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled || !isHomePage
          ? isDark
            ? "bg-black/95 backdrop-blur-xl shadow-2xl rounded-3xl mx-4 lg:mx-6 my-2"
            : "bg-white/95 backdrop-blur-xl shadow-lg rounded-3xl mx-4 lg:mx-6 my-2"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-[1800px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between transition-all duration-300 ease-out h-24">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center">
              <span
                className={`font-serif transition-all duration-300 ease-out tracking-tight group-hover:text-amber-600 ${
                  scrolled || !isHomePage ? "text-xl" : "text-3xl"
                } ${isDark ? "text-amber-500" : "text-amber-600"}`}
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
            {/* Tất cả sản phẩm */}
            <Link
              to="/products"
              className={`hover:text-black transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
            >
              {language === "vi" ? "Tất Cả Sản Phẩm" : "All Products"}
            </Link>

            {/* Danh Mục */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen("categories")}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                className={`hover:text-black transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {language === "vi" ? "Danh Mục" : "Categories"}
              </button>
              {megaMenuOpen === "categories" && (
                <div className="absolute left-0 top-full w-[400px] pt-6">
                  <div className={`border shadow-2xl animate-fade-in ${isDark ? "bg-black border-gray-900" : "bg-white border-gray-200"}`}>
                    <div className="p-8">
                      <ul className="space-y-4">
                        {categories.map((item, index) => (
                          <li key={index}>
                            <Link
                              to={`/products?categoryId=${item.id}`}
                              className={`text-sm hover:text-black transition-colors duration-300 block ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              onClick={() => setMegaMenuOpen(null)}
                            >
                              {item.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Thương Hiệu */}
            <div
              className="relative"
              onMouseEnter={() => setMegaMenuOpen("brands")}
              onMouseLeave={() => setMegaMenuOpen(null)}
            >
              <button
                className={`hover:text-black transition-colors duration-300 text-sm tracking-[0.15em] uppercase font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                {language === "vi" ? "Thương Hiệu" : "Brands"}
              </button>
              {megaMenuOpen === "brands" && (
                <div className="absolute left-0 top-full w-[600px] pt-6">
                  <div className={`border shadow-2xl animate-fade-in ${isDark ? "bg-black border-gray-900" : "bg-white border-gray-200"}`}>
                    <div className="p-8 grid grid-cols-2 gap-8">
                      <ul className="space-y-4">
                        {brands.slice(0, Math.ceil(brands.length / 2)).map((brand, index) => (
                          <li key={index}>
                            <Link
                              to={`/products?brandId=${brand.id}`}
                              className={`text-sm hover:text-black transition-colors duration-300 block ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              onClick={() => setMegaMenuOpen(null)}
                            >
                              {brand.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <ul className="space-y-4">
                        {brands.slice(Math.ceil(brands.length / 2)).map((brand, index) => (
                          <li key={index}>
                            <Link
                              to={`/products?brandId=${brand.id}`}
                              className={`text-sm hover:text-black transition-colors duration-300 block ${isDark ? "text-gray-400" : "text-gray-600"}`}
                              onClick={() => setMegaMenuOpen(null)}
                            >
                              {brand.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
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
                className={`block py-3 hover:text-black transition-colors text-sm tracking-[0.15em] uppercase font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {language === "vi" ? "Tất Cả Sản Phẩm" : "All Products"}
              </Link>
              <div className="py-2">
                <span className={`block py-2 text-sm tracking-[0.15em] uppercase font-bold border-b ${isDark ? "border-gray-800 text-white" : "border-gray-200 text-black"}`}>
                  {language === "vi" ? "Danh Mục" : "Categories"}
                </span>
                <ul className={`mt-2 pl-4 space-y-2 border-l ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                  {categories.map((item, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/products?categoryId=${item.id}`}
                        className={`block py-1 text-sm hover:text-black ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="py-2">
                <span className={`block py-2 text-sm tracking-[0.15em] uppercase font-bold border-b ${isDark ? "border-gray-800 text-white" : "border-gray-200 text-black"}`}>
                  {language === "vi" ? "Thương Hiệu" : "Brands"}
                </span>
                <ul className={`mt-2 pl-4 space-y-2 border-l ${isDark ? "border-gray-800" : "border-gray-100"}`}>
                  {brands.map((brand, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/products?brandId=${brand.id}`}
                        className={`block py-1 text-sm hover:text-black ${isDark ? "text-gray-400" : "text-gray-600"}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
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
