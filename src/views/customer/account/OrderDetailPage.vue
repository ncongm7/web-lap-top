<template>
  <div class="order-detail-page">
    <div class="container py-4">
      <div class="d-flex align-items-center mb-4">
        <router-link to="/account/orders" class="btn btn-outline-secondary me-3">
          <i class="bi bi-arrow-left"></i> Quay lại
        </router-link>
        <h2 class="mb-0">Chi tiết đơn hàng</h2>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-2 text-muted">Đang tải chi tiết đơn hàng...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- Order Detail -->
      <div v-else-if="order" class="card">
        <div class="card-header bg-primary text-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Mã đơn hàng: {{ order.ma }}</h5>
            <span :class="['badge', getStatusBadgeClass(order.trangThai)]">
              {{ getStatusLabel(order.trangThai) }}
            </span>
          </div>
        </div>
        <div class="card-body">
          <!-- Order Info -->
          <div class="row mb-4">
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Thông tin đơn hàng</h6>
              <table class="table table-sm table-borderless">
                <tr>
                  <td class="text-muted" style="width: 40%">Mã đơn:</td>
                  <td class="fw-semibold">{{ order.ma }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Ngày đặt:</td>
                  <td class="fw-semibold">{{ formatDate(order.ngayTao) }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Trạng thái:</td>
                  <td>
                    <span :class="['badge', getStatusBadgeClass(order.trangThai)]">
                      {{ getStatusLabel(order.trangThai) }}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            <div class="col-md-6">
              <h6 class="fw-bold mb-3">Thông tin giao hàng</h6>
              <table class="table table-sm table-borderless">
                <tr>
                  <td class="text-muted" style="width: 40%">Người nhận:</td>
                  <td class="fw-semibold">{{ order.tenKhachHang }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Số điện thoại:</td>
                  <td class="fw-semibold">{{ order.sdt }}</td>
                </tr>
                <tr>
                  <td class="text-muted">Địa chỉ:</td>
                  <td class="fw-semibold">{{ order.diaChi }}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Products List -->
          <div class="mb-4">
            <h6 class="fw-bold mb-3">Danh sách sản phẩm</h6>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Tên sản phẩm</th>
                    <th class="text-center">Số lượng</th>
                    <th class="text-end">Đơn giá</th>
                    <th class="text-end">Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in order.chiTietList" :key="item.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ item.tenSanPham || 'Sản phẩm' }}</td>
                    <td class="text-center">{{ item.soLuong }}</td>
                    <td class="text-end">{{ formatPrice(item.donGia) }}</td>
                    <td class="text-end fw-bold">{{ formatPrice(item.thanhTien) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="row">
            <div class="col-md-6 offset-md-6">
              <div class="card bg-light">
                <div class="card-body">
                  <h6 class="fw-bold mb-3">Tổng kết đơn hàng</h6>
                  <div class="d-flex justify-content-between mb-2">
                    <span>Tổng tiền hàng:</span>
                    <span>{{ formatPrice(order.tongTien) }}</span>
                  </div>
                  <div
                    v-if="order.tienDuocGiam && order.tienDuocGiam > 0"
                    class="d-flex justify-content-between mb-2 text-danger"
                  >
                    <span>Giảm giá:</span>
                    <span>-{{ formatPrice(order.tienDuocGiam) }}</span>
                  </div>
                  <hr />
                  <div class="d-flex justify-content-between">
                    <strong>Tổng thanh toán:</strong>
                    <strong class="text-danger fs-5">{{
                      formatPrice(order.tongTienSauGiam)
                    }}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Ghi chú -->
          <div v-if="order.ghiChu" class="alert alert-info mt-3 mb-0">
            <strong>Ghi chú:</strong> {{ order.ghiChu }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import orderService from '@/service/customer/orderService'

const route = useRoute()

const order = ref(null)
const loading = ref(false)
const error = ref(null)

// Load order detail
onMounted(async () => {
  await loadOrderDetail()
})

const loadOrderDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await orderService.getOrderDetail(route.params.id)

    // Parse response
    if (response && response.data) {
      if (response.data.data) {
        order.value = response.data.data
      } else {
        order.value = response.data
      }
    } else {
      order.value = response
    }
  } catch (err) {
    console.error('Error loading order detail:', err)
    error.value = err.response?.data?.message || 'Không thể tải chi tiết đơn hàng'
  } finally {
    loading.value = false
  }
}

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
</script>

<style scoped>
.order-detail-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.card {
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge {
  font-size: 0.9rem;
  padding: 6px 12px;
}
</style>
