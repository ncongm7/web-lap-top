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

  const availablePoints = computed(() => cart.value?.availablePoints || 0)

  const hasItems = computed(() => cartItems.value.length > 0)

  // Actions
  const setPointsDiscount = (points, discountAmount) => {
    pointsUsed.value = points
    pointsDiscount.value = discountAmount
  }

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
        // Preserve selected state khi fetch cart
        updateCartPreservingSelection(response.data)
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

      // Assuming the service returns the updated cart directly
      // And assuming the response structure from service is just the data
      if (response.success !== false && response.data) {
        // Preserve selected state khi thêm sản phẩm
        updateCartPreservingSelection(response.data)
      } else if (response.success === false) {
        throw new Error(response.message || 'Không thể thêm sản phẩm')
      }
    } catch (err) {
      console.error('❌ Error adding to cart:', err)
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      })

      // Parse error message từ nhiều nguồn
      let errorMessage = 'Không thể thêm sản phẩm vào giỏ hàng'

      if (err.response?.data) {
        const errorData = err.response.data
        // Nếu là ResponseObject với message
        if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.data?.message) {
          errorMessage = errorData.data.message
        }
        // Nếu là validation error từ Spring
        else if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.map((e) => e.defaultMessage || e.message).join(', ')
        }
      } else if (err.message) {
        errorMessage = err.message
      }

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
        // Preserve selected state khi cập nhật số lượng
        updateCartPreservingSelection(response.data)
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

      // Tìm item trước khi xóa để lấy ctspId
      const itemToDelete = cartItems.value.find((i) => i.id === itemId)
      const ctspIdToDelete =
        itemToDelete?.ctspId || itemToDelete?.idCtsp || itemToDelete?.chiTietSanPhamId

      // Preserve selected state khi xóa sản phẩm (trừ item bị xóa)
      const selectedStateMap = saveSelectedState()
      // Xóa item bị xóa khỏi map (cả ID và ctspId)
      selectedStateMap.delete(`id:${itemId}`)
      if (ctspIdToDelete) {
        selectedStateMap.delete(`ctsp:${ctspIdToDelete}`)
      }

      const response = await cartService.removeCartItem(khachHangId, itemId)

      if (response.success) {
        cart.value = response.data
        // Restore selected state (không restore item đã bị xóa)
        restoreSelectedState(selectedStateMap)
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

      if (!voucherCode || !voucherCode.trim()) {
        throw new Error('Vui lòng nhập mã giảm giá')
      }

      const response = await voucherService.applyVoucher(khachHangId, voucherCode.trim())
      console.log('🔍 [cartStore] applyVoucher response:', response)

      // Parse response structure: ResponseObject<VoucherApplyResponse>
      // Structure: { success: true, data: VoucherApplyResponse, message: "..." }
      // VoucherApplyResponse: { success: true/false, message: "...", discountAmount: ..., updatedCart: ... }

      let voucherData = null
      if (response?.data) {
        // response.data là VoucherApplyResponse
        voucherData = response.data
      } else if (response) {
        // Nếu response là VoucherApplyResponse trực tiếp
        voucherData = response
      }

      if (voucherData && voucherData.success) {
        // Cập nhật cart từ updatedCart trong response
        // QUAN TRỌNG: Preserve selected state của các items
        if (voucherData.updatedCart) {
          updateCartPreservingSelection(voucherData.updatedCart)
        }
        return {
          success: true,
          message: voucherData.message || 'Áp dụng mã giảm giá thành công',
          discountAmount: voucherData.discountAmount || 0,
        }
      } else {
        // Voucher không hợp lệ hoặc có lỗi
        const errorMessage =
          voucherData?.message || response?.message || 'Không thể áp dụng voucher'
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error('❌ Error applying voucher:', err)
      console.error('❌ Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        fullResponse: err.response,
      })

      // Parse error message từ nhiều nguồn
      let errorMessage = 'Không thể áp dụng voucher'

      if (err.response?.data) {
        const errorData = err.response.data
        console.log('🔍 Error data structure:', JSON.stringify(errorData, null, 2))

        // 1. Nếu là ResponseObject với success = false (từ controller line 52)
        // Structure: { success: false, data: VoucherApplyResponse, message: "..." }
        if (errorData.data && typeof errorData.data === 'object') {
          // errorData.data là VoucherApplyResponse
          if (errorData.data.message) {
            errorMessage = errorData.data.message
          } else if (errorData.message) {
            errorMessage = errorData.message
          }
        }
        // 2. Nếu là ApiException từ GlobalExceptionHandler
        // Structure: { status: "FAILED", code: "...", message: "..." }
        else if (errorData.status === 'FAILED' && errorData.message) {
          errorMessage = errorData.message
        }
        // 3. Nếu là validation error từ Spring (@Valid) - GlobalExceptionHandler
        // Structure: { status: "FAILED", code: "VALIDATION_ERROR", errors: {...} }
        else if (errorData.status === 'FAILED' && errorData.errors) {
          const errorMessages = Object.values(errorData.errors)
          errorMessage =
            errorMessages.length > 0 ? errorMessages.join(', ') : 'Dữ liệu không hợp lệ'
        }
        // 4. Nếu là ResponseObject trực tiếp
        else if (errorData.message) {
          errorMessage = errorData.message
        }
        // 5. Fallback: lấy từ code hoặc error
        else if (errorData.code || errorData.error) {
          errorMessage = errorData.message || errorData.error || 'Lỗi từ server'
        }
      } else if (err.message) {
        errorMessage = err.message
      }

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

    // Lưu selected state hiện tại của các items
    const selectedStateMap = saveSelectedState()

    // Cập nhật local state trước
    cart.value.appliedVoucher = null
    cart.value.discount = 0
    cart.value.total = cart.value.subtotal + cart.value.shippingFee

    // Refresh cart từ backend để đồng bộ
    try {
      await fetchCart()

      // Restore selected state sau khi fetch
      restoreSelectedState(selectedStateMap)
    } catch (err) {
      console.error('❌ Error refreshing cart after removing voucher:', err)
      // Nếu refresh fail, vẫn giữ state local đã cập nhật
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
   * Lưu selected state của các items hiện tại
   * Sử dụng cả ID và ctspId để matching chính xác hơn
   */
  const saveSelectedState = () => {
    const selectedStateMap = new Map()
    if (cart.value?.items) {
      cart.value.items.forEach((item) => {
        if (item.selected) {
          // Lưu theo ID (ưu tiên)
          if (item.id) {
            selectedStateMap.set(`id:${item.id}`, true)
          }
          // Lưu theo ctspId (fallback nếu ID thay đổi)
          const ctspId = item.ctspId || item.idCtsp || item.chiTietSanPhamId
          if (ctspId) {
            selectedStateMap.set(`ctsp:${ctspId}`, true)
          }
        }
      })
    }
    return selectedStateMap
  }

  /**
   * Restore selected state cho các items
   * Match theo cả ID và ctspId để đảm bảo chính xác
   */
  const restoreSelectedState = (selectedStateMap) => {
    if (cart.value?.items && selectedStateMap && selectedStateMap.size > 0) {
      cart.value.items.forEach((item) => {
        // Kiểm tra theo ID trước
        if (item.id && selectedStateMap.has(`id:${item.id}`)) {
          item.selected = true
          return
        }
        // Fallback: kiểm tra theo ctspId
        const ctspId = item.ctspId || item.idCtsp || item.chiTietSanPhamId
        if (ctspId && selectedStateMap.has(`ctsp:${ctspId}`)) {
          item.selected = true
        }
      })
    }
  }

  /**
   * Cập nhật cart và preserve selected state
   */
  const updateCartPreservingSelection = (newCart) => {
    const selectedStateMap = saveSelectedState()
    cart.value = newCart
    restoreSelectedState(selectedStateMap)
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
