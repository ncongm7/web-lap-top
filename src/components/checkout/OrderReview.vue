<template>
  <div class="order-review">
    <h2>Xác nhận đơn hàng</h2>

    <!-- Products Review -->
    <div class="review-section">
      <h3>Danh sách sản phẩm</h3>
      <div class="products-list">
        <div v-for="item in cartItems" :key="item.id" class="product-item">
          <img :src="item.product_image" :alt="item.product_name" class="product-image" />
          <div class="product-info">
            <div class="product-name">{{ item.product_name }}</div>
            <div class="product-quantity">Số lượng: {{ item.quantity }}</div>
          </div>
          <div class="product-price">{{ formatPrice(item.subtotal) }}</div>
        </div>
      </div>
    </div>

    <!-- Shipping Info Review -->
    <div class="review-section">
      <h3>Thông tin giao hàng</h3>
      <div class="info-display">
        <div class="info-row">
          <span class="info-label">Họ tên:</span>
          <span class="info-value">{{ shippingInfo.full_name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Số điện thoại:</span>
          <span class="info-value">{{ shippingInfo.phone }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">{{ shippingInfo.email }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Địa chỉ:</span>
          <span class="info-value">
            {{ shippingInfo.address_detail }}, {{ getWardName(shippingInfo.ward_id) }},
            {{ getProvinceName(shippingInfo.province_id) }}
          </span>
        </div>
        <div v-if="shippingInfo.order_note" class="info-row">
          <span class="info-label">Ghi chú:</span>
          <span class="info-value">{{ shippingInfo.order_note }}</span>
        </div>
      </div>
    </div>

    <!-- Shipping Method Review -->
    <div v-if="shippingMethod" class="review-section">
      <h3>Phương thức vận chuyển</h3>
      <div class="info-display">
        <div class="info-row">
          <span class="info-label">Hình thức:</span>
          <span class="info-value">{{ shippingMethod.name }}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Thời gian dự kiến:</span>
          <span class="info-value">{{ shippingMethod.estimated_days }} ngày</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phí vận chuyển:</span>
          <span class="info-value">{{ formatPrice(shippingMethod.fee) }}</span>
        </div>
      </div>
    </div>

    <!-- Payment Method Review -->
    <div v-if="paymentMethod" class="review-section">
      <h3>Phương thức thanh toán</h3>
      <div class="info-display">
        <div class="info-row">
          <span class="info-label">Phương thức:</span>
          <span class="info-value">{{ paymentMethod.name }}</span>
        </div>
      </div>
    </div>

    <!-- Order Summary -->
    <div class="review-section order-summary">
      <h3>Tổng tiền</h3>
      <div class="summary-row">
        <span>Tạm tính:</span>
        <span>{{ formatPrice(subtotal) }}</span>
      </div>
      <div v-if="discount > 0" class="summary-row">
        <span>Giảm giá:</span>
        <span class="discount">-{{ formatPrice(discount) }}</span>
      </div>
      <div class="summary-row">
        <span>Phí vận chuyển:</span>
        <span>{{ formatPrice(shippingFee) }}</span>
      </div>
      <div class="summary-row total">
        <span>Tổng cộng:</span>
        <span>{{ formatPrice(total) }}</span>
      </div>
    </div>

    <!-- Terms Checkbox -->
    <div class="terms-section">
      <label class="terms-checkbox">
        <input type="checkbox" v-model="agreeTerms" required />
        <span
          >Tôi đồng ý với <a href="#" @click.prevent>điều khoản và điều kiện</a> của website</span
        >
      </label>
      <span v-if="showErrors && errors.agreeTerms" class="error">{{ errors.agreeTerms }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { apiService } from '../../service/ThanhToan/api.js'

const props = defineProps({
  shippingInfo: {
    type: Object,
    required: true,
  },
  shippingMethod: {
    type: Object,
    default: null,
  },
  paymentMethod: {
    type: Object,
    default: null,
  },
  cartItems: {
    type: Array,
    default: () => [],
  },
  discount: {
    type: Number,
    default: 0,
  },
})

const emit = defineEmits(['validate'])

const agreeTerms = ref(false)
const errors = reactive({})
const provinces = ref([])
const wards = ref([])
const showErrors = ref(false) // Chỉ hiển thị lỗi sau khi user click button

const subtotal = computed(() => {
  return props.cartItems.reduce((sum, item) => sum + item.subtotal, 0)
})

const shippingFee = computed(() => {
  return props.shippingMethod?.fee || 0
})

const total = computed(() => {
  return subtotal.value - props.discount + shippingFee.value
})

onMounted(async () => {
  await loadLocationData()
})

// Watch for checkbox changes - chỉ validate nếu đã show errors
watch(agreeTerms, () => {
  if (showErrors.value) {
    validate()
  }
})

const loadLocationData = async () => {
  provinces.value = await apiService.getProvinces()
  if (props.shippingInfo.province_id) {
    wards.value = await apiService.getWardsByProvince(props.shippingInfo.province_id)
  }
}

const getProvinceName = (id) => {
  const province = provinces.value.find((p) => p.id === id)
  return province?.name || ''
}

const getWardName = (id) => {
  const ward = wards.value.find((w) => w.id === id)
  return ward?.name || ''
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const validate = () => {
  // Bật hiển thị lỗi
  showErrors.value = true

  errors.agreeTerms = ''
  if (!agreeTerms.value) {
    errors.agreeTerms = 'Vui lòng đồng ý với điều khoản và điều kiện'
    emit('validate', false)
    return false
  }
  emit('validate', true)
  return true
}

defineExpose({ validate })
</script>

<style scoped>
.order-review {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.review-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.review-section h3 {
  margin-bottom: 1rem;
  color: #059669;
  font-size: 1.1rem;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.product-quantity {
  font-size: 0.875rem;
  color: #666;
}

.product-price {
  font-weight: 600;
  color: #059669;
  font-size: 1.1rem;
}

.info-display {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-row {
  display: flex;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-weight: 500;
  color: #666;
  min-width: 150px;
}

.info-value {
  color: #2c3e50;
  flex: 1;
}

.order-summary {
  background-color: #e8f5e9;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  font-size: 1rem;
}

.summary-row.total {
  font-size: 1.3rem;
  font-weight: 700;
  color: #2c3e50;
  border-top: 2px solid #059669;
  padding-top: 1rem;
  margin-top: 0.5rem;
}

.discount {
  color: #e74c3c;
}

.terms-section {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #fff3cd;
  border-radius: 4px;
  border-left: 4px solid #ffc107;
}

.terms-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  cursor: pointer;
}

.terms-checkbox input[type='checkbox'] {
  width: auto;
  margin-top: 0.25rem;
  cursor: pointer;
}

.terms-checkbox a {
  color: #42b983;
  text-decoration: underline;
}

.error {
  display: block;
  color: #e74c3c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
</style>
