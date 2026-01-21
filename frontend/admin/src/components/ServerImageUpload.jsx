import { useState, useRef } from "react";
import { Icon } from "@iconify/react";
import { imageUploadService } from "../services/imageUploadService";
import { useToast } from "../contexts/ToastContext";
import { LoadingSpinner } from "./Loading";

/**
 * Advanced Single Image Upload Component with Server Upload
 * @param {Object} props
 * @param {string} props.currentImage - Current image URL
 * @param {Function} props.onImageChange - Callback when image changes (url) => {}
 * @param {string} props.folder - Upload folder name
 * @param {string} props.label - Input label
 * @param {boolean} props.required - Is required field
 */
export const ServerImageUpload = ({
  currentImage,
  onImageChange,
  folder = "general",
  label = "Hình ảnh",
  required = false,
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      showToast("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)", "error");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast("Kích thước file không được vượt quá 5MB", "error");
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const result = await imageUploadService.uploadImage(file, folder);
      if (result.success && result.url) {
        onImageChange(result.url);
        showToast("Upload ảnh thành công!", "success");
      } else {
        showToast(result.error || "Upload ảnh thất bại", "error");
        setPreview(currentImage);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast(error.response?.data?.message || "Lỗi upload ảnh", "error");
      setPreview(currentImage);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (currentImage) {
      try {
        await imageUploadService.deleteImage(currentImage);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="relative w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          {uploading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80">
              <LoadingSpinner size="md" />
            </div>
          ) : preview ? (
            <>
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
              >
                <Icon icon="mdi:close" className="text-lg" />
              </button>
            </>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <Icon icon="mdi:image-plus" className="text-4xl mb-1" />
              <span className="text-xs">Chưa có ảnh</span>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id={`image-upload-${folder}`}
          />
          <label
            htmlFor={`image-upload-${folder}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Icon icon="mdi:upload" className="text-xl" />
            {preview ? "Thay đổi ảnh" : "Chọn ảnh"}
          </label>
          <p className="text-xs text-gray-500 mt-2">
            JPG, PNG, GIF, WEBP (Max 5MB)
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Multiple Images Upload Component
 * @param {Object} props
 * @param {string[]} props.currentImages - Array of current image URLs
 * @param {Function} props.onImagesChange - Callback when images change (urls) => {}
 * @param {string} props.folder - Upload folder name
 * @param {string} props.label - Input label
 * @param {number} props.maxImages - Maximum number of images
 */
export const MultipleImageUpload = ({
  currentImages = [],
  onImagesChange,
  folder = "general",
  label = "Hình ảnh",
  maxImages = 10,
}) => {
  const [previews, setPreviews] = useState(currentImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check max images
    if (previews.length + files.length > maxImages) {
      showToast(`Chỉ được upload tối đa ${maxImages} ảnh`, "error");
      return;
    }

    // Validate files
    const validFiles = [];
    for (const file of files) {
      if (
        ![
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ].includes(file.type)
      ) {
        showToast(`File ${file.name} không hợp lệ`, "error");
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast(`File ${file.name} vượt quá 5MB`, "error");
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    // Show previews
    const newPreviews = await Promise.all(
      validFiles.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setPreviews([...previews, ...newPreviews]);

    // Upload to server
    setUploading(true);
    try {
      const result = await imageUploadService.uploadMultipleImages(
        validFiles,
        folder
      );
      if (result.success && result.urls) {
        const newUrls = [...currentImages, ...result.urls];
        onImagesChange(newUrls);
        showToast(`Upload ${result.urls.length} ảnh thành công!`, "success");
      } else {
        showToast(result.error || "Upload ảnh thất bại", "error");
        setPreviews(currentImages);
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast(error.response?.data?.message || "Lỗi upload ảnh", "error");
      setPreviews(currentImages);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = async (index) => {
    const imageUrl = currentImages[index];
    if (imageUrl) {
      try {
        await imageUploadService.deleteImage(imageUrl);
      } catch (error) {
        console.error("Delete error:", error);
      }
    }

    const newPreviews = previews.filter((_, i) => i !== index);
    const newUrls = currentImages.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesChange(newUrls);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        <span className="text-gray-500 text-xs ml-2">
          ({previews.length}/{maxImages} ảnh)
        </span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Preview Images */}
        {previews.map((preview, index) => (
          <div
            key={index}
            className="relative w-full aspect-square border-2 border-gray-300 rounded-lg overflow-hidden bg-gray-50"
          >
            <img
              src={preview}
              alt={`Preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
            >
              <Icon icon="mdi:close" className="text-lg" />
            </button>
          </div>
        ))}

        {/* Upload Button */}
        {previews.length < maxImages && (
          <div className="relative w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <LoadingSpinner size="md" />
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id={`multiple-image-upload-${folder}`}
                />
                <label
                  htmlFor={`multiple-image-upload-${folder}`}
                  className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition"
                >
                  <Icon icon="mdi:image-plus" className="text-4xl mb-1" />
                  <span className="text-xs">Thêm ảnh</span>
                </label>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500">
        JPG, PNG, GIF, WEBP (Max 5MB mỗi ảnh)
      </p>
    </div>
  );
};
