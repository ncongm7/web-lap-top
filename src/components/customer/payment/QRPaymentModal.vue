<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click.self="handleClose" @keydown.esc="handleClose">
        <div class="modal-container" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <!-- Header -->
          <div class="modal-header">
            <h4 id="modal-title" class="modal-title">Thanh toán QR</h4>
            <button 
              @click="handleClose" 
              class="close-btn"
              aria-label="Đóng modal"
              type="button"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
          
          <!-- Body -->
          <div class="modal-body">
            <!-- Checklist hướng dẫn -->
            <PaymentStepsChecklist :current-step="computedCurrentStep" />
            
            <!-- QR Code Display -->
            <QRPaymentDisplay 
              v-if="status !== 'confirmed' && status !== 'expired'"
              :qr-data="qrData" 
              :loading="loading"
              :error="error"
              :status="status"
              @retry="handleRetry"
              @expired="handleExpired"
            />
            
            <!-- Expired State -->
            <div v-if="status === 'expired'" class="alert alert-danger">
              <i class="bi bi-x-circle-fill me-2"></i>
              Mã QR đã hết hạn. Vui lòng thử lại.
              <button class="btn btn-sm btn-primary mt-2" @click="handleRetry">
                Tạo QR mới
              </button>
            </div>
            
            <!-- Success Message -->
            <Transition name="success">
              <div v-if="status === 'confirmed'" class="success-message">
                <div class="success-icon">
                  <i class="bi bi-check-circle-fill"></i>
                </div>
                <h5 class="success-title">Thanh toán thành công!</h5>
                <p class="success-text">Đơn hàng của bạn đang được xử lý. Vui lòng đợi trong giây lát.</p>
              </div>
            </Transition>
          </div>
          
          <!-- Footer -->
          <div class="modal-footer">
            <button 
              v-if="status !== 'confirmed'"
              @click="handleClose" 
              class="btn btn-secondary"
              type="button"
            >
              Đóng
            </button>
            <button 
              v-if="status === 'confirmed'" 
              @click="viewOrder" 
              class="btn btn-primary"
              type="button"
            >
              Xem đơn hàng
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import PaymentStepsChecklist from './PaymentStepsChecklist.vue'
import QRPaymentDisplay from './QRPaymentDisplay.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  qrData: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'pending' // pending | checking | confirmed | expired
  },
  orderId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'payment-confirmed', 'retry', 'expired'])

const router = useRouter()
let autoRedirectTimer = null

// Computed current step for checklist
const computedCurrentStep = computed(() => {
  if (props.status === 'confirmed') return 4
  if (props.status === 'checking') return 3
  if (props.qrData && !props.loading) return 2
  return 1
})

// Methods
const handleClose = () => {
  emit('close')
}

const handleRetry = () => {
  emit('retry')
}

const handleExpired = () => {
  emit('expired')
}

const viewOrder = () => {
  if (props.orderId) {
    router.push({ name: 'order-detail', params: { id: props.orderId } })
  } else {
    router.push({ name: 'orders' })
  }
  handleClose()
}

// Handle ESC key
const handleEscape = (e) => {
  if (e.key === 'Escape' && props.show) {
    handleClose()
  }
}

// Emit payment confirmed event
watch(() => props.status, (newStatus) => {
  if (newStatus === 'confirmed') {
    // Emit event để parent component (CheckoutPage) xử lý redirect (nếu cần)
    emit('payment-confirmed', { orderId: props.orderId })
    
    // Auto redirect after 2s to show success message
    if (autoRedirectTimer) clearTimeout(autoRedirectTimer)
    autoRedirectTimer = setTimeout(() => {
      viewOrder()
    }, 2000)
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  // Prevent body scroll when modal is open
  if (props.show) {
    document.body.style.overflow = 'hidden'
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
  if (autoRedirectTimer) {
    clearTimeout(autoRedirectTimer)
  }
})

watch(() => props.show, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background-color: #047857;
  color: white;
  border-radius: 12px 12px 0 0;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.close-btn:focus {
  outline: 2px solid rgba(255, 255, 255, 0.5);
  outline-offset: 2px;
}

.modal-body {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  background-color: #f8f9fa;
  border-radius: 0 0 12px 12px;
}

.btn {
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

.btn-primary {
  background-color: #047857;
  color: white;
}

.btn-primary:hover {
  background-color: #059669;
}

.success-message {
  text-align: center;
  padding: 2rem 1rem;
}

.success-icon {
  font-size: 4rem;
  color: #198754;
  margin-bottom: 1rem;
  animation: bounce 0.6s ease;
}

.success-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #198754;
  margin-bottom: 0.5rem;
}

.success-text {
  color: #6c757d;
  margin: 0;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

.success-enter-active {
  transition: all 0.4s ease;
}

.success-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header {
    border-radius: 0;
  }

  .modal-footer {
    border-radius: 0;
  }

  .modal-body {
    padding: 1rem;
  }
}
</style>

