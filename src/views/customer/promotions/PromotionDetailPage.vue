<template>
    <div class="promotion-detail-page">
        <div class="container">
            <!-- Loading -->
            <LoadingSpinner v-if="loading" message="Đang tải thông tin khuyến mãi..." />

            <!-- Error State -->
            <div v-else-if="error" class="error-state">
                <div class="error-icon">❌</div>
                <h3>{{ error }}</h3>
                <router-link to="/promotions" class="back-btn">
                    ← Quay lại danh sách
                </router-link>
            </div>

            <!-- Promotion Detail -->
            <div v-else-if="campaignInfo" class="promotion-detail">
                <!-- Header -->
                <div class="promotion-header">
                    <router-link to="/promotions" class="back-link">
                        ← Quay lại danh sách
                    </router-link>
                    <div v-if="campaignInfo.bannerImageUrl" class="promotion-banner">
                        <img :src="campaignInfo.bannerImageUrl" :alt="campaignInfo.tenKm" />
                        <div class="banner-overlay">
                            <div class="banner-badge" v-if="campaignInfo.giaTri">
                                Giảm {{ formatPrice(campaignInfo.giaTri) }}
                            </div>
                        </div>
                    </div>
                    <div class="promotion-header-content">
                        <h1 class="promotion-title">{{ campaignInfo.tenKm }}</h1>
                        <p class="promotion-description">{{ campaignInfo.moTa }}</p>
                        <div class="promotion-dates">
                            <div class="date-item">
                                <span class="date-label">📅 Bắt đầu:</span>
                                <span class="date-value">{{ formatDate(campaignInfo.ngayBatDau) }}</span>
                            </div>
                            <div class="date-item">
                                <span class="date-label">⏰ Kết thúc:</span>
                                <span class="date-value">{{ formatDate(campaignInfo.ngayKetThuc) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Products Section -->
                <div class="products-section">
                    <h2 class="section-title">Sản phẩm áp dụng khuyến mãi</h2>
                    
                    <LoadingSpinner v-if="loadingProducts" message="Đang tải sản phẩm..." />

                    <div v-else-if="products.length > 0" class="products-grid">
                        <div
                            v-for="product in products"
                            :key="product.id"
                            class="product-card"
                            @click="goToProduct(product)"
                        >
                            <div v-if="product.hinhAnh && product.hinhAnh.length > 0" class="product-image">
                                <img :src="product.hinhAnh[0].url" :alt="product.tenSanPham" />
                            </div>
                            <div v-else class="product-image-placeholder">
                                <span>📦</span>
                            </div>
                            <div class="product-info">
                                <h3 class="product-name">{{ product.tenSanPham }}</h3>
                                <div class="product-price">
                                    <span v-if="product.giaBan" class="current-price">
                                        {{ formatPrice(product.giaBan) }}
                                    </span>
                                </div>
                                <button class="view-product-btn">
                                    Xem chi tiết →
                                </button>
                            </div>
                        </div>
                    </div>

                    <div v-else class="empty-products">
                        <p>Chưa có sản phẩm nào trong chương trình này.</p>
                    </div>

                    <!-- Pagination -->
                    <div v-if="products.length > 0 && pagination.totalPages > 1" class="pagination">
                        <button
                            class="pagination-btn"
                            :disabled="pagination.page === 0"
                            @click="changePage(pagination.page - 1)"
                        >
                            ‹ Trước
                        </button>
                        <span class="pagination-info">
                            Trang {{ pagination.page + 1 }} / {{ pagination.totalPages }}
                        </span>
                        <button
                            class="pagination-btn"
                            :disabled="pagination.page >= pagination.totalPages - 1"
                            @click="changePage(pagination.page + 1)"
                        >
                            Sau ›
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'
import { formatDate } from '@/utils/helpers'
import { getCampaignDetail } from '@/service/customer/promotionService'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const loadingProducts = ref(false)
const error = ref(null)
const campaignInfo = ref(null)
const products = ref([])
const pagination = ref({
    page: 0,
    pageSize: 12,
    totalPages: 0,
    totalElements: 0
})

const fetchPromotionDetail = async () => {
    try {
        loading.value = true
        loadingProducts.value = true
        error.value = null

        const campaignId = route.params.id
        const result = await getCampaignDetail(campaignId, pagination.value.page)

        if (!result || !result.campaignInfo) {
            error.value = 'Không tìm thấy chương trình khuyến mãi'
            return
        }

        campaignInfo.value = result.campaignInfo
        products.value = result.products || []
        pagination.value = {
            ...pagination.value,
            ...result.pagination
        }
    } catch (err) {
        console.error('Error fetching promotion detail:', err)
        error.value = 'Không thể tải thông tin khuyến mãi. Vui lòng thử lại.'
    } finally {
        loading.value = false
        loadingProducts.value = false
    }
}

const changePage = (newPage) => {
    pagination.value.page = newPage
    fetchPromotionDetail()
}

const goToProduct = (product) => {
    // Navigate to product detail page
    if (product.idSanPham) {
        router.push(`/products/${product.idSanPham}`)
    }
}

const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price)
}

onMounted(() => {
    fetchPromotionDetail()
})
</script>

<style scoped>
.promotion-detail-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 40px 0 80px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.back-link {
    display: inline-flex;
    align-items: center;
    color: #10b981;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 24px;
    transition: color 0.2s;
}

.back-link:hover {
    color: #059669;
}

.promotion-header {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 40px;
}

.promotion-banner {
    width: 100%;
    height: 400px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
}

.promotion-banner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.banner-overlay {
    position: absolute;
    top: 24px;
    right: 24px;
}

.banner-badge {
    background: #ef4444;
    color: #ffffff;
    padding: 12px 24px;
    border-radius: 32px;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.promotion-header-content {
    padding: 32px;
}

.promotion-title {
    font-size: 36px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.promotion-description {
    font-size: 16px;
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 24px 0;
}

.promotion-dates {
    display: flex;
    gap: 32px;
    flex-wrap: wrap;
}

.date-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.date-label {
    font-size: 13px;
    color: #94a3b8;
    font-weight: 600;
}

.date-value {
    font-size: 16px;
    color: #1e293b;
    font-weight: 600;
}

.products-section {
    background: #ffffff;
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 32px 0;
}

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
}

.product-card {
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.product-card:hover {
    transform: translateY(-4px);
    border-color: #10b981;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.product-image {
    width: 100%;
    height: 200px;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 16px;
}

.product-image-placeholder {
    width: 100%;
    height: 200px;
    background: #f1f5f9;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
}

.product-info {
    padding: 16px;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-price {
    margin-bottom: 12px;
}

.current-price {
    font-size: 20px;
    font-weight: 700;
    color: #10b981;
}

.view-product-btn {
    width: 100%;
    padding: 10px;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.view-product-btn:hover {
    background: #059669;
}

.empty-products {
    text-align: center;
    padding: 60px 20px;
    color: #64748b;
}

.error-state {
    text-align: center;
    padding: 80px 20px;
}

.error-icon {
    font-size: 64px;
    margin-bottom: 24px;
}

.error-state h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 32px 0;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    padding: 12px 24px;
    background: #10b981;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    transition: background 0.2s;
}

.back-btn:hover {
    background: #059669;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-top: 32px;
}

.pagination-btn {
    padding: 10px 20px;
    background: #ffffff;
    color: #64748b;
    border: 2px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
    background: #10b981;
    color: #ffffff;
    border-color: #10b981;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pagination-info {
    font-size: 14px;
    color: #64748b;
    font-weight: 600;
}

@media (max-width: 768px) {
    .promotion-title {
        font-size: 28px;
    }

    .promotion-banner {
        height: 250px;
    }

    .products-grid {
        grid-template-columns: 1fr;
    }

    .promotion-dates {
        flex-direction: column;
        gap: 16px;
    }
}
</style>

