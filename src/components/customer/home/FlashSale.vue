<template>
    <section class="flash-sale">
        <div class="container">
            <div class="flash-sale-header">
                <div class="header-left">
                    <h2 class="section-title">
                        <span class="flash-icon">⚡</span>
                        Flash Sale
                    </h2>
                    <p class="section-desc">Giảm giá sốc - Mua ngay kẻo hết!</p>
                </div>
                <div class="header-right">
                    <div v-if="endDate" class="countdown-wrapper">
                        <span class="countdown-label">Kết thúc sau:</span>
                        <CountdownTimer :end-date="endDate" />
                    </div>
                </div>
            </div>

            <div v-if="isLoading" class="loading-state">
                <span class="spinner"></span>
                <span>Đang tải sản phẩm flash sale...</span>
            </div>

            <div v-else-if="error" class="error-state">
                <span>⚠️ {{ error }}</span>
            </div>

            <div v-else-if="products.length > 0" class="flash-sale-content">
                <div class="products-carousel">
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
                                :key="product.id || index"
                                class="carousel-item"
                            >
                                <div class="flash-product-card">
                                    <router-link :to="`/products/${product.id || product.idCTSP}`" class="product-link">
                                        <div class="product-image-wrapper">
                                            <img 
                                                :src="getProductImage(product)" 
                                                :alt="product.tenSanPham || product.ten"
                                                @error="handleImageError"
                                            />
                                            <div class="discount-badge">
                                                -{{ calculateDiscountPercent(product) }}%
                                            </div>
                                        </div>
                                        <div class="product-info">
                                            <h3 class="product-name">{{ product.tenSanPham || product.ten || 'Sản phẩm' }}</h3>
                                            <div class="price-section">
                                                <span v-if="getOriginalPrice(product)" class="original-price">
                                                    {{ formatPrice(getOriginalPrice(product)) }}
                                                </span>
                                                <span class="sale-price">
                                                    {{ formatPrice(getSalePrice(product)) }}
                                                </span>
                                            </div>
                                        </div>
                                    </router-link>
                                    <button 
                                        @click.prevent="handleAddToCart(product)" 
                                        class="add-to-cart-btn"
                                        :disabled="isAdding"
                                    >
                                        <span v-if="!isAdding">Thêm vào giỏ</span>
                                        <span v-else>Đang thêm...</span>
                                    </button>
                                </div>
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

            <div v-else class="empty-state">
                <span>Hiện tại không có sản phẩm flash sale</span>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { getFlashSaleProducts, getFlashSaleEndDate } from '@/service/customer/flashSaleService'
import { formatCurrency } from '@/utils/helpers'
import CountdownTimer from '@/components/customer/common/CountdownTimer.vue'
import authService from '@/service/customer/authService'
import { useToast } from 'vue-toastification'
import { useCartStore } from '@/stores/customer/cartStore'
import { useLayoutStore } from '@/stores/customer/layoutStore'

const emit = defineEmits(['add-to-cart'])

const toast = useToast()
const cartStore = useCartStore()
const layoutStore = useLayoutStore()

const products = ref([])
const endDate = ref(null)
const isLoading = ref(false)
const error = ref(null)
const isAdding = ref(false)
const carouselRef = ref(null)
const scrollPosition = ref(0)
const itemWidth = ref(0)
const gap = 20
const itemsToShow = 4

// Calculate if at end
const isAtEnd = computed(() => {
    if (!carouselRef.value || products.value.length <= itemsToShow) return true
    const maxScroll = (products.value.length - itemsToShow) * (itemWidth.value + gap)
    return scrollPosition.value >= maxScroll
})

// Format price
const formatPrice = (price) => {
    if (!price || price === 0) return 'Liên hệ'
    return formatCurrency(price)
}

// Get product image
const getProductImage = (product) => {
    const imageFields = ['anhDaiDien', 'hinhAnh', 'image', 'imageUrl', 'thumbnail']
    for (const field of imageFields) {
        if (product[field] && typeof product[field] === 'string' && product[field].trim() !== '') {
            return product[field]
        }
    }
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Handle image error
const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Get original price
const getOriginalPrice = (product) => {
    return product.originalPrice || product.giaBan || product.gia || product.giaGoc || null
}

// Get sale price
const getSalePrice = (product) => {
    return product.discountPrice || product.giaGiam || product.giaSale || product.giaBan || product.gia || null
}

// Calculate discount percent
const calculateDiscountPercent = (product) => {
    const original = getOriginalPrice(product)
    const sale = getSalePrice(product)
    
    if (!original || !sale || original <= sale) return 0
    
    return Math.round(((original - sale) / original) * 100)
}

// Scroll functions
const scrollLeft = () => {
    if (scrollPosition.value > 0) {
        scrollPosition.value = Math.max(0, scrollPosition.value - (itemWidth.value + gap))
    }
}

const scrollRight = () => {
    if (!carouselRef.value) return
    const maxScroll = (products.value.length - itemsToShow) * (itemWidth.value + gap)
    if (scrollPosition.value < maxScroll) {
        scrollPosition.value = Math.min(maxScroll, scrollPosition.value + (itemWidth.value + gap))
    }
}

// Calculate item width
const calculateItemWidth = () => {
    if (!carouselRef.value) return
    const containerWidth = carouselRef.value.offsetWidth
    itemWidth.value = (containerWidth - (gap * (itemsToShow - 1))) / itemsToShow
}

// Handle add to cart
const handleAddToCart = async (product) => {
    if (!authService.isAuthenticated()) {
        layoutStore.openLoginModal('/cart')
        toast.info('Vui lòng đăng nhập để tiếp tục')
        return
    }

    try {
        isAdding.value = true
        const productId = product.idCTSP || product.id
        const result = await cartStore.addToCart(productId, 1)
        
        if (result.success) {
            toast.success(`Đã thêm ${product.tenSanPham || product.ten} vào giỏ hàng`)
            emit('add-to-cart', product)
        } else {
            toast.error(result.message || 'Không thể thêm sản phẩm vào giỏ hàng')
        }
    } catch (error) {
        console.error('Error adding to cart:', error)
        toast.error('Lỗi khi thêm sản phẩm vào giỏ hàng')
    } finally {
        isAdding.value = false
    }
}

// Fetch flash sale data
const fetchFlashSale = async () => {
    try {
        isLoading.value = true
        error.value = null

        const [productsData, endDateData] = await Promise.all([
        getFlashSaleProducts(),
        getFlashSaleEndDate(),
        ])

        console.log('[FlashSale] raw productsData:', productsData, Array.isArray(productsData))

        // Đảm bảo luôn là mảng
        if (Array.isArray(productsData)) {
        products.value = productsData
        } else if (productsData && Array.isArray(productsData.products)) {
        products.value = productsData.products
        } else if (productsData && Array.isArray(productsData.content)) {
        products.value = productsData.content
        } else {
        products.value = []
        }

        endDate.value = endDateData

        console.log('✅ [FlashSale] Loaded:', products.value.length, 'products')
        console.log('🔍 [FlashSale] First product:', products.value[0])
    } catch (err) {
        console.error('❌ [FlashSale] Error loading flash sale:', err)
        error.value = 'Không thể tải sản phẩm flash sale'
        products.value = []
    } finally {
        isLoading.value = false
    }
}

// Handle resize
let resizeObserver = null
onMounted(() => {
    fetchFlashSale()
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
.flash-sale {
    padding: 60px 0;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    overflow: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.flash-sale-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 20px;
}

.header-left {
    flex: 1;
}

.section-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
    gap: 12px;
}

.flash-icon {
    font-size: 36px;
    animation: flash 1s infinite;
}

@keyframes flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

.section-desc {
    font-size: 16px;
    color: #64748b;
    margin: 0;
}

.header-right {
    display: flex;
    align-items: center;
}

.countdown-wrapper {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.countdown-label {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
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

.products-carousel {
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
    border: 2px solid #1e293b;
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
    background: #1e293b;
    color: #ffffff;
}

.carousel-nav-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.flash-product-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.flash-product-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

.product-link {
    text-decoration: none;
    color: inherit;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-image-wrapper {
    position: relative;
    padding-top: 100%;
    overflow: hidden;
    background: #f8fafc;
}

.product-image-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.discount-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: #ffffff;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.3);
}

.product-info {
    padding: 16px;
    flex: 1;
}

.product-name {
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 44px;
}

.price-section {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.original-price {
    font-size: 13px;
    color: #9ca3af;
    text-decoration: line-through;
}

.sale-price {
    font-size: 18px;
    font-weight: 700;
    color: #ef4444;
}

.add-to-cart-btn {
    width: 100%;
    padding: 12px 16px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 0 0 12px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
    background: #dc2626;
}

.add-to-cart-btn:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
}

/* Responsive */
@media (max-width: 1024px) {
    .carousel-item {
        width: calc((100% - 40px) / 3);
    }
}

@media (max-width: 768px) {
    .flash-sale {
        padding: 40px 0;
    }

    .flash-sale-header {
        flex-direction: column;
        align-items: flex-start;
    }

    .countdown-wrapper {
        align-items: flex-start;
    }

    .section-title {
        font-size: 28px;
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

