import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1/thongke';

/**
 * Service cho API thống kê doanh thu mới
 * Sử dụng logic nghiệp vụ CHÍNH XÁC:
 * - CASH: xác nhận ngay
 * - QR: chỉ khi payment_confirmed_at
 * - COD: chỉ khi đã giao (HOAN_THANH)
 */
const statisticsService = {
  /**
   * Lấy doanh thu chi tiết đầy đủ
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {Promise} DoanhThuChiTietDTO
   */
  async getDetailedRevenue(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/doanh-thu-chi-tiet`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy doanh thu chi tiết:', error);
      throw error;
    }
  },

  /**
   * Thống kê theo kênh bán hàng (POS / ONLINE)
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {Promise<Array>} ThongKeTheoKenhDTO[]
   */
  async getStatisticsByChannel(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/theo-kenh`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy thống kê theo kênh:', error);
      throw error;
    }
  },

  /**
   * Thống kê theo phương thức thanh toán (CASH / QR / COD)
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {Promise<Array>} ThongKeTheoPhuongThucDTO[]
   */
  async getStatisticsByPaymentMethod(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/theo-phuong-thuc`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy thống kê theo phương thức:', error);
      throw error;
    }
  },

  /**
   * Phân tích dòng tiền
   * @param {string} startDate - YYYY-MM-DD
   * @param {string} endDate - YYYY-MM-DD
   * @returns {Promise} DongTienDTO
   */
  async getCashFlowAnalysis(startDate, endDate) {
    try {
      const response = await axios.get(`${API_BASE_URL}/dong-tien`, {
        params: { startDate, endDate }
      });
      return response.data;
    } catch (error) {
      console.error('❌ Lỗi khi lấy phân tích dòng tiền:', error);
      throw error;
    }
  }
};

export default statisticsService;
