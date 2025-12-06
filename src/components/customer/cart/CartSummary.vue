<template>
  <div class="cart-summary">
    <h3 class="summary-title">Tổng quan đơn hàng</h3>

    <!-- Points Info Card (if logged in) -->
    <div v-if="availablePoints > 0 || pointsEarned > 0" class="points-info-card">
      <div class="points-header">
        <div class="points-icon">⭐</div>
        <div class="points-title">Điểm tích lũy</div>
      </div>
      <div v-if="availablePoints > 0" class="points-current">
        <span class="points-label">Điểm hiện có:</span>
        <span class="points-value">{{ formatPoints(availablePoints) }}</span>
      </div>
      <div v-if="pointsEarned > 0" class="points-earned">
        <span class="points-label">Sẽ nhận được:</span>
        <span class="points-value earned">+{{ formatPoints(pointsEarned) }} điểm</span>
        <span class="points-note">(Sau khi thanh toán thành công)</span>
      </div>
      <div v-if="conversionRate > 0" class="points-rate">
        <span class="rate-text">1 điểm = {{ formatPrice(conversionRate) }}</span>
      </div>
    </div>

    <!-- Subtotal -->
    <div class="summary-row">
      <span class="summary-label">Tạm tính:</span>
      <span class="summary-value">{{ formatPrice(subtotal) }}</span>
    </div>

    <!-- Discount -->
    <div v-if="discount > 0" class="summary-row discount-row">
      <span class="summary-label">
        Giảm giá:
        <span v-if="appliedVoucher" class="voucher-code">({{ appliedVoucher.ma }})</span>
      </span>
      <span class="summary-value discount">-{{ formatPrice(discount) }}</span>
    </div>

    <!-- Points Discount -->
    <div v-if="pointsDiscount > 0" class="summary-row discount-row points-discount-row">
      <span class="summary-label">
        <span class="points-discount-icon">💎</span>
        Điểm đã sử dụng:
        <span class="points-used-badge">{{ formatPoints(pointsUsed) }}</span>
      </span>
      <span class="summary-value discount">-{{ formatPrice(pointsDiscount) }}</span>
    </div>

    <!-- Shipping -->
    <div class="summary-row">
      <span class="summary-label">Phí vận chuyển:</span>
      <span class="summary-value free">
        {{ shippingFee > 0 ? formatPrice(shippingFee) : 'Miễn phí' }}
      </span>
    </div>

    <div class="summary-divider"></div>

    <!-- Total -->
    <div class="summary-row total-row">
      <span class="summary-label">Tổng cộng:</span>
      <span class="summary-value total">{{ formatPrice(total) }}</span>
    </div>

    <!-- Selected Items Info -->
    <div v-if="selectedCount > 0" class="selected-info">
      <span class="selected-icon">✓</span>
      Đã chọn {{ selectedCount }} sản phẩm
    </div>

    <!-- Checkout Button -->
    <button @click="checkout" class="checkout-btn" :disabled="!canCheckout || loading">
      <span v-if="!loading">
        <span class="btn-icon">🛒</span>
        Tiến hành thanh toán
      </span>
      <span v-else>
        <span class="spinner"></span>
        Đang xử lý...
      </span>
    </button>

    <!-- Additional Info -->
    <div class="additional-info">
      <div class="info-item">
        <span class="info-icon">🚚</span>
        <span>Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ</span>
      </div>
      <div class="info-item">
        <span class="info-icon">💳</span>
        <span>Hỗ trợ thanh toán khi nhận hàng</span>
      </div>
      <div class="info-item">
        <span class="info-icon">🛡️</span>
        <span>Bảo hành chính hãng</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '@/composables/cart/useCart'
import { useCartStore } from '@/stores/customer/cartStore'
import { useAuthStore } from '@/stores/customer/authStore'
import { ref, onMounted } from 'vue'
import { tichDiemService } from '@/service/diem/tichDiemService'
import { quyDoiDiemService } from '@/service/diem/quyDoiDiemService'
import addressService from '@/service/customer/addressService'

// Dùng composable thay vì props/emits
const {
  subtotal,
  discount,
  pointsDiscount,
  shippingFee,
  total,
  appliedVoucher,
  selectedItems,
  loading,
  checkout,
} = useCart()

const cartStore = useCartStore()
const authStore = useAuthStore()

// Points data
const availablePoints = ref(0)
const conversionRate = ref(0) // tienTieuDiem - để tính discount
const pointsEarnedRate = ref(0) // tienTichDiem - để tính điểm sẽ được tích
const pointsEarned = computed(() => {
  if (pointsEarnedRate.value <= 0) return 0
  // Tính điểm sẽ được tích dựa trên tổng tiền sau giảm (không tính phần đã dùng điểm)
  const totalAfterDiscount = Math.max(0, subtotal.value - discount.value)
  return Math.floor(totalAfterDiscount / pointsEarnedRate.value)
})

const pointsUsed = computed(() => cartStore.pointsUsed)

// Load points data
const loadPointsData = async () => {
  const customerId = authStore.getCustomerId()
  if (!customerId) {
    availablePoints.value = 0
    return
  }

  try {
    // Lấy thông tin khách hàng để có UUID
    const customerInfo = await addressService.getCustomerById(customerId)
    const khachHang = customerInfo?.data?.data || customerInfo?.data || customerInfo
    const khachHangId = khachHang?.id || khachHang?.maKhachHang

    if (!khachHangId) {
      console.warn('⚠️ Không tìm thấy ID khách hàng cho userId:', customerId)
      availablePoints.value = 0
      return
    }

    // Load available points - backend sẽ tự động tạo ví điểm nếu chưa có
    try {
      const tichDiem = await tichDiemService.getTichDiemByUserId(khachHangId)
      availablePoints.value = tichDiem?.tongDiem || 0
    } catch (pointsError) {
      console.warn('⚠️ Không thể tải điểm tích lũy (có thể chưa có ví điểm):', pointsError)
      availablePoints.value = 0
    }

    // Load conversion rates
    try {
      const quyDoi = await quyDoiDiemService.getQuyDoiDiemDangHoatDong()
      if (quyDoi) {
        conversionRate.value = quyDoi.tienTieuDiem || 0 // Để tính discount
        pointsEarnedRate.value = quyDoi.tienTichDiem || 0 // Để tính điểm sẽ được tích
      } else {
        // Không có quy đổi điểm đang hoạt động
        console.warn('⚠️ Chưa có quy đổi điểm đang hoạt động trong hệ thống')
        conversionRate.value = 0
        pointsEarnedRate.value = 0
      }
    } catch (quyDoiError) {
      console.warn('⚠️ Không thể tải thông tin quy đổi điểm:', quyDoiError)
      conversionRate.value = 0
      pointsEarnedRate.value = 0
    }
  } catch (error) {
    console.error('❌ Lỗi khi tải thông tin điểm:', error)
    // Set default values để không break UI
    availablePoints.value = 0
    conversionRate.value = 0
    pointsEarnedRate.value = 0
  }
}

onMounted(() => {
  loadPointsData()
})

const selectedCount = computed(() => selectedItems.value.length)

const canCheckout = computed(() => {
  return selectedCount.value > 0 && total.value > 0
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatPoints = (points) => {
  return new Intl.NumberFormat('vi-VN').format(points)
}
</script>

<style scoped>
.cart-summary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 100px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 20px 0;
}

/* Points Info Card */
.points-info-card {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fbbf24;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 20px;
}

.points-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
}

.points-icon {
  font-size: 24px;
  line-height: 1;
}

.points-title {
  font-size: 16px;
  font-weight: 600;
  color: #92400e;
}

.points-current,
.points-earned {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.points-label {
  font-size: 13px;
  color: #78350f;
  font-weight: 500;
}

.points-value {
  font-size: 16px;
  font-weight: 700;
  color: #92400e;
}

.points-value.earned {
  color: #059669;
}

.points-note {
  font-size: 11px;
  color: #a16207;
  font-style: italic;
  margin-left: 8px;
}

.points-rate {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(146, 64, 14, 0.2);
}

.rate-text {
  font-size: 12px;
  color: #78350f;
  font-weight: 500;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-label {
  font-size: 14px;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 6px;
}

.voucher-code {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.points-discount-icon {
  font-size: 16px;
}

.points-used-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
}

.summary-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.summary-value.discount {
  color: #10b981;
  font-weight: 600;
}

.summary-value.free {
  color: #10b981;
  font-weight: 500;
}

.points-discount-row {
  background: #f0fdf4;
  padding: 10px 12px;
  border-radius: 8px;
  margin: 8px 0;
}

.summary-divider {
  height: 1px;
  background: #e5e7eb;
  margin: 16px 0;
}

.total-row {
  margin-bottom: 16px;
}

.total-row .summary-label {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.total-row .summary-value.total {
  font-size: 20px;
  font-weight: 700;
  color: #dc2626;
}

.selected-info {
  font-size: 13px;
  color: #6b7280;
  text-align: center;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px;
  background: #f9fafb;
  border-radius: 6px;
}

.selected-icon {
  color: #10b981;
  font-weight: 600;
}

.checkout-btn {
  width: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
}

.checkout-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
  transform: translateY(-1px);
}

.checkout-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  box-shadow: none;
  transform: none;
}

.btn-icon {
  font-size: 18px;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.additional-info {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-icon {
  font-size: 14px;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .cart-summary {
    position: static;
    margin-top: 20px;
  }
}

@media (max-width: 640px) {
  .points-info-card {
    padding: 12px;
  }

  .points-title {
    font-size: 14px;
  }

  .points-value {
    font-size: 14px;
  }
}
</style>
