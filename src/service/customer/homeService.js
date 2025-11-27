import axios from '@/utils/api'

/**
 * Service cho trang chủ
 */

const API_BASE_URL = '/api/san-pham'

/**
 * Lấy sản phẩm nổi bật (sử dụng API có sẵn)
 * @param {number} limit - Số lượng sản phẩm
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts() {
  try {
    console.log('🔄 [HomeService] Fetching ALL products...')
    console.log('🔄 API URL:', `${API_BASE_URL}/page`)
    
    // Lấy trang đầu tiên để biết tổng số sản phẩm
    const firstResponse = await axios.get(`${API_BASE_URL}/page`, {
      params: { 
        page: 0, 
        size: 100, // Lấy 100 sản phẩm đầu tiên
        sort: 'ngayTao,desc'
      }
    })
    
    console.log('✅ [HomeService] First page response:', firstResponse.data)
    
    const totalElements = firstResponse.data.totalElements || 0
    const totalPages = firstResponse.data.totalPages || 1
    
    console.log(`📊 [HomeService] Total products: ${totalElements}, Total pages: ${totalPages}`)
    
    // Nếu chỉ có 1 trang, trả về luôn
    if (totalPages <= 1) {
      return firstResponse.data.content || []
    }
    
    // Nếu có nhiều trang, fetch tất cả
    const allProducts = [...(firstResponse.data.content || [])]
    
    // Fetch các trang còn lại
    const promises = []
    for (let page = 1; page < totalPages; page++) {
      promises.push(
        axios.get(`${API_BASE_URL}/page`, {
          params: { 
            page, 
            size: 100,
            sort: 'ngayTao,desc'
          }
        })
      )
    }
    
    const responses = await Promise.all(promises)
    
    // Gộp tất cả sản phẩm
    responses.forEach(response => {
      if (response.data.content) {
        allProducts.push(...response.data.content)
      }
    })
    
    console.log('✅ [HomeService] All products loaded:', allProducts.length)
    
    return allProducts
  } catch (error) {
    console.error('❌ [HomeService] Lỗi khi lấy sản phẩm:', error)
    console.error('❌ [HomeService] Error details:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    })
    throw error
  }
}

/**
 * Lấy khuyến mãi đang hoạt động
 * @returns {Promise<Array>}
 */
export async function getActivePromotions() {
  try {
    const response = await axios.get('/api/v1/customer/dot-giam-gia/active')
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
    const response = await axios.get('/api/v1/customer/danh-gia/top-rated', {
      params: { limit },
    })
    return response.data.data || response.data
  } catch (error) {
    console.error('❌ [HomeService] Lỗi khi lấy đánh giá:', error)
    throw error
  }
}

/**
 * Lấy banners cho slider
 * @param {string} type - Loại banner (main-slider, etc.)
 * @returns {Promise<Array>}
 */
export async function getBanners(type = 'main-slider') {
  try {
    console.log('🔄 [HomeService] Fetching banners:', type)
    
    // Try dedicated banners API
    try {
      const response = await axios.get('/api/banners', {
        params: { type },
      })
      const data = response.data?.data || response.data?.content || response.data
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ [HomeService] Banners loaded:', data.length)
        return data
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        throw error
      }
    }

    // Fallback: Get from promotions
    console.warn('⚠️ [HomeService] Banners API not found, using promotions as fallback')
    const promotions = await getActivePromotions()
    return promotions.slice(0, 5).map((promo, index) => ({
      id: promo.id || index,
      title: promo.tenKm || 'Khuyến mãi',
      description: promo.moTa || '',
      image: promo.bannerImageUrl || '',
      link: `/khuyen-mai/${promo.id}`,
      buttonText: 'Xem ngay',
    }))
  } catch (error) {
    console.error('❌ [HomeService] Lỗi khi lấy banners:', error)
    return []
  }
}

export async function getBestSellingProducts(limit = 10) {
  const res = await axios.get(`${API_BASE_URL}/best-selling`, { params: { limit } })
  const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || [])
  return Array.isArray(data) ? data : []
}

export async function getNewArrivalsProducts(limit = 10) {
  const res = await axios.get(`${API_BASE_URL}/newest`, { params: { limit } })
  const data = Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.content || [])
  return Array.isArray(data) ? data : []
}