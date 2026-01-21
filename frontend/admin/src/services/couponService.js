// Admin Coupon API Service
import apiClient from './apiClient';

const COUPONS_API = '/api/admin/coupons';
const PUBLIC_COUPONS_API = '/api/coupons';

export const couponService = {
  // Get all coupons (admin)
  getAllCoupons: async (pageNumber = 1, pageSize = 10) => {
    const response = await apiClient.get(`${COUPONS_API}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
    return response.data;
  },

  // Get coupon by ID
  getCouponById: async (id) => {
    const response = await apiClient.get(`${COUPONS_API}/${id}`);
    return response.data;
  },

  // Create coupon
  createCoupon: async (data) => {
    const response = await apiClient.post(COUPONS_API, data);
    return response.data;
  },

  // Update coupon
  updateCoupon: async (id, data) => {
    const response = await apiClient.put(`${COUPONS_API}/${id}`, data);
    return response.data;
  },

  // Delete coupon
  deleteCoupon: async (id) => {
    const response = await apiClient.delete(`${COUPONS_API}/${id}`);
    return response.data;
  },

  // Validate coupon (public)
  validateCoupon: async (code, orderTotal, userId = null) => {
    const response = await apiClient.post(`${PUBLIC_COUPONS_API}/validate`, {
      code,
      orderTotal,
      userId
    });
    return response.data;
  },

  // Get active coupons (public)
  getActiveCoupons: async () => {
    const response = await apiClient.get(`${PUBLIC_COUPONS_API}/active`);
    return response.data;
  }
};
