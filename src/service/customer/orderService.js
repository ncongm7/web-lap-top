import axiosInstance from '../axiosInstance'

/**
 * Service xử lý các API liên quan đến đơn hàng khách hàng
 */
export const orderService = {
  /**
   * Lấy danh sách đơn hàng của khách (có phân trang, lọc)
   * @param {number} page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} size - Số lượng đơn mỗi trang
   * @param {string} status - Trạng thái đơn hàng (CHO_THANH_TOAN, DA_THANH_TOAN, DA_HUY, DANG_GIAO, HOAN_THANH)
   * @param {string} khachHangId - UUID của khách hàng
   * @returns {Promise} Response chứa danh sách đơn hàng
   */
  getOrders(page = 0, size = 10, status = null, khachHangId = null) {
    const params = { page, size }

    if (status) {
      params.trangThai = status
    }

    if (khachHangId) {
      params.khachHangId = khachHangId
    }

    return axiosInstance.get('/api/customer/hoa-don', { params })
  },

  /**
   * Lấy chi tiết đơn hàng
   * @param {string} orderId - UUID của đơn hàng
   * @param {string} khachHangId - UUID của khách hàng (để kiểm tra quyền)
   * @returns {Promise} Response chứa chi tiết đơn hàng
   */
  getOrderDetail(orderId, khachHangId = null) {
    const params = {}

    if (khachHangId) {
      params.khachHangId = khachHangId
    }

    return axiosInstance.get(`/api/customer/hoa-don/${orderId}`, { params })
  },

  /**
   * Hủy đơn hàng (chỉ cho phép khi trạng thái = CHO_THANH_TOAN)
   * @param {string} orderId - UUID của đơn hàng
   * @param {string} khachHangId - UUID của khách hàng (để kiểm tra quyền)
   * @returns {Promise} Response xác nhận hủy đơn
   */
  cancelOrder(orderId, khachHangId = null) {
    const params = {}

    if (khachHangId) {
      params.khachHangId = khachHangId
    }

    return axiosInstance.put(`/api/customer/hoa-don/${orderId}/cancel`, null, { params })
  },

  /**
   * Mua lại đơn hàng (thêm các sản phẩm trong đơn vào giỏ hàng)
   * @param {string} orderId - UUID của đơn hàng
   * @param {string} khachHangId - UUID của khách hàng (để kiểm tra quyền)
   * @returns {Promise} Response xác nhận thêm vào giỏ
   */
  reorder(orderId, khachHangId = null) {
    const params = {}

    if (khachHangId) {
      params.khachHangId = khachHangId
    }

    return axiosInstance.post(`/api/customer/hoa-don/${orderId}/reorder`, null, { params })
  },
}

export default orderService
