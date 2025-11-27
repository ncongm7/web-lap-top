import axiosInstance from '@/service/axiosInstance'

const API_BASE = '/api/products'

/**
 * Lấy danh sách sản phẩm Flash Sale
 * Ưu tiên:
 *  1. Gọi endpoint riêng /api/products/flash-sale (nếu backend có)
 *  2. Fallback: Lấy sản phẩm từ campaign khuyến mãi đang active (/api/promotions/...)
 * @returns {Promise<Array>}
 */
export async function getFlashSaleProducts() {
  try {
    console.log('🔄 [FlashSaleService] Fetching flash sale products...')

    // 1. Thử gọi endpoint riêng cho flash sale
    try {
      const response = await axiosInstance.get(`${API_BASE}/flash-sale`)
      const data = response.data?.data || response.data?.content || response.data

      if (Array.isArray(data) && data.length > 0) {
        console.log(
          '✅ [FlashSaleService] Flash sale products loaded from /flash-sale:',
          data.length,
        )
        return data
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        console.log(
          'ℹ️ [FlashSaleService] /flash-sale endpoint not found, using promotions fallback',
        )
      } else {
        console.warn('⚠️ [FlashSaleService] Error calling /flash-sale endpoint:', error)
      }
    }

    // 2. Fallback: Lấy sản phẩm từ campaign khuyến mãi đang ACTIVE
        // 2. Fallback: Lấy sản phẩm từ các campaign khuyến mãi đang ACTIVE
    try {
      const { getCampaigns, getCampaignDetail } = await import('./promotionService')

      // Lấy tối đa 5 campaign đang active
      const { campaigns } = await getCampaigns('active', 0, 5)
      const list = Array.isArray(campaigns) ? campaigns : []

      if (list.length === 0) {
        console.log('ℹ️ [FlashSaleService] Không có campaign khuyến mãi nào đang active')
        return []
      }

      let activeCampaignWithProducts = null
      let rawProducts = []

      // Tìm campaign đầu tiên có sản phẩm
      for (const campaign of list) {
        try {
          console.log(
            '🔍 [FlashSaleService] Kiểm tra campaign:',
            campaign.id,
            campaign.tenKm,
          )
          const detailResult = await getCampaignDetail(campaign.id, 0)
          const productsFromCampaign = detailResult?.products || []

          if (Array.isArray(productsFromCampaign) && productsFromCampaign.length > 0) {
            activeCampaignWithProducts = campaign
            rawProducts = productsFromCampaign
            break
          }
        } catch (err) {
          console.warn(
            '⚠️ [FlashSaleService] Lỗi khi lấy chi tiết campaign:',
            campaign.id,
            err,
          )
        }
      }

      if (!activeCampaignWithProducts) {
        console.log('ℹ️ [FlashSaleService] Không có campaign ACTIVE nào có sản phẩm')
        return []
      }

      // Chuẩn hoá dữ liệu giá cho FlashSale.vue
      const products = rawProducts.map((p) => {
        const originalPrice =
          p.giaGoc ??
          p.giaNiemYet ??
          p.giaBan ??
          p.giaHienThi ??
          null

        const discountPrice =
          p.giaSauGiam ??
          p.giaKhuyenMai ??
          p.giaBan ??
          p.giaHienThi ??
          originalPrice

        return {
          ...p,
          promotion: activeCampaignWithProducts,
          originalPrice,
          discountPrice,
        }
      })

      console.log(
        '✅ [FlashSaleService] Flash sale products from campaign:',
        activeCampaignWithProducts.id,
        '- count =',
        products.length,
      )
      return products
    } catch (fallbackError) {
      console.error(
        '❌ [FlashSaleService] Error loading flash sale products from promotions:',
        fallbackError,
      )
      return []
    }
  } catch (error) {
    console.error('❌ [FlashSaleService] Error fetching flash sale products:', error)
    return []
  }
}

/**
 * Lấy ngày kết thúc Flash Sale (từ campaign khuyến mãi đang active)
 * @returns {Promise<Date|null>}
 */
export async function getFlashSaleEndDate() {
  try {
    const { getCampaigns } = await import('./promotionService')
    const { campaigns } = await getCampaigns('active', 0, 1)
    const activeCampaign =
      Array.isArray(campaigns) && campaigns.length > 0 ? campaigns[0] : null

    if (!activeCampaign) {
      return null
    }

    // Tùy backend: ưu tiên ngayKetThuc, fallback sang các tên khác nếu có
    const rawEnd =
      activeCampaign.ngayKetThuc ||
      activeCampaign.endDate ||
      activeCampaign.thoiGianKetThuc

    if (!rawEnd) {
      return null
    }

    const date = typeof rawEnd === 'string' ? new Date(rawEnd) : rawEnd
    return isNaN(date.getTime()) ? null : date
  } catch (error) {
    console.error('❌ [FlashSaleService] Error getting flash sale end date:', error)
    return null
  }
}

export default {
  getFlashSaleProducts,
  getFlashSaleEndDate,
}