import axiosInstance from '@/service/axiosInstance'

/**
 * Lịch sử bảo hành của khách hàng
 * Dùng API quản lý phiếu bảo hành hiện có ở backend
 */
export const warrantyHistoryService = {
  async fetchAll() {
    const res = await axiosInstance.get('/api/phieu-bao-hanh-quan-ly/danh-sach')
    // API trả về ResponseObject { data, message }
    return res?.data?.data || []
  },
}

export default warrantyHistoryService
