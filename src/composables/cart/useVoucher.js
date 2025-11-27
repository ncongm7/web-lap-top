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

      // Ưu tiên dùng API suggestions mới (đã bao gồm cả phiếu cá nhân)
      try {
        const response = await voucherService.getVoucherSuggestions(khachHangId, tongTienGioHang)
        if (response.success && response.data) {
          const suggestions = response.data || []

          // Tất cả suggestions từ API đều là available (đã được filter từ backend)
          // Phân loại dựa trên thông tin voucher
          availableVouchers.value = []
          unavailableVouchers.value = []
          personalVouchers.value = []

          suggestions.forEach(voucher => {
            // Voucher từ API suggestions đã được backend filter và đều hợp lệ
            // Không cần check lại điều kiện, chỉ phân loại theo riengTu
            const isPersonal = voucher.riengTu === true || voucher.riengTu === Boolean(true)

            // Đảm bảo voucher có trạng thái hợp lệ (vì đã được filter từ backend)
            // Thêm flag để biết voucher này đến từ suggestions API (đã được validate)
            const voucherWithFlag = {
              ...voucher,
              _fromSuggestions: true, // Flag để biết đã được validate từ backend
              trangThai: 1 // Đảm bảo trạng thái là 1 vì đã được filter
            }

            if (isPersonal) {
              // Phiếu cá nhân
              personalVouchers.value.push(voucherWithFlag)
            } else {
              // Phiếu công khai
              availableVouchers.value.push(voucherWithFlag)
            }
          })

          console.log('✅ [useVoucher] Đã tải', suggestions.length, 'voucher suggestions từ API mới')
          return
        }
      } catch (apiError) {
        console.warn('⚠️ API getVoucherSuggestions chưa có hoặc lỗi, dùng fallback:', apiError)
      }

      // Fallback: Dùng API getAllVouchers
      try {
        const response = await voucherService.getAllVouchers(khachHangId, tongTienGioHang)
        if (response.success && response.data) {
          availableVouchers.value = response.data.available || []
          unavailableVouchers.value = response.data.unavailable || []
          personalVouchers.value = response.data.personal || []
          return
        }
      } catch {
        console.warn('⚠️ API getAllVouchers chưa có, dùng fallback cũ')
      }

      // Fallback cuối: Lấy danh sách available và phân loại
      const response = await voucherService.getAvailableVouchers(khachHangId)
      if (response.success) {
        const allVouchers = response.data || []

        // Phân loại voucher
        availableVouchers.value = []
        unavailableVouchers.value = []
        personalVouchers.value = []

        allVouchers.forEach(voucher => {
          // Kiểm tra xem có phải phiếu cá nhân không
          const isPersonal = voucher.khachHangId !== null && voucher.khachHangId !== undefined

          if (isPersonal) {
            personalVouchers.value.push(voucher)
          }

          // Kiểm tra điều kiện sử dụng
          const canUse = checkVoucherConditions(voucher, tongTienGioHang)

          if (canUse.canUse) {
            if (isPersonal) {
              // Phiếu cá nhân dùng được
            } else {
              availableVouchers.value.push(voucher)
            }
          } else {
            // Thêm thông tin lý do không dùng được
            unavailableVouchers.value.push({
              ...voucher,
              reason: canUse.reason
            })
          }
        })
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

