import { Link, useLocation } from 'react-router-dom'

const orders = [
  { code: '#WS-1092', customer: 'Lê Minh Tuấn', total: '₫152.000.000', status: 'Đang giao', date: 'Hôm nay, 10:15' },
  { code: '#WS-1089', customer: 'Trần Khánh Linh', total: '₫92.500.000', status: 'Đã giao', date: 'Hôm qua, 16:40' },
  { code: '#WS-1083', customer: 'Nguyễn Hoàng', total: '₫68.200.000', status: 'Đã xác nhận', date: '02/12, 11:05' },
  { code: '#WS-1077', customer: 'Phạm Quang Huy', total: '₫214.800.000', status: 'Đã hủy', date: '30/11, 09:50' },
]

const statusColor = {
  'Đang giao': 'bg-amber-50 text-amber-700 border border-amber-100',
  'Đã giao': 'bg-green-50 text-green-700 border border-green-100',
  'Đã xác nhận': 'bg-blue-50 text-blue-700 border border-blue-100',
  'Đã hủy': 'bg-red-50 text-red-700 border border-red-100',
}

export default function Orders() {
  const location = useLocation()
  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Quản lý sản phẩm', path: '/products' },
    { label: 'Quản lý đơn hàng', path: '/orders' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-primary text-white shadow-2xl/40 shadow-black/30">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-wide">Watchstore Admin</h1>
          <p className="text-sm text-white/70 mt-1">Luxury watch control center</p>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => {
            const active = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-sm font-medium transition ${
                  active ? 'bg-secondary text-white' : 'text-white/80 hover:bg-white/10'
                }`}
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white/70" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Quản lý & theo dõi đơn</p>
            <h2 className="text-3xl font-semibold text-gray-900">Đơn hàng</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-white shadow-sm">
              Xuất Excel
            </button>
            <button className="px-4 py-2 rounded-lg bg-secondary text-white text-sm hover:bg-blue-600 shadow">
              Tạo đơn thủ công
            </button>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-lg">🧾</span>
              <div>
                <p className="text-sm text-gray-500">Tổng số đơn</p>
                <p className="text-lg font-semibold text-gray-900">{orders.length} đơn</p>
              </div>
            </div>
            <button className="text-sm text-secondary hover:underline">Bộ lọc nhanh</button>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Mã đơn</th>
                <th className="px-6 py-3 text-left">Khách hàng</th>
                <th className="px-6 py-3 text-left">Tổng tiền</th>
                <th className="px-6 py-3 text-left">Ngày giờ</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((o) => (
                <tr key={o.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{o.code}</td>
                  <td className="px-6 py-4 text-gray-800">{o.customer}</td>
                  <td className="px-6 py-4 text-gray-900 font-semibold">{o.total}</td>
                  <td className="px-6 py-4 text-gray-600">{o.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[o.status]}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white shadow-sm">
                      Xem
                    </button>
                    <button className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white shadow-sm">
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
