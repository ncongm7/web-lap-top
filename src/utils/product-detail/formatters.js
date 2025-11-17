/**
 * ========================================
 * PRODUCT FORMATTERS & HELPERS
 * ========================================
 * Các hàm tiện ích format dữ liệu sản phẩm
 */

/**
 * Format giá tiền theo định dạng Việt Nam
 * @param {Number} price - Giá cần format
 * @returns {String} - Giá đã format (VD: "25.000.000 ₫")
 */
export const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0 ₫'
  
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Tính phần trăm giảm giá
 * @param {Number} originalPrice - Giá gốc
 * @param {Number} currentPrice - Giá hiện tại
 * @returns {Number} - Phần trăm giảm (VD: 15)
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || !currentPrice || currentPrice >= originalPrice) return 0
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
}

/**
 * Kết hợp tên và mô tả thành chuỗi hiển thị
 * @param {String} name - Tên thuộc tính
 * @param {String} description - Mô tả thuộc tính
 * @returns {String} - Chuỗi đã kết hợp (VD: "Intel Core i5 (2.4GHz)")
 */
export const withDescription = (name, description) => {
  const n = name?.toString().trim()
  const d = description?.toString().trim()
  
  if (n && d) return `${n} (${d})`
  return n || d || ''
}

/**
 * Format số lượng tồn kho
 * @param {Number} stock - Số lượng tồn
 * @returns {String} - Chuỗi hiển thị
 */
export const formatStock = (stock) => {
  if (!stock || stock <= 0) return 'Hết hàng'
  if (stock === 1) return 'Còn 1 sản phẩm'
  return `Còn ${stock} sản phẩm`
}

/**
 * Lấy class CSS dựa vào số lượng tồn kho
 * @param {Number} stock - Số lượng tồn
 * @returns {String} - Class name
 */
export const getStockClass = (stock) => {
  if (!stock || stock <= 0) return 'stock-out'
  if (stock <= 5) return 'stock-low'
  if (stock <= 20) return 'stock-medium'
  return 'stock-high'
}

/**
 * Rút gọn text nếu quá dài
 * @param {String} text - Text cần rút gọn
 * @param {Number} maxLength - Độ dài tối đa
 * @returns {String} - Text đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Format ngày tháng
 * @param {Date|String} date - Ngày cần format
 * @returns {String} - Ngày đã format
 */
export const formatDate = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(d)
}

/**
 * Format ngày tháng với giờ
 * @param {Date|String} date - Ngày cần format
 * @returns {String} - Ngày giờ đã format
 */
export const formatDateTime = (date) => {
  if (!date) return ''
  
  const d = new Date(date)
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

