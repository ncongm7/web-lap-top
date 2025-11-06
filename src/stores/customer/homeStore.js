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

        // Fetch song song
        const [productsData, promotionsData] = await Promise.all([
          getFeaturedProducts(8),
          getActivePromotions(),
        ])

        // Update state
        this.featuredProducts = productsData || []
        this.activePromotions = promotionsData || []

        console.log('✅ [HomeStore] Đã fetch dữ liệu:', {
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
