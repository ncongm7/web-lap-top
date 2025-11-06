<template>
  <div class="checkout">
    <div class="checkout-container">
      <!-- Progress Steps -->
      <div class="progress-steps">
        <div
          v-for="(step, index) in steps"
          :key="index"
          class="step"
          :class="{ active: currentStep === index + 1, completed: currentStep > index + 1 }"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
      </div>

      <!-- Step Content -->
      <div class="step-content">
        <!-- Step 1: Shipping Info -->
        <ShippingInfo
          v-if="currentStep === 1"
          ref="shippingInfoRef"
          v-model="checkoutData.shippingInfo"
          @validate="onStep1Validate"
        />

        <!-- Step 2: Shipping Method -->
        <ShippingMethod
          v-if="currentStep === 2"
          v-model="checkoutData.shippingMethod"
          @update:modelValue="onShippingMethodChange"
        />

        <!-- Step 3: Payment Method -->
        <PaymentMethod
          v-if="currentStep === 3"
          v-model="checkoutData.paymentMethod"
          @update:modelValue="onPaymentMethodChange"
        />

        <!-- Step 4: Order Review -->
        <OrderReview
          v-if="currentStep === 4"
          ref="orderReviewRef"
          :shipping-info="checkoutData.shippingInfo"
          :shipping-method="checkoutData.shippingMethod"
          :payment-method="checkoutData.paymentMethod"
          :cart-items="cartItems"
          :discount="discount"
          @validate="onStep4Validate"
        />
      </div>

      <!-- Navigation Buttons -->
      <div class="checkout-actions">
        <button
          v-if="currentStep > 1"
          type="button"
          class="btn btn-secondary"
          @click="previousStep"
        >
          Quay lại
        </button>
        <button
          v-if="currentStep < 4"
          type="button"
          class="btn btn-primary"
          :disabled="isPlacingOrder"
          @click="nextStep"
        >
          Tiếp tục
        </button>
        <button
          v-if="currentStep === 4"
          type="button"
          class="btn btn-primary"
          :disabled="isPlacingOrder"
          @click="placeOrder"
        >
          {{ isPlacingOrder ? 'Đang xử lý...' : 'Đặt hàng' }}
        </button>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ShippingInfo from '../../components/checkout/ShippingInfo.vue'
import ShippingMethod from '../../components/checkout/ShippingMethod.vue'
import PaymentMethod from '../../components/checkout/PaymentMethod.vue'
import OrderReview from '../../components/checkout/OrderReview.vue'
import { apiService } from '../../service/ThanhToan/api.js'

defineOptions({
  name: 'CheckoutPage',
})

const router = useRouter()

const steps = [
  { label: 'Thông tin giao hàng' },
  { label: 'Phương thức vận chuyển' },
  { label: 'Phương thức thanh toán' },
  { label: 'Xác nhận đơn hàng' },
]

const currentStep = ref(1)
const canProceed = ref(false)
const canPlaceOrder = ref(false)
const isPlacingOrder = ref(false)
const errorMessage = ref('')
const shippingInfoRef = ref(null)
const orderReviewRef = ref(null)

const cartItems = ref([])
const discount = ref(0)

const checkoutData = reactive({
  shippingInfo: {},
  shippingMethod: null,
  paymentMethod: null,
})

onMounted(async () => {
  await loadCartItems()
  // Validate cart before checkout
  const validation = await apiService.validateCart(cartItems.value)
  if (!validation.valid) {
    errorMessage.value = validation.errors.join(', ')
  }
})

const loadCartItems = async () => {
  cartItems.value = await apiService.getCartItems()
}

const onStep1Validate = (isValid) => {
  canProceed.value = isValid
}

const onStep4Validate = (isValid) => {
  canPlaceOrder.value = isValid
}

const onShippingMethodChange = (method) => {
  checkoutData.shippingMethod = method
  if (method) {
    canProceed.value = true
  }
}

const onPaymentMethodChange = (method) => {
  checkoutData.paymentMethod = method
  if (method) {
    canProceed.value = true
  }
}

const nextStep = async () => {
  // Validate step 1 trước khi chuyển
  if (currentStep.value === 1) {
    if (shippingInfoRef.value) {
      const isValid = shippingInfoRef.value.validate()
      if (!isValid) {
        return // Dừng lại nếu validation fail, lỗi sẽ hiển thị
      }
    }
  }

  if (currentStep.value < 4) {
    currentStep.value++
    errorMessage.value = ''
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    canProceed.value = true
    errorMessage.value = ''
  }
}

const placeOrder = async () => {
  if (orderReviewRef.value) {
    const isValid = orderReviewRef.value.validate()
    if (!isValid) {
      return
    }
  }

  // Final validation
  if (!checkoutData.shippingInfo.full_name) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin giao hàng'
    currentStep.value = 1
    return
  }

  if (!checkoutData.shippingMethod) {
    errorMessage.value = 'Vui lòng chọn phương thức vận chuyển'
    currentStep.value = 2
    return
  }

  if (!checkoutData.paymentMethod) {
    errorMessage.value = 'Vui lòng chọn phương thức thanh toán'
    currentStep.value = 3
    return
  }

  isPlacingOrder.value = true
  errorMessage.value = ''

  try {
    // Calculate totals
    const subtotal = cartItems.value.reduce((sum, item) => sum + item.subtotal, 0)
    const shippingFee = checkoutData.shippingMethod.fee
    const total = subtotal - discount.value + shippingFee

    const orderData = {
      shipping_info: checkoutData.shippingInfo,
      shipping_method: checkoutData.shippingMethod,
      payment_method: checkoutData.paymentMethod,
      cart_items: cartItems.value,
      subtotal,
      discount: discount.value,
      shipping_fee: shippingFee,
      total,
      order_note: checkoutData.shippingInfo.order_note || '',
    }

    // Validate stock before placing order
    const validation = await apiService.validateCart(cartItems.value)
    if (!validation.valid) {
      errorMessage.value = 'Có lỗi xảy ra: ' + validation.errors.join(', ')
      isPlacingOrder.value = false
      return
    }

    // Create order
    const result = await apiService.createOrder(orderData)

    if (result.success) {
      // Redirect to success page
      router.push({
        name: 'OrderSuccess',
        params: { orderId: result.order_id },
        query: { orderNumber: result.order_number },
      })
    } else {
      errorMessage.value = result.message || 'Đặt hàng thất bại. Vui lòng thử lại.'
      isPlacingOrder.value = false
    }
  } catch (error) {
    console.error('Error placing order:', error)
    errorMessage.value = 'Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.'
    isPlacingOrder.value = false
  }
}
</script>

<style scoped>
.checkout {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem 1rem;
}

.checkout-container {
  max-width: 1200px;
  margin: 0 auto;
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.progress-steps {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
}

.progress-steps::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 0;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0e0e0;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.step.active .step-number {
  background-color: #059669;
  color: white;
}

.step.completed .step-number {
  background-color: #059669;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: #666;
  text-align: center;
  max-width: 150px;
}

.step.active .step-label {
  color: #059669;
  font-weight: 600;
}

.step.completed .step-label {
  color: #059669;
}

.step-content {
  min-height: 400px;
  margin-bottom: 2rem;
}

.checkout-actions {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #059669;
  color: white;
  margin-left: auto;
}

.btn-primary:hover:not(:disabled) {
  background-color: #047857;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  text-align: center;
}

@media (max-width: 768px) {
  .progress-steps {
    flex-direction: column;
    gap: 1rem;
  }

  .progress-steps::before {
    display: none;
  }

  .step {
    flex-direction: row;
    justify-content: flex-start;
    width: 100%;
  }

  .step-number {
    margin-right: 1rem;
    margin-bottom: 0;
  }

  .step-label {
    text-align: left;
    max-width: none;
  }

  .checkout-actions {
    flex-direction: column;
  }

  .btn-primary {
    margin-left: 0;
    width: 100%;
  }
}
</style>
