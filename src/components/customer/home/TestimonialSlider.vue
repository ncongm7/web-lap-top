<template>
    <section class="testimonial-slider">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Khách hàng nói gì về chúng tôi</h2>
                <p class="section-desc">Những đánh giá chân thực từ khách hàng</p>
            </div>

            <LoadingSpinner v-if="loading" message="Đang tải đánh giá..." />

            <div v-else-if="reviews.length > 0">
                <swiper :modules="modules" :slides-per-view="1" :space-between="24" :loop="true" :autoplay="{
                    delay: 4000,
                    disableOnInteraction: false,
                }" :pagination="{ clickable: true }" :breakpoints="{
                    640: {
                        slidesPerView: 2,
                    },
                    1024: {
                        slidesPerView: 3,
                    },
                }" class="reviews-swiper">
                    <swiper-slide v-for="review in reviews" :key="review.id">
                        <div class="review-card">
                            <div class="review-header">
                                <div class="user-avatar">
                                    <span>{{ getInitials(review.customerName) }}</span>
                                </div>
                                <div class="user-info">
                                    <h4 class="user-name">{{ review.customerName }}</h4>
                                    <div class="review-rating">
                                        <span v-for="star in 5" :key="star" class="star">
                                            {{ star <= review.rating ? '⭐' : '☆' }} </span>
                                    </div>
                                </div>
                            </div>
                            <p class="review-content">{{ review.noiDung }}</p>
                            <div class="review-footer">
                                <span class="review-product">{{ review.productName }}</span>
                                <span class="review-date">{{ formatDate(review.ngayDanhGia) }}</span>
                            </div>
                        </div>
                    </swiper-slide>
                </swiper>
            </div>

            <div v-else-if="!loading" class="empty-state">
                <p>Chưa có đánh giá nào</p>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'
import { formatDate } from '@/utils/helpers'

defineProps({
    reviews: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    }
})

const modules = [Autoplay, Pagination]

const getInitials = (name) => {
    if (!name) return '?'
    const words = name.trim().split(' ')
    if (words.length === 1) return words[0].charAt(0).toUpperCase()
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}
</script>

<style scoped>
.testimonial-slider {
    padding: 60px 0;
    background: #f8fafc;
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

.section-header {
    text-align: center;
    margin-bottom: clamp(32px, 4vw, 60px);
}

.section-title {
    font-size: clamp(28px, 2.5vw, 42px);
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.section-desc {
    font-size: 16px;
    color: #64748b;
    margin: 0;
}

.reviews-swiper {
    padding-bottom: 50px;
}

.review-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
}

.review-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
}

.review-header {
    display: flex;
    gap: 12px;
    align-items: center;
}

.user-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 18px;
    font-weight: 600;
    flex-shrink: 0;
}

.user-info {
    flex: 1;
}

.user-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.review-rating {
    display: flex;
    gap: 2px;
}

.star {
    font-size: 14px;
}

.review-content {
    flex: 1;
    font-size: 14px;
    line-height: 1.6;
    color: #475569;
    margin: 0;
}

.review-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 12px;
    border-top: 1px solid #e2e8f0;
    font-size: 13px;
}

.review-product {
    color: #10b981;
    font-weight: 500;
}

.review-date {
    color: #94a3b8;
}

.empty-state {
    text-align: center;
    padding: 40px 0;
    color: #64748b;
}

/* Swiper pagination styling */
:deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    background: #cbd5e1;
}

:deep(.swiper-pagination-bullet-active) {
    background: #10b981;
}

@media (min-width: 1441px) {
    .review-card {
        padding: clamp(32px, 2.5vw, 48px);
    }
}

@media (max-width: 768px) {
    .testimonial-slider {
        padding: 40px 0;
    }

    .section-title {
        font-size: 28px;
    }

    .review-card {
        padding: 20px;
    }
}
</style>
