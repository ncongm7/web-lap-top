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
                <div v-if="loading && !hasItems" class="loading-state">
                    <LoadingSpinner />
                    <p>Đang tải giỏ hàng...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error && !hasItems" class="error-state">
                    <p class="error-message">{{ error }}</p>
                    <button @click="fetchCart" class="retry-btn">Thử lại</button>
                </div>

                <!-- Empty Cart State -->
                <EmptyCart v-else-if="!hasItems" />

                <!-- Cart Content -->
                <div v-else class="cart-content-grid">
                    <!-- Left Column - Cart Items -->
                    <div class="cart-items-section">
                        <!-- Select All -->
                        <div class="select-all-bar">
                            <label class="select-all-checkbox">
                                <input type="checkbox" :checked="allSelected" @change="toggleSelectAll" />
                                <span>Chọn tất cả ({{ cartCount }} sản phẩm)</span>
                            </label>

                            <button v-if="hasItems" @click="clearCart" class="clear-cart-btn">
                                Xóa giỏ hàng
                            </button>
                        </div>

                        <!-- Cart Items List -->
                        <div class="cart-items-list">
                            <CartItem v-for="item in cartItems" :key="item.id" :item-id="item.id" />
                        </div>
                    </div>

                    <!-- Right Column - Summary & Voucher -->
                    <div class="cart-sidebar">
                        <!-- Voucher Section -->
                        <VoucherInput />

                        <!-- Cart Summary -->
                        <CartSummary />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/cart/useCart'
import CartItem from '@/components/customer/cart/CartItem.vue'
import CartSummary from '@/components/customer/cart/CartSummary.vue'
import VoucherInput from '@/components/customer/cart/VoucherInput.vue'
import EmptyCart from '@/components/customer/cart/EmptyCart.vue'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'

const router = useRouter()

// Dùng composable thay vì store trực tiếp
const {
    cartItems,
    cartCount,
    hasItems,
    loading,
    error,
    allSelected,
    fetchCart,
    toggleSelectAll,
    clearCart,
} = useCart()

// Lifecycle
onMounted(async () => {
    await fetchCart()
})

// Methods
const goBack = () => {
    router.back()
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
