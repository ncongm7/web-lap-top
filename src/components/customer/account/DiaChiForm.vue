<template>
  <div class="dia-chi-form">
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="fw-bold text-success mb-3">Thêm Địa Chỉ</h5>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Mã khách hàng <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.maKhachHang }"
              placeholder="Nhập mã khách hàng"
              v-model="form.maKhachHang"
              @blur="validateMaKhachHang"
              readonly
            />
            <div v-if="errors.maKhachHang" class="invalid-feedback d-block">
              {{ errors.maKhachHang }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.hoTen }"
              placeholder="Nhập họ và tên"
              v-model="form.hoTen"
              @blur="validateHoTen"
            />
            <div v-if="errors.hoTen" class="invalid-feedback d-block">
              {{ errors.hoTen }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.sdt }"
              placeholder="Nhập số điện thoại"
              v-model="form.sdt"
              @blur="validateSDT"
            />
            <div v-if="errors.sdt" class="invalid-feedback d-block">
              {{ errors.sdt }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Địa chỉ chi tiết <span class="text-danger">*</span></label>
            <input
              type="text"
              class="form-control"
              :class="{ 'is-invalid': errors.diaChi }"
              placeholder="Nhập địa chỉ chi tiết"
              v-model="form.diaChi"
              @blur="validateDiaChi"
            />
            <div v-if="errors.diaChi" class="invalid-feedback d-block">
              {{ errors.diaChi }}
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Tỉnh/Thành phố</label>
            <select
              class="form-select"
              :class="{ 'is-invalid': errors.tinh }"
              v-model="form.tinhCode"
              @change="handleProvinceChange"
              :disabled="loadingProvinces"
            >
              <option value="">-- Chọn tỉnh/thành phố --</option>
              <option v-for="province in provinces" :key="province.id" :value="province.id">
                {{ province.name }}
              </option>
            </select>
            <div v-if="errors.tinh" class="invalid-feedback d-block">
              {{ errors.tinh }}
            </div>
            <div v-if="loadingProvinces" class="text-muted small mt-1">
              <i class="fas fa-spinner fa-spin"></i> Đang tải...
            </div>
          </div>

          <div class="col-md-6">
            <label class="form-label">Xã/Phường</label>
            <select
              class="form-select"
              :class="{ 'is-invalid': errors.xa }"
              v-model="form.xaCode"
              :disabled="!form.tinhCode || loadingWards"
            >
              <option value="">-- Chọn xã/phường --</option>
              <option v-for="ward in wards" :key="ward.id" :value="ward.name">
                {{ ward.name }}
              </option>
            </select>
            <div v-if="errors.xa" class="invalid-feedback d-block">
              {{ errors.xa }}
            </div>
            <div v-if="loadingWards" class="text-muted small mt-1">
              <i class="fas fa-spinner fa-spin"></i> Đang tải...
            </div>
            <div v-if="!form.tinhCode && !loadingWards" class="text-muted small mt-1">
              Vui lòng chọn tỉnh/thành phố trước
            </div>
          </div>

          <div class="col-md-12">
            <label class="form-label me-3">Trạng thái</label>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="macDinh"
                :value="true"
                v-model="form.macDinh"
              />
              <label class="form-check-label" for="macDinh">Mặc Định</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="khongMacDinh"
                :value="false"
                v-model="form.macDinh"
              />
              <label class="form-check-label" for="khongMacDinh">Không Mặc Định</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-center gap-3">
      <button class="btn btn-primary" @click="handleSave" :disabled="loading">
        <i class="fas fa-save me-1"></i> {{ loading ? 'Đang lưu...' : 'Lưu' }}
      </button>
      <button class="btn btn-success" @click="handleReset" :disabled="loading">
        <i class="fas fa-plus me-1"></i> Thêm mới
      </button>
      <button class="btn btn-secondary" @click="$emit('close')" :disabled="loading">
        <i class="fas fa-times me-1"></i> Đóng
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import addressService from '@/service/customer/addressService'

const props = defineProps({
  maKhachHang: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['close', 'success'])

const toast = useToast()

const loading = ref(false)
const loadingProvinces = ref(false)
const loadingWards = ref(false)
const provinces = ref([])
const wards = ref([])

const form = ref({
  maKhachHang: '',
  hoTen: '',
  sdt: '',
  diaChi: '',
  xa: '',
  tinh: '',
  xaCode: '',
  tinhCode: '',
  macDinh: false,
})

const errors = ref({})

onMounted(async () => {
  if (props.maKhachHang) {
    form.value.maKhachHang = props.maKhachHang
  }
  await fetchProvinces()
})

// Fetch danh sách tỉnh/thành phố
const fetchProvinces = async () => {
  try {
    loadingProvinces.value = true
    const response = await addressService.getAllProvinces()
    provinces.value = response.data || response || []
  } catch (error) {
    console.error('Error fetching provinces:', error)
    toast.error('Không thể tải danh sách tỉnh/thành phố')
  } finally {
    loadingProvinces.value = false
  }
}

// Xử lý khi chọn tỉnh
const handleProvinceChange = async () => {
  // Reset xã khi đổi tỉnh
  form.value.xaCode = ''
  form.value.xa = ''
  wards.value = []

  if (!form.value.tinhCode) {
    return
  }

  // Lấy tên tỉnh từ danh sách
  const selectedProvince = provinces.value.find((p) => p.id === parseInt(form.value.tinhCode))
  if (selectedProvince) {
    form.value.tinh = selectedProvince.name
  }

  // Fetch danh sách xã/phường
  try {
    loadingWards.value = true
    // API nhận provinceId (Integer)
    const provinceId = parseInt(form.value.tinhCode)
    const response = await addressService.getWardsByProvince(provinceId)
    wards.value = response.data || response || []
  } catch (error) {
    console.error('Error fetching wards:', error)
    toast.error('Không thể tải danh sách xã/phường')
  } finally {
    loadingWards.value = false
  }
}

// Watch xaCode để cập nhật form.xa
watch(
  () => form.value.xaCode,
  (newValue) => {
    if (newValue) {
      form.value.xa = newValue
    }
  },
)

watch(
  () => props.maKhachHang,
  (newVal) => {
    if (newVal) {
      form.value.maKhachHang = newVal
    }
  },
)

const validateMaKhachHang = () => {
  if (!form.value.maKhachHang || form.value.maKhachHang.trim() === '') {
    errors.value.maKhachHang = 'Mã khách hàng không được để trống'
    return false
  }
  delete errors.value.maKhachHang
  return true
}

const validateHoTen = () => {
  if (!form.value.hoTen || form.value.hoTen.trim() === '') {
    errors.value.hoTen = 'Họ và tên không được để trống'
    return false
  }
  delete errors.value.hoTen
  return true
}

const validateSDT = () => {
  if (!form.value.sdt || form.value.sdt.trim() === '') {
    errors.value.sdt = 'Số điện thoại không được để trống'
    return false
  }
  if (!/^[0-9]{10,11}$/.test(form.value.sdt)) {
    errors.value.sdt = 'Số điện thoại không hợp lệ'
    return false
  }
  delete errors.value.sdt
  return true
}

const validateDiaChi = () => {
  if (!form.value.diaChi || form.value.diaChi.trim() === '') {
    errors.value.diaChi = 'Địa chỉ không được để trống'
    return false
  }
  delete errors.value.diaChi
  return true
}

const validateForm = () => {
  let isValid = true
  isValid = validateMaKhachHang() && isValid
  isValid = validateHoTen() && isValid
  isValid = validateSDT() && isValid
  isValid = validateDiaChi() && isValid
  return isValid
}

const handleReset = () => {
  form.value = {
    maKhachHang: props.maKhachHang || '',
    hoTen: '',
    sdt: '',
    diaChi: '',
    xa: '',
    tinh: '',
    xaCode: '',
    tinhCode: '',
    macDinh: false,
  }
  wards.value = []
  errors.value = {}
}

const handleSave = async () => {
  if (!validateForm()) {
    toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }

  loading.value = true
  try {
    await addressService.addAddress(form.value)
    toast.success('Thêm địa chỉ thành công!')
    handleReset()
    emit('success')
  } catch (error) {
    console.error('Error adding address:', error)
    toast.error(
      'Có lỗi xảy ra khi thêm địa chỉ: ' + (error.response?.data?.message || error.message),
    )
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.dia-chi-form {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(60, 72, 88, 0.08);
}

.form-label {
  font-weight: 500;
  font-size: 0.9rem;
}

.text-danger {
  font-weight: bold;
  font-size: 1.1em;
}
</style>
