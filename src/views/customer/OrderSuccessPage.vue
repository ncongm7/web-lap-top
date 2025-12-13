<template>
    <div class="order-success-page">
        <div class="container">
            <!-- Success Icon & Message -->
            <div class="success-content">
                <div class="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>

                <h1 class="success-title">Đặt hàng thành công!</h1>
                <p class="success-message">
                    Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
                </p>

                <!-- Order Info Card -->
                <div class="order-info-card">
                    <div class="info-row">
                        <span class="info-label">Mã đơn hàng:</span>
                        <span class="info-value order-code">{{ orderCode || 'N/A' }}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Trạng thái:</span>
                        <span class="info-value status-badge">Chờ xác nhận</span>
                    </div>
                    <div class="info-note">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                        <p>
                            Đơn hàng của bạn đang chờ xác nhận từ quản trị viên.
                            Chúng tôi sẽ thông báo cho bạn khi đơn hàng được xác nhận.
                        </p>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                    <router-link to="/products" class="btn btn-secondary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                        </svg>
                        Tiếp tục mua sắm
                    </router-link>

                    <router-link v-if="orderId" :to="{ name: 'order-detail', params: { id: orderId } }"
                        class="btn btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Xem chi tiết đơn hàng
                    </router-link>

                    <router-link v-else :to="{ name: 'orders' }" class="btn btn-primary">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                        </svg>
                        Xem đơn hàng của tôi
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useOrderWebSocket } from '@/composables/customer/useOrderWebSocket'

const route = useRoute()
const router = useRouter()
const orderId = ref(null)
const orderCode = ref(null)

const handleStatusUpdate = (data) => {
    // Check if order is cancelled (Status 8 is typically cancelled, or use isCancelled flag from our composable)
    if (data.newStatus === 8 || data.isCancelled) {
        alert('⚠️ Đơn hàng của bạn đã bị hủy (do hết hàng hoặc lý do khác).\n\nBạn sẽ được chuyển về trang chủ.')
        router.push('/')
    }
}

// WebSocket setup handled automatically when orderId is valid
useOrderWebSocket(orderId, handleStatusUpdate)

onMounted(() => {
    // Lấy orderId và orderCode từ query params
    orderId.value = route.query.orderId || null
    orderCode.value = route.query.orderCode || 'N/A'
})
</script>

<style scoped>
.order-success-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 60px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.container {
    max-width: 600px;
    width: 100%;
}

.success-content {
    background: white;
    border-radius: 16px;
    padding: 48px 32px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
}

.success-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    animation: scaleIn 0.5s ease-out;
}

.success-icon svg {
    width: 48px;
    height: 48px;
}

@keyframes scaleIn {
    from {
        transform: scale(0);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}

.success-title {
    font-size: 32px;
    font-weight: 700;
    color: #1a202c;
    margin: 0 0 12px;
}

.success-message {
    font-size: 16px;
    color: #718096;
    margin: 0 0 32px;
    line-height: 1.6;
}

.order-info-card {
    background: #f7fafc;
    border-radius: 12px;
    padding: 24px;
    margin: 32px 0;
    text-align: left;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #e2e8f0;
}

.info-row:last-child {
    border-bottom: none;
}

.info-label {
    font-size: 14px;
    color: #718096;
    font-weight: 500;
}

.info-value {
    font-size: 16px;
    font-weight: 600;
    color: #1a202c;
}

.order-code {
    color: #667eea;
    font-family: 'Courier New', monospace;
    font-size: 18px;
}

.status-badge {
    background: #fed7d7;
    color: #c53030;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
}

.info-note {
    margin-top: 16px;
    padding: 16px;
    background: white;
    border-radius: 8px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
}

.info-note svg {
    width: 20px;
    height: 20px;
    color: #4299e1;
    flex-shrink: 0;
    margin-top: 2px;
}

.info-note p {
    margin: 0;
    font-size: 14px;
    color: #4a5568;
    line-height: 1.6;
}

.action-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 32px;
}

.btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 28px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    border: none;
    cursor: pointer;
}

.btn svg {
    width: 20px;
    height: 20px;
}

.btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
}

.btn-secondary:hover {
    background: #667eea;
    color: white;
    transform: translateY(-2px);
}

@media (max-width: 640px) {
    .success-content {
        padding: 32px 20px;
    }

    .success-title {
        font-size: 24px;
    }

    .action-buttons {
        flex-direction: column;
    }

    .btn {
        width: 100%;
        justify-content: center;
    }
}
</style>
