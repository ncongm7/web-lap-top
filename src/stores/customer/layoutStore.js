import { defineStore } from 'pinia'

/**
 * Store quản lý state chung cho layout (header, footer, cart icon...)
 */
export const useLayoutStore = defineStore('customer-layout', {
  state: () => ({
    cartItemCount: 0,
    user: null,
    isAuthenticated: false,
    isMobileMenuOpen: false,
    isSearchOpen: false,
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
     * Cập nhật số lượng item trong giỏ hàng
     */
    updateCartCount(count) {
      this.cartItemCount = count
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
      this.cartItemCount = 0

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
  },
})
