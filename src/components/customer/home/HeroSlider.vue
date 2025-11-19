<template>
  <div class="hero-slider">
    <swiper
      v-if="banners.length > 0"
      :modules="modules"
      :slides-per-view="1"
      :space-between="0"
      :loop="banners.length > 1"
      :autoplay="{
        delay: 5000,
        disableOnInteraction: false,
      }"
      :pagination="{ clickable: true }"
      :navigation="banners.length > 1"
      class="hero-swiper"
    >
      <swiper-slide v-for="(banner, index) in banners" :key="banner.id || index">
        <div class="slide-content" :style="{ backgroundColor: banner.bgColor || '#047857' }">
          <div class="container">
            <div class="slide-inner" :class="{ 'no-image': !banner.bannerImageUrl }">
              <div class="slide-text">
                <h2 class="slide-title">{{ banner.tenKm || banner.title }}</h2>
                <p class="slide-desc">{{ banner.moTa || banner.description }}</p>
                <router-link :to="banner.link || `/khuyen-mai/${banner.id}`" class="slide-btn">
                  {{ banner.buttonText || 'Xem ngay' }}
                </router-link>
              </div>
              <div v-if="banner.bannerImageUrl" class="slide-image">
                <img :src="banner.bannerImageUrl" :alt="banner.tenKm || banner.title" />
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
    <div v-else class="empty-slider">
      <div class="container">
        <div class="slide-inner no-image">
          <div class="slide-text">
            <h2 class="slide-title">Chào mừng đến với cửa hàng laptop</h2>
            <p class="slide-desc">Khám phá các sản phẩm công nghệ hàng đầu</p>
            <router-link to="/products" class="slide-btn"> Xem sản phẩm </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

defineProps({
  banners: {
    type: Array,
    default: () => [],
  },
})

const modules = [Autoplay, Pagination, Navigation]
</script>

<style scoped>
.hero-slider {
  margin-top: -1px;
  /* Remove gap with header */
  position: relative;
  overflow: hidden;
  width: 100%;
}

.empty-slider {
  width: 100%;
  height: 500px;
  background: linear-gradient(135deg, #047857 0%, #059669 100%);
  display: flex;
  align-items: center;
  color: #ffffff;
}

.hero-swiper {
  width: 100%;
  height: 500px;
  overflow: hidden;
}

.slide-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  color: #ffffff;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 60px);
  width: 100%;
  box-sizing: border-box;
}

.slide-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  min-height: 400px;
  width: 100%;
  box-sizing: border-box;
}

.slide-inner.no-image {
  grid-template-columns: 1fr;
  justify-items: center;
  text-align: center;
}

.slide-text {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.no-image .slide-text {
  align-items: center;
  max-width: 800px;
}

.slide-title {
  font-size: 48px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
}

.slide-desc {
  font-size: 20px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
}

.slide-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: #10b981;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.2s;
  align-self: flex-start;
}

.slide-btn:hover {
  background: #059669;
}

.slide-image {
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-image img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  max-height: 400px;
}

/* Swiper navigation styling */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  color: #ffffff;
  background: rgba(0, 0, 0, 0.3);
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

:deep(.swiper-button-prev):hover,
:deep(.swiper-button-next):hover {
  background: rgba(0, 0, 0, 0.5);
}

:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 20px;
}

/* Swiper pagination styling */
:deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: #ffffff;
  opacity: 0.5;
}

:deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #10b981;
}

@media (min-width: 1441px) {
  .hero-swiper {
    height: clamp(500px, 40vw, 700px);
  }

  .slide-title {
    font-size: clamp(48px, 3.5vw, 64px);
  }

  .slide-desc {
    font-size: clamp(20px, 1.5vw, 24px);
  }
}

@media (max-width: 1440px) and (min-width: 1025px) {
  .slide-title {
    font-size: clamp(40px, 3vw, 48px);
  }

  .slide-desc {
    font-size: clamp(18px, 1.3vw, 20px);
  }
}

@media (max-width: 1024px) {
  .slide-title {
    font-size: 40px;
  }

  .slide-desc {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .hero-swiper {
    height: 400px;
  }

  .slide-inner {
    grid-template-columns: 1fr;
    gap: 24px;
    text-align: center;
  }

  .slide-title {
    font-size: 32px;
  }

  .slide-desc {
    font-size: 16px;
  }

  .slide-btn {
    align-self: center;
  }

  .slide-image {
    order: -1;
  }

  .slide-image img {
    max-height: 200px;
  }
}
</style>
