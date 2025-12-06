<template>
  <div class="warranty-history-page">
    <div class="container pt-4 pb-5">
      <div class="header-bar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <h2 class="page-title mb-0">Lịch sử bảo hành của bạn</h2>
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
            <p class="mt-3 text-muted">Đang tải lịch sử bảo hành...</p>
          </div>

          <div v-else-if="history.length === 0" class="text-center py-5">
            <i class="bi bi-inbox text-muted" style="font-size: 3rem"></i>
            <p class="mt-3 text-muted mb-0">Bạn chưa có phiếu bảo hành nào.</p>
            <button class="btn btn-primary mt-3" @click="goBack">
              <i class="bi bi-plus-circle me-1"></i>
              Tạo yêu cầu bảo hành
            </button>
          </div>

          <div v-else class="table-responsive">
            <table class="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Mã phiếu</th>
                  <th>Sản phẩm</th>
                  <th>Serial/IMEI</th>
                  <th>Ngày bắt đầu</th>
                  <th>Ngày kết thúc</th>
                  <th>Trạng thái</th>
                  <th>Phiếu hẹn</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in history" :key="item.id">
                  <td class="fw-semibold">
                    {{ shortId(item.id) }}
                  </td>
                  <td>{{ item.tenSP || 'Sản phẩm không xác định' }}</td>
                  <td>
                    <code v-if="item.soSerial" class="serial-code">{{ item.soSerial }}</code>
                    <span v-else class="text-muted">—</span>
                  </td>
                  <td>{{ formatDate(item.ngayBatDau) }}</td>
                  <td>{{ formatDate(item.ngayKetThuc) }}</td>
                  <td>
                    <span :class="['badge', getStatusClass(item.trangThai)]">
                      {{ getStatusText(item.trangThai) }}
                    </span>
                  </td>
                  <td>
                    <div v-if="item.phieuHen && item.phieuHen.length > 0" class="appointment-info">
                      <div v-for="phieuHen in item.phieuHen" :key="phieuHen.id" class="appointment-badge mb-1">
                        <i class="bi bi-calendar-check me-1"></i>
                        <span class="fw-semibold">{{ phieuHen.maPhieuHen }}</span>
                        <br>
                        <small class="text-muted">
                          {{ formatDate(phieuHen.ngayHen) }} {{ formatTime(phieuHen.gioHen) }}
                        </small>
                        <br>
                        <span :class="['badge badge-sm', getPhieuHenStatusClass(phieuHen.trangThai)]">
                          {{ getPhieuHenStatusText(phieuHen.trangThai) }}
                        </span>
                      </div>
                    </div>
                    <span v-else class="text-muted">—</span>
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
import warrantyHistoryService from '@/service/customer/warrantyHistoryService'
import phieuHenBaoHanhService from '@/service/baohanh/phieuHenBaoHanhService'

const router = useRouter()
const history = ref([])
const loadingHistory = ref(false)

const fetchHistory = async () => {
  loadingHistory.value = true
  try {
    const data = await warrantyHistoryService.fetchAll()
    const warrantyList = Array.isArray(data) ? data : []

    // Fetch phiếu hẹn cho từng bảo hành
    const historyWithPhieuHen = await Promise.all(
      warrantyList.map(async (warranty) => {
        try {
          const phieuHenData = await phieuHenBaoHanhService.getPhieuHenByBaoHanh(warranty.id)
          warranty.phieuHen = Array.isArray(phieuHenData) ? phieuHenData : []
        } catch (error) {
          console.error(`Lỗi khi tải phiếu hẹn cho bảo hành ${warranty.id}:`, error)
          warranty.phieuHen = []
        }
        return warranty
      })
    )

    history.value = historyWithPhieuHen
  } catch (error) {
    console.error('Lỗi tải lịch sử bảo hành:', error)
    history.value = []
  } finally {
    loadingHistory.value = false
  }
}

const goBack = () => {
  router.push('/account/warranty')
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
    case 1:
      return 'Chờ xác nhận'
    case 2:
      return 'Đang xử lý'
    case 3:
      return 'Hoàn thành'
    case 0:
      return 'Từ chối'
    default:
      return 'Không xác định'
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 1:
      return 'bg-warning text-dark'
    case 2:
      return 'bg-primary'
    case 3:
      return 'bg-success'
    case 0:
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

const shortId = (id) => {
  if (!id) return '—'
  return `${id.slice(0, 8)}...${id.slice(-4)}`
}

const formatTime = (time) => {
  if (!time) return ''
  // time có thể là "HH:mm" hoặc LocalTime object
  if (typeof time === 'string') return time
  return time.toString()
}

const getPhieuHenStatusText = (status) => {
  switch (status) {
    case 0:
      return 'Chờ xác nhận'
    case 1:
      return 'Đã xác nhận'
    case 2:
      return 'Đã hủy'
    default:
      return 'Không xác định'
  }
}

const getPhieuHenStatusClass = (status) => {
  switch (status) {
    case 0:
      return 'bg-warning text-dark'
    case 1:
      return 'bg-success'
    case 2:
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.warranty-history-page {
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

.serial-code {
  font-size: 0.85rem;
  color: #e91e63;
  background-color: #fce4ec;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.appointment-info {
  min-width: 200px;
}

.appointment-badge {
  padding: 8px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  font-size: 0.875rem;
}

.badge-sm {
  font-size: 0.75rem;
  padding: 2px 6px;
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
