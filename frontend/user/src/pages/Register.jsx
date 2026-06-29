import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Register() {
 const [formData, setFormData] = useState({
 name: "",
 email: "",
 password: "",
 confirmPassword: "",
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError("");

 // Validation
 if (formData.password !== formData.confirmPassword) {
 setError("Mật khẩu xác nhận không khớp");
 return;
 }

 if (formData.password.length < 6) {
 setError("Mật khẩu phải có ít nhất 6 ký tự");
 return;
 }

 setLoading(true);

 try {
 const response = await fetch("http://localhost:5221/api/auth/register", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 fullName: formData.name,
 email: formData.email,
 password: formData.password,
 }),
 });

 const result = await response.json();

 if (result.success) {
 // Lưu email và dữ liệu đăng ký vào localStorage
 localStorage.setItem("registerEmail", formData.email);
 localStorage.setItem("registerData", JSON.stringify(formData));
 // Redirect đến trang xác thực email
 window.location.href = "/verify-email";
 } else {
 setError(result.message || "Đăng ký thất bại");
 }
 } catch (err) {
 setError(err.message || "Đăng ký thất bại");
 } finally {
 setLoading(false);
 }
 };

 return (
 <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
 {/* Left side: Image */}
 <div className="w-full md:w-[60%] h-64 md:h-screen relative overflow-hidden bg-black">
 <img
 src="/luxury-watch.png"
 alt="Luxury Watch"
 className="absolute inset-0 w-full h-full object-cover opacity-80"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
 <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 text-white z-10">
 <Link to="/" className="inline-flex items-center gap-3 group mb-6">
 <div className="w-10 h-10 md:w-12 md:h-12 bg-white flex items-center justify-center">
 <span className="text-black font-black text-xl md:text-2xl font-serif">W</span>
 </div>
 <div className="text-xl md:text-2xl font-light tracking-[0.2em] uppercase text-white font-serif">
 Watchstore
 </div>
 </Link>
 <h2 className="text-3xl md:text-5xl font-serif mb-4">Timeless Elegance</h2>
 <p className={`text-lg md:text-xl font-light text-black`}>
 Crafted for Time. Designed for Elegance.
 </p>
 </div>
 </div>

 {/* Right side: Form */}
 <div className="w-full md:w-[40%] flex items-center justify-center p-8 md:p-12 lg:p-20 bg-white">
 <div className="w-full max-w-md">
 <h1 className="text-4xl font-serif mb-2 text-black uppercase tracking-wide">Tạo tài khoản</h1>
 <p className={`text-black mb-8 font-light`}>Join the world of timeless watches.</p>

 <form onSubmit={handleSubmit} className="space-y-5">
 {error && (
 <div className="bg-red-50 text-red-700 px-4 py-3 text-sm border border-red-200">
 {error}
 </div>
 )}

 <div>
 <label className="block text-sm font-medium text-black mb-2 uppercase tracking-wide">
 Họ và tên
 </label>
 <input
 type="text"
 required
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
 placeholder="Nguyễn Văn A"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-black mb-2 uppercase tracking-wide">
 Email
 </label>
 <input
 type="email"
 required
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
 placeholder="name@example.com"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-black mb-2 uppercase tracking-wide">
 Mật khẩu
 </label>
 <input
 type="password"
 required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
 placeholder="Tối thiểu 6 ký tự"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-black mb-2 uppercase tracking-wide">
 Xác nhận mật khẩu
 </label>
 <input
 type="password"
 required
 value={formData.confirmPassword}
 onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
 placeholder="Nhập lại mật khẩu"
 />
 </div>

 <div className="flex items-start gap-2 text-sm pt-2">
 <input
 type="checkbox"
 required
 className="w-4 h-4 mt-0.5 text-black border-[#DADADA] rounded focus:ring-black accent-black"
 />
 <label className={"text-black"}>
 Tôi đồng ý với{" "}
 <Link to="/terms" className="text-black hover:underline font-medium">
 Điều khoản dịch vụ
 </Link>{" "}
 và{" "}
 <Link to="/privacy" className="text-black hover:underline font-medium">
 Chính sách bảo mật
 </Link>
 </label>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full h-[54px] bg-black text-white rounded-[10px] font-medium hover:bg-[#222] transition-colors disabled:opacity-50 mt-4 uppercase tracking-wider"
 >
 {loading ? "Đang xử lý..." : "Tạo tài khoản"}
 </button>
 </form>

 <div className={`mt-8 text-center text-sm text-black`}>
 Đã có tài khoản?{" "}
 <Link to="/login" className="text-black font-medium hover:underline">
 Đăng nhập
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
