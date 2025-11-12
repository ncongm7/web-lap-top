import http from "@/shared/http";

class PhieuGiamGiaService {
  getById(id) {
    // /api/customer/ctsp/{id}
    return http.get(`/api/customer/ctsp/${id}`);
  }
  getDanhSachSanPham(idsp) {
    // /api/customer/ctsp/get-bien-the-san-pham/{sanPhamId}
    return http.get(`/api/customer/ctsp/get-bien-the-san-pham/${idsp}`);
  }

  getThongSoKyThuat(id) {
    // /api/customer/ctsp/thong-so-ky-thuat/{id}
    return http.get(`/api/customer/ctsp/get-bien-the-san-pham/${id}`);
  }
}

export default new PhieuGiamGiaService();
