import axiosInstance from '../axiosInstance'

/**
 * Service xử lý các API liên quan đến trả hàng/bảo hành
 */
export const traHangService = {
  /**
   * Kiểm tra điều kiện trả hàng/bảo hành
   * @param {string} idHoaDon - UUID của hóa đơn
   * @returns {Promise} Response chứa thông tin điều kiện
   */
  kiemTraDieuKien(idHoaDon) {
    if (!idHoaDon) {
      return Promise.reject(new Error('ID hóa đơn là bắt buộc'))
    }
    return axiosInstance.get(`/api/v1/tra-hang/kiem-tra-dieu-kien/${idHoaDon}`)
  },

  /**
   * Tạo yêu cầu trả hàng/bảo hành
   * @param {Object} requestData - Dữ liệu yêu cầu
   * @param {string} requestData.idHoaDon - UUID của hóa đơn
   * @param {string} requestData.idKhachHang - UUID của khách hàng
   * @param {string} requestData.idHoaDonChiTiet - UUID của hóa đơn chi tiết
   * @param {string} requestData.idSerialDaBan - UUID của serial đã bán (optional)
   * @param {string} requestData.lyDoTraHang - Lý do trả hàng
   * @param {string} requestData.tinhTrangLucTra - Tốt, Hỏng, Trầy xước, Khác
   * @param {string} requestData.moTaTinhTrang - Mô tả chi tiết tình trạng (optional)
   * @param {number} requestData.loaiYeuCau - 0: Đổi trả, 1: Bảo hành
   * @param {number} requestData.soLuong - Số lượng trả
   * @param {File[]} requestData.hinhAnh - Danh sách ảnh minh chứng (optional)
   * @returns {Promise} Response chứa thông tin yêu cầu vừa tạo
   */
  taoYeuCau(requestData) {
    if (!requestData.idHoaDon || !requestData.idKhachHang || !requestData.idHoaDonChiTiet) {
      return Promise.reject(new Error('Thiếu thông tin bắt buộc'))
    }

    // Tạo FormData để gửi file
    const formData = new FormData()
    formData.append('idHoaDon', requestData.idHoaDon)
    formData.append('idKhachHang', requestData.idKhachHang)
    formData.append('idHoaDonChiTiet', requestData.idHoaDonChiTiet)

    if (requestData.idSerialDaBan) {
      formData.append('idSerialDaBan', requestData.idSerialDaBan)
    }

    formData.append('lyDoTraHang', requestData.lyDoTraHang)
    formData.append('tinhTrangLucTra', requestData.tinhTrangLucTra)

    if (requestData.moTaTinhTrang) {
      formData.append('moTaTinhTrang', requestData.moTaTinhTrang)
    }

    formData.append('loaiYeuCau', requestData.loaiYeuCau)
    formData.append('soLuong', requestData.soLuong)

    // Thêm ảnh nếu có
    if (requestData.hinhAnh && requestData.hinhAnh.length > 0) {
      requestData.hinhAnh.forEach((file) => {
        formData.append('hinhAnh', file)
      })
    }

    return axiosInstance.post('/api/v1/tra-hang/tao-yeu-cau', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  },
}

export default traHangService
