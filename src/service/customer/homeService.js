import axiosInstance from '../axiosInstance'

/**
 * Service cho trang chủ
 */

/**
 * Lấy sản phẩm nổi bật
 * @param {number} limit - Số lượng sản phẩm
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts(limit = 8) {
  try {
    const response = await axiosInstance.get('/api/v1/customer/san-pham/featured', {
      params: { limit },
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('❌ [HomeService] Lỗi khi lấy sản phẩm nổi bật:', error)
    throw error
  }
}

/**
 * Lấy khuyến mãi đang hoạt động
 * @returns {Promise<Array>}
 */
export async function getActivePromotions() {
  try {
    const response = await axiosInstance.get('/api/v1/customer/dot-giam-gia/active')
    return response.data.data || response.data
  } catch (error) {
    console.error('❌ [HomeService] Lỗi khi lấy khuyến mãi:', error)
    throw error
  }
}

/**
 * Lấy đánh giá cao nhất
 * @param {number} limit - Số lượng đánh giá
 * @returns {Promise<Array>}
 */
export async function getTopReviews(limit = 5) {
  try {
    const response = await axiosInstance.get('/api/v1/customer/danh-gia/top-rated', {
      params: { limit },
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('❌ [HomeService] Lỗi khi lấy đánh giá:', error)
    throw error
  }
}
