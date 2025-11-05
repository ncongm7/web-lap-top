/**
 * Format số tiền VNĐ
 * @param {number} amount - Số tiền
 * @returns {string} - Chuỗi đã format
 */
export function formatCurrency(amount) {
  if (!amount) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

/**
 * Format ngày tháng
 * @param {string|Date} date - Ngày cần format
 * @param {string} format - Định dạng ('short', 'long', 'time')
 * @returns {string} - Chuỗi đã format
 */
export function formatDate(date, format = 'short') {
  if (!date) return ''

  const d = new Date(date)

  if (format === 'short') {
    return d.toLocaleDateString('vi-VN')
  }

  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (format === 'time') {
    return d.toLocaleString('vi-VN')
  }

  return d.toLocaleDateString('vi-VN')
}

/**
 * Tính % giảm giá
 * @param {number} originalPrice - Giá gốc
 * @param {number} salePrice - Giá sau giảm
 * @returns {number} - % giảm giá
 */
export function calculateDiscount(originalPrice, salePrice) {
  if (!originalPrice || !salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Truncate text
 * @param {string} text - Text cần cắt
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Text đã cắt
 */
export function truncateText(text, maxLength = 100) {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Debounce function
 * @param {Function} func - Function cần debounce
 * @param {number} wait - Thời gian chờ (ms)
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Generate slug từ text
 * @param {string} text - Text cần chuyển
 * @returns {string} - Slug
 */
export function generateSlug(text) {
  if (!text) return ''

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-z0-9\s-]/g, '') // Bỏ ký tự đặc biệt
    .trim()
    .replace(/\s+/g, '-') // Thay space bằng -
    .replace(/-+/g, '-') // Bỏ - thừa
}
