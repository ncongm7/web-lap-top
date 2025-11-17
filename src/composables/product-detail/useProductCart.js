import { useRouter } from 'vue-router'
import cartService from '@/service/customer/cartService'

/**
 * ========================================
 * COMPOSABLE: useProductCart
 * ========================================
 * Quản lý logic thêm sản phẩm vào giỏ hàng
 */
export function useProductCart() {
  const router = useRouter()

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  const handleAddToCart = async ({ productId, productName, quantity }) => {
    try {
      const khachHangId = localStorage.getItem('userId')

      if (!khachHangId) {
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
        router.push('/login')
        return
      }

      console.log('🛒 Adding to cart:', { productId, quantity, khachHangId })

      await cartService.addToCart(khachHangId, {
        ctspId: productId,
        quantity: quantity,
      })

      // Show success toast (có thể thay bằng toast library sau)
      alert(`✅ Đã thêm "${productName}" vào giỏ hàng!`)

      // TODO: Update cart count in header
    } catch (err) {
      console.error('Error adding to cart:', err)
      alert(err.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
    }
  }

  /**
   * Mua ngay (thêm vào giỏ và chuyển tới trang thanh toán)
   */
  const handleBuyNow = async ({ productId, productName, quantity }) => {
    try {
      // Add to cart first
      await handleAddToCart({ productId, productName, quantity })

      // Navigate to cart/checkout
      router.push('/cart')
    } catch (err) {
      console.error('Error buy now:', err)
    }
  }

  return {
    handleAddToCart,
    handleBuyNow,
  }
}

