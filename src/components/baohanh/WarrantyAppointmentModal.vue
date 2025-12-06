<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content" @click.stop>
        <div class="modal-header bg-primary text-white">
          <h5 class="modal-title">
            <i class="bi bi-calendar-check me-2"></i>
            Phiếu hẹn bảo hành
          </h5>
          <button type="button" class="btn-close btn-close-white" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="!phieuHen" class="text-center py-4">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">Đang tải thông tin...</p>
          </div>
          <div v-else>
            <div class="appointment-info">
              <div class="info-row">
                <label>Mã phiếu hẹn:</label>
                <span class="fw-bold">{{ phieuHen.maPhieuHen }}</span>
              </div>
              <div class="info-row">
                <label>Ngày hẹn:</label>
                <span>{{ formatDate(phieuHen.ngayHen) }}</span>
              </div>
              <div class="info-row">
                <label>Giờ hẹn:</label>
                <span>{{ formatTime(phieuHen.gioHen) }}</span>
              </div>
              <div class="info-row">
                <label>Địa điểm:</label>
                <span>{{ phieuHen.diaDiem || 'Trung tâm bảo hành' }}</span>
              </div>
              <div v-if="phieuHen.ghiChu" class="info-row">
                <label>Ghi chú:</label>
                <span>{{ phieuHen.ghiChu }}</span>
              </div>
            </div>
            <div class="alert alert-info mt-3">
              <i class="bi bi-info-circle me-2"></i>
              Vui lòng có mặt đúng giờ hẹn. Nếu cần đổi lịch, vui lòng liên hệ hotline.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Đóng</button>
          <button
            v-if="phieuHen && phieuHen.trangThai === 0"
            type="button"
            class="btn btn-primary"
            @click="handleConfirm"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-check-circle me-2"></i>
            Xác nhận lịch hẹn
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref } from 'vue'
import phieuHenBaoHanhService from '@/service/baohanh/phieuHenBaoHanhService'

const props = defineProps({
  phieuHen: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'confirm'])

const loading = ref(false)

const formatDate = (date) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const formatTime = (time) => {
  if (!time) return '—'
  return time
}

const handleConfirm = async () => {
  if (!props.phieuHen || !props.phieuHen.id) return
  
  loading.value = true
  try {
    await phieuHenBaoHanhService.xacNhanPhieuHen(props.phieuHen.id)
    emit('confirm', props.phieuHen.id)
  } catch (error) {
    console.error('Lỗi khi xác nhận phiếu hẹn:', error)
    alert('Có lỗi xảy ra khi xác nhận phiếu hẹn')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-backdrop {
  z-index: 1050;
}

.appointment-info {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
}

.info-row label {
  font-weight: 600;
  color: #475569;
  min-width: 120px;
}

.info-row span {
  color: #1e293b;
  text-align: right;
}
</style>

