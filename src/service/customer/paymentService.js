import axiosInstance from '../axiosInstance'

/**
 * Service xử lý thanh toán QR
 */

/**
 * Tạo QR code thanh toán
 * @param {Object} data - {hoaDonId, amount, orderCode, description}
 * @returns {Promise}
 */
export const generateQRPayment = (data) => {
  return axiosInstance.post('/api/v1/payment/qr/generate', data)
}

/**
 * Kiểm tra trạng thái thanh toán
 * @param {string} orderId - UUID của đơn hàng
 * @returns {Promise}
 */
export const checkPaymentStatus = (orderId) => {
  return axiosInstance.get(`/api/v1/payment/status/${orderId}`)
}

/**
 * Gửi webhook callback (chỉ dùng để test)
 * Trong thực tế, endpoint này được gọi từ bank/payment gateway
 * @param {Object} data - {orderCode, transactionId, amount}
 * @returns {Promise}
 */
export const mockPaymentWebhook = (data) => {
  return axiosInstance.post('/api/v1/payment/webhook/callback', data)
}
