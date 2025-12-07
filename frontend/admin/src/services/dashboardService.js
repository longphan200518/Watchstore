import apiClient from "./apiClient";

export const getDashboardSummary = async (params = {}) => {
  const response = await apiClient.get("admin/dashboard/summary", { params });
  return response.data.data;
};
