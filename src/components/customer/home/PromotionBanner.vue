<template>
    <section class="promotion-banner">
        <div class="container">
            <LoadingSpinner v-if="loading" message="Đang tải khuyến mãi..." />

            <div v-else-if="promotions.length > 0" class="promotions-grid">
                <div v-for="promotion in promotions" :key="promotion.id" class="promotion-card">
                    <div class="promotion-badge">{{ promotion.discount }}% OFF</div>
                    <div class="promotion-content">
                        <h3 class="promotion-title">{{ promotion.name }}</h3>
                        <p class="promotion-desc">{{ promotion.moTa }}</p>
                        <div class="promotion-meta">
                            <span class="promotion-date">
                                🕐 Đến {{ formatDate(promotion.ngayKetThuc) }}
                            </span>
                            <router-link :to="`/promotions/${promotion.id}`" class="promotion-link">
                                Chi tiết →
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="!loading" class="empty-state">
                <p>Hiện chưa có chương trình khuyến mãi nào</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'
import { formatDate } from '@/utils/helpers'

defineProps({
    promotions: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})
</script>

<style scoped>
.promotion-banner {
    padding: 60px 0;
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
    overflow: hidden;
    width: 100%;
}

.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 60px);
    width: 100%;
    box-sizing: border-box;
}

.promotions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 24px;
}

.promotion-card {
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    transition: transform 0.3s;
}

.promotion-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.2);
}

.promotion-badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #ef4444;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 24px;
    font-size: 14px;
    font-weight: 700;
    z-index: 1;
}

.promotion-content {
    padding: 32px 24px 24px;
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
}

.promotion-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 16px;
    border-top: 1px solid #e2e8f0;
}

.promotion-date {
    font-size: 13px;
    color: #64748b;
}

.promotion-link {
    color: #10b981;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    transition: color 0.2s;
}

.promotion-link:hover {
    color: #059669;
}

.empty-state {
    text-align: center;
    padding: 40px 0;
    color: #ffffff;
    font-size: 16px;
}

@media (min-width: 1441px) {
    .promotions-grid {
        grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
        gap: clamp(24px, 2vw, 40px);
    }
}

@media (max-width: 1440px) and (min-width: 1025px) {
    .promotions-grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 24px;
    }
}

@media (max-width: 1024px) {
    .promotions-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .promotion-banner {
        padding: 40px 0;
    }

    .promotions-grid {
        grid-template-columns: 1fr;
    }

    .promotion-card {
        margin: 0 8px;
    }

    .promotion-title {
        font-size: 20px;
    }
}
</style>
