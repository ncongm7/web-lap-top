<template>
    <div class="points-redemption-card">
        <div class="card-header">
            <div class="header-content">
                <div class="icon-wrapper">
                    <span class="points-icon">⭐</span>
                </div>
                <div class="header-text">
                    <h5 class="card-title">Điểm tích lũy</h5>
                    <p class="card-subtitle">Sử dụng điểm để giảm giá đơn hàng</p>
                </div>
            </div>
        </div>

        <div class="card-body">
            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
                <div class="spinner"></div>
                <p>Đang tải thông tin điểm...</p>
            </div>

            <!-- Has Points -->
            <div v-else-if="availablePoints > 0" class="points-content">
                <!-- Current Points Display -->
                <div class="points-balance-card">
                    <div class="balance-label">Điểm hiện có</div>
                    <div class="balance-value">{{ formatPoints(availablePoints) }}</div>
                    <div class="balance-unit">điểm</div>
                </div>

                <!-- Points Input Section -->
                <div class="points-input-section">
                    <label class="input-label">
                        <span class="label-icon">💎</span>
                        Nhập số điểm muốn sử dụng
                    </label>
                    <div class="input-group-wrapper">
                        <div class="input-wrapper">
                            <input type="number" class="points-input" :value="modelValue" @input="onInput" :min="0"
                                :max="maxPoints" placeholder="0" :class="{ 'error': error }" />
                            <span class="input-suffix">điểm</span>
                        </div>
                        <button class="max-button" type="button" @click="useMaxPoints" :disabled="maxPoints === 0">
                            Dùng tối đa
                        </button>
                    </div>

                    <!-- Error Message -->
                    <div v-if="error" class="error-message">
                        <span class="error-icon">⚠️</span>
                        {{ error }}
                    </div>

                    <!-- Conversion Info -->
                    <div class="conversion-info">
                        <div class="conversion-rate">
                            <span class="rate-label">Tỷ lệ quy đổi:</span>
                            <span class="rate-value">1 điểm = {{ formatPrice(conversionRate) }}</span>
                        </div>
                        <div v-if="discountAmount > 0" class="discount-preview">
                            <span class="discount-label">Giảm giá:</span>
                            <span class="discount-value">-{{ formatPrice(discountAmount) }}</span>
                        </div>
                    </div>

                    <!-- Max Points Info -->
                    <div v-if="maxPoints < availablePoints" class="max-points-info">
                        <span class="info-icon">ℹ️</span>
                        <span>Tối đa có thể dùng {{ formatPoints(maxPoints) }} điểm cho đơn hàng này</span>
                    </div>
                </div>
            </div>

            <!-- No Points State -->
            <div v-else class="no-points-state">
                <div class="empty-icon">⭐</div>
                <p class="empty-title">Chưa có điểm tích lũy</p>
                <p class="empty-description">
                    Bạn sẽ nhận được điểm tích lũy sau khi thanh toán đơn hàng thành công
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    availablePoints: {
        type: Number,
        default: 0
    },
    modelValue: {
        type: Number,
        default: 0
    },
    conversionRate: {
        type: Number,
        default: 0
    },
    loading: {
        type: Boolean,
        default: false
    },
    maxAllowedPoints: {
        type: Number,
        default: Infinity
    }
})

const emit = defineEmits(['update:modelValue'])

const maxPoints = computed(() => {
    return Math.min(props.availablePoints, props.maxAllowedPoints)
})

const discountAmount = computed(() => {
    return props.modelValue * props.conversionRate
})

const error = computed(() => {
    if (props.modelValue > props.availablePoints) {
        return `Bạn chỉ có ${formatPoints(props.availablePoints)} điểm`
    }
    if (props.modelValue > props.maxAllowedPoints) {
        return `Tối đa có thể dùng ${formatPoints(props.maxAllowedPoints)} điểm cho đơn hàng này`
    }
    return ''
})

const onInput = (event) => {
    let val = parseInt(event.target.value) || 0
    if (val < 0) val = 0
    if (val > maxPoints.value) val = maxPoints.value
    emit('update:modelValue', val)
}

const useMaxPoints = () => {
    emit('update:modelValue', maxPoints.value)
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
.points-redemption-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    margin-bottom: 20px;
}

.card-header {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 16px 20px;
    border-bottom: 1px solid #fbbf24;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.icon-wrapper {
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.points-icon {
    font-size: 24px;
    line-height: 1;
}

.header-text {
    flex: 1;
}

.card-title {
    font-size: 18px;
    font-weight: 600;
    color: #92400e;
    margin: 0 0 4px 0;
}

.card-subtitle {
    font-size: 13px;
    color: #a16207;
    margin: 0;
}

.card-body {
    padding: 20px;
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f4f6;
    border-top-color: #fbbf24;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.loading-state p {
    color: #6b7280;
    font-size: 14px;
    margin: 0;
}

/* Points Balance Card */
.points-balance-card {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border: 2px solid #fbbf24;
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
}

.balance-label {
    font-size: 13px;
    color: #78350f;
    font-weight: 500;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.balance-value {
    font-size: 32px;
    font-weight: 700;
    color: #92400e;
    line-height: 1;
    margin-bottom: 4px;
}

.balance-unit {
    font-size: 14px;
    color: #a16207;
    font-weight: 500;
}

/* Points Input Section */
.points-input-section {
    margin-top: 20px;
}

.input-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 12px;
}

.label-icon {
    font-size: 16px;
}

.input-group-wrapper {
    display: flex;
    gap: 10px;
    margin-bottom: 12px;
}

.input-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

.points-input {
    width: 100%;
    padding: 12px 80px 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #1f2937;
    transition: all 0.2s;
}

.points-input:focus {
    outline: none;
    border-color: #fbbf24;
    box-shadow: 0 0 0 3px rgba(251, 191, 36, 0.1);
}

.points-input.error {
    border-color: #ef4444;
}

.input-suffix {
    position: absolute;
    right: 16px;
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
    pointer-events: none;
}

.max-button {
    padding: 12px 20px;
    background: #fbbf24;
    color: #78350f;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.max-button:hover:not(:disabled) {
    background: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
}

.max-button:disabled {
    background: #d1d5db;
    color: #9ca3af;
    cursor: not-allowed;
}

/* Error Message */
.error-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    color: #dc2626;
    font-size: 13px;
    margin-bottom: 12px;
}

.error-icon {
    font-size: 16px;
    flex-shrink: 0;
}

/* Conversion Info */
.conversion-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f9fafb;
    border-radius: 8px;
    margin-bottom: 12px;
}

.conversion-rate,
.discount-preview {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.rate-label,
.discount-label {
    font-size: 12px;
    color: #6b7280;
}

.rate-value {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
}

.discount-value {
    font-size: 16px;
    font-weight: 700;
    color: #10b981;
}

/* Max Points Info */
.max-points-info {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    font-size: 12px;
    color: #1e40af;
}

.info-icon {
    font-size: 16px;
    flex-shrink: 0;
}

/* No Points State */
.no-points-state {
    text-align: center;
    padding: 40px 20px;
}

.empty-icon {
    font-size: 64px;
    opacity: 0.3;
    margin-bottom: 16px;
}

.empty-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 8px 0;
}

.empty-description {
    font-size: 13px;
    color: #6b7280;
    margin: 0;
    line-height: 1.5;
}

/* Responsive */
@media (max-width: 640px) {
    .input-group-wrapper {
        flex-direction: column;
    }

    .max-button {
        width: 100%;
    }

    .conversion-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .balance-value {
        font-size: 24px;
    }
}
</style>
