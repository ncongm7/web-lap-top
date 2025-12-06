<template>
    <div class="order-progress">
        <div class="progress-steps">
            <div v-for="(step, index) in steps" :key="index"
                :class="['progress-step', { active: step.active, completed: step.completed }]">
                <div class="step-indicator">
                    <div v-if="step.completed" class="step-check">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div v-else class="step-dot"></div>
                </div>
                <div class="step-content">
                    <div class="step-label">{{ step.label }}</div>
                    <div v-if="step.date" class="step-date">{{ formatDate(step.date) }}</div>
                    <div v-else-if="step.pending" class="step-pending">Chờ xử lý</div>
                </div>
                <div v-if="index < steps.length - 1" class="step-connector" :class="{ active: step.completed }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentStatus: {
        type: [String, Number],
        required: true
    },
    orderDate: String,
    paymentDate: String,
    shippingDate: String,
    completedDate: String,
    loaiHoaDon: Number,
    trangThaiThanhToan: Number
})

// Normalize status
const normalizeStatus = (status) => {
    if (typeof status === 'number') {
        const map = { 0: 'CHO_THANH_TOAN', 1: 'DA_THANH_TOAN', 2: 'DA_HUY', 3: 'DANG_GIAO', 4: 'HOAN_THANH' }
        return map[status] || status
    }
    return status
}

const status = computed(() => normalizeStatus(props.currentStatus))

const steps = computed(() => {
    const allSteps = [
        {
            key: 'ordered',
            label: 'Đặt hàng',
            date: props.orderDate,
            status: 'CHO_THANH_TOAN'
        },
        {
            key: 'confirmed',
            label: 'Xác nhận',
            date: null,
            status: 'DA_THANH_TOAN'
        },
        {
            key: 'shipping',
            label: 'Đang giao',
            date: props.shippingDate,
            status: 'DANG_GIAO'
        },
        {
            key: 'completed',
            label: 'Hoàn thành',
            date: props.completedDate,
            status: 'HOAN_THANH'
        }
    ]

    const statusOrder = {
        'CHO_THANH_TOAN': 0,
        'DA_THANH_TOAN': 1,
        'DANG_GIAO': 2,
        'HOAN_THANH': 3,
        'DA_HUY': -1
    }

    const currentIndex = statusOrder[status.value] ?? 0

    return allSteps.map((step, index) => {
        const stepIndex = statusOrder[step.status] ?? index
        return {
            ...step,
            completed: stepIndex < currentIndex,
            active: stepIndex === currentIndex,
            pending: stepIndex > currentIndex && !step.date
        }
    })
})

const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch {
        return ''
    }
}
</script>

<style scoped>
.order-progress {
    width: 100%;
    padding: 16px 0;
}

.progress-steps {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    position: relative;
    gap: 8px;
}

.progress-step {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    min-width: 0;
}

.step-indicator {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e5e7eb;
    border: 3px solid #e5e7eb;
    margin-bottom: 8px;
    flex-shrink: 0;
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;
}

.progress-step.completed .step-indicator {
    background: #10b981;
    border-color: #10b981;
    color: white;
}

.progress-step.active .step-indicator {
    background: #3b82f6;
    border-color: #3b82f6;
    color: white;
    animation: pulse 2s infinite;
}

.step-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #9ca3af;
}

.progress-step.completed .step-dot,
.progress-step.active .step-dot {
    display: none;
}

.step-check {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
}

.step-content {
    text-align: center;
    min-width: 0;
    width: 100%;
}

.step-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    margin-bottom: 4px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.progress-step.completed .step-label {
    color: #10b981;
}

.progress-step.active .step-label {
    color: #3b82f6;
    font-weight: 700;
}

.step-date {
    font-size: 11px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.step-pending {
    font-size: 11px;
    color: #9ca3af;
    font-style: italic;
}

.step-connector {
    position: absolute;
    top: 20px;
    left: calc(50% + 20px);
    right: calc(-50% + 20px);
    height: 3px;
    background: #e5e7eb;
    z-index: 1;
    transition: all 0.3s ease;
}

.step-connector.active {
    background: #10b981;
}

.progress-step:last-child .step-connector {
    display: none;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
    }

    50% {
        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .step-label {
        font-size: 11px;
    }

    .step-date,
    .step-pending {
        font-size: 10px;
    }

    .step-indicator {
        width: 32px;
        height: 32px;
    }

    .step-connector {
        top: 16px;
        left: calc(50% + 16px);
        right: calc(-50% + 16px);
    }
}
</style>
