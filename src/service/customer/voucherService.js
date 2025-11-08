import axios from '../axiosInstance'

const API_BASE_URL = '/api/customer'

/**
 * Voucher Service - Quản lý phiếu giảm giá
 */
const voucherService = {
  /**
   * Lấy danh sách voucher khả dụng
   * @returns {Promise<Array>} Danh sách voucher
   */
  async getAvailableVouchers() {
    const response = await axios.get(`${API_BASE_URL}/phieu-giam-gia/available`)
    return response.data
  },

  /**
   * Áp dụng voucher vào giỏ hàng
   * @param {string} khachHangId - ID khách hàng
   * @param {string} voucherCode - Mã voucher
   * @returns {Promise<Object>} Response with success, message, discount amount, updated cart
   */
  async applyVoucher(khachHangId, voucherCode) {
    const response = await axios.post(
      `${API_BASE_URL}/gio-hang/apply-voucher`,
      { voucherCode },
      {
        params: { khachHangId },
      },
    )
    return response.data
  },

  /**
   * Validate voucher code
   * @param {string} code - Mã voucher
   * @returns {Promise<Object>} Validation result
   */
  async validateVoucher(code) {
    // TODO: Implement if backend has dedicated validation endpoint
    // For now, just try to apply and see the result
    return { valid: true }
  },
}

export default voucherService
