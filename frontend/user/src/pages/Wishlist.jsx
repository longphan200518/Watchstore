import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useWishlist } from "../contexts/WishlistContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function Wishlist() {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState("vi");
  const navigate = useNavigate();
  const { wishlist, removeFromWishlist, getTotalWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
    const savedLang = localStorage.getItem("language") || "vi";
    setLanguage(savedLang);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    addToast(
      language === "vi"
        ? `${item.name} đã được thêm vào giỏ hàng`
        : `${item.name} added to cart`,
      "success",
      2000
    );
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 pt-32">
        <h1
          className={`text-4xl font-light tracking-tight mb-8 ${
            isDark ? "text-white" : "text-black"
          }`}
        >
          {language === "vi" ? "❤️ Danh Sách Yêu Thích" : "❤️ Wishlist"}
        </h1>

        {wishlist.length === 0 ? (
          <div
            className={`text-center py-16 rounded-lg border ${
              isDark
                ? "bg-neutral-900 border-white/10"
                : "bg-white border-black/5"
            }`}
          >
            <Icon
              icon="teenyicons:heart-outline"
              width={48}
              className="mx-auto mb-4 opacity-50"
            />
            <p
              className={`text-lg mb-6 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {language === "vi"
                ? "Danh sách yêu thích của bạn trống"
                : "Your wishlist is empty"}
            </p>
            <button
              onClick={() => navigate("/products")}
              className={`px-6 py-3 rounded-lg transition ${
                isDark
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
            >
              {language === "vi" ? "Khám phá sản phẩm" : "Explore Products"}
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className={`rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300 group ${
                  isDark
                    ? "bg-neutral-900 border-white/10"
                    : "bg-white border-black/5"
                }`}
              >
                {/* Image */}
                <div className="relative overflow-hidden bg-gray-100 h-64">
                  {item.images && item.images.length > 0 ? (
                    <img
                      src={item.images[0].imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onClick={() => navigate(`/products/${item.id}`)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon icon="teenyicons:image-outline" width={48} />
                    </div>
                  )}

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors"
                  >
                    <Icon icon="mdi:heart-fill" className="w-5 h-5" />
                  </button>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p
                    className={`text-xs mb-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {item.brand?.name || "Brand"}
                  </p>
                  <h3
                    className={`font-semibold line-clamp-2 mb-3 cursor-pointer hover:text-amber-600 transition-colors ${
                      isDark ? "text-white" : "text-black"
                    }`}
                    onClick={() => navigate(`/products/${item.id}`)}
                  >
                    {item.name}
                  </h3>

                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-2xl font-bold ${
                        isDark ? "text-amber-500" : "text-amber-600"
                      }`}
                    >
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.price || 0)}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div className="space-y-2">
                    <button
                      onClick={() => navigate(`/products/${item.id}`)}
                      className={`w-full py-2 rounded-lg transition-colors text-sm ${
                        isDark
                          ? "bg-gray-800 hover:bg-gray-700 text-white"
                          : "bg-gray-100 hover:bg-gray-200 text-black"
                      }`}
                    >
                      {language === "vi" ? "Xem Chi Tiết" : "View Details"}
                    </button>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-full py-2 rounded-lg transition-colors font-semibold text-sm ${
                        isDark
                          ? "bg-amber-600 hover:bg-amber-700 text-white"
                          : "bg-amber-500 hover:bg-amber-600 text-white"
                      }`}
                    >
                      {language === "vi" ? "➕ Thêm vào giỏ" : "➕ Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div
          className={`mt-12 p-6 rounded-lg border ${
            isDark
              ? "bg-neutral-900 border-white/10"
              : "bg-white border-black/5"
          }`}
        >
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            {language === "vi"
              ? `Bạn có ${getTotalWishlist()} sản phẩm trong danh sách yêu thích`
              : `You have ${getTotalWishlist()} items in your wishlist`}
          </p>
        </div>
      </main>
    </div>
  );
}
