<template>
    <div class="add-to-cart-form">
        <!-- Quantity Selector -->
        <div class="quantity-section">
            <label class="quantity-label">Số lượng:</label>
            <div class="quantity-controls">
                <button type="button" class="quantity-btn decrease" :disabled="quantity <= 1 || disabled"
                    @click="decreaseQty">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z" />
                    </svg>
                </button>

                <input type="number" class="quantity-input" v-model.number="quantity" :min="1" :max="maxQuantity"
                    :disabled="disabled" @blur="validateQuantity" @keypress="handleKeypress" />

                <button type="button" class="quantity-btn increase" :disabled="quantity >= maxQuantity || disabled"
                    @click="increaseQty">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                    </svg>
                </button>
            </div>

            <div v-if="maxQuantity > 0" class="stock-info">
                <span class="stock-text">Còn {{ maxQuantity }} sản phẩm</span>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="action-buttons">
            <!-- Add to Cart Button -->
            <button type="button" class="btn-add-cart" :disabled="!canAddToCart || loading" @click="handleAddToCart">
                <template v-if="loading">
                    <span class="spinner"></span>
                    <span>Đang thêm...</span>
                </template>
                <template v-else>
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path
                            d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                    </svg>
                    <span>Thêm vào giỏ hàng</span>
                </template>
            </button>

            <!-- Buy Now Button (Optional) -->
            <button v-if="showBuyNow" type="button" class="btn-buy-now" :disabled="!canAddToCart || loading"
                @click="handleBuyNow">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.443.184a1.5 1.5 0 0 1 1.114 0l7.129 2.852A.5.5 0 0 1 16 3.5v8.662a1 1 0 0 1-.629.928l-7.185 2.874a.5.5 0 0 1-.372 0L.63 13.09a1 1 0 0 1-.63-.928V3.5a.5.5 0 0 1 .314-.464L7.443.184z" />
                </svg>
                <span>Mua ngay</span>
            </button>
        </div>

        <!-- Out of Stock Message -->
        <div v-if="!canAddToCart && !loading" class="out-of-stock-message">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <span>{{ outOfStockMessage }}</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    productId: {
        type: [String, Number],
        default: null,
    },
    productName: {
        type: String,
        default: '',
    },
    maxQuantity: {
        type: Number,
        default: 0,
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    showBuyNow: {
        type: Boolean,
        default: true,
    },
})

const emit = defineEmits(['add-to-cart', 'buy-now'])

// State
const quantity = ref(1)
const loading = ref(false)

// Computed
const canAddToCart = computed(() => {
    return props.maxQuantity > 0 && !props.disabled && quantity.value > 0 && quantity.value <= props.maxQuantity
})

const outOfStockMessage = computed(() => {
    if (props.maxQuantity <= 0) {
        return 'Sản phẩm tạm hết hàng'
    }
    if (props.disabled) {
        return 'Vui lòng chọn phiên bản sản phẩm'
    }
    return ''
})

// Methods
const increaseQty = () => {
    if (quantity.value < props.maxQuantity) {
        quantity.value++
    }
}

const decreaseQty = () => {
    if (quantity.value > 1) {
        quantity.value--
    }
}

const validateQuantity = () => {
    if (quantity.value < 1) {
        quantity.value = 1
    }
    if (quantity.value > props.maxQuantity) {
        quantity.value = props.maxQuantity
    }
}

const handleKeypress = (e) => {
    // Only allow numbers
    if (!/[0-9]/.test(e.key)) {
        e.preventDefault()
    }
}

const handleAddToCart = async () => {
    if (!canAddToCart.value || loading.value) return

    loading.value = true
    try {
        await emit('add-to-cart', {
            productId: props.productId,
            productName: props.productName,
            quantity: quantity.value,
        })
        // Reset quantity after successful add (optional)
        // quantity.value = 1
    } catch (error) {
        console.error('Error adding to cart:', error)
    } finally {
        loading.value = false
    }
}

const handleBuyNow = async () => {
    if (!canAddToCart.value || loading.value) return

    loading.value = true
    try {
        await emit('buy-now', {
            productId: props.productId,
            productName: props.productName,
            quantity: quantity.value,
        })
    } catch (error) {
        console.error('Error buying now:', error)
    } finally {
        loading.value = false
    }
}

// Reset quantity when product changes
watch(() => props.productId, () => {
    quantity.value = 1
})

// Watch maxQuantity and adjust if needed
watch(() => props.maxQuantity, (newMax) => {
    if (quantity.value > newMax) {
        quantity.value = Math.max(1, newMax)
    }
})
</script>

<style scoped>
.add-to-cart-form {
    width: 100%;
}

.quantity-section {
    margin-bottom: 2rem;
}

.quantity-label {
    display: block;
    font-weight: 600;
    font-size: 0.875rem;
    color: #000000;
    margin-bottom: 0.875rem;
    letter-spacing: -0.01em;
}

.quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    margin-bottom: 0.625rem;
}

.quantity-btn {
    width: 44px;
    height: 44px;
    border: 1.5px solid #d2d2d7;
    border-radius: 12px;
    background: #ffffff;
    color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.quantity-btn:hover:not(:disabled) {
    border-color: #0071e3;
    color: #0071e3;
    background: #f5f5f7;
    transform: scale(1.05);
    box-shadow: 0 2px 6px rgba(0, 113, 227, 0.15);
}

.quantity-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    background: #f5f5f7;
}

.quantity-input {
    width: 88px;
    height: 44px;
    text-align: center;
    border: 1.5px solid #d2d2d7;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    color: #000000;
    background: #ffffff;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.quantity-input:focus {
    outline: none;
    border-color: #0071e3;
    box-shadow: 0 0 0 4px rgba(0, 113, 227, 0.12), 0 1px 3px rgba(0, 113, 227, 0.2);
}

.quantity-input:disabled {
    background: #f5f5f7;
    cursor: not-allowed;
    color: #86868b;
}

/* Hide spinner arrows */
.quantity-input::-webkit-inner-spin-button,
.quantity-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.quantity-input[type='number'] {
    -moz-appearance: textfield;
}

.stock-info {
    font-size: 0.8125rem;
    color: #86868b;
}

.stock-text {
    font-weight: 500;
    letter-spacing: 0.01em;
}

/* Action Buttons - Premium Pill Design */
.action-buttons {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.875rem;
}

.action-buttons:has(.btn-buy-now) {
    grid-template-columns: 1.5fr 1fr;
}

.btn-add-cart,
.btn-buy-now {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1rem 2rem;
    border: none;
    border-radius: 980px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 54px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    letter-spacing: -0.01em;
}

.btn-add-cart {
    background: #0071e3;
    color: white;
    box-shadow: 0 4px 14px rgba(0, 113, 227, 0.3), 0 1px 3px rgba(0, 113, 227, 0.2);
}

.btn-add-cart:hover:not(:disabled) {
    background: #0077ed;
    box-shadow: 0 6px 20px rgba(0, 113, 227, 0.4), 0 2px 6px rgba(0, 113, 227, 0.25);
    transform: translateY(-2px) scale(1.01);
}

.btn-add-cart:active:not(:disabled) {
    transform: translateY(0) scale(0.99);
    box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
}

.btn-add-cart:disabled {
    background: #d2d2d7;
    color: #86868b;
    cursor: not-allowed;
    box-shadow: none;
}

.btn-buy-now {
    background: #000000;
    color: white;
    border: 2px solid transparent;
}

.btn-buy-now:hover:not(:disabled) {
    background: #1d1d1f;
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

.btn-buy-now:disabled {
    background: #f5f5f7;
    color: #86868b;
    border-color: #d2d2d7;
    cursor: not-allowed;
}

/* Spinner */
.spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Out of Stock Message */
.out-of-stock-message {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    padding: 1rem 1.25rem;
    background: #fff3cd;
    border: 1.5px solid #ffc107;
    border-radius: 12px;
    color: #856404;
    font-size: 0.875rem;
    font-weight: 500;
    margin-top: 1rem;
    box-shadow: 0 2px 8px rgba(255, 193, 7, 0.15);
}

.out-of-stock-message svg {
    flex-shrink: 0;
    opacity: 0.9;
}

/* Mobile Responsive */
@media (max-width: 576px) {
    .action-buttons {
        grid-template-columns: 1fr;
    }

    .action-buttons:has(.btn-buy-now) {
        grid-template-columns: 1fr;
    }

    .btn-add-cart,
    .btn-buy-now {
        font-size: 0.95rem;
        padding: 0.75rem 1rem;
    }

    .quantity-controls {
        justify-content: center;
    }
}
</style>
