import { useState, useEffect } from "react";
import Header from "../components/Header";

const categories = [
  { name: "Automatic", icon: "⚙️", desc: "Máy cơ tự động" },
  { name: "Smartwatch", icon: "📱", desc: "Đồng hồ thông minh" },
  { name: "Dress Watch", icon: "👔", desc: "Đồng hồ dạ tiệc" },
  { name: "Diver", icon: "🏊", desc: "Đồng hồ lặn" },
];

const featured = [
  {
    name: "Seamaster Aqua Terra",
    price: "185.000.000₫",
    badge: "LIMITED",
    specs: "Co-Axial Master • 41mm • 150m",
    img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=1200&q=95",
  },
  {
    name: "Royal Oak Offshore",
    price: "425.000.000₫",
    badge: "EXCLUSIVE",
    specs: "Swiss Manufacture • Ceramic • 44mm",
    img: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1200&q=95",
  },
  {
    name: "Patrimony Perpetual",
    price: "320.000.000₫",
    badge: "HERITAGE",
    specs: "Geneva Seal • 18K Gold • Complications",
    img: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=95",
  },
  {
    name: "Speedmaster Racing",
    price: "275.000.000₫",
    badge: "ICONIC",
    specs: "Moonwatch • Chronograph • Titanium",
    img: "https://images.unsplash.com/photo-1606390034994-e6d8e8bc8c3b?w=1200&q=95",
  },
];

const stories = [
  {
    title: "Chất lượng tuyệt hảo",
    desc: "Mỗi chiếc đồng hồ được chọn lọc kỹ càng từ các thương hiệu uy tín, đảm bảo độ chính xác và bền bỉ theo thời gian.",
  },
  {
    title: "Bảo hành 5 năm",
    desc: "Chúng tôi tự tin với chất lượng sản phẩm, cung cấp chính sách bảo hành toàn diện lên đến 5 năm cho mọi đồng hồ.",
  },
  {
    title: "Giao hàng miễn phí",
    desc: "Miễn phí vận chuyển toàn quốc cho đơn hàng trên 5 triệu đồng, giao hàng nhanh chóng và an toàn.",
  },
];

const testimonials = [
  {
    text: "Đồng hồ đẹp, chất lượng tuyệt vời!",
    author: "Nguyễn Văn A",
    rating: 5,
  },
  {
    text: "Dịch vụ chuyên nghiệp, giao hàng nhanh.",
    author: "Trần Thị B",
    rating: 5,
  },
];

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setIsDark(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-neutral-950 text-neutral-50" : "bg-stone-50 text-stone-900"
      }`}
    >
      <Header isDark={isDark} onThemeToggle={toggleTheme} />

      <main>
        {/* Hero */}
        <section
          className={`relative h-screen flex items-center overflow-hidden ${
            isDark ? "bg-black" : "bg-zinc-50"
          }`}
        >
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=2400&q=95"
              alt="Luxury timepiece"
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 ${
                isDark
                  ? "bg-gradient-to-r from-black via-black/85 to-transparent"
                  : "bg-gradient-to-r from-white via-white/90 to-transparent"
              }`}
            />
          </div>

          <div className="relative max-w-[1600px] mx-auto px-8 lg:px-16 w-full">
            <div className="max-w-2xl space-y-10">
              <div className="space-y-4">
                <p
                  className={`text-xs tracking-[0.3em] uppercase font-light ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Bộ sưu tập mới 2025
                </p>
                <h1 className="text-6xl lg:text-8xl font-extralight leading-[0.95] tracking-tight">
                  Nghệ thuật
                  <span className="block font-light mt-2">Đo thời gian</span>
                </h1>
              </div>
              <p
                className={`text-base font-light leading-relaxed max-w-md ${
                  isDark ? "text-gray-200" : "text-gray-700"
                }`}
              >
                Khám phá những chiếc đồng hồ đặc biệt từ những nhà sản xuất danh
                giá nhất thế giới. Mỗi tác phẩm thể hiện hàng thế kỷ nghệ thuật
                chế tác đồng hồ.
              </p>
              <div className="flex gap-6 pt-6">
                <a
                  href="#timepieces"
                  className={`px-10 py-4 text-xs uppercase tracking-[0.2em] font-light transition ${
                    isDark
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  Khám phá bộ sưu tập
                </a>
                <a
                  href="#heritage"
                  className={`px-10 py-4 text-xs uppercase tracking-[0.2em] font-light transition border ${
                    isDark
                      ? "border-white/20 hover:bg-white/5"
                      : "border-black/10 hover:bg-black/5"
                  }`}
                >
                  Di sản thương hiệu
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section
          id="collections"
          className={`py-24 ${isDark ? "bg-neutral-950" : "bg-white"}`}
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <p
                className={`text-sm tracking-[0.3em] uppercase font-light mb-3 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Danh mục
              </p>
              <h2
                className={`text-4xl font-light tracking-tight ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Tìm chiếc đồng hồ hoàn hảo
              </h2>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <a
                  key={cat.name}
                  href="#"
                  className={`group relative h-72 overflow-hidden transition-all duration-500 ${
                    isDark
                      ? "bg-neutral-900 hover:bg-neutral-800"
                      : "bg-zinc-50 hover:bg-zinc-100"
                  }`}
                >
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                    <div
                      className={`text-4xl mb-6 transition-transform duration-500 group-hover:scale-110 ${
                        isDark ? "opacity-70" : "opacity-50"
                      }`}
                    >
                      {cat.icon}
                    </div>
                    <h3
                      className={`text-xl font-light tracking-wide mb-2 transition-colors ${
                        isDark
                          ? "text-white group-hover:text-amber-400"
                          : "text-black group-hover:text-amber-600"
                      }`}
                    >
                      {cat.name}
                    </h3>
                    <p
                      className={`text-sm font-light ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {cat.desc}
                    </p>
                    <div
                      className={`mt-6 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      XEM TẤT CẢ →
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Featured products */}
        <section
          id="timepieces"
          className={`py-32 ${isDark ? "bg-black" : "bg-zinc-50"}`}
        >
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
            <div className="text-center mb-20">
              <p
                className={`text-xs tracking-[0.3em] uppercase font-light mb-4 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Sản phẩm nổi bật
              </p>
              <h2 className="text-5xl font-extralight tracking-tight">
                Nghệ thuật chế tác tinh xảo
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {featured.map((item) => (
                <div key={item.name} className="group cursor-pointer">
                  <div
                    className={`relative aspect-[3/4] overflow-hidden mb-6 ${
                      isDark ? "bg-neutral-900" : "bg-white"
                    }`}
                  >
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-6 left-6">
                      <span
                        className={`px-3 py-1.5 text-[9px] tracking-[0.2em] uppercase font-light ${
                          isDark ? "bg-white text-black" : "bg-black text-white"
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center ${
                        isDark ? "bg-black/90" : "bg-white/95"
                      }`}
                    >
                      <span className="text-xs tracking-[0.2em] uppercase">
                        Xem chi tiết →
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-light tracking-wide">
                      {item.name}
                    </h3>
                    <p
                      className={`text-xs uppercase tracking-wider font-light ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {item.specs}
                    </p>
                    <p className="text-sm font-normal pt-2">{item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Brand strip */}
        <section
          id="maisons"
          className={`py-20 border-y ${
            isDark ? "bg-neutral-950 border-white/5" : "bg-white border-black/5"
          }`}
        >
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
              {[
                "Omega",
                "Audemars Piguet",
                "Vacheron Constantin",
                "Patek Philippe",
              ].map((brand) => (
                <div key={brand} className="group">
                  <span
                    className={`text-xl font-light tracking-wider transition ${
                      isDark
                        ? "text-gray-300 group-hover:text-white"
                        : "text-gray-600 group-hover:text-black"
                    }`}
                  >
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story / USP */}
        <section
          id="heritage"
          className={`py-32 ${isDark ? "bg-black" : "bg-zinc-50"}`}
        >
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
            <div className="grid md:grid-cols-3 gap-16">
              {stories.map((story, idx) => (
                <div key={story.title} className="space-y-6">
                  <div
                    className={`text-4xl ${
                      isDark ? "opacity-40" : "opacity-30"
                    }`}
                  >
                    {["✨", "🎯", "🏆"][idx]}
                  </div>
                  <h3 className="text-2xl font-light tracking-wide">
                    {story.title}
                  </h3>
                  <p
                    className={`text-sm font-light leading-relaxed ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {story.desc}
                  </p>
                  <a
                    href="#"
                    className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest font-light transition ${
                      isDark
                        ? "text-gray-300 hover:text-white"
                        : "text-gray-700 hover:text-black"
                    }`}
                  >
                    Tìm hiểu thêm
                    <span>→</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className={`py-32 ${isDark ? "bg-neutral-950" : "bg-white"}`}>
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
            <div
              className={`relative overflow-hidden grid md:grid-cols-2 gap-12 items-center border ${
                isDark ? "bg-black border-white/5" : "bg-zinc-50 border-black/5"
              }`}
            >
              <div className="space-y-8 p-12 lg:p-16">
                <div className="space-y-4">
                  <p
                    className={`text-xs uppercase tracking-[0.3em] font-light ${
                      isDark ? "text-amber-400" : "text-amber-600"
                    }`}
                  >
                    Bộ sưu tập đặc biệt
                  </p>
                  <h3
                    className={`text-4xl lg:text-5xl font-extralight tracking-tight leading-tight ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    Phiên bản giới hạn
                    <span className="block mt-2 text-3xl lg:text-4xl font-light">
                      Chỉ 300 chiếc
                    </span>
                  </h3>
                  <p
                    className={`text-sm font-light leading-relaxed pt-2 ${
                      isDark ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    Sản xuất giới hạn, đánh số trên rotor, dây da thủ công
                    Italia. Nghệ thuật chế tác đỉnh cao trong từng chi tiết.
                  </p>
                </div>
                <div className="flex gap-6 pt-4">
                  <a
                    className={`px-10 py-4 text-xs uppercase tracking-[0.2em] font-light transition ${
                      isDark
                        ? "bg-white text-black hover:bg-gray-100"
                        : "bg-black text-white hover:bg-gray-900"
                    }`}
                    href="/products"
                  >
                    Đặt trước
                  </a>
                  <a
                    className={`px-10 py-4 text-xs uppercase tracking-[0.2em] font-light transition border ${
                      isDark
                        ? "border-white/20 hover:bg-white/5"
                        : "border-black/10 hover:bg-black/5"
                    }`}
                    href="#"
                  >
                    Xem chi tiết
                  </a>
                </div>
              </div>
              <div className="relative h-full min-h-[400px] md:min-h-[500px]">
                <div
                  className={`absolute inset-0 ${
                    isDark
                      ? "bg-gradient-to-br from-amber-400/5 to-transparent"
                      : "bg-gradient-to-br from-amber-400/10 to-transparent"
                  }`}
                />
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80"
                  alt="Limited edition watch"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className={`py-32 ${isDark ? "bg-black" : "bg-zinc-50"}`}>
          <div className="max-w-3xl mx-auto px-8 text-center">
            <div className="space-y-8">
              <div>
                <p
                  className={`text-xs tracking-[0.3em] uppercase font-light mb-4 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Bản tin
                </p>
                <h3 className="text-4xl font-extralight tracking-tight mb-4">
                  Cập nhật thông tin
                </h3>
                <p
                  className={`text-sm font-light ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Nhận thông tin về sản phẩm mới và ưu đãi độc quyền. Hủy đăng
                  ký bất cứ lúc nào.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className={`w-full sm:w-96 px-6 py-4 text-sm font-light border focus:outline-none ${
                    isDark
                      ? "bg-neutral-900 border-white/10 text-white placeholder-gray-600"
                      : "bg-white border-black/10 text-black placeholder-gray-400"
                  }`}
                />
                <button
                  className={`px-10 py-4 text-xs uppercase tracking-[0.2em] font-light transition whitespace-nowrap ${
                    isDark
                      ? "bg-white text-black hover:bg-gray-100"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  Đăng ký
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className={`border-t ${
          isDark ? "bg-black border-white/5" : "bg-white border-black/5"
        }`}
      >
        <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-20">
          <div className="grid md:grid-cols-4 gap-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-600 flex items-center justify-center">
                  <span className="text-white font-black text-sm">W</span>
                </div>
                <span className="text-base font-light tracking-[0.25em] uppercase">
                  Watchstore
                </span>
              </div>
              <p
                className={`text-xs font-light leading-relaxed ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Sự thanh lịch vượt thời gian kết hợp kỹ thuật chính xác. Từ năm
                2025.
              </p>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs uppercase tracking-widest font-light mb-6">
                Danh mục
              </h5>
              <a
                href="#"
                className={`block text-xs font-light transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                Bộ sưu tập
              </a>
              <a
                href="#"
                className={`block text-xs font-light transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                Sản phẩm
              </a>
              <a
                href="#"
                className={`block text-xs font-light transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                Thương hiệu
              </a>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs uppercase tracking-widest font-light mb-6">
                Hỗ trợ
              </h5>
              <a
                href="#"
                className={`block text-xs font-light transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                Chính sách bảo hành
              </a>
              <a
                href="#"
                className={`block text-xs font-light transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                Giao hàng & Đổi trả
              </a>
              <a
                href="#"
                className={`block text-xs font-light transition ${
                  isDark
                    ? "text-gray-300 hover:text-white"
                    : "text-gray-700 hover:text-black"
                }`}
              >
                Liên hệ
              </a>
            </div>

            <div className="space-y-4">
              <h5 className="text-xs uppercase tracking-widest font-light mb-6">
                Kết nối
              </h5>
              <p
                className={`text-xs font-light ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Hotline:{" "}
                <span className={isDark ? "text-white" : "text-black"}>
                  1900 9999
                </span>
              </p>
              <p
                className={`text-xs font-light ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Email:{" "}
                <span className={isDark ? "text-white" : "text-black"}>
                  support@watchstore.vn
                </span>
              </p>
            </div>
          </div>
        </div>

        <div
          className={`border-t ${isDark ? "border-white/5" : "border-black/5"}`}
        >
          <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-8">
            <p
              className={`text-xs font-light text-center ${
                isDark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              © 2025 Watchstore. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
