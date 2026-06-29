import apiClient from "./apiClient";

export const getOrders = async (params = {}) => {
  const response = await apiClient.get("admin/orders", { params });
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await apiClient.get(`admin/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await apiClient.patch(`admin/orders/${id}/status`, { status });
  return response.data;
};

export const exportOrdersToExcel = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get("exports/orders", {
    params,
    responseType: "blob", // Quan trọng để nhận file
  });
  return response.data;
};

export const exportRevenueToExcel = async (startDate, endDate) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;
  
  const response = await apiClient.get("exports/revenue", {
    params,
    responseType: "blob",
  });
  return response.data;
};
