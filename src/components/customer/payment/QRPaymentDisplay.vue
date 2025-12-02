<template>
    <div class="qr-payment-display">
        <!-- Loading State -->
        <div v-if="loading" class="py-4 text-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Đang tạo mã QR...</span>
            </div>
            <p class="text-muted mt-2">Đang tạo mã QR thanh toán...</p>
        </div>

        <!-- QR Code Display -->
        <div v-else-if="qrData && status !== 'expired'" class="qr-display">
            <div class="mb-3">
                <h6>Quét mã QR để thanh toán</h6>
                <div class="qr-code-wrapper my-3">
                    <img :src="qrData.qrCodeUrl" alt="QR Code Thanh toán" class="qr-image" @error="handleImageError" />
                </div>
                <div class="timer-badge alert py-2" :class="remainingTime < 300 ? 'alert-warning' : 'alert-info'">
                    <i class="bi bi-clock"></i> Còn lại:
                    <strong :class="{ 'text-danger': remainingTime < 300 }">{{ formatTime }}</strong>
                </div>
            </div>

            <!-- Bank Info -->
            <div class="bank-info bg-light p-3 rounded">
                <div class="info-row mb-2">
                    <strong>Ngân hàng:</strong>
                    <span>{{ qrData.bankInfo?.bankName || 'VietinBank' }}</span>
                </div>
                <div class="info-row mb-2">
                    <strong>Số tài khoản:</strong>
                    <span class="text-primary fw-bold">{{ qrData.bankInfo?.accountNo || '0866668888' }}</span>
                </div>
                <div class="info-row mb-2">
                    <strong>Chủ tài khoản:</strong>
                    <span>{{ qrData.bankInfo?.accountName || 'CONG TY TNHH VIETLAPTOP' }}</span>
                </div>
                <div class="info-row mb-2">
                    <strong>Số tiền:</strong>
                    <span class="text-danger fw-bold fs-5">{{ formatPrice(qrData.amount) }}</span>
                </div>
                <div class="info-row mb-0">
                    <strong>Nội dung CK:</strong>
                    <code class="bg-white px-2 py-1">{{ qrData.orderCode }}</code>
                    <button class="btn btn-sm btn-outline-primary ms-2" @click="copyToClipboard(qrData.orderCode)"
                        title="Sao chép">
                        <i class="bi bi-clipboard"></i>
                    </button>
                </div>
            </div>

            <!-- Payment Status -->
            <div v-if="status === 'checking'" class="alert alert-info mt-3">
                <div class="spinner-border spinner-border-sm me-2"></div>
                Đang kiểm tra thanh toán...
            </div>
            <div v-else-if="status === 'confirmed'" class="alert alert-success mt-3">
                <i class="bi bi-check-circle-fill me-2"></i>
                ✅ Đã nhận thanh toán! Đơn hàng đang được xử lý.
            </div>
            <div v-else class="alert alert-warning mt-3">
                <i class="bi bi-info-circle me-2"></i>
                Vui lòng quét mã QR bằng app ngân hàng để thanh toán
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
        alert('Đã sao chép mã đơn hàng!')
    } catch (err) {
        console.error('Failed to copy:', err)
    }
}

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
    width: 280px;
    height: auto;
    border-radius: 8px;
}

.timer-badge {
    font-size: 1.1rem;
    font-weight: 500;
}

.bank-info {
    text-align: left;
    max-width: 500px;
    margin: 0 auto;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
}

.info-row strong {
    flex-shrink: 0;
}

code {
    font-size: 0.95rem;
    padding: 4px 8px;
    border-radius: 4px;
}

@media (max-width: 768px) {
    .qr-image {
        width: 220px;
    }

    .bank-info {
        font-size: 0.9rem;
    }

    .info-row {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
