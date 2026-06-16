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
              iconColor="text-black"
              trend="+12.5%"
              trendUp={true}
            />
            <StatCard
              label="Tổng đơn hàng"
              value={data?.totalOrders ?? 0}
              icon="solar:cart-large-4-bold-duotone"
              iconColor="text-black"
              trend="+8.2%"
              trendUp={true}
            />
            <StatCard
              label="Trạng thái cao nhất"
              value={ordersByStatus[0]?.status ?? "--"}
              icon="solar:widget-5-bold-duotone"
              iconColor="text-black"
              trend="+5.1%"
              trendUp={false}
            />
            <StatCard
              label="Top sản phẩm"
              value={topProducts[0]?.watchName ?? "--"}
              icon="solar:cup-star-bold-duotone"
              iconColor="text-black"
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
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        </div>
        <div
          className={`w-12 h-12 rounded-md flex items-center justify-center bg-gray-50 border border-gray-100`}
        >
          <Icon icon={icon} className={`text-2xl ${iconColor}`} />
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center gap-2 mt-auto">
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              trendUp
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            <Icon
              icon={trendUp ? "carbon:arrow-up" : "carbon:arrow-down"}
            />
            <span>{trend}</span>
          </div>
          <span className="text-xs text-gray-400">so với tháng trước</span>
        </div>
      )}
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
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
                  <p className="text-sm font-semibold text-black">
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
          stroke="#000000"
          strokeWidth={2}
          fill="#f3f4f6"
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
    Pending: "#9ca3af",
    Processing: "#6b7280",
    Shipped: "#4b5563",
    Delivered: "#111827",
    Cancelled: "#e5e7eb",
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
        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
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
                  <p className="text-sm font-bold text-black">
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
          fill="#111827"
          radius={[4, 4, 0, 0]}
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
