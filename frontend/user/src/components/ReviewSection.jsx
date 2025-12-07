import { useState } from "react";
import { Icon } from "@iconify/react";

export default function ReviewSection({
  productId,
  isDark = false,
  language = "vi",
}) {
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: "Nguyễn Văn A",
      rating: 5,
      date: "2025-12-05",
      title: "Sản phẩm tuyệt vời!",
      content:
        "Chất lượng rất tốt, giao hàng nhanh chóng. Hài lòng với mua hàng.",
      verified: true,
      helpful: 12,
    },
    {
      id: 2,
      author: "Trần Thị B",
      rating: 4,
      date: "2025-12-03",
      title: "Rất đẹp",
      content: "Đồng hồ rất đẹp, nhưng mất một chút thời gian để quen với nó.",
      verified: true,
      helpful: 8,
    },
  ]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    rating: 5,
  });

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const newReview = {
      id: reviews.length + 1,
      author: "You",
      rating: formData.rating,
      date: new Date().toISOString().split("T")[0],
      title: formData.title,
      content: formData.content,
      verified: true,
      helpful: 0,
    };

    setReviews([newReview, ...reviews]);
    setFormData({ title: "", content: "", rating: 5 });
    setShowReviewForm(false);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            icon={star <= rating ? "mdi:star" : "mdi:star-outline"}
            className={`w-4 h-4 ${
              star <= rating ? "text-amber-500" : "text-gray-400"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className={`rounded-lg border p-8 ${
        isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/5"
      }`}
    >
      <h2
        className={`text-2xl font-semibold mb-8 ${
          isDark ? "text-white" : "text-black"
        }`}
      >
        {language === "vi" ? "Đánh Giá & Nhận Xét" : "Reviews & Ratings"}
      </h2>

      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-8 mb-12 pb-8 border-b border-gray-700/50">
        {/* Overall Rating */}
        <div>
          <div className="flex items-end gap-4">
            <div>
              <div className="text-5xl font-bold text-amber-500">
                {avgRating}
              </div>
              <div className="text-sm text-gray-400 mt-1">
                {language === "vi" ? "trên 5 sao" : "out of 5"}
              </div>
            </div>
            <div className="mb-2">{renderStars(Math.round(avgRating))}</div>
          </div>
          <p
            className={`text-sm mt-4 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            {language === "vi"
              ? `Dựa trên ${reviews.length} đánh giá`
              : `Based on ${reviews.length} reviews`}
          </p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center gap-3">
              <span
                className={`text-sm w-12 ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {rating} ⭐
              </span>
              <div
                className={`flex-1 h-2 rounded-full ${
                  isDark ? "bg-gray-700" : "bg-gray-200"
                }`}
              >
                <div
                  className="h-full bg-amber-500 rounded-full transition-all"
                  style={{
                    width: `${
                      reviews.length > 0
                        ? (ratingCounts[rating] / reviews.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
              <span
                className={`text-sm w-8 text-right ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {ratingCounts[rating]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {!showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className={`mb-8 px-6 py-3 rounded-lg border transition-all ${
            isDark
              ? "border-amber-600 text-amber-500 hover:bg-amber-600/20"
              : "border-amber-500 text-amber-600 hover:bg-amber-100"
          }`}
        >
          {language === "vi" ? "✍️ Viết Đánh Giá" : "✍️ Write Review"}
        </button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 pb-8 border-b border-gray-700/50"
        >
          <div className="space-y-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Đánh giá" : "Rating"}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="text-3xl transition-transform hover:scale-110"
                  >
                    {star <= formData.rating ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Tiêu đề" : "Title"}
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-neutral-800 border-gray-700 text-white focus:border-amber-600"
                    : "bg-white border-gray-300 focus:border-amber-600"
                }`}
                placeholder={
                  language === "vi"
                    ? "Ví dụ: Sản phẩm tuyệt vời!"
                    : "e.g., Great product!"
                }
              />
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {language === "vi" ? "Nội dung" : "Content"}
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows="4"
                className={`w-full px-4 py-2 rounded-lg border outline-none transition-colors ${
                  isDark
                    ? "bg-neutral-800 border-gray-700 text-white focus:border-amber-600"
                    : "bg-white border-gray-300 focus:border-amber-600"
                }`}
                placeholder={
                  language === "vi"
                    ? "Chia sẻ trải nghiệm của bạn..."
                    : "Share your experience..."
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                {language === "vi" ? "Gửi Đánh Giá" : "Submit Review"}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className={`px-6 py-2 rounded-lg border transition-colors ${
                  isDark
                    ? "border-gray-700 text-gray-300 hover:bg-gray-800"
                    : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {language === "vi" ? "Hủy" : "Cancel"}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`pb-6 border-b border-gray-700/50 last:border-b-0 ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3
                    className={`font-semibold ${
                      isDark ? "text-white" : "text-black"
                    }`}
                  >
                    {review.author}
                  </h3>
                  {review.verified && (
                    <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">
                      <Icon icon="mdi:check-circle" className="w-3 h-3" />
                      {language === "vi" ? "Đã mua" : "Verified"}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">{review.date}</p>
              </div>
              {renderStars(review.rating)}
            </div>

            <h4
              className={`font-medium mb-2 ${
                isDark ? "text-gray-200" : "text-gray-800"
              }`}
            >
              {review.title}
            </h4>
            <p className="text-sm leading-relaxed mb-4">{review.content}</p>

            <button className="text-xs text-amber-600 hover:text-amber-700 transition-colors">
              {language === "vi"
                ? `👍 Hữu ích (${review.helpful})`
                : `👍 Helpful (${review.helpful})`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
