import { defineStore } from 'pinia'
import { getFeaturedProducts, getActivePromotions } from '@/service/customer/homeService'

/**
 * Store quản lý state cho trang chủ
 */
export const useHomeStore = defineStore('customer-home', {
  state: () => ({
    isLoading: false,
    error: null,

    // Sản phẩm nổi bật
    featuredProducts: [],

    // Khuyến mãi đang chạy
    activePromotions: [],

    // Banner slider
    banners: [],
  }),

  getters: {
    /**
     * Kiểm tra có dữ liệu không
     */
    hasData: (state) => {
      return state.featuredProducts.length > 0 || state.activePromotions.length > 0
    },
  },

  actions: {
    /**
     * Fetch tất cả dữ liệu cho trang chủ
     */
    async fetchHomeData() {
      this.isLoading = true
      this.error = null

      try {
        console.log('🔄 [HomeStore] Đang fetch dữ liệu trang chủ...')

        // Fetch products first (promotions might fail)
        try {
          const productsData = await getFeaturedProducts() // Lấy tất cả sản phẩm
          this.featuredProducts = productsData || []
          console.log('✅ [HomeStore] Products loaded:', this.featuredProducts.length)
        } catch (productError) {
          console.error('❌ [HomeStore] Failed to load products:', productError)
          this.featuredProducts = []
        }

        // Fetch promotions separately
        try {
          const promotionsData = await getActivePromotions()
          this.activePromotions = promotionsData || []
          console.log('✅ [HomeStore] Promotions loaded:', this.activePromotions.length)
        } catch (promotionError) {
          console.error('❌ [HomeStore] Failed to load promotions:', promotionError)
          this.activePromotions = []
        }

        console.log('✅ [HomeStore] Final data:', {
          products: this.featuredProducts.length,
          promotions: this.activePromotions.length,
        })
      } catch (error) {
        console.error('❌ [HomeStore] Lỗi khi fetch dữ liệu:', error)
        this.error = error.message || 'Không thể tải dữ liệu trang chủ'
      } finally {
        this.isLoading = false
      }
    },

    /**
     * Reset state
     */
    reset() {
      this.featuredProducts = []
      this.activePromotions = []
      this.banners = []
      this.error = null
    },
  },
})
