import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Products() {
  const [isDark, setIsDark] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [watches, setWatches] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart } = useCart();
  const { addToast } = useToast();

  // Filters từ URL
  const page = parseInt(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const brandId = searchParams.get("brandId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const sortBy = searchParams.get("sortBy") || "latest";

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

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
    addToast(`${watch.name} đã được thêm vào giỏ hàng`, "success", 2000);
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Filters Section */}
        <div className="mb-8">
          <h1
            className={`text-4xl font-light tracking-tight mb-8 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Sản phẩm
          </h1>

          <div
            className={`grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-lg border ${
              isDark
                ? "bg-neutral-900 border-white/10"
                : "bg-white border-black/5"
            }`}
          >
            {/* Search */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Tìm kiếm
              </label>
              <input
                type="text"
                placeholder="Tên đồng hồ..."
                value={search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition ${
                  isDark
                    ? "bg-neutral-800 border-white/10 text-white placeholder-gray-400"
                    : "bg-white border-black/10 text-black placeholder-gray-600"
                }`}
              />
            </div>

            {/* Brand Filter */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Thương hiệu
              </label>
              <select
                value={brandId}
                onChange={(e) => updateFilter("brandId", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition ${
                  isDark
                    ? "bg-neutral-800 border-white/10 text-white"
                    : "bg-white border-black/10 text-black"
                }`}
              >
                <option value="">Tất cả</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Giá tối thiểu
              </label>
              <input
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition ${
                  isDark
                    ? "bg-neutral-800 border-white/10 text-white placeholder-gray-400"
                    : "bg-white border-black/10 text-black placeholder-gray-600"
                }`}
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Giá tối đa
              </label>
              <input
                type="number"
                placeholder="Vô hạn"
                value={maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
                className={`w-full px-4 py-2 rounded-lg border transition ${
                  isDark
                    ? "bg-neutral-800 border-white/10 text-white placeholder-gray-400"
                    : "bg-white border-black/10 text-black placeholder-gray-600"
                }`}
              />
            </div>
          </div>

          {/* Sort */}
          <div className="mt-4 flex justify-between items-center">
            <select
              value={sortBy}
              onChange={(e) => updateFilter("sortBy", e.target.value)}
              className={`px-4 py-2 rounded-lg border transition ${
                isDark
                  ? "bg-neutral-900 border-white/10 text-white"
                  : "bg-white border-black/10 text-black"
              }`}
            >
              <option value="latest">Mới nhất</option>
              <option value="price-low">Giá: Thấp đến Cao</option>
              <option value="price-high">Giá: Cao đến Thấp</option>
              <option value="popular">Phổ biến</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Đang tải...
            </p>
          </div>
        ) : watches.length === 0 ? (
          <div className="text-center py-12">
            <p className={isDark ? "text-gray-400" : "text-gray-600"}>
              Không tìm thấy sản phẩm
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {watches.map((watch) => (
                <div
                  key={watch.id}
                  className={`group rounded-lg overflow-hidden border transition cursor-pointer ${
                    isDark
                      ? "bg-neutral-900 border-white/10 hover:border-amber-600/50"
                      : "bg-white border-black/5 hover:border-amber-500/50"
                  }`}
                  onClick={() => window.location.href = `/product/${watch.id}`}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gray-200">
                    {watch.images && watch.images.length > 0 ? (
                      <img
                        src={watch.images[0].imageUrl}
                        alt={watch.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div
                        className={`w-full h-full flex items-center justify-center ${
                          isDark ? "bg-neutral-800" : "bg-gray-100"
                        }`}
                      >
                        <Icon icon="teenyicons:image-outline" width={48} />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3
                        className={`font-semibold line-clamp-2 ${
                          isDark ? "text-white" : "text-black"
                        }`}
                      >
                        {watch.name}
                      </h3>
                      <p
                        className={`text-sm mt-1 ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {watch.brandName}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <p
                        className={`text-sm ${
                          isDark ? "text-gray-400" : "text-gray-600"
                        }`}
                      >
                        {watch.caseSize && `${watch.caseSize} • `}
                        {watch.waterResistance}
                      </p>
                      <p className="text-lg font-semibold text-amber-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(watch.price)}
                      </p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(watch);
                      }}
                      className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition ${
                        isDark
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      <Icon icon="teenyicons:cart-outline" width={16} />
                      Thêm vào giỏ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateFilter("page", String(i + 1))}
                  className={`px-4 py-2 rounded-lg transition ${
                    page === i + 1
                      ? isDark
                        ? "bg-amber-600 text-white"
                        : "bg-amber-500 text-white"
                      : isDark
                      ? "bg-neutral-900 text-gray-300 hover:bg-neutral-800"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-black/5"
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
          <aside className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">
                Khoảng giá
              </h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Dưới 5 triệu
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  5 - 10 triệu
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Trên 10 triệu
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Loại máy</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Automatic
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Quartz
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Solar
                </label>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-900">Mục đích</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Dress
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Diver
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-slate-300" />
                  Field
                </label>
              </div>
            </div>
            <button className="w-full px-4 py-2 rounded-full bg-slate-900 text-white text-sm hover:bg-slate-800">
              Áp dụng
            </button>
          </aside>

          <section className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <article
                  key={item}
                  className="bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 overflow-hidden hover:-translate-y-1 hover:shadow-lg transition"
                >
                  <div className="relative aspect-[4/5] bg-slate-100">
                    <span className="absolute top-4 left-4 px-3 py-1 text-xs font-medium bg-white/90 rounded-full text-slate-900">
                      Mới
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      Model {item}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Máy cơ Nhật • Kính sapphire • 10 ATM
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-base font-semibold text-slate-900">
                        12.000.000₫
                      </span>
                      <button className="text-sm font-medium text-slate-700 hover:text-slate-900">
                        Xem chi tiết →
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex justify-center pt-4">
              <button className="px-6 py-3 rounded-full border border-slate-300 text-slate-900 text-sm hover:bg-slate-100">
                Tải thêm 12 sản phẩm
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
