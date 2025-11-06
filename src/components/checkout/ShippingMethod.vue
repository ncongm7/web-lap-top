<template>
  <div class="shipping-method">
    <h2>Phương thức vận chuyển</h2>

    <div class="methods-list">
      <label
        v-for="method in shippingMethods"
        :key="method.id"
        class="method-card"
        :class="{ active: selectedMethod?.id === method.id }"
      >
        <input
          type="radio"
          :value="method"
          :checked="selectedMethod?.id === method.id"
          @change="selectMethod(method)"
        />
        <div class="method-content">
          <div class="method-header">
            <span class="method-name">{{ method.name }}</span>
            <span class="method-fee">{{ formatPrice(method.fee) }}</span>
          </div>
          <div class="method-description">{{ method.description }}</div>
          <div class="method-estimated">Thời gian dự kiến: {{ method.estimated_days }} ngày</div>
        </div>
      </label>
    </div>

    <div v-if="!shippingMethods.length" class="loading">Đang tải phương thức vận chuyển...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { apiService } from '../../service/ThanhToan/api.js'

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const shippingMethods = ref([])
const selectedMethod = ref(props.modelValue)

onMounted(async () => {
  await loadShippingMethods()
  // Set initial selection if modelValue exists
  if (props.modelValue) {
    selectedMethod.value = shippingMethods.value.find((m) => m.id === props.modelValue.id)
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedMethod.value = shippingMethods.value.find((m) => m.id === newValue.id)
    } else {
      selectedMethod.value = null
    }
  },
)

const loadShippingMethods = async () => {
  shippingMethods.value = await apiService.getShippingMethods()
}

const selectMethod = (method) => {
  selectedMethod.value = method
  emit('update:modelValue', method)
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}
</script>

<style scoped>
.shipping-method {
  max-width: 800px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 2rem;
  color: #2c3e50;
}

.methods-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.method-card {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: white;
}

.method-card:hover {
  border-color: #059669;
  background-color: #f8f9fa;
}

.method-card.active {
  border-color: #059669;
  background-color: #e8f5e9;
}

.method-card input[type='radio'] {
  margin-top: 0.25rem;
  cursor: pointer;
  width: auto;
}

.method-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.method-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.method-name {
  font-weight: 600;
  font-size: 1.1rem;
  color: #2c3e50;
}

.method-fee {
  font-weight: 700;
  font-size: 1.1rem;
  color: #059669;
}

.method-description {
  color: #666;
  font-size: 0.95rem;
}

.method-estimated {
  color: #059669;
  font-size: 0.9rem;
  font-weight: 500;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
