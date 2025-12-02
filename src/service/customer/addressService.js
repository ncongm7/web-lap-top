import axiosInstance from '../axiosInstance'

const API_BASE_URL = '/api/dia-chi'

/**
 * Address Service - Quản lý địa chỉ khách hàng
 */
const addressService = {
  /**
   * Lấy danh sách địa chỉ theo mã khách hàng
   * @param {string} maKhachHang - Mã khách hàng
   * @returns {Promise<Array>} Danh sách địa chỉ
   */
  async getAddressesByMaKhachHang(maKhachHang) {
    const response = await axiosInstance.get(`${API_BASE_URL}/find-by-ma-khach-hang/${maKhachHang}`)
    return response.data
  },

  /**
   * Lấy thông tin 1 địa chỉ theo ID
   * @param {string} id - ID địa chỉ
   * @returns {Promise<Object>} Thông tin địa chỉ
   */
  async getAddressById(id) {
    const response = await axiosInstance.get(`${API_BASE_URL}/getOne/${id}`)
    return response.data
  },

  /**
   * Thêm địa chỉ mới
   * @param {Object} data - Thông tin địa chỉ
   * @returns {Promise<Object>} Kết quả
   */
  async addAddress(data) {
    const response = await axiosInstance.post(`${API_BASE_URL}/add`, data)
    return response.data
  },

  /**
   * Cập nhật thông tin địa chỉ
   * @param {string} id - ID địa chỉ
   * @param {Object} data - Thông tin địa chỉ mới
   * @returns {Promise<Object>} Kết quả
   */
  async updateAddress(id, data) {
    const response = await axiosInstance.put(`${API_BASE_URL}/sua/${id}`, data)
    return response.data
  },

  /**
   * Xóa địa chỉ theo ID
   * @param {string} id - ID địa chỉ
   * @returns {Promise<Object>} Kết quả
   */
  async deleteAddress(id) {
    const response = await axiosInstance.delete(`${API_BASE_URL}/xoa/${id}`)
    return response.data
  },

  /**
   * Lấy thông tin khách hàng theo ID (userId)
   * @param {string} id - ID khách hàng (userId)
   * @returns {Promise<Object>} Thông tin khách hàng
   */
  async getCustomerById(id) {
    const response = await axiosInstance.get(`/api/khach-hang/getOne/${id}`)
    return response.data
  },

  /**
   * Lấy danh sách tất cả tỉnh/thành phố
   * Sử dụng API free từ provinces.open-api.vn
   * @returns {Promise<Array>} Danh sách tỉnh/thành phố
   */
  async getAllProvinces() {
    try {
      // Thử dùng API free trước
      const response = await fetch('https://provinces.open-api.vn/api/p/')
      if (response.ok) {
        const data = await response.json()
        // Map về format giống backend: { id, name }
        return data.map((p) => ({
          id: p.code,
          name: p.name,
          code: p.code,
        }))
      }
    } catch (error) {
      console.warn('API free failed, trying backend API:', error)
    }

    // Fallback về backend API
    try {
      const response = await axiosInstance.get('/api/dia-chi-tinh-xa/hien-thi-tinh-all')
      return response.data?.data || response.data || []
    } catch (error) {
      console.error('Backend API also failed:', error)
      return []
    }
  },

  /**
   * Lấy danh sách quận/huyện theo tỉnh
   * @param {number} provinceCode - Code tỉnh/thành phố
   * @returns {Promise<Array>} Danh sách quận/huyện
   */
  async getDistrictsByProvince(provinceCode) {
    try {
      // Thử dùng API free trước
      const response = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`)
      if (response.ok) {
        const data = await response.json()
        return data.districts?.map((d) => ({
          id: d.code,
          name: d.name,
          code: d.code,
          provinceCode: provinceCode,
        })) || []
      }
    } catch (error) {
      console.warn('API free failed for districts:', error)
    }
    return []
  },

  /**
   * Lấy danh sách xã/phường theo quận/huyện
   * @param {number} districtCode - Code quận/huyện
   * @returns {Promise<Array>} Danh sách xã/phường
   */
  async getWardsByDistrict(districtCode) {
    try {
      // Thử dùng API free trước
      const response = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`)
      if (response.ok) {
        const data = await response.json()
        return data.wards?.map((w) => ({
          id: w.code,
          name: w.name,
          code: w.code,
          districtCode: districtCode,
        })) || []
      }
    } catch (error) {
      console.warn('API free failed for wards:', error)
    }
    return []
  },

  /**
   * Lấy danh sách xã/phường theo code tỉnh (backward compatibility)
   * @param {number} provinceCode - Code tỉnh/thành phố
   * @returns {Promise<Array>} Danh sách xã/phường
   */
  async getWardsByProvince(provinceCode) {
    try {
      // Lấy tất cả quận/huyện của tỉnh
      const districts = await this.getDistrictsByProvince(provinceCode)

      // Lấy tất cả xã/phường từ tất cả quận/huyện
      const allWards = []
      for (const district of districts) {
        const wards = await this.getWardsByDistrict(district.code)
        allWards.push(...wards)
      }

      return allWards
    } catch (error) {
      console.warn('Error getting wards, trying backend API:', error)
      // Fallback về backend API
      try {
        const response = await axiosInstance.get(`/api/dia-chi-tinh-xa/xa-phuong/${provinceCode}`)
        return response.data?.data || response.data || []
      } catch (backendError) {
        console.error('Backend API also failed:', backendError)
        return []
      }
    }
  },
}

export default addressService
