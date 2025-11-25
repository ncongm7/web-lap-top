<template>
  <div class="create-warranty-request">
    <div class="container">
      <h2 class="page-title mb-4">Tạo yêu cầu bảo hành</h2>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2 text-muted">Đang tải danh sách đơn hàng...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="alert alert-danger">
        <h5>Lỗi</h5>
        <p>{{ error }}</p>
        <button class="btn btn-secondary" @click="resetError">Thử lại</button>
      </div>

      <!-- Main Content -->
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
                <p class="mb-0">Bạn chưa có đơn hàng nào đủ điều kiện để bảo hành.</p>
                <p class="mb-0 mt-2">
                  <strong>Điều kiện:</strong> Chỉ các đơn hàng đã thanh toán, đang giao hàng hoặc
                  hoàn thành mới có thể yêu cầu bảo hành.
                </p>
                <p class="mb-0 mt-2">
                  Các đơn hàng đang chờ thanh toán hoặc đã hủy không thể thực hiện yêu cầu bảo hành.
                </p>
              </div>
              <div v-else>
                <p class="text-muted mb-3">
                  Chọn hóa đơn cần trả/bảo hành bằng cách tick vào ô bên trái. Hệ thống sẽ tự động
                  tính số ngày sau khi mua, kiểm tra tình trạng sản phẩm và đưa ra gợi ý sau khi bạn
                  chọn.
                </p>
                <div class="table-responsive">
                  <table class="table table-hover align-middle warranty-order-table">
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
                  ✔ Hệ thống đang phân tích đơn hàng
                  <strong>{{ selectedOrderCode }}</strong> để đưa ra gợi ý phù hợp.
                </p>
                <div
                  v-if="loadingCondition"
                  class="alert alert-secondary mt-3 d-flex align-items-center gap-2"
                >
                  <span class="spinner-border spinner-border-sm" role="status"></span>
                  <span>Đang phân tích đơn hàng và kiểm tra điều kiện bảo hành...</span>
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

        <!-- Success State -->
        <div v-else class="step-3">
          <div class="alert alert-success text-center">
            <h4>✅ Yêu cầu bảo hành đã được gửi thành công!</h4>
            <p class="mb-2">
              Mã phiếu: <strong>{{ createdRequest?.id }}</strong>
            </p>
            <p class="mb-3">
              Chúng tôi sẽ xử lý yêu cầu bảo hành của bạn trong thời gian sớm nhất.
            </p>
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
import baohanhService from '@/service/baohanh/baohanhService'
import WarrantyRequestForm from './WarrantyRequestForm.vue'

const authStore = useAuthStore()

// State
const step = ref(1) // 1: Chọn hóa đơn, 2: Điền form, 3: Success
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
  soLuong: 1,
  hinhAnh: [],
})

const formData = ref(buildEmptyForm())

const selectedOrder = computed(
  () => orders.value.find((order) => order.id === selectedHoaDonId.value) || null,
)
const selectedOrderCode = computed(() => selectedOrder.value?.ma || '')

// Methods
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
  if (selectedHoaDonId.value === orderId) {
    selectedHoaDonId.value = ''
  } else {
    selectedHoaDonId.value = orderId
  }
  handleHoaDonChange()
}

const loadOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const customerId = authStore.getCustomerId()
    console.log('Loading orders for customer:', customerId)

    if (!customerId) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }

    // Lấy tất cả đơn hàng của khách hàng
    const response = await orderService.getOrders(0, 100, null, customerId)
    console.log('Orders response:', response)

    let pageData = {}
    if (response && response.data) {
      if (response.data.data && response.data.data.content !== undefined) {
        pageData = response.data.data
      } else if (response.data.content !== undefined) {
        pageData = response.data
      }
    }

    // Lấy tất cả đơn hàng (trừ đã hủy) - có thể bảo hành
    // Điều kiện: Đã thanh toán, Đang giao, Hoàn thành
    const allOrders = pageData.content || []
    orders.value = allOrders.filter(
      (order) =>
        order.trangThai === 'DA_THANH_TOAN' ||
        order.trangThai === 'DANG_GIAO' ||
        order.trangThai === 'HOAN_THANH',
    )

    // Sắp xếp theo ngày tạo mới nhất
    orders.value.sort((a, b) => {
      const dateA = new Date(a.ngayTao || 0)
      const dateB = new Date(b.ngayTao || 0)
      return dateB - dateA
    })

    console.log('Filtered orders:', orders.value)
    console.log('Total orders available for warranty:', orders.value.length)

    if (orders.value.length === 0 && allOrders.length > 0) {
      console.warn(
        'Không có đơn hàng nào đủ điều kiện. Chỉ các đơn đã thanh toán, đang giao hoặc hoàn thành mới có thể bảo hành.',
      )
    }
  } catch (err) {
    console.error('Error loading orders:', err)
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

  if (!selectedHoaDonId.value) {
    return
  }

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
    const response = await baohanhService.kiemTraDieuKien(selectedHoaDonId.value)

    if (response && response.data) {
      conditionInfo.value = response.data.data || response.data

      const daysAfterPurchase = conditionInfo.value.soNgaySauMua
      if (typeof daysAfterPurchase === 'number' && daysAfterPurchase > 365) {
        conditionError.value = 'Hóa đơn này đã quá 12 tháng kể từ ngày mua nên không thể bảo hành.'
        loadingCondition.value = false
        return
      }

      // Kiểm tra điều kiện bảo hành
      if (!conditionInfo.value.coTheBaoHanh) {
        conditionError.value =
          conditionInfo.value.goiY ||
          'Hệ thống gợi ý đổi trả đối với sản phẩm này. Vui lòng kiểm tra thông tin trước khi gửi.'
      } else {
        conditionError.value = null
      }

      // Set form data
      const customerId = authStore.getCustomerId()
      const firstProduct = conditionInfo.value.danhSachSanPham?.[0]
      formData.value = {
        ...buildEmptyForm(),
        idHoaDon: selectedHoaDonId.value,
        idKhachHang: customerId,
        idHoaDonChiTiet: firstProduct?.idHoaDonChiTiet || '',
      }

      step.value = 2
    }
  } catch (err) {
    console.error('Error loading condition info:', err)
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
    const response = await baohanhService.taoYeuCau(submitData)

    if (response && response.data) {
      createdRequest.value = response.data.data || response.data
      step.value = 3
    }
  } catch (err) {
    console.error('Error submitting request:', err)
    error.value = err.response?.data?.message || err.message || 'Không thể tạo yêu cầu'
    alert(error.value)
  } finally {
    submitting.value = false
  }
}

const backToStep1 = () => {
  step.value = 1
  conditionInfo.value = null
  selectedHoaDonId.value = ''
}

const resetForm = () => {
  step.value = 1
  selectedHoaDonId.value = ''
  conditionInfo.value = null
  createdRequest.value = null
  conditionError.value = null
  formData.value = buildEmptyForm()
}

const resetError = () => {
  error.value = null
  loadOrders()
}

// Lifecycle
onMounted(() => {
  console.log('CreateWarrantyRequest component mounted')
  console.log('Auth store:', authStore)
  console.log('Customer ID:', authStore.getCustomerId())
  loadOrders()
})
</script>

<style scoped>
.create-warranty-request {
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

.warranty-order-table thead th {
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
