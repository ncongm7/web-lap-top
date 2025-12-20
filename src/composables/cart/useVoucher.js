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
  const availableVouchers = ref([])
  const unavailableVouchers = ref([])
  const personalVouchers = ref([])
  const loading = ref(false)

  // Computed từ cart store
  const appliedVoucher = computed(() => cartStore.appliedVoucher)
  const discountAmount = computed(() => cartStore.discount)
  const cartSubtotal = computed(() => cartStore.subtotal || 0)

  // Fetch available vouchers
  const fetchAvailableVouchers = async () => {
    loading.value = true
    try {
      const khachHangId = authStore.getCustomerId() || authService.getCustomerId()
      const response = await voucherService.getAvailableVouchers(khachHangId)
      if (response.success) {
        availableVouchers.value = response.data || []
      }
    } catch (error) {
      console.error('❌ Error fetching vouchers:', error)
      availableVouchers.value = []
    } finally {
      loading.value = false
    }
  }

  // Fetch all vouchers (available, unavailable, personal)
  const fetchAllVouchers = async () => {
    loading.value = true
    try {
      const khachHangId = authStore.getCustomerId() || authService.getCustomerId()
      const tongTienGioHang = cartSubtotal.value

      // WORKAROUND: Backend filter voucher dựa trên tongTienGioHang
      // Để lấy TẤT CẢ voucher (kể cả chưa đủ điều kiện), ta truyền giá trị rất lớn
      // Sau đó frontend sẽ tự phân loại dựa trên tongTienGioHang thực tế
      const VERY_HIGH_VALUE = 999999999
      const response = await voucherService.getVoucherSuggestions(khachHangId, VERY_HIGH_VALUE)
      
      if (response.success && response.data) {
        const allVouchers = response.data || []

        // Reset arrays
        availableVouchers.value = []
        unavailableVouchers.value = []
        personalVouchers.value = []

        console.log(`📦 Nhận được ${allVouchers.length} vouchers từ backend`)

        // Phân loại voucher dựa trên tongTienGioHang THỰC TẾ
        allVouchers.forEach(voucher => {
          // Kiểm tra xem có phải phiếu cá nhân không
          const isPersonal = voucher.riengTu === true || voucher.riengTu === 1

          // Check lại điều kiện với tổng tiền THỰC TẾ của giỏ hàng
          const check = checkVoucherConditions(voucher, tongTienGioHang)

          if (isPersonal) {
            // Phiếu cá nhân - luôn hiển thị trong tab Personal
            personalVouchers.value.push({
              ...voucher,
              reason: check.reason // Thêm reason nếu không dùng được
            })
          } else {
            // Phiếu công khai
            if (check.canUse) {
              availableVouchers.value.push(voucher)
            } else {
              unavailableVouchers.value.push({
                ...voucher,
                reason: check.reason
              })
            }
          }
        })

        console.log(`✅ Loaded vouchers: ${availableVouchers.value.length} available, ${unavailableVouchers.value.length} unavailable, ${personalVouchers.value.length} personal`)
      }
    } catch (error) {
      console.error('❌ Error fetching all vouchers:', error)
      availableVouchers.value = []
      unavailableVouchers.value = []
      personalVouchers.value = []
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

