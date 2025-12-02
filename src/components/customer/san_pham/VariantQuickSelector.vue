<template>
    <div class="variant-quick-selector">
        <h3 class="selector-title">Chọn phiên bản</h3>

        <!-- Danh sách các phiên bản dưới dạng buttons -->
        <div class="variants-grid">
            <button
                v-for="variant in variants"
                :key="variant.id"
                :class="[
                    'variant-button',
                    {
                        active: modelValue === variant.id,
                        'out-of-stock': isOutOfStock(variant),
                    },
                ]"
                @click="selectVariant(variant)"
            >
                <!-- Thông tin phiên bản (CPU | GPU | RAM | Ổ cứng) -->
                <span class="variant-text">{{ getVariantSummary(variant) }}</span>

                <!-- Giá -->
                <span v-if="variant.giaGiam || variant.giaBan" class="variant-price">
                    {{ formatPrice(variant.giaGiam || variant.giaBan) }}
                    <del v-if="variant.giaGoc && variant.giaGoc > (variant.giaGiam || variant.giaBan)" class="variant-price-old">
                        {{ formatPrice(variant.giaGoc) }}
                    </del>
                </span>

                <!-- Badge hết hàng -->
                <span v-if="isOutOfStock(variant)" class="stock-badge">Hết hàng</span>
            </button>
        </div>

        <!-- Thông tin phiên bản đã chọn -->
        <!-- <div v-if="selectedVariant" class="selected-variant-info">
            <div class="info-row">
                <span class="info-label">Phiên bản đã chọn:</span>
                <span class="info-value">{{ selectedVariant.summary }}</span>
            </div>
            <div v-if="selectedVariant.price" class="info-row price-row">
                <span class="info-label">Giá:</span>
                <span class="info-value price">
                    {{ formatPrice(selectedVariant.price) }}
                    <del v-if="selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price"
                        class="original-price">
                        {{ formatPrice(selectedVariant.originalPrice) }}
                    </del>
                </span>
            </div>
            <div v-if="selectedVariant.stock !== undefined" class="info-row">
                <span class="info-label">Tồn kho:</span>
                <span :class="['info-value', selectedVariant.stock > 0 ? 'text-success' : 'text-danger']">
                    {{ selectedVariant.stock > 0 ? `${selectedVariant.stock} sản phẩm` : 'Hết hàng' }}
                </span>
            </div>
        </div> -->
    </div>
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
    variants: {
        type: Array,
        required: true,
        // Format: [{ id, price, originalPrice, stock, summary, ... }]
    },
    modelValue: {
        type: [String, Number],
        default: null,
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

// Current selected variant
// const selectedVariant = computed(() => {
//     return props.variants.find((v) => v.id === props.modelValue) || null
// })

// Check if variant is out of stock
const isOutOfStock = (variant) => {
    const soLuongTon = variant.soLuongTon || 0
    const soLuongTamGiu = variant.soLuongTamGiu || 0
    const soLuongKhaDung = soLuongTon - soLuongTamGiu
    return soLuongKhaDung <= 0
}

// Get variant summary
const getVariantSummary = (variant) => {
    const parts = []
    if (variant.cpu) parts.push(variant.cpu)
    if (variant.gpu) parts.push(variant.gpu)
    if (variant.ram) parts.push(variant.ram)
    if (variant.oCung) parts.push(variant.oCung)
    if (variant.mauSac) parts.push(variant.mauSac)
    return parts.length > 0 ? parts.join(' | ') : variant.maCtsp || 'Variant'
}

// Select variant - Cho phép chọn ngay cả khi hết hàng (để liên hệ và so sánh)
const selectVariant = (variant) => {
    // Không kiểm tra hết hàng nữa, cho phép chọn để liên hệ và so sánh
    emit('update:modelValue', variant.id)
    emit('change', variant)
}

// Format price
const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(price)
}

// Auto select first variant if not selected (kể cả khi hết hàng)
watch(
    () => props.variants,
    (newVariants) => {
        if (newVariants.length > 0 && !props.modelValue) {
            const firstVariant = newVariants[0]
            if (firstVariant) {
                // Cho phép chọn variant đầu tiên ngay cả khi hết hàng
                emit('update:modelValue', firstVariant.id)
                emit('change', firstVariant)
            }
        }
    },
    { immediate: true }
)
</script>

<style scoped>
/* Design System Variables */
:root {
    --vqs-primary: #000000;
    --vqs-secondary: #86868b;
    --vqs-accent: #0071e3;
    --vqs-success: #34c759;
    --vqs-error: #ff3b30;
    --vqs-bg: #ffffff;
    --vqs-bg-secondary: #f5f5f7;
    --vqs-border: #d2d2d7;
    --vqs-shadow: rgba(0, 0, 0, 0.08);
    --vqs-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.variant-quick-selector {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.selector-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--vqs-primary);
    letter-spacing: -0.01em;
}

.variants-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100%, 1fr));
    gap: 0.75rem;
    margin-bottom: 2rem;
}

/* Variant Button - Full Width */
.variant-button {
    position: relative;
    padding: 1.25rem;
    border: 1.5px solid var(--vqs-border);
    border-radius: 12px;
    background: var(--vqs-bg);
    cursor: pointer;
    transition: var(--vqs-transition);
    text-align: left;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    box-shadow: 0 1px 3px var(--vqs-shadow);
}

.variant-button:hover:not(:disabled) {
    border-color: var(--vqs-accent);
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.15);
    transform: translateY(-2px);
}

.variant-button.active {
    border-color: var(--vqs-accent);
    background: rgba(0, 113, 227, 0.05);
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.2), 0 1px 3px rgba(0, 113, 227, 0.1);
    transform: translateY(-1px);
}

.variant-button.active .variant-text {
    color: var(--vqs-primary);
    font-weight: 600;
}

.variant-button.out-of-stock {
    opacity: 0.7;
    background: var(--vqs-bg-secondary);
    cursor: pointer; /* Vẫn cho phép click để chọn */
    position: relative;
}

.variant-button.out-of-stock:hover {
    opacity: 0.9;
    border-color: var(--vqs-accent);
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.15);
}

/* Bỏ dấu gạch chéo khi hết hàng vì vẫn cho phép chọn */
.variant-button.out-of-stock::after {
    display: none;
}

.variant-text {
    font-weight: 500;
    line-height: 1.5;
    letter-spacing: -0.01em;
    color: var(--vqs-primary);
    flex: 1;
}

.variant-price {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--vqs-accent);
    white-space: nowrap;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}

.variant-price-old {
    font-size: 0.875rem;
    color: var(--vqs-secondary);
    font-weight: 400;
    text-decoration: line-through;
}

.variant-button.active .variant-price {
    color: var(--vqs-primary);
}

.stock-badge {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    background: var(--vqs-error);
    color: white;
    border-radius: 6px;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
}

/* Selected Variant Info - Premium Card */
.selected-variant-info {
    margin-top: 2rem;
    padding: 1.25rem 1.5rem;
    background: var(--vqs-bg-secondary);
    border-radius: 16px;
    border: 1px solid var(--vqs-border);
    box-shadow: 0 2px 8px var(--vqs-shadow);
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-label {
    font-weight: 500;
    color: var(--vqs-secondary);
    font-size: 0.875rem;
}

.info-value {
    font-weight: 600;
    color: var(--vqs-primary);
    font-size: 0.9375rem;
}

.price-row .info-value {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.price-row .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--vqs-primary);
    letter-spacing: -0.02em;
}

.original-price {
    font-size: 0.875rem;
    color: var(--vqs-secondary);
    font-weight: 400;
    text-decoration: line-through;
}

.text-success {
    color: var(--vqs-success) !important;
    font-weight: 600;
}

.text-danger {
    color: var(--vqs-error) !important;
    font-weight: 600;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .variant-button {
        padding: 1rem;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }

    .variant-text {
        font-size: 0.9rem;
    }

    .variant-price {
        font-size: 1rem;
        align-self: flex-start;
    }

    .selector-title {
        font-size: 1rem;
    }

    .selected-variant-info {
        padding: 1rem 1.25rem;
    }

    .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.375rem;
    }

    .price-row .price {
        font-size: 1.25rem;
    }
}

@media (max-width: 480px) {
    .variant-button {
        padding: 0.875rem;
    }

    .variant-text {
        font-size: 0.8125rem;
    }

    .variant-price {
        font-size: 0.9rem;
    }
}
</style>
