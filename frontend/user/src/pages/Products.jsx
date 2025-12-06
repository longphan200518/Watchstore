export default function Products() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-slate-200">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-slate-900"
          >
            Watchstore
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a className="hover:text-slate-900" href="/">
              Trang chủ
            </a>
            <a className="hover:text-slate-900" href="#filters">
              Bộ lọc
            </a>
          </div>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
              Catalogue 2025
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">Sản phẩm</h1>
            <p className="text-slate-600">
              Chọn bộ lọc để tìm chiếc đồng hồ hợp với phong cách của bạn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select className="rounded-full border border-slate-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
              <option>Mới nhất</option>
              <option>Giá tăng dần</option>
              <option>Giá giảm dần</option>
            </select>
            <button className="px-4 py-2 rounded-full bg-slate-900 text-white text-sm hover:bg-slate-800">
              Bộ sưu tập
            </button>
          </div>
        </div>

        <div id="filters" className="grid md:grid-cols-[280px_1fr] gap-6">
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
