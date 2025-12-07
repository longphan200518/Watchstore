import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useWishlist } from "../contexts/WishlistContext";

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [watches, setWatches] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("vi");
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [wishlistItems, setWishlistItems] = useState(new Set());

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    setIsDark(saved === "dark");
    const savedLang = localStorage.getItem("language") || "vi";
    setLanguage(savedLang);
  }, []);

  useEffect(() => {
    const newSet = new Set(
      watches
        .map((watch) => (isInWishlist(watch.id) ? watch.id : null))
        .filter(Boolean)
    );
    setWishlistItems(newSet);
  }, [watches, isInWishlist]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const brandId = searchParams.get("brandId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "latest";

  // Fetch brands
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch(
          "http://localhost:5221/api/brands?pageSize=100"
        );
        const result = await response.json();
        if (result.success) {
          setBrands(result.data?.items || []);
        }
      } catch (err) {
        console.error("Failed to load brands:", err);
      }
    };
    fetchBrands();
  }, []);

  // Fetch watches
  useEffect(() => {
    const fetchWatches = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          pageNumber: page,
          pageSize: 12,
          ...(search && { searchTerm: search }),
          ...(brandId && { brandId }),
          ...(minPrice && { minPrice }),
          ...(maxPrice && { maxPrice }),
          sortBy: sortBy,
        });

        const response = await fetch(
          `http://localhost:5221/api/watches?${params}`
        );
        const result = await response.json();

        if (result.success) {
          setWatches(result.data?.items || []);
          setError("");
        } else {
          setError(result.message || "Failed to load watches");
        }
      } catch (err) {
        setError("Failed to load products");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWatches();
  }, [page, search, brandId, minPrice, maxPrice, sortBy]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set("page", "1"); // Reset to page 1
    setSearchParams(newParams);
  };

  const handleAddToCart = (watch) => {
    addToCart(watch, 1);
    addToast(
      language === "vi"
        ? `${watch.name} đã được thêm vào giỏ hàng`
        : `${watch.name} added to cart`,
      "success",
      2000
    );
  };

  const handleWishlist = (watch) => {
    if (wishlistItems.has(watch.id)) {
      removeFromWishlist(watch.id);
      setWishlistItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(watch.id);
        return newSet;
      });
      addToast(
        language === "vi"
          ? "Đã xóa khỏi danh sách yêu thích"
          : "Removed from wishlist",
        "success"
      );
    } else {
      const result = addToWishlist(watch);
      if (result.success) {
        setWishlistItems((prev) => new Set(prev).add(watch.id));
        addToast(
          language === "vi"
            ? "Đã thêm vào danh sách yêu thích"
            : "Added to wishlist",
          "success"
        );
      } else {
        addToast(result.message, "error");
      }
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark ? "bg-black text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1800px] mx-auto px-6 lg:px-12 pt-32 pb-20">
        <div className="mb-16">
          <h1
            className={`font-serif text-5xl tracking-tight mb-3 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {language === "vi" ? "Bộ Sưu Tập Đồng Hồ" : "Watch Collections"}
          </h1>
          <div className="w-24 h-1 bg-amber-600"></div>
        </div>

        <div className="mb-12">
          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-6 p-8 border ${
              isDark
                ? "bg-black border-gray-900"
                : "bg-white border-gray-200 shadow-sm"
            }`}
          >
            <div>
              <label
                className={`block text-xs tracking-wider uppercase font-semibold mb-3 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {language === "vi" ? "Tìm Kiếm" : "Search"}
              </label>
              <input
                type="text"
                placeholder={
                  language === "vi" ? "Tên đồng hồ..." : "Watch name..."
                }
                value={search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className={`w-full px-4 py-3 border focus:border-amber-600 focus:outline-none transition-colors duration-300 ${
                  isDark
                    ? "bg-black border-gray-900 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs tracking-wider uppercase font-semibold mb-3 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {language === "vi" ? "Thương Hiệu" : "Brand"}
              </label>
              <select
                value={brandId}
                onChange={(e) => updateFilter("brandId", e.target.value)}
                className={`w-full px-4 py-3 border focus:border-amber-600 focus:outline-none transition-colors duration-300 ${
                  isDark
                    ? "bg-black border-gray-900 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              >
                <option value="">
                  {language === "vi" ? "Tất cả thương hiệu" : "All brands"}
                </option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className={`block text-xs tracking-wider uppercase font-semibold mb-3 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {language === "vi" ? "Giá Tối Thiểu" : "Min Price"}
              </label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className={`w-full px-4 py-3 border focus:border-amber-600 focus:outline-none transition-colors duration-300 ${
                  isDark
                    ? "bg-black border-gray-900 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-xs tracking-wider uppercase font-semibold mb-3 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {language === "vi" ? "Giá Tối Đa" : "Max Price"}
              </label>
              <input
                type="number"
                placeholder={language === "vi" ? "Không giới hạn" : "No limit"}
                value={maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className={`w-full px-4 py-3 border focus:border-amber-600 focus:outline-none transition-colors duration-300 ${
                  isDark
                    ? "bg-black border-gray-900 text-white placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                }`}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className={`px-6 py-3 border focus:border-amber-600 focus:outline-none transition-colors duration-300 text-sm font-medium ${
                isDark
                  ? "bg-black border-gray-900 text-white"
                  : "bg-white border-gray-300 text-gray-900"
              }`}
            >
              <option value="latest">
                {language === "vi" ? "Mới nhất" : "Latest"}
              </option>
              <option value="price-low">
                {language === "vi" ? "Giá: Thấp đến Cao" : "Price: Low to High"}
              </option>
              <option value="price-high">
                {language === "vi" ? "Giá: Cao đến Thấp" : "Price: High to Low"}
              </option>
              <option value="popular">
                {language === "vi" ? "Phổ biến nhất" : "Most Popular"}
              </option>
            </select>
            <p
              className={`text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {watches.length} {language === "vi" ? "sản phẩm" : "products"}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-12 p-6 bg-red-900/20 border border-red-500/50 text-red-400">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-32">
            <div className="inline-flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-amber-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <p
              className={`mt-6 text-sm font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "vi"
                ? "Đang tải sản phẩm..."
                : "Loading products..."}
            </p>
          </div>
        ) : watches.length === 0 ? (
          <div className="text-center py-32">
            <Icon
              icon="mdi:watch-variant-outline"
              className={`w-20 h-20 mx-auto mb-6 ${
                isDark ? "text-gray-700" : "text-gray-300"
              }`}
            />
            <p
              className={`text-lg font-medium ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "vi"
                ? "Không tìm thấy sản phẩm"
                : "No products found"}
            </p>
            <p
              className={`text-sm mt-2 ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}
            >
              {language === "vi"
                ? "Vui lòng điều chỉnh bộ lọc tìm kiếm"
                : "Please adjust your search filters"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
              {watches.map((watch, index) => (
                <Link
                  key={watch.id}
                  to={`/products/${watch.id}`}
                  className="group block animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`relative aspect-[3/4] overflow-hidden mb-6 ${
                      isDark ? "bg-black border border-gray-900" : "bg-gray-100"
                    }`}
                  >
                    {watch.images && watch.images.length > 0 ? (
                      <img
                        src={watch.images[0].imageUrl}
                        alt={watch.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon
                          icon="mdi:watch-variant-outline"
                          className={`w-16 h-16 ${
                            isDark ? "text-gray-700" : "text-gray-300"
                          }`}
                        />
                      </div>
                    )}

                    {watch.status === "Limited" && (
                      <div className="absolute top-4 left-4 px-4 py-2 bg-amber-600 text-white text-xs tracking-wider uppercase font-semibold shadow-lg">
                        {language === "vi"
                          ? "Số Lượng Có Hạn"
                          : "Limited Edition"}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <p className="text-amber-600 text-xs tracking-widest uppercase font-semibold">
                      {watch.brandName}
                    </p>
                    <h3
                      className={`font-serif text-xl leading-tight group-hover:text-amber-600 transition-colors duration-300 ${
                        isDark ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {watch.name}
                    </h3>

                    <div
                      className={`flex items-center gap-2 text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    >
                      {watch.caseSize && (
                        <>
                          <span>{watch.caseSize}</span>
                          <span>•</span>
                        </>
                      )}
                      <span>{watch.waterResistance}</span>
                    </div>

                    <div
                      className={`flex items-center justify-between pt-3 border-t gap-2 ${
                        isDark ? "border-gray-800" : "border-gray-200"
                      }`}
                    >
                      <p
                        className={`text-lg font-semibold ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(watch.price)}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(watch);
                          }}
                          className="p-3 border-2 border-amber-600 text-amber-600 hover:bg-amber-600 hover:text-white transition-all duration-300"
                          title={
                            language === "vi"
                              ? "Thêm vào giỏ hàng"
                              : "Add to Cart"
                          }
                        >
                          <Icon icon="mdi:cart-outline" className="w-5 h-5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleWishlist(watch);
                          }}
                          className={`p-3 border-2 transition-all duration-300 ${
                            wishlistItems.has(watch.id)
                              ? "bg-red-600 border-red-600 text-white"
                              : "border-gray-300 text-gray-600 hover:border-gray-400 dark:border-gray-700 dark:text-gray-400"
                          }`}
                          title={language === "vi" ? "Yêu thích" : "Wishlist"}
                        >
                          <Icon
                            icon={
                              wishlistItems.has(watch.id)
                                ? "mdi:heart"
                                : "mdi:heart-outline"
                            }
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateFilter("page", String(i + 1))}
                  className={`w-12 h-12 border-2 font-semibold transition-all duration-300 ${
                    page === i + 1
                      ? "bg-amber-600 border-amber-600 text-white"
                      : isDark
                      ? "border-gray-700 text-gray-400 hover:border-amber-600 hover:text-amber-600"
                      : "border-gray-300 text-gray-600 hover:border-amber-600 hover:text-amber-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-12">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateFilter("page", String(i + 1))}
                  className={`w-12 h-12 border-2 font-semibold transition-all duration-300 ${
                    page === i + 1
                      ? "bg-amber-600 border-amber-600 text-white"
                      : isDark
                      ? "border-gray-700 text-gray-400 hover:border-amber-600 hover:text-amber-600"
                      : "border-gray-300 text-gray-600 hover:border-amber-600 hover:text-amber-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
