import http from '@/shared/http'

// DEPRECATED: File này không còn sử dụng
// Sử dụng san_pham_service.js thay thế
class CtspService {
  getById(id) {
    // Sử dụng API mới
    return http.get(`/api/chi-tiet-san-pham/${id}`)
  }
  getDanhSachSanPham(sanPhamId) {
    // Sử dụng API mới
    return http.get(`/api/chi-tiet-san-pham/san-pham/${sanPhamId}`)
  }

  getThongSoKyThuat(id) {
    // API này cần kiểm tra lại endpoint
    return http.get(`/api/chi-tiet-san-pham/${id}`)
  }
}

export default new CtspService()
