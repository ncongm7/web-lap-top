<template>
  <div class="cart-summary">
    <h3 class="summary-title">Tổng quan đơn hàng</h3>

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
    <div v-if="selectedCount > 0" class="selected-info">Đã chọn {{ selectedCount }} sản phẩm</div>

    <!-- Checkout Button -->
    <button @click="checkout" class="checkout-btn" :disabled="!canCheckout || loading">
      <span v-if="!loading">Tiến hành thanh toán</span>
      <span v-else>Đang xử lý...</span>
    </button>

    <!-- Additional Info -->
    <div class="additional-info">
      <p>✓ Miễn phí vận chuyển cho đơn hàng trên 1.000.000đ</p>
      <p>✓ Hỗ trợ thanh toán khi nhận hàng</p>
      <p>✓ Bảo hành chính hãng</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '@/composables/cart/useCart'

// Dùng composable thay vì props/emits
const {
  subtotal,
  discount,
  shippingFee,
  total,
  appliedVoucher,
  selectedItems,
  loading,
  checkout,
} = useCart()

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
</script>

<style scoped>
.cart-summary {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  position: sticky;
  top: 100px;
}

.summary-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
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
}

.voucher-code {
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.summary-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.summary-value.discount {
  color: #10b981;
}

.summary-value.free {
  color: #10b981;
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
}

.checkout-btn {
  width: 100%;
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-bottom: 16px;
}

.checkout-btn:hover:not(:disabled) {
  background: #059669;
}

.checkout-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.additional-info {
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.additional-info p {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.additional-info p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .cart-summary {
    position: static;
    margin-top: 20px;
  }
}
</style>
