import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import cartService from '@/service/customer/cartService'
import voucherService from '@/service/customer/voucherService'
import authService from '@/service/customer/authService'

export const useCartStore = defineStore('cart', () => {
  // State
  const cart = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const cartItems = computed(() => cart.value?.items || [])

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const selectedItems = computed(() => {
    return cartItems.value.filter((item) => item.selected)
  })

  const subtotal = computed(() => cart.value?.subtotal || 0)

  const discount = computed(() => cart.value?.discount || 0)

  const shippingFee = computed(() => cart.value?.shippingFee || 0)

  const total = computed(() => cart.value?.total || 0)

  const appliedVoucher = computed(() => cart.value?.appliedVoucher || null)

  const availablePoints = computed(() => cart.value?.availablePoints || 0)

  const hasItems = computed(() => cartItems.value.length > 0)

  // Actions
  /**
   * Lấy giỏ hàng từ backend
   */
  const fetchCart = async () => {
    loading.value = true
    error.value = null

    try {
      // TODO: Get khachHangId from auth store
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        cart.value = createEmptyCart()
        return
      }

      const response = await cartService.getCart(khachHangId)
      if (response.success) {
        cart.value = response.data
      } else {
        throw new Error(response.message || 'Không thể lấy giỏ hàng')
      }
    } catch (err) {
      console.error('❌ Error fetching cart:', err)
      error.value = err.message || 'Không thể lấy giỏ hàng'
      cart.value = createEmptyCart()
    } finally {
      loading.value = false
    }
  }

  /**
   * Thêm sản phẩm vào giỏ hàng
   */
  const addToCart = async ({ ctspId, soLuong = 1 }) => {
    loading.value = true
    error.value = null

    try {
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        throw new Error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
      }

      const response = await cartService.addToCart(khachHangId, { ctspId: ctspId, quantity: soLuong })

      // Assuming the service returns the updated cart directly
      // And assuming the response structure from service is just the data
      cart.value = response.data; // Or handle as per actual API response
      
      // Let's throw error if response indicates failure
      if (response.success === false) {
         throw new Error(response.message || 'Không thể thêm sản phẩm');
      }
      
    } catch (err) {
      console.error('❌ Error adding to cart:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Không thể thêm sản phẩm'
      error.value = errorMessage
      // Re-throw the error so the calling component knows about it
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  /**
   * Cập nhật số lượng sản phẩm trong giỏ
   */
  const updateCartItem = async (itemId, quantity) => {
    loading.value = true
    error.value = null

    try {
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        throw new Error('Vui lòng đăng nhập')
      }

      const response = await cartService.updateCartItem(khachHangId, itemId, { quantity })

      if (response.success) {
        cart.value = response.data
        return { success: true }
      } else {
        throw new Error(response.message || 'Không thể cập nhật')
      }
    } catch (err) {
      console.error('❌ Error updating cart item:', err)
      error.value = err.message || 'Không thể cập nhật'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Tăng số lượng sản phẩm
   */
  const increaseQuantity = async (itemId) => {
    const item = cartItems.value.find((i) => i.id === itemId)
    if (item) {
      return await updateCartItem(itemId, item.quantity + 1)
    }
  }

  /**
   * Giảm số lượng sản phẩm
   */
  const decreaseQuantity = async (itemId) => {
    const item = cartItems.value.find((i) => i.id === itemId)
    if (item && item.quantity > 1) {
      return await updateCartItem(itemId, item.quantity - 1)
    }
  }

  /**
   * Xóa sản phẩm khỏi giỏ hàng
   */
  const removeCartItem = async (itemId) => {
    loading.value = true
    error.value = null

    try {
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        throw new Error('Vui lòng đăng nhập')
      }

      const response = await cartService.removeCartItem(khachHangId, itemId)

      if (response.success) {
        cart.value = response.data
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' }
      } else {
        throw new Error(response.message || 'Không thể xóa sản phẩm')
      }
    } catch (err) {
      console.error('❌ Error removing cart item:', err)
      error.value = err.message || 'Không thể xóa sản phẩm'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Chọn/bỏ chọn sản phẩm để thanh toán
   */
  const toggleItemSelection = (itemId) => {
    const item = cartItems.value.find((i) => i.id === itemId)
    if (item) {
      item.selected = !item.selected
    }
  }

  /**
   * Chọn/bỏ chọn tất cả sản phẩm
   */
  const toggleSelectAll = () => {
    const allSelected = cartItems.value.every((item) => item.selected)
    cartItems.value.forEach((item) => {
      item.selected = !allSelected
    })
  }

  /**
   * Áp dụng voucher
   */
  const applyVoucher = async (voucherCode) => {
    loading.value = true
    error.value = null

    try {
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        throw new Error('Vui lòng đăng nhập')
      }

      const response = await voucherService.applyVoucher(khachHangId, voucherCode)

      if (response.success && response.data.success) {
        cart.value = response.data.updatedCart
        return {
          success: true,
          message: response.data.message,
          discountAmount: response.data.discountAmount,
        }
      } else {
        throw new Error(response.data?.message || response.message || 'Không thể áp dụng voucher')
      }
    } catch (err) {
      console.error('❌ Error applying voucher:', err)
      error.value = err.message || 'Không thể áp dụng voucher'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Xóa voucher
   */
  const removeVoucher = () => {
    if (cart.value) {
      cart.value.appliedVoucher = null
      cart.value.discount = 0
      cart.value.total = cart.value.subtotal + cart.value.shippingFee
    }
  }

  /**
   * Xóa toàn bộ giỏ hàng
   */
  const clearCart = async () => {
    loading.value = true
    error.value = null

    try {
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        cart.value = createEmptyCart()
        return
      }

      const response = await cartService.clearCart(khachHangId)

      if (response.success) {
        cart.value = createEmptyCart()
      } else {
        throw new Error(response.message || 'Không thể xóa giỏ hàng')
      }
    } catch (err) {
      console.error('❌ Error clearing cart:', err)
      error.value = err.message || 'Không thể xóa giỏ hàng'
    } finally {
      loading.value = false
    }
  }

  // Helper Functions
  /**
   * Kiểm tra người dùng đã đăng nhập chưa
   */
  const isAuthenticated = () => {
    return authService.isAuthenticated()
  }

  /**
   * Lấy khách hàng ID từ auth service
   */
  const getKhachHangId = () => {
    return authService.getCustomerId()
  }

  /**
   * Tạo giỏ hàng trống
   */
  const createEmptyCart = () => {
    return {
      id: null,
      items: [],
      subtotal: 0,
      discount: 0,
      shippingFee: 0,
      total: 0,
      appliedVoucher: null,
      availablePoints: 0,
    }
  }

  return {
    // State
    cart,
    loading,
    error,

    // Computed
    cartItems,
    cartCount,
    selectedItems,
    subtotal,
    discount,
    shippingFee,
    total,
    appliedVoucher,
    availablePoints,
    hasItems,

    // Actions
    fetchCart,
    addToCart,
    updateCartItem,
    increaseQuantity,
    decreaseQuantity,
    removeCartItem,
    toggleItemSelection,
    toggleSelectAll,
    applyVoucher,
    removeVoucher,
    clearCart,

    // Helper
    isAuthenticated,
    getKhachHangId,
  }
})
