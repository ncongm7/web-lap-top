import axiosInstance from '../axiosInstance'

/**
 * Service để lấy lịch sử yêu cầu trả hàng
 */
const returnHistoryService = {
  /**
   * Lấy tất cả yêu cầu trả hàng
   * @returns {Promise<Array>} Danh sách yêu cầu trả hàng
   */
  async fetchAll() {
    try {
      const response = await axiosInstance.get('/api/yeu-cau-tra-hang-quan-ly/danh-sach')
      if (response.data && response.data.data) {
        return Array.isArray(response.data.data) ? response.data.data : []
      }
      return []
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử trả hàng:', error)
      throw error
    }
  },
}

export default returnHistoryService
