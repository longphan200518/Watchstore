/**
 * Validate email
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate phone number
 */
export const validatePhoneNumber = (phone) => {
  const re = /^(\+84|0)[0-9]{9,10}$/
  return re.test(phone)
}

/**
 * Validate password
 */
export const validatePassword = (password) => {
  return password && password.length >= 6
}
