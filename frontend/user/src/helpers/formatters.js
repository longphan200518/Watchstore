/**
 * Format number to currency
 */
export const formatCurrency = (value, currency = 'VND') => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: currency,
  }).format(value)
}

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN')
}

/**
 * Format datetime
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('vi-VN')
}

/**
 * Truncate string
 */
export const truncateString = (str, length = 50) => {
  return str.length > length ? str.substring(0, length) + '...' : str
}
