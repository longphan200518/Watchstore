import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  LineChart as RechartsLine,
  Line,
  AreaChart,
  Area,
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
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
    { label: "Quản lý mã giảm giá", path: "/coupons" },
    { label: "Cài đặt Website", path: "/website-settings" },
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
      <main className="lg:ml-72 min-h-screen">
        <AdminHeader title="Dashboard" subtitle="Tổng quan & phân tích" />

        <div className="px-4 lg:px-8 pb-8 space-y-6">
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
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="solar:chart-2-bold-duotone"
            className="text-5xl text-gray-300 mx-auto mb-2"
          />
          <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((d) => ({
    date: new Date(d.date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }),
    revenue: d.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis dataKey="date" stroke="#6b7280" fontSize={12} tickLine={false} />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
                  <p className="text-xs text-gray-500 mb-1">
                    {payload[0].payload.date}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatCurrency(payload[0].value)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke="#3b82f6"
          strokeWidth={2}
          fill="url(#colorRevenue)"
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function PieChart({ data }) {
  if (!data?.length) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="solar:pie-chart-2-bold-duotone"
            className="text-5xl text-gray-300 mx-auto mb-2"
          />
          <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
        </div>
      </div>
    );
  }

  const COLORS = {
    Pending: "#f59e0b",
    Processing: "#3b82f6",
    Shipped: "#8b5cf6",
    Delivered: "#10b981",
    Cancelled: "#ef4444",
  };

  const chartData = data.map((d) => ({
    name: d.status,
    value: d.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <RechartsPie>
        <Pie
          data={chartData}
          cx="50%"
          cy="45%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          animationDuration={1000}
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name] || "#6b7280"}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900">
                    {payload[0].name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {payload[0].value} đơn hàng
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </RechartsPie>
    </ResponsiveContainer>
  );
}

function BarChart({ data }) {
  if (!data?.length) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="solar:chart-bold-duotone"
            className="text-5xl text-gray-300 mx-auto mb-2"
          />
          <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name:
      item.watchName.length > 20
        ? item.watchName.substring(0, 20) + "..."
        : item.watchName,
    fullName: item.watchName,
    revenue: item.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBar
        data={chartData}
        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0.7} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis
          dataKey="name"
          stroke="#6b7280"
          fontSize={11}
          tickLine={false}
          angle={-15}
          textAnchor="end"
          height={60}
        />
        <YAxis
          stroke="#6b7280"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 max-w-xs">
                  <p className="text-xs font-semibold text-gray-900 mb-1">
                    {payload[0].payload.fullName}
                  </p>
                  <p className="text-sm font-bold text-amber-600">
                    {formatCurrency(payload[0].value)}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar
          dataKey="revenue"
          fill="url(#colorBar)"
          radius={[8, 8, 0, 0]}
          animationDuration={1000}
        />
      </RechartsBar>
    </ResponsiveContainer>
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
