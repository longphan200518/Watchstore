import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { getReviews, deleteReview } from "../services/reviewService";
import { formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";
import AdminHeader from "../components/AdminHeader";

export default function Reviews() {
  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "Quản lý sản phẩm", path: "/products" },
    { label: "Quản lý đơn hàng", path: "/orders" },
    { label: "Quản lý thương hiệu", path: "/brands" },
    { label: "Quản lý người dùng", path: "/users" },
    { label: "Quản lý đánh giá", path: "/reviews" },
  ];

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ pageNumber: 1, pageSize: 20 });

  useEffect(() => {
    fetchReviews();
  }, [pagination.pageNumber]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await getReviews({
        pageNumber: pagination.pageNumber,
        pageSize: pagination.pageSize,
      });
      if (response.success) {
        setReviews(response.data.items || []);
      } else {
        setError("Không tải được đánh giá");
      }
    } catch (err) {
      setError("Lỗi khi tải đánh giá");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      const response = await deleteReview(id);
      if (response.success) {
        fetchReviews();
      } else {
        alert("Không thể xóa đánh giá");
      }
    } catch (err) {
      alert("Lỗi khi xóa đánh giá");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={star <= rating ? "text-amber-500" : "text-gray-300"}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => reviews.filter(rev => rev.rating === r).length);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      <main className="lg:ml-72 min-h-screen">
        <AdminHeader 
          title="Quản lý đánh giá" 
          subtitle="Trang chủ / Đánh giá" 
        />
        
        <div className="px-4 lg:px-8 pb-8 space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-3">
                <Icon icon="solar:star-bold-duotone" className="text-xl text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
              <p className="text-xs text-gray-500 mt-1">Tổng đánh giá</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mb-3">
                <Icon icon="solar:medal-star-bold-duotone" className="text-xl text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{avgRating}</p>
              <p className="text-xs text-gray-500 mt-1">Điểm trung bình</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center mb-3">
                <Icon icon="solar:cup-star-bold-duotone" className="text-xl text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{ratingCounts[0]}</p>
              <p className="text-xs text-gray-500 mt-1">5 sao</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-shadow">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center mb-3">
                <Icon icon="solar:danger-triangle-bold-duotone" className="text-xl text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{ratingCounts[4]}</p>
              <p className="text-xs text-gray-500 mt-1">1 sao</p>
            </div>
          </div>

          {loading && (
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600 flex items-center gap-3">
              <Icon icon="svg-spinners:ring-resize" className="text-2xl text-amber-500" />
              <span>Đang tải...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-3">
              <Icon icon="solar:danger-circle-bold" className="text-xl" />
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:star-bold-duotone" />
                        Đánh giá
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Sản phẩm</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Người dùng</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Nội dung</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Ngày tạo</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon icon="solar:box-bold-duotone" className="text-gray-400" />
                        <span className="font-semibold text-gray-900">{review.watchName || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {(review.userName || review.userEmail || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-700">{review.userName || review.userEmail || "—"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">{review.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{review.content}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Icon icon="solar:calendar-bold-duotone" className="text-gray-400" />
                        <span className="text-sm">{formatDate(review.createdAt)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa đánh giá"
                        >
                          <Icon icon="solar:trash-bin-trash-bold-duotone" className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
