<template>
    <div class="order-card" @click="$emit('click', order.id)" role="button" tabindex="0">
        <!-- Header: Mã đơn & Ngày -->
        <div class="order-card__header">
            <div class="order-code">
                <span class="label">Mã đơn:</span>
                <span class="value">{{ order.ma || 'N/A' }}</span>
            </div>
            <div class="order-date">
                {{ formatDate(order.ngayTao) }}
            </div>
        </div>

        <!-- Body: Thông tin đơn -->
        <div class="order-card__body">
            <div class="order-info-row">
                <span class="info-label">Số sản phẩm:</span>
                <span class="info-value">{{ itemsCount }} sản phẩm</span>
            </div>
            <div class="order-info-row total-row">
                <span class="info-label">Tổng tiền:</span>
                <span class="info-value total-amount">{{ formatCurrency(order.tongTienSauGiam || order.tongTien)
                    }}</span>
            </div>
        </div>

        <!-- Footer: Trạng thái -->
        <div class="order-card__footer">
            <span :class="['status-badge', getStatusClass(order.trangThai)]">
                {{ getStatusText(order.trangThai) }}
            </span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
    order: {
        type: Object,
        required: true
    }
})

// Emits
const emit = defineEmits(['click'])

// Computed
const itemsCount = computed(() => {
    // Nếu có danh sách chi tiết, đếm số lượng
    if (props.order.chiTietList && Array.isArray(props.order.chiTietList)) {
        return props.order.chiTietList.length
    }
    // Fallback: ước tính hoặc hiển thị '...'
    return '...'
})

// Methods
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'

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
        return 'N/A'
    }
}

const formatCurrency = (value) => {
    if (!value && value !== 0) return '0 ₫'

    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(value)
}

const getStatusText = (status) => {
    const statusMap = {
        'CHO_THANH_TOAN': 'Chờ thanh toán',
        'DA_THANH_TOAN': 'Đã thanh toán',
        'DA_HUY': 'Đã hủy',
        'DANG_GIAO': 'Đang giao',
        'HOAN_THANH': 'Hoàn thành'
    }

    return statusMap[status] || status || 'Không xác định'
}

const getStatusClass = (status) => {
    const classMap = {
        'CHO_THANH_TOAN': 'status-pending',
        'DA_THANH_TOAN': 'status-paid',
        'DA_HUY': 'status-cancelled',
        'DANG_GIAO': 'status-shipping',
        'HOAN_THANH': 'status-completed'
    }

    return classMap[status] || 'status-unknown'
}
</script>

<style scoped>
.order-card {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.order-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
    border-color: #3b82f6;
}

.order-card:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
}

/* Header */
.order-card__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #f3f4f6;
}

.order-code {
    display: flex;
    align-items: center;
    gap: 8px;
}

.order-code .label {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
}

.order-code .value {
    font-size: 15px;
    color: #111827;
    font-weight: 700;
    font-family: 'Courier New', monospace;
}

.order-date {
    font-size: 13px;
    color: #6b7280;
}

/* Body */
.order-card__body {
    margin-bottom: 16px;
}

.order-info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
}

.info-label {
    font-size: 14px;
    color: #6b7280;
}

.info-value {
    font-size: 14px;
    color: #111827;
    font-weight: 500;
}

.total-row {
    margin-top: 8px;
    padding-top: 12px;
    border-top: 1px solid #f3f4f6;
}

.total-amount {
    font-size: 18px;
    color: #dc2626;
    font-weight: 700;
}

/* Footer */
.order-card__footer {
    display: flex;
    justify-content: flex-end;
}

.status-badge {
    display: inline-block;
    padding: 6px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    min-width: 120px;
}

/* Status Colors */
.status-pending {
    background-color: #fef3c7;
    color: #92400e;
}

.status-paid {
    background-color: #dbeafe;
    color: #1e40af;
}

.status-shipping {
    background-color: #fed7aa;
    color: #9a3412;
}

.status-completed {
    background-color: #d1fae5;
    color: #065f46;
}

.status-cancelled {
    background-color: #fee2e2;
    color: #991b1b;
}

.status-unknown {
    background-color: #f3f4f6;
    color: #6b7280;
}

/* Responsive */
@media (max-width: 640px) {
    .order-card {
        padding: 16px;
    }

    .order-card__header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .order-code .value {
        font-size: 14px;
    }

    .total-amount {
        font-size: 16px;
    }

    .status-badge {
        font-size: 12px;
        padding: 5px 12px;
        min-width: 100px;
    }
}
</style>
