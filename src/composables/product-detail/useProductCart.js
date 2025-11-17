import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/customer/cartStore'

/**
 * ========================================
 * COMPOSABLE: useProductCart
 * ========================================
 * Quản lý logic thêm sản phẩm vào giỏ hàng
 */
export function useProductCart() {
  const router = useRouter()
  const cartStore = useCartStore()

  /**
   * Thêm sản phẩm vào giỏ hàng
   * @returns {Promise<boolean>} - True nếu thành công, false nếu thất bại
   */
  const handleAddToCart = async ({ productId, productName, quantity }) => {
    try {
      const khachHangId = localStorage.getItem('userId')

      if (!khachHangId) {
        // Thay vì alert, có thể mở modal đăng nhập
        alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
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

