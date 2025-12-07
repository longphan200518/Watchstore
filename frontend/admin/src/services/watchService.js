import apiClient from "./apiClient";

export const getWatches = async (params = {}) => {
  const response = await apiClient.get("admin/watches", { params });
  return response.data;
};

export const getWatchById = async (id) => {
  const response = await apiClient.get(`admin/watches/${id}`);
  return response.data;
};

export const createWatch = async (data) => {
  const response = await apiClient.post("admin/watches", data);
  return response.data;
};

export const updateWatch = async (id, data) => {
  const response = await apiClient.put(`admin/watches/${id}`, data);
  return response.data;
};

export const deleteWatch = async (id) => {
  const response = await apiClient.delete(`admin/watches/${id}`);
  return response.data;
};
