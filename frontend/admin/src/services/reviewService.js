import apiClient from "./apiClient";

export const getReviews = async (params = {}) => {
  try {
    const response = await apiClient.get("admin/reviews", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return { success: false, message: error.message };
  }
};

export const getReviewById = async (id) => {
  try {
    const response = await apiClient.get(`admin/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching review:", error);
    return { success: false, message: error.message };
  }
};

export const deleteReview = async (id) => {
  try {
    const response = await apiClient.delete(`admin/reviews/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, message: error.message };
  }
};
