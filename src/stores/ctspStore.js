// Pinia store cho chi tiết CTSP & biến thể
import { defineStore } from 'pinia'
import { sanPhamService } from '@/service/customer/san_pham_service'

export const useCtspCustomerStore = defineStore('ctspCustomer', {
  state: () => ({
    ctsp: null,
    variants: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchById(ctspId) {
      this.loading = true
      this.error = null
      try {
        const res = await sanPhamService.getProductDetailById(ctspId)
        this.ctsp = res?.data || null
      } catch (e) {
        this.error = e
        console.error('Error fetching CTSP by ID:', e)
      } finally {
        this.loading = false
      }
    },

    async fetchVariants(sanPhamId) {
      if (!sanPhamId) return
      this.loading = true
      this.error = null
      try {
        // Lấy danh sách chi tiết sản phẩm kèm giảm giá theo ID sản phẩm
        const res = await sanPhamService.getProductDetailsWithDiscount(sanPhamId)
        this.variants = res?.data || []
      } catch (e) {
        this.error = e
        console.error('Error fetching product variants:', e)
      } finally {
        this.loading = false
      }
    },
  },
})
