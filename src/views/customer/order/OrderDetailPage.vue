<template>
    <div class="order-detail-page">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Đang tải chi tiết đơn hàng...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="error-message">{{ error }}</p>
            <button class="retry-button" @click="fetchOrderDetail">Thử lại</button>
            <router-link to="/orders" class="back-link">← Quay lại danh sách</router-link>
        </div>

        <!-- Order Detail Content -->
        <div v-else-if="order" class="order-content">
            <!-- Header -->
            <div class="order-header">
                <div class="header-left">
                    <router-link to="/orders" class="back-button">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </router-link>
                    <div class="header-info">
                        <h1 class="order-title">Đơn hàng #{{ order.ma }}</h1>
                        <p class="order-date">Đặt ngày {{ formatDate(order.ngayTao) }}</p>
                    </div>
                </div>
                <div class="header-right">
                    <span :class="['status-badge-large', getStatusClass(order.trangThai)]">
                        {{ getStatusText(order.trangThai) }}
                    </span>
                </div>
            </div>

            <!-- 2 Column Layout -->
            <div class="order-body">
                <!-- Left Column: Products & Pricing -->
                <div class="main-column">
                    <!-- Products Table -->
                    <div class="section">
                        <h2 class="section-title">Sản phẩm trong đơn</h2>
                        <div class="products-table">
                            <div v-if="!order.chiTietList || order.chiTietList.length === 0" class="empty-products">
                                Không có sản phẩm nào trong đơn hàng
                            </div>
                            <div v-else>
                                <div v-for="item in order.chiTietList" :key="item.idChiTietSanPham" class="product-row">
                                    <!-- Product Image -->
                                    <div class="product-image">
                                        <img :src="item.hinhAnh || '/placeholder-product.png'" :alt="item.tenSanPham"
                                            @error="handleImageError" />
                                    </div>

                                    <!-- Product Info -->
                                    <div class="product-info">
                                        <h3 class="product-name">{{ item.tenSanPham || 'Sản phẩm' }}</h3>
                                        <p v-if="item.bienThe" class="product-variant">{{ item.bienThe }}</p>
                                        <p class="product-quantity">Số lượng: {{ item.soLuong }}</p>
                                    </div>

                                    <!-- Product Price -->
                                    <div class="product-price">
                                        <div class="unit-price">{{ formatCurrency(item.donGia) }}</div>
                                        <div class="total-price">{{ formatCurrency(item.thanhTien) }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pricing Summary -->
                    <div class="section pricing-section">
                        <div class="pricing-row">
                            <span class="pricing-label">Tạm tính</span>
                            <span class="pricing-value">{{ formatCurrency(order.tongTien) }}</span>
                        </div>
                        <div v-if="order.tienDuocGiam && order.tienDuocGiam > 0" class="pricing-row discount-row">
                            <span class="pricing-label">Giảm giá</span>
                            <span class="pricing-value discount">- {{ formatCurrency(order.tienDuocGiam) }}</span>
                        </div>
                        <div class="pricing-row total-row">
                            <span class="pricing-label total-label">Tổng cộng</span>
                            <span class="pricing-value total-value">{{ formatCurrency(order.tongTienSauGiam ||
                                order.tongTien) }}</span>
                        </div>
                    </div>

                    <!-- Order Notes -->
                    <div v-if="order.ghiChu" class="section">
                        <h2 class="section-title">Ghi chú</h2>
                        <p class="order-notes">{{ order.ghiChu }}</p>
                    </div>
                </div>

                <!-- Right Column: Sidebar -->
                <div class="sidebar-column">
                    <!-- Shipping Info -->
                    <div class="section">
                        <h2 class="section-title">Thông tin giao hàng</h2>
                        <div class="info-box">
                            <div class="info-row">
                                <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <div>
                                    <div class="info-label">Người nhận</div>
                                    <div class="info-value">{{ order.khachHang?.hoTen || order.tenKhachHang || 'N/A' }}
                                    </div>
                                </div>
                            </div>
                            <div class="info-row">
                                <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <div>
                                    <div class="info-label">Số điện thoại</div>
                                    <div class="info-value">{{ order.khachHang?.soDienThoai || order.sdt || 'N/A' }}
                                    </div>
                                </div>
                            </div>
                            <div class="info-row">
                                <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <div class="info-label">Địa chỉ</div>
                                    <div class="info-value">{{ order.khachHang?.diaChi || order.diaChi || 'N/A' }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Order Timeline -->
                    <div class="section">
                        <h2 class="section-title">Trạng thái đơn hàng</h2>
                        <div class="timeline">
                            <div v-for="(step, index) in timelineSteps" :key="step.status"
                                :class="['timeline-step', { active: isStepActive(step.status), completed: isStepCompleted(step.status) }]">
                                <div class="timeline-marker">
                                    <div class="timeline-dot"></div>
                                    <div v-if="index < timelineSteps.length - 1" class="timeline-line"></div>
                                </div>
                                <div class="timeline-content">
                                    <div class="timeline-title">{{ step.label }}</div>
                                    <div v-if="step.date" class="timeline-date">{{ formatDate(step.date) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="section actions-section">
                        <button v-if="canCancelOrder" class="action-button cancel-button" @click="handleCancelOrder"
                            :disabled="isCancelling">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            {{ isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng' }}
                        </button>

                        <button class="action-button reorder-button" @click="handleReorder" :disabled="isReordering">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {{ isReordering ? 'Đang xử lý...' : 'Mua lại' }}
                        </button>

                        <button class="action-button support-button">
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Liên hệ hỗ trợ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import orderService from '@/service/customer/orderService'

// Router
const route = useRoute()
const router = useRouter()

// State
const order = ref(null)
const isLoading = ref(false)
const error = ref(null)
const isCancelling = ref(false)
const isReordering = ref(false)

// Timeline configuration
const timelineSteps = ref([
    { status: 'CHO_THANH_TOAN', label: 'Chờ thanh toán', date: null },
    { status: 'DA_THANH_TOAN', label: 'Đã thanh toán', date: null },
    { status: 'DANG_GIAO', label: 'Đang giao hàng', date: null },
    { status: 'HOAN_THANH', label: 'Hoàn thành', date: null }
])

// Computed
const canCancelOrder = computed(() => {
    return order.value && order.value.trangThai === 'CHO_THANH_TOAN'
})

// Methods
const fetchOrderDetail = async () => {
    isLoading.value = true
    error.value = null

    try {
        const orderId = route.params.id
        console.log('🔍 Fetching order detail:', orderId)

        // Lấy khachHangId từ localStorage
        const khachHangId = localStorage.getItem('userId')

        if (!khachHangId) {
            error.value = 'Vui lòng đăng nhập để xem chi tiết đơn hàng'
            isLoading.value = false
            return
        }

        const response = await orderService.getOrderDetail(orderId, khachHangId)
        console.log('✅ Order detail response:', response.data)

        if (response.data && response.data.data) {
            order.value = response.data.data

            // Cập nhật timeline với ngày thực tế
            updateTimeline()
        } else {
            throw new Error('Dữ liệu đơn hàng không hợp lệ')
        }
    } catch (err) {
        console.error('❌ Error fetching order detail:', err)
        error.value = err.response?.data?.message || 'Không thể tải chi tiết đơn hàng. Vui lòng thử lại.'
    } finally {
        isLoading.value = false
    }
}

const updateTimeline = () => {
    if (!order.value) return

    // Map ngày tạo vào các bước timeline
    const orderDate = order.value.ngayTao
    const paymentDate = order.value.ngayThanhToan

    timelineSteps.value[0].date = orderDate // CHO_THANH_TOAN
    if (paymentDate) {
        timelineSteps.value[1].date = paymentDate // DA_THANH_TOAN
    }

    // TODO: Cập nhật ngày cho DANG_GIAO và HOAN_THANH nếu có field trong DB
}

const isStepActive = (stepStatus) => {
    return order.value && order.value.trangThai === stepStatus
}

const isStepCompleted = (stepStatus) => {
    if (!order.value) return false

    const statusOrder = ['CHO_THANH_TOAN', 'DA_THANH_TOAN', 'DANG_GIAO', 'HOAN_THANH']
    const currentIndex = statusOrder.indexOf(order.value.trangThai)
    const stepIndex = statusOrder.indexOf(stepStatus)

    return stepIndex < currentIndex
}

const handleCancelOrder = async () => {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
        return
    }

    isCancelling.value = true

    try {
        const orderId = route.params.id
        const khachHangId = localStorage.getItem('userId')

        if (!khachHangId) {
            alert('Vui lòng đăng nhập để hủy đơn hàng')
            return
        }

        await orderService.cancelOrder(orderId, khachHangId)

        alert('Hủy đơn hàng thành công!')

        // Refresh order detail
        await fetchOrderDetail()
    } catch (err) {
        console.error('❌ Error cancelling order:', err)
        alert(err.response?.data?.message || 'Không thể hủy đơn hàng. Vui lòng thử lại.')
    } finally {
        isCancelling.value = false
    }
}

const handleReorder = async () => {
    isReordering.value = true

    try {
        const orderId = route.params.id
        const khachHangId = localStorage.getItem('userId')

        if (!khachHangId) {
            alert('Vui lòng đăng nhập để mua lại đơn hàng')
            return
        }

        await orderService.reorder(orderId, khachHangId)

        alert('Đã thêm sản phẩm vào giỏ hàng!')

        // Navigate to cart
        router.push('/cart')
    } catch (err) {
        console.error('❌ Error reordering:', err)
        alert(err.response?.data?.message || 'Không thể mua lại đơn hàng. Vui lòng thử lại.')
    } finally {
        isReordering.value = false
    }
}

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

const handleImageError = (event) => {
    event.target.src = '/placeholder-product.png'
}

// Lifecycle
onMounted(() => {
    console.log('🎬 OrderDetailPage mounted')
    fetchOrderDetail()
})
</script>

<style scoped>
.order-detail-page {
    min-height: 100vh;
    background: #f9fafb;
    padding: 24px;
}

/* Loading & Error States */
.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    min-height: 400px;
}

.spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #f3f4f6;
    border-top-color: #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-icon {
    width: 64px;
    height: 64px;
    color: #dc2626;
    margin-bottom: 16px;
}

.error-message {
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 24px;
    text-align: center;
}

.retry-button {
    padding: 10px 24px;
    background: #3b82f6;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 16px;
}

.back-link {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 600;
}

/* Order Content */
.order-content {
    max-width: 1400px;
    margin: 0 auto;
}

/* Header */
.order-header {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 20px;
}

.back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: #f3f4f6;
    border-radius: 8px;
    color: #374151;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
}

.back-button:hover {
    background: #e5e7eb;
}

.order-title {
    font-size: 28px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 4px;
}

.order-date {
    font-size: 14px;
    color: #6b7280;
}

.status-badge-large {
    padding: 10px 24px;
    border-radius: 24px;
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* 2 Column Layout */
.order-body {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 24px;
}

/* Sections */
.section {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 20px;
}

/* Products Table */
.products-table {
    /* Container cho danh sách sản phẩm */
}

.product-row {
    display: flex;
    gap: 16px;
    padding: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.product-row:hover {
    background: #f9fafb;
    border-color: #3b82f6;
}

.product-image {
    flex-shrink: 0;
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    background: #f3f4f6;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    flex: 1;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
}

.product-variant {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
}

.product-quantity {
    font-size: 14px;
    color: #6b7280;
}

.product-price {
    text-align: right;
}

.unit-price {
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 4px;
}

.total-price {
    font-size: 18px;
    font-weight: 700;
    color: #dc2626;
}

/* Pricing */
.pricing-section {
    border-top: 2px solid #e5e7eb;
}

.pricing-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
}

.pricing-label {
    font-size: 16px;
    color: #6b7280;
}

.pricing-value {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
}

.discount-row .pricing-value {
    color: #10b981;
}

.total-row {
    margin-top: 12px;
    padding-top: 16px;
    border-top: 2px solid #e5e7eb;
}

.total-label {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.total-value {
    font-size: 24px;
    font-weight: 700;
    color: #dc2626;
}

/* Shipping Info */
.info-box {
    /* Container cho thông tin */
}

.info-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
    border-bottom: none;
}

.info-icon {
    width: 24px;
    height: 24px;
    color: #3b82f6;
    flex-shrink: 0;
}

.info-label {
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 4px;
}

.info-value {
    font-size: 15px;
    color: #111827;
    font-weight: 600;
}

/* Timeline */
.timeline {
    /* Container cho timeline */
}

.timeline-step {
    display: flex;
    gap: 16px;
    position: relative;
}

.timeline-marker {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.timeline-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #e5e7eb;
    border: 3px solid #ffffff;
    box-shadow: 0 0 0 2px #e5e7eb;
    z-index: 1;
}

.timeline-step.active .timeline-dot {
    background: #3b82f6;
    box-shadow: 0 0 0 2px #3b82f6;
}

.timeline-step.completed .timeline-dot {
    background: #10b981;
    box-shadow: 0 0 0 2px #10b981;
}

.timeline-line {
    width: 2px;
    flex: 1;
    background: #e5e7eb;
    margin-top: 4px;
}

.timeline-step.completed .timeline-line {
    background: #10b981;
}

.timeline-content {
    padding-bottom: 24px;
}

.timeline-title {
    font-size: 15px;
    font-weight: 600;
    color: #6b7280;
    margin-bottom: 4px;
}

.timeline-step.active .timeline-title,
.timeline-step.completed .timeline-title {
    color: #111827;
}

.timeline-date {
    font-size: 13px;
    color: #9ca3af;
}

/* Actions */
.actions-section {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.action-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 20px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
    color: #374151;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.action-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.action-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.cancel-button {
    border-color: #fca5a5;
    color: #dc2626;
}

.cancel-button:hover:not(:disabled) {
    background: #fef2f2;
    border-color: #dc2626;
}

.reorder-button {
    border-color: #93c5fd;
    color: #2563eb;
}

.reorder-button:hover:not(:disabled) {
    background: #eff6ff;
    border-color: #2563eb;
}

.support-button {
    border-color: #d1d5db;
    color: #6b7280;
}

.support-button:hover {
    background: #f9fafb;
    border-color: #9ca3af;
}

/* Status Badge Colors (same as OrderCard) */
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

/* Responsive */
@media (max-width: 1024px) {
    .order-body {
        grid-template-columns: 1fr;
    }

    .sidebar-column {
        order: 2;
    }
}

@media (max-width: 768px) {
    .order-detail-page {
        padding: 16px;
    }

    .order-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
    }

    .header-left {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .order-title {
        font-size: 22px;
    }

    .product-row {
        flex-direction: column;
    }

    .product-price {
        text-align: left;
    }

    .section {
        padding: 16px;
    }
}
</style>
