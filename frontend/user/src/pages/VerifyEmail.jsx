import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút
  const [email] = useState(localStorage.getItem("registerEmail") || "");

  useEffect(() => {
    // Redirect nếu không có email
    if (!email) {
      navigate("/register");
      return;
    }

    // Timer countdown
    if (timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, email, navigate]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      setError("Vui lòng nhập đầy đủ 6 số");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:5221/api/auth/verify-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            otp: otpCode,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Lưu dữ liệu đăng ký vào localStorage
        const registerData = JSON.parse(
          localStorage.getItem("registerData") || "{}"
        );
        localStorage.setItem("newUser", JSON.stringify(registerData));
        localStorage.removeItem("registerEmail");
        localStorage.removeItem("registerData");

        navigate("/login?verified=true");
      } else {
        setError(result.message || "Mã OTP không chính xác. Vui lòng thử lại.");
        setOtp(["", "", "", "", "", ""]);
      }
    } catch (err) {
      setError(err.message || "Xác thực thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5221/api/auth/resend-verification-otp",
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
        setTimeLeft(300);
        setOtp(["", "", "", "", "", ""]);
        setError("");
      } else {
        setError(result.message || "Gửi lại OTP thất bại");
      }
    } catch (err) {
      setError("Gửi lại OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

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

        {/* Verify Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Xác thực Email
            </h2>
            <p className="text-sm text-gray-600">
              Chúng tôi đã gửi mã xác thực 6 số đến
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* OTP Input */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Nhập mã OTP (6 số)
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                ))}
              </div>
            </div>

            {/* Timer */}
            <div className="text-center text-sm">
              {timeLeft > 0 ? (
                <p className="text-gray-600">
                  Mã sẽ hết hạn trong{" "}
                  <span className="font-semibold text-amber-600">
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-red-600">
                  Mã xác thực đã hết hạn. Vui lòng gửi lại.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || timeLeft <= 0}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác thực..." : "Xác thực"}
            </button>
          </form>

          {/* Resend OTP */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">Không nhận được mã?</p>
            <button
              onClick={handleResendOtp}
              disabled={loading || timeLeft > 240}
              className="text-sm text-amber-600 font-medium hover:text-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {timeLeft > 240
                ? `Gửi lại trong ${formatTime(timeLeft - 240)}`
                : "Gửi lại mã"}
            </button>
          </div>

          {/* Change Email */}
          <div className="mt-4 text-center">
            <Link
              to="/register"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Quay lại đăng ký
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
