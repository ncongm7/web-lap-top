import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/customer/cartStore'
import { useAuthStore } from '@/stores/customer/authStore'
import voucherService from '@/service/customer/voucherService'
import authService from '@/service/customer/authService'

/**
 * Composable để quản lý voucher
 */
export function useVoucher() {
  const cartStore = useCartStore()
  const authStore = useAuthStore()
  // const availableVouchers = ref([]) // REMOVED
  // const unavailableVouchers = ref([]) // REMOVED
  // const personalVouchers = ref([]) // REMOVED
  const allVouchers = ref([]) // NEW: Store raw list
  const loading = ref(false)

  // Computed từ cart store
  const appliedVoucher = computed(() => cartStore.appliedVoucher)
  const discountAmount = computed(() => cartStore.discount)
  const cartSubtotal = computed(() => cartStore.subtotal || 0)

  // Computed: Phân loại voucher dựa trên allVouchers và cartSubtotal hiện tại
  const processedVouchers = computed(() => {
    const tongTien = cartSubtotal.value
    return allVouchers.value.map(voucher => {
      const check = checkVoucherConditions(voucher, tongTien)
      return {
        ...voucher,
        canUse: check.canUse,
        reason: check.reason
      }
    })
  })

  // Computed: List vouchers
  const personalVouchers = computed(() => {
    return processedVouchers.value.filter(v => v.riengTu === true || v.riengTu === 1)
  })

  const availableVouchers = computed(() => {
    return processedVouchers.value.filter(v => {
      const isPersonal = v.riengTu === true || v.riengTu === 1
      return !isPersonal && v.canUse
    })
  })

  const unavailableVouchers = computed(() => {
    return processedVouchers.value.filter(v => {
      const isPersonal = v.riengTu === true || v.riengTu === 1
      return !isPersonal && !v.canUse
    })
  })

  // Fetch available vouchers (API cũ - có thể giữ hoặc bỏ nếu không dùng)
  const fetchAvailableVouchers = async () => {
    // ... (Keep existing or deprecated)
    // Logic này update availableVouchers ref cũ, nhưng giờ ta dùng computed.
    // Nếu component gọi hàm này, nó sẽ không update allVouchers.
    // Tốt nhất nên chuyển sang dùng fetchAllVouchers hoặc update allVouchers ở đây.
    // Tuy nhiên, context component VoucherInput.vue dùng fetchAllVouchers.
  }

  // Fetch all vouchers (available, unavailable, personal)
  const fetchAllVouchers = async () => {
    loading.value = true
    try {
      const khachHangId = authStore.getCustomerId() || authService.getCustomerId()

      // Request backend lấy tất cả voucher
      const VERY_HIGH_VALUE = 999999999
      const response = await voucherService.getVoucherSuggestions(khachHangId, VERY_HIGH_VALUE)

      if (response.success && response.data) {
        allVouchers.value = response.data || []
        console.log(`📦 Nhận được ${allVouchers.value.length} vouchers từ backend`)
      }
    } catch (error) {
      console.error('❌ Error fetching all vouchers:', error)
      allVouchers.value = []
    } finally {
      loading.value = false
    }
  }

  // Helper function
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price || 0)
  }

  // Kiểm tra điều kiện sử dụng voucher
  const checkVoucherConditions = (voucher, tongTienGioHang) => {
    // Nếu voucher đến từ suggestions API, đã được backend validate đầy đủ
    // Chỉ check lại điều kiện đơn tối thiểu (có thể thay đổi khi giỏ hàng thay đổi)
    if (voucher._fromSuggestions) {
      const reasons = []

      // Chỉ check đơn tối thiểu (có thể thay đổi khi giỏ hàng thay đổi)
      if (voucher.hoaDonToiThieu && tongTienGioHang < voucher.hoaDonToiThieu) {
        reasons.push(`Đơn tối thiểu ${formatPrice(voucher.hoaDonToiThieu)}`)
      }

      return {
        canUse: reasons.length === 0,
        reason: reasons.length > 0 ? reasons.join(', ') : null
      }
    }

    // Với voucher từ API cũ, check đầy đủ điều kiện
    const reasons = []

    // Kiểm tra đơn tối thiểu
    if (voucher.hoaDonToiThieu && tongTienGioHang < voucher.hoaDonToiThieu) {
      reasons.push(`Đơn tối thiểu ${formatPrice(voucher.hoaDonToiThieu)}`)
    }

    // Kiểm tra ngày hết hạn
    if (voucher.ngayKetThuc) {
      const endDate = new Date(voucher.ngayKetThuc)
      const now = new Date()
      if (endDate < now) {
        reasons.push('Đã hết hạn')
      }
    }

    // Kiểm tra ngày bắt đầu
    if (voucher.ngayBatDau) {
      const startDate = new Date(voucher.ngayBatDau)
      const now = new Date()
      if (startDate > now) {
        reasons.push('Chưa đến thời gian áp dụng')
      }
    }

    // Kiểm tra số lượng đã dùng
    if (voucher.soLuong && voucher.soLuongDaDung >= voucher.soLuong) {
      reasons.push('Đã hết lượt sử dụng')
    }

    // Kiểm tra trạng thái
    if (voucher.trangThai !== 1 && voucher.trangThai !== true) {
      reasons.push('Phiếu giảm giá không hoạt động')
    }

    return {
      canUse: reasons.length === 0,
      reason: reasons.length > 0 ? reasons.join(', ') : null
    }
  }

  // Apply voucher
  const applyVoucher = async (voucherCode) => {
    const result = await cartStore.applyVoucher(voucherCode)
    return result
  }

  // Remove voucher
  const removeVoucher = async () => {
    await cartStore.removeVoucher()
  }

  // Auto fetch on mount (optional) - được export và dùng trong component
  const initVoucher = () => {
    fetchAllVouchers() // Dùng fetchAllVouchers để lấy tất cả voucher
  }

  return {
    // State
    availableVouchers,
    unavailableVouchers,
    personalVouchers,
    loading,

    // Computed
    appliedVoucher,
    discountAmount,
    cartSubtotal,

    // Methods
    fetchAvailableVouchers,
    fetchAllVouchers,
    applyVoucher,
    removeVoucher,
    checkVoucherConditions,
    init: initVoucher, // Export init function để component có thể gọi
  }
}

