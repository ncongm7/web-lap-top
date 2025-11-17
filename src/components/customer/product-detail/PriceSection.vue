<template>
    <div class="price-section">
        <div class="price-row">
            <div class="price-label">Giá:</div>
            <div class="price-values">
                <span class="price-current">{{ formatPrice(currentPrice) }}</span>
                <del v-if="originalPrice && originalPrice > currentPrice" class="price-old">
                    {{ formatPrice(originalPrice) }}
                </del>
            </div>
        </div>

        <div class="stock-row">
            <div class="price-label">Tồn kho:</div>
            <div class="stock-value">{{ stockText }}</div>
        </div>

        <div v-if="originalPrice && originalPrice > currentPrice" class="price-save">
            <span class="save-icon">⬇</span>
            Tiết kiệm: {{ formatPrice(originalPrice - currentPrice) }}
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatPrice } from '@/utils/product-detail/formatters'

const props = defineProps({
    currentPrice: {
        type: Number,
        required: true,
    },
    originalPrice: {
        type: Number,
        default: null,
    },
    stock: {
        type: Number,
        default: 0,
    },
})

const stockText = computed(() => {
    return props.stock > 0 ? `${props.stock} sản phẩm` : 'Hết hàng'
})
</script>

<style scoped>
.price-section {
    background: linear-gradient(90deg, rgba(255, 255, 255, 1), rgba(255, 249, 249, 1));
    border-left: 4px solid #0071e3;
    border-radius: 10px;
    padding: 1rem;
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.06);
}

.price-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.price-values {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
}

.price-label {
    min-width: 90px;
    color: #86868b;
    font-weight: 600;
    font-size: 0.9375rem;
}

.stock-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.stock-value {
    color: #86868b;
    font-weight: 600;
}

.price-current {
    font-size: 2rem;
    font-weight: 800;
    color: #0071e3;
    letter-spacing: -0.02em;
    line-height: 1;
}

.price-old {
    font-size: 1rem;
    color: #86868b;
    text-decoration: line-through;
    font-weight: 400;
}

.price-save {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: #ff3b30;
    font-weight: 600;
}

.save-icon {
    font-size: 1rem;
}
</style>
