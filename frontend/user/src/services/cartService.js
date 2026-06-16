import apiClient from './apiClient'
import { getSessionId } from '../utils/sessionId'

/**
 * Lấy header chứa X-Session-Id để gửi lên server.
 * Header này dùng cho cả guest lẫn user đã đăng nhập.
 */
const getCartHeaders = () => ({
  'X-Session-Id': getSessionId(),
})

const cartService = {
  /** Lấy giỏ hàng hiện tại */
  getCart: () =>
    apiClient.get('/cart', { headers: getCartHeaders() }),

  /** Thêm sản phẩm vào giỏ (tự tăng số lượng nếu đã có) */
  addToCart: (watchId, quantity = 1) =>
    apiClient.post('/cart/items', { watchId, quantity }, { headers: getCartHeaders() }),

  /** Cập nhật số lượng một item */
  updateQuantity: (cartItemId, quantity) =>
    apiClient.put(`/cart/items/${cartItemId}`, { quantity }, { headers: getCartHeaders() }),

  /** Xóa một item khỏi giỏ */
  removeItem: (cartItemId) =>
    apiClient.delete(`/cart/items/${cartItemId}`, { headers: getCartHeaders() }),

  /** Xóa toàn bộ giỏ hàng */
  clearCart: () =>
    apiClient.delete('/cart', { headers: getCartHeaders() }),

  /** Merge giỏ hàng session vào user (gọi sau khi đăng nhập) */
  mergeCart: (sessionId) =>
    apiClient.post('/cart/merge', { sessionId }, { headers: getCartHeaders() }),
}

export default cartService
