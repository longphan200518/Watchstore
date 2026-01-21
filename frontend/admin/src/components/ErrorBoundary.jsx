import React from "react";
import { Icon } from "@iconify/react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      // this.logErrorToService(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <Icon
                  icon="mdi:alert-circle-outline"
                  className="text-6xl text-red-600"
                />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">
              Oops! Đã có lỗi xảy ra
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8">
              Ứng dụng đã gặp lỗi không mong muốn. Vui lòng thử tải lại trang
              hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp diễn.
            </p>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <Icon icon="mdi:code-tags" className="text-xl" />
                  Chi tiết lỗi (Chỉ hiển thị ở môi trường dev)
                </h3>
                <p className="text-red-800 font-mono text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                <details className="text-xs text-red-700">
                  <summary className="cursor-pointer font-medium hover:text-red-900">
                    Stack trace
                  </summary>
                  <pre className="mt-2 overflow-auto bg-white p-2 rounded border border-red-200">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Icon
                  icon="mdi:refresh"
                  className="inline-block mr-2 text-xl"
                />
                Thử lại
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                <Icon icon="mdi:home" className="inline-block mr-2 text-xl" />
                Về trang chủ
              </button>
            </div>

            {/* Support Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Cần hỗ trợ?{" "}
                <a
                  href="mailto:support@watchstore.com"
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Liên hệ chúng tôi
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
