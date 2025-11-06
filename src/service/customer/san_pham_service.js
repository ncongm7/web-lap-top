import axios from '@/utils/api'

const API_BASE_URL = '/api/san-pham'

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
      trangThai: filters.status,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      ...params
    }
    
    // Remove null/undefined values to clean up the request
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] === null || searchParams[key] === undefined || searchParams[key] === '') {
        delete searchParams[key]
      }
    })
    
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

}

export default sanPhamService