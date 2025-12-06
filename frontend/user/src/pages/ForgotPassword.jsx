import { useState } from "react";
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
    setLoading(true);

    try {
      if (!email) {
        setError("Vui lòng nhập email");
        return;
      }

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white font-black text-2xl">W</span>
              </div>
              <div className="text-2xl font-light tracking-[0.2em] uppercase text-gray-900">
                Watchstore
              </div>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✓</span>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Kiểm tra Email
              </h2>
              <p className="text-sm text-gray-600">
                Chúng tôi đã gửi link reset mật khẩu đến
                <br />
                <span className="font-semibold text-gray-900">{email}</span>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <p className="text-sm text-blue-700">
                💡 Link sẽ hết hạn trong 30 phút. Nếu không thấy email, kiểm tra
                thư rác.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/reset-password?email=${encodeURIComponent(email)}`)
              }
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition"
            >
              Tiếp tục xác thực
            </button>

            <button
              onClick={() => setSent(false)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Thử email khác
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-md bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="text-white font-black text-2xl">W</span>
            </div>
            <div className="text-2xl font-light tracking-[0.2em] uppercase text-gray-900">
              Watchstore
            </div>
          </Link>
          <p className="text-gray-600 mt-2">Lấy lại mật khẩu</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập email tài khoản của bạn
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="name@example.com"
              />
              <p className="text-xs text-gray-500 mt-2">
                Chúng tôi sẽ gửi link reset mật khẩu đến email này
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang gửi..." : "Gửi link reset"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
