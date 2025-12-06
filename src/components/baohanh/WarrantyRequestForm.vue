<template>
  <div class="warranty-request-form">
    <form @submit.prevent="handleSubmit">
      <div v-if="productList.length" class="invoice-products mb-4">
        <h6 class="section-title mb-3">1. Sản phẩm trong hóa đơn</h6>
        <div class="table-responsive">
          <table class="table table-bordered align-middle mb-0">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th class="text-center">Số lượng</th>
                <!-- <th class="text-end">Đơn giá</th> -->
                <th>Serial/IMEI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sp in productList" :key="sp.idHoaDonChiTiet">
                <td>
                  <div class="fw-semibold">{{ sp.tenSanPham }}</div>
                  <div class="text-muted small">{{ sp.maCtsp }}</div>
                </td>
                <td class="text-center">{{ sp.soLuong }}</td>
                <!-- <td class="text-end">
                  {{ formatCurrency(getProductUnitPrice(sp)) }}
                </td> -->
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span v-for="serial in getSerialsForProduct(sp.idHoaDonChiTiet)" :key="serial" class="serial-pill">
                      {{ serial }}
                    </span>
                    <span v-if="getSerialsForProduct(sp.idHoaDonChiTiet).length === 0" class="text-muted">—</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <h6 class="section-title">2. Thông tin yêu cầu</h6>
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Chọn sản phẩm cần bảo hành <span class="text-danger">*</span></label>
          <select :value="formData.idHoaDonChiTiet"
            @change="updateFormDataField('idHoaDonChiTiet', $event.target.value)" class="form-select" required>
            <option value="">-- Chọn sản phẩm trong hóa đơn --</option>
            <option v-for="sp in productList" :key="sp.idHoaDonChiTiet" :value="sp.idHoaDonChiTiet">
              {{ sp.tenSanPham }} ({{ sp.maCtsp }})
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Số ngày từ khi mua</label>
          <input type="text" class="form-control bg-light" :value="daysAfterPurchaseDisplay" disabled />
        </div>
      </div>

      <!-- Lý do bảo hành với tabs phân loại -->
      <div class="mb-4">
        <label class="form-label">
          Lý do bảo hành <span class="text-danger">*</span>
        </label>

        <!-- Tabs phân loại -->
        <ul class="nav nav-tabs mb-3" role="tablist">
          <li class="nav-item" v-for="loai in loaiLyDoList" :key="loai.code">
            <button class="nav-link" :class="{ active: selectedLoai === loai.code }" @click="selectedLoai = loai.code"
              type="button">
              <i :class="loai.icon" class="me-2"></i>
              {{ loai.label }}
            </button>
          </li>
        </ul>

        <!-- Dropdown lý do -->
        <select :value="formData.idLyDoBaoHanh" @change="updateFormDataField('idLyDoBaoHanh', $event.target.value)"
          class="form-select" required>
          <option value="">-- Chọn lý do bảo hành --</option>
          <option v-for="lyDo in filteredLyDoList" :key="lyDo.id" :value="lyDo.id">
            {{ lyDo.tenLyDo }}
          </option>
        </select>
        <small class="text-muted d-block mt-2">
          <i class="bi bi-info-circle me-1"></i>
          {{ selectedLyDoMoTa || 'Vui lòng chọn lý do bảo hành để xem mô tả chi tiết' }}
        </small>
      </div>

      <!-- Mô tả tình trạng -->
      <div class="mb-3">
        <label class="form-label">Mô tả chi tiết tình trạng <span class="text-danger">*</span></label>
        <textarea :value="formData.moTaTinhTrang" @input="updateFormDataField('moTaTinhTrang', $event.target.value)"
          class="form-control" rows="4" placeholder="Mô tả chi tiết tình trạng sản phẩm, lỗi gặp phải..."
          required></textarea>
      </div>

      <!-- Lý do -->
      <!-- Upload ảnh minh chứng -->
      <!-- <h6 class="section-title mt-4">3. Ảnh minh chứng</h6> -->

      <!-- Buttons -->
      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          {{ submitButtonLabel }}
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Hủy</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import lyDoBaoHanhService from '@/service/baohanh/lyDoBaoHanhService'

const props = defineProps({
  mode: {
    type: String,
    default: 'warranty',
    validator: (value) => ['warranty', 'return'].includes(value),
  },
  conditionInfo: {
    type: Object,
    default: null,
  },
  formData: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel', 'update:formData'])

const fileInput = ref(null)
const previewImages = ref([])
const lyDoList = ref([])
const selectedLoai = ref('PHAN_CUNG')

// Danh sách loại lý do với icon
const loaiLyDoList = [
  { code: 'PHAN_CUNG', label: 'Phần cứng', icon: 'bi bi-cpu' },
  { code: 'PHAN_MEM', label: 'Phần mềm', icon: 'bi bi-code-slash' },
  { code: 'PHU_KIEN', label: 'Phụ kiện', icon: 'bi bi-plug' },
  { code: 'KHAC', label: 'Khác', icon: 'bi bi-three-dots' },
]

// Computed
const productList = computed(() => props.conditionInfo?.danhSachSanPham || [])

// Lọc lý do theo loại đã chọn
const filteredLyDoList = computed(() => {
  return lyDoList.value.filter(lyDo => lyDo.loaiLyDo === selectedLoai.value)
})

// Lấy mô tả của lý do đã chọn
const selectedLyDoMoTa = computed(() => {
  if (!props.formData.idLyDoBaoHanh) return null
  const selected = lyDoList.value.find(lyDo => lyDo.id === props.formData.idLyDoBaoHanh)
  return selected ? selected.moTa : null
})

const isReturnMode = computed(() => props.mode === 'return')
const submitButtonLabel = computed(() =>
  isReturnMode.value ? 'Gửi yêu cầu trả hàng' : 'Gửi yêu cầu bảo hành',
)
const evidenceHelperText = computed(() =>
  isReturnMode.value
    ? 'Chọn ảnh minh chứng tình trạng sản phẩm cần trả hàng'
    : 'Chọn ảnh để minh chứng tình trạng sản phẩm cần bảo hành',
)

const serialMap = computed(() => {
  const map = {}
  props.conditionInfo?.danhSachSerial?.forEach((serial) => {
    if (!serial.idHoaDonChiTiet) return
    if (!map[serial.idHoaDonChiTiet]) {
      map[serial.idHoaDonChiTiet] = []
    }
    map[serial.idHoaDonChiTiet].push(serial.serialNo || serial.imei)
  })
  return map
})

const getSerialsForProduct = (productId) => serialMap.value[productId] || []

const formatCurrency = (value) => {
  if (value === undefined || value === null) return '—'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const normalizePrice = (value) => {
  if (value === undefined || value === null) return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const getProductUnitPrice = (product) => {
  if (!product) return null
  const candidates = [
    normalizePrice(product.donGia),
    normalizePrice(product.giaBan),
    normalizePrice(product.donGiaSauGiam),
    normalizePrice(product.giaSauGiam),
    normalizePrice(product.giaBanSauGiam),
  ]
  const found = candidates.find((value) => value !== null)
  if (found !== undefined && found !== null && found > 0) {
    return found
  }

  if (
    product.thanhTien !== undefined &&
    product.thanhTien !== null &&
    product.soLuong &&
    Number(product.soLuong) !== 0
  ) {
    const unit = Number(product.thanhTien) / Number(product.soLuong)
    return Number.isFinite(unit) && unit > 0 ? unit : normalizePrice(product.thanhTien)
  }

  return normalizePrice(product.thanhTien)
}

const filteredSerials = computed(() => {
  if (!props.conditionInfo?.danhSachSerial || !props.formData.idHoaDonChiTiet) {
    return []
  }
  return props.conditionInfo.danhSachSerial.filter(
    (serial) => serial.idHoaDonChiTiet === props.formData.idHoaDonChiTiet,
  )
})

const daysAfterPurchase = computed(() => props.conditionInfo?.soNgaySauMua ?? null)
const daysAfterPurchaseDisplay = computed(() => {
  if (daysAfterPurchase.value === null || daysAfterPurchase.value === undefined) return '—'
  if (daysAfterPurchase.value === 0) return 'Hôm nay'
  if (daysAfterPurchase.value === 1) return '1 ngày trước'
  return `${daysAfterPurchase.value} ngày trước`
})

// Watch để tự động chọn sản phẩm nếu chỉ có 1
watch(
  () => props.conditionInfo,
  (newVal) => {
    if (newVal?.danhSachSanPham && newVal.danhSachSanPham.length === 1) {
      emit('update:formData', {
        ...props.formData,
        idHoaDonChiTiet: newVal.danhSachSanPham[0].idHoaDonChiTiet,
      })
    }
  },
  { immediate: true },
)

watch(
  () => filteredSerials.value,
  (serials) => {
    if (serials.length > 0) {
      const current = props.formData.idSerialDaBan
      const match = serials.find((serial) => serial.idSerialDaBan === current)
      // Chỉ tự động chọn serial đầu tiên nếu chưa có serial nào được chọn
      // Nếu đã có serial được chọn nhưng không hợp lệ với sản phẩm mới, giữ nguyên (không reset)
      if (!current && !match) {
        emit('update:formData', {
          ...props.formData,
          idSerialDaBan: serials[0].idSerialDaBan,
        })
      }
      // Nếu serial hiện tại không hợp lệ với sản phẩm mới, nhưng đã được chọn trước đó
      // Giữ nguyên để người dùng có thể chọn lại thủ công
    } else if (props.formData.idSerialDaBan) {
      // Chỉ reset serial nếu không còn serial nào cho sản phẩm này
      // Nhưng không reset nếu người dùng đã chọn serial từ sản phẩm khác
      // emit('update:formData', {
      //   ...props.formData,
      //   idSerialDaBan: null,
      // })
    }
  },
  { immediate: true },
)

// Methods
const updateFormDataField = (field, value) => {
  emit('update:formData', {
    ...props.formData,
    [field]: value,
  })
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)

  // Giới hạn 5 ảnh
  if (files.length > 5) {
    alert('Chỉ có thể chọn tối đa 5 ảnh')
    return
  }

  previewImages.value = []
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImages.value.push({
          file,
          url: e.target.result,
        })
      }
      reader.readAsDataURL(file)
    }
  })

  // Update formData
  emit('update:formData', {
    ...props.formData,
    hinhAnh: files,
  })
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)

  // Update formData
  const files = previewImages.value.map((img) => img.file)
  emit('update:formData', {
    ...props.formData,
    hinhAnh: files,
  })
}

const handleSubmit = () => {
  // Validate
  if (!props.formData.idHoaDonChiTiet) {
    alert('Vui lòng chọn sản phẩm')
    return
  }
  if (!props.formData.moTaTinhTrang || props.formData.moTaTinhTrang.trim() === '') {
    alert('Vui lòng mô tả chi tiết tình trạng sản phẩm')
    return
  }

  const sanitizedData = {
    ...props.formData,
    soLuong: props.formData.soLuong && props.formData.soLuong > 0 ? props.formData.soLuong : 1,
    tinhTrangLucTra:
      props.formData.tinhTrangLucTra && props.formData.tinhTrangLucTra.trim() !== ''
        ? props.formData.tinhTrangLucTra
        : 'Không xác định',
    // Cho phép lyDoTraHang rỗng hoặc null
    lyDoTraHang: props.formData.lyDoTraHang || '',
  }

  emit('submit', sanitizedData)
}

// Load danh sách lý do bảo hành
onMounted(async () => {
  try {
    const data = await lyDoBaoHanhService.getAllLyDo()
    lyDoList.value = data || []
  } catch (error) {
    console.error('Lỗi khi tải danh sách lý do bảo hành:', error)
  }
})

// Watch để tự động chuyển tab khi chọn lý do
watch(() => props.formData.idLyDoBaoHanh, (newId) => {
  if (newId) {
    const selected = lyDoList.value.find(lyDo => lyDo.id === newId)
    if (selected && selected.loaiLyDo) {
      selectedLoai.value = selected.loaiLyDo
    }
  }
})
</script>

<style scoped>
.warranty-request-form {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Section Titles */
.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f1f5f9;
  letter-spacing: -0.01em;
}

/* Invoice Products Section */
.invoice-products {
  background: #ffffff;
  padding: 24px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 32px;
}

.invoice-products .table {
  margin-bottom: 0;
  background: #ffffff;
}

.invoice-products .table thead th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #475569;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 12px 16px;
  border-bottom: 2px solid #e2e8f0;
  border-top: none;
}

.invoice-products .table tbody td {
  padding: 16px;
  vertical-align: middle;
  border-color: #f1f5f9;
  color: #334155;
}

.invoice-products .table tbody tr {
  transition: background-color 0.2s ease;
}

.invoice-products .table tbody tr:hover {
  background-color: #f8fafc;
}

.invoice-products .table-bordered {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

/* Form Labels */
.form-label {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.form-label span.text-danger {
  color: #6b7280;
  font-weight: 600;
  margin-left: 2px;
}

/* Form Controls */
.form-control,
.form-select {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  color: #1e293b;
  background-color: #ffffff;
  transition: all 0.2s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
  outline: none;
}

.form-control:disabled,
.form-control.bg-light {
  background-color: #f9fafb;
  color: #6b7280;
  cursor: not-allowed;
  border-color: #e5e7eb;
}

.form-select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 10px center;
  background-repeat: no-repeat;
  background-size: 16px;
  padding-right: 40px;
}

.form-select:focus {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%231e293b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
}

textarea.form-control {
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

textarea.form-control::placeholder {
  color: #9ca3af;
  opacity: 1;
}

/* Serial Pills */
.serial-pill {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  display: inline-block;
  margin: 2px;
}

/* Buttons */
.btn {
  padding: 10px 24px;
  font-weight: 600;
  font-size: 14px;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background-color: #1e293b;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(30, 41, 59, 0.2);
}

.btn-primary:hover:not(:disabled) {
  background-color: #334155;
  box-shadow: 0 4px 8px rgba(30, 41, 59, 0.3);
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
  border-color: #9ca3af;
  color: #1e293b;
}

.d-flex.gap-2 {
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

/* Form Sections */
.row.g-3 {
  margin-bottom: 24px;
}

.mb-3 {
  margin-bottom: 24px;
}

.mb-4 {
  margin-bottom: 32px;
}

/* Text Muted */
.text-muted {
  color: #6b7280;
  font-size: 13px;
}

.small {
  font-size: 12px;
}

/* Spinner */
.spinner-border-sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
  border-color: #ffffff;
  border-right-color: transparent;
}

.spinner-border {
  border-color: #ffffff;
  border-right-color: transparent;
}

/* Responsive */
@media (max-width: 768px) {
  .warranty-request-form {
    padding: 20px;
    border-radius: 8px;
  }

  .section-title {
    font-size: 16px;
    margin-bottom: 16px;
  }

  .invoice-products {
    padding: 16px;
    margin-bottom: 24px;
  }

  .invoice-products .table thead th,
  .invoice-products .table tbody td {
    padding: 12px;
    font-size: 13px;
  }

  .btn {
    padding: 10px 20px;
    font-size: 13px;
    width: 100%;
  }

  .d-flex.gap-2 {
    flex-direction: column;
  }
}

/* Remove default browser validation styles */
.form-control:invalid,
.form-control:required:invalid,
.form-select:invalid,
.form-select:required:invalid {
  border-color: #d1d5db;
  box-shadow: none;
}

.form-control:focus:invalid,
.form-select:focus:invalid {
  border-color: #9ca3af;
  box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
}

/* Image thumbnail */
.img-thumbnail {
  cursor: pointer;
  border-radius: 6px;
  transition: transform 0.2s ease;
}

.img-thumbnail:hover {
  transform: scale(1.02);
}

/* Additional polish */
.warranty-request-form form {
  background: transparent;
}

/* Nav tabs styling */
.nav-tabs {
  border-bottom: 2px solid #e2e8f0;
  margin-bottom: 16px;
}

.nav-tabs .nav-item {
  margin-bottom: -2px;
}

.nav-tabs .nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: #6b7280;
  font-weight: 500;
  padding: 12px 20px;
  transition: all 0.2s ease;
  background: transparent;
}

.nav-tabs .nav-link:hover {
  border-bottom-color: #d1d5db;
  color: #1e293b;
}

.nav-tabs .nav-link.active {
  color: #2563eb;
  border-bottom-color: #2563eb;
  background: transparent;
}

.nav-tabs .nav-link i {
  font-size: 16px;
}

/* Smooth transitions */
* {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}
</style>
