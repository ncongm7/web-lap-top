import { defineStore } from "pinia";
import phieuGiamGiaService from "@/service/phieuGiamGiaService";

export const usePhieuGiamGiaStore = defineStore("phieuGiamGia", {
  state: () => ({
    phieuGiamGias: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchPhieuGiamGias() {
      this.loading = true;
      this.error = null;
      try {
        const response = await phieuGiamGiaService.getAll();
        // nếu backend wrap kiểu { data: {...} } thì chỉnh lại cho đúng
        this.phieuGiamGias = response?.data?.data ?? response?.data ?? [];
      } catch (error) {
        console.error("Lỗi khi lấy danh sách phiếu giảm giá:", error);
        this.error = "Không thể tải được danh sách phiếu giảm giá.";
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    allPhieuGiamGias: (state) => state.phieuGiamGias,
  },
});
