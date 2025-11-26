<template>
  <div class="return-history-page">
    <div class="container pt-4 pb-5">
      <div
        class="header-bar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4"
      >
        <h2 class="page-title mb-0">Lịch sử trả hàng của bạn</h2>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="fetchHistory" :disabled="loadingHistory">
            <i class="bi bi-arrow-clockwise me-1" :class="{ spinning: loadingHistory }"></i>
            Làm mới
          </button>
          <button class="btn btn-secondary" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>
            Quay lại
          </button>
        </div>
      </div>

      <div class="card shadow-sm border-0 history-card">
        <div class="card-body p-0">
          <div v-if="loadingHistory" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Đang tải lịch sử trả hàng...</p>
          </div>

          <div v-else-if="history.length === 0" class="text-center py-5">
            <i class="bi bi-inbox text-muted" style="font-size: 3rem"></i>
            <p class="mt-3 text-muted mb-0">Bạn chưa có yêu cầu trả hàng nào.</p>
            <button class="btn btn-primary mt-3" @click="goBack">
              <i class="bi bi-plus-circle me-1"></i>
              Tạo yêu cầu trả hàng
            </button>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Mã yêu cầu</th>
                  <th>Mã hóa đơn</th>
                  <th>Loại yêu cầu</th>
                  <th>Ngày yêu cầu</th>
                  <th>Lý do</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in history" :key="item.id">
                  <td class="fw-semibold">
                    {{ item.maYeuCau || shortId(item.id) }}
                  </td>
                  <td>{{ item.maHoaDon || '—' }}</td>
                  <td>
                    <span :class="['badge', item.loaiYeuCau === 0 ? 'bg-info' : 'bg-warning']">
                      {{
                        item.loaiYeuCauDisplay || (item.loaiYeuCau === 0 ? 'Đổi trả' : 'Bảo hành')
                      }}
                    </span>
                  </td>
                  <td>{{ formatDate(item.ngayYeuCau) }}</td>
                  <td class="text-truncate" style="max-width: 200px" :title="item.lyDoTraHang">
                    {{ item.lyDoTraHang || '—' }}
                  </td>
                  <td>
                    <span :class="['badge', getStatusClass(item.trangThai)]">
                      {{ getStatusText(item.trangThai) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import returnHistoryService from '@/service/customer/returnHistoryService'

const router = useRouter()
const history = ref([])
const loadingHistory = ref(false)

const fetchHistory = async () => {
  loadingHistory.value = true
  try {
    const data = await returnHistoryService.fetchAll()
    history.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Lỗi tải lịch sử trả hàng:', error)
    history.value = []
  } finally {
    loadingHistory.value = false
  }
}

const goBack = () => {
  router.push('/account/return-request')
}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date)) return '—'
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const getStatusText = (status) => {
  switch (status) {
    case 0:
      return 'Chờ duyệt'
    case 1:
      return 'Đã duyệt'
    case 2:
      return 'Từ chối'
    case 3:
      return 'Hoàn tất'
    default:
      return 'Không xác định'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 0:
      return 'bg-warning text-dark'
    case 1:
      return 'bg-primary'
    case 2:
      return 'bg-danger'
    case 3:
      return 'bg-success'
    default:
      return 'bg-secondary'
  }
}

const shortId = (id) => {
  if (!id) return '—'
  return `${id.slice(0, 8)}...${id.slice(-4)}`
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.return-history-page {
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
}

.page-title {
  font-weight: 700;
  color: #212529;
}

.history-card {
  background-color: #ffffff;
  border: 1px solid #e9ecef;
}

.history-card table {
  background-color: #ffffff;
}

.history-card table thead th {
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.05em;
  background-color: #ffffff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 1.25rem;
  color: #495057;
  font-weight: 600;
}

.history-card table tbody td {
  vertical-align: middle;
  padding: 1rem 1.25rem;
  border-color: #e9ecef;
  background-color: #ffffff;
  color: #212529;
}

.history-card table tbody tr {
  background-color: #ffffff;
  border-bottom: 1px solid #f1f3f5;
}

.history-card table tbody tr:hover {
  background-color: #f8f9fa;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
