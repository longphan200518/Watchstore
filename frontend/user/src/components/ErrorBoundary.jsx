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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
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
              Rất tiếc! Đã xảy ra lỗi
            </h1>

            {/* Description */}
            <p className="text-gray-600 text-center mb-8">
              Trang web đã gặp sự cố. Vui lòng thử tải lại hoặc quay lại trang
              chủ.
            </p>

            {/* Error Details (Development only) */}
            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
                <h3 className="font-bold text-red-900 mb-2 flex items-center gap-2">
                  <Icon icon="mdi:bug" className="text-xl" />
                  Chi tiết lỗi (Dev mode)
                </h3>
                <p className="text-red-800 font-mono text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                <details className="text-xs text-red-700">
                  <summary className="cursor-pointer font-medium hover:text-red-900">
                    Stack trace
                  </summary>
                  <pre className="mt-2 overflow-auto bg-white p-2 rounded border border-red-200 max-h-48">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5"
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
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
