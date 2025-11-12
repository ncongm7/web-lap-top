import axios from '../axiosInstance'

const API_BASE_URL = '/api/customer/gio-hang'

/**
 * Cart Service - Quản lý giỏ hàng
 */
const cartService = {
  /**
   * Lấy giỏ hàng của khách hàng
   * @param {string} khachHangId - ID khách hàng
   * @returns {Promise<Object>} Cart data
   */
  async getCart(khachHangId) {
    const response = await axios.get(`${API_BASE_URL}`, {
      params: { khachHangId },
    })
    return response.data
  },

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @param {string} khachHangId - ID khách hàng
   * @param {Object} data - { ctspId, quantity }
   * @returns {Promise<Object>} Updated cart
   */
  async addToCart(khachHangId, data) {
    const response = await axios.post(`${API_BASE_URL}/items`, data, {
      params: { khachHangId },
    })
    return response.data
  },

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   * @param {string} khachHangId - ID khách hàng
   * @param {string} itemId - ID item trong giỏ
   * @param {Object} data - { quantity, selected }
   * @returns {Promise<Object>} Updated cart
   */
  async updateCartItem(khachHangId, itemId, data) {
    const response = await axios.put(`${API_BASE_URL}/items/${itemId}`, data, {
      params: { khachHangId },
    })
    return response.data
  },

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   * @param {string} khachHangId - ID khách hàng
   * @param {string} itemId - ID item trong giỏ
   * @returns {Promise<Object>} Updated cart
   */
  async removeCartItem(khachHangId, itemId) {
    const response = await axios.delete(`${API_BASE_URL}/items/${itemId}`, {
      params: { khachHangId },
    })
    return response.data
  },

  /**
   * Xóa toàn bộ giỏ hàng
   * @param {string} khachHangId - ID khách hàng
   * @returns {Promise<Object>} Success message
   */
  async clearCart(khachHangId) {
    const response = await axios.delete(`${API_BASE_URL}/clear`, {
      params: { khachHangId },
    })
    return response.data
  },
}

export default cartService
