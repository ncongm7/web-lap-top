<template>
  <div class="orders-page">
    <div class="container">
      <h2 class="page-title">Đơn hàng của tôi</h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-2 text-muted">Đang tải...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-5">
        <p class="text-muted mb-3">Bạn chưa có đơn hàng nào</p>
        <router-link to="/" class="btn btn-primary">Tiếp tục mua sắm</router-link>
      </div>

      <!-- Orders List -->
      <div v-else class="orders-list">
        <div v-for="order in orders" :key="order.id" class="order-card" @click="goToOrderDetail(order.id)" style="cursor: pointer;">
          <div class="order-header">
            <div>
              <h5 class="mb-1">Mã đơn: {{ order.ma }}</h5>
              <p class="text-muted small mb-0">{{ formatDate(order.ngayTao) }}</p>
            </div>
            <span :class="['badge', getStatusBadgeClass(order.trangThai)]">
              {{ getStatusLabel(order.trangThai) }}
            </span>
          </div>

          <div class="order-body">
            <div class="row">
              <div class="col-md-8">
                <p class="mb-1"><strong>Địa chỉ:</strong> {{ order.diaChi }}</p>
                <p class="mb-2"><strong>SĐT:</strong> {{ order.sdt }}</p>
                <div class="products-list">
                  <strong>Sản phẩm:</strong>
                  <ul class="mb-0">
                    <li v-for="(item, idx) in (order.chiTietList || []).slice(0, 3)" :key="idx">
                      {{ item.tenSanPham || 'Sản phẩm' }} x{{ item.soLuong }}
                    </li>
                    <li v-if="(order.chiTietList || []).length > 3" class="text-muted">
                      ... và {{ (order.chiTietList || []).length - 3 }} sản phẩm khác
                    </li>
                  </ul>
                </div>
              </div>
              <div class="col-md-4 text-md-end">
                <div class="order-total">
                  <p class="mb-2"><strong>Tổng tiền:</strong></p>
                  <h4 class="text-success">{{ formatPrice(order.tongTienSauGiam) }}</h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <nav v-if="totalPages > 1" class="mt-4">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 0 }">
              <a class="page-link" href="#" @click.prevent="prevPage">Trước</a>
            </li>
            <li
              v-for="page in visiblePages"
              :key="page"
              class="page-item"
              :class="{ active: page === currentPage }"
            >
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page + 1 }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage >= totalPages - 1 }">
              <a class="page-link" href="#" @click.prevent="nextPage">Sau</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/customer/authStore'
import orderService from '@/service/customer/orderService'

const router = useRouter()

const authStore = useAuthStore()

// State
const orders = ref([])
const loading = ref(false)
const currentPage = ref(0)
const pageSize = ref(10)
const totalPages = ref(0)
const totalElements = ref(0)

// Load orders
const fetchOrders = async () => {
  loading.value = true
  try {
    const customerId = authStore.getCustomerId()
    if (!customerId) {
      console.error('Customer ID not found')
      return
    }

    // Sửa thứ tự parameters: page, size, status, khachHangId
    const response = await orderService.getOrders(
      currentPage.value,
      pageSize.value,
      null, // status - không filter theo status ở đây
      customerId // khachHangId - bắt buộc
    )

    // Parse response structure
    let pageData = {}
    if (response && response.data) {
      if (response.data.data && response.data.data.content !== undefined) {
        pageData = response.data.data
      } else if (response.data.content !== undefined) {
        pageData = response.data
      }
    }

    orders.value = pageData.content || []
    totalPages.value = pageData.totalPages || 0
    totalElements.value = pageData.totalElements || 0
  } catch (error) {
    console.error('Error fetching orders:', error)
    alert('Không thể tải danh sách đơn hàng. Vui lòng thử lại!')
  } finally {
    loading.value = false
  }
}

// Computed
const visiblePages = computed(() => {
  const maxVisible = 5
  const pages = []
  let start = Math.max(0, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible)

  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible)
  }

  for (let i = start; i < end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0)
}

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getStatusLabel = (trangThai) => {
  const labels = {
    CHO_THANH_TOAN: 'Chờ thanh toán',
    DA_THANH_TOAN: 'Đã thanh toán',
    DANG_GIAO: 'Đang giao hàng',
    HOAN_THANH: 'Hoàn thành',
    DA_HUY: 'Đã hủy',
  }
  return labels[trangThai] || trangThai
}

const getStatusBadgeClass = (trangThai) => {
  const classes = {
    CHO_THANH_TOAN: 'bg-warning',
    DA_THANH_TOAN: 'bg-info',
    DANG_GIAO: 'bg-primary',
    HOAN_THANH: 'bg-success',
    DA_HUY: 'bg-danger',
  }
  return classes[trangThai] || 'bg-secondary'
}

const goToPage = (page) => {
  currentPage.value = page
  fetchOrders()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value - 1) {
    currentPage.value++
    fetchOrders()
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
    fetchOrders()
  }
}

const goToOrderDetail = (orderId) => {
  if (orderId) {
    router.push(`/orders/${orderId}`)
  }
}

// Lifecycle
onMounted(() => {
  fetchOrders()
})
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background-color: #ffffff;
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 60px);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 24px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.order-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.order-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: #047857;
}

.order-header {
  background-color: #047857;
  color: #ffffff;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-header h5 {
  color: #ffffff;
  margin: 0;
  font-size: 18px;
}

.order-body {
  padding: 20px;
}

.products-list {
  margin-top: 12px;
}

.products-list ul {
  list-style: none;
  padding-left: 0;
  margin-top: 8px;
}

.products-list li {
  padding: 4px 0;
  font-size: 14px;
  color: #64748b;
}

.order-total {
  margin-top: 12px;
}

.order-total h4 {
  color: #047857;
  font-weight: 700;
}

.badge {
  padding: 6px 12px;
  font-size: 14px;
  font-weight: 500;
}

@media (max-width: 768px) {
  .order-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-total {
    margin-top: 20px;
    text-align: left !important;
  }
}
</style>
