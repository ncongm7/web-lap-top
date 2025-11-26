<template>
  <div class="return-request-form">
    <form @submit.prevent="handleSubmit">
      <div v-if="conditionInfo" class="condition-info mb-4">
        <div class="alert alert-info">
          <div
            class="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3"
          >
            <div>
              <h5 class="mb-1">Đánh giá tự động</h5>
              <p class="mb-0 text-muted">
                Hệ thống đã tính số ngày sau khi mua và kiểm tra điều kiện trả hàng/bảo hành.
              </p>
            </div>
            <span :class="['badge', suggestedActionBadgeClass]"
              >Gợi ý: {{ suggestedActionText }}</span
            >
          </div>
          <hr class="my-3" />
          <div class="row g-3">
            <div class="col-md-4">
              <p class="mb-1 text-muted">Số ngày sau khi mua</p>
              <p class="mb-0 fw-semibold">{{ daysAfterPurchaseDisplay }}</p>
            </div>
            <div class="col-md-4">
              <p class="mb-1 text-muted">Đổi trả</p>
              <span :class="['badge', conditionInfo?.coTheTraHang ? 'bg-success' : 'bg-secondary']">
                {{ conditionInfo?.coTheTraHang ? 'Có thể đổi trả' : 'Không đủ điều kiện' }}
              </span>
            </div>
            <div class="col-md-4">
              <p class="mb-1 text-muted">Bảo hành</p>
              <span :class="['badge', conditionInfo?.coTheBaoHanh ? 'bg-primary' : 'bg-secondary']">
                {{ conditionInfo?.coTheBaoHanh ? 'Có thể bảo hành' : 'Không đủ điều kiện' }}
              </span>
            </div>
          </div>
        </div>
      </div>

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
                <td class="text-end">{{ formatCurrency(getProductUnitPrice(sp)) }}</td>
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
            >Chọn sản phẩm cần xử lý <span class="text-danger">*</span></label
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

      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <label class="form-label">Loại yêu cầu <span class="text-danger">*</span></label>
          <select
            :value="formData.loaiYeuCau ?? ''"
            @change="handleRequestTypeChange($event.target.value)"
            class="form-select"
            required
          >
            <option value="">-- Chọn loại yêu cầu --</option>
            <option value="0" :disabled="!conditionInfo?.coTheTraHang">Đổi trả (hoàn tiền)</option>
            <option value="1" :disabled="!conditionInfo?.coTheBaoHanh">Bảo hành</option>
          </select>
          <small class="form-text text-muted">{{ requestTypeHelperText }}</small>
        </div>
        <div class="col-md-6">
          <label class="form-label">Số lượng yêu cầu <span class="text-danger">*</span></label>
          <input
            type="number"
            :value="formData.soLuong"
            @input="updateFormDataField('soLuong', parseInt($event.target.value) || 1)"
            class="form-control"
            min="1"
            :max="selectedProductMaxQuantity"
            required
          />
          <small class="form-text text-muted"
            >Số lượng tối đa: {{ selectedProductMaxQuantity }}</small
          >
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label">Lý do yêu cầu <span class="text-danger">*</span></label>
        <textarea
          :value="formData.lyDoTraHang"
          @input="updateFormDataField('lyDoTraHang', $event.target.value)"
          class="form-control"
          rows="4"
          placeholder="Mô tả lý do bạn muốn đổi trả/bảo hành..."
          required
        ></textarea>
      </div>

      <div class="mb-3">
        <label class="form-label">Tình trạng sản phẩm <span class="text-danger">*</span></label>
        <select
          :value="formData.tinhTrangLucTra"
          @change="updateFormDataField('tinhTrangLucTra', $event.target.value)"
          class="form-select"
          required
        >
          <option value="">-- Chọn tình trạng --</option>
          <option value="Tốt">Tốt</option>
          <option value="Hỏng">Hỏng</option>
          <option value="Trầy xước">Trầy xước</option>
          <option value="Khác">Khác</option>
        </select>
        <small
          class="form-text text-muted"
          v-if="formData.tinhTrangLucTra === 'Tốt' && formData.loaiYeuCau === 0"
        >
          ⚠️ Sản phẩm còn tốt không thể đổi trả. Vui lòng chọn bảo hành nếu cần.
        </small>
      </div>

      <div class="mb-3">
        <label class="form-label">Mô tả chi tiết tình trạng</label>
        <textarea
          :value="formData.moTaTinhTrang"
          @input="updateFormDataField('moTaTinhTrang', $event.target.value)"
          class="form-control"
          rows="4"
          placeholder="Mô tả chi tiết tình trạng sản phẩm, lỗi gặp phải..."
        ></textarea>
      </div>

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
        <small class="form-text text-muted"
          >Chọn ảnh để minh chứng tình trạng sản phẩm cần xử lý</small
        >

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

      <div class="d-flex gap-2">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Gửi yêu cầu
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Hủy</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
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

const productList = computed(() => props.conditionInfo?.danhSachSanPham || [])

const serialOptions = computed(() => props.conditionInfo?.danhSachSerial || [])

const serialDisplayMap = computed(() => {
  const map = {}
  serialOptions.value.forEach((serial) => {
    if (!serial.idHoaDonChiTiet) return
    if (!map[serial.idHoaDonChiTiet]) {
      map[serial.idHoaDonChiTiet] = []
    }
    map[serial.idHoaDonChiTiet].push(serial.serialNo || serial.imei || serial.idSerialDaBan)
  })
  return map
})

const getSerialsForProduct = (productId) => serialDisplayMap.value[productId] || []

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
  const found = candidates.find((value) => value !== null && value > 0)
  if (found !== undefined) {
    return found
  }
  if (product.thanhTien && product.soLuong) {
    const unit = Number(product.thanhTien) / Number(product.soLuong)
    return Number.isFinite(unit) && unit > 0 ? unit : normalizePrice(product.thanhTien)
  }
  return normalizePrice(product.thanhTien)
}

const daysAfterPurchase = computed(() => props.conditionInfo?.soNgaySauMua ?? null)
const daysAfterPurchaseDisplay = computed(() => {
  if (daysAfterPurchase.value === null || daysAfterPurchase.value === undefined) return '—'
  if (daysAfterPurchase.value === 0) return 'Hôm nay'
  if (daysAfterPurchase.value === 1) return '1 ngày trước'
  return `${daysAfterPurchase.value} ngày`
})

const selectedProductMaxQuantity = computed(() => {
  if (!productList.value.length || !props.formData.idHoaDonChiTiet) {
    return 1
  }
  const selectedProduct = productList.value.find(
    (sp) => sp.idHoaDonChiTiet === props.formData.idHoaDonChiTiet,
  )
  return selectedProduct?.soLuong || 1
})

const filteredSerials = computed(() => {
  if (!serialOptions.value.length || !props.formData.idHoaDonChiTiet) {
    return []
  }
  return serialOptions.value.filter(
    (serial) => serial.idHoaDonChiTiet === props.formData.idHoaDonChiTiet,
  )
})

const suggestedRequestType = computed(() => {
  if (!props.conditionInfo) return null
  if (props.conditionInfo.coTheTraHang && props.conditionInfo.soNgaySauMua <= 7) {
    return 0
  }
  if (props.conditionInfo.coTheBaoHanh) {
    return 1
  }
  if (props.conditionInfo.coTheTraHang) {
    return 0
  }
  return null
})

const suggestedActionText = computed(() => {
  if (suggestedRequestType.value === 0) return 'Đổi trả'
  if (suggestedRequestType.value === 1) return 'Bảo hành'
  return props.conditionInfo?.goiY || 'Đang đánh giá'
})

const suggestedActionBadgeClass = computed(() =>
  suggestedRequestType.value === 0 ? 'bg-warning text-dark' : 'bg-primary',
)

const requestTypeHelperText = computed(() => {
  if (!props.conditionInfo) return ''
  if (props.conditionInfo.soNgaySauMua <= 7 && props.conditionInfo.coTheTraHang) {
    return 'Đơn trong 7 ngày: ưu tiên Đổi trả nếu sản phẩm hỏng hóc.'
  }
  if (!props.conditionInfo.coTheTraHang && props.conditionInfo.coTheBaoHanh) {
    return 'Đơn đã quá 7 ngày: chỉ có thể yêu cầu Bảo hành.'
  }
  return props.conditionInfo.goiY || ''
})

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
        updateFormDataField('idSerialDaBan', serials[0].idSerialDaBan)
      }
    } else if (props.formData.idSerialDaBan) {
      updateFormDataField('idSerialDaBan', null)
    }
  },
  { immediate: true },
)

watch(
  () => suggestedRequestType.value,
  (type) => {
    if (
      type !== null &&
      (props.formData.loaiYeuCau === null ||
        props.formData.loaiYeuCau === '' ||
        props.formData.loaiYeuCau === undefined)
    ) {
      updateFormDataField('loaiYeuCau', type)
    }
  },
  { immediate: true },
)

const updateFormDataField = (field, value) => {
  emit('update:formData', {
    ...props.formData,
    [field]: value,
  })
}

const handleFileChange = (event) => {
  const files = Array.from(event.target.files)
  if (files.length > 5) {
    alert('Chỉ có thể chọn tối đa 5 ảnh')
    return
  }
  previewImages.value = []
  files.forEach((file) => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImages.value.push({ file, url: e.target.result })
      }
      reader.readAsDataURL(file)
    }
  })
  updateFormDataField('hinhAnh', files)
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
  const files = previewImages.value.map((img) => img.file)
  updateFormDataField('hinhAnh', files)
}

const handleRequestTypeChange = (value) => {
  if (value === '') {
    updateFormDataField('loaiYeuCau', null)
    return
  }
  updateFormDataField('loaiYeuCau', parseInt(value))
}

const handleSubmit = () => {
  if (!props.formData.idHoaDonChiTiet) {
    alert('Vui lòng chọn sản phẩm')
    return
  }
  if (!props.formData.soLuong || props.formData.soLuong < 1) {
    alert('Vui lòng nhập số lượng hợp lệ')
    return
  }
  if (props.formData.soLuong > selectedProductMaxQuantity.value) {
    alert(`Số lượng không được vượt quá ${selectedProductMaxQuantity.value}`)
    return
  }
  if (props.formData.loaiYeuCau !== 0 && props.formData.loaiYeuCau !== 1) {
    alert('Vui lòng chọn loại yêu cầu')
    return
  }
  if (!props.conditionInfo?.coTheTraHang && props.formData.loaiYeuCau === 0) {
    alert('Đơn hàng này không đủ điều kiện đổi trả')
    return
  }
  if (!props.conditionInfo?.coTheBaoHanh && props.formData.loaiYeuCau === 1) {
    alert('Đơn hàng này không đủ điều kiện bảo hành')
    return
  }
  if (props.formData.loaiYeuCau === 0 && props.formData.tinhTrangLucTra === 'Tốt') {
    alert('Sản phẩm còn tốt không thể đổi trả. Vui lòng chọn bảo hành nếu cần.')
    return
  }
  if (!props.formData.lyDoTraHang || props.formData.lyDoTraHang.trim() === '') {
    alert('Vui lòng nhập lý do yêu cầu')
    return
  }

  const sanitizedData = {
    ...props.formData,
    soLuong: props.formData.soLuong && props.formData.soLuong > 0 ? props.formData.soLuong : 1,
  }

  emit('submit', sanitizedData)
}
</script>

<style scoped>
.return-request-form {
  max-width: 800px;
  margin: 0 auto;
}

.condition-info .alert {
  border-left: 4px solid #0d6efd;
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
