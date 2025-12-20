import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/customer/cartStore'
import { useToast } from '@/composables/useToast'

/**
 * Composable để quản lý giỏ hàng
 * Thay thế props/emits bằng việc truy cập trực tiếp vào store
 */
export function useCart() {
  const router = useRouter()
  const cartStore = useCartStore()
  const { showWarning, showError } = useToast()

  // Computed properties từ store
  const cartItems = computed(() => cartStore.cartItems)
  const cartCount = computed(() => cartStore.cartCount)
  const selectedItems = computed(() => cartStore.selectedItems)
  const subtotal = computed(() => cartStore.subtotal)
  const discount = computed(() => cartStore.discount)
  const pointsDiscount = computed(() => cartStore.pointsDiscount)
  const shippingFee = computed(() => cartStore.shippingFee)
  const total = computed(() => cartStore.total)
  const appliedVoucher = computed(() => cartStore.appliedVoucher)
  const hasItems = computed(() => cartStore.hasItems)
  const loading = computed(() => cartStore.loading)
  const error = computed(() => cartStore.error)

  // Methods
  const fetchCart = async () => {
    await cartStore.fetchCart()
  }

  const increaseQuantity = async (itemId) => {
    const result = await cartStore.increaseQuantity(itemId)
    if (!result?.success) {
      alert(result?.message || 'Không thể tăng số lượng')
    }
    return result
  }

  const decreaseQuantity = async (itemId) => {
    const result = await cartStore.decreaseQuantity(itemId)
    if (!result?.success) {
      alert(result?.message || 'Không thể giảm số lượng')
    }
    return result
  }

  const updateQuantity = async (itemId, quantity) => {
    const result = await cartStore.updateCartItem(itemId, quantity)
    if (!result?.success) {
      alert(result?.message || 'Không thể cập nhật số lượng')
    }
    return result
  }

  const removeItem = async (itemId) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      const result = await cartStore.removeCartItem(itemId)
      if (!result?.success) {
        alert(result?.message || 'Không thể xóa sản phẩm')
      }
      return result
    }
    return { success: false, cancelled: true }
  }

  const toggleSelection = (itemId) => {
    cartStore.toggleItemSelection(itemId)
  }

  const toggleSelectAll = () => {
    cartStore.toggleSelectAll()
  }

  const clearCart = async () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
      await cartStore.clearCart()
    }
  }

  const checkout = async () => {
    if (selectedItems.value.length === 0) {
      showWarning('Vui lòng chọn ít nhất một sản phẩm để thanh toán')
      return false
    }

    // Validate stock before checkout
    try {
      const authStore = await import('@/stores/customer/authStore').then(m => m.useAuthStore())
      const khachHangId = authStore.getCustomerId()
      
      if (!khachHangId) {
        showError('Vui lòng đăng nhập để tiếp tục')
        return false
      }

      // Get selected item IDs
      const selectedItemIds = selectedItems.value.map(item => item.id)
      console.log('🔍 Validating selected items:', selectedItemIds)

      const cartService = await import('@/service/customer/cartService').then(m => m.default)
      const validation = await cartService.validateCart(khachHangId, selectedItemIds)

      if (!validation.success || !validation.data.isValid) {
        // Show detailed error message
        const outOfStockItems = validation.data?.outOfStockItems || []
        
        if (outOfStockItems.length > 0) {
          let errorMessage = '❌ Một số sản phẩm đã hết hàng:\n\n'
          outOfStockItems.forEach((item, index) => {
            errorMessage += `${index + 1}. ${item.productName}`
            if (item.variantName) {
              errorMessage += ` (${item.variantName})`
            }
            errorMessage += `\n   Yêu cầu: ${item.requestedQuantity} | Còn lại: ${item.availableStock}\n`
          })
          errorMessage += '\nVui lòng cập nhật số lượng!'
          showError(errorMessage)
        } else {
          showError(validation.data?.message || 'Không thể thanh toán. Vui lòng kiểm tra lại giỏ hàng.')
        }
        
        return false
      }

      // Validation passed, proceed to checkout
      router.push('/checkout')
      return true
    } catch (error) {
      console.error('Error validating cart:', error)
      showError('Có lỗi xảy ra khi kiểm tra giỏ hàng. Vui lòng thử lại.')
      return false
    }
  }

  // Points methods
  const applyPoints = (points, conversionRate, maxAllowed) => {
    cartStore.applyPoints(points, conversionRate, maxAllowed)
  }

  const removePoints = () => {
    cartStore.removePoints()
  }

  // Helper: Lấy item theo ID
  const getItemById = (itemId) => {
    return cartItems.value.find((item) => item.id === itemId)
  }

  // Helper: Kiểm tra item có được chọn không
  const isItemSelected = (itemId) => {
    const item = getItemById(itemId)
    return item?.selected || false
  }

  // Helper: Kiểm tra tất cả đã được chọn
  const allSelected = computed(() => {
    return cartItems.value.length > 0 && cartItems.value.every((item) => item.selected)
  })

  // Points state
  const pointsUsed = computed(() => cartStore.pointsUsed)
  const memberPoints = computed(() => cartStore.memberPoints)

  // Points Actions
  const setMemberPoints = (data) => cartStore.setMemberPoints(data)

  return {
    // State
    cartItems,
    cartCount,
    selectedItems,
    subtotal,
    discount,
    pointsDiscount,
    pointsUsed,
    memberPoints,
    shippingFee,
    total,
    appliedVoucher,
    hasItems,
    loading,
    error,
    allSelected,

    // Methods
    fetchCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    removeItem,
    toggleSelection,
    toggleSelectAll,
    clearCart,
    checkout,
    applyPoints,
    removePoints,
    setMemberPoints,

    // Helpers
    getItemById,
    isItemSelected,
  }
}
