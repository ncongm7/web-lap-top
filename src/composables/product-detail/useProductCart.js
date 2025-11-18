import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/customer/cartStore'
import { useAuthStore } from '@/stores/customer/authStore'
import authService from '@/service/customer/authService'

/**
 * ========================================
 * COMPOSABLE: useProductCart
 * ========================================
 * Quản lý logic thêm sản phẩm vào giỏ hàng
 */
export function useProductCart() {
  const router = useRouter()
  const cartStore = useCartStore()
  const authStore = useAuthStore()

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @returns {Promise<boolean>} - True nếu thành công, false nếu thất bại
   */
  const handleAddToCart = async ({ productId, productName, quantity }) => {
    try {
      // Đảm bảo authStore đã được initialize
      if (!authStore.user && !authStore.token) {
        authStore.initialize()
      }

      // Kiểm tra authentication bằng authStore hoặc authService
      // authStore.isAuthenticated là computed property
      const isAuthenticated = authStore.isAuthenticated || authService.isAuthenticated()
      
      console.log('🔐 [useProductCart] Auth check:', {
        authStoreIsAuthenticated: authStore.isAuthenticated,
        authServiceIsAuthenticated: authService.isAuthenticated(),
        token: authStore.token,
        user: authStore.user,
        localStorageToken: localStorage.getItem('customer_token'),
        localStorageUser: localStorage.getItem('customer_user')
      })
      
      if (!isAuthenticated) {
        // Thay vì alert, có thể mở modal đăng nhập
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
        router.push('/login')
        return false
      }

      // Lấy khachHangId từ authStore hoặc authService
      const khachHangId = authStore.getCustomerId() || authService.getCustomerId()
      
      console.log('👤 [useProductCart] Customer ID:', khachHangId)
      
      if (!khachHangId) {
        alert('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.')
        router.push('/login')
        return false
      }

      if (!productId || quantity <= 0) {
        alert('Vui lòng chọn phiên bản và số lượng hợp lệ.')
        return false
      }

      console.log('🛒 Adding to cart:', { productId, quantity, khachHangId })

      await cartStore.addToCart({
        ctspId: productId,
        soLuong: quantity,
      })

      // Show success toast
      alert(`✅ Đã thêm "${productName}" (Số lượng: ${quantity}) vào giỏ hàng!`)
      return true
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert(err.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
      return false
    }
  }

  /**
   * Mua ngay (thêm vào giỏ và chuyển tới trang thanh toán)
   */
  const handleBuyNow = async ({ productId, productName, quantity }) => {
    try {
      // Add to cart first
      const success = await handleAddToCart({ productId, productName, quantity })

      // If added successfully, navigate to checkout
      if (success) {
        router.push('/checkout')
      }
    } catch (err) {
      // Error is already handled in handleAddToCart
      console.error('Error in buy now process:', err)
    }
  }

  return {
    handleAddToCart,
    handleBuyNow,
  }
}

