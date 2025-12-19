<template>
  <div class="warranty-tracking-page">
    <div class="container pt-4 pb-5">
      <div class="header-bar d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h2 class="page-title mb-1">Theo dõi bảo hành</h2>
          <p class="text-muted mb-0" v-if="warranty">
            Mã phiếu: <strong>{{ warranty.maPhieuBaoHanh || shortId(warranty.id) }}</strong>
          </p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-outline-primary" @click="fetchWarrantyDetail" :disabled="loading">
            <i class="bi bi-arrow-clockwise me-1" :class="{ spinning: loading }"></i>
            Làm mới
          </button>
          <button class="btn btn-secondary" @click="goBack">
            <i class="bi bi-arrow-left me-1"></i>
            Quay lại
          </button>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-3 text-muted">Đang tải thông tin bảo hành...</p>
      </div>

      <div v-else-if="!warranty" class="text-center py-5">
        <i class="bi bi-exclamation-circle text-muted" style="font-size: 3rem"></i>
        <p class="mt-3 text-muted mb-0">Không tìm thấy thông tin bảo hành.</p>
      </div>

      <div v-else>
        <!-- Thông tin cơ bản -->
        <div class="card shadow-sm border-0 mb-4">
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="bi bi-info-circle me-2 text-primary"></i>
              Thông tin bảo hành
            </h5>
            <div class="row g-3">
              <div class="col-md-6">
                <div class="info-item">
                  <label>Sản phẩm:</label>
                  <span>{{ warranty.tenSP || 'N/A' }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <label>Serial/IMEI:</label>
                  <code class="serial-code">{{ warranty.soSerial || 'N/A' }}</code>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <label>Ngày bắt đầu:</label>
                  <span>{{ formatDate(warranty.ngayBatDau) }}</span>
                </div>
              </div>
              <div class="col-md-6">
                <div class="info-item">
                  <label>Ngày kết thúc:</label>
                  <span>{{ formatDate(warranty.ngayKetThuc) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline 7 bước -->
        <div class="card shadow-sm border-0">
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="bi bi-clock-history me-2 text-primary"></i>
              Tiến trình bảo hành
            </h5>
            <div class="warranty-timeline">
              <div
                v-for="(step, index) in timelineSteps"
                :key="index"
                class="timeline-step"
                :class="getStepClass(step.status)"
              >
                <div class="step-icon">
                  <i :class="step.icon"></i>
                </div>
                <div class="step-content">
                  <h6 class="step-title">{{ step.title }}</h6>
                  <p class="step-description">{{ step.description }}</p>
                  <div v-if="step.date" class="step-date">
                    <i class="bi bi-calendar3 me-1"></i>
                    {{ formatDate(step.date) }}
                  </div>
                  <div v-if="step.actions && step.actions.length > 0" class="step-actions mt-2">
                    <button
                      v-for="action in step.actions"
                      :key="action.label"
                      class="btn btn-sm"
                      :class="action.class"
                      @click="handleAction(action.type, action.data)"
                    >
                      <i :class="action.icon" class="me-1"></i>
                      {{ action.label }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Chi phí phát sinh (nếu có) -->
        <div v-if="hasCost" class="card shadow-sm border-0 mt-4">
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="bi bi-cash-coin me-2 text-warning"></i>
              Chi phí phát sinh
            </h5>
            <div class="cost-info">
              <div class="cost-item">
                <label>Tổng chi phí:</label>
                <span class="cost-amount">{{ formatCurrency(totalCost) }}</span>
              </div>
              <div v-if="!isPaid" class="mt-3">
                <button class="btn btn-warning" @click="openCostModal">
                  <i class="bi bi-credit-card me-1"></i>
                  Xác nhận thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <WarrantyAppointmentModal
      v-if="showAppointmentModal"
      :phieuHen="selectedPhieuHen"
      @close="showAppointmentModal = false"
      @confirm="handleConfirmAppointment"
    />
    <WarrantyCostModal
      v-if="showCostModal"
      :warranty="warranty"
      :costInfo="costInfo"
      @close="showCostModal = false"
      @confirm="handleConfirmPayment"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import baohanhService from '@/service/baohanh/baohanhService'
import phieuHenBaoHanhService from '@/service/baohanh/phieuHenBaoHanhService'
import WarrantyAppointmentModal from '@/components/baohanh/WarrantyAppointmentModal.vue'
import WarrantyCostModal from '@/components/baohanh/WarrantyCostModal.vue'

const route = useRoute()
const router = useRouter()

const warranty = ref(null)
const lichSuBaoHanh = ref([])
const phieuHenList = ref([])
const loading = ref(false)
const showAppointmentModal = ref(false)
const showCostModal = ref(false)
const selectedPhieuHen = ref(null)
const costInfo = ref(null)

// Timeline steps
const timelineSteps = computed(() => {
  if (!warranty.value) return []

  const isCancelled = warranty.value.trangThai === 5
  const currentStatus = isCancelled ? -1 : warranty.value.trangThai

  const steps = [
    {
      title: 'Đăng ký bảo hành',
      description: 'Yêu cầu bảo hành đã được gửi và đang chờ xử lý',
      icon: 'bi bi-file-earmark-text',
      status: 'completed',
      date: warranty.value.ngayTao,
    },
    {
      title: 'Xác nhận yêu cầu',
      description: 'Hệ thống đã xác nhận yêu cầu bảo hành của bạn',
      icon: 'bi bi-check-circle',
      status: currentStatus >= 1 ? 'completed' : 'pending',
      date: currentStatus >= 1 ? warranty.value.ngayTao : null,
    },
    {
      title: 'Phiếu hẹn',
      description: 'Đã tạo phiếu hẹn, vui lòng xác nhận lịch hẹn',
      icon: 'bi bi-calendar-check',
      status: phieuHenList.value.length > 0 ? (phieuHenList.value[0].trangThai === 1 ? 'completed' : 'active') : 'pending',
      date: phieuHenList.value.length > 0 ? phieuHenList.value[0].ngayHen : null,
      actions: phieuHenList.value.length > 0 && phieuHenList.value[0].trangThai === 0 ? [
        { type: 'confirm-appointment', label: 'Xác nhận lịch hẹn', icon: 'bi bi-check', class: 'btn-primary', data: phieuHenList.value[0] }
      ] : [],
    },
    {
      title: 'Tiếp nhận sản phẩm',
      description: 'Sản phẩm đã được tiếp nhận tại trung tâm bảo hành',
      icon: 'bi bi-box-seam',
      status: currentStatus >= 2 ? 'completed' : 'pending',
      date: lichSuBaoHanh.value.length > 0 ? lichSuBaoHanh.value[0].ngayNhanHang : null,
    },
    {
      title: 'Sửa chữa',
      description: 'Sản phẩm đang được kiểm tra và sửa chữa',
      icon: 'bi bi-tools',
      status: currentStatus >= 3 ? 'completed' : (currentStatus === 2 ? 'active' : 'pending'),
      date: lichSuBaoHanh.value.length > 0 ? lichSuBaoHanh.value[0].ngayTiepNhan : null,
    },
    {
      title: 'Bàn giao',
      description: 'Sản phẩm đã sửa xong, sẵn sàng bàn giao',
      icon: 'bi bi-box-arrow-right',
      status: currentStatus >= 4 ? 'completed' : 'pending',
      date: lichSuBaoHanh.value.length > 0 ? lichSuBaoHanh.value[0].ngayBanGiao : null,
    },
    {
      title: 'Hoàn thành',
      description: isCancelled ? 'Bảo hành hủy' : 'Bảo hành đã hoàn tất',
      icon: isCancelled ? 'bi bi-x-circle-fill' : 'bi bi-check-circle-fill',
      status: (currentStatus >= 4 || isCancelled) ? 'completed' : 'pending',
      date: isCancelled ? warranty.value.ngayCapNhat : (currentStatus >= 4 ? lichSuBaoHanh.value[0]?.ngayHoanThanh : null),
    },
  ]

  return steps
})

const hasCost = computed(() => {
  return lichSuBaoHanh.value.some(ls => ls.chiPhiPhatSinh && ls.chiPhiPhatSinh > 0)
})

const totalCost = computed(() => {
  return lichSuBaoHanh.value.reduce((sum, ls) => {
    return sum + (ls.chiPhiPhatSinh || 0)
  }, 0)
})

const isPaid = computed(() => {
  return lichSuBaoHanh.value.every(ls => !ls.chiPhiPhatSinh || ls.chiPhiPhatSinh === 0 || ls.daThanhToan)
})

const getStepClass = (status) => {
  return {
    'step-completed': status === 'completed',
    'step-active': status === 'active',
    'step-pending': status === 'pending',
  }
}

const fetchWarrantyDetail = async () => {
  const id = route.params.id
  if (!id) {
    router.push('/account/warranty')
    return
  }

  loading.value = true
  try {
    // Fetch warranty detail
    const warrantyData = await baohanhService.getWarrantyRequestsByInvoice(route.params.hoaDonId)
    warranty.value = Array.isArray(warrantyData)
      ? warrantyData.find(w => w.id === id)
      : warrantyData

    if (warranty.value) {
      // Fetch lịch sử bảo hành
      // TODO: Call API to get lich su bao hanh

      // Fetch phiếu hẹn
      try {
        const phieuHenData = await phieuHenBaoHanhService.getPhieuHenByBaoHanh(id)
        phieuHenList.value = Array.isArray(phieuHenData) ? phieuHenData : []
      } catch (error) {
        console.error('Lỗi khi tải phiếu hẹn:', error)
        phieuHenList.value = []
      }
    }
  } catch (error) {
    console.error('Lỗi khi tải thông tin bảo hành:', error)
  } finally {
    loading.value = false
  }
}

const handleAction = (type, data) => {
  if (type === 'confirm-appointment') {
    selectedPhieuHen.value = data
    showAppointmentModal.value = true
  }
}

const handleConfirmAppointment = async (phieuHenId) => {
  try {
    await phieuHenBaoHanhService.xacNhanPhieuHen(phieuHenId)
    await fetchWarrantyDetail()
    showAppointmentModal.value = false
  } catch (error) {
    console.error('Lỗi khi xác nhận phiếu hẹn:', error)
    alert('Có lỗi xảy ra khi xác nhận phiếu hẹn')
  }
}

const openCostModal = () => {
  costInfo.value = {
    totalCost: totalCost.value,
    items: lichSuBaoHanh.value.filter(ls => ls.chiPhiPhatSinh && ls.chiPhiPhatSinh > 0),
  }
  showCostModal.value = true
}

const handleConfirmPayment = async () => {
  // TODO: Implement payment confirmation
  showCostModal.value = false
  await fetchWarrantyDetail()
}

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const formatCurrency = (value) => {
  if (!value) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const shortId = (id) => {
  if (!id) return 'N/A'
  return id.substring(0, 8).toUpperCase()
}

const goBack = () => {
  router.push('/account/warranty')
}

onMounted(() => {
  fetchWarrantyDetail()
})
</script>

<style scoped>
.warranty-tracking-page {
  min-height: 100vh;
  background: #f8fafc;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.card {
  border-radius: 12px;
  overflow: hidden;
}

.card-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span {
  font-size: 16px;
  color: #1e293b;
}

.serial-code {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: #475569;
}

.warranty-timeline {
  position: relative;
  padding-left: 40px;
}

.timeline-step {
  position: relative;
  padding-bottom: 32px;
  padding-left: 40px;
}

.timeline-step:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 40px;
  bottom: -32px;
  width: 2px;
  background: #e5e7eb;
}

.timeline-step.step-completed:not(:last-child)::before {
  background: #10b981;
}

.step-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5e7eb;
  color: #9ca3af;
  z-index: 1;
}

.step-completed .step-icon {
  background: #10b981;
  color: #ffffff;
}

.step-active .step-icon {
  background: #2563eb;
  color: #ffffff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.step-content {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.step-completed .step-content {
  border-color: #10b981;
  background: #f0fdf4;
}

.step-active .step-content {
  border-color: #2563eb;
  background: #eff6ff;
}

.step-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.step-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.step-date {
  font-size: 12px;
  color: #9ca3af;
}

.cost-info {
  padding: 16px;
  background: #fffbeb;
  border-radius: 8px;
  border: 1px solid #fde68a;
}

.cost-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cost-item label {
  font-weight: 600;
  color: #92400e;
}

.cost-amount {
  font-size: 24px;
  font-weight: 700;
  color: #d97706;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>

