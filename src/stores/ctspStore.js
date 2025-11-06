// Pinia store cho chi tiết CTSP & biến thể
import { defineStore } from "pinia";
import service from "@/service/ctspService"; // bạn đang dùng service này

export const useCtspCustomerStore = defineStore("ctspCustomer", {
  state: () => ({
    ctsp: null,
    variants: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchById(id) {
      this.loading = true; this.error = null;
      try {
        const res = await service.getById(id);      // API trả { data: { ... }, message, success }
        this.ctsp = res?.data?.data || null;
      } catch (e) { this.error = e; } finally { this.loading = false; }
    },
    async fetchThongSo(id) {
      this.loading = true; this.error = null;
      try {
        const res = await service.getById(id);      // API trả { data: { ... }, message, success }
        this.ctsp = res?.data?.data || null;
      } catch (e) { this.error = e; } finally { this.loading = false; }
    },
    async fetchVariants(idsp) {
      if (!idsp) return;
      this.loading = true; this.error = null;
      try {
        const res = await service.getDanhSachSanPham(idsp); // trả mảng DTO
        this.variants = res?.data || [];
      } catch (e) { this.error = e; } finally { this.loading = false; }
    },
  },
});
