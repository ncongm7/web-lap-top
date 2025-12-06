<template>
    <div class="qr-payment-display">
        <!-- Loading State with Skeleton -->
        <div v-if="loading" class="loading-state">
            <div class="skeleton-qr"></div>
            <div class="skeleton-info"></div>
            <div class="spinner-wrapper">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Đang tạo mã QR...</span>
                </div>
                <p class="text-muted mt-2">Đang tạo mã QR thanh toán...</p>
            </div>
        </div>

        <!-- QR Code Display -->
        <div v-else-if="qrData && status !== 'expired' && status !== 'confirmed'" class="qr-display">
            <!-- Amount Display -->
            <div class="amount-display">
                <span class="amount-label">Số tiền cần thanh toán</span>
                <span class="amount-value">{{ formatPrice(qrData.amount) }}</span>
            </div>

            <div class="mb-3">
                <h6 class="qr-title">Quét mã QR để thanh toán</h6>
                <div class="qr-code-wrapper my-3">
                    <img :src="qrData.qrCodeUrl" alt="QR Code Thanh toán" class="qr-image" @error="handleImageError" />
                </div>
                <div class="timer-badge" :class="getTimerClass">
                    <i class="bi bi-clock"></i>
                    <span class="timer-label">Còn lại:</span>
                    <strong class="timer-value">{{ formatTime }}</strong>
                </div>
            </div>

            <!-- Bank Info Card -->
            <div class="bank-info-card">
                <div class="card-header-custom">
                    <i class="bi bi-bank"></i>
                    <span>Thông tin chuyển khoản</span>
                </div>
                <div class="card-body-custom">
                    <div class="info-row">
                        <div class="info-label">
                            <i class="bi bi-building"></i>
                            <span>Ngân hàng:</span>
                        </div>
                        <span class="info-value">{{ qrData.bankInfo?.bankName || 'VietinBank' }}</span>
                    </div>
                    <div class="info-row">
                        <div class="info-label">
                            <i class="bi bi-credit-card"></i>
                            <span>Số tài khoản:</span>
                        </div>
                        <div class="info-value-with-copy">
                            <span class="info-value account-number">{{ qrData.bankInfo?.accountNo || '0866668888' }}</span>
                            <button class="btn-copy" @click="copyToClipboard(qrData.bankInfo?.accountNo || '0866668888')" title="Sao chép số tài khoản">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">
                            <i class="bi bi-person"></i>
                            <span>Chủ tài khoản:</span>
                        </div>
                        <span class="info-value">{{ qrData.bankInfo?.accountName || 'CONG TY TNHH VIETLAPTOP' }}</span>
                    </div>
                    <div class="info-row">
                        <div class="info-label">
                            <i class="bi bi-file-text"></i>
                            <span>Nội dung CK:</span>
                        </div>
                        <div class="info-value-with-copy">
                            <code class="order-code">{{ qrData.orderCode }}</code>
                            <button class="btn-copy" @click="copyToClipboard(qrData.orderCode)" title="Sao chép mã đơn hàng">
                                <i class="bi bi-clipboard"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Payment Status -->
            <div v-if="status === 'checking'" class="status-checking">
                <div class="spinner-border spinner-border-sm me-2"></div>
                <span>Đang kiểm tra thanh toán...</span>
            </div>
            <div v-else class="status-pending">
                <i class="bi bi-info-circle me-2"></i>
                <span>Vui lòng quét mã QR bằng app ngân hàng để thanh toán</span>
            </div>
        </div>

        <!-- Expired State -->
        <div v-else-if="status === 'expired'" class="alert alert-danger">
            <i class="bi bi-x-circle-fill me-2"></i>
            Mã QR đã hết hạn. Vui lòng đặt hàng lại.
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-danger">
            <i class="bi bi-exclamation-triangle me-2"></i>
            {{ error }}
            <button class="btn btn-sm btn-primary mt-2" @click="retry">
                Thử lại
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
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
    }
})

const emit = defineEmits(['retry', 'expired'])

// State
const remainingTime = ref(0) // seconds
let countdownInterval = null

// Computed
const formatTime = computed(() => {
    const mins = Math.floor(remainingTime.value / 60)
    const secs = remainingTime.value % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
})

// Methods
const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
    }).format(price || 0)
}

const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text)
        // Show toast notification instead of alert
        showCopyNotification()
    } catch (err) {
        console.error('Failed to copy:', err)
        alert('Không thể sao chép. Vui lòng thử lại.')
    }
}

const showCopyNotification = () => {
    // Simple notification - can be enhanced with toast library
    const notification = document.createElement('div')
    notification.className = 'copy-notification'
    notification.textContent = 'Đã sao chép!'
    document.body.appendChild(notification)
    
    setTimeout(() => {
        notification.classList.add('show')
    }, 10)
    
    setTimeout(() => {
        notification.classList.remove('show')
        setTimeout(() => {
            document.body.removeChild(notification)
        }, 300)
    }, 2000)
}

const getTimerClass = computed(() => {
    if (remainingTime.value < 300) {
        return 'timer-urgent'
    } else if (remainingTime.value < 600) {
        return 'timer-warning'
    }
    return 'timer-normal'
})

const handleImageError = () => {
    console.error('Failed to load QR code image')
}

const retry = () => {
    emit('retry')
}

const startCountdown = () => {
    if (!props.qrData?.expiryTime) return

    const updateTimer = () => {
        const now = dayjs()
        const expiry = dayjs(props.qrData.expiryTime)
        remainingTime.value = expiry.diff(now, 'second')

        if (remainingTime.value <= 0) {
            remainingTime.value = 0
            clearInterval(countdownInterval)
            emit('expired')
        }
    }

    updateTimer()
    countdownInterval = setInterval(updateTimer, 1000)
}

const stopCountdown = () => {
    if (countdownInterval) {
        clearInterval(countdownInterval)
        countdownInterval = null
    }
}

// Watchers
watch(() => props.qrData, (newData) => {
    if (newData) {
        stopCountdown()
        startCountdown()
    }
}, { immediate: true })

watch(() => props.status, (newStatus) => {
    if (newStatus === 'confirmed' || newStatus === 'expired') {
        stopCountdown()
    }
})

// Lifecycle
onUnmounted(() => {
    stopCountdown()
})
</script>

<style scoped>
.qr-payment-display {
    text-align: center;
}

.qr-code-wrapper {
    display: inline-block;
    padding: 20px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.qr-image {
    max-width: 100%;
    width: 350px;
    height: auto;
    border-radius: 8px;
}

.timer-badge {
    font-size: 1.2rem;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
}

.timer-normal {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 2px solid #bee5eb;
}

.timer-warning {
    background-color: #fff3cd;
    color: #856404;
    border: 2px solid #ffeaa7;
}

.timer-urgent {
    background-color: #f8d7da;
    color: #721c24;
    border: 2px solid #f5c6cb;
    animation: pulse-urgent 1s infinite;
}

.timer-label {
    font-weight: 500;
}

.timer-value {
    font-size: 1.3rem;
    font-weight: 700;
}

@keyframes pulse-urgent {
    0%, 100% {
        opacity: 1;
    }
    50% {
        opacity: 0.8;
    }
}

.amount-display {
    text-align: center;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 12px;
    color: white;
}

.amount-label {
    display: block;
    font-size: 0.9rem;
    opacity: 0.9;
    margin-bottom: 0.5rem;
}

.amount-value {
    display: block;
    font-size: 2rem;
    font-weight: 700;
}

.qr-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #212529;
    margin-bottom: 1rem;
}

.bank-info-card {
    background: white;
    border: 2px solid #e9ecef;
    border-radius: 12px;
    overflow: hidden;
    margin-top: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.card-header-custom {
    background-color: #047857;
    color: white;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
}

.card-body-custom {
    padding: 1rem;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 0;
    border-bottom: 1px solid #f0f0f0;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6c757d;
    font-weight: 500;
    flex-shrink: 0;
}

.info-label i {
    font-size: 1.1rem;
}

.info-value {
    font-weight: 600;
    color: #212529;
    text-align: right;
}

.account-number {
    color: #0d6efd;
    font-size: 1.1rem;
}

.info-value-with-copy {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-copy {
    background: none;
    border: 1px solid #dee2e6;
    border-radius: 4px;
    padding: 0.25rem 0.5rem;
    cursor: pointer;
    color: #6c757d;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.btn-copy:hover {
    background-color: #f8f9fa;
    border-color: #0d6efd;
    color: #0d6efd;
}

.order-code {
    font-size: 0.95rem;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
    font-family: 'Courier New', monospace;
}

.status-checking,
.status-pending {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.status-checking {
    background-color: #d1ecf1;
    color: #0c5460;
    border: 1px solid #bee5eb;
}

.status-pending {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

.loading-state {
    text-align: center;
}

.skeleton-qr {
    width: 350px;
    height: 350px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 12px;
    margin: 0 auto 1rem;
}

.skeleton-info {
    width: 100%;
    max-width: 500px;
    height: 200px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 12px;
    margin: 0 auto;
}

.spinner-wrapper {
    margin-top: 1rem;
}

@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.copy-notification {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background-color: #198754;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
}

.copy-notification.show {
    opacity: 1;
    transform: translateY(0);
}

@media (max-width: 768px) {
    .qr-image {
        width: 280px;
    }

    .amount-value {
        font-size: 1.5rem;
    }

    .bank-info-card {
        font-size: 0.9rem;
    }

    .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .info-value {
        text-align: left;
    }

    .copy-notification {
        bottom: 1rem;
        right: 1rem;
        left: 1rem;
    }
}
</style>
