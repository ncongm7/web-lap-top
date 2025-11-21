import axiosInstance from '@/service/axiosInstance'

const API_BASE = '/api/products'

/**
 * Get flash sale products
 * @returns {Promise<Array>} Array of flash sale products with promotion info
 */
export async function getFlashSaleProducts() {
  try {
    console.log('🔄 [FlashSaleService] Fetching flash sale products...')

    // Try dedicated flash sale endpoint
    try {
      const response = await axiosInstance.get(`${API_BASE}/flash-sale`)
      const data = response.data?.data || response.data?.content || response.data
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ [FlashSaleService] Flash sale products loaded:', data.length)
        return data
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.warn('⚠️ [FlashSaleService] Flash sale endpoint not available, using fallback')
      }
    }

    // Fallback: Get products with active promotions
    try {
      const { getActivePromotions } = await import('./homeService')
      const promotions = await getActivePromotions()
      
      if (promotions.length === 0) {
        return []
      }

      // Get products from the first active promotion
      const firstPromo = promotions[0]
      
      // Try to get products from promotion detail
      try {
        const promoResponse = await axiosInstance.get(`/api/v1/customer/dot-giam-gia/${firstPromo.id}`)
        const promoData = promoResponse.data?.data || promoResponse.data
        
        if (promoData?.chiTiet && Array.isArray(promoData.chiTiet)) {
          const products = promoData.chiTiet.map(item => ({
            ...item.chiTietSanPham,
            promotion: firstPromo,
            discountPrice: item.giaSauKhiGiam,
            originalPrice: item.giaBanDau,
          }))
          
          console.log('✅ [FlashSaleService] Flash sale products from promotion:', products.length)
          return products
        }
      } catch (promoError) {
        console.warn('⚠️ [FlashSaleService] Could not get promotion details:', promoError)
      }

      return []
    } catch (error) {
      console.error('❌ [FlashSaleService] Error in fallback:', error)
      return []
    }
  } catch (error) {
    console.error('❌ [FlashSaleService] Error fetching flash sale products:', error)
    return []
  }
}

/**
 * Get flash sale end date (from active promotion)
 * @returns {Promise<Date|null>} End date or null
 */
export async function getFlashSaleEndDate() {
  try {
    const { getActivePromotions } = await import('./homeService')
    const promotions = await getActivePromotions()
    
    if (promotions.length > 0) {
      const firstPromo = promotions[0]
      if (firstPromo.ngayKetThuc) {
        return new Date(firstPromo.ngayKetThuc)
      }
    }
    
    return null
  } catch (error) {
    console.error('❌ [FlashSaleService] Error getting end date:', error)
    return null
  }
}

export default {
  getFlashSaleProducts,
  getFlashSaleEndDate,
}

