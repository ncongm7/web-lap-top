<template>
  <div class="payment-steps-checklist">
    <div 
      v-for="(step, index) in steps" 
      :key="index"
      class="step-item"
      :class="{ 
        'completed': index < currentStep,
        'active': index === currentStep - 1,
        'pending': index >= currentStep
      }"
    >
      <div class="step-icon">
        <transition name="checkmark">
          <i v-if="index < currentStep" class="bi bi-check-circle-fill check-icon"></i>
          <span v-else class="step-number">{{ index + 1 }}</span>
        </transition>
      </div>
      <div class="step-content">
        <h6 class="step-title">{{ step.title }}</h6>
        <p class="step-description">{{ step.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  currentStep: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 4
  }
})

const steps = [
  {
    title: 'Mở app ngân hàng',
    description: 'Mở ứng dụng ngân hàng trên điện thoại của bạn'
  },
  {
    title: 'Quét mã QR',
    description: 'Sử dụng tính năng quét QR trong app để quét mã bên dưới'
  },
  {
    title: 'Kiểm tra thông tin',
    description: 'Nhập đúng số tiền và nội dung chuyển khoản (mã đơn hàng)'
  },
  {
    title: 'Xác nhận thanh toán',
    description: 'Xác nhận và hoàn tất giao dịch chuyển khoản'
  }
]
</script>

<style scoped>
.payment-steps-checklist {
  margin-bottom: 2rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: #f8f9fa;
  border: 2px solid transparent;
}

.step-item.active {
  background-color: #e7f5ff;
  border-color: #0d6efd;
  animation: pulse 2s infinite;
}

.step-item.completed {
  background-color: #d1e7dd;
  border-color: #198754;
}

.step-item.pending {
  background-color: #f8f9fa;
  opacity: 0.7;
}

.step-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #ffffff;
  font-weight: bold;
  transition: all 0.3s ease;
}

.step-item.active .step-icon {
  background-color: #0d6efd;
  color: #ffffff;
  transform: scale(1.1);
}

.step-item.completed .step-icon {
  background-color: #198754;
  color: #ffffff;
}

.step-item.pending .step-icon {
  background-color: #dee2e6;
  color: #6c757d;
}

.step-number {
  font-size: 1.1rem;
  color: inherit;
}

.check-icon {
  font-size: 1.5rem;
  color: #ffffff;
}

.step-content {
  flex: 1;
}

.step-title {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
  color: #212529;
}

.step-item.completed .step-title {
  color: #198754;
}

.step-item.active .step-title {
  color: #0d6efd;
}

.step-description {
  margin: 0;
  font-size: 0.875rem;
  color: #6c757d;
  line-height: 1.5;
}

.step-item.completed .step-description {
  color: #198754;
}

.step-item.active .step-description {
  color: #0d6efd;
}

/* Animations */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(13, 110, 253, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(13, 110, 253, 0);
  }
}

.checkmark-enter-active {
  transition: all 0.3s ease;
}

.checkmark-enter-from {
  opacity: 0;
  transform: scale(0) rotate(-180deg);
}

.checkmark-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

/* Responsive */
@media (max-width: 768px) {
  .step-item {
    padding: 0.75rem;
  }

  .step-icon {
    width: 36px;
    height: 36px;
  }

  .step-title {
    font-size: 0.95rem;
  }

  .step-description {
    font-size: 0.8rem;
  }
}
</style>






