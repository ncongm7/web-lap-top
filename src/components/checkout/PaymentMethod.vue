<template>
  <div class="payment-method">
    <h2>Phương thức thanh toán</h2>

    <div class="methods-list">
      <label
        v-for="method in paymentMethods"
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
          </div>
          <div class="method-description">{{ method.description }}</div>
          <div v-if="method.bank_info" class="bank-info">
            <div class="bank-detail">
              <strong>Ngân hàng:</strong> {{ method.bank_info.bank_name }}
            </div>
            <div class="bank-detail">
              <strong>Số tài khoản:</strong> {{ method.bank_info.account_number }}
            </div>
            <div class="bank-detail">
              <strong>Chủ tài khoản:</strong> {{ method.bank_info.account_holder }}
            </div>
            <div v-if="method.bank_info.branch" class="bank-detail">
              <strong>Chi nhánh:</strong> {{ method.bank_info.branch }}
            </div>
          </div>
        </div>
      </label>
    </div>

    <div v-if="!paymentMethods.length" class="loading">Đang tải phương thức thanh toán...</div>
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

const paymentMethods = ref([])
const selectedMethod = ref(props.modelValue)

onMounted(async () => {
  await loadPaymentMethods()
  // Set initial selection if modelValue exists
  if (props.modelValue) {
    selectedMethod.value = paymentMethods.value.find((m) => m.id === props.modelValue.id)
  }
})

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedMethod.value = paymentMethods.value.find((m) => m.id === newValue.id)
    } else {
      selectedMethod.value = null
    }
  },
)

const loadPaymentMethods = async () => {
  paymentMethods.value = await apiService.getPaymentMethods()
}

const selectMethod = (method) => {
  selectedMethod.value = method
  emit('update:modelValue', method)
}
</script>

<style scoped>
.payment-method {
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
  gap: 0.75rem;
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

.method-description {
  color: #666;
  font-size: 0.95rem;
}

.bank-info {
  margin-top: 0.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #059669;
}

.bank-detail {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #2c3e50;
}

.bank-detail:last-child {
  margin-bottom: 0;
}

.bank-detail strong {
  color: #42b983;
  margin-right: 0.5rem;
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
