<template>
  <div class="address-form">
    <!-- Địa chỉ chi tiết -->
    <div class="mb-3">
      <label class="form-label">Địa chỉ chi tiết <span class="text-danger">*</span></label>
      <input 
        type="text" 
        class="form-control" 
        :class="{ 'is-invalid': errors.diaChi }"
        placeholder="Nhập số nhà, tên đường, khu vực..." 
        v-model="form.diaChi"
        @blur="validateDiaChi"
        @input="clearDiaChiError"
        maxlength="200"
      />
      <div v-if="errors.diaChi" class="invalid-feedback">
        {{ errors.diaChi }}
      </div>
    </div>

    <!-- Dropdown Tỉnh/Thành phố với tìm kiếm -->
    <div class="mb-3">
      <label class="form-label">Tỉnh/Thành phố <span class="text-danger">*</span></label>
      <div class="position-relative">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': errors.tinh }"
            :value="selectedProvinceName" 
            @input="handleProvinceSearch" 
            @focus="showProvinceDropdown = true"
            @blur="handleProvinceBlurAndValidate" 
            :disabled="loadingProvinces" 
            placeholder="Chọn tỉnh/thành phố"
            autocomplete="off" 
          />
          <span class="input-group-text bg-white border-start-0" style="cursor: pointer; pointer-events: none;">
            <i class="bi bi-chevron-down" v-if="!showProvinceDropdown"></i>
            <i class="bi bi-chevron-up" v-else></i>
          </span>
        </div>

        <!-- Dropdown list -->
        <div 
          v-if="showProvinceDropdown && !loadingProvinces" 
          class="dropdown-menu show w-100 position-absolute"
          style="max-height: 250px; overflow-y: auto; z-index: 9999; top: 100%; margin-top: 2px;"
        >
          <div v-if="filteredProvinces.length === 0" class="dropdown-item text-muted">
            Không tìm thấy tỉnh/thành phố
          </div>
          <a 
            v-for="province in filteredProvinces" 
            :key="province.id" 
            class="dropdown-item"
            href="javascript:void(0)" 
            @mousedown.prevent="selectProvince(province)"
            :class="{ active: form.tinhCode == province.id }"
          >
            {{ province.name }}
          </a>
        </div>
      </div>
      <div v-if="errors.tinh" class="invalid-feedback d-block">
        {{ errors.tinh }}
      </div>
      <div v-if="loadingProvinces" class="text-muted small mt-1">
        <span class="spinner-border spinner-border-sm me-1"></span> Đang tải...
      </div>
    </div>

    <!-- Dropdown Xã/Phường với tìm kiếm -->
    <div class="mb-3">
      <label class="form-label">Xã/Phường</label>
      <div class="position-relative">
        <div class="input-group">
          <input 
            type="text" 
            class="form-control" 
            :class="{ 'is-invalid': errors.xa }"
            :value="selectedWardName" 
            @input="handleWardSearch" 
            @focus="handleWardFocus" 
            @blur="handleWardBlur"
            :disabled="!form.tinhCode || loadingWards"
            :placeholder="!form.tinhCode ? 'Chọn tỉnh trước' : 'Chọn xã/phường'" 
            autocomplete="off" 
          />
          <span class="input-group-text bg-white border-start-0" style="cursor: pointer; pointer-events: none;">
            <i class="bi bi-chevron-down" v-if="!showWardDropdown"></i>
            <i class="bi bi-chevron-up" v-else></i>
          </span>
        </div>

        <!-- Dropdown list -->
        <div 
          v-if="showWardDropdown && !loadingWards && form.tinhCode"
          class="dropdown-menu show w-100 position-absolute" 
          style="max-height: 250px; overflow-y: auto; z-index: 9999; top: 100%; margin-top: 2px;"
        >
          <div v-if="filteredWards.length === 0" class="dropdown-item text-muted">
            Không tìm thấy xã/phường
          </div>
          <a 
            v-for="ward in filteredWards" 
            :key="ward.id" 
            class="dropdown-item" 
            href="javascript:void(0)"
            @mousedown.prevent="selectWard(ward)" 
            :class="{ active: form.xaCode == ward.name }"
          >
            {{ ward.name }}
          </a>
        </div>
      </div>
      <div v-if="errors.xa" class="invalid-feedback d-block">
        {{ errors.xa }}
      </div>
      <div v-if="loadingWards" class="text-muted small mt-1">
        <span class="spinner-border spinner-border-sm me-1"></span> Đang tải...
      </div>
      <div v-if="!form.tinhCode && !loadingWards" class="text-muted small mt-1">
        <i class="bi bi-info-circle"></i> Chọn tỉnh/thành phố trước
      </div>
    </div>

    <!-- Nút lưu địa chỉ -->
    <div v-if="showSaveButton" class="d-flex justify-content-end mb-2">
      <button 
        class="btn btn-outline-primary btn-sm"
        @click="handleSave"
        :disabled="isSaving"
      >
        <span v-if="isSaving" class="spinner-border spinner-border-sm me-1"></span>
        <i v-else class="bi bi-bookmark-plus me-1"></i>
        {{ isSaving ? 'Đang lưu...' : 'Lưu địa chỉ' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import addressService from '@/service/customer/addressService'
import VietnamAddressService from '@/service/customer/vietnamAddressService'
import { useAuthStore } from '@/stores/customer/authStore'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      diaChi: '',
      tinh: '',
      xa: '',
      tinhCode: '',
      xaCode: '',
    })
  },
  showSaveButton: {
    type: Boolean,
    default: false
  },
  checkDuplicateFn: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success'])

const authStore = useAuthStore()

// Simple toast functions
const showSuccess = (message) => {
  // Use browser alert for now, can be replaced with toast library later
  alert(message)
}

const showError = (message) => {
  alert(message)
}

const showWarning = (message) => {
  alert(message)
}

// Form data
const form = ref({
  diaChi: props.modelValue?.diaChi || '',
  tinh: props.modelValue?.tinh || '',
  xa: props.modelValue?.xa || '',
  tinhCode: props.modelValue?.tinhCode || '',
  xaCode: props.modelValue?.xaCode || '',
})

// Errors
const errors = ref({})

// Data
const provinces = ref([])
const wards = ref([])

// Loading states
const loadingProvinces = ref(false)
const loadingWards = ref(false)

// UI states
const showProvinceDropdown = ref(false)
const showWardDropdown = ref(false)
const provinceSearchText = ref('')
const wardSearchText = ref('')
const isSaving = ref(false)

// Computed
const filteredProvinces = computed(() => {
  if (!provinceSearchText.value.trim()) {
    return provinces.value
  }
  const searchText = provinceSearchText.value.toLowerCase().trim()
  return provinces.value.filter((province) => province.name.toLowerCase().includes(searchText))
})

const filteredWards = computed(() => {
  if (!wardSearchText.value.trim()) {
    return wards.value
  }
  const searchText = wardSearchText.value.toLowerCase().trim()
  return wards.value.filter((ward) => ward.name.toLowerCase().includes(searchText))
})

const selectedProvinceName = computed(() => {
  if (provinceSearchText.value && showProvinceDropdown.value) {
    return provinceSearchText.value
  }
  if (form.value.tinhCode) {
    const selected = provinces.value.find((p) => p.id === parseInt(form.value.tinhCode))
    return selected ? selected.name : ''
  }
  return ''
})

const selectedWardName = computed(() => {
  if (wardSearchText.value && showWardDropdown.value) {
    return wardSearchText.value
  }
  if (form.value.xaCode) {
    return form.value.xaCode
  }
  return ''
})

// Watch form changes and emit
watch(form, (newVal) => {
  emit('update:modelValue', {
    diaChi: newVal.diaChi,
    tinh: newVal.tinh,
    xa: newVal.xa,
    tinhCode: newVal.tinhCode,
    xaCode: newVal.xaCode,
  })
}, { deep: true })

// Watch props changes
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    form.value.diaChi = newVal.diaChi || ''
    form.value.tinh = newVal.tinh || ''
    form.value.xa = newVal.xa || ''
    form.value.tinhCode = newVal.tinhCode || ''
    form.value.xaCode = newVal.xaCode || ''
  }
}, { deep: true })

// Methods
const fetchProvinces = async () => {
  try {
    loadingProvinces.value = true
    const provincesData = await VietnamAddressService.getAllProvinces()
    provinces.value = provincesData || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách tỉnh/thành phố:', error)
    showError('Không thể tải danh sách tỉnh/thành phố. Vui lòng thử lại sau.')
    provinces.value = []
  } finally {
    loadingProvinces.value = false
  }
}

const handleProvinceSearch = (event) => {
  provinceSearchText.value = event.target.value
  showProvinceDropdown.value = true
}

const handleProvinceBlur = () => {
  setTimeout(() => {
    showProvinceDropdown.value = false
    if (form.value.tinhCode) {
      provinceSearchText.value = ''
    }
  }, 200)
}

const selectProvince = async (province) => {
  form.value.tinhCode = province.id
  form.value.tinh = province.name
  provinceSearchText.value = ''
  showProvinceDropdown.value = false

  // Reset xã/phường
  form.value.xaCode = ''
  form.value.xa = ''
  wards.value = []
  wardSearchText.value = ''

  // Load wards
  try {
    loadingWards.value = true
    const wardsData = await VietnamAddressService.getWardsByProvince(province.id)
    wards.value = wardsData || []
  } catch (error) {
    console.error('Lỗi khi lấy danh sách xã/phường:', error)
    showError('Không thể tải danh sách xã/phường. Vui lòng thử lại sau.')
    wards.value = []
  } finally {
    loadingWards.value = false
  }
}


const handleWardSearch = (event) => {
  wardSearchText.value = event.target.value
  showWardDropdown.value = true
}

const handleWardFocus = () => {
  if (form.value.tinhCode && !loadingWards.value) {
    showWardDropdown.value = true
  }
}

const handleWardBlur = () => {
  setTimeout(() => {
    showWardDropdown.value = false
    if (form.value.xaCode) {
      wardSearchText.value = ''
    }
  }, 200)
}

const selectWard = (ward) => {
  form.value.xaCode = ward.name
  form.value.xa = ward.name
  wardSearchText.value = ''
  showWardDropdown.value = false
}

const validateForm = () => {
  errors.value = {}
  let isValid = true

  // Validate địa chỉ chi tiết
  if (!form.value.diaChi || !form.value.diaChi.trim()) {
    errors.value.diaChi = 'Vui lòng nhập địa chỉ chi tiết'
    isValid = false
  } else if (form.value.diaChi.trim().length < 5) {
    errors.value.diaChi = 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'
    isValid = false
  } else if (form.value.diaChi.trim().length > 200) {
    errors.value.diaChi = 'Địa chỉ chi tiết không được vượt quá 200 ký tự'
    isValid = false
  }

  // Validate tỉnh/thành phố
  if (!form.value.tinhCode || !form.value.tinh) {
    errors.value.tinh = 'Vui lòng chọn tỉnh/thành phố'
    isValid = false
  }

  // Xã/phường là optional nhưng nếu đã chọn tỉnh thì nên chọn xã
  // Không bắt buộc nhưng có thể cảnh báo

  return isValid
}

// Individual validation methods
const clearDiaChiError = () => {
  if (errors.value.diaChi) {
    delete errors.value.diaChi
  }
}

const validateDiaChi = () => {
  if (!form.value.diaChi || !form.value.diaChi.trim()) {
    errors.value.diaChi = 'Vui lòng nhập địa chỉ chi tiết'
    return false
  }
  if (form.value.diaChi.trim().length < 5) {
    errors.value.diaChi = 'Địa chỉ chi tiết phải có ít nhất 5 ký tự'
    return false
  }
  if (form.value.diaChi.trim().length > 200) {
    errors.value.diaChi = 'Địa chỉ chi tiết không được vượt quá 200 ký tự'
    return false
  }
  delete errors.value.diaChi
  return true
}

const validateTinh = () => {
  if (!form.value.tinhCode || !form.value.tinh) {
    errors.value.tinh = 'Vui lòng chọn tỉnh/thành phố'
    return false
  }
  delete errors.value.tinh
  return true
}

const handleProvinceBlurAndValidate = () => {
  handleProvinceBlur()
  validateTinh()
}

const handleSave = async () => {
  if (!validateForm()) {
    showWarning('Vui lòng điền đầy đủ thông tin bắt buộc')
    return
  }

  const customerId = authStore.getCustomerId()
  if (!customerId) {
    showError('Vui lòng đăng nhập để lưu địa chỉ')
    return
  }

  // Get customer info
  let maKhachHang = ''
  try {
    const customerInfo = await addressService.getCustomerById(customerId)
    maKhachHang = customerInfo?.data?.maKhachHang || customerInfo?.maKhachHang
  } catch (error) {
    console.error('Lỗi khi lấy thông tin khách hàng:', error)
    showError('Không thể lấy thông tin khách hàng')
    return
  }

  if (!maKhachHang) {
    showError('Không tìm thấy mã khách hàng')
    return
  }

  // Check duplicate
  if (props.checkDuplicateFn && typeof props.checkDuplicateFn === 'function') {
    const isDuplicate = await props.checkDuplicateFn({
      ...form.value,
      maKhachHang
    })
    if (isDuplicate) {
      showWarning('Địa chỉ này đã có trong danh sách. Vui lòng chọn từ danh sách địa chỉ đã lưu.')
      return
    }
  }

  isSaving.value = true
  try {
    const addressData = {
      maKhachHang,
      hoTen: authStore.getCurrentUser()?.hoTen || '',
      sdt: authStore.getCurrentUser()?.soDienThoai || '',
      diaChi: form.value.diaChi,
      xa: form.value.xa,
      tinh: form.value.tinh,
      macDinh: false
    }

    const response = await addressService.addAddress(addressData)
    if (response.success || response.data) {
      showSuccess('Lưu địa chỉ thành công!')
      emit('success')
    } else {
      throw new Error(response.message || 'Không thể lưu địa chỉ')
    }
  } catch (error) {
    console.error('Lỗi khi lưu địa chỉ:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi lưu địa chỉ'
    showError(errorMessage)
  } finally {
    isSaving.value = false
  }
}

// Expose form and methods for parent component
defineExpose({
  form,
  validateForm,
  provinces,
  selectProvince
})

// Load provinces on mount
onMounted(() => {
  fetchProvinces()
})
</script>

<style scoped>
.address-form {
  width: 100%;
}

.position-relative {
  position: relative;
}

.dropdown-menu {
  display: block;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  background-color: #fff;
  margin-top: 2px;
}

.dropdown-item {
  padding: 0.375rem 0.75rem;
  cursor: pointer;
  color: #212529;
  text-decoration: none;
  display: block;
  font-size: 0.875rem;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  color: #16181b;
}

.dropdown-item.active {
  background-color: #0d6efd;
  color: #fff;
}

.dropdown-item.active:hover {
  background-color: #0b5ed7;
  color: #fff;
}

.dropdown-menu {
  max-height: 250px;
  overflow-y: auto;
  overflow-x: hidden;
  font-size: 0.875rem;
}

.dropdown-menu::-webkit-scrollbar {
  width: 8px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

