<template>
    <div class="product-meta">
        <div class="meta-row">
            <span class="meta-label">Mã SP:</span>
            <span class="meta-value meta-code">{{ metadata.code }}</span>
        </div>
        <div class="meta-row" hidden="">
            <span class="meta-label">Đánh giá:</span>
            <div class="meta-value meta-rating">
                <span v-for="i in 5" :key="i" class="star-icon" :class="{ filled: i <= rating }">★</span>
                <span class="rating-text">| Bình luận: {{ metadata.reviewCount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    metadata: {
        type: Object,
        required: true,
    },
    rating: {
        type: Number,
        default: 5,
    },
})
</script>

<style scoped>
.product-meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0;
    border-bottom: 1px solid #d2d2d7;
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.meta-label {
    font-size: 0.875rem;
    color: #86868b;
    font-weight: 500;
    min-width: 80px;
}

.meta-value {
    font-size: 0.875rem;
    color: #000000;
    font-weight: 600;
}

.meta-code {
    color: #0071e3;
}

.meta-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.star-icon {
    font-size: 1rem;
    color: #d2d2d7;
}

.star-icon.filled {
    color: #ff9500;
}

.rating-text {
    color: #86868b;
    font-weight: 400;
}
</style>

