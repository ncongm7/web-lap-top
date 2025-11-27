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
      // Đảm bảo authStore đã được initialize
      if (!authStore.user && !authStore.token) {
        authStore.initialize()
      }

      // Kiểm tra authentication
      const isAuthenticated = authStore.isAuthenticated || authService.isAuthenticated()

      if (!isAuthenticated) {
        alert('Vui lòng đăng nhập để mua hàng')
        router.push('/login')
        return false
      }

      // Lấy khachHangId
      const khachHangId = authStore.getCustomerId() || authService.getCustomerId()

      if (!khachHangId) {
        alert('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.')
        router.push('/login')
        return false
      }

      if (!productId || quantity <= 0) {
        alert('Vui lòng chọn phiên bản và số lượng hợp lệ.')
        return false
      }

      console.log('🛒 [Buy Now] Adding to cart:', { productId, quantity, khachHangId })

      // Thêm vào giỏ hàng
      await cartStore.addToCart({
        ctspId: productId,
        soLuong: quantity,
      })

      // Đảm bảo cart được fetch để có dữ liệu mới nhất
      await cartStore.fetchCart()

      // Tìm item vừa thêm và đánh dấu là selected để checkout
      const cartItems = cartStore.cartItems
      const addedItem = cartItems.find(item =>
        (item.ctspId === productId || item.idCtsp === productId || item.id === productId)
      )

      if (addedItem) {
        // Đánh dấu item này là selected để checkout
        cartStore.toggleItemSelection(addedItem.id)
      }

      // Chuyển đến trang giỏ hàng
      router.push('/cart')
      return true
    } catch (err) {
      console.error('Error in buy now process:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Không thể thực hiện mua ngay. Vui lòng thử lại.'
      alert(errorMessage)
      return false
    }
  }

  /**
   * Liên hệ về sản phẩm (khi hết hàng)
   */
  const handleContact = ({ productId, productName }) => {
    // Chuyển đến trang liên hệ với thông tin sản phẩm
    router.push({
      path: '/contact',
      query: {
        productId: productId,
        productName: productName,
      },
    })
  }

  return {
    handleAddToCart,
    handleBuyNow,
    handleContact,
  }
}

