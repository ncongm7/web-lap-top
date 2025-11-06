<template>
  <div class="shipping-info">
    <h2>Thông tin giao hàng</h2>

    <form @submit.prevent class="shipping-form">
      <div class="form-group">
        <label for="full_name">Họ và tên <span class="required">*</span></label>
        <input
          id="full_name"
          v-model="formData.full_name"
          type="text"
          placeholder="Nhập họ và tên"
          required
        />
        <span v-if="showErrors && errors.full_name" class="error">{{ errors.full_name }}</span>
      </div>

      <div class="form-group">
        <label for="phone">Số điện thoại <span class="required">*</span></label>
        <input
          id="phone"
          v-model="formData.phone"
          type="tel"
          placeholder="Nhập số điện thoại"
          required
        />
        <span v-if="showErrors && errors.phone" class="error">{{ errors.phone }}</span>
      </div>

      <div class="form-group">
        <label for="email">Email <span class="required">*</span></label>
        <input id="email" v-model="formData.email" type="email" placeholder="Nhập email" required />
        <span v-if="showErrors && errors.email" class="error">{{ errors.email }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="province_id">Tỉnh/Thành phố <span class="required">*</span></label>
          <select
            id="province_id"
            v-model.number="formData.province_id"
            required
            @change="onProvinceChange"
          >
            <option value="">Chọn tỉnh/thành phố</option>
            <option v-for="province in provinces" :key="province.id" :value="province.id">
              {{ province.name }}
            </option>
          </select>
          <span v-if="showErrors && errors.province_id" class="error">{{
            errors.province_id
          }}</span>
        </div>

        <div class="form-group">
          <label for="ward_id">Phường/Xã <span class="required">*</span></label>
          <select
            id="ward_id"
            v-model.number="formData.ward_id"
            :disabled="!formData.province_id"
            required
          >
            <option value="">Chọn phường/xã</option>
            <option v-for="ward in wards" :key="ward.id" :value="ward.id">
              {{ ward.name }}
            </option>
          </select>
          <span v-if="showErrors && errors.ward_id" class="error">{{ errors.ward_id }}</span>
        </div>
      </div>

      <div class="form-group">
        <label for="address_detail">Địa chỉ chi tiết <span class="required">*</span></label>
        <input
          id="address_detail"
          v-model="formData.address_detail"
          type="text"
          placeholder="Số nhà, tên đường..."
          required
        />
        <span v-if="showErrors && errors.address_detail" class="error">{{
          errors.address_detail
        }}</span>
      </div>

      <div class="form-group">
        <label for="order_note">Ghi chú đơn hàng (tùy chọn)</label>
        <textarea
          id="order_note"
          v-model="formData.order_note"
          rows="3"
          placeholder="Ghi chú thêm cho đơn hàng..."
        />
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { apiService } from '../../service/ThanhToan/api.js'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'validate'])

const formData = reactive({
  full_name: props.modelValue.full_name || '',
  phone: props.modelValue.phone || '',
  email: props.modelValue.email || '',
  province_id: props.modelValue.province_id || null,
  ward_id: props.modelValue.ward_id || null,
  address_detail: props.modelValue.address_detail || '',
  order_note: props.modelValue.order_note || '',
})

const provinces = ref([])
const wards = ref([])
const errors = reactive({})
const showErrors = ref(false)

onMounted(async () => {
  await loadProvinces()
  if (formData.province_id) {
    await loadWards(formData.province_id)
  }
})

// Watch formData changes and emit to parent
watch(
  formData,
  () => {
    emit('update:modelValue', { ...formData })
    if (showErrors.value) {
      validate()
    }
  },
  { deep: true },
)

const loadProvinces = async () => {
  provinces.value = await apiService.getProvinces()
}

const loadWards = async (provinceId) => {
  if (provinceId) {
    wards.value = await apiService.getWardsByProvince(provinceId)
    // Reset ward_id if province changes
    if (formData.ward_id && !wards.value.find((w) => w.id === formData.ward_id)) {
      formData.ward_id = null
    }
  } else {
    wards.value = []
    formData.ward_id = null
  }
}

const onProvinceChange = async () => {
  await loadWards(formData.province_id)
  if (showErrors.value) {
    validate()
  }
}

const validate = () => {
  showErrors.value = true
  let isValid = true

  // Clear previous errors
  Object.keys(errors).forEach((key) => {
    errors[key] = ''
  })

  // Validate full_name
  if (!formData.full_name || formData.full_name.trim() === '') {
    errors.full_name = 'Vui lòng nhập họ và tên'
    isValid = false
  }

  // Validate phone
  if (!formData.phone || formData.phone.trim() === '') {
    errors.phone = 'Vui lòng nhập số điện thoại'
    isValid = false
  } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
    errors.phone = 'Số điện thoại không hợp lệ'
    isValid = false
  }

  // Validate email
  if (!formData.email || formData.email.trim() === '') {
    errors.email = 'Vui lòng nhập email'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = 'Email không hợp lệ'
    isValid = false
  }

  // Validate province
  if (!formData.province_id) {
    errors.province_id = 'Vui lòng chọn tỉnh/thành phố'
    isValid = false
  }

  // Validate ward
  if (!formData.ward_id) {
    errors.ward_id = 'Vui lòng chọn phường/xã'
    isValid = false
  }

  // Validate address_detail
  if (!formData.address_detail || formData.address_detail.trim() === '') {
    errors.address_detail = 'Vui lòng nhập địa chỉ chi tiết'
    isValid = false
  }

  emit('validate', isValid)
  return isValid
}

defineExpose({ validate })
</script>

<style scoped>
.shipping-info {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.shipping-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 500;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983;
}

.form-group select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error {
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: -0.25rem;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
