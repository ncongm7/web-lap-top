import axios from '@/utils/api'

const API_BASE_URL = '/api/san-pham'
const CTSP_API_BASE_URL = '/api/chi-tiet-san-pham'
const HINH_ANH_API_BASE_URL = '/api/hinh-anh'

export const sanPhamService = {
  // Lấy tất cả sản phẩm với phân trang
  getAllProducts(params = {}) {
    return axios.get(`${API_BASE_URL}/page`, { params })
  },

  // Lấy sản phẩm theo ID
  getProductById(id) {
    return axios.get(`${API_BASE_URL}/${id}`)
  },

  // Tìm kiếm sản phẩm theo từ khóa
  searchProducts(keyword, params = {}) {
    return axios.get(`${API_BASE_URL}/search/keyword/page`, {
      params: { keyword, ...params }
    })
  },

  // Tìm kiếm nâng cao với bộ lọc
  advancedSearch(filters = {}, params = {}) {
    const searchParams = {
      keyword: filters.keyword || null,
      trangThai: filters.status, // Map status -> trangThai for backend
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      ...params
    }
    
    console.log('🌐 API call params before cleanup:', searchParams)
    
    // Remove null/undefined values to clean up the request
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] === null || searchParams[key] === undefined || searchParams[key] === '') {
        delete searchParams[key]
      }
    })
    
    console.log('🌐 Final API call params:', searchParams)
    console.log('🌐 API URL:', `${API_BASE_URL}/search/advanced-filter/page`)
    
    return axios.get(`${API_BASE_URL}/search/advanced-filter/page`, {
      params: searchParams
    })
  },

  // Lấy gợi ý tìm kiếm (autocomplete)
  getSearchSuggestions(keyword) {
    return axios.get(`${API_BASE_URL}/search/keyword`, {
      params: { keyword }
    })
  },

  // Lấy sản phẩm theo trạng thái
  getProductsByStatus(status, params = {}) {
    return axios.get(`${API_BASE_URL}/trang-thai/${status}/page`, { params })
  },

  // Lấy chi tiết sản phẩm theo ID sản phẩm
  getProductDetails(sanPhamId) {
    return axios.get(`${CTSP_API_BASE_URL}/san-pham/${sanPhamId}`)
  },

  // Lấy chi tiết sản phẩm kèm thông tin giảm giá
  getProductDetailsWithDiscount(sanPhamId) {
    return axios.get(`${CTSP_API_BASE_URL}/san-pham/${sanPhamId}/with-discount`)
  },

  // Lấy chi tiết sản phẩm theo ID chi tiết
  getProductDetailById(id) {
    return axios.get(`${CTSP_API_BASE_URL}/${id}`)
  },

  // Lấy hình ảnh theo chi tiết sản phẩm ID
  getImagesByProductDetailId(ctspId) {
    return axios.get(`${HINH_ANH_API_BASE_URL}/ctsp/${ctspId}`)
  },

}

export default sanPhamService