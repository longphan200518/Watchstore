import { useEffect, useState } from "react";
import { getReviews, deleteReview } from "../services/reviewService";
import { formatDate } from "../utils/format";
import Sidebar from "../components/Sidebar";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar navItems={navItems} />

      <main className="ml-64 p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Quản lý đánh giá sản phẩm</p>
            <h2 className="text-3xl font-semibold text-gray-900">Đánh giá</h2>
          </div>
        </div>

        {loading && (
          <div className="bg-white border border-gray-100 rounded-xl p-6 text-gray-600">
            Đang tải...
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Danh sách đánh giá
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {reviews.length} đánh giá
                  </p>
                </div>
              </div>
            </div>
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3 text-left">Sản phẩm</th>
                  <th className="px-6 py-3 text-left">Người đánh giá</th>
                  <th className="px-6 py-3 text-left">Đánh giá</th>
                  <th className="px-6 py-3 text-left">Tiêu đề</th>
                  <th className="px-6 py-3 text-left">Nội dung</th>
                  <th className="px-6 py-3 text-left">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reviews.map((review) => (
                  <tr key={review.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {review.watchName || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {review.userName || review.userEmail || "—"}
                    </td>
                    <td className="px-6 py-4">{renderStars(review.rating)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 max-w-xs truncate">
                        {review.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700 max-w-md truncate">
                        {review.content}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleDelete(review.id)}
                        className="px-3 py-1.5 text-xs rounded border border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
