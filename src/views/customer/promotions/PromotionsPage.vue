<template>
    <div class="promotions-page">
        <div class="container">
            <!-- Header -->
            <div class="page-header">
                <h1 class="page-title">Chương trình khuyến mãi</h1>
                <p class="page-subtitle">Khám phá các ưu đãi hấp dẫn đang diễn ra</p>
            </div>

            <!-- Tabs -->
            <div class="tabs">
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'active' }"
                    @click="activeTab = 'active'; fetchPromotions('active')"
                >
                    Đang diễn ra
                </button>
                <button
                    class="tab-btn"
                    :class="{ active: activeTab === 'upcoming' }"
                    @click="activeTab = 'upcoming'; fetchPromotions('upcoming')"
                >
                    Sắp diễn ra
                </button>
            </div>

            <!-- Loading -->
            <LoadingSpinner v-if="loading" message="Đang tải khuyến mãi..." />

            <!-- Promotions Grid -->
            <div v-else-if="promotions.length > 0" class="promotions-grid">
                <div
                    v-for="promotion in promotions"
                    :key="promotion.id"
                    class="promotion-card"
                    @click="goToDetail(promotion.id)"
                >
                    <div v-if="promotion.bannerImageUrl" class="promotion-image">
                        <img :src="promotion.bannerImageUrl" :alt="promotion.tenKm" />
                        <div class="promotion-overlay">
                            <span class="promotion-badge" v-if="promotion.giaTri">
                                Giảm {{ formatPrice(promotion.giaTri) }}
                            </span>
                        </div>
                    </div>
                    <div v-else class="promotion-image-placeholder">
                        <span class="placeholder-icon">🎁</span>
                    </div>
                    <div class="promotion-content">
                        <h3 class="promotion-title">{{ promotion.tenKm }}</h3>
                        <p class="promotion-desc">{{ promotion.moTa }}</p>
                        <div class="promotion-meta">
                            <div class="promotion-dates">
                                <span class="date-item">
                                    📅 Bắt đầu: {{ formatDate(promotion.ngayBatDau) }}
                                </span>
                                <span class="date-item">
                                    ⏰ Kết thúc: {{ formatDate(promotion.ngayKetThuc) }}
                                </span>
                            </div>
                            <button class="view-detail-btn">
                                Xem chi tiết →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-state">
                <div class="empty-icon">🎁</div>
                <h3>Chưa có chương trình khuyến mãi</h3>
                <p>Hiện tại chưa có chương trình khuyến mãi nào {{ activeTab === 'active' ? 'đang diễn ra' : 'sắp diễn ra' }}.</p>
                <router-link to="/" class="back-home-btn">
                    Về trang chủ
                </router-link>
            </div>

            <!-- Pagination -->
            <div v-if="promotions.length > 0 && pagination.totalPages > 1" class="pagination">
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'
import { formatDate } from '@/utils/helpers'
import { getCampaigns } from '@/service/customer/promotionService'

const router = useRouter()

const activeTab = ref('active')
const loading = ref(false)
const promotions = ref([])
const pagination = ref({
    page: 0,
    pageSize: 12,
    totalPages: 0,
    totalElements: 0
})

const fetchPromotions = async (status = 'active') => {
    try {
        loading.value = true
        const result = await getCampaigns(status, pagination.value.page, pagination.value.pageSize)
        promotions.value = result.campaigns || []
        pagination.value = {
            ...pagination.value,
            ...result.pagination
        }
    } catch (error) {
        console.error('Error fetching promotions:', error)
        promotions.value = []
    } finally {
        loading.value = false
    }
}

const changePage = (newPage) => {
    pagination.value.page = newPage
    fetchPromotions(activeTab.value)
}

const goToDetail = (id) => {
    router.push(`/promotions/${id}`)
}

const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price)
}

onMounted(() => {
    fetchPromotions('active')
})
</script>

<style scoped>
.promotions-page {
    min-height: 100vh;
    background: #f8fafc;
    padding: 40px 0 80px;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

.page-header {
    text-align: center;
    margin-bottom: 48px;
}

.page-title {
    font-size: 42px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.page-subtitle {
    font-size: 18px;
    color: #64748b;
    margin: 0;
}

.tabs {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 40px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 0;
}

.tab-btn {
    padding: 12px 32px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    font-size: 16px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    transition: all 0.3s;
    margin-bottom: -2px;
}

.tab-btn:hover {
    color: #10b981;
}

.tab-btn.active {
    color: #10b981;
    border-bottom-color: #10b981;
}

.promotions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 32px;
    margin-bottom: 48px;
}

.promotion-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
}

.promotion-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.promotion-image {
    width: 100%;
    height: 240px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
}

.promotion-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.promotion-overlay {
    position: absolute;
    top: 16px;
    right: 16px;
}

.promotion-badge {
    background: #ef4444;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.promotion-image-placeholder {
    width: 100%;
    height: 240px;
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.placeholder-icon {
    font-size: 64px;
}

.promotion-content {
    padding: 24px;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.promotion-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.promotion-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
    margin: 0 0 20px 0;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.promotion-meta {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
}

.promotion-dates {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.date-item {
    font-size: 13px;
    color: #64748b;
}

.view-detail-btn {
    padding: 10px 20px;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    align-self: flex-start;
}

.view-detail-btn:hover {
    background: #059669;
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 24px;
}

.empty-state h3 {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.empty-state p {
    font-size: 16px;
    color: #64748b;
    margin: 0 0 32px 0;
}

.back-home-btn {
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

.back-home-btn:hover {
    background: #059669;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin-top: 48px;
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
    .page-title {
        font-size: 32px;
    }

    .promotions-grid {
        grid-template-columns: 1fr;
        gap: 24px;
    }

    .tabs {
        gap: 8px;
    }

    .tab-btn {
        padding: 10px 20px;
        font-size: 14px;
    }
}
</style>

