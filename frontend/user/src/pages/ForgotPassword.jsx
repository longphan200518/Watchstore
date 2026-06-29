import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function ForgotPassword() {
 const navigate = useNavigate();
 const [email, setEmail] = useState("");
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const [sent, setSent] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError("");

 if (!email) {
 setError("Vui lòng nhập email");
 return;
 }

 setLoading(true);

 try {
 const response = await fetch(
 "http://localhost:5221/api/auth/forgot-password",
 {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 email: email,
 }),
 }
 );

 const result = await response.json();

 if (result.success) {
 // Lưu email tạm thời
 localStorage.setItem("resetEmail", email);
 setSent(true);
 } else {
 setError(result.message || "Gửi email thất bại");
 }
 } catch (err) {
 setError(err.message || "Gửi email thất bại");
 } finally {
 setLoading(false);
 }
 };

 if (sent) {
 return (
 <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
 <div className="w-full md:w-[60%] h-64 md:h-screen relative overflow-hidden bg-black hidden md:block">
 <img src="/luxury-watch.png" alt="Luxury Watch" className="absolute inset-0 w-full h-full object-cover opacity-80" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
 <div className="absolute bottom-20 left-20 text-white z-10">
 <Link to="/" className="inline-flex items-center gap-3 group mb-6">
 <div className="w-12 h-12 bg-white flex items-center justify-center">
 <span className="text-black font-black text-2xl font-serif">W</span>
 </div>
 <div className="text-2xl font-light tracking-[0.2em] uppercase text-white font-serif">Watchstore</div>
 </Link>
 <h2 className="text-5xl font-serif mb-4">Timeless Elegance</h2>
 <p className={`text-xl font-light text-black`}>Crafted for Time. Designed for Elegance.</p>
 </div>
 </div>

 <div className="w-full md:w-[40%] flex items-center justify-center p-8 md:p-12 lg:p-20 bg-white">
 <div className="w-full max-w-md text-center">
 <h1 className="text-4xl font-serif mb-6 text-black uppercase tracking-wide">KIỂM TRA EMAIL</h1>
 <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
 <span className="text-3xl text-white">✓</span>
 </div>

 <p className={`text-black mb-2 font-light`}>Chúng tôi đã gửi link reset mật khẩu đến</p>
 <p className="font-medium text-black text-lg mb-8">{email}</p>

 <button
 onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
 className="w-full h-[54px] bg-black text-white rounded-[10px] font-medium hover:bg-[#222] transition-colors uppercase tracking-wider mb-4"
 >
 Tiếp tục xác thực
 </button>

 <button
 onClick={() => setSent(false)}
 className={`text-sm text-black hover:text-black transition-colors`}
 >
 ← Thử email khác
 </button>
 </div>
 </div>
 </div>
 );
 }

 return (
 <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
 <div className="w-full md:w-[60%] h-64 md:h-screen relative overflow-hidden bg-black">
 <img src="/luxury-watch.png" alt="Luxury Watch" className="absolute inset-0 w-full h-full object-cover opacity-80" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
 <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-white z-10">
 <Link to="/" className="inline-flex items-center gap-3 group mb-6">
 <div className="w-10 h-10 md:w-12 md:h-12 bg-white flex items-center justify-center">
 <span className="text-black font-black text-xl md:text-2xl font-serif">W</span>
 </div>
 <div className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-white font-serif">Watchstore</div>
 </Link>
 <h2 className="text-3xl md:text-5xl font-serif mb-4">Timeless Elegance</h2>
 <p className={`text-lg md:text-xl font-light text-black`}>Crafted for Time. Designed for Elegance.</p>
 </div>
 </div>

 <div className="w-full md:w-[40%] flex items-center justify-center p-8 md:p-12 lg:p-20 bg-white">
 <div className="w-full max-w-md">
 <h1 className="text-4xl font-serif mb-2 text-black uppercase tracking-wide">Quên mật khẩu</h1>
 <p className={`text-black mb-8 font-light`}>Nhập email để nhận liên kết đặt lại mật khẩu.</p>

 <form onSubmit={handleSubmit} className="space-y-6">
 {error && (
 <div className="bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">
 {error}
 </div>
 )}

 <div>
 <label className="block text-sm font-medium text-black mb-2 uppercase tracking-wide">
 Email
 </label>
 <input
 type="email"
 required
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 disabled={loading}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
 placeholder="name@example.com"
 />
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full h-[54px] bg-black text-white rounded-[10px] font-medium hover:bg-[#222] transition-colors disabled:opacity-50 mt-4 uppercase tracking-wider"
 >
 {loading ? "Đang gửi..." : "Gửi liên kết"}
 </button>
 </form>

 <div className="mt-8 text-center text-sm">
 <Link to="/login" className={`text-black hover:text-black transition-colors font-medium`}>
 ← Quay lại đăng nhập
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
