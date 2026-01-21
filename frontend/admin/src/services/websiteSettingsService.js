import apiClient from "./apiClient";

export const getAllSettings = async () => {
  const response = await apiClient.get("admin/website-settings");
  return response.data;
};

export const getAllSettingsByCategory = async () => {
  const response = await apiClient.get("admin/website-settings/by-category");
  return response.data;
};

export const getSettingsByCategory = async (category) => {
  const response = await apiClient.get(
    `admin/website-settings/category/${category}`
  );
  return response.data;
};

export const getSettingByKey = async (key) => {
  const response = await apiClient.get(`admin/website-settings/${key}`);
  return response.data;
};

export const createSetting = async (data) => {
  const response = await apiClient.post("admin/website-settings", data);
  return response.data;
};

export const updateSetting = async (key, data) => {
  const response = await apiClient.put(`admin/website-settings/${key}`, data);
  return response.data;
};

export const bulkUpdateSettings = async (settings) => {
  const response = await apiClient.put("admin/website-settings/bulk", settings);
  return response.data;
};

export const deleteSetting = async (key) => {
  const response = await apiClient.delete(`admin/website-settings/${key}`);
  return response.data;
};
