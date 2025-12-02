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
    console.log('🚀 [useProductCart] handleBuyNow called', { productId, productName, quantity })

    try {
      // Đảm bảo authStore đã được initialize
      if (!authStore.user && !authStore.token) {
        console.log('🔄 [useProductCart] Initializing authStore')
        authStore.initialize()
      }

      // Kiểm tra authentication
      const isAuthenticated = authStore.isAuthenticated || authService.isAuthenticated()
      console.log('🔐 [useProductCart] Authentication check:', { isAuthenticated, hasToken: !!authStore.token })

      if (!isAuthenticated) {
        console.warn('⚠️ [useProductCart] User not authenticated')
        alert('Vui lòng đăng nhập để mua hàng')
        router.push('/login')
        return false
      }

      // Lấy khachHangId
      const khachHangId = authStore.getCustomerId() || authService.getCustomerId()
      console.log('👤 [useProductCart] Customer ID:', khachHangId)

      if (!khachHangId) {
        console.warn('⚠️ [useProductCart] Cannot get customer ID')
        alert('Không thể lấy thông tin người dùng. Vui lòng đăng nhập lại.')
        router.push('/login')
        return false
      }

      if (!productId || quantity <= 0) {
        console.warn('⚠️ [useProductCart] Invalid productId or quantity', { productId, quantity })
        alert('Vui lòng chọn phiên bản và số lượng hợp lệ.')
        return false
      }

      console.log('🛒 [useProductCart] Adding to cart:', { productId, quantity, khachHangId })

      // Thêm vào giỏ hàng
      await cartStore.addToCart({
        ctspId: productId,
        soLuong: quantity,
      })
      console.log('✅ [useProductCart] Added to cart successfully')

      // Đảm bảo cart được fetch để có dữ liệu mới nhất
      console.log('🔄 [useProductCart] Fetching cart...')
      await cartStore.fetchCart()
      console.log('✅ [useProductCart] Cart fetched, items:', cartStore.cartItems?.length)

      // Tìm item vừa thêm và đánh dấu là selected để checkout
      const cartItems = cartStore.cartItems
      const addedItem = cartItems.find(item =>
        (item.ctspId === productId || item.idCtsp === productId || item.id === productId)
      )
      console.log('🔍 [useProductCart] Looking for added item:', { productId, found: !!addedItem, itemId: addedItem?.id })

      if (addedItem) {
        // Đánh dấu item này là selected để checkout
        console.log('✅ [useProductCart] Toggling selection for item:', addedItem.id)
        cartStore.toggleItemSelection(addedItem.id)
        console.log('✅ [useProductCart] Item selected')
      } else {
        console.warn('⚠️ [useProductCart] Could not find added item in cart')
      }

      // Chuyển trực tiếp đến trang thanh toán
      console.log('🚀 [useProductCart] Navigating to checkout page...')
      router.push('/checkout')
      console.log('✅ [useProductCart] Navigation triggered')
      return true
    } catch (err) {
      console.error('❌ [useProductCart] Error in buy now process:', err)
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

