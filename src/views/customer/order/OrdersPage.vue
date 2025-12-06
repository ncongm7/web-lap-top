<template>
    <div class="orders-page">
        <!-- Page Header -->
        <div class="page-header">
            <div class="header-content">
                <div>
                    <h1 class="page-title">
                        <svg class="title-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Đơn Hàng Của Tôi
                    </h1>
                    <p class="page-subtitle">Quản lý và theo dõi đơn hàng của bạn</p>
                </div>
                <div v-if="totalElements > 0" class="header-stats">
                    <span class="stat-badge">{{ totalElements }} đơn hàng</span>
                </div>
            </div>
        </div>

        <!-- Toolbar: Filters & Search -->
        <div class="toolbar">
            <!-- Status Tabs -->
            <div class="status-tabs">
                <button v-for="tab in statusTabs" :key="tab.value"
                    :class="['tab-button', { active: selectedStatus === tab.value }]"
                    @click="handleStatusChange(tab.value)">
                    {{ tab.label }}
                </button>
            </div>

            <!-- Search Box -->
            <div class="search-box">
                <input v-model="searchKeyword" type="text" class="search-input"
                    placeholder="Tìm kiếm theo mã đơn hàng..." @input="handleSearch" />
                <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
            <div class="spinner"></div>
            <p>Đang tải danh sách đơn hàng...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="error-message">{{ error }}</p>
            <button class="retry-button" @click="fetchOrders">Thử lại</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!orders || orders.length === 0" class="empty-container">
            <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 class="empty-title">Chưa có đơn hàng nào</h3>
            <p class="empty-subtitle">
                {{ selectedStatus === null ? 'Bạn chưa có đơn hàng nào.' : 'Không có đơn hàng ở trạng thái này.' }}
            </p>
            <router-link to="/" class="shop-now-button">
                Mua sắm ngay
            </router-link>
        </div>

        <!-- Orders List -->
        <div v-else class="orders-list">
            <OrderCard v-for="order in orders" :key="order.id" :order="order" @click="goToOrderDetail" />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
            <button class="pagination-button" :disabled="currentPage === 0" @click="goToPage(currentPage - 1)">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                Trước
            </button>

            <div class="pagination-info">
                Trang {{ currentPage + 1 }} / {{ totalPages }}
            </div>

            <button class="pagination-button" :disabled="currentPage >= totalPages - 1"
                @click="goToPage(currentPage + 1)">
                Sau
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/customer/authStore'
import orderService from '@/service/customer/orderService'
import OrderCard from '@/components/customer/order/OrderCard.vue'

// Router & Store
const router = useRouter()
const authStore = useAuthStore()

// Helper function để normalize status (number -> string enum)
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

// State
const orders = ref([])
const isLoading = ref(false)
const error = ref(null)

// Filters & Pagination
const selectedStatus = ref(null)
const searchKeyword = ref('')
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

// Status tabs configuration
// Backend API /api/v1/customer/orders không có filter theo trangThai
// Sẽ filter ở client-side sau khi lấy tất cả đơn hàng
const statusTabs = [
    { label: 'Tất cả', value: null },
    { label: 'Chờ thanh toán', value: 'CHO_THANH_TOAN' },
    { label: 'Đã thanh toán', value: 'DA_THANH_TOAN' },
    { label: 'Đang giao', value: 'DANG_GIAO' },
    { label: 'Hoàn thành', value: 'HOAN_THANH' },
    { label: 'Đã hủy', value: 'DA_HUY' }
]

// Methods
const fetchOrders = async () => {
    isLoading.value = true
    error.value = null

    try {
        console.log('🔄 Fetching orders...', {
            page: currentPage.value,
            size: pageSize.value,
            status: selectedStatus.value
        })

        // Lấy khachHangId từ authStore (nhất quán với các component khác)
        const khachHangId = authStore.getCustomerId()

        console.log('🔍 DEBUG - khachHangId from authStore:', khachHangId)
        console.log('🔍 DEBUG - typeof khachHangId:', typeof khachHangId)

        if (!khachHangId) {
            error.value = 'Vui lòng đăng nhập để xem đơn hàng'
            isLoading.value = false
            return
        }

        // Backend API không có filter, lấy tất cả rồi filter ở client-side
        const response = await orderService.getOrders(
            currentPage.value,
            pageSize.value,
            null, // Không gửi status filter vì backend không hỗ trợ
            khachHangId
        )

        console.log('✅ Orders response:', response.data)

        if (response.data && response.data.data) {
            const pageData = response.data.data
            let allOrders = pageData.content || []

            // Filter ở client-side theo selectedStatus
            if (selectedStatus.value) {
                allOrders = allOrders.filter(order => {
                    const orderStatus = normalizeStatus(order.trangThai)
                    return orderStatus === selectedStatus.value
                })
            }

            orders.value = allOrders
            totalPages.value = pageData.totalPages || 0
            totalElements.value = selectedStatus.value ? allOrders.length : pageData.totalElements || 0

            console.log(`📦 Loaded ${orders.value.length} orders (filtered: ${selectedStatus.value || 'none'})`)
        } else {
            orders.value = []
        }
    } catch (err) {
        console.error('❌ Error fetching orders:', err)
        error.value = err.response?.data?.message || 'Không thể tải danh sách đơn hàng. Vui lòng thử lại.'
    } finally {
        isLoading.value = false
    }
}

const handleStatusChange = (status) => {
    selectedStatus.value = status
    currentPage.value = 0 // Reset về trang đầu khi đổi filter
}

const handleSearch = () => {
    // TODO: Implement search logic (debounce)
    console.log('🔍 Search:', searchKeyword.value)
    // Tạm thời chưa implement search, có thể thêm sau
}

const goToPage = (page) => {
    if (page >= 0 && page < totalPages.value) {
        currentPage.value = page
    }
}

const goToOrderDetail = (orderId) => {
    console.log('📄 Navigate to order detail:', orderId)
    router.push(`/orders/${orderId}`)
}

// Watchers
watch([selectedStatus, currentPage], () => {
    fetchOrders()
})

// Lifecycle
onMounted(() => {
    console.log('🎬 OrdersPage mounted')
    fetchOrders()
})
</script>

<style scoped>
.orders-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 24px;
}

/* Page Header */
.page-header {
    margin-bottom: 32px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
}

.page-title {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 32px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
}

.title-icon {
    width: 32px;
    height: 32px;
    color: #3b82f6;
}

.page-subtitle {
    font-size: 16px;
    color: #6b7280;
}

.header-stats {
    display: flex;
    align-items: center;
}

.stat-badge {
    padding: 8px 16px;
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: #ffffff;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Toolbar */
.toolbar {
    background: #ffffff;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 24px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Status Tabs */
.status-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    overflow-x: auto;
    padding-bottom: 8px;
}

.tab-button {
    padding: 10px 20px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
    color: #6b7280;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
}

.tab-button:hover {
    border-color: #3b82f6;
    color: #3b82f6;
}

.tab-button.active {
    background: #3b82f6;
    border-color: #3b82f6;
    color: #ffffff;
}

/* Search Box */
.search-box {
    position: relative;
}

.search-input {
    width: 100%;
    padding: 12px 40px 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s ease;
}

.search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    height: 20px;
    color: #9ca3af;
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    color: #6b7280;
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

/* Error State */
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
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
    transition: all 0.2s ease;
}

.retry-button:hover {
    background: #2563eb;
}

/* Empty State */
.empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
}

.empty-icon {
    width: 80px;
    height: 80px;
    color: #9ca3af;
    margin-bottom: 24px;
}

.empty-title {
    font-size: 24px;
    font-weight: 700;
    color: #111827;
    margin-bottom: 8px;
}

.empty-subtitle {
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 32px;
    text-align: center;
}

.shop-now-button {
    padding: 12px 32px;
    background: #3b82f6;
    color: #ffffff;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s ease;
}

.shop-now-button:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Orders List */
.orders-list {
    /* OrderCard components sẽ render ở đây */
}

/* Pagination */
.pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    margin-top: 32px;
    padding: 20px;
}

.pagination-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #ffffff;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    color: #374151;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.pagination-button:hover:not(:disabled) {
    border-color: #3b82f6;
    color: #3b82f6;
}

.pagination-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
}

/* Responsive */
@media (max-width: 768px) {
    .orders-page {
        padding: 16px;
    }

    .header-content {
        flex-direction: column;
        align-items: flex-start;
    }

    .page-title {
        font-size: 24px;
    }

    .title-icon {
        width: 24px;
        height: 24px;
    }

    .page-subtitle {
        font-size: 14px;
    }

    .stat-badge {
        font-size: 12px;
        padding: 6px 12px;
    }

    .toolbar {
        padding: 16px;
    }

    .status-tabs {
        gap: 6px;
    }

    .tab-button {
        padding: 8px 16px;
        font-size: 13px;
    }

    .pagination {
        flex-wrap: wrap;
        gap: 12px;
    }

    .pagination-button {
        padding: 8px 16px;
        font-size: 13px;
    }
}
</style>
