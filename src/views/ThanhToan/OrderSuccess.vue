<template>
  <div class="order-success">
    <div class="success-container">
      <div class="success-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" />
          <path
            d="M8 12l2 2 4-4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <h1>Đặt hàng thành công!</h1>

      <div class="order-info">
        <div class="info-card">
          <div class="info-label">Mã đơn hàng</div>
          <div class="info-value">{{ orderNumber || orderId }}</div>
        </div>

        <p class="success-message">
          Cảm ơn bạn đã đặt hàng! Chúng tôi đã gửi email xác nhận đơn hàng đến địa chỉ email của
          bạn.
        </p>
      </div>

      <div class="next-steps">
        <h2>Bước tiếp theo</h2>
        <ul>
          <li>Kiểm tra email để xem chi tiết đơn hàng</li>
          <li>Theo dõi đơn hàng của bạn bằng mã đơn hàng</li>
          <li>Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất</li>
        </ul>
      </div>

      <div class="action-buttons">
        <router-link to="/" class="btn btn-secondary"> Về trang chủ </router-link>
        <button class="btn btn-primary" @click="trackOrder">Theo dõi đơn hàng</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const orderId = ref(route.params.orderId)
const orderNumber = ref(route.query.orderNumber || '')

onMounted(() => {
  // In a real app, you might fetch order details here
  console.log('Order ID:', orderId.value)
  console.log('Order Number:', orderNumber.value)
})

const trackOrder = () => {
  // Navigate to order tracking page
  // router.push({ name: 'OrderTracking', params: { orderId: orderId.value } })
  alert(`Theo dõi đơn hàng: ${orderNumber.value || orderId.value}`)
}
</script>

<style scoped>
.order-success {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.success-container {
  max-width: 600px;
  width: 100%;
  background-color: white;
  border-radius: 8px;
  padding: 3rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.success-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: #059669;
}

.success-icon svg {
  width: 100%;
  height: 100%;
}

h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.order-info {
  margin-bottom: 2rem;
}

.info-card {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.info-label {
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #059669;
}

.success-message {
  color: #666;
  line-height: 1.6;
  margin-top: 1rem;
}

.next-steps {
  text-align: left;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.next-steps h2 {
  font-size: 1.2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

.next-steps ul {
  list-style: none;
  padding: 0;
}

.next-steps li {
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  color: #666;
}

.next-steps li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #059669;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #059669;
  color: white;
}

.btn-primary:hover {
  background-color: #047857;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #2c3e50;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
