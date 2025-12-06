<template>
  <div class="review-list-card">
    <div class="review-list-header">
      <h3 class="list-heading">Danh sách bình luận</h3>
      <div class="filter-tabs">
        <button v-for="filter in filters" :key="filter.value" class="filter-tab"
          :class="{ active: currentFilter === filter.value }" @click="handleFilter(filter.value)">
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="review-list-body">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Đang tải đánh giá...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadReviews()">Thử lại</button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!reviews || reviews.length === 0" class="empty-reviews-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon">
          <path
            d="M12 20c4.418 0 8-3.134 8-7 0-1.42-.4-2.75-1.098-3.877L22 4l-4.5 1.315C16.104 4.483 14.118 4 12 4 7.582 4 4 7.134 4 11s3.582 7 8 7z" />
        </svg>
        <p class="empty-text">Chưa có đánh giá nào.</p>
        <p class="empty-subtext">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
      </div>

      <!-- Review Items -->
      <div v-else class="reviews-container">
        <div v-for="review in reviews" :key="review.id" class="review-item">
          <div class="review-header">
            <div class="reviewer-info">
              <div class="reviewer-avatar">
                {{ review.khachHang?.tenKhachHang?.charAt(0) || 'U' }}
              </div>
              <div class="reviewer-details">
                <div class="reviewer-name">
                  {{ review.khachHang?.tenKhachHang || 'Khách hàng' }}
                  <span v-if="review.isVerifiedPurchase" class="verified-badge" title="Đã mua hàng">
                    <i class="bi bi-patch-check-fill"></i> Đã mua hàng
                  </span>
                </div>
                <div class="review-date">
                  {{ formatDate(review.ngayDanhGia) }}
                </div>
              </div>
            </div>
            <div class="review-rating">
              <span v-for="i in 5" :key="i" :class="['star', i <= review.soSao ? 'filled' : '']">
                ★
              </span>
            </div>
          </div>

          <!-- Review Title -->
          <h4 v-if="review.reviewTitle" class="review-title">{{ review.reviewTitle }}</h4>

          <div class="review-content">
            <p>{{ review.noiDung }}</p>
          </div>

          <!-- Pros/Cons -->
          <div v-if="review.pros || review.cons" class="pros-cons-section">
            <div v-if="review.pros && review.pros.length > 0" class="pros-list">
              <strong class="pros-title"><i class="bi bi-check-circle-fill"></i> Điểm mạnh:</strong>
              <ul>
                <li v-for="(pro, idx) in review.pros" :key="idx">{{ pro }}</li>
              </ul>
            </div>
            <div v-if="review.cons && review.cons.length > 0" class="cons-list">
              <strong class="cons-title"><i class="bi bi-x-circle-fill"></i> Điểm yếu:</strong>
              <ul>
                <li v-for="(con, idx) in review.cons" :key="idx">{{ con }}</li>
              </ul>
            </div>
          </div>

          <!-- Review Media (Images/Videos) -->
          <div v-if="review.mediaList && review.mediaList.length > 0" class="review-media">
            <div v-for="media in review.mediaList" :key="media.id" class="media-item">
              <img v-if="media.loaiMedia === 1" :src="media.url" :alt="`Review media ${media.thuTuHienThi}`"
                class="review-image" @click="openImageLightbox(media.url)" />
              <video v-else-if="media.loaiMedia === 2" :src="media.url" controls class="review-video"></video>
            </div>
          </div>

          <!-- Admin Reply -->
          <div v-if="review.adminReply" class="admin-reply">
            <div class="reply-header">
              <i class="bi bi-reply-fill"></i>
              <strong>Phản hồi từ {{ review.adminReply.tenNhanVien || 'Admin' }}</strong>
              <span class="reply-date">{{ formatDate(review.adminReply.ngayPhanHoi) }}</span>
            </div>
            <p class="reply-content">{{ review.adminReply.noiDung }}</p>
          </div>

          <!-- Helpful Votes -->
          <div class="review-actions">
            <div class="helpful-section">
              <span class="helpful-text">Đánh giá này có hữu ích không?</span>
              <button class="helpful-btn" :class="{ active: review.currentUserVote === true }"
                @click="voteHelpful(review.id, true)">
                <i class="bi bi-hand-thumbs-up-fill"></i> Hữu ích
                <span v-if="review.helpfulCount > 0">({{ review.helpfulCount }})</span>
              </button>
              <button class="helpful-btn" :class="{ active: review.currentUserVote === false }"
                @click="voteHelpful(review.id, false)">
                <i class="bi bi-hand-thumbs-down-fill"></i> Không hữu ích
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMore" class="load-more-section">
        <button class="load-more-btn" @click="loadMore" :disabled="loading">
          {{ loading ? 'Đang tải...' : 'Tải thêm đánh giá' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductReviews } from '@/composables/product-detail/useProductReviews'
import axios from '@/utils/api'
import { useAuthStore } from '@/stores/customer/authStore'

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['submit-review'])

const authStore = useAuthStore()

const filters = [
  { label: 'Tất cả', value: null },
  { label: '5 sao', value: 5 },
  { label: '4 sao', value: 4 },
  { label: '3 sao', value: 3 },
  { label: '2 sao', value: 2 },
  { label: '1 sao', value: 1 },
]

const {
  loading,
  error,
  reviews,
  currentFilter,
  pagination,
  loadReviews,
  filterReviews,
  loadMore,
} = useProductReviews(props.productId)

const hasMore = computed(() => {
  return pagination.value.page < pagination.value.totalPages - 1
})

const handleFilter = (rating) => {
  filterReviews(rating)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const voteHelpful = async (reviewId, isHelpful) => {
  if (!authStore.isAuthenticated) {
    alert('Vui lòng đăng nhập để vote')
    return
  }

  try {
    const userId = authStore.customerId || authStore.user?.userId
    const response = await axios.post(
      `/api/reviews/${reviewId}/vote`,
      { isHelpful },
      { headers: { 'X-User-Id': userId } }
    )

    // Reload reviews để cập nhật vote count
    await loadReviews()
  } catch (error) {
    console.error('Error voting:', error)
    alert(error.response?.data?.message || 'Không thể vote. Vui lòng thử lại.')
  }
}

const openImageLightbox = (imageUrl) => {
  // TODO: Implement lightbox
  window.open(imageUrl, '_blank')
}

// Watch productId changes
watch(
  () => props.productId,
  (newId) => {
    if (newId) {
      loadReviews()
    }
  }
)

// Initial load
onMounted(() => {
  if (props.productId) {
    loadReviews()
  }
})
</script>

<style scoped>
.review-list-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-list-header {
  margin-bottom: 24px;
}

.list-heading {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #1a1a1a;
}

.filter-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.filter-tab.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.empty-reviews-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: #d1d5db;
  margin: 0 auto 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.empty-subtext {
  font-size: 14px;
  color: #6b7280;
}

.reviews-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.review-item {
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.review-item:last-child {
  border-bottom: none;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.reviewer-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reviewer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #2563eb;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.reviewer-name {
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.review-date {
  font-size: 12px;
  color: #6b7280;
}

.review-rating {
  font-size: 18px;
}

.review-rating .star {
  color: #d1d5db;
}

.review-rating .star.filled {
  color: #fbbf24;
}

.review-content {
  margin-bottom: 12px;
  line-height: 1.6;
  color: #374151;
}

.review-images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.review-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid #e5e7eb;
}

.load-more-section {
  text-align: center;
  margin-top: 24px;
}

.load-more-btn {
  padding: 12px 24px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover:not(:disabled) {
  border-color: #2563eb;
  color: #2563eb;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* New styles for enhanced features */
.verified-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #059669;
  font-weight: 500;
  margin-left: 8px;
}

.review-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 8px 0;
}

.pros-cons-section {
  margin: 16px 0;
  display: grid;
  gap: 12px;
}

.pros-list,
.cons-list {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
}

.pros-list {
  background: #f0fdf4;
  border-left: 3px solid #10b981;
}

.cons-list {
  background: #fef3c7;
  border-left: 3px solid #f59e0b;
}

.pros-title,
.cons-title {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.pros-title {
  color: #059669;
}

.cons-title {
  color: #d97706;
}

.pros-list ul,
.cons-list ul {
  margin: 0;
  padding-left: 20px;
}

.pros-list li,
.cons-list li {
  margin-bottom: 4px;
}

.review-media {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin: 16px 0;
}

.media-item {
  flex: 0 0 calc(25% - 12px);
  max-width: 150px;
}

.review-video {
  width: 100%;
  border-radius: 8px;
  max-height: 150px;
}

.admin-reply {
  margin-top: 16px;
  padding: 12px;
  background: #eff6ff;
  border-left: 3px solid #3b82f6;
  border-radius: 6px;
}

.reply-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1e40af;
  margin-bottom: 8px;
}

.reply-date {
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
}

.reply-content {
  font-size: 14px;
  color: #374151;
  margin: 0;
}

.review-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #e5e7eb;
}

.helpful-section {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.helpful-text {
  font-size: 14px;
  color: #6b7280;
}

.helpful-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
}

.helpful-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.helpful-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}
</style>
