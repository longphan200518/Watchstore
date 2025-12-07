import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { getDashboardSummary } from "../services/dashboardService";
import { formatCurrency } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

export default function Dashboard() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
  ];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getDashboardSummary();
        setData(result);
      } catch (err) {
        setError("Không tải được dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const ordersByStatus = useMemo(() => data?.ordersByStatus ?? [], [data]);
  const revenueByDate = useMemo(() => data?.revenueByDate ?? [], [data]);
  const topProducts = useMemo(() => data?.topProducts ?? [], [data]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      {/* Main content */}
      <main className="ml-72 min-h-screen">
        <AdminHeader title="Dashboard" subtitle="Tổng quan & phân tích" />

        <div className="px-8 pb-8 space-y-6">
          {/* Loading / Error */}
          {loading && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600">
              Đang tải...
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard
              label="Tổng doanh thu"
              value={formatCurrency(data?.totalRevenue ?? 0)}
              icon="solar:dollar-bold-duotone"
              iconColor="text-emerald-500"
              bgGradient="from-emerald-500 to-teal-500"
              trend="+12.5%"
              trendUp={true}
            />
            <StatCard
              label="Tổng đơn hàng"
              value={data?.totalOrders ?? 0}
              icon="solar:cart-large-4-bold-duotone"
              iconColor="text-blue-500"
              bgGradient="from-blue-500 to-indigo-500"
              trend="+8.2%"
              trendUp={true}
            />
            <StatCard
              label="Trạng thái cao nhất"
              value={ordersByStatus[0]?.status ?? "--"}
              icon="solar:widget-5-bold-duotone"
              iconColor="text-purple-500"
              bgGradient="from-purple-500 to-pink-500"
              trend="+5.1%"
              trendUp={false}
            />
            <StatCard
              label="Top sản phẩm"
              value={topProducts[0]?.watchName ?? "--"}
              icon="solar:cup-star-bold-duotone"
              iconColor="text-amber-500"
              bgGradient="from-amber-500 to-orange-500"
              trend="+23.5%"
              trendUp={true}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Doanh thu theo ngày
              </h3>
              <LineChart data={revenueByDate} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Đơn theo trạng thái
              </h3>
              <PieChart data={ordersByStatus} />
            </div>
          </div>

          {/* Top products */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Top sản phẩm
              </h3>
              <span className="text-sm text-gray-500">Theo doanh thu</span>
            </div>
            <BarChart data={topProducts} />
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Truy cập nhanh
              </h3>
              <div className="space-y-3">
                <QuickLink
                  label="Sản phẩm"
                  path="/products"
                  desc="Tạo / chỉnh sửa sản phẩm"
                  icon="🛠️"
                />
                <QuickLink
                  label="Đơn hàng"
                  path="/orders"
                  desc="Quản lý & xử lý đơn"
                  icon="🧾"
                />
                <QuickLink
                  label="Báo cáo"
                  path="/"
                  desc="Hiệu suất & doanh thu"
                  icon="📈"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  iconColor,
  bgGradient,
  trend,
  trendUp,
}) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden group hover:shadow-xl transition-all duration-300">
      {/* Background Gradient */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradient} opacity-5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500`}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div
            className={`w-14 h-14 bg-gradient-to-br ${bgGradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon icon={icon} className="text-2xl text-white" />
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold ${
                trendUp
                  ? "bg-green-50 text-green-600"
                  : "bg-red-50 text-red-600"
              }`}
            >
              <Icon
                icon={trendUp ? "solar:arrow-up-bold" : "solar:arrow-down-bold"}
              />
              <span>{trend}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-2">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      </div>
    </div>
  );
}

function LineChart({ data }) {
  if (!data?.length) {
    return <div className="text-sm text-gray-500">Chưa có dữ liệu</div>;
  }

  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="relative h-64">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="2"
          points={data
            .map((d, i) => {
              const x = (i / Math.max(data.length - 1, 1)) * 100;
              const y = 100 - (d.revenue / max) * 90 - 5;
              return `${x},${y}`;
            })
            .join(" ")}
        />
      </svg>
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        {data.map((d, i) => (
          <span key={i}>{new Date(d.date).toLocaleDateString()}</span>
        ))}
      </div>
    </div>
  );
}

function PieChart({ data }) {
  if (!data?.length)
    return <div className="text-sm text-gray-500">Chưa có dữ liệu</div>;

  const total = data.reduce((sum, d) => sum + d.count, 0) || 1;
  let cumulative = 0;
  const colors = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#9333ea"];

  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 32 32" className="w-32 h-32">
        {data.map((d, idx) => {
          const start = (cumulative / total) * 2 * Math.PI;
          const slice = (d.count / total) * 2 * Math.PI;
          cumulative += d.count;
          const x1 = 16 + 16 * Math.sin(start);
          const y1 = 16 - 16 * Math.cos(start);
          const x2 = 16 + 16 * Math.sin(start + slice);
          const y2 = 16 - 16 * Math.cos(start + slice);
          const largeArc = slice > Math.PI ? 1 : 0;
          const pathData = `M16 16 L ${x1} ${y1} A 16 16 0 ${largeArc} 1 ${x2} ${y2} Z`;
          return (
            <path key={idx} d={pathData} fill={colors[idx % colors.length]} />
          );
        })}
      </svg>
      <div className="space-y-2 text-sm text-gray-700">
        {data.map((d, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span
              className="inline-block w-3 h-3 rounded-sm"
              style={{ background: colors[idx % colors.length] }}
            />
            <span className="font-medium">{d.status}</span>
            <span className="text-gray-500">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  if (!data?.length)
    return <div className="text-sm text-gray-500">Chưa có dữ liệu</div>;
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="space-y-3">
      {data.map((item, idx) => {
        const pct = (item.revenue / max) * 100;
        return (
          <div key={idx}>
            <div className="flex items-center justify-between text-sm text-gray-700">
              <span className="font-medium">{item.watchName}</span>
              <span className="text-gray-500">
                {formatCurrency(item.revenue)}
              </span>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function QuickLink({ label, path, desc, icon }) {
  return (
    <Link
      to={path}
      className="flex items-center justify-between rounded-lg border border-gray-100 hover:border-secondary/60 hover:shadow-sm px-4 py-3 transition"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-sm font-semibold text-gray-900">{label}</p>
          <p className="text-xs text-gray-600">{desc}</p>
        </div>
      </div>
      <span className="text-gray-400">→</span>
    </Link>
  );
}
