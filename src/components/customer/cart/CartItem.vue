<template>
  <div v-if="item" class="cart-item-card">
    <!-- Checkbox Wrapper -->
    <div class="checkbox-wrapper">
      <label class="custom-checkbox">
        <input type="checkbox" :checked="item.selected" @change="toggleSelection(itemId)" />
        <span class="checkmark"></span>
      </label>
    </div>

    <!-- Product Image -->
    <div class="image-wrapper">
      <img :src="item.imageUrl" :alt="item.tenSanPham" class="product-image" loading="lazy" />
    </div>

    <!-- Content -->
    <div class="content-wrapper">
      <div class="product-header">
        <h3 class="product-name" :title="item.tenSanPham">{{ item.tenSanPham }}</h3>
        <button @click="handleRemove" class="delete-btn" :disabled="loading" title="Xóa sản phẩm">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      <p v-if="item.variantName" class="variant-text">{{ item.variantName }}</p>

      <div class="price-quantity-row">
        <!-- Price -->
        <div class="price-info">
          <div class="current-price">{{ formatPrice(item.price) }}</div>
          <!-- <div v-if="item.originalPrice > item.price" class="original-price">{{ formatPrice(item.originalPrice) }}</div> -->
        </div>

        <!-- Quantity Stepper -->
        <div class="quantity-stepper">
          <button @click="decreaseQuantity(itemId)" class="stepper-btn minus" :disabled="item.quantity <= 1 || loading">
            -
          </button>
          <input type="number" :value="item.quantity" @change="handleQuantityChange" class="stepper-input" min="1"
            :max="item.maxQuantity" :disabled="loading" />
          <button @click="increaseQuantity(itemId)" class="stepper-btn plus"
            :disabled="item.quantity >= item.maxQuantity || loading">
            +
          </button>
        </div>
      </div>

      <!-- Subtotal for Mobile/Desktop -->
      <div class="item-footer">
        <div class="stock-status" :class="{ 'low-stock': item.maxQuantity < 5 }">
          {{ item.maxQuantity < 5 ? `Chỉ còn ${item.maxQuantity} sản phẩm` : 'Còn hàng' }} </div>
            <div class="subtotal-display">
              Thành tiền: <span class="subtotal-value">{{ formatPrice(item.subtotal) }}</span>
            </div>
        </div>
      </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCart } from '@/composables/cart/useCart'

const props = defineProps({
  itemId: {
    type: String, // Accepts both String/Number depending on ID type
    required: true,
  },
})

const {
  getItemById,
  increaseQuantity,
  decreaseQuantity,
  updateQuantity,
  removeItem,
  toggleSelection,
  loading,
} = useCart()

const item = computed(() => getItemById(props.itemId))

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const handleQuantityChange = (event) => {
  const value = parseInt(event.target.value)
  if (isNaN(value) || value < 1) {
    // Reset to current val if invalid
    event.target.value = item.value?.quantity || 1
    return
  }
  
  if (value > item.value?.maxQuantity) {
     updateQuantity(props.itemId, item.value.maxQuantity)
  } else {
     updateQuantity(props.itemId, value)
  }
}

const handleRemove = () => {
  removeItem(props.itemId)
}
</script>

<style scoped>
.cart-item-card {
  display: flex;
  padding: 16px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  transition: background-color 0.2s;
}

.cart-item-card:last-child {
  border-bottom: none;
}

.cart-item-card:hover {
  background-color: #f8fafc;
}

/* Checkbox */
.checkbox-wrapper {
  display: flex;
  align-items: center;
  padding-right: 16px;
}

.custom-checkbox {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.custom-checkbox input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  background-color: #fff;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  transition: all 0.2s;
}

.custom-checkbox:hover .checkmark {
  border-color: #10b981;
}

.custom-checkbox input:checked ~ .checkmark {
  background-color: #10b981;
  border-color: #10b981;
}

.checkmark:after {
  content: "";
  position: absolute;
  display: none;
}

.custom-checkbox input:checked ~ .checkmark:after {
  display: block;
  left: 6px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

/* Image */
.image-wrapper {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Content */
.content-wrapper {
  flex: 1;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 4px;
}

.product-name {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  padding-right: 12px;
}

.delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.delete-btn:hover {
  color: #ef4444;
  background-color: #fee2e2;
}

.variant-text {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 12px 0;
  background: #f1f5f9;
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  align-self: flex-start;
}

.price-quantity-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.current-price {
  font-size: 16px;
  font-weight: 600;
  color: #dc2626;
}

/* Stepper */
.quantity-stepper {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  overflow: hidden;
}

.stepper-btn {
  width: 30px;
  height: 30px;
  background: white;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.stepper-btn:hover:not(:disabled) {
  background: #f8fafc;
  color: #0f172a;
}

.stepper-btn:disabled {
  color: #cbd5e1;
  cursor: not-allowed;
}

.stepper-input {
  width: 40px;
  height: 30px;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #0f172a;
  -moz-appearance: textfield;
}

.stepper-input::-webkit-outer-spin-button,
.stepper-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Footer */
.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #f8fafc;
}

.stock-status {
  font-size: 12px;
  color: #10b981;
}

.stock-status.low-stock {
  color: #f59e0b;
}

.subtotal-display {
  font-size: 14px;
  color: #64748b;
}

.subtotal-value {
  color: #dc2626;
  font-weight: 600;
  margin-left: 4px;
}

@media (max-width: 640px) {
  .cart-item-card {
    padding: 12px;
  }

  .image-wrapper {
    width: 80px;
    height: 80px;
  }

  .product-name {
    font-size: 14px;
  }

  .variant-text {
    font-size: 12px;
    margin-bottom: 8px;
  }

  .price-quantity-row {
    margin-bottom: 8px;
  }

  .stepper-btn {
    width: 26px;
    height: 26px;
  }

  .stepper-input {
    width: 36px;
    height: 26px;
    font-size: 13px;
  }
}
</style>
