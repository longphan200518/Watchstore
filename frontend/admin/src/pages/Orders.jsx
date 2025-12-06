import { Link } from 'react-router-dom'

export default function Orders() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 w-64 h-screen bg-primary text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Watchstore Admin</h1>
        </div>
        <nav className="mt-8">
          <Link to="/" className="block px-6 py-3 hover:bg-gray-700 transition">
            Dashboard
          </Link>
          <Link to="/products" className="block px-6 py-3 hover:bg-gray-700 transition">
            Quản lý sản phẩm
          </Link>
          <Link to="/orders" className="block px-6 py-3 bg-secondary hover:bg-opacity-80 transition">
            Quản lý đơn hàng
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Quản lý đơn hàng</h2>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Mã đơn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Không có đơn hàng
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
