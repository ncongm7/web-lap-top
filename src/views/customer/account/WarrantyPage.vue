<template>
  <div class="warranty-page container py-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <!-- <h2 class="fw-bold mb-0 text-primary">
        <i class="bi bi-shield-check me-2"></i>Bảo hành của tôi
      </h2> -->
      <button class="btn btn-outline-primary" @click="showRequestHistory">
        <i class="bi bi-clock-history me-1"></i> Lịch sử yêu cầu
      </button>
    </div>

    <!-- Switch View: List vs Request Form -->
    <div v-if="!isCreatingRequest">
      <div class="card shadow-sm border-0 mb-4">
        <div class="card-header bg-white py-3">
          <h5 class="mb-0 fw-bold">Sản phẩm đang bảo hành</h5>
        </div>
        <div class="card-body p-0">
          <div v-if="isLoading" class="p-4 text-center">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
          <div v-else-if="warranties.length === 0" class="p-5 text-center text-muted">
            <i class="bi bi-box-seam display-1 d-block mb-3"></i>
            <p>Bạn chưa có sản phẩm nào đang trong thời gian bảo hành hoặc chưa mua hàng.</p>
            <router-link to="/products" class="btn btn-primary mt-2">Mua sắm ngay</router-link>
          </div>
          <div v-else class="table-responsive">
            <table class="table table-hover mb-0 align-middle">
              <thead class="bg-light">
                <tr>
                  <th class="ps-4">Sản phẩm</th>
                  <th>Serial Number</th>
                  <th>Trạng thái</th>
                  <th class="text-end pe-4">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in warranties" :key="item.id">
                  <td class="ps-4">
                    <span class="fw-medium">{{ item.tenSanPham || 'Sản phẩm' }}</span>
                    <br>
                    <small class="text-muted">Mã: {{ item.maCtsp }}</small>
                  </td>
                  <td>
                    <span class="font-monospace bg-light px-2 py-1 rounded">{{ item.serialNo }}</span>
                  </td>
                  <td>
                    <span class="badge bg-success rounded-pill" v-if="item.trangThai === 2">Đã mua</span>
                    <span class="badge bg-warning text-dark rounded-pill" v-else-if="item.trangThai === 1">Chưa kích
                      hoạt</span>
                    <span class="badge bg-secondary rounded-pill" v-else>{{ item.trangThaiText || 'Không xác định'
                      }}</span>
                  </td>
                  <td class="text-end pe-4">
                    <button class="btn btn-sm btn-primary" @click="createRequest(item)">
                      <i class="bi bi-wrench-adjustable me-1"></i> Báo lỗi
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="alert alert-info border-0 shadow-sm">
        <i class="bi bi-info-circle-fill me-2"></i>
        Để yêu cầu bảo hành cho sản phẩm không có trong danh sách, vui lòng liên hệ hotline: <strong>1900 1234</strong>
      </div>
    </div>

    <!-- Create Request Component -->
    <div v-else>
      <div class="mb-3">
        <button class="btn btn-link text-decoration-none ps-0" @click="isCreatingRequest = false">
          <i class="bi bi-arrow-left me-1"></i> Quay lại danh sách
        </button>
      </div>
      <CreateWarrantyRequest :selectedSerial="selectedSerialForRequest" @request-created="handleRequestCreated" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import warrantyService from '@/service/customer/warrantyService'
import CreateWarrantyRequest from '@/components/baohanh/CreateWarrantyRequest.vue'
import { useToast } from 'vue-toastification'

const router = useRouter()
const toast = useToast()
const warranties = ref([])
const isLoading = ref(false)
const isCreatingRequest = ref(false)
const selectedSerialForRequest = ref(null)

onMounted(async () => {
  await fetchWarranties()
})

const fetchWarranties = async () => {
  try {
    isLoading.value = true
    warranties.value = await warrantyService.getMyWarranties()
  } catch (error) {
    console.error(error)
    toast.error('Không thể tải danh sách bảo hành')
  } finally {
    isLoading.value = false
  }
}

const createRequest = (item) => {
  selectedSerialForRequest.value = item
  isCreatingRequest.value = true
}

const showRequestHistory = () => {
  router.push('/account/warranty/history')
}

const handleRequestCreated = () => {
  isCreatingRequest.value = false
  selectedSerialForRequest.value = null
  toast.success('Yêu cầu bảo hành đã được gửi')
  // Maybe refresh?
}
</script>

<style scoped>
.warranty-page {
  min-height: 80vh;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  color: #6c757d;
}
</style>
