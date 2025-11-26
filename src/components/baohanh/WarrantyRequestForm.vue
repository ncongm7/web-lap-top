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
                <th class="text-end">Đơn giá</th>
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
                <td class="text-end">
                  {{ formatCurrency(getProductUnitPrice(sp)) }}
                </td>
                <td>
                  <div class="d-flex flex-wrap gap-1">
                    <span
                      v-for="serial in getSerialsForProduct(sp.idHoaDonChiTiet)"
                      :key="serial"
                      class="serial-pill"
                    >
                      {{ serial }}
                    </span>
                    <span
                      v-if="getSerialsForProduct(sp.idHoaDonChiTiet).length === 0"
                      class="text-muted"
                      >—</span
                    >
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
          <label class="form-label"
            >Chọn sản phẩm cần trả/bảo hành <span class="text-danger">*</span></label
          >
          <select
            :value="formData.idHoaDonChiTiet"
            @change="updateFormDataField('idHoaDonChiTiet', $event.target.value)"
            class="form-select"
            required
          >
            <option value="">-- Chọn sản phẩm trong hóa đơn --</option>
            <option v-for="sp in productList" :key="sp.idHoaDonChiTiet" :value="sp.idHoaDonChiTiet">
              {{ sp.tenSanPham }} ({{ sp.maCtsp }})
            </option>
          </select>
        </div>
        <div class="col-md-6">
          <label class="form-label">Số ngày từ khi mua</label>
          <input
            type="text"
            class="form-control bg-light"
            :value="daysAfterPurchaseDisplay"
            disabled
          />
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label"
          >Lý do yêu cầu trả/bảo hành <span class="text-danger">*</span></label
        >
        <textarea
          :value="formData.lyDoTraHang"
          @input="updateFormDataField('lyDoTraHang', $event.target.value)"
          class="form-control"
          rows="4"
          placeholder="Mô tả lý do bạn muốn trả hàng/bảo hành..."
          required
        ></textarea>
      </div>

      <!-- Mô tả tình trạng -->
      <div class="mb-3">
        <label class="form-label"
          >Mô tả chi tiết tình trạng <span class="text-danger">*</span></label
        >
        <textarea
          :value="formData.moTaTinhTrang"
          @input="updateFormDataField('moTaTinhTrang', $event.target.value)"
          class="form-control"
          rows="4"
          placeholder="Mô tả chi tiết tình trạng sản phẩm, lỗi gặp phải..."
          required
        ></textarea>
      </div>

      <!-- Lý do -->
      <!-- Upload ảnh minh chứng -->
      <h6 class="section-title mt-4">3. Ảnh minh chứng</h6>
      <div class="mb-3">
        <label class="form-label">Ảnh minh chứng (tối đa 5 ảnh)</label>
        <input
          type="file"
          class="form-control"
          accept="image/*"
          multiple
          @change="handleFileChange"
          ref="fileInput"
        />
        <small class="form-text text-muted">{{ evidenceHelperText }}</small>

        <!-- Preview ảnh -->
        <div v-if="previewImages.length > 0" class="mt-3">
          <div class="row g-2">
            <div v-for="(img, index) in previewImages" :key="index" class="col-md-3">
              <div class="position-relative">
                <img
                  :src="img.url"
                  alt="Preview"
                  class="img-thumbnail"
                  style="width: 100%; height: 150px; object-fit: cover"
                />
                <button
                  type="button"
                  class="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                  @click="removeImage(index)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
import { ref, computed, watch } from 'vue'

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

// Computed
const productList = computed(() => props.conditionInfo?.danhSachSanPham || [])

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
      if (!match) {
        emit('update:formData', {
          ...props.formData,
          idSerialDaBan: serials[0].idSerialDaBan,
        })
      }
    } else if (props.formData.idSerialDaBan) {
      emit('update:formData', {
        ...props.formData,
        idSerialDaBan: null,
      })
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
  if (!props.formData.lyDoTraHang || props.formData.lyDoTraHang.trim() === '') {
    alert('Vui lòng nhập lý do yêu cầu bảo hành')
    return
  }

  const sanitizedData = {
    ...props.formData,
    soLuong: props.formData.soLuong && props.formData.soLuong > 0 ? props.formData.soLuong : 1,
    tinhTrangLucTra:
      props.formData.tinhTrangLucTra && props.formData.tinhTrangLucTra.trim() !== ''
        ? props.formData.tinhTrangLucTra
        : 'Không xác định',
  }

  emit('submit', sanitizedData)
}
</script>

<style scoped>
.warranty-request-form {
  max-width: 800px;
  margin: 0 auto;
}

.img-thumbnail {
  cursor: pointer;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
}

.invoice-products .table th {
  background-color: #f8fafc;
  font-weight: 600;
}

.serial-pill {
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 12px;
}
</style>
