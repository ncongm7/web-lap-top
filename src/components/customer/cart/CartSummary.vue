<template>
  <div class="cart-summary-card">
    <h3 class="summary-title">Tổng quan đơn hàng</h3>

    <!-- Points Info -->
    <div v-if="memberPoints.available > 0 || pointsEarned > 0" class="points-info-card">
      <div class="points-header">
        <div class="points-icon">🎁</div>
        <div class="points-title">Ưu đãi thành viên</div>
      </div>

      <div v-if="memberPoints.available > 0" class="points-row">
        <span>Điểm hiện có:</span>
        <span class="points-value">{{ formatPoints(memberPoints.available) }}</span>
      </div>

      <div v-if="pointsEarned > 0" class="points-row earned">
        <span>Tích lũy đơn này:</span>
        <span class="points-value">
          +{{ formatPoints(pointsEarned) }} điểm
        </span>
      </div>
    </div>

    <div class="summary-content">
      <!-- Subtotal -->
      <div class="summary-row">
        <span class="label">Tạm tính:</span>
        <span class="value">{{ formatPrice(subtotal) }}</span>
      </div>

      <!-- Discount -->
      <div v-if="discount > 0" class="summary-row discount">
        <span class="label">
          Giảm giá
          <span v-if="appliedVoucher" class="voucher-tag">{{ appliedVoucher.ma }}</span>
        </span>
        <span class="value">-{{ formatPrice(discount) }}</span>
      </div>

      <!-- Points Discount -->
      <div v-if="pointsDiscount > 0" class="summary-row points-discount">
        <span class="label">
          <span class="icon">💎</span> Điểm thưởng ({{ formatPoints(pointsUsed) }})
        </span>
        <span class="value">-{{ formatPrice(pointsDiscount) }}</span>
      </div>




      <div class="divider"></div>

      <!-- Total -->
      <div class="summary-row total">
        <span class="label">Tổng cộng:</span>
        <div class="total-wrapper">
           <span class="value">{{ formatPrice(total) }}</span>
           <span class="vat-text">(Đã bao gồm VAT)</span>
        </div>
      </div>
    </div>

    <!-- Checkout Button -->
    <button @click="handleCheckout" class="checkout-btn" :disabled="!canCheckout || loading || isOverLimit">
      <span v-if="loading" class="spinner"></span>
      <span>{{ loading ? 'Đang xử lý...' : 'Tiến hành thanh toán' }}</span>
    </button>
    <div v-if="isOverLimit" class="limit-warning">
      ⚠️ Quá giới hạn: {{ totalSelectedQty }}/2 sản phẩm
    </div>

    <!-- Policies -->
    <div class="policies-list">
       <div class="policy-item">
         <span class="icon">🛡️</span> Bảo hành chính hãng
       </div>
       <div class="policy-item">
         <span class="icon">🚚</span> Freeship đơn từ 1tr
       </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '@/composables/cart/useCart'

const {
  subtotal,
  discount,
  pointsDiscount,
  pointsUsed,
  memberPoints,
  shippingFee,
  total,
  appliedVoucher,
  selectedItems,
  loading,
  checkout,
} = useCart()

// Calculate points earned based on current cart total
const pointsEarned = computed(() => {
  const rate = memberPoints.value?.earnedRate || 0
  if (rate <= 0) return 0

  // Calculate based on total after discount (excluding points usage itself usually, but keeping logic consistent)
  // Logic: Earn points on the amount effectively paid (subtotal - discount)
  // If points are used, usually earn on the REMAINING amount.
  // Using (subtotal - discount - pointsDiscount) is safer for business
  // But let's stick to safe max(0, ...)
  const paidAmount = Math.max(0, subtotal.value - discount.value - pointsDiscount.value)
  return Math.floor(paidAmount / rate)
})

const canCheckout = computed(() => selectedItems.value.length > 0 && total.value > 0)
const totalSelectedQty = computed(() => selectedItems.value.reduce((sum, item) => sum + item.quantity, 0))
const isOverLimit = computed(() => totalSelectedQty.value > 2)

const handleCheckout = () => {
  checkout()
}

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
.cart-summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 100px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin-top: 0;
  margin-bottom: 20px;
}

/* Points Card */
.points-info-card {
  background: linear-gradient(to right, #fffbeb, #fef3c7);
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.points-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.points-title {
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
}

.points-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #78350f;
  margin-bottom: 4px;
}

.points-row.earned {
  color: #15803d;
  font-weight: 500;
  border-top: 1px dashed #fcd34d;
  padding-top: 4px;
  margin-top: 4px;
}

.points-value {
  font-weight: 600;
}

/* Summary Rows */
.summary-content {
  margin-bottom: 24px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
  color: #64748b;
}

.summary-row .value {
  color: #0f172a;
  font-weight: 500;
}

.voucher-tag {
  background: #ecfdf5;
  color: #10b981;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-left: 6px;
}

.summary-row.discount .value,
.summary-row.points-discount .value {
  color: #10b981;
}

.summary-row .value.free {
  color: #10b981;
  font-weight: 600;
}

.divider {
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0;
}

.summary-row.total {
  align-items: flex-start;
  margin-bottom: 0;
}

.summary-row.total .label {
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.total-wrapper {
  text-align: right;
}

.summary-row.total .value {
  font-size: 20px;
  font-weight: 700;
  color: #dc2626;
  display: block;
}

.vat-text {
  font-size: 11px;
  color: #94a3b8;
  display: block;
  font-weight: 400;
}

/* Checkout Button */
.checkout-btn {
  width: 100%;
  padding: 14px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.checkout-btn:hover:not(:disabled) {
  background: #b91c1c;
}

.checkout-btn:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.limit-warning {
  margin-top: 8px;
  color: #ef4444;
  font-size: 13px;
  text-align: center;
  background: #fef2f2;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #fee2e2;
}

/* Policies */
.policies-list {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.policy-item {
  font-size: 12px;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .cart-summary-card {
    position: static;
    margin-top: 20px;
  }
}
</style>
