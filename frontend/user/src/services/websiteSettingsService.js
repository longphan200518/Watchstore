import apiClient from "./apiClient";

export const getWebsiteSettings = async () => {
  const response = await apiClient.get("website-settings");
  return response.data;
};
