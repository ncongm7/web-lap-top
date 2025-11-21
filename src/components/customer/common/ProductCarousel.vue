<template>
    <section class="product-carousel-section">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">{{ title }}</h2>
                <router-link v-if="viewAllLink" :to="viewAllLink" class="view-all-link">
                    Xem tất cả →
                </router-link>
            </div>

            <div class="carousel-wrapper">
                <button 
                    v-if="products.length > itemsToShow"
                    @click="scrollLeft" 
                    class="carousel-nav-btn carousel-nav-prev"
                    :disabled="scrollPosition === 0"
                >
                    ‹
                </button>

                <div class="carousel-container" ref="carouselRef">
                    <div class="carousel-track" :style="{ transform: `translateX(-${scrollPosition}px)` }">
                        <div 
                            v-for="(product, index) in products" 
                            :key="product.id || product.idCTSP || index"
                            class="carousel-item"
                        >
                            <ProductCard 
                                :product="product" 
                                @add-to-cart="handleAddToCart"
                            />
                        </div>
                    </div>
                </div>

                <button 
                    v-if="products.length > itemsToShow"
                    @click="scrollRight" 
                    class="carousel-nav-btn carousel-nav-next"
                    :disabled="isAtEnd"
                >
                    ›
                </button>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import ProductCard from './ProductCard.vue'

const props = defineProps({
    products: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        required: true,
    },
    showBadge: {
        type: Boolean,
        default: false,
    },
    badgeText: {
        type: String,
        default: '',
    },
    viewAllLink: {
        type: String,
        default: null,
    },
    itemsToShow: {
        type: Number,
        default: 4,
    },
})

const emit = defineEmits(['add-to-cart'])

const carouselRef = ref(null)
const scrollPosition = ref(0)
const itemWidth = ref(0)
const gap = 20

// Get itemsToShow from props
const itemsToShow = computed(() => props.itemsToShow)

// Handle add to cart
const handleAddToCart = (product) => {
    emit('add-to-cart', product)
}

// Calculate if at end
const isAtEnd = computed(() => {
    if (!carouselRef.value || props.products.length <= itemsToShow.value) return true
    
    const maxScroll = (props.products.length - itemsToShow.value) * (itemWidth.value + gap)
    return scrollPosition.value >= maxScroll
})

// Scroll functions
const scrollLeft = () => {
    if (scrollPosition.value > 0) {
        scrollPosition.value = Math.max(0, scrollPosition.value - (itemWidth.value + gap))
    }
}

const scrollRight = () => {
    if (!carouselRef.value) return
    
    const maxScroll = (props.products.length - itemsToShow.value) * (itemWidth.value + gap)
    if (scrollPosition.value < maxScroll) {
        scrollPosition.value = Math.min(maxScroll, scrollPosition.value + (itemWidth.value + gap))
    }
}

// Calculate item width
const calculateItemWidth = () => {
    if (!carouselRef.value) return
    
    const containerWidth = carouselRef.value.offsetWidth
    itemWidth.value = (containerWidth - (gap * (itemsToShow.value - 1))) / itemsToShow.value
}

// Handle resize
let resizeObserver = null
onMounted(() => {
    calculateItemWidth()
    
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => {
            calculateItemWidth()
        })
        if (carouselRef.value) {
            resizeObserver.observe(carouselRef.value)
        }
    } else {
        window.addEventListener('resize', calculateItemWidth)
    }
})

onUnmounted(() => {
    if (resizeObserver && carouselRef.value) {
        resizeObserver.unobserve(carouselRef.value)
    } else {
        window.removeEventListener('resize', calculateItemWidth)
    }
})
</script>

<style scoped>
.product-carousel-section {
    padding: 60px 0;
    background: #ffffff;
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

.carousel-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    gap: 12px;
}

.carousel-container {
    flex: 1;
    overflow: hidden;
}

.carousel-track {
    display: flex;
    gap: 20px;
    transition: transform 0.3s ease;
}

.carousel-item {
    flex-shrink: 0;
    width: calc((100% - 60px) / 4);
}

.carousel-nav-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 2px solid #e2e8f0;
    background: #ffffff;
    color: #1e293b;
    font-size: 24px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    flex-shrink: 0;
}

.carousel-nav-btn:hover:not(:disabled) {
    border-color: #10b981;
    background: #10b981;
    color: #ffffff;
}

.carousel-nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
    .carousel-item {
        width: calc((100% - 40px) / 3);
    }
}

@media (max-width: 768px) {
    .product-carousel-section {
        padding: 40px 0;
    }

    .section-header {
        margin-bottom: 24px;
    }

    .section-title {
        font-size: 24px;
    }

    .carousel-item {
        width: calc((100% - 20px) / 2);
    }

    .carousel-nav-btn {
        width: 36px;
        height: 36px;
        font-size: 20px;
    }
}

@media (max-width: 480px) {
    .carousel-item {
        width: calc(100% - 10px);
    }

    .carousel-nav-btn {
        display: none;
    }
}
</style>

