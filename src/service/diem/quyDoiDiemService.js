import axiosInstance from '../axiosInstance';

const API_URL = '/api/v1/diem/quy-doi';

export const quyDoiDiemService = {
  /**
   * Lấy quy đổi điểm đang hoạt động
   * Trả về null nếu không có quy đổi điểm đang hoạt động
   */
  async getQuyDoiDiemDangHoatDong() {
    try {
      const response = await axiosInstance.get(`${API_URL}/active`);
      // Backend có thể trả về data = null nếu không có quy đổi điểm đang hoạt động
      return response.data.data || null;
    } catch (error) {
      // Nếu có lỗi, log và trả về null
      console.warn('⚠️ Không thể lấy quy đổi điểm đang hoạt động:', error);
      return null;
    }
  },
  
  /**
   * Lấy tất cả quy đổi điểm (admin)
   */
  async getAllQuyDoiDiem() {
    const response = await axiosInstance.get(`${API_URL}/all`);
    return response.data.data;
  }
};

