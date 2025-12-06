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
            <!-- Chỉ hiển thị 1 badge duy nhất -->
            <span :class="['status-badge', getStatusClass(order.trangThai, order)]">
                <span class="status-icon">{{ getStatusIcon(order.trangThai, order) }}</span>
                <span class="status-text">{{ getStatusText(order.trangThai, order) }}</span>
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

// Helper function để normalize status (cần dùng trong template)
const normalizeStatus = (status) => {
    if (typeof status === 'number') {
        const numberMap = {
            0: 'CHO_THANH_TOAN',
            1: 'DA_THANH_TOAN',
            2: 'DA_HUY',
            3: 'DANG_GIAO',
            4: 'HOAN_THANH'
        }
        return numberMap[status] || status
    }
    return status
}

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


/**
 * Get status text with special handling for online orders
 * - COD (trangThaiThanhToan = 0): "Chờ thanh toán"
 * - QR (trangThaiThanhToan = 1): "Đã thanh toán - Chờ xác nhận" (nếu trangThai = 0)
 * - Đã xác nhận: Hiển thị trạng thái bình thường
 */
const getStatusText = (status, order = null) => {
    const normalizedStatus = normalizeStatus(status)

    // Xử lý đặc biệt cho đơn online chưa xác nhận
    if (order && order.loaiHoaDon === 1) {
        const trangThai = normalizeStatus(order.trangThai)
        const trangThaiThanhToan = order.trangThaiThanhToan

        // Đơn online chưa xác nhận (trangThai = CHO_THANH_TOAN hoặc 0)
        if (trangThai === 'CHO_THANH_TOAN' || trangThai === 0 || order.trangThai === 0) {
            if (trangThaiThanhToan === 1) {
                // Đã thanh toán QR nhưng chờ xác nhận - hiển thị cả 2 thông tin trong 1 badge
                return 'Đã thanh toán - Chờ xác nhận'
            } else if (trangThaiThanhToan === 0 || trangThaiThanhToan === null) {
                // Chưa thanh toán (COD)
                return 'Chờ thanh toán'
            }
        }
    }

    // Xử lý trạng thái bình thường
    const statusMap = {
        'CHO_THANH_TOAN': 'Chờ thanh toán',
        'DA_THANH_TOAN': 'Đã thanh toán',
        'DA_HUY': 'Đã hủy',
        'DANG_GIAO': 'Đang giao',
        'HOAN_THANH': 'Hoàn thành'
    }

    return statusMap[normalizedStatus] || normalizedStatus || 'Không xác định'
}

const getStatusClass = (status, order = null) => {
    const normalizedStatus = normalizeStatus(status)

    // Xử lý đặc biệt cho đơn online
    if (order && order.loaiHoaDon === 1) {
        const trangThai = normalizeStatus(order.trangThai)
        const trangThaiThanhToan = order.trangThaiThanhToan

        if (trangThai === 'CHO_THANH_TOAN' || trangThai === 0) {
            if (trangThaiThanhToan === 1) {
                // Đã thanh toán QR - màu xanh dương
                return 'status-paid'
            } else {
                // Chưa thanh toán COD - màu vàng
                return 'status-pending'
            }
        }
    }

    const classMap = {
        'CHO_THANH_TOAN': 'status-pending',
        'DA_THANH_TOAN': 'status-paid',
        'DA_HUY': 'status-cancelled',
        'DANG_GIAO': 'status-shipping',
        'HOAN_THANH': 'status-completed'
    }

    return classMap[normalizedStatus] || 'status-unknown'
}

const getStatusIcon = (status, order = null) => {
    const normalizedStatus = normalizeStatus(status)

    // Xử lý đặc biệt cho đơn online
    if (order && order.loaiHoaDon === 1) {
        const trangThai = normalizeStatus(order.trangThai)
        const trangThaiThanhToan = order.trangThaiThanhToan

        if (trangThai === 'CHO_THANH_TOAN' || trangThai === 0) {
            if (trangThaiThanhToan === 1) {
                return '✅' // Đã thanh toán QR
            } else {
                return '⏳' // Chờ thanh toán COD
            }
        }
    }

    const iconMap = {
        'CHO_THANH_TOAN': '⏳',
        'DA_THANH_TOAN': '✅',
        'DA_HUY': '❌',
        'DANG_GIAO': '🚚',
        'HOAN_THANH': '🎉'
    }
    return iconMap[normalizedStatus] || '❓'
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    min-width: 140px;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.status-badge:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.status-icon {
    font-size: 16px;
    line-height: 1;
}

.status-text {
    line-height: 1;
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

.status-waiting-confirm {
    background-color: #dbeafe;
    color: #1e40af;
    margin-left: 8px;
    font-size: 12px;
    padding: 6px 12px;
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
