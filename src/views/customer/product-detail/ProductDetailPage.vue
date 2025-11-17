<template>
    <div class="pdp-page">
        <!-- Loading State -->
        <div v-if="loading" class="pdp-state pdp-state--loading">
            <div class="loading-spinner"></div>
            <p class="state-text">Đang tải sản phẩm...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="pdp-state pdp-state--error">
            <div class="state-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
            </div>
            <h3 class="state-title">Không thể tải sản phẩm</h3>
            <p class="state-text">{{ error }}</p>
            <button class="primary-button" @click="loadProduct">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M1 4v6h6M23 20v-6h-6" />
                    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
                </svg>
                Thử lại
            </button>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="pdp-content">
            <!-- ============================================ -->
            <!-- ROW 1: BREADCRUMB NAVIGATION -->
            <!-- ============================================ -->
            <section class="pdp-row breadcrumb-row">
                <nav class="breadcrumb">
                    <router-link to="/" class="breadcrumb-link">Trang chủ</router-link>
                    <span class="breadcrumb-separator">›</span>
                    <router-link to="/products" class="breadcrumb-link">Laptop</router-link>
                    <span class="breadcrumb-separator">›</span>
                    <span class="breadcrumb-current">{{ product.name }}</span>
                </nav>
            </section>

            <!-- ============================================ -->
            <!-- ROW 2: MAIN PRODUCT INFO (2 COLUMNS) -->
            <!-- ============================================ -->
            <section class="pdp-row product-main-row">
                <div class="product-main-grid">
                    <!-- Column 1: Product Gallery (~40% width) -->
                    <div class="product-gallery-col">
                        <ProductGallery :images="productImages" :product-name="product.name" />
                        <PromotionCard />
                    </div>

                    <!-- Column 2: Product Info & Actions (~60% width) -->
                    <div class="product-info-col">
                        <!-- 1. Product Title -->
                        <header class="product-header">
                            <h1 class="product-title">{{ product.name }}</h1>
                        </header>

                        <!-- 2. Product Meta Info -->
                        <ProductMeta :metadata="productMetadata" :rating="5" />

                        <!-- 4. Price & Stock Section -->
                        <PriceSection v-if="selectedVariant" :current-price="selectedVariant.price"
                            :original-price="selectedVariant.originalPrice" :stock="selectedVariant.stock" />

                        <!-- 5. Variant Selector -->
                        <div class="variant-section">
                            <VariantQuickSelector :variants="formattedVariants" v-model="selectedVariantId"
                                @change="handleVariantChange" />
                        </div>

                        <!-- 7. Add to Cart Actions -->
                        <div class="action-section">
                            <AddToCartForm :product-id="selectedVariantId"
                                :product-name="selectedVariant?.summary || product.name"
                                :max-quantity="selectedVariant?.stock || 0"
                                :disabled="!selectedVariantId || selectedVariant?.stock <= 0"
                                @add-to-cart="handleAddToCart" @buy-now="handleBuyNow" />
                        </div>
                    </div>
                </div>
            </section>

            <!-- ============================================ -->
            <!-- ROW 3: DETAILED INFO & SPECS (2 COLUMNS) -->
            <!-- ============================================ -->
            <section class="pdp-row detail-row">
                <div class="detail-grid">
                    <!-- Column 1: Tab Content (~70% width) -->
                    <div class="detail-main-col">
                        <div class="detail-tabs-wrapper">
                            <!-- Tabs Navigation -->
                            <div class="tabs-navigation">
                                <button :class="['tab-nav-btn', { active: activeTab === 'description' }]"
                                    @click="activeTab = 'description'">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="tab-icon">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                    </svg>
                                    <span>Mô tả sản phẩm</span>
                                </button>
                                <button :class="['tab-nav-btn', { active: activeTab === 'specs' }]"
                                    @click="activeTab = 'specs'">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="tab-icon">
                                        <rect x="3" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="3" width="7" height="7"></rect>
                                        <rect x="14" y="14" width="7" height="7"></rect>
                                        <rect x="3" y="14" width="7" height="7"></rect>
                                    </svg>
                                    <span>Thông số kỹ thuật</span>
                                </button>
                                <button :class="['tab-nav-btn', { active: activeTab === 'reviews' }]"
                                    @click="activeTab = 'reviews'">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="tab-icon">
                                        <polygon
                                            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                                        </polygon>
                                    </svg>
                                    <span>Đánh giá</span>
                                </button>
                            </div>

                            <!-- Tabs Content Panels -->
                            <div class="tabs-content">
                                <!-- Tab 1: Product Description -->
                                <div v-show="activeTab === 'description'" class="tab-panel">
                                    <div class="description-content">
                                        <p>{{ product.description || defaultDescription }}</p>
                                    </div>
                                </div>

                                <!-- Tab 2: Technical Specifications -->
                                <div v-show="activeTab === 'specs'" class="tab-panel">
                                    <SpecsTable :specs="productSpecs" />
                                </div>

                                <!-- Tab 3: Reviews -->
                                <div v-show="activeTab === 'reviews'" class="tab-panel">
                                    <div class="empty-placeholder">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                            class="placeholder-icon">
                                            <circle cx="12" cy="12" r="10"></circle>
                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                        </svg>
                                        <p class="placeholder-text">Tính năng đánh giá đang được phát triển</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Column 2: Sidebar (~30% width) -->
                    <aside class="detail-sidebar-col">
                        <SidebarWidget title="Sản phẩm tương tự" :items="similarProducts" button-text="Xem tất cả" />
                        <SidebarWidget title="Tin tức liên quan" :items="relatedNews" button-text="Đọc thêm" />
                    </aside>
                </div>
            </section>

            <!-- ============================================ -->
            <!-- ROW 4: REVIEWS & RATINGS (2 COLUMNS) -->
            <!-- ============================================ -->
            <section class="pdp-row reviews-row">
                <div class="reviews-grid">
                    <!-- Column 1: Review Summary -->
                    <div class="review-summary-col">
                        <ReviewSummary />
                    </div>

                    <!-- Column 2: Review List -->
                    <div class="review-list-col">
                        <ReviewList />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Components
import ProductGallery from '@/components/customer/san_pham/ProductGallery.vue'
import VariantQuickSelector from '@/components/customer/san_pham/VariantQuickSelector.vue'
import AddToCartForm from '@/components/customer/san_pham/AddToCartForm.vue'
import ProductMeta from '@/components/customer/product-detail/ProductMeta.vue'
import PriceSection from '@/components/customer/product-detail/PriceSection.vue'
import PromotionCard from '@/components/customer/product-detail/PromotionCard.vue'
import SpecsTable from '@/components/customer/product-detail/SpecsTable.vue'
import ReviewSummary from '@/components/customer/product-detail/ReviewSummary.vue'
import ReviewList from '@/components/customer/product-detail/ReviewList.vue'
import SidebarWidget from '@/components/customer/product-detail/SidebarWidget.vue'

// Composables
import { useProductDetail } from '@/composables/product-detail/useProductDetail'
import { useProductCart } from '@/composables/product-detail/useProductCart'

// Constants
import { DEFAULT_PRODUCT_DESCRIPTION, SIMILAR_PRODUCTS, RELATED_NEWS } from '@/utils/product-detail/constants'

const route = useRoute()

// State
const activeTab = ref('specs')
const defaultDescription = DEFAULT_PRODUCT_DESCRIPTION
const similarProducts = SIMILAR_PRODUCTS
const relatedNews = RELATED_NEWS

// Use composables
const {
    loading,
    error,
    product,
    selectedVariantId,
    selectedVariant,
    formattedVariants,
    productImages,
    productSpecs,
    productMetadata,
    loadProduct,
    handleVariantChange,
} = useProductDetail(route.params.id)

const { handleAddToCart, handleBuyNow } = useProductCart()

// Watch route changes
watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            loadProduct()
        }
    }
)

// Initial load
onMounted(() => {
    loadProduct()
})
</script>

<style scoped src="./ProductDetailPage.css"></style>
