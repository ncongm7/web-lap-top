<template>
    <div class="promotion-section">
        <div class="promotion-header">
            <svg viewBox="0 0 24 24" fill="currentColor" class="promotion-icon">
                <path
                    d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
            </svg>
            <div>
                <div class="promotion-title">Khuyến mãi & Quà tặng</div>
                <div class="promotion-subtitle">Áp dụng khi mua sản phẩm này</div>
            </div>
        </div>
        <ul class="promotion-list">
            <li v-for="(promo, index) in promotions" :key="index">
                <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                {{ promo }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { DEFAULT_PROMOTIONS } from '@/utils/product-detail/constants'

defineProps({
    promotions: {
        type: Array,
        default: () => DEFAULT_PROMOTIONS,
    },
})
</script>

<style scoped>
.promotion-section {
    background: linear-gradient(180deg, #fffef8 0%, #ffffff 100%);
    border: 1px solid rgba(255, 215, 0, 0.25);
    border-radius: 12px;
    padding: 1rem 1rem;
    box-shadow: 0 6px 18px rgba(255, 193, 7, 0.06);
    margin-top: 1.5rem;
}

.promotion-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
    align-items: center;
}

.promotion-icon {
    width: 40px;
    height: 40px;
    fill: #ff9500;
    flex-shrink: 0;
    background: rgba(255, 215, 0, 0.12);
    border-radius: 10px;
    padding: 6px;
}

.promotion-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: #000000;
    margin: 0;
}

.promotion-subtitle {
    font-size: 0.875rem;
    color: #86868b;
    margin: 0;
}

.promotion-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.promotion-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    line-height: 1.45;
}

.check-icon {
    width: 20px;
    height: 20px;
    fill: #34c759;
    flex-shrink: 0;
    margin-top: 2px;
}
</style>
