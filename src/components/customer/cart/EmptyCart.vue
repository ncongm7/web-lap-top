<template>
  <div class="empty-cart">
    <div class="empty-icon">🛒</div>
    <h2 class="empty-title">Giỏ hàng của bạn đang trống</h2>
    <p class="empty-text">
      Hãy khám phá những sản phẩm tuyệt vời của chúng tôi và thêm chúng vào giỏ hàng!
    </p>
    <button @click="goToProducts" class="shop-now-btn">Mua sắm ngay</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToProducts = () => {
  router.push('/products')
}
</script>

<style scoped>
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
  min-height: 400px;
}

.empty-icon {
  font-size: 120px;
  margin-bottom: 24px;
  opacity: 0.5;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-20px);
  }
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 12px 0;
}

.empty-text {
  font-size: 16px;
  color: #6b7280;
  max-width: 500px;
  margin: 0 0 32px 0;
  line-height: 1.6;
}

.shop-now-btn {
  background: #10b981;
  color: #ffffff;
  border: none;
  padding: 14px 40px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(16, 185, 129, 0.2);
}

.shop-now-btn:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(16, 185, 129, 0.3);
}

.shop-now-btn:active {
  transform: translateY(0);
}

@media (max-width: 640px) {
  .empty-icon {
    font-size: 80px;
  }

  .empty-title {
    font-size: 20px;
  }

  .empty-text {
    font-size: 14px;
  }

  .shop-now-btn {
    padding: 12px 32px;
    font-size: 14px;
  }
}
</style>
