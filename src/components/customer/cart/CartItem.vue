<template>
  <div v-if="item" class="cart-item">
    <!-- Item Checkbox -->
    <div class="item-checkbox">
      <input type="checkbox" :checked="item.selected" @change="toggleSelection(itemId)" />
    </div>

    <!-- Item Content -->
    <div class="item-content">
      <!-- Product Info -->
      <div class="product-info">
        <img :src="item.imageUrl" :alt="item.tenSanPham" class="product-image" />

        <div class="product-details">
          <h3 class="product-name">{{ item.tenSanPham }}</h3>
          <p v-if="item.variantName" class="variant-name">{{ item.variantName }}</p>

          <div class="price-section">
            <span class="current-price">{{ formatPrice(item.price) }}</span>
          </div>

          <!-- Quantity Controls -->
          <div class="quantity-controls">
            <button @click="decreaseQuantity(itemId)" class="quantity-btn" :disabled="item.quantity <= 1 || loading">
              -
            </button>
            <input type="number" :value="item.quantity" @change="handleQuantityChange" class="quantity-input" min="1"
              :max="item.maxQuantity" :disabled="loading" />
            <button @click="increaseQuantity(itemId)" class="quantity-btn"
              :disabled="item.quantity >= item.maxQuantity || loading">
              +
            </button>
          </div>

          <p v-if="item.maxQuantity" class="stock-info">Còn {{ item.maxQuantity }} sản phẩm</p>
        </div>

        <!-- Delete Button -->
        <button @click="removeItem(itemId)" class="delete-button" :disabled="loading">
          🗑
        </button>
      </div>

      <!-- Subtotal -->
      <div class="item-subtotal">
        <span class="subtotal-label">Thành tiền:</span>
        <span class="subtotal-amount">{{ formatPrice(item.subtotal) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '@/composables/cart/useCart'

// Nhận itemId thay vì item object
const props = defineProps({
  itemId: {
    type: String,
    required: true,
  },
})

// Dùng composable thay vì props/emits
const {
  getItemById,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeItem,
  toggleSelection,
  loading,
} = useCart()

// Lấy item từ store bằng itemId
const item = computed(() => getItemById(props.itemId))

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const handleQuantityChange = (event) => {
  const newQuantity = parseInt(event.target.value)
  if (newQuantity > 0 && newQuantity <= item.value?.maxQuantity) {
    updateQuantity(props.itemId, newQuantity)
  }
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  background: #ffffff;
}

.item-checkbox {
  padding-top: 8px;
}

.item-checkbox input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #dc2626;
}

.item-content {
  flex: 1;
}

.product-info {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.variant-name {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: #4b5563;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-btn:hover:not(:disabled) {
  border-color: #dc2626;
  color: #dc2626;
}

.quantity-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity-input {
  width: 50px;
  height: 32px;
  text-align: center;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
}

.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.stock-info {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.delete-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  color: #6b7280;
  transition: color 0.2s;
}

.delete-button:hover:not(:disabled) {
  color: #dc2626;
}

.delete-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.item-subtotal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.subtotal-label {
  font-size: 13px;
  color: #6b7280;
}

.subtotal-amount {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
}

@media (max-width: 640px) {
  .product-name {
    font-size: 13px;
  }

  .current-price {
    font-size: 14px;
  }

  .quantity-btn,
  .quantity-input {
    height: 28px;
  }

  .quantity-btn {
    width: 28px;
    font-size: 14px;
  }

  .quantity-input {
    width: 45px;
  }
}
</style>
