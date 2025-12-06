<template>
  <div class="modal fade show d-block" tabindex="-1" @click.self="$emit('close')">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content" @click.stop>
        <div class="modal-header bg-warning text-dark">
          <h5 class="modal-title">
            <i class="bi bi-cash-coin me-2"></i>
            Chi phí phát sinh bảo hành
          </h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <div v-if="!costInfo" class="text-center py-4">
            <div class="spinner-border text-warning" role="status"></div>
            <p class="mt-3 text-muted">Đang tải thông tin...</p>
          </div>
          <div v-else>
            <div class="cost-summary mb-4">
              <div class="total-cost">
                <label>Tổng chi phí phát sinh:</label>
                <span class="amount">{{ formatCurrency(costInfo.totalCost) }}</span>
              </div>
            </div>
            
            <div v-if="costInfo.items && costInfo.items.length > 0" class="cost-details">
              <h6 class="mb-3">Chi tiết chi phí:</h6>
              <div class="table-responsive">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Lý do</th>
                      <th class="text-end">Số tiền</th>
                      <th class="text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in costInfo.items" :key="index">
                      <td>{{ item.moTaLoi || 'Chi phí phát sinh' }}</td>
                      <td class="text-end">{{ formatCurrency(item.chiPhiPhatSinh) }}</td>
                      <td class="text-center">
                        <span :class="['badge', item.daThanhToan ? 'bg-success' : 'bg-warning']">
                          {{ item.daThanhToan ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="alert alert-warning mt-3">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Vui lòng thanh toán chi phí phát sinh để tiếp tục quá trình bảo hành.
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Đóng</button>
          <button
            type="button"
            class="btn btn-warning"
            @click="handleConfirmPayment"
            :disabled="loading || !hasUnpaidCost"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="bi bi-credit-card me-2"></i>
            Xác nhận thanh toán
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show"></div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  warranty: {
    type: Object,
    default: null,
  },
  costInfo: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'confirm'])

const loading = ref(false)

const hasUnpaidCost = computed(() => {
  if (!props.costInfo || !props.costInfo.items) return false
  return props.costInfo.items.some(item => !item.daThanhToan)
})

const formatCurrency = (value) => {
  if (!value) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const handleConfirmPayment = async () => {
  loading.value = true
  try {
    // TODO: Implement payment logic
    await new Promise(resolve => setTimeout(resolve, 1000))
    emit('confirm')
  } catch (error) {
    console.error('Lỗi khi xác nhận thanh toán:', error)
    alert('Có lỗi xảy ra khi xác nhận thanh toán')
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

.cost-summary {
  padding: 20px;
  background: #fffbeb;
  border-radius: 8px;
  border: 2px solid #fde68a;
}

.total-cost {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-cost label {
  font-size: 18px;
  font-weight: 600;
  color: #92400e;
}

.total-cost .amount {
  font-size: 28px;
  font-weight: 700;
  color: #d97706;
}

.cost-details {
  margin-top: 24px;
}

.table th {
  background: #f8fafc;
  font-weight: 600;
  color: #475569;
}
</style>

