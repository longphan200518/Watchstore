import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-primary text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Watchstore Admin</h1>
        </div>
        <nav className="mt-8">
          <Link to="/" className="block px-6 py-3 bg-secondary hover:bg-opacity-80 transition">
            Dashboard
          </Link>
          <Link to="/products" className="block px-6 py-3 hover:bg-gray-700 transition">
            Quản lý sản phẩm
          </Link>
          <Link to="/orders" className="block px-6 py-3 hover:bg-gray-700 transition">
            Quản lý đơn hàng
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-primary">Dashboard</h2>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Tổng doanh thu</h3>
            <p className="text-3xl font-bold text-primary mt-2">$0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Tổng đơn hàng</h3>
            <p className="text-3xl font-bold text-secondary mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Tổng sản phẩm</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">0</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium">Khách hàng</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">0</p>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-primary mb-4">Hoạt động gần đây</h3>
          <p className="text-gray-500">Không có dữ liệu</p>
        </div>
      </main>
    </div>
  )
}
