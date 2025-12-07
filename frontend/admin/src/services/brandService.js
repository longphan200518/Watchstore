import apiClient from "./apiClient";

export const getBrands = async (params = {}) => {
  const response = await apiClient.get("admin/brands", { params });
  return response.data;
};

export const getBrandById = async (id) => {
  const response = await apiClient.get(`admin/brands/${id}`);
  return response.data;
};

export const createBrand = async (data) => {
  const response = await apiClient.post("admin/brands", data);
  return response.data;
};

export const updateBrand = async (id, data) => {
  const response = await apiClient.put(`admin/brands/${id}`, data);
  return response.data;
};

export const deleteBrand = async (id) => {
  const response = await apiClient.delete(`admin/brands/${id}`);
  return response.data;
};
