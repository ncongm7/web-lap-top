import axios from '../axiosInstance'

const API_BASE_URL = '/api/customer'

/**
 * Voucher Service - Quản lý phiếu giảm giá
 */
const voucherService = {
  /**
   * Lấy danh sách voucher khả dụng
   * @param {string} khachHangId - ID khách hàng (optional, để lấy phiếu cá nhân)
   * @returns {Promise<Array>} Danh sách voucher
   */
  async getAvailableVouchers(khachHangId = null) {
    const params = {}
    if (khachHangId) {
      params.khachHangId = khachHangId
    }
    const response = await axios.get(`${API_BASE_URL}/phieu-giam-gia/available`, { params })
    return response.data
  },

  /**
   * Lấy danh sách voucher suggestions cho giỏ hàng
   * Bao gồm cả phiếu giảm giá cá nhân (riêng tư)
   * @param {string} khachHangId - ID khách hàng (optional)
   * @param {number} tongTienGioHang - Tổng tiền giỏ hàng
   * @returns {Promise<Array>} Danh sách voucher suggestions
   */
  async getVoucherSuggestions(khachHangId = null, tongTienGioHang = 0) {
    const params = { tongTienGioHang }
    if (khachHangId) {
      params.khachHangId = khachHangId
    }
    const response = await axios.get(`${API_BASE_URL}/phieu-giam-gia/suggestions`, { params })
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
   * @returns {Promise<Object>} Validation result
   */
  async validateVoucher() {
    // TODO: Implement if backend has dedicated validation endpoint
    // For now, just try to apply and see the result
    return { valid: true }
  },
}

export default voucherService
