import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import cartService from "../services/cartService";
import { getSessionId, clearSessionId } from "../utils/sessionId";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLogin from "@greatsumini/react-facebook-login";

export default function Login() {
 const [searchParams] = useSearchParams();
 const [formData, setFormData] = useState({
 email: "",
 password: "",
 rememberMe: false,
 });
 const [error, setError] = useState("");
 const [loading, setLoading] = useState(false);
 const resetSuccess = searchParams.get("reset") === "success";
 const verifiedSuccess = searchParams.get("verified") === "true";

 const handleSubmit = async (e) => {
 e.preventDefault();
 setError("");
 setLoading(true);

 try {
 const response = await fetch("http://localhost:5221/api/auth/login", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 email: formData.email,
 password: formData.password,
 rememberMe: formData.rememberMe,
 }),
 });

 const result = await response.json();

 if (result.success) {
 // Lưu token và user data
 const storage = formData.rememberMe ? localStorage : sessionStorage;
 storage.setItem("token", result.data.token);
 storage.setItem("refreshToken", result.data.refreshToken);
 storage.setItem(
 "refreshTokenExpiresAt",
 result.data.refreshTokenExpiresAt
 );
 storage.setItem("user", JSON.stringify(result.data.user));

 // Merge giỏ hàng session vào tài khoản user
 try {
 const sessionId = getSessionId();
 await cartService.mergeCart(sessionId);
 clearSessionId();
 } catch (mergeErr) {
 console.warn("[Cart] Lỗi merge giỏ hàng sau đăng nhập:", mergeErr);
 }

 const redirect = searchParams.get("redirect") || "/";
 window.location.href = redirect;
 } else {
 setError(result.message || "Đăng nhập thất bại");
 }
 } catch (err) {
 setError(err.message || "Đăng nhập thất bại");
 } finally {
 setLoading(false);
 }
 };

 const handleExternalLogin = async (provider, token) => {
 setError("");
 setLoading(true);
 try {
 const response = await fetch("http://localhost:5221/api/auth/external-login", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 },
 body: JSON.stringify({ provider, token }),
 });

 const result = await response.json();

 if (result.success) {
 localStorage.setItem("token", result.data.token);
 localStorage.setItem("refreshToken", result.data.refreshToken);
 localStorage.setItem("user", JSON.stringify(result.data.user));

 try {
 const sessionId = getSessionId();
 await cartService.mergeCart(sessionId);
 clearSessionId();
 } catch (mergeErr) {
 console.warn("[Cart] Lỗi merge giỏ hàng sau đăng nhập:", mergeErr);
 }

 const redirect = searchParams.get("redirect") || "/";
 window.location.href = redirect;
 } else {
 setError(result.message || "Đăng nhập thất bại");
 }
 } catch (err) {
 setError("Đăng nhập thất bại do lỗi kết nối");
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
 <h1 className="text-4xl font-serif mb-2 text-black">ĐĂNG NHẬP</h1>
 <p className={`text-black mb-8 font-light`}>Join the world of timeless watches.</p>

 <form onSubmit={handleSubmit} className="space-y-5">
 {resetSuccess && (
 <div className="bg-green-50 text-green-700 px-4 py-3 text-sm border border-green-200">
 ✓ Mật khẩu của bạn đã được cập nhật thành công. Vui lòng đăng nhập.
 </div>
 )}
 {verifiedSuccess && (
 <div className="bg-green-50 text-green-700 px-4 py-3 text-sm border border-green-200">
 ✓ Email của bạn đã được xác thực. Vui lòng đăng nhập.
 </div>
 )}
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
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
 placeholder="name@example.com"
 />
 </div>

 <div>
 <div className="flex items-center justify-between mb-2">
 <label className="block text-sm font-medium text-black uppercase tracking-wide">
 Mật khẩu
 </label>
 <Link to="/forgot-password" className={`text-sm text-black hover:text-black transition-colors`}>
 Quên mật khẩu?
 </Link>
 </div>
 <input
 type="password"
 required
 value={formData.password}
 onChange={(e) => setFormData({ ...formData, password: e.target.value })}
 className="w-full h-[52px] px-4 border border-[#DADADA] rounded-[10px] bg-white text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors"
 placeholder="Nhập mật khẩu"
 />
 </div>

 <div className="flex items-center gap-2 text-sm pt-2">
 <input
 type="checkbox"
 checked={formData.rememberMe}
 onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
 className="w-4 h-4 text-black border-[#DADADA] rounded focus:ring-black accent-black"
 />
 <span className={"text-black"}>Ghi nhớ đăng nhập</span>
 </div>

 <button
 type="submit"
 disabled={loading}
 className="w-full h-[54px] bg-black text-white rounded-[10px] font-medium hover:bg-[#222] transition-colors disabled:opacity-50 mt-4 uppercase tracking-wider"
 >
 {loading ? "Đang xử lý..." : "Đăng nhập"}
 </button>
 </form>

 <div className="mt-8 flex items-center justify-center space-x-4">
 <div className="flex-1 h-px bg-[#E5E5E5]"></div>
 <span className={`text-sm text-black uppercase tracking-wide`}>Hoặc tiếp tục với</span>
 <div className="flex-1 h-px bg-[#E5E5E5]"></div>
 </div>

 <div className="mt-6 flex flex-col gap-4">
 <div className="flex justify-center w-full">
 <GoogleLogin
 onSuccess={(credentialResponse) => handleExternalLogin("Google", credentialResponse.credential)}
 onError={() => setError("Đăng nhập Google thất bại")}
 theme="outline"
 size="large"
 shape="rectangular"
 width={360}
 />
 </div>

 <FacebookLogin
 appId="YOUR_FACEBOOK_APP_ID"
 onSuccess={(response) => handleExternalLogin("Facebook", response.accessToken)}
 onFail={(error) => {
 console.log("Facebook Error: ", error);
 setError("Đăng nhập Facebook thất bại");
 }}
 className={`w-full h-[40px] border border-[#DADADA] rounded bg-white text-black font-medium hover:border-black hover:bg-gray-50 transition-colors flex items-center justify-center gap-3`}
 style={{
 width: "100%",
 maxWidth: "360px",
 margin: "0 auto",
 borderRadius: "4px"
 }}
 children={
 <>
 <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
 </svg>
 Đăng nhập bằng Facebook
 </>
 }
 />
 </div>

 <div className={`mt-8 text-center text-sm text-black`}>
 Chưa có tài khoản?{" "}
 <Link to="/register" className="text-black font-medium hover:underline">
 Đăng ký ngay
 </Link>
 </div>
 </div>
 </div>
 </div>
 );
}
