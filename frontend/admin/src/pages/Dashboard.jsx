import { useEffect, useMemo, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {
  LineChart as RechartsLine,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDashboardSummary } from "../services/dashboardService";
import { getOrders, exportRevenueToExcel } from "../services/orderService";
import { getUsers } from "../services/userService";
import { formatCurrency } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";
import { useToast } from "../contexts/ToastContext";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [newCustomers, setNewCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const audioRef = useRef(null);

  // Setup audio once
  useEffect(() => {
    audioRef.current = new Audio("/ting.mp3"); // Ensure ting.mp3 is in public folder or use a remote URL
    audioRef.current.volume = 0.5;
  }, []);

  // SignalR
  useEffect(() => {
    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5221/hubs/admin")
      .configureLogging(LogLevel.Information)
      .build();

    connection.on("ReceiveNewOrder", (order) => {
      showToast(`🔔 Có đơn đặt hàng mới từ ${order.customerName} - ${formatCurrency(order.totalAmount)}`, "success");
      // Phát âm thanh
      if (audioRef.current) {
        audioRef.current.play().catch(e => console.log("Audio play blocked by browser", e));
      }
    });

    const startConnection = async () => {
      try {
        await connection.start();
        console.log("SignalR Connected.");
      } catch (err) {
        console.error("SignalR Connection Error: ", err);
        setTimeout(startConnection, 5000); // Retry after 5s
      }
    };

    startConnection();

    return () => {
      connection.stop();
    };
  }, [showToast]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [summary, ordersRes, usersRes] = await Promise.all([
          getDashboardSummary(),
          getOrders({ pageNumber: 1, pageSize: 5 }),
          getUsers({ pageNumber: 1, pageSize: 5 })
        ]);
        
        setData(summary);
        if (ordersRes?.data?.items) setRecentOrders(ordersRes.data.items);
        if (usersRes?.data?.items) setNewCustomers(usersRes.data.items);
      } catch (err) {
        console.error(err);
        setError("Không tải được dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const revenueByDate = useMemo(() => data?.revenueByDate ?? [], [data]);
  const topProducts = useMemo(() => data?.topProducts ?? [], [data]);

  const handleExportExcel = async () => {
    try {
      showToast("Đang xuất file Excel...", "success");
      const blob = await exportRevenueToExcel();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Revenue_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      showToast("Xuất Excel thành công!", "success");
    } catch (error) {
      showToast("Lỗi khi xuất file Excel", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] font-sans">
      <Sidebar />

      {/* Main content */}
      <main className="lg:ml-72 min-h-screen">
        <AdminHeader title="Dashboard" subtitle="Tổng quan hoạt động kinh doanh" />

        <div className="px-8 pb-12 space-y-8">
          <div className="flex justify-end">
            <button 
              onClick={handleExportExcel}
              className="px-5 py-2.5 rounded border border-[#111111] text-sm font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors flex items-center gap-2"
            >
              <Icon icon="solar:export-outline" className="text-lg" />
              Xuất Báo Cáo Doanh Thu
            </button>
          </div>
          {loading && (
            <div className="bg-white border border-[#EAEAEA] p-6 text-[#111111] font-light">
              Đang tải dữ liệu...
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 p-4 text-sm font-light">
              {error}
            </div>
          )}

          {/* Hàng 1: KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <StatCard
              label="Doanh thu"
              value={formatCurrency(data?.totalRevenue ?? 125000000)}
            />
            <StatCard
              label="Đơn hàng"
              value={data?.totalOrders ?? 452}
            />
            <StatCard
              label="Giá trị trung bình/Đơn (AOV)"
              value={formatCurrency(data?.averageOrderValue ?? 0)}
            />
            <StatCard
              label="Khách hàng mới"
              value={data?.totalUsers ?? 187}
            />
            <StatCard
              label="Sản phẩm"
              value={data?.totalProducts ?? 95}
            />
            <StatCard
              label="Tỷ lệ chuyển đổi (CR)"
              value={`${data?.conversionRate ?? 0}%`}
            />
          </div>

          {/* Hàng 2: Revenue Chart & Recent Orders */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 bg-white border border-[#EAEAEA] p-8">
              <h3 className="text-xl font-serif text-[#111111] mb-6">Doanh thu 12 tháng</h3>
              <LineChart data={revenueByDate} />
            </div>

            <div className="bg-white border border-[#EAEAEA] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-[#111111]">Đơn hàng gần đây</h3>
                <Link to="/orders" className="text-sm text-gray-500 hover:text-[#111111] transition-colors font-light">Xem tất cả</Link>
              </div>
              <div className="space-y-4">
                {recentOrders.length > 0 ? recentOrders.map((order) => {
                  const statusLabels = { 1: "Chờ xác nhận", 2: "Đang xử lý", 3: "Đang giao", 4: "Đã giao", 5: "Đã hủy" };
                  return (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b border-[#EAEAEA] last:border-0">
                    <div>
                      <p className="text-[#111111] font-medium">#{order.id}</p>
                      <p className="text-xs text-gray-500 font-light mt-1">{formatCurrency(order.totalAmount)}</p>
                    </div>
                    <span className="text-xs font-medium px-3 py-1 bg-[#F8F8F8] text-[#111111] border border-[#EAEAEA] uppercase tracking-wider">
                      {statusLabels[order.status] || `Trạng thái ${order.status}`}
                    </span>
                  </div>
                  );
                }) : (
                  <p className="text-sm text-gray-500 font-light">Chưa có đơn hàng nào.</p>
                )}
              </div>
            </div>
          </div>

          {/* Hàng 3: Best Sellers & New Customers */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div className="bg-white border border-[#EAEAEA] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-[#111111]">Sản phẩm bán chạy</h3>
                <Link to="/products" className="text-sm text-gray-500 hover:text-[#111111] transition-colors font-light">Xem tất cả</Link>
              </div>
              <div className="space-y-4">
                {topProducts.length > 0 ? topProducts.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-[#EAEAEA] last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F8F8F8] flex items-center justify-center overflow-hidden border border-[#EAEAEA]">
                         <Icon icon="solar:watch-bold" className="text-2xl text-gray-300" />
                      </div>
                      <div>
                        <p className="text-[#111111] font-medium">{product.watchName}</p>
                        <p className="text-xs text-gray-500 font-light mt-1">{product.count} đơn</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 font-light">Chưa có dữ liệu.</p>
                )}
              </div>
            </div>

            <div className="bg-white border border-[#EAEAEA] p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-serif text-[#111111]">Khách hàng mới</h3>
                <Link to="/users" className="text-sm text-gray-500 hover:text-[#111111] transition-colors font-light">Xem tất cả</Link>
              </div>
              <div className="space-y-4">
                {newCustomers.length > 0 ? newCustomers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3 border-b border-[#EAEAEA] last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#111111] text-white flex items-center justify-center font-serif text-lg">
                        {user.fullName ? user.fullName[0].toUpperCase() : "U"}
                      </div>
                      <div>
                        <p className="text-[#111111] font-medium">{user.fullName || user.email}</p>
                        <p className="text-xs text-gray-500 font-light mt-1">{new Date(user.createdAt || Date.now()).toLocaleDateString('vi-VN')}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <p className="text-sm text-gray-500 font-light">Chưa có khách hàng mới.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white border border-[#EAEAEA] p-8 flex flex-col justify-between hover:border-[#111111] transition-colors">
      <p className="text-sm text-gray-500 uppercase tracking-widest font-light mb-2">{label}</p>
      <h4 className="text-3xl font-serif text-[#111111]">{value}</h4>
    </div>
  );
}

function LineChart({ data }) {
  if (!data?.length) {
    return (
      <div className="h-64 flex items-center justify-center bg-[#F8F8F8] border border-[#EAEAEA]">
        <p className="text-sm text-gray-500 font-light">Chưa có dữ liệu doanh thu</p>
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
      <RechartsLine data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#EAEAEA" vertical={false} />
        <XAxis dataKey="date" stroke="#999" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#999"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-black text-white px-4 py-3 rounded-sm shadow-xl">
                  <p className="text-xs text-gray-400 mb-1 font-light">{payload[0].payload.date}</p>
                  <p className="text-sm font-medium">{formatCurrency(payload[0].value)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#111111"
          strokeWidth={2}
          dot={{ r: 4, fill: "#111111", strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#111111", stroke: "#FFF", strokeWidth: 2 }}
          animationDuration={1000}
        />
      </RechartsLine>
    </ResponsiveContainer>
  );
}
