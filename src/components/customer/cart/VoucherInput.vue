<template>
  <div class="voucher-section">
    <h3 class="voucher-title">🎁 Mã giảm giá</h3>

    <!-- Applied Voucher Display -->
    <div v-if="appliedVoucher" class="applied-voucher">
      <div class="voucher-info">
        <span class="voucher-code">{{ appliedVoucher.ma }}</span>
        <span class="voucher-discount">-{{ formatPrice(discountAmount) }}</span>
      </div>
      <button @click="removeVoucher" class="remove-btn" :disabled="loading">✕</button>
    </div>

    <!-- Voucher Input Form -->
    <div v-else class="voucher-input-form">
      <input v-model="voucherCode" type="text" placeholder="Nhập mã giảm giá" class="voucher-input" :disabled="loading"
        @keyup.enter="applyVoucher" />
      <button @click="applyVoucher" class="apply-btn" :disabled="!voucherCode.trim() || loading">
        {{ loading ? 'Đang xử lý...' : 'Áp dụng' }}
      </button>
    </div>

    <!-- Error/Success Message -->
    <div v-if="message" :class="['message', messageType]">
      {{ message }}
    </div>

    <!-- All Vouchers Section -->
    <div v-if="!appliedVoucher && (availableVouchers.length > 0 || unavailableVouchers.length > 0 || personalVouchers.length > 0)" class="available-vouchers">
      <button @click="showVouchers = !showVouchers" class="toggle-vouchers-btn">
        {{ showVouchers ? 'Ẩn' : 'Xem' }} mã giảm giá
        ({{ totalVouchersCount }})
      </button>

      <transition name="slide-down">
        <div v-if="showVouchers" class="vouchers-list">
          <!-- Phiếu giảm giá cá nhân -->
          <div v-if="personalVouchers.length > 0" class="voucher-category">
            <h4 class="voucher-category-title">
              <span class="category-icon">👤</span> Phiếu giảm giá của bạn
            </h4>
            <div v-for="voucher in personalVouchers" :key="`personal-${voucher.id}`"
              class="voucher-card voucher-card-personal"
              :class="{ 'voucher-card-disabled': !isVoucherUsable(voucher) }"
              @click="isVoucherUsable(voucher) && selectVoucher(voucher.ma)">
              <div class="voucher-card-header">
                <span class="voucher-card-code">{{ voucher.ma }}</span>
                <span class="voucher-card-discount">
                  {{ formatDiscount(voucher) }}
                </span>
              </div>
              <p class="voucher-card-name">{{ voucher.tenPhieuGiamGia }}</p>
              <p class="voucher-card-condition">
                Đơn tối thiểu: {{ formatPrice(voucher.hoaDonToiThieu || 0) }}
              </p>
              <p class="voucher-card-expiry">HSD: {{ formatDate(voucher.ngayKetThuc) }}</p>
              <p v-if="!isVoucherUsable(voucher)" class="voucher-card-reason">
                <span class="reason-icon">⚠️</span>
                {{ getVoucherReason(voucher) }}
              </p>
            </div>
          </div>

          <!-- Phiếu giảm giá khả dụng -->
          <div v-if="availableVouchers.length > 0" class="voucher-category">
            <h4 class="voucher-category-title">
              <span class="category-icon">✅</span> Có thể sử dụng
            </h4>
            <div v-for="voucher in availableVouchers" :key="`available-${voucher.id}`"
              class="voucher-card voucher-card-available"
              @click="selectVoucher(voucher.ma)">
              <div class="voucher-card-header">
                <span class="voucher-card-code">{{ voucher.ma }}</span>
                <span class="voucher-card-discount">
                  {{ formatDiscount(voucher) }}
                </span>
              </div>
              <p class="voucher-card-name">{{ voucher.tenPhieuGiamGia }}</p>
              <p class="voucher-card-condition">
                Đơn tối thiểu: {{ formatPrice(voucher.hoaDonToiThieu || 0) }}
              </p>
              <p class="voucher-card-expiry">HSD: {{ formatDate(voucher.ngayKetThuc) }}</p>
            </div>
          </div>

          <!-- Phiếu giảm giá không dùng được -->
          <div v-if="unavailableVouchers.length > 0" class="voucher-category">
            <h4 class="voucher-category-title">
              <span class="category-icon">❌</span> Không thể sử dụng
            </h4>
            <div v-for="voucher in unavailableVouchers" :key="`unavailable-${voucher.id}`"
              class="voucher-card voucher-card-unavailable">
              <div class="voucher-card-header">
                <span class="voucher-card-code">{{ voucher.ma }}</span>
                <span class="voucher-card-discount">
                  {{ formatDiscount(voucher) }}
                </span>
              </div>
              <p class="voucher-card-name">{{ voucher.tenPhieuGiamGia }}</p>
              <p class="voucher-card-condition">
                Đơn tối thiểu: {{ formatPrice(voucher.hoaDonToiThieu || 0) }}
              </p>
              <p class="voucher-card-expiry">HSD: {{ formatDate(voucher.ngayKetThuc) }}</p>
              <p class="voucher-card-reason">
                <span class="reason-icon">⚠️</span>
                {{ voucher.reason || 'Không đủ điều kiện sử dụng' }}
              </p>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCart } from '@/composables/cart/useCart'
import { useVoucher } from '@/composables/cart/useVoucher'

// Dùng composables thay vì props/emits
const { loading } = useCart()
const {
  availableVouchers,
  unavailableVouchers,
  personalVouchers,
  appliedVoucher,
  discountAmount,
  cartSubtotal,
  applyVoucher: applyVoucherFromComposable,
  removeVoucher: removeVoucherFromComposable,
  checkVoucherConditions,
  init: initVoucher,
} = useVoucher()

// Local state
const voucherCode = ref('')
const message = ref('')
const messageType = ref('') // 'success' or 'error'
const showVouchers = ref(false)

// Computed
const totalVouchersCount = computed(() => {
  return availableVouchers.value.length + unavailableVouchers.value.length + personalVouchers.value.length
})

// Initialize voucher on mount
onMounted(() => {
  initVoucher()
})

const applyVoucher = async () => {
  if (!voucherCode.value.trim()) return

  message.value = ''
  messageType.value = ''

  const result = await applyVoucherFromComposable(voucherCode.value.trim())

  if (result && result.success) {
    messageType.value = 'success'
    message.value = result.message || 'Áp dụng mã thành công'
    voucherCode.value = ''
  } else {
    messageType.value = 'error'
    message.value = result?.message || 'Không thể áp dụng mã giảm giá'
  }

  // Clear message after 3s
  setTimeout(() => {
    message.value = ''
  }, 3000)
}

const removeVoucher = async () => {
  await removeVoucherFromComposable()
  message.value = ''
  voucherCode.value = ''
}

const selectVoucher = (code) => {
  voucherCode.value = code
  showVouchers.value = false
  applyVoucher()
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const formatDiscount = (voucher) => {
  if (voucher.loaiPhieuGiamGia === 0) {
    return `-${voucher.giaTriGiamGia}%`
  } else {
    return `-${formatPrice(voucher.giaTriGiamGia)}`
  }
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  const d = new Date(date)
  return d.toLocaleDateString('vi-VN')
}

// Kiểm tra voucher có thể dùng được không
const isVoucherUsable = (voucher) => {
  const check = checkVoucherConditions(voucher, cartSubtotal.value)
  return check.canUse
}

// Lấy lý do không dùng được
const getVoucherReason = (voucher) => {
  const check = checkVoucherConditions(voucher, cartSubtotal.value)
  return check.reason || 'Không đủ điều kiện sử dụng'
}
</script>

<style scoped>
.voucher-section {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.voucher-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 16px 0;
}

/* Applied Voucher */
.applied-voucher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #dcfce7;
  border: 1px solid #86efac;
  border-radius: 8px;
}

.voucher-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.voucher-code {
  font-size: 14px;
  font-weight: 600;
  color: #15803d;
}

.voucher-discount {
  font-size: 13px;
  color: #16a34a;
}

.remove-btn {
  background: none;
  border: none;
  color: #dc2626;
  font-size: 18px;
  cursor: pointer;
  padding: 4px 8px;
  transition: opacity 0.2s;
}

.remove-btn:hover:not(:disabled) {
  opacity: 0.7;
}

.remove-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Voucher Input Form */
.voucher-input-form {
  display: flex;
  gap: 8px;
}

.voucher-input {
  flex: 1;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.voucher-input:focus {
  outline: none;
  border-color: #10b981;
}

.voucher-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.apply-btn {
  padding: 12px 24px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.apply-btn:hover:not(:disabled) {
  background: #059669;
}

.apply-btn:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Message */
.message {
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 13px;
}

.message.success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #86efac;
}

.message.error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

/* Available Vouchers */
.available-vouchers {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.toggle-vouchers-btn {
  width: 100%;
  padding: 10px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  transition: background 0.2s;
}

.toggle-vouchers-btn:hover {
  background: #e5e7eb;
}

.vouchers-list {
  margin-top: 12px;
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.voucher-card {
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.voucher-card:hover {
  background: #ffffff;
  border-color: #10b981;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.voucher-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.voucher-card-code {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.voucher-card-discount {
  font-size: 14px;
  font-weight: 600;
  color: #10b981;
}

.voucher-card-name {
  font-size: 13px;
  color: #4b5563;
  margin: 0 0 4px 0;
}

.voucher-card-condition,
.voucher-card-expiry {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar */
.vouchers-list::-webkit-scrollbar {
  width: 6px;
}

.vouchers-list::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.vouchers-list::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.vouchers-list::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Voucher Categories */
.voucher-category {
  margin-bottom: 20px;
}

.voucher-category:last-child {
  margin-bottom: 0;
}

.voucher-category-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.category-icon {
  font-size: 16px;
  display: inline-block;
}

/* Voucher Card Variants */
.voucher-card-available {
  border-color: #10b981;
  background: #f0fdf4;
}

.voucher-card-available:hover {
  border-color: #059669;
  background: #dcfce7;
}

.voucher-card-personal {
  border-color: #3b82f6;
  background: #eff6ff;
  position: relative;
}

.voucher-card-personal::before {
  content: 'CỦA BẠN';
  position: absolute;
  top: 8px;
  right: 8px;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.voucher-card-personal:hover:not(.voucher-card-disabled) {
  border-color: #2563eb;
  background: #dbeafe;
}

.voucher-card-unavailable {
  border-color: #d1d5db;
  background: #f9fafb;
  opacity: 0.7;
  cursor: not-allowed;
}

.voucher-card-disabled {
  opacity: 0.6;
  cursor: not-allowed;
  border-color: #d1d5db;
}

.voucher-card-reason {
  font-size: 12px;
  color: #dc2626;
  margin: 8px 0 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.reason-icon {
  font-size: 14px;
  display: inline-block;
}
</style>
