<template>
    <div class="review-list-card">
        <div class="review-list-header">
            <h3 class="list-heading">Danh sách bình luận</h3>
            <div class="filter-tabs">
                <button v-for="filter in filters" :key="filter" class="filter-tab"
                    :class="{ active: activeFilter === filter }" @click="$emit('filter-change', filter)" disabled>
                    {{ filter }}
                </button>
            </div>
        </div>

        <div class="review-list-body">
            <!-- Empty State for Reviews -->
            <div v-if="!reviews || reviews.length === 0" class="empty-reviews-state">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon">
                    <path
                        d="M12 20c4.418 0 8-3.134 8-7 0-1.42-.4-2.75-1.098-3.877L22 4l-4.5 1.315C16.104 4.483 14.118 4 12 4 7.582 4 4 7.134 4 11s3.582 7 8 7z" />
                </svg>
                <p class="empty-text">Chưa có đánh giá nào.</p>
                <p class="empty-subtext">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
            </div>

            <!-- Review Items (sẽ implement sau) -->
            <div v-else class="reviews-container">
                <div v-for="review in reviews" :key="review.id" class="review-item">
                    <!-- Review content here -->
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { REVIEW_FILTERS } from '@/utils/product-detail/constants'

defineProps({
    reviews: {
        type: Array,
        default: () => [],
    },
    activeFilter: {
        type: String,
        default: 'Tất cả',
    },
    filters: {
        type: Array,
        default: () => REVIEW_FILTERS,
    },
})

defineEmits(['filter-change'])
</script>

<style scoped>
.review-list-card {
    background: #ffffff;
    border-radius: 14px;
    padding: 1.75rem;
    box-shadow: 0 6px 22px rgba(16, 24, 40, 0.04);
    border: 1px solid #d2d2d7;
}

.review-list-header {
    margin-bottom: 2rem;
}

.list-heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: #000000;
}

.filter-tabs {
    display: flex;
    gap: 0.625rem;
    flex-wrap: wrap;
}

.filter-tab {
    padding: 0.5rem 1rem;
    background: #f5f5f7;
    border: 1px solid #d2d2d7;
    border-radius: 980px;
    font-size: 0.875rem;
    font-weight: 500;
    color: #86868b;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.filter-tab:not(:disabled):hover {
    background: #0071e3;
    color: white;
    border-color: #0071e3;
}

.filter-tab.active {
    background: #0071e3;
    color: white;
    border-color: #0071e3;
}

.filter-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.review-list-body {
    min-height: 300px;
}

.empty-reviews-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    text-align: center;
}

.empty-icon {
    width: 64px;
    height: 64px;
    stroke: #86868b;
    stroke-width: 2px;
}

.empty-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: #86868b;
    margin: 0;
}

.empty-subtext {
    font-size: 0.9375rem;
    color: #86868b;
    margin: 0;
}
</style>
