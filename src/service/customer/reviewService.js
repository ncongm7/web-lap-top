import axios from '@/utils/api'

const API_BASE_URL = '/api/products'

export const reviewService = {
  /**
   * Lấy danh sách đánh giá của sản phẩm
   * @param {string} productId - ID sản phẩm
   * @param {Object} params - { page, size, rating (1-5 hoặc null) }
   */
  getReviews(productId, params = {}) {
    return axios.get(`${API_BASE_URL}/${productId}/reviews`, { params })
  },


  /**
   * Gửi đánh giá mới
   * @param {string} productId - ID sản phẩm
   * @param {Object} data - { soSao, noiDung, chiTietSanPhamId, imageUrls }
   */
  submitReview(productId, data) {
    return axios.post(`${API_BASE_URL}/${productId}/reviews`, data, {
      headers: {
        'X-User-Id': data.khachHangId || data.userId, // Tạm thời dùng header, sau sẽ dùng token
      },
    })
  },

  /**
   * Upload hình ảnh đánh giá (nếu có API riêng)
   * @param {File} file - File hình ảnh
   */
  uploadReviewImage(file) {
    const formData = new FormData()
    formData.append('image', file)
    return axios.post('/api/upload/review-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default reviewService

