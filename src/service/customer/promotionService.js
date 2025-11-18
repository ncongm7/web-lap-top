import axiosInstance from '@/service/axiosInstance'

/**
 * Service cho Promotions (Chương trình giảm giá và Vouchers)
 */

const API_BASE_URL = '/api/promotions'

/**
 * API 1: Lấy danh sách các Chương trình/Đợt giảm giá
 * @param {string} status - 'active' (đang diễn ra) hoặc 'upcoming' (sắp diễn ra)
 * @param {number} page - Số trang (bắt đầu từ 0)
 * @param {number} pageSize - Số lượng mỗi trang
 * @returns {Promise<Object>} { campaigns: [], pagination: {} }
 */
export async function getCampaigns(status = 'active', page = 0, pageSize = 10) {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/campaigns`, {
      params: {
        status,
        page,
        pageSize
      }
    })

    // Xử lý response từ backend
    const data = response.data?.data || response.data

    // Nếu backend trả về Page object của Spring
    if (data.content) {
      return {
        campaigns: data.content,
        pagination: {
          page: data.number || page,
          pageSize: data.size || pageSize,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0
        }
      }
    }

    // Nếu backend trả về format khác
    return {
      campaigns: Array.isArray(data) ? data : [],
      pagination: {
        page,
        pageSize,
        totalPages: 0,
        totalElements: 0
      }
    }
  } catch (error) {
    console.error('❌ [PromotionService] Lỗi khi lấy campaigns:', error)
    throw error
  }
}

/**
 * API 2: Lấy chi tiết một chương trình giảm giá và danh sách sản phẩm được áp dụng
 * @param {string} id - ID của chương trình giảm giá
 * @param {number} page - Số trang cho danh sách sản phẩm
 * @returns {Promise<Object>} { campaignInfo: {}, products: [], pagination: {} }
 */
export async function getCampaignDetail(id, page = 0) {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/campaigns/${id}`, {
      params: { pageNo: page }
    })

    const data = response.data?.data || response.data

    // Backend trả về Page<UUID> của idCTSP
    const productIds = data.content || []

    // Lấy thông tin chi tiết của từng sản phẩm
    const sanPhamService = (await import('@/service/customer/san_pham_service')).default
    const products = await Promise.all(
      productIds.map(async (ctspId) => {
        try {
          const response = await sanPhamService.getProductDetailById(ctspId)
          return response.data?.data || response.data
        } catch (error) {
          console.error(`❌ Lỗi khi lấy CTSP ${ctspId}:`, error)
          return null
        }
      })
    )

    // Lọc bỏ các sản phẩm null
    const validProducts = products.filter(p => p !== null)

    return {
      campaignInfo: data.campaignInfo || {},
      products: validProducts,
      pagination: {
        page: data.number || page,
        pageSize: data.size || 10,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0
      }
    }
  } catch (error) {
    console.error(`❌ [PromotionService] Lỗi khi lấy chi tiết campaign ${id}:`, error)
    throw error
  }
}

/**
 * API 3: Lấy danh sách các Phiếu giảm giá (Voucher) công khai
 * @param {number} page - Số trang (bắt đầu từ 0)
 * @returns {Promise<Object>} { vouchers: [], pagination: {} }
 */
export async function getVouchers(page = 0) {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/vouchers`, {
      params: { pageNo: page }
    })

    const data = response.data?.data || response.data

    // Xử lý response từ backend
    if (data.content) {
      return {
        vouchers: data.content,
        pagination: {
          page: data.number || page,
          pageSize: data.size || 10,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0
        }
      }
    }

    return {
      vouchers: Array.isArray(data) ? data : [],
      pagination: {
        page,
        pageSize: 10,
        totalPages: 0,
        totalElements: 0
      }
    }
  } catch (error) {
    console.error('❌ [PromotionService] Lỗi khi lấy vouchers:', error)
    throw error
  }
}

export default {
  getCampaigns,
  getCampaignDetail,
  getVouchers
}

