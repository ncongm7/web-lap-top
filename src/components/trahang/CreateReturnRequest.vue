<template>
  <div class="create-return-request">
    <div class="container">
      <h2 class="page-title mb-4">Tạo yêu cầu trả hàng</h2>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Đang tải danh sách đơn hàng...</p>
      </div>

      <div v-else-if="error" class="alert alert-danger">
        <h5>Lỗi</h5>
        <p>{{ error }}</p>
        <button class="btn btn-secondary" @click="resetError">Thử lại</button>
      </div>

      <div v-else>
        <div v-if="step !== 3">
          <!-- Order selection -->
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Chọn hóa đơn cần trả/bảo hành</h5>
            </div>
            <div class="card-body">
              <div v-if="orders.length === 0" class="alert alert-info">
                <h6 class="alert-heading">Không có đơn hàng phù hợp</h6>
                <p class="mb-0">Bạn chưa có đơn hàng nào đủ điều kiện để trả hàng/bảo hành.</p>
                <p class="mb-0 mt-2">
                  <strong>Điều kiện:</strong> Chỉ các đơn hàng đã thanh toán, đang giao hoặc hoàn
                  thành mới có thể yêu cầu.
                </p>
                <p class="mb-0 mt-2">Các đơn chờ thanh toán hoặc đã hủy sẽ không đủ điều kiện.</p>
              </div>
              <div v-else>
                <p class="text-muted mb-3">
                  Tick vào hóa đơn ở bảng dưới để hệ thống tự động tính số ngày sau mua, kiểm tra
                  điều kiện và gợi ý trả hàng/bảo hành.
                </p>
                <div class="table-responsive">
                  <table class="table table-hover align-middle return-order-table">
                    <thead>
                      <tr>
                        <th style="width: 50px"></th>
                        <th>Mã đơn</th>
                        <th>Ngày mua</th>
                        <th>Trạng thái</th>
                        <th class="text-end">Tổng tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="order in orders"
                        :key="order.id"
                        :class="{ 'table-active': isOrderSelected(order.id) }"
                        class="selectable-row"
                        @click="toggleOrderSelection(order.id)"
                      >
                        <td>
                          <input
                            type="checkbox"
                            class="form-check-input"
                            :checked="isOrderSelected(order.id)"
                            @click.stop="toggleOrderSelection(order.id)"
                          />
                        </td>
                        <td class="fw-semibold">{{ order.ma }}</td>
                        <td>{{ formatDate(order.ngayTao) }}</td>
                        <td>
                          <span class="badge bg-light text-dark">{{
                            getStatusLabel(order.trangThai)
                          }}</span>
                        </td>
                        <td class="text-end">
                          {{ formatPrice(order.tongTienSauGiam || order.tongTien) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p v-if="selectedHoaDonId" class="text-success small mt-3 mb-0">
                  ✔ Hệ thống đang phân tích đơn hàng <strong>{{ selectedOrderCode }}</strong> để
                  đưa ra gợi ý phù hợp.
                </p>
                <div
                  v-if="loadingCondition"
                  class="alert alert-secondary mt-3 d-flex align-items-center gap-2"
                >
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  <span>Đang phân tích đơn hàng và kiểm tra điều kiện...</span>
                </div>
                <div v-else-if="conditionError" class="alert alert-warning mt-3 mb-0">
                  {{ conditionError }}
                </div>
              </div>
            </div>
          </div>

          <!-- Form -->
          <div class="card mt-4">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Điền form trả/bảo hành</h5>
              <button
                class="btn btn-sm btn-outline-secondary"
                @click="backToStep1"
                v-if="selectedHoaDonId"
              >
                Làm mới lựa chọn
              </button>
            </div>
            <div class="card-body">
              <div v-if="!selectedHoaDonId" class="alert alert-light mb-0">
                Vui lòng chọn một hóa đơn ở bảng phía trên để hệ thống kiểm tra điều kiện trước khi
                nhập form.
              </div>
              <div v-else-if="selectedHoaDonId && !conditionInfo">
                <div class="d-flex flex-column align-items-center py-4 text-muted">
                  <span class="spinner-border text-primary mb-3" role="status"></span>
                  <p class="mb-0 text-center">
                    Hệ thống đang phân tích hóa đơn và chuẩn bị form. Vui lòng đợi trong giây lát.
                  </p>
                </div>
              </div>
              <div v-else>
                <WarrantyRequestForm
                  v-if="shouldUseWarrantyLayout"
                  mode="return"
                  :condition-info="conditionInfo"
                  :form-data="formData"
                  :loading="submitting"
                  @submit="handleSubmit"
                  @cancel="backToStep1"
                  @update:form-data="updateFormData"
                />
                <ReturnRequestForm
                  v-else
                  :condition-info="conditionInfo"
                  :form-data="formData"
                  :loading="submitting"
                  @submit="handleSubmit"
                  @cancel="backToStep1"
                  @update:form-data="updateFormData"
                />
              </div>
            </div>
          </div>
        </div>

        <div v-else class="step-3">
          <div class="alert alert-success text-center">
            <h4>✅ Yêu cầu đã được gửi thành công!</h4>
            <p class="mb-2">
              Mã yêu cầu: <strong>{{ createdRequest?.maYeuCau }}</strong>
            </p>
            <p class="mb-3">Chúng tôi sẽ xử lý và phản hồi sớm nhất.</p>
            <div>
              <button class="btn btn-primary me-2" @click="resetForm">Tạo yêu cầu mới</button>
              <button class="btn btn-secondary" @click="$router.push('/orders')">
                Xem đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/customer/authStore'
import orderService from '@/service/customer/orderService'
import traHangService from '@/service/trahang/traHangService'
import ReturnRequestForm from './ReturnRequestForm.vue'
import WarrantyRequestForm from '@/components/baohanh/WarrantyRequestForm.vue'

const authStore = useAuthStore()

const step = ref(1)
const loading = ref(false)
const loadingCondition = ref(false)
const submitting = ref(false)
const error = ref(null)
const conditionError = ref(null)
const orders = ref([])
const selectedHoaDonId = ref('')
const conditionInfo = ref(null)
const createdRequest = ref(null)

const buildEmptyForm = () => ({
  idHoaDon: '',
  idKhachHang: '',
  idHoaDonChiTiet: '',
  idSerialDaBan: null,
  lyDoTraHang: '',
  tinhTrangLucTra: '',
  moTaTinhTrang: '',
  loaiYeuCau: null,
  soLuong: 1,
  hinhAnh: [],
})

const formData = ref(buildEmptyForm())

const selectedOrder = computed(
  () => orders.value.find((order) => order.id === selectedHoaDonId.value) || null,
)
const selectedOrderCode = computed(() => selectedOrder.value?.ma || '')
const shouldUseWarrantyLayout = computed(() => {
  if (!conditionInfo.value) return false
  const days = Number(conditionInfo.value.soNgaySauMua)
  if (!Number.isFinite(days)) {
    return false
  }
  return days <= 7
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0)
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

const isOrderSelected = (orderId) => selectedHoaDonId.value === orderId

const toggleOrderSelection = (orderId) => {
  selectedHoaDonId.value = selectedHoaDonId.value === orderId ? '' : orderId
  handleHoaDonChange()
}

const loadOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const customerId = authStore.getCustomerId()
    if (!customerId) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }
    const response = await orderService.getOrders(0, 100, null, customerId)

    let pageData = {}
    if (response && response.data) {
      if (response.data.data && response.data.data.content !== undefined) {
        pageData = response.data.data
      } else if (response.data.content !== undefined) {
        pageData = response.data
      }
    }

    const allOrders = pageData.content || []
    const now = Date.now()
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
    orders.value = allOrders
      .filter((order) => {
        if (
          order.trangThai !== 'DA_THANH_TOAN' &&
          order.trangThai !== 'DANG_GIAO' &&
          order.trangThai !== 'HOAN_THANH'
        ) {
          return false
        }
        if (!order.ngayTao) return false
        const orderDate = new Date(order.ngayTao).getTime()
        if (Number.isNaN(orderDate)) return false
        return now - orderDate <= sevenDaysMs
      })
      .sort((a, b) => new Date(b.ngayTao || 0) - new Date(a.ngayTao || 0))
  } catch (err) {
    error.value = err.message || 'Không thể tải danh sách đơn hàng'
  } finally {
    loading.value = false
  }
}

const handleHoaDonChange = () => {
  conditionInfo.value = null
  conditionError.value = null
  formData.value = buildEmptyForm()
  step.value = 1
  if (!selectedHoaDonId.value) return
  loadConditionInfo()
}

const loadConditionInfo = async () => {
  if (!selectedHoaDonId.value) {
    alert('Vui lòng chọn hóa đơn')
    return
  }

  loadingCondition.value = true
  error.value = null
  conditionError.value = null
  try {
    const response = await traHangService.kiemTraDieuKien(selectedHoaDonId.value)

    if (response && response.data) {
      conditionInfo.value = response.data.data || response.data

      const allowReturn = !!conditionInfo.value.coTheTraHang
      const allowWarranty = !!conditionInfo.value.coTheBaoHanh

      if (!allowReturn && !allowWarranty) {
        conditionError.value =
          conditionInfo.value.goiY ||
          'Đơn hàng này chưa đủ điều kiện để trả hàng/bảo hành. Vui lòng liên hệ hỗ trợ.'
        return
      }

      const customerId = authStore.getCustomerId()
      const firstProduct = conditionInfo.value.danhSachSanPham?.[0]
      formData.value = {
        ...buildEmptyForm(),
        idHoaDon: selectedHoaDonId.value,
        idKhachHang: customerId,
        idHoaDonChiTiet: firstProduct?.idHoaDonChiTiet || '',
      }

      if (conditionInfo.value.soNgaySauMua <= 7 && allowReturn) {
        formData.value.loaiYeuCau = 0
      } else if (allowWarranty) {
        formData.value.loaiYeuCau = 1
      } else if (allowReturn) {
        formData.value.loaiYeuCau = 0
      }

      step.value = 2
    }
  } catch (err) {
    const message = err.response?.data?.message || err.message || 'Không thể kiểm tra điều kiện'
    error.value = message
    conditionError.value = message
    alert(message)
  } finally {
    loadingCondition.value = false
  }
}

const updateFormData = (newFormData) => {
  formData.value = { ...newFormData }
}

const handleSubmit = async (submitData) => {
  submitting.value = true
  error.value = null
  try {
    const response = await traHangService.taoYeuCau(submitData)

    if (response && response.data) {
      createdRequest.value = response.data.data || response.data
      step.value = 3
    }
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Không thể tạo yêu cầu'
    alert(error.value)
  } finally {
    submitting.value = false
  }
}

const backToStep1 = () => {
  selectedHoaDonId.value = ''
  conditionInfo.value = null
  conditionError.value = null
  formData.value = buildEmptyForm()
  step.value = 1
}

const resetForm = () => {
  selectedHoaDonId.value = ''
  conditionInfo.value = null
  conditionError.value = null
  createdRequest.value = null
  formData.value = buildEmptyForm()
  step.value = 1
}

const resetError = () => {
  error.value = null
  loadOrders()
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.create-return-request {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 40px 0;
  box-sizing: border-box;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
}

.card {
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-header {
  background-color: #047857;
  color: white;
  border-radius: 8px 8px 0 0 !important;
}

.card-header h5 {
  color: white;
}

.step-3 .alert {
  border-radius: 8px;
  padding: 30px;
}

.return-order-table thead th {
  background-color: #f8fafc;
  font-weight: 600;
}

.selectable-row {
  cursor: pointer;
}

.selectable-row input[type='checkbox'] {
  cursor: pointer;
}
</style>
