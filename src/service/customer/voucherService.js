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
   * Lấy tất cả phiếu giảm giá (bao gồm cả không dùng được và phiếu cá nhân)
   * @param {string} khachHangId - ID khách hàng (bắt buộc để kiểm tra điều kiện)
   * @param {number} tongTienGioHang - Tổng tiền giỏ hàng để kiểm tra điều kiện
   * @returns {Promise<Object>} { available: [], unavailable: [], personal: [] }
   */
  async getAllVouchers(khachHangId, tongTienGioHang = 0) {
    // Ưu tiên dùng API suggestions mới (đã bao gồm cả phiếu cá nhân)
    try {
      const response = await this.getVoucherSuggestions(khachHangId, tongTienGioHang)
      if (response.success && response.data) {
        const suggestions = response.data
        // Phân loại suggestions thành available, unavailable, personal
        const available = []
        const unavailable = []
        const personal = []

        suggestions.forEach(voucher => {
          // Kiểm tra xem có phải phiếu cá nhân không (dựa trên riengTu hoặc khachHangId)
          // Nếu voucher có trong suggestions và khachHangId không null, có thể là phiếu cá nhân
          // Tạm thời coi tất cả suggestions là available (vì đã được filter từ backend)
          available.push(voucher)
        })

        return {
          success: true,
          data: {
            available,
            unavailable,
            personal
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ API suggestions chưa có, dùng fallback')
    }

    // Fallback: Dùng API cũ
    const params = { tongTienGioHang }
    if (khachHangId) {
      params.khachHangId = khachHangId
    }
    const response = await axios.get(`${API_BASE_URL}/phieu-giam-gia/all`, { params })
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
