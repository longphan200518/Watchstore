import { Link, useLocation } from "react-router-dom";

const stats = [
  {
    label: "Tổng doanh thu",
    value: "₫3,2B",
    delta: "+12% MoM",
    color: "text-green-500",
    bg: "bg-green-50",
    icon: "💰",
  },
  {
    label: "Đơn hàng",
    value: "1.248",
    delta: "+6% MoM",
    color: "text-blue-500",
    bg: "bg-blue-50",
    icon: "📦",
  },
  {
    label: "Sản phẩm",
    value: "684",
    delta: "+18 mới",
    color: "text-indigo-500",
    bg: "bg-indigo-50",
    icon: "⌚",
  },
  {
    label: "Khách hàng",
    value: "9.412",
    delta: "+3% MoM",
    color: "text-amber-500",
    bg: "bg-amber-50",
    icon: "👤",
  },
];

const activities = [
  {
    title: "Đơn hàng #WS-1092",
    detail: "Khách: Lê Minh Tuấn • 152.000.000₫",
    time: "5 phút trước",
    type: "order",
  },
  {
    title: "Thêm sản phẩm",
    detail: "Royal Oak Offshore 44mm Ceramic",
    time: "23 phút trước",
    type: "product",
  },
  {
    title: "Cập nhật tồn kho",
    detail: "Seamaster Aqua Terra +15 tồn",
    time: "1 giờ trước",
    type: "stock",
  },
  {
    title: "Đơn hàng #WS-1089",
    detail: "Khách: Trần Khánh Linh • 92.500.000₫",
    time: "2 giờ trước",
    type: "order",
  },
];

const quickLinks = [
  {
    label: "Sản phẩm",
    path: "/products",
    desc: "Tạo / chỉnh sửa sản phẩm",
    icon: "🛠️",
  },
  {
    label: "Đơn hàng",
    path: "/orders",
    desc: "Quản lý & xử lý đơn",
    icon: "🧾",
  },
  { label: "Báo cáo", path: "/", desc: "Hiệu suất & doanh thu", icon: "📈" },
];

export default function Dashboard() {
  const location = useLocation();
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-primary text-white shadow-2xl/40 shadow-black/30">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wide">Watchstore Admin</h1>
          <p className="text-sm text-white/70 mt-1">
            Luxury watch control center
          </p>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-secondary text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Tổng quan hiệu suất</p>
            <h2 className="text-3xl font-semibold text-gray-900">Dashboard</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-white shadow-sm">
              Xuất báo cáo
            </button>
            <button className="px-4 py-2 rounded-lg bg-secondary text-white text-sm hover:bg-blue-600 shadow">
              Tạo đơn mới
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.label}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-lg ${item.bg} flex items-center justify-center text-lg`}
                >
                  {item.icon}
                </div>
                <span className={`text-xs font-medium ${item.color}`}>
                  {item.delta}
                </span>
              </div>
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-3xl font-semibold text-gray-900">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent activity + Quick links */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Hoạt động gần đây
              </h3>
              <button className="text-sm text-secondary hover:underline">
                Xem tất cả
              </button>
            </div>
            <div className="divide-y divide-gray-100">
              {activities.map((act, idx) => (
                <div key={idx} className="py-3 flex items-start gap-3">
                  <span className="text-xl leading-none">
                    {act.type === "order"
                      ? "🧾"
                      : act.type === "product"
                      ? "🛠️"
                      : "📦"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {act.title}
                    </p>
                    <p className="text-sm text-gray-600">{act.detail}</p>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">
                    {act.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Truy cập nhanh
            </h3>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center justify-between rounded-lg border border-gray-100 hover:border-secondary/60 hover:shadow-sm px-4 py-3 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{link.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {link.label}
                      </p>
                      <p className="text-xs text-gray-600">{link.desc}</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
