// src/service/phieuGiamGiaService.js
import http from "@/shared/http";

class PhieuGiamGiaService {
  getAll() {
    return http.get("/api/phieu-giam-gia-quan-ly/danh-sach");
  }
  getById(id) {
    return http.get(`/api/phieu-giam-gia-quan-ly/detail/${id}`);
  }
}

// ✅ Quan trọng: default export một instance, không phải named export
export default new PhieuGiamGiaService();
