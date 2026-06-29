import { Link } from 'react-router-dom'

export default function NotFound() {
 return (
 <div className="min-h-screen bg-gray-50 flex items-center justify-center">
 <div className="text-center">
 <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
 <p className={`text-2xl text-black mb-8`}>Trang không tìm thấy</p>
 <Link to="/" className="inline-block px-8 py-3 bg-black text-white rounded-lg hover:bg-black transition">
 Quay lại trang chủ
 </Link>
 </div>
 </div>
 )
}
