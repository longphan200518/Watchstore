/**
 * Quản lý SessionId cho giỏ hàng khách vãng lai.
 * SessionId được tạo một lần, lưu vào localStorage,
 * và tồn tại suốt phiên dùng app (kể cả khi đóng tab).
 */

const SESSION_ID_KEY = 'cart_session_id'

/**
 * Lấy hoặc tạo mới SessionId.
 * Nếu chưa có → tạo UUID v4 ngẫu nhiên và lưu vào localStorage.
 */
export function getSessionId() {
  let sessionId = localStorage.getItem(SESSION_ID_KEY)
  if (!sessionId) {
    sessionId = generateUUID()
    localStorage.setItem(SESSION_ID_KEY, sessionId)
  }
  return sessionId
}

/**
 * Xóa SessionId sau khi đã merge giỏ hàng vào user.
 */
export function clearSessionId() {
  localStorage.removeItem(SESSION_ID_KEY)
}

/** Tạo UUID v4 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
