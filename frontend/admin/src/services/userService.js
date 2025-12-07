import apiClient from "./apiClient";

export const getUsers = async (params = {}) => {
  try {
    const response = await apiClient.get("admin/users", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, message: error.message };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    return { success: false, message: error.message };
  }
};

export const updateUserRoles = async (id, roles) => {
  try {
    const response = await apiClient.put(`admin/users/${id}/roles`, {
      roleNames: roles,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user roles:", error);
    return { success: false, message: error.message };
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`admin/users/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: error.message };
  }
};
