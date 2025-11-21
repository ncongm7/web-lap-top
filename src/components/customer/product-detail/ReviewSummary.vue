<template>
  <div class="review-summary-card">
    <h3 class="summary-heading">Tóm tắt đánh giá</h3>

    <div class="rating-overview">
      <div class="rating-score">
        <div class="score-number">{{ averageRating }}</div>
        <div class="score-stars">
          <span
            v-for="i in 5"
            :key="`star-${i}`"
            :class="['star', i <= Math.round(averageRating) ? 'filled' : '']"
          >
            ★
          </span>
        </div>
        <div class="score-text">Dựa trên {{ totalReviews }} đánh giá</div>
      </div>
    </div>

    <!-- Rating Distribution Bars -->
    <div class="rating-bars" v-if="ratingDistribution">
      <div
        v-for="stars in [5, 4, 3, 2, 1]"
        :key="stars"
        class="rating-bar-item"
      >
        <span class="bar-label">{{ stars }} sao</span>
        <div class="bar-track">
          <div
            class="bar-fill"
            :style="{
              width: getPercentage(stars) + '%',
            }"
          ></div>
        </div>
        <span class="bar-percent">{{ getPercentage(stars) }}%</span>
      </div>
    </div>

    <button class="submit-review-btn" @click="$emit('write-review')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
        <path
          d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
        ></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
      Gửi đánh giá của bạn
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  summary: {
    type: Object,
    default: () => ({
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {},
    }),
  },
})

const emit = defineEmits(['write-review'])

const averageRating = computed(() => {
  return props.summary?.averageRating || 0
})

const totalReviews = computed(() => {
  return props.summary?.totalReviews || 0
})

const ratingDistribution = computed(() => {
  return props.summary?.ratingDistribution || {}
})

const getPercentage = (stars) => {
  if (!ratingDistribution.value || totalReviews.value === 0) return 0
  const count = ratingDistribution.value[stars] || 0
  return Math.round((count / totalReviews.value) * 100)
}
</script>

<style scoped>
.review-summary-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.summary-heading {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a1a1a;
}

.rating-overview {
  margin-bottom: 24px;
}

.rating-score {
  text-align: center;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 8px;
}

.score-stars {
  font-size: 24px;
  margin-bottom: 8px;
}

.star {
  color: #d1d5db;
  margin: 0 2px;
}

.star.filled {
  color: #fbbf24;
}

.score-text {
  font-size: 14px;
  color: #6b7280;
}

.rating-bars {
  margin-bottom: 24px;
}

.rating-bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.bar-label {
  font-size: 14px;
  color: #374151;
  width: 60px;
  text-align: right;
}

.bar-track {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
}

.bar-percent {
  font-size: 14px;
  color: #6b7280;
  width: 50px;
  text-align: right;
}

.submit-review-btn {
  width: 100%;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.submit-review-btn:hover {
  background: #1d4ed8;
}

.btn-icon {
  width: 20px;
  height: 20px;
}
</style>
