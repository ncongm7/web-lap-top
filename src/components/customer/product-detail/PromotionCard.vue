<template>
  <div v-if="promotion" class="promotion-section">
    <div class="promotion-header">
      <svg viewBox="0 0 24 24" fill="currentColor" class="promotion-icon">
        <path
          d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"
        />
      </svg>
      <div>
        <div class="promotion-title">{{ promotion.tenKm }}</div>
        <div class="promotion-subtitle">{{ promotion.moTa || 'Áp dụng khi mua sản phẩm này' }}</div>
      </div>
    </div>

    <div class="promotion-content">
      <div class="promotion-discount">
        <span class="discount-badge" :class="{ 'flash-sale': promotion.isFlashSale }">
          {{ promotion.phanTramGiam }}% GIẢM
        </span>
        <span v-if="promotion.isFlashSale" class="flash-sale-label">FLASH SALE</span>
      </div>

      <div v-if="promotion.isFlashSale && promotion.ngayKetThuc" class="countdown-section">
        <CountdownTimer :end-date="promotion.ngayKetThuc" />
      </div>

      <ul class="promotion-list">
        <li v-if="promotion.phanTramGiam">
          <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Giảm {{ promotion.phanTramGiam }}% cho sản phẩm này
        </li>
        <li v-if="promotion.soTienGiamToiDa">
          <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
          </svg>
          Giảm tối đa {{ formatPrice(promotion.soTienGiamToiDa) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CountdownTimer from '@/components/customer/common/CountdownTimer.vue'

const props = defineProps({
  promotion: {
    type: Object,
    default: null,
  },
})

const formatPrice = (price) => {
  if (!price) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}
</script>

<style scoped>
.promotion-section {
  background: linear-gradient(180deg, #fffef8 0%, #ffffff 100%);
  border: 1px solid rgba(255, 215, 0, 0.25);
  border-radius: 12px;
  padding: 1rem 1rem;
  box-shadow: 0 6px 18px rgba(255, 193, 7, 0.06);
  margin-top: 1.5rem;
}

.promotion-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.75rem;
  align-items: center;
}

.promotion-icon {
  width: 32px;
  height: 32px;
  color: #f59e0b;
}

.promotion-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.promotion-subtitle {
  font-size: 12px;
  color: #6b7280;
}

.promotion-content {
  margin-top: 12px;
}

.promotion-discount {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.discount-badge {
  background: #2563eb;
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
}

.discount-badge.flash-sale {
  background: #ef4444;
  animation: pulse 2s infinite;
}

.flash-sale-label {
  background: #fbbf24;
  color: #1a1a1a;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
}

.countdown-section {
  margin-bottom: 12px;
  padding: 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
}

.promotion-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.promotion-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #374151;
}

.check-icon {
  width: 18px;
  height: 18px;
  color: #10b981;
  flex-shrink: 0;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
