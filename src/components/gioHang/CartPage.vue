<template>
  <div class="cart-page-wrapper">
    <div class="cart-container-wrapper">
      <div class="cart-container">
        <!-- Header -->
        <div class="cart-header">
          <button @click="goBack" class="back-button">
            <span class="back-icon">←</span>
          </button>
          <h1 class="cart-title">Giỏ hàng của bạn</h1>
        </div>

        <!-- Loading State -->
        <div v-if="cartStore.loading && !cartStore.cart" class="loading-state">
          <LoadingSpinner />
          <p>Đang tải giỏ hàng...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="cartStore.error && !cartStore.hasItems" class="error-state">
          <p class="error-message">{{ cartStore.error }}</p>
          <button @click="cartStore.fetchCart()" class="retry-btn">Thử lại</button>
        </div>

        <!-- Empty Cart State -->
        <EmptyCart v-else-if="!cartStore.hasItems" @shop-now="goToProducts" />

        <!-- Cart Content -->
        <div v-else class="cart-content-grid">
          <!-- Left Column - Cart Items -->
          <div class="cart-items-section">
            <!-- Select All -->
            <div class="select-all-bar">
              <label class="select-all-checkbox">
                <input type="checkbox" :checked="allSelected" @change="handleSelectAll" />
                <span>Chọn tất cả ({{ cartStore.cartCount }} sản phẩm)</span>
              </label>

              <button v-if="cartStore.hasItems" @click="handleClearCart" class="clear-cart-btn">
                Xóa giỏ hàng
              </button>
            </div>

            <!-- Cart Items List -->
            <div class="cart-items-list">
              <CartItem
                v-for="item in cartStore.cartItems"
                :key="item.id"
                :item="item"
                :loading="cartStore.loading"
                @toggle-selection="cartStore.toggleItemSelection"
                @increase="handleIncrease"
                @decrease="handleDecrease"
                @update="handleUpdateQuantity"
                @remove="handleRemoveItem"
              />
            </div>
          </div>

          <!-- Right Column - Summary & Voucher -->
          <div class="cart-sidebar">
            <!-- Voucher Section -->
            <VoucherInput
              :applied-voucher="cartStore.appliedVoucher"
              :discount-amount="cartStore.discount"
              :available-vouchers="availableVouchers"
              :loading="cartStore.loading"
              @apply="handleApplyVoucher"
              @remove="handleRemoveVoucher"
            />

            <!-- Cart Summary -->
            <CartSummary
              :subtotal="cartStore.subtotal"
              :discount="cartStore.discount"
              :shipping-fee="cartStore.shippingFee"
              :total="cartStore.total"
              :applied-voucher="cartStore.appliedVoucher"
              :selected-count="cartStore.selectedItems.length"
              :loading="cartStore.loading"
              @checkout="handleCheckout"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/customer/cartStore'
import voucherService from '@/service/customer/voucherService'
import CartItem from '../customer/cart/CartItem.vue'
import CartSummary from '../customer/cart/CartSummary.vue'
import VoucherInput from '../customer/cart/VoucherInput.vue'
import EmptyCart from '../customer/cart/EmptyCart.vue'
import LoadingSpinner from '../customer/common/LoadingSpinner.vue'

const router = useRouter()
const cartStore = useCartStore()

const availableVouchers = ref([])

// Computed
const allSelected = computed(() => {
  return cartStore.cartItems.length > 0 && cartStore.cartItems.every((item) => item.selected)
})

// Lifecycle
onMounted(async () => {
  await cartStore.fetchCart()
  await fetchAvailableVouchers()
})

// Methods
const goBack = () => {
  router.back()
}

const goToProducts = () => {
  router.push('/products')
}

const handleSelectAll = () => {
  cartStore.toggleSelectAll()
}

const handleIncrease = async (itemId) => {
  const result = await cartStore.increaseQuantity(itemId)
  if (!result.success) {
    alert(result.message || 'Không thể tăng số lượng')
  }
}

const handleDecrease = async (itemId) => {
  const result = await cartStore.decreaseQuantity(itemId)
  if (!result.success) {
    alert(result.message || 'Không thể giảm số lượng')
  }
}

const handleUpdateQuantity = async (itemId, quantity) => {
  const result = await cartStore.updateCartItem(itemId, quantity)
  if (!result.success) {
    alert(result.message || 'Không thể cập nhật số lượng')
  }
}

const handleRemoveItem = async (itemId) => {
  if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
    const result = await cartStore.removeCartItem(itemId)
    if (!result.success) {
      alert(result.message || 'Không thể xóa sản phẩm')
    }
  }
}

const handleClearCart = async () => {
  if (confirm('Bạn có chắc muốn xóa toàn bộ giỏ hàng?')) {
    await cartStore.clearCart()
  }
}

const handleApplyVoucher = async (voucherCode) => {
  const result = await cartStore.applyVoucher(voucherCode)
  return result
}

const handleRemoveVoucher = () => {
  cartStore.removeVoucher()
}

const handleCheckout = () => {
  if (cartStore.selectedItems.length === 0) {
    alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán')
    return
  }
  router.push('/checkout')
}

const fetchAvailableVouchers = async () => {
  try {
    const response = await voucherService.getAvailableVouchers()
    if (response.success) {
      availableVouchers.value = response.data || []
    }
  } catch (error) {
    console.error(' Error fetching vouchers:', error)
  }
}
</script>

<style scoped>
.cart-page-wrapper {
  min-height: calc(100vh - 200px);
  background: #f8fafc;
  padding: 20px 0;
}

.cart-container-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

.cart-container {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

/* Header */
.cart-header {
  display: flex;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #ffffff;
  position: sticky;
  top: 0;
  z-index: 10;
}

.back-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background 0.2s;
}

.back-button:hover {
  background: #f3f4f6;
}

.back-icon {
  font-size: 24px;
  color: #1f2937;
}

.cart-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.loading-state p,
.error-message {
  margin-top: 16px;
  font-size: 16px;
  color: #6b7280;
}

.retry-btn {
  margin-top: 16px;
  padding: 10px 24px;
  background: #10b981;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
}

.retry-btn:hover {
  background: #059669;
}

/* Cart Content Grid */
.cart-content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 24px;
  padding: 24px;
}

/* Left Column */
.cart-items-section {
  min-height: 400px;
}

.select-all-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  margin-bottom: 16px;
}

.select-all-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 15px;
  color: #1f2937;
  font-weight: 500;
}

.select-all-checkbox input[type='checkbox'] {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #10b981;
}

.clear-cart-btn {
  padding: 8px 16px;
  background: none;
  border: 1px solid #dc2626;
  color: #dc2626;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-cart-btn:hover {
  background: #dc2626;
  color: #ffffff;
}

.cart-items-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

/* Right Column */
.cart-sidebar {
  position: sticky;
  top: 120px;
  align-self: start;
}

/* Responsive */
@media (max-width: 1024px) {
  .cart-content-grid {
    grid-template-columns: 1fr;
  }

  .cart-sidebar {
    position: static;
  }
}

@media (max-width: 640px) {
  .cart-container {
    border-radius: 0;
  }

  .cart-header {
    padding: 16px;
  }

  .cart-title {
    font-size: 20px;
  }

  .cart-content-grid {
    padding: 16px;
    gap: 16px;
  }

  .select-all-bar {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .clear-cart-btn {
    width: 100%;
  }
}
</style>
