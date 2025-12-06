import { Link } from 'react-router-dom'

export default function Products() {
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
          <Link to="/products" className="block px-6 py-3 bg-secondary hover:bg-opacity-80 transition">
            Quản lý sản phẩm
          </Link>
          <Link to="/orders" className="block px-6 py-3 hover:bg-gray-700 transition">
            Quản lý đơn hàng
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Quản lý sản phẩm</h2>
          <button className="px-6 py-2 bg-secondary text-white rounded-lg hover:bg-opacity-90 transition">
            Thêm sản phẩm
          </button>
        </div>

        {/* Products table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Tên sản phẩm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Giá
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                  Không có sản phẩm
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
