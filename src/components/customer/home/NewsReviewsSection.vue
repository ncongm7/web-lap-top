<template>
    <section class="news-reviews-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{{ sectionTitle }}</h2>
                <router-link v-if="viewAllLink" :to="viewAllLink" class="view-all-link">
                    Xem tất cả →
                </router-link>
            </div>

            <div v-if="isLoading" class="loading-state">
                <span class="spinner"></span>
                <span>Đang tải...</span>
            </div>

            <div v-else-if="error" class="error-state">
                <span>⚠️ {{ error }}</span>
            </div>

            <div v-else-if="items.length > 0" class="items-grid">
                <article
                    v-for="(item, index) in items"
                    :key="item.id || index"
                    class="item-card"
                    @click="handleItemClick(item)"
                >
                    <div class="item-thumbnail">
                        <img 
                            :src="getThumbnail(item)" 
                            :alt="getTitle(item)"
                            @error="handleImageError"
                        />
                    </div>
                    <div class="item-content">
                        <h3 class="item-title">{{ getTitle(item) }}</h3>
                        <p class="item-excerpt">{{ getExcerpt(item) }}</p>
                        <div class="item-meta">
                            <span class="item-date">{{ formatDate(getDate(item)) }}</span>
                            <span v-if="isReview(item)" class="item-rating">
                                ⭐ {{ getRating(item) }}/5
                            </span>
                        </div>
                    </div>
                </article>
            </div>

            <div v-else class="empty-state">
                <span>Không có nội dung nào</span>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticles } from '@/service/customer/articleService'
import { getTopReviews } from '@/service/customer/homeService'
import { formatDate } from '@/utils/helpers'

const router = useRouter()

const props = defineProps({
    limit: {
        type: Number,
        default: 4,
    },
    viewAllLink: {
        type: String,
        default: null,
    },
})

const items = ref([])
const isLoading = ref(false)
const error = ref(null)
const isShowingReviews = ref(false)

// Section title
const sectionTitle = computed(() => {
    return isShowingReviews.value ? 'Đánh giá nổi bật' : 'Tin tức & Đánh giá'
})

// Check if item is a review
const isReview = (item) => {
    return item.soSao !== undefined || item.rating !== undefined || item.danhGiaTrungBinh !== undefined
}

// Get thumbnail
const getThumbnail = (item) => {
    if (item.thumbnail || item.hinhAnh || item.image || item.imageUrl) {
        return item.thumbnail || item.hinhAnh || item.image || item.imageUrl
    }
    
    // For reviews, try to get product image
    if (isReview(item) && item.sanPham) {
        return item.sanPham.anhDaiDien || item.sanPham.hinhAnh || ''
    }
    
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Handle image error
const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Get title
const getTitle = (item) => {
    if (item.title) return item.title
    if (item.tieuDe) return item.tieuDe
    if (isReview(item)) {
        return item.sanPham?.tenSanPham || item.productName || 'Đánh giá sản phẩm'
    }
    return 'Tiêu đề'
}

// Get excerpt
const getExcerpt = (item) => {
    const text = item.excerpt || item.moTa || item.noiDung || item.content || ''
    if (text.length > 120) {
        return text.substring(0, 120) + '...'
    }
    return text || 'Không có mô tả'
}

// Get date
const getDate = (item) => {
    return item.ngayDanhGia || item.ngayTao || item.createdAt || item.date || new Date()
}

// Get rating (for reviews)
const getRating = (item) => {
    return item.soSao || item.rating || item.danhGiaTrungBinh || 5
}

// Handle item click
const handleItemClick = (item) => {
    if (isReview(item)) {
        // Navigate to product detail
        const productId = item.sanPham?.id || item.productId || item.sanPhamChiTietId
        if (productId) {
            router.push(`/products/${productId}`)
        }
    } else {
        // Navigate to article detail (if has link)
        if (item.link || item.slug) {
            router.push(item.link || `/articles/${item.slug}`)
        }
    }
}

// Fetch data
const fetchData = async () => {
    try {
        isLoading.value = true
        error.value = null

        // Try to get articles first
        const articles = await getArticles(props.limit)
        
        if (articles.length > 0) {
            items.value = articles
            isShowingReviews.value = false
            console.log('✅ [NewsReviewsSection] Articles loaded:', items.value.length)
            return
        }

        // Fallback to reviews
        console.warn('⚠️ [NewsReviewsSection] No articles, using reviews as fallback')
        const reviews = await getTopReviews(props.limit)
        
        if (reviews.length > 0) {
            items.value = reviews
            isShowingReviews.value = true
            console.log('✅ [NewsReviewsSection] Reviews loaded:', items.value.length)
        } else {
            items.value = []
        }
    } catch (err) {
        console.error('❌ [NewsReviewsSection] Error loading data:', err)
        error.value = 'Không thể tải nội dung'
        items.value = []
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchData()
})
</script>

<style scoped>
.news-reviews-section {
    padding: 60px 0;
    background: #f8fafc;
    overflow: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
}

.section-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
}

.view-all-link {
    font-size: 14px;
    font-weight: 600;
    color: #10b981;
    text-decoration: none;
    transition: color 0.2s;
}

.view-all-link:hover {
    color: #059669;
    text-decoration: underline;
}

.loading-state,
.error-state,
.empty-state {
    padding: 40px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
}

.loading-state {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.error-state {
    color: #ef4444;
}

.items-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
}

.item-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.item-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
}

.item-thumbnail {
    width: 100%;
    padding-top: 56.25%;
    position: relative;
    overflow: hidden;
    background: #f1f5f9;
}

.item-thumbnail img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.item-content {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.item-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 52px;
}

.item-excerpt {
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 16px 0;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
}

.item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    color: #94a3b8;
}

.item-date {
    font-weight: 500;
}

.item-rating {
    font-weight: 600;
    color: #fbbf24;
}

/* Responsive */
@media (max-width: 768px) {
    .news-reviews-section {
        padding: 40px 0;
    }

    .section-title {
        font-size: 24px;
    }

    .items-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .item-content {
        padding: 16px;
    }

    .item-title {
        font-size: 16px;
        min-height: 44px;
    }

    .item-excerpt {
        font-size: 13px;
    }
}
</style>

