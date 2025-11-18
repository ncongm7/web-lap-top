<template>
    <div class="order-status-timeline">
        <div v-for="(step, index) in timelineSteps" :key="step.status" :class="[
            'timeline-item',
            {
                active: isStepActive(step.status),
                completed: isStepCompleted(step.status),
                pending: isStepPending(step.status)
            }
        ]">
            <!-- Timeline Line (before item) -->
            <div v-if="index > 0" class="timeline-line timeline-line-before"></div>

            <!-- Timeline Content -->
            <div class="timeline-content">
                <!-- Icon/Marker -->
                <div class="timeline-marker">
                    <div class="timeline-dot">
                        <!-- Icon based on status -->
                        <svg v-if="isStepCompleted(step.status)" class="timeline-icon completed-icon" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                        </svg>
                        <svg v-else-if="isStepActive(step.status)" class="timeline-icon active-icon" fill="none"
                            stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke-width="2" />
                            <circle cx="12" cy="12" r="4" fill="currentColor" />
                        </svg>
                        <svg v-else class="timeline-icon pending-icon" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke-width="2" />
                        </svg>
                    </div>
                </div>

                <!-- Step Info -->
                <div class="timeline-info">
                    <div class="timeline-title">{{ step.label }}</div>
                    <div v-if="step.date" class="timeline-date">
                        {{ formatDate(step.date) }}
                    </div>
                    <div v-else-if="isStepActive(step.status)" class="timeline-status">
                        Đang xử lý...
                    </div>
                    <div v-else class="timeline-status pending-text">Chờ xử lý</div>
                </div>
            </div>

            <!-- Timeline Line (after item) -->
            <div v-if="index < timelineSteps.length - 1" class="timeline-line timeline-line-after"></div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentStatus: {
        type: String,
        required: true,
        validator: (value) => {
            return [
                'CHO_THANH_TOAN',
                'DA_THANH_TOAN',
                'DA_HUY',
                'DANG_GIAO',
                'HOAN_THANH'
            ].includes(value)
        }
    },
    orderDate: {
        type: String,
        default: null
    },
    paymentDate: {
        type: String,
        default: null
    },
    shippingDate: {
        type: String,
        default: null
    },
    completedDate: {
        type: String,
        default: null
    }
})

// Timeline steps configuration
const timelineSteps = computed(() => {
    return [
        {
            status: 'CHO_THANH_TOAN',
            label: 'Đặt hàng',
            description: 'Đơn hàng đã được đặt',
            date: props.orderDate
        },
        {
            status: 'DA_THANH_TOAN',
            label: 'Xác nhận',
            description: 'Đơn hàng đã được xác nhận',
            date: props.paymentDate
        },
        {
            status: 'DANG_GIAO',
            label: 'Đang giao hàng',
            description: 'Đơn hàng đang được vận chuyển',
            date: props.shippingDate
        },
        {
            status: 'HOAN_THANH',
            label: 'Hoàn thành',
            description: 'Đơn hàng đã được giao thành công',
            date: props.completedDate
        }
    ]
})

// Methods
const isStepActive = (stepStatus) => {
    return props.currentStatus === stepStatus
}

const isStepCompleted = (stepStatus) => {
    if (props.currentStatus === 'DA_HUY') {
        // Nếu đơn bị hủy, không có bước nào completed
        return false
    }

    const statusOrder = [
        'CHO_THANH_TOAN',
        'DA_THANH_TOAN',
        'DANG_GIAO',
        'HOAN_THANH'
    ]
    const currentIndex = statusOrder.indexOf(props.currentStatus)
    const stepIndex = statusOrder.indexOf(stepStatus)

    return stepIndex < currentIndex
}

const isStepPending = (stepStatus) => {
    return !isStepActive(stepStatus) && !isStepCompleted(stepStatus)
}

const formatDate = (dateString) => {
    if (!dateString) return null

    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (e) {
        return null
    }
}
</script>

<style scoped>
.order-status-timeline {
    position: relative;
    padding: 8px 0;
}

.timeline-item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 24px;
}

.timeline-item:last-child {
    margin-bottom: 0;
}

/* Timeline Lines */
.timeline-line {
    position: absolute;
    left: 11px;
    width: 2px;
    background: #e5e7eb;
    transition: all 0.3s ease;
}

.timeline-line-before {
    top: -8px;
    height: 8px;
}

.timeline-line-after {
    top: 40px;
    bottom: -24px;
}

.timeline-item.completed .timeline-line-after {
    background: #10b981;
}

.timeline-item.active .timeline-line-after {
    background: linear-gradient(to bottom, #10b981 0%, #e5e7eb 50%);
}

/* Timeline Content */
.timeline-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    flex: 1;
    padding-top: 4px;
}

/* Timeline Marker */
.timeline-marker {
    position: relative;
    flex-shrink: 0;
    z-index: 2;
}

.timeline-dot {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #ffffff;
    border: 3px solid #e5e7eb;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.timeline-icon {
    width: 14px;
    height: 14px;
}

/* Pending State */
.timeline-item.pending .timeline-dot {
    background: #ffffff;
    border-color: #e5e7eb;
}

.timeline-item.pending .timeline-icon {
    color: #9ca3af;
}

/* Active State */
.timeline-item.active .timeline-dot {
    background: #3b82f6;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    animation: pulse 2s infinite;
}

.timeline-item.active .timeline-icon {
    color: #ffffff;
}

@keyframes pulse {

    0%,
    100% {
        box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
    }

    50% {
        box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.05);
    }
}

/* Completed State */
.timeline-item.completed .timeline-dot {
    background: #10b981;
    border-color: #10b981;
    box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.timeline-item.completed .timeline-icon {
    color: #ffffff;
}

/* Timeline Info */
.timeline-info {
    flex: 1;
    min-width: 0;
}

.timeline-title {
    font-size: 15px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
    transition: color 0.3s ease;
}

.timeline-item.pending .timeline-title {
    color: #9ca3af;
}

.timeline-item.active .timeline-title {
    color: #3b82f6;
}

.timeline-item.completed .timeline-title {
    color: #10b981;
}

.timeline-date {
    font-size: 13px;
    color: #6b7280;
    font-weight: 500;
}

.timeline-status {
    font-size: 13px;
    font-style: italic;
    color: #9ca3af;
}

.timeline-item.active .timeline-status {
    color: #3b82f6;
    font-weight: 500;
}

.pending-text {
    color: #9ca3af;
}

/* Responsive */
@media (max-width: 640px) {
    .timeline-content {
        gap: 12px;
    }

    .timeline-dot {
        width: 20px;
        height: 20px;
    }

    .timeline-icon {
        width: 12px;
        height: 12px;
    }

    .timeline-title {
        font-size: 14px;
    }

    .timeline-date,
    .timeline-status {
        font-size: 12px;
    }

    .timeline-line {
        left: 9px;
    }
}
</style>
