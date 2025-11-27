<template>
    <section class="featured-products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{{ title }}</h2>
              
            </div>

            <LoadingSpinner v-if="loading" message="Đang tải sản phẩm..." />

            <div v-else-if="error" class="error-state">
                <p>{{ error }}</p>
                <button @click="$emit('retry')" class="retry-btn">Thử lại</button>
            </div>

            <div v-else class="products-slider-container">
                <div 
                    class="slider-wrapper"
                    @mouseenter="stopAutoSlide"
                    @mouseleave="startAutoSlide"
                >
                    <button 
                        class="slider-btn prev-btn" 
                        @click="prevSlide"
                        :disabled="currentSlide === 0"
                        :class="{ disabled: currentSlide === 0 }"
                    >
                        ‹
                    </button>
                    
                    <div class="products-slider" ref="sliderRef">
                        <div 
                            class="slider-track" 
                            :style="{ transform: `translateX(-${currentSlide * slideWidth}%)` }"
                        >
                            <div 
                                v-for="product in products" 
                                :key="product.id" 
                                class="slide-item"
                            >
                                <ProductCard 
                                    :product="product"
                                    @add-to-cart="handleAddToCart" 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <button 
                        class="slider-btn next-btn" 
                        @click="nextSlide"
                        :disabled="currentSlide >= maxSlides"
                        :class="{ disabled: currentSlide >= maxSlides }"
                    >
                        ›
                    </button>
                </div>
                
                <!-- Slider indicators -->
                <div class="slider-indicators">
                    <button
                        v-for="(slide, index) in totalSlides"
                        :key="index"
                        class="indicator"
                        :class="{ active: currentSlide === index }"
                        @click="goToSlide(index)"
                    ></button>
                </div>
            </div>

            <div 
            v-if="!loading && !error && products.length > 0 && viewAllLink" 
            class="section-footer"
            >
                <router-link :to="viewAllLink" class="view-all-btn">
                    Xem tất cả sản phẩm →
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import ProductCard from '@/components/customer/common/ProductCard.vue'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'

const props = defineProps({
    products: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: null
    },
    title: {
        type: String,
        default: 'Sản phẩm tương tự'
    },
    viewAllLink: {
        type: String,
        default: '/products'
    }
})

const emit = defineEmits(['add-to-cart', 'retry'])

// Slider state
const currentSlide = ref(0)
const sliderRef = ref(null)
const itemsPerSlide = 4 // Hiển thị 4 sản phẩm mỗi slide
const slideWidth = 100 // 100% width per slide

// Computed properties
const totalSlides = computed(() => {
    return Math.ceil(props.products.length / itemsPerSlide)
})

const maxSlides = computed(() => {
    return Math.max(0, totalSlides.value - 1)
})

// Slider methods
const nextSlide = () => {
    if (currentSlide.value < maxSlides.value) {
        currentSlide.value++
    }
}

const prevSlide = () => {
    if (currentSlide.value > 0) {
        currentSlide.value--
    }
}

const goToSlide = (index) => {
    if (index >= 0 && index <= maxSlides.value) {
        currentSlide.value = index
    }
}

// Auto-slide functionality
let autoSlideInterval = null

const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
        if (currentSlide.value >= maxSlides.value) {
            currentSlide.value = 0
        } else {
            nextSlide()
        }
    }, 5000) // Auto slide every 5 seconds
}

const stopAutoSlide = () => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval)
        autoSlideInterval = null
    }
}

// Event handlers
const handleAddToCart = (product) => {
    emit('add-to-cart', product)
}

// Lifecycle
onMounted(() => {
    if (props.products.length > itemsPerSlide) {
        startAutoSlide()
    }
})

onBeforeUnmount(() => {
    stopAutoSlide()
})
</script>

<style scoped>
.featured-products {
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
    font-size: clamp(14px, 1.2vw, 18px);
    color: #64748b;
    margin: 0;
}

/* Slider Styles */
.products-slider-container {
    position: relative;
    margin-bottom: 48px;
}

.slider-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 16px;
}

.products-slider {
    flex: 1;
    overflow: hidden;
    border-radius: 12px;
}

.slider-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: 100%;
}

.slide-item {
    flex: 0 0 25%; /* 4 items per slide = 25% each */
    padding: 0 8px;
    box-sizing: border-box;
}

.slider-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: #ffffff;
    color: #64748b;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2;
}

.slider-btn:hover:not(.disabled) {
    background: #10b981;
    color: #ffffff;
    border-color: #10b981;
    transform: scale(1.05);
}

.slider-btn.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
}

.slider-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 24px;
}

.indicator {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: none;
    background: #cbd5e1;
    cursor: pointer;
    transition: all 0.3s ease;
}

.indicator.active {
    background: #10b981;
    transform: scale(1.2);
}

.indicator:hover {
    background: #64748b;
}

.error-state {
    text-align: center;
    padding: 60px 0;
}

.error-state p {
    color: #ef4444;
    margin: 0 0 16px 0;
}

.retry-btn {
    padding: 10px 24px;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.retry-btn:hover {
    background: #059669;
}

.section-footer {
    text-align: center;
}

.view-all-btn {
    display: inline-flex;
    align-items: center;
    padding: 14px 32px;
    background: #10b981;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s;
}

.view-all-btn:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Responsive Design */
@media (max-width: 1024px) {
    .slide-item {
        flex: 0 0 33.333%; /* 3 items per slide on tablet */
    }
    
    .slider-btn {
        width: 40px;
        height: 40px;
        font-size: 20px;
    }
}

@media (max-width: 768px) {
    .featured-products {
        padding: 40px 0;
    }

    .section-title {
        font-size: 28px;
    }
    
    .slide-item {
        flex: 0 0 50%; /* 2 items per slide on mobile */
    }
    
    .slider-wrapper {
        gap: 8px;
    }
    
    .slider-btn {
        width: 36px;
        height: 36px;
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .slide-item {
        flex: 0 0 100%; /* 1 item per slide on small mobile */
        padding: 0 4px;
    }
    
    .slider-btn {
        width: 32px;
        height: 32px;
        font-size: 16px;
    }
    
    .indicator {
        width: 10px;
        height: 10px;
    }
}
</style>