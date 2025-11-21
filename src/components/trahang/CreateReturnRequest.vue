<template>
  <div class="create-return-request">
    <div class="container">
      <h2 class="page-title mb-4">Tạo yêu cầu trả hàng / Bảo hành</h2>

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
        <!-- Step 1: Chọn hóa đơn -->
        <div v-if="step === 1" class="step-1">
          <div class="card">
            <div class="card-header">
              <h5 class="mb-0">Bước 1: Chọn hóa đơn</h5>
            </div>
            <div class="card-body">
              <div v-if="orders.length === 0" class="alert alert-info">
                <h6 class="alert-heading">Không có đơn hàng phù hợp</h6>
                <p class="mb-0">Bạn chưa có đơn hàng nào đủ điều kiện để trả hàng/bảo hành.</p>
                <p class="mb-0 mt-2">
                  <strong>Điều kiện:</strong> Chỉ các đơn hàng đã thanh toán, đang giao hàng hoặc
                  hoàn thành mới có thể yêu cầu trả hàng/bảo hành.
                </p>
                <p class="mb-0 mt-2">
                  Các đơn hàng đang chờ thanh toán hoặc đã hủy không thể thực hiện yêu cầu trả hàng.
                </p>
              </div>
              <div v-else>
                <div class="mb-3">
                  <label class="form-label"
                    >Chọn hóa đơn cần trả/bảo hành <span class="text-danger">*</span></label
                  >
                  <select
                    v-model="selectedHoaDonId"
                    class="form-select"
                    @change="handleHoaDonChange"
                  >
                    <option value="">-- Chọn hóa đơn --</option>
                    <option v-for="order in orders" :key="order.id" :value="order.id">
                      {{ order.ma }} - {{ formatDate(order.ngayTao) }} -
                      {{ formatPrice(order.tongTienSauGiam || order.tongTien) }} -
                      {{ getStatusLabel(order.trangThai) }}
                    </option>
                  </select>
                </div>

                <div v-if="selectedHoaDonId" class="mt-3">
                  <button
                    class="btn btn-primary"
                    @click="loadConditionInfo"
                    :disabled="loadingCondition"
                  >
                    <span
                      v-if="loadingCondition"
                      class="spinner-border spinner-border-sm me-2"
                    ></span>
                    Kiểm tra điều kiện
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Điền form -->
        <div v-if="step === 2" class="step-2">
          <div class="card">
            <div class="card-header d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Bước 2: Điền thông tin yêu cầu</h5>
              <button class="btn btn-sm btn-outline-secondary" @click="backToStep1">
                ← Quay lại
              </button>
            </div>
            <div class="card-body">
              <ReturnRequestForm
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

        <!-- Success State -->
        <div v-if="step === 3" class="step-3">
          <div class="alert alert-success text-center">
            <h4>✅ Yêu cầu đã được gửi thành công!</h4>
            <p class="mb-2">
              Mã yêu cầu: <strong>{{ createdRequest?.maYeuCau }}</strong>
            </p>
            <p class="mb-3">Chúng tôi sẽ xử lý yêu cầu của bạn trong thời gian sớm nhất.</p>
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/customer/authStore'
import orderService from '@/service/customer/orderService'
import traHangService from '@/service/trahang/traHangService'
import ReturnRequestForm from './ReturnRequestForm.vue'

const authStore = useAuthStore()

// State
const step = ref(1) // 1: Chọn hóa đơn, 2: Điền form, 3: Success
const loading = ref(false)
const loadingCondition = ref(false)
const submitting = ref(false)
const error = ref(null)
const orders = ref([])
const selectedHoaDonId = ref('')
const conditionInfo = ref(null)
const createdRequest = ref(null)

const formData = ref({
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

const loadOrders = async () => {
  loading.value = true
  error.value = null
  try {
    const customerId = authStore.getCustomerId()
    console.log('Loading orders for customer:', customerId)

    if (!customerId) {
      throw new Error('Vui lòng đăng nhập để tiếp tục')
    }

    // Lấy tất cả đơn hàng của khách hàng (không lọc theo status)
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

    // Lấy tất cả đơn hàng (trừ đã hủy) - có thể trả hàng/bảo hành
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
    console.log('Total orders available for return:', orders.value.length)

    if (orders.value.length === 0 && allOrders.length > 0) {
      console.warn(
        'Không có đơn hàng nào đủ điều kiện. Chỉ các đơn đã thanh toán, đang giao hoặc hoàn thành mới có thể trả hàng/bảo hành.',
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
  step.value = 1
}

const loadConditionInfo = async () => {
  if (!selectedHoaDonId.value) {
    alert('Vui lòng chọn hóa đơn')
    return
  }

  loadingCondition.value = true
  error.value = null
  try {
    const response = await traHangService.kiemTraDieuKien(selectedHoaDonId.value)

    if (response && response.data) {
      conditionInfo.value = response.data.data || response.data

      // Set form data
      const customerId = authStore.getCustomerId()
      const firstProduct = conditionInfo.value.danhSachSanPham?.[0]
      formData.value = {
        idHoaDon: selectedHoaDonId.value,
        idKhachHang: customerId,
        idHoaDonChiTiet: firstProduct?.idHoaDonChiTiet || '',
        idSerialDaBan: null,
        lyDoTraHang: '',
        tinhTrangLucTra: '',
        moTaTinhTrang: '',
        loaiYeuCau: null,
        soLuong: 1,
        hinhAnh: [],
      }

      // Auto-suggest loaiYeuCau based on days
      if (conditionInfo.value.soNgaySauMua <= 7) {
        // Có thể đổi trả
        formData.value.loaiYeuCau = 0 // Default to Đổi trả
      } else {
        // Chỉ có thể bảo hành
        formData.value.loaiYeuCau = 1 // Default to Bảo hành
      }

      step.value = 2
    }
  } catch (err) {
    console.error('Error loading condition info:', err)
    error.value = err.response?.data?.message || err.message || 'Không thể kiểm tra điều kiện'
    alert(error.value)
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
  formData.value = {
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
  }
}

const resetError = () => {
  error.value = null
  loadOrders()
}

// Lifecycle
onMounted(() => {
  console.log('CreateReturnRequest component mounted')
  console.log('Auth store:', authStore)
  console.log('Customer ID:', authStore.getCustomerId())
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
</style>
