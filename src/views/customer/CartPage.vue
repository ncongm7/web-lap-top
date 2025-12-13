<template>
  <div class="cart-page">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <button @click="goBack" class="back-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="page-title">Giỏ hàng của bạn</h1>
      </div>

      <!-- Loading/Error States -->
      <div v-if="loading && !hasItems" class="state-container">
        <div class="spinner"></div>
        <p>Đang tải giỏ hàng...</p>
      </div>

      <div v-else-if="error && !hasItems" class="state-container">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="fetchCart" class="retry-btn">Thử lại</button>
      </div>

      <EmptyCart v-else-if="!hasItems" />

      <!-- Main Content -->
      <div v-else class="cart-grid">
        <!-- Left Column: Items -->
        <div class="cart-items-column">
          <div class="select-all-card">
            <label class="custom-checkbox select-all-label">
              <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
              <span class="checkmark"></span>
              <span class="text">Chọn tất cả ({{ cartCount }} sản phẩm)</span>
            </label>
            <button @click="clearCart" class="clear-btn">Xóa tất cả</button>
          </div>

          <div class="items-list">
            <CartItem v-for="item in cartItems" :key="item.id" :item-id="item.id" />
          </div>
        </div>

        <!-- Right Column: Sidebar -->
        <div class="cart-sidebar">
          <VoucherInput class="sidebar-section" />

          <!-- Points Section -->
          <PointsRedemption 
            v-if="memberPoints.available > 0"
            class="sidebar-section"
            v-model="pointsToUse"
            :available-points="memberPoints.available"
            :conversion-rate="memberPoints.conversionRate"
            :max-allowed-points="maxPointsAllowed"
            :loading="pointsLoading"
            @update:modelValue="handlePointsChange"
          />

          <CartSummary class="summary-section" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/cart/useCart'
import { useAuthStore } from '@/stores/customer/authStore'
import { tichDiemService } from '@/service/diem/tichDiemService'
import { quyDoiDiemService } from '@/service/diem/quyDoiDiemService'
import addressService from '@/service/customer/addressService'

// Components
import CartItem from '@/components/customer/cart/CartItem.vue'
import CartSummary from '@/components/customer/cart/CartSummary.vue'
import VoucherInput from '@/components/customer/cart/VoucherInput.vue'
import EmptyCart from '@/components/customer/cart/EmptyCart.vue'
import PointsRedemption from '@/components/customer/checkout/PointsRedemption.vue'

const router = useRouter()
const authStore = useAuthStore()

const {
  cartItems,
  cartCount,
  hasItems,
  loading,
  error,
  allSelected,
  fetchCart,
  toggleSelectAll,
  clearCart,
  subtotal,
  discount,
  memberPoints,
  setMemberPoints,
  applyPoints,
  removePoints,
  pointsUsed
} = useCart()

// Points Logic
const pointsLoading = ref(false)
const pointsToUse = ref(0) // Local state bound to PointsRedemption input

// Max points allowed logic
const maxPointsAllowed = computed(() => {
  const rate = memberPoints.value.conversionRate
  if (!rate) return 0
  
  // Total eligible for points payment = Subtotal - Voucher Discount
  const amountToPay = Math.max(0, subtotal.value - discount.value)
  const maxPointsByAmount = Math.floor(amountToPay / rate)
  
  return Math.min(memberPoints.value.available, maxPointsByAmount)
})

const handlePointsChange = (val) => {
  if (val > 0) {
    applyPoints(val, memberPoints.value.conversionRate, maxPointsAllowed.value)
  } else {
    removePoints()
  }
}

// Watch state to re-validate points
watch([subtotal, discount], () => {
  if (pointsUsed.value > maxPointsAllowed.value) {
    // Auto-adjust if total drops below points value
    const newPoints = maxPointsAllowed.value
    pointsToUse.value = newPoints
    if (newPoints > 0) {
       applyPoints(newPoints, memberPoints.value.conversionRate, maxPointsAllowed.value)
    } else {
       removePoints()
    }
  }
})

// Sync local input with store state (in case store is updated elsewhere)
watch(pointsUsed, (newVal) => {
  if (pointsToUse.value !== newVal) {
    pointsToUse.value = newVal
  }
})

const loadPointsData = async () => {
  const customerId = authStore.getCustomerId()
  if (!customerId) return

  pointsLoading.value = true
  try {
    // 1. Get Customer UUID
    const customerInfo = await addressService.getCustomerById(customerId)
    const khachHang = customerInfo?.data?.data || customerInfo?.data || customerInfo
    const khachHangId = khachHang?.id || khachHang?.maKhachHang

    if (!khachHangId) {
      console.warn('Cannot find KhachHangId')
      return
    }

    // 2. Fetch Data
    const [tichDiem, quyDoi] = await Promise.allSettled([
        tichDiemService.getTichDiemByUserId(khachHangId),
        quyDoiDiemService.getQuyDoiDiemDangHoatDong()
    ])
    
    // 3. Process Results
    const available = tichDiem.status === 'fulfilled' ? (tichDiem.value?.tongDiem || 0) : 0
    const conversionRate = (quyDoi.status === 'fulfilled' && quyDoi.value) ? (quyDoi.value.tienTieuDiem || 0) : 0
    const earnedRate = (quyDoi.status === 'fulfilled' && quyDoi.value) ? (quyDoi.value.tienTichDiem || 0) : 0

    // 4. Update Store
    setMemberPoints({
      available,
      conversionRate,
      earnedRate
    })

  } catch (err) {
    console.error('Error loading points data:', err)
  } finally {
    pointsLoading.value = false
  }
}

const goBack = () => router.back()

onMounted(async () => {
  await fetchCart()
  await loadPointsData()
  
  // Initialize local points input if store already has values (rare but possible on re-nav)
  pointsToUse.value = pointsUsed.value
})
</script>

<style scoped>
.cart-page {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 24px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.back-btn {
  background: white;
  border: 1px solid #e2e8f0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
}

.back-btn:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
}

/* Grid Layout */
.cart-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  align-items: start;
}

/* Left Column */
.cart-items-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.select-all-card {
  background: white;
  padding: 16px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.custom-checkbox {
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 12px;
}

.custom-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.custom-checkbox:hover .checkmark {
  border-color: #10b981;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #10b981;
  border-color: #10b981;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
}

.select-all-label .text {
  font-weight: 600;
  color: #0f172a;
  font-size: 15px;
}

.clear-btn {
  color: #ef4444;
  background: none;
  border: none;
  font-weight: 500;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #fee2e2;
}

.items-list {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

/* Sidebar */
.cart-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-section {
  width: 100%;
}

/* States */
.state-container {
  text-align: center;
  padding: 60px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 40px;
  margin-bottom: 16px;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-grid {
    grid-template-columns: 1fr;
  }
  
  .cart-sidebar {
    order: 2;
  }
  
  .cart-items-column {
    order: 1;
  }
}
</style>
