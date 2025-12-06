import { Link, useLocation } from 'react-router-dom'

const products = [
  {
    name: 'Royal Oak Offshore 44mm Ceramic',
    price: '₫425.000.000',
    stock: 12,
    status: 'Đang bán',
    badge: 'Hot',
  },
  {
    name: 'Seamaster Aqua Terra 41mm',
    price: '₫185.000.000',
    stock: 28,
    status: 'Đang bán',
    badge: 'New',
  },
  {
    name: 'Patrimony Perpetual Calendar',
    price: '₫320.000.000',
    stock: 4,
    status: 'Sắp hết',
    badge: 'Low',
  },
  {
    name: 'Speedmaster Racing Titanium',
    price: '₫275.000.000',
    stock: 0,
    status: 'Hết hàng',
    badge: 'Out',
  },
]

const statusColor = {
  'Đang bán': 'bg-green-50 text-green-700 border border-green-100',
  'Sắp hết': 'bg-amber-50 text-amber-700 border border-amber-100',
  'Hết hàng': 'bg-red-50 text-red-700 border border-red-100',
}

export default function Products() {
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
            <p className="text-sm text-gray-500">Quản lý danh mục sản phẩm</p>
            <h2 className="text-3xl font-semibold text-gray-900">Sản phẩm</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-white shadow-sm">
              Nhập CSV
            </button>
            <button className="px-4 py-2 rounded-lg bg-secondary text-white text-sm hover:bg-blue-600 shadow">
              Thêm sản phẩm
            </button>
          </div>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <span className="text-lg">📦</span>
              <div>
                <p className="text-sm text-gray-500">Tổng số sản phẩm</p>
                <p className="text-lg font-semibold text-gray-900">{products.length} mặt hàng</p>
              </div>
            </div>
            <button className="text-sm text-secondary hover:underline">Xem bộ lọc</button>
          </div>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">Sản phẩm</th>
                <th className="px-6 py-3 text-left">Giá</th>
                <th className="px-6 py-3 text-left">Tồn kho</th>
                <th className="px-6 py-3 text-left">Trạng thái</th>
                <th className="px-6 py-3 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{p.badge}</span>
                      <p className="font-medium text-gray-900">{p.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-800 font-semibold">{p.price}</td>
                  <td className="px-6 py-4 text-gray-700">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="px-3 py-1.5 text-xs rounded border border-gray-200 text-gray-700 hover:bg-white shadow-sm">
                      Sửa
                    </button>
                    <button className="px-3 py-1.5 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50">
                      Xóa
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
