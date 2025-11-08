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
   * @returns {Promise<Array>} Danh sách tỉnh/thành phố
   */
  async getAllProvinces() {
    const response = await axiosInstance.get('/api/dia-chi-tinh-xa/hien-thi-tinh-all')
    return response.data
  },

  /**
   * Lấy danh sách xã/phường theo code tỉnh
   * @param {number} provinceCode - Code tỉnh/thành phố
   * @returns {Promise<Array>} Danh sách xã/phường
   */
  async getWardsByProvince(provinceCode) {
    const response = await axiosInstance.get(`/api/dia-chi-tinh-xa/xa-phuong/${provinceCode}`)
    return response.data
  },
}

export default addressService
