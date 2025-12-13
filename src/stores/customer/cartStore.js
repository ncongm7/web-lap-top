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

  // Points state
  const pointsUsed = ref(0)
  const pointsDiscount = ref(0)
  const memberPoints = ref({
    available: 0,
    conversionRate: 0, // tienTieuDiem
    earnedRate: 0 // tienTichDiem
  })

  // Computed
  const cartItems = computed(() => cart.value?.items || [])

  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const selectedItems = computed(() => {
    return cartItems.value.filter((item) => item.selected)
  })

  // Tính subtotal dựa trên các sản phẩm đã chọn
  const subtotal = computed(() => {
    if (selectedItems.value.length === 0) {
      return 0
    }
    return selectedItems.value.reduce((sum, item) => {
      // Sử dụng subtotal của item nếu có, nếu không thì tính price * quantity
      return sum + (Number(item.subtotal) || Number(item.price) * item.quantity || 0)
    }, 0)
  })

  // Tính discount dựa trên tỷ lệ subtotal của selectedItems so với toàn bộ giỏ hàng
  const discount = computed(() => {
    const fullSubtotal = cart.value?.subtotal || 0
    const fullDiscount = cart.value?.discount || 0

    // Nếu không có discount hoặc không có sản phẩm được chọn, trả về 0
    if (fullDiscount === 0 || subtotal.value === 0 || fullSubtotal === 0) {
      return 0
    }

    // Tính discount theo tỷ lệ phần trăm
    const discountRate = fullDiscount / fullSubtotal
    return subtotal.value * discountRate
  })

  // Shipping fee - tính lại dựa trên subtotal của selectedItems
  const shippingFee = computed(() => {
    // Nếu không có sản phẩm được chọn, không có phí vận chuyển
    if (selectedItems.value.length === 0) {
      return 0
    }

    // Nếu subtotal sau discount >= 1.000.000, miễn phí vận chuyển
    const subtotalAfterDiscount = subtotal.value - discount.value
    if (subtotalAfterDiscount >= 1000000) {
      return 0
    }

    // Nếu không miễn phí, lấy shipping fee từ backend (nếu có)
    // Hoặc có thể tính lại dựa trên tỷ lệ subtotal selected / subtotal full
    const fullSubtotal = cart.value?.subtotal || 0
    const fullShippingFee = cart.value?.shippingFee || 0

    // Nếu fullSubtotal = 0 hoặc không có shipping fee từ backend, trả về 0
    if (fullSubtotal === 0 || fullShippingFee === 0) {
      return 0
    }

    // Tính shipping fee theo tỷ lệ (tùy chọn) hoặc giữ nguyên fullShippingFee
    // Để đơn giản, nếu đã chọn ít nhất 1 sản phẩm và < 1.000.000, áp dụng fullShippingFee
    return fullShippingFee
  })

  // Tính total dựa trên subtotal, discount và shippingFee của selectedItems
  const total = computed(() => {
    return Math.max(0, subtotal.value - discount.value + shippingFee.value - pointsDiscount.value)
  })

  const appliedVoucher = computed(() => cart.value?.appliedVoucher || null)

  const availablePoints = computed(() => memberPoints.value.available || cart.value?.availablePoints || 0)

  const hasItems = computed(() => cartItems.value.length > 0)

  // Actions
  const setPointsDiscount = (points, discountAmount) => {
    pointsUsed.value = points
    pointsDiscount.value = discountAmount
  }

  const setMemberPoints = ({ available, conversionRate, earnedRate }) => {
    memberPoints.value = {
      available: available || 0,
      conversionRate: conversionRate || 0,
      earnedRate: earnedRate || 0
    }
  }

  /**
   * Áp dụng điểm tích lũy
   */
  const applyPoints = (pointsToUse, conversionRate, maxAllowed) => {
    if (pointsToUse <= 0) {
      removePoints()
      return
    }

    // Validate points
    const actualPoints = Math.min(pointsToUse, maxAllowed)
    const discountAmount = actualPoints * conversionRate

    setPointsDiscount(actualPoints, discountAmount)
  }

  /**
   * Hủy dùng điểm
   */
  const removePoints = () => {
    pointsUsed.value = 0
    pointsDiscount.value = 0
  }

  /**
   * Lấy giỏ hàng từ backend
   */
  const fetchCart = async () => {
    loading.value = true
    error.value = null

    try {
      const khachHangId = getKhachHangId()
      if (!khachHangId) {
        cart.value = createEmptyCart()
        return
      }

      const response = await cartService.getCart(khachHangId)
      if (response.success) {
        // Preserve selected state khi fetch cart
        updateCartPreservingSelection(response.data)
        
        // Reset points if cart changes significantly (optional, but safer)
        // For now, keep points if total allows, otherwise re-validate in component watcher
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

      if (!ctspId) {
        throw new Error('ID sản phẩm không hợp lệ')
      }

      if (soLuong < 1) {
        throw new Error('Số lượng phải lớn hơn 0')
      }

      const response = await cartService.addToCart(khachHangId, {
        ctspId: ctspId,
        quantity: soLuong,
      })

      if (response.success !== false && response.data) {
        // Preserve selected state khi thêm sản phẩm
        updateCartPreservingSelection(response.data)
      } else if (response.success === false) {
        throw new Error(response.message || 'Không thể thêm sản phẩm')
      }
    } catch (err) {
      console.error('❌ Error adding to cart:', err)
      // Error handling logic reused...
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage || 'Không thể thêm sản phẩm'
      throw new Error(error.value)
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

      console.log('🔍 [cartStore] Updating cart item:', { itemId, quantity, khachHangId })
      const response = await cartService.updateCartItem(khachHangId, itemId, { quantity })

      if (response.success) {
        updateCartPreservingSelection(response.data)
        return { success: true }
      } else {
        throw new Error(response.message || 'Không thể cập nhật')
      }
    } catch (err) {
      console.error('❌ Error updating cart item:', err)
      console.error('❌ Error response:', err.response?.data)
      error.value = parseErrorMessage(err) || 'Không thể cập nhật'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  // ... (increaseQuantity, decreaseQuantity use updateCartItem)

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

      const itemToDelete = cartItems.value.find((i) => i.id === itemId)
      const ctspIdToDelete = itemToDelete?.ctspId || itemToDelete?.idCtsp || itemToDelete?.chiTietSanPhamId

      const selectedStateMap = saveSelectedState()
      selectedStateMap.delete(`id:${itemId}`)
      if (ctspIdToDelete) {
        selectedStateMap.delete(`ctsp:${ctspIdToDelete}`)
      }

      const response = await cartService.removeCartItem(khachHangId, itemId)

      if (response.success) {
        cart.value = response.data
        restoreSelectedState(selectedStateMap)
        return { success: true, message: 'Đã xóa sản phẩm khỏi giỏ hàng' }
      } else {
        throw new Error(response.message || 'Không thể xóa sản phẩm')
      }
    } catch (err) {
      console.error('❌ Error removing cart item:', err)
      error.value = parseErrorMessage(err) || 'Không thể xóa sản phẩm'
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
      if (!khachHangId) throw new Error('Vui lòng đăng nhập')
      if (!voucherCode?.trim()) throw new Error('Vui lòng nhập mã giảm giá')

      const response = await voucherService.applyVoucher(khachHangId, voucherCode.trim())
      
      let voucherData = response?.data || response
      
      if (voucherData && voucherData.success) {
        if (voucherData.updatedCart) {
          updateCartPreservingSelection(voucherData.updatedCart)
        }
        return {
          success: true,
          message: voucherData.message || 'Áp dụng mã giảm giá thành công',
          discountAmount: voucherData.discountAmount || 0,
        }
      } else {
        const errorMessage = voucherData?.message || 'Không thể áp dụng voucher'
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('❌ Error applying voucher:', err)
      const errorMessage = parseErrorMessage(err)
      error.value = errorMessage
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  /**
   * Xóa voucher
   */
  const removeVoucher = async () => {
    if (!cart.value) return

    const selectedStateMap = saveSelectedState()

    cart.value.appliedVoucher = null
    cart.value.discount = 0
    cart.value.total = cart.value.subtotal + cart.value.shippingFee

    try {
      await fetchCart()
      restoreSelectedState(selectedStateMap)
    } catch (err) {
      console.error('❌ Error refreshing cart after removing voucher:', err)
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
      error.value = parseErrorMessage(err) || 'Không thể xóa giỏ hàng'
    } finally {
      loading.value = false
    }
  }

  // Helper Functions
  const isAuthenticated = () => authService.isAuthenticated()
  const getKhachHangId = () => authService.getCustomerId()

  // Helper to parse error messages (extracted for reuse)
  const parseErrorMessage = (err) => {
    if (err.response?.data) {
      const data = err.response.data
      if (data.data?.message) return data.data.message
      if (data.message) return data.message
      if (data.errors) return Object.values(data.errors).join(', ')
    }
    return err.message
  }

  const saveSelectedState = () => {
    const selectedStateMap = new Map()
    if (cart.value?.items) {
      cart.value.items.forEach((item) => {
        if (item.selected) {
          if (item.id) selectedStateMap.set(`id:${item.id}`, true)
          const ctspId = item.ctspId || item.idCtsp || item.chiTietSanPhamId
          if (ctspId) selectedStateMap.set(`ctsp:${ctspId}`, true)
        }
      })
    }
    return selectedStateMap
  }

  const restoreSelectedState = (selectedStateMap) => {
    if (cart.value?.items && selectedStateMap?.size > 0) {
      cart.value.items.forEach((item) => {
        if (item.id && selectedStateMap.has(`id:${item.id}`)) {
          item.selected = true
          return
        }
        const ctspId = item.ctspId || item.idCtsp || item.chiTietSanPhamId
        if (ctspId && selectedStateMap.has(`ctsp:${ctspId}`)) {
          item.selected = true
        }
      })
    }
  }

  const updateCartPreservingSelection = (newCart) => {
    const selectedStateMap = saveSelectedState()
    cart.value = newCart
    restoreSelectedState(selectedStateMap)
  }

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
    pointsUsed,
    pointsDiscount,

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
    setPointsDiscount,
    applyPoints,
    removePoints, // NEW
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

    // Points
    memberPoints,
    pointsUsed,
    pointsDiscount,
    setMemberPoints,
    applyPoints,
    removePoints,
  }
})
