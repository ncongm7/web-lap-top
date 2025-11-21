<template>
  <div class="return-request-form">
    <form @submit.prevent="handleSubmit">
      <!-- Thông tin điều kiện -->
      <div v-if="conditionInfo" class="condition-info mb-4">
        <div class="alert alert-info">
          <h5 class="mb-2">Thông tin điều kiện</h5>
          <p class="mb-1"><strong>Số ngày sau khi mua:</strong> {{ conditionInfo.soNgaySauMua }} ngày</p>
          <p class="mb-1"><strong>Gợi ý:</strong> {{ conditionInfo.goiY }}</p>
          <p class="mb-0">
            <span v-if="conditionInfo.coTheTraHang" class="badge bg-success me-2">Có thể trả hàng</span>
            <span v-if="conditionInfo.coTheBaoHanh" class="badge bg-primary">Có thể bảo hành</span>
          </p>
        </div>
      </div>

      <!-- Chọn sản phẩm (nếu có nhiều sản phẩm) -->
      <div v-if="conditionInfo && conditionInfo.danhSachSanPham && conditionInfo.danhSachSanPham.length > 1" class="mb-3">
        <label class="form-label">Chọn sản phẩm cần trả <span class="text-danger">*</span></label>
        <select v-model="formData.idHoaDonChiTiet" class="form-select" required>
          <option value="">-- Chọn sản phẩm --</option>
          <option
            v-for="sp in conditionInfo.danhSachSanPham"
            :key="sp.idHoaDonChiTiet"
            :value="sp.idHoaDonChiTiet"
          >
            {{ sp.tenSanPham }} ({{ sp.maCtsp }}) - Số lượng: {{ sp.soLuong }}
          </option>
        </select>
      </div>
      <div v-else-if="conditionInfo && conditionInfo.danhSachSanPham && conditionInfo.danhSachSanPham.length === 1">
        <input type="hidden" :value="conditionInfo.danhSachSanPham[0].idHoaDonChiTiet" />
      </div>

      <!-- Chọn serial/IMEI (nếu có) -->
      <div v-if="selectedProductHasSerial && conditionInfo.danhSachSerial && conditionInfo.danhSachSerial.length > 0" class="mb-3">
        <label class="form-label">Chọn Serial/IMEI (nếu có)</label>
        <select v-model="formData.idSerialDaBan" class="form-select">
          <option value="">-- Không chọn --</option>
          <option
            v-for="serial in filteredSerials"
            :key="serial.idSerialDaBan"
            :value="serial.idSerialDaBan"
          >
            {{ serial.serialNo || serial.imei }}
          </option>
        </select>
      </div>

      <!-- Số lượng -->
      <div class="mb-3">
        <label class="form-label">Số lượng trả <span class="text-danger">*</span></label>
        <input
          type="number"
          v-model.number="formData.soLuong"
          class="form-control"
          min="1"
          :max="selectedProductMaxQuantity"
          required
        />
        <small class="form-text text-muted">
          Số lượng tối đa: {{ selectedProductMaxQuantity }}
        </small>
      </div>

      <!-- Loại yêu cầu -->
      <div class="mb-3">
        <label class="form-label">Loại yêu cầu <span class="text-danger">*</span></label>
        <select v-model="formData.loaiYeuCau" class="form-select" required>
          <option value="">-- Chọn loại yêu cầu --</option>
          <option :value="0" :disabled="!conditionInfo?.coTheTraHang">Đổi trả (hoàn tiền)</option>
          <option :value="1" :disabled="!conditionInfo?.coTheBaoHanh">Bảo hành</option>
        </select>
        <small class="form-text text-muted">
          <span v-if="conditionInfo?.soNgaySauMua <= 7 && conditionInfo?.soNgaySauMua !== undefined">
            Bạn có thể đổi trả trong vòng 7 ngày kể từ ngày mua (nếu sản phẩm hỏng hóc)
          </span>
          <span v-else>
            Đã quá 7 ngày, bạn chỉ có thể yêu cầu bảo hành
          </span>
        </small>
      </div>

      <!-- Tình trạng sản phẩm -->
      <div class="mb-3">
        <label class="form-label">Tình trạng sản phẩm <span class="text-danger">*</span></label>
        <select v-model="formData.tinhTrangLucTra" class="form-select" required>
          <option value="">-- Chọn tình trạng --</option>
          <option value="Tốt">Tốt</option>
          <option value="Hỏng">Hỏng</option>
          <option value="Trầy xước">Trầy xước</option>
          <option value="Khác">Khác</option>
        </select>
        <small class="form-text text-muted">
          <span v-if="formData.tinhTrangLucTra === 'Tốt' && formData.loaiYeuCau === 0" class="text-warning">
            ⚠️ Sản phẩm còn tốt không thể đổi trả. Vui lòng chọn bảo hành nếu cần.
          </span>
        </small>
      </div>

      <!-- Mô tả tình trạng -->
      <div class="mb-3">
        <label class="form-label">Mô tả chi tiết tình trạng</label>
        <textarea
          v-model="formData.moTaTinhTrang"
          class="form-control"
          rows="3"
          placeholder="Mô tả chi tiết tình trạng sản phẩm..."
        ></textarea>
      </div>

      <!-- Lý do -->
      <div class="mb-3">
        <label class="form-label">Lý do trả hàng <span class="text-danger">*</span></label>
        <textarea
          v-model="formData.lyDoTraHang"
          class="form-control"
          rows="4"
          placeholder="Nhập lý do trả hàng/bảo hành..."
          required
        ></textarea>
      </div>

      <!-- Upload ảnh minh chứng -->
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
        <small class="form-text text-muted">
          Chọn ảnh để minh chứng tình trạng sản phẩm
        </small>

        <!-- Preview ảnh -->
        <div v-if="previewImages.length > 0" class="mt-3">
          <div class="row g-2">
            <div v-for="(img, index) in previewImages" :key="index" class="col-md-3">
              <div class="position-relative">
                <img :src="img.url" alt="Preview" class="img-thumbnail" style="width: 100%; height: 150px; object-fit: cover;" />
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
          Gửi yêu cầu
        </button>
        <button type="button" class="btn btn-secondary" @click="$emit('cancel')">
          Hủy
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  conditionInfo: {
    type: Object,
    default: null
  },
  formData: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel', 'update:formData'])

const fileInput = ref(null)
const previewImages = ref([])

// Computed
const selectedProductHasSerial = computed(() => {
  if (!props.conditionInfo?.danhSachSanPham || !props.formData.idHoaDonChiTiet) {
    return false
  }
  const selectedProduct = props.conditionInfo.danhSachSanPham.find(
    sp => sp.idHoaDonChiTiet === props.formData.idHoaDonChiTiet
  )
  return selectedProduct?.coSerial || false
})

const selectedProductMaxQuantity = computed(() => {
  if (!props.conditionInfo?.danhSachSanPham || !props.formData.idHoaDonChiTiet) {
    return 1
  }
  const selectedProduct = props.conditionInfo.danhSachSanPham.find(
    sp => sp.idHoaDonChiTiet === props.formData.idHoaDonChiTiet
  )
  return selectedProduct?.soLuong || 1
})

const filteredSerials = computed(() => {
  if (!props.conditionInfo?.danhSachSerial || !props.formData.idHoaDonChiTiet) {
    return []
  }
  return props.conditionInfo.danhSachSerial.filter(
    serial => serial.idHoaDonChiTiet === props.formData.idHoaDonChiTiet
  )
})

// Watch để tự động chọn sản phẩm nếu chỉ có 1
watch(() => props.conditionInfo, (newVal) => {
  if (newVal?.danhSachSanPham && newVal.danhSachSanPham.length === 1) {
    emit('update:formData', {
      ...props.formData,
      idHoaDonChiTiet: newVal.danhSachSanPham[0].idHoaDonChiTiet
    })
  }
}, { immediate: true })

// Methods
const handleFileChange = (event) => {
  const files = Array.from(event.target.files)

  // Giới hạn 5 ảnh
  if (files.length > 5) {
    alert('Chỉ có thể chọn tối đa 5 ảnh')
    return
  }

  previewImages.value = []
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        previewImages.value.push({
          file,
          url: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })

  // Update formData
  emit('update:formData', {
    ...props.formData,
    hinhAnh: files
  })
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)

  // Update formData
  const files = previewImages.value.map(img => img.file)
  emit('update:formData', {
    ...props.formData,
    hinhAnh: files
  })
}

const handleSubmit = () => {
  // Validate
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
  if (props.formData.loaiYeuCau === '' || props.formData.loaiYeuCau === null) {
    alert('Vui lòng chọn loại yêu cầu')
    return
  }
  if (!props.formData.tinhTrangLucTra || props.formData.tinhTrangLucTra.trim() === '') {
    alert('Vui lòng chọn tình trạng sản phẩm')
    return
  }
  if (!props.formData.lyDoTraHang || props.formData.lyDoTraHang.trim() === '') {
    alert('Vui lòng nhập lý do trả hàng')
    return
  }

  // Validate logic: Nếu đổi trả thì phải hỏng
  if (props.formData.loaiYeuCau === 0 && props.formData.tinhTrangLucTra === 'Tốt') {
    alert('Sản phẩm còn tốt không thể đổi trả. Vui lòng chọn bảo hành nếu cần.')
    return
  }

  emit('submit', props.formData)
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
</style>

