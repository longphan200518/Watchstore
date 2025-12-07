import { useState } from "react";

export default function ImageUpload({
  label,
  onImageChange,
  currentImage = "",
}) {
  const [uploadMode, setUploadMode] = useState("url"); // 'url' or 'file'
  const [imageUrl, setImageUrl] = useState(currentImage);
  const [previewUrl, setPreviewUrl] = useState(currentImage);

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setPreviewUrl(url);
    onImageChange(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Tạo URL preview cho file
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        // Gửi base64 string hoặc có thể upload lên server
        onImageChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Toggle giữa URL và File */}
      <div className="flex gap-2 mb-3">
        <button
          type="button"
          onClick={() => setUploadMode("url")}
          className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
            uploadMode === "url"
              ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          📎 URL từ web
        </button>
        <button
          type="button"
          onClick={() => setUploadMode("file")}
          className={`flex-1 px-3 py-2 text-sm rounded-lg border transition-colors ${
            uploadMode === "file"
              ? "bg-blue-50 border-blue-500 text-blue-700 font-medium"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
          }`}
        >
          🖼️ Tải từ máy
        </button>
      </div>

      {/* Input tùy theo mode */}
      {uploadMode === "url" ? (
        <input
          type="text"
          value={imageUrl}
          onChange={handleUrlChange}
          placeholder="Nhập URL hình ảnh..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      ) : (
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      )}

      {/* Preview ảnh */}
      {previewUrl && (
        <div className="mt-3">
          <img
            src={previewUrl}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-gray-200"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/400x300?text=Image+Error";
            }}
          />
        </div>
      )}
    </div>
  );
}
