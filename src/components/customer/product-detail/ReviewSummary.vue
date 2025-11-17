<template>
    <div class="review-summary-card">
        <h3 class="summary-heading">Tóm tắt đánh giá</h3>

        <div class="rating-overview">
            <div class="rating-score">
                <div class="score-number">{{ rating.score }}</div>
                <div class="score-stars">
                    <span v-for="i in 5" :key="`star-${i}`"
                        :class="['star', i <= rating.score ? 'filled' : '']">★</span>
                </div>
                <div class="score-text">Dựa trên {{ rating.total }} đánh giá</div>
            </div>
        </div>

        <!-- Rating Distribution Bars -->
        <div class="rating-bars">
            <div v-for="item in breakdown" :key="item.stars" class="rating-bar-item">
                <span class="bar-label">{{ item.stars }} sao</span>
                <div class="bar-track">
                    <div class="bar-fill" :style="{ width: item.percent + '%' }"></div>
                </div>
                <span class="bar-percent">{{ item.percent }}%</span>
            </div>
        </div>

        <button class="submit-review-btn" @click="$emit('submit-review')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Gửi đánh giá của bạn
        </button>
    </div>
</template>

<script setup>
import { DEFAULT_RATING, DEFAULT_REVIEW_BREAKDOWN } from '@/utils/product-detail/constants'

defineProps({
    rating: {
        type: Object,
        default: () => DEFAULT_RATING,
    },
    breakdown: {
        type: Array,
        default: () => DEFAULT_REVIEW_BREAKDOWN,
    },
})

defineEmits(['submit-review'])
</script>

<style scoped>
.review-summary-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 1.75rem;
    box-shadow: 0 6px 22px rgba(16, 24, 40, 0.04);
    border: 1px solid #d2d2d7;
}

.summary-heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1.25rem 0;
}

.rating-overview {
    text-align: center;
    margin-bottom: 2rem;
}

.rating-score {
    margin-bottom: 1.5rem;
}

.score-number {
    font-size: 3.2rem;
    font-weight: 800;
    line-height: 1;
    color: #000000;
    margin-bottom: 0.5rem;
}

.score-stars {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
}

.star {
    font-size: 1.5rem;
    color: #d2d2d7;
}

.star.filled {
    color: #ff9500;
}

.score-text {
    font-size: 0.875rem;
    color: #86868b;
}

.rating-bars {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
}

.rating-bar-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.bar-label {
    font-size: 0.875rem;
    color: #86868b;
    width: 50px;
    flex-shrink: 0;
}

.bar-track {
    flex: 1;
    height: 10px;
    background: #f5f5f7;
    border-radius: 999px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff9500, #ffd166);
    transition: width 0.6s ease;
}

.bar-percent {
    font-size: 0.875rem;
    color: #86868b;
    width: 40px;
    text-align: right;
    flex-shrink: 0;
}

.submit-review-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1rem;
    background: #0071e3;
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.submit-review-btn:hover {
    background: #0077ed;
    transform: translateY(-2px);
}

.btn-icon {
    width: 20px;
    height: 20px;
    stroke-width: 2px;
}
</style>
