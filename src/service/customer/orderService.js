import axiosInstance from '../axiosInstance'

/**
 * Service xử lý các API liên quan đến đơn hàng khách hàng
 */
export const orderService = {
  /**
   * Tạo đơn hàng mới
   * @param {Object} orderData - Dữ liệu đơn hàng
   * @returns {Promise} Response chứa thông tin đơn hàng vừa tạo
   */
  createOrder(orderData) {
    return axiosInstance.post('/api/v1/customer/orders', orderData)
  },

  /**
   * Lấy danh sách đơn hàng của khách (có phân trang, lọc)
   * @param {number} page - Trang hiện tại (bắt đầu từ 0)
   * @param {number} size - Số lượng đơn mỗi trang
   * @param {string} status - Trạng thái đơn hàng (CHO_THANH_TOAN, DA_THANH_TOAN, DA_HUY, DANG_GIAO, HOAN_THANH)
   * @param {string} khachHangId - UUID của khách hàng (BẮT BUỘC)
   * @returns {Promise} Response chứa danh sách đơn hàng
   */
  getOrders(page = 0, size = 10, status = null, khachHangId = null) {
    // Validate khachHangId là bắt buộc
    if (!khachHangId) {
      return Promise.reject(new Error('khachHangId là bắt buộc để lấy danh sách đơn hàng'))
    }

    // Validate page và size là số
    if (typeof page !== 'number' || page < 0) {
      page = 0
    }
    if (typeof size !== 'number' || size < 1) {
      size = 10
    }

    const params = {
      khachHangId, // Đặt khachHangId lên đầu để đảm bảo luôn có
      page,
      size
    }

    if (status) {
      params.trangThai = status
    }

    return axiosInstance.get('/api/v1/customer/orders', { params })
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

    return axiosInstance.get(`/api/v1/customer/orders/${orderId}`, { params })
  },

  /**
   * Lấy trạng thái đơn hàng
   * @param {string} orderId - UUID của đơn hàng
   * @param {string} khachHangId - UUID của khách hàng
   * @returns {Promise} Response chứa trạng thái đơn hàng
   */
  getOrderStatus(orderId, khachHangId) {
    if (!khachHangId) {
      return Promise.reject(new Error('khachHangId is required'))
    }
    return axiosInstance.get(`/api/v1/customer/orders/${orderId}/status`, {
      params: { khachHangId }
    })
  },

  /**
   * Hủy đơn hàng (chỉ cho phép khi trạng thái = CHO_THANH_TOAN)
   * @param {string} orderId - UUID của đơn hàng
   * @param {string} khachHangId - UUID của khách hàng (để kiểm tra quyền)
   * @returns {Promise} Response xác nhận hủy đơn
   */
  cancelOrder(orderId, khachHangId = null) {
    if (!khachHangId) {
      return Promise.reject(new Error('khachHangId is required'))
    }
    return axiosInstance.post(`/api/v1/customer/orders/${orderId}/cancel`, null, {
      params: { khachHangId }
    })
  },

  /**
   * Theo dõi đơn hàng (track order)
   * @param {string} orderId - UUID của đơn hàng
   * @param {string} khachHangId - UUID của khách hàng
   * @returns {Promise} Response chứa thông tin theo dõi đơn hàng
   */
  trackOrder(orderId, khachHangId) {
    // Sử dụng getOrderDetail để lấy thông tin đơn hàng (bao gồm trạng thái)
    return this.getOrderDetail(orderId, khachHangId)
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
