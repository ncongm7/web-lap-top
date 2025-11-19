import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/customer/cartStore'
import voucherService from '@/service/customer/voucherService'

/**
 * Composable để quản lý voucher
 */
export function useVoucher() {
  const cartStore = useCartStore()
  const availableVouchers = ref([])
  const loading = ref(false)

  // Computed từ cart store
  const appliedVoucher = computed(() => cartStore.appliedVoucher)
  const discountAmount = computed(() => cartStore.discount)

  // Fetch available vouchers
  const fetchAvailableVouchers = async () => {
    loading.value = true
    try {
      const response = await voucherService.getAvailableVouchers()
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

  // Apply voucher
  const applyVoucher = async (voucherCode) => {
    const result = await cartStore.applyVoucher(voucherCode)
    return result
  }

  // Remove voucher
  const removeVoucher = async () => {
    await cartStore.removeVoucher()
  }

  // Auto fetch on mount (optional)
  const init = () => {
    fetchAvailableVouchers()
  }

  return {
    // State
    availableVouchers,
    loading,

    // Computed
    appliedVoucher,
    discountAmount,

    // Methods
    fetchAvailableVouchers,
    applyVoucher,
    removeVoucher,
    init,
  }
}

