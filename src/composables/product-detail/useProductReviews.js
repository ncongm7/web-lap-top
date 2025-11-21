import { ref, computed } from 'vue'
import { reviewService } from '@/service/customer/reviewService'

/**
 * ========================================
 * COMPOSABLE: useProductReviews
 * ========================================
 * Quản lý state và logic cho reviews của sản phẩm
 */
export function useProductReviews(productId) {
  // State
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref(null)
  const reviews = ref([])
  const reviewSummary = ref(null)
  const currentFilter = ref(null) // null = all, 1-5 = rating filter
  const pagination = ref({
    page: 0,
    size: 10,
    totalPages: 0,
    totalElements: 0,
  })

  /**
   * Filtered reviews count
   */
  const filteredReviewsCount = computed(() => {
    return reviews.value.length
  })

  /**
   * Load reviews
   */
  const loadReviews = async (page = 0, size = 10, filter = null) => {
    if (!productId) return

    loading.value = true
    error.value = null
    currentFilter.value = filter

    try {
      const params = {
        page,
        size,
        filter: filter || undefined,
      }

      const response = await reviewService.getReviews(productId, params)
      const data = response.data?.data || response.data

      if (data.content) {
        // Pageable response
        reviews.value = data.content
        pagination.value = {
          page: data.number || page,
          size: data.size || size,
          totalPages: data.totalPages || 0,
          totalElements: data.totalElements || 0,
        }
      } else if (Array.isArray(data)) {
        // Array response
        reviews.value = data
      }

    } catch (err) {
      console.error('Error loading reviews:', err)
      error.value = err.response?.data?.message || err.message || 'Không thể tải đánh giá'
    } finally {
      loading.value = false
    }
  }

  /**
   * Filter reviews by rating
   */
  const filterReviews = async (rating) => {
    await loadReviews(0, pagination.value.size, rating)
  }

  /**
   * Load more reviews (pagination)
   */
  const loadMore = async () => {
    if (pagination.value.page >= pagination.value.totalPages - 1) {
      return // No more pages
    }

    await loadReviews(
      pagination.value.page + 1,
      pagination.value.size,
      currentFilter.value
    )
  }

  /**
   * Submit new review
   */
  const submitReview = async (reviewData) => {
    if (!productId) {
      throw new Error('Product ID is required')
    }

    submitting.value = true
    error.value = null

    try {
      const response = await reviewService.submitReview(productId, reviewData)
      const newReview = response.data?.data || response.data

      // Add to reviews list
      reviews.value.unshift(newReview)

      // Update summary if available
      if (reviewSummary.value) {
        reviewSummary.value.totalReviews = (reviewSummary.value.totalReviews || 0) + 1
        // Recalculate average rating
        const totalRating = reviews.value.reduce((sum, r) => sum + (r.soSao || 0), 0)
        reviewSummary.value.averageRating = totalRating / reviews.value.length
      }

      return newReview
    } catch (err) {
      console.error('Error submitting review:', err)
      error.value = err.response?.data?.message || err.message || 'Không thể gửi đánh giá'
      throw err
    } finally {
      submitting.value = false
    }
  }

  /**
   * Set review summary (from product detail API)
   */
  const setReviewSummary = (summary) => {
    reviewSummary.value = summary
  }

  return {
    // State
    loading,
    submitting,
    error,
    reviews,
    reviewSummary,
    currentFilter,
    pagination,

    // Computed
    filteredReviewsCount,

    // Methods
    loadReviews,
    filterReviews,
    loadMore,
    submitReview,
    setReviewSummary,
  }
}

