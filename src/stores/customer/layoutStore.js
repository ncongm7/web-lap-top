import { defineStore } from 'pinia'
import { useCartStore } from './cartStore'

/**
 * Store quản lý state chung cho layout (header, footer, cart icon...)
 */
export const useLayoutStore = defineStore('customer-layout', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    isMobileMenuOpen: false,
    isSearchOpen: false,
    showLoginModal: false,
    pendingNavigation: null, // Lưu route đang chờ sau khi đăng nhập
    showRegisterTab: false, // Nếu true, modal sẽ tự động chuyển sang tab đăng ký
  }),

  getters: {
    /**
     * Lấy tên hiển thị của user
     */
    displayName: (state) => {
      if (!state.user) return 'Khách hàng'
      return state.user.hoTen || state.user.tenDangNhap || 'Khách hàng'
    },

    /**
     * Check xem user đã login chưa
     */
    isLoggedIn: (state) => {
      return state.isAuthenticated && state.user !== null
    },

    /**
     * Lấy số lượng sản phẩm trong giỏ hàng từ cartStore
     */
    cartItemCount: () => {
      const cartStore = useCartStore()
      return cartStore.cartCount
    },
  },

  actions: {
    /**
     * Khởi tạo user từ localStorage
     */
    initializeAuth() {
      const token = localStorage.getItem('customer_token')
      const userStr = localStorage.getItem('customer_user')

      if (token && userStr) {
        try {
          this.user = JSON.parse(userStr)
          this.isAuthenticated = true
          console.log('✅ [LayoutStore] Khôi phục phiên đăng nhập:', this.user)
        } catch (error) {
          console.error('❌ [LayoutStore] Lỗi parse user data:', error)
          this.logout()
        }
      }
    },

    /**
     * Set user sau khi login thành công
     */
    setUser(user, token) {
      this.user = user
      this.isAuthenticated = true

      // Lưu vào localStorage
      localStorage.setItem('customer_token', token)
      localStorage.setItem('customer_user', JSON.stringify(user))

      console.log('✅ [LayoutStore] Đăng nhập thành công:', user)
    },

    /**
     * Logout - xóa user data
     */
    logout() {
      this.user = null
      this.isAuthenticated = false

      // Xóa giỏ hàng khi logout
      const cartStore = useCartStore()
      cartStore.clearCart()

      // Xóa localStorage
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')

      console.log('✅ [LayoutStore] Đã đăng xuất')
    },

    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },

    /**
     * Đóng mobile menu
     */
    closeMobileMenu() {
      this.isMobileMenuOpen = false
    },

    /**
     * Toggle search bar
     */
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen
    },

    /**
     * Hiển thị modal đăng nhập
     * @param {string|null} pendingRoute - Route đang chờ sau khi đăng nhập
     * @param {boolean} showRegisterTab - Nếu true, tự động chuyển sang tab đăng ký
     */
    openLoginModal(pendingRoute = null, showRegisterTab = false) {
      this.showLoginModal = true
      this.pendingNavigation = pendingRoute
      this.showRegisterTab = showRegisterTab
    },

    /**
     * Đóng modal đăng nhập
     */
    closeLoginModal() {
      this.showLoginModal = false
      this.pendingNavigation = null
      this.showRegisterTab = false
    },

    /**
     * Lấy và xóa pending navigation
     */
    getPendingNavigation() {
      const route = this.pendingNavigation
      this.pendingNavigation = null
      return route
    },
  },
})
