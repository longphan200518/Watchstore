import api from "./api";

export const imageUploadService = {
  /**
   * Upload single image
   * @param {File} file - Image file
   * @param {string} folder - Folder name (e.g., 'products', 'brands')
   * @returns {Promise<{success: boolean, url: string, error?: string}>}
   */
  uploadImage: async (file, folder = "general") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await api.post("/admin/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  /**
   * Upload multiple images
   * @param {File[]} files - Array of image files
   * @param {string} folder - Folder name
   * @returns {Promise<{success: boolean, urls: string[], error?: string}>}
   */
  uploadMultipleImages: async (files, folder = "general") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("folder", folder);

    const response = await api.post("/admin/images/upload-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.data;
  },

  /**
   * Delete image
   * @param {string} imageUrl - Image URL to delete
   * @returns {Promise<boolean>}
   */
  deleteImage: async (imageUrl) => {
    const response = await api.delete("/admin/images", {
      params: { imageUrl },
    });

    return response.data.data;
  },

  /**
   * Delete multiple images
   * @param {string[]} imageUrls - Array of image URLs to delete
   * @returns {Promise<boolean>}
   */
  deleteMultipleImages: async (imageUrls) => {
    const response = await api.post("/admin/images/delete-multiple", imageUrls);

    return response.data.data;
  },
};
