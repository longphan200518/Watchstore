import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import Header from "../components/Header";
import ToastContainer from "../components/ToastContainer";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5221/api/watches/${id}`);
        const result = await response.json();
        if (result.success) {
          setProduct(result.data);
        } else {
          setError(result.message || "Không tìm thấy sản phẩm");
        }
      } catch (err) {
        setError(err.message || "Có lỗi xảy ra");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      addToast(`${product.name} x${quantity} đã được thêm vào giỏ hàng`, "success", 2000);
      setQuantity(1);
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

  if (error || !product) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"}`}>
        <Header isDark={isDark} onThemeToggle={toggleTheme} />
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 text-center">
          <p className={`text-xl mb-4 ${isDark ? "text-red-400" : "text-red-600"}`}>{error}</p>
          <button
            onClick={() => navigate("/products")}
            className={`px-6 py-3 rounded-lg transition ${isDark ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-amber-500 hover:bg-amber-600 text-white"}`}
          >
            Quay lại sản phẩm
          </button>
        </main>
      </div>
    );
  }

  const images = product.images && product.images.length > 0 
    ? product.images.map(img => img.imageUrl)
    : ["https://via.placeholder.com/500"];

  return (
    <div className={`min-h-screen ${isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"}`}>
      <Header isDark={isDark} onThemeToggle={toggleTheme} />
      <ToastContainer isDark={isDark} />

      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
        {/* Breadcrumb */}
        <div className={`flex gap-2 mb-8 text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
          <button onClick={() => navigate("/")} className="hover:text-amber-600">Trang chủ</button>
          <span>/</span>
          <button onClick={() => navigate("/products")} className="hover:text-amber-600">Sản phẩm</button>
          <span>/</span>
          <span className="text-amber-600">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className={`w-full aspect-square rounded-lg overflow-hidden border ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"}`}>
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-3 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? isDark ? "border-amber-600" : "border-amber-500"
                      : isDark ? "border-white/10 hover:border-white/20" : "border-black/5 hover:border-black/10"
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <p className={`text-sm uppercase tracking-widest mb-2 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                {product.brand?.name || "Thương hiệu"}
              </p>
              <h1 className={`text-4xl lg:text-5xl font-light tracking-tight mb-4 ${isDark ? "text-white" : "text-black"}`}>
                {product.name}
              </h1>
              <p className={`text-xl font-semibold ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(product.price)}
              </p>
            </div>

            {/* Specifications */}
            <div className={`space-y-3 p-6 rounded-lg border ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"}`}>
              <div className="flex justify-between items-center">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Kích cỡ vỏ:</span>
                <span className="font-medium">{product.caseSize || "N/A"} mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Chống nước:</span>
                <span className="font-medium">{product.waterResistance || "N/A"} m</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Chuyển động:</span>
                <span className="font-medium">{product.movement || "N/A"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className={isDark ? "text-gray-400" : "text-gray-600"}>Tình trạng:</span>
                <span className={`font-medium ${product.status === "Available" ? isDark ? "text-green-400" : "text-green-600" : isDark ? "text-red-400" : "text-red-600"}`}>
                  {product.status === "Available" ? "Có sẵn" : "Hết hàng"}
                </span>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className={`text-lg font-semibold mb-3 ${isDark ? "text-white" : "text-black"}`}>Mô tả</h3>
                <p className={`leading-relaxed ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  {product.description}
                </p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center gap-4">
                <label className={isDark ? "text-gray-300" : "text-gray-700"}>Số lượng:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className={`w-10 h-10 rounded flex items-center justify-center transition ${
                      isDark ? "bg-neutral-800 hover:bg-neutral-700" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Icon icon="teenyicons:minus-outline" width={16} />
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className={`w-10 h-10 rounded flex items-center justify-center transition ${
                      isDark ? "bg-neutral-800 hover:bg-neutral-700" : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    <Icon icon="teenyicons:plus-outline" width={16} />
                  </button>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.status !== "Available"}
                className={`w-full py-4 rounded-lg font-semibold uppercase tracking-widest transition flex items-center justify-center gap-2 ${
                  product.status === "Available"
                    ? isDark
                      ? "bg-amber-600 hover:bg-amber-700 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white"
                    : isDark
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Icon icon="teenyicons:cart-outline" width={20} />
                {product.status === "Available" ? "Thêm vào giỏ" : "Hết hàng"}
              </button>
              <button
                onClick={() => navigate("/products")}
                className={`w-full py-3 rounded-lg font-semibold uppercase tracking-widest transition border ${
                  isDark
                    ? "border-white/10 text-gray-300 hover:bg-white/5"
                    : "border-black/10 text-gray-700 hover:bg-black/5"
                }`}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
