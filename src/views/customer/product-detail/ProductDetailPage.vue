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
    <div v-else-if="productDetail" class="pdp-content">
      <!-- Breadcrumb Navigation -->
      <section class="pdp-row breadcrumb-row">
        <nav class="breadcrumb">
          <router-link to="/" class="breadcrumb-link">Trang chủ</router-link>
          <span class="breadcrumb-separator">›</span>
          <template v-if="productDetail.categories && productDetail.categories.length > 0">
            <router-link
              v-for="(cat, idx) in productDetail.categories"
              :key="cat.id"
              :to="`/products?category=${cat.id}`"
              class="breadcrumb-link"
            >
              {{ cat.name }}
            </router-link>
            <span class="breadcrumb-separator">›</span>
          </template>
          <span class="breadcrumb-current">{{ productDetail.tenSanPham }}</span>
        </nav>
      </section>

      <!-- Main Product Info (2 Columns) -->
      <section class="pdp-row product-main-row">
        <div class="product-main-grid">
          <!-- Column 1: Product Gallery (~40% width) -->
          <div class="product-gallery-col">
            <ProductGallery :images="productImages" :product-name="productDetail.tenSanPham" />
            <PromotionCard v-if="productDetail.promotion" :promotion="productDetail.promotion" />
          </div>

          <!-- Column 2: Product Info & Actions (~60% width) -->
          <div class="product-info-col">
            <!-- Product Title -->
            <header class="product-header">
              <h1 class="product-title">{{ productDetail.tenSanPham }}</h1>
            </header>

            <!-- Product Meta Info -->
            <ProductMeta
              :metadata="productMetadata"
              :rating="productDetail.reviewSummary?.averageRating || 0"
            />

            <!-- Price & Stock Section -->
            <PriceSection
              v-if="selectedVariant"
              :current-price="
                selectedVariant.coGiamGia ? selectedVariant.giaGiam : selectedVariant.giaBan
              "
              :original-price="selectedVariant.giaBan"
              :stock="(selectedVariant.soLuongTon || 0) - (selectedVariant.soLuongTamGiu || 0)"
              :is-flash-sale="selectedVariant.coGiamGia"
            />

            <!-- Variant Selector -->
            <div
              class="variant-section"
              v-if="productDetail && productDetail.variants && productDetail.variants.length > 1"
            >
              <VariantQuickSelector
                :variants="productDetail.variants"
                v-model="selectedVariantId"
                @change="handleVariantChange"
              />
            </div>

            <!-- Comparison Button -->
            <div class="comparison-section" v-if="productDetail && comparisonProductData">
              <ProductComparisonButton
                :product="comparisonProductData"
                @toggle="handleToggleComparison"
              />
            </div>

            <!-- Add to Cart Actions -->
            <div class="action-section">
              <AddToCartForm
                :product-id="selectedVariant?.id || selectedVariantId"
                :product-name="productDetail?.tenSanPham || 'Sản phẩm'"
                :max-quantity="
                  (selectedVariant?.soLuongTon || 0) - (selectedVariant?.soLuongTamGiu || 0)
                "
                :disabled="!selectedVariant && !selectedVariantId"
                @add-to-cart="handleAddToCart"
                @buy-now="handleBuyNow"
                @contact="handleContact"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Detailed Info & Specs (Tabs) -->
      <section class="pdp-row detail-row">
        <div class="detail-tabs-wrapper">
          <!-- Tabs Navigation -->
          <div class="tabs-navigation">
            <button
              :class="['tab-nav-btn', { active: activeTab === 'description' }]"
              @click="activeTab = 'description'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="tab-icon">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              <span>Mô tả sản phẩm</span>
            </button>
            <button
              :class="['tab-nav-btn', { active: activeTab === 'specs' }]"
              @click="activeTab = 'specs'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="tab-icon">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
              <span>Thông số kỹ thuật</span>
            </button>
            <button
              :class="['tab-nav-btn', { active: activeTab === 'reviews' }]"
              @click="activeTab = 'reviews'"
             hidden="">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="tab-icon">
                <polygon
                  points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                ></polygon>
              </svg>
              <span>Đánh giá ({{ productDetail.reviewSummary?.totalReviews || 0 }})</span>
            </button>
          </div>

          <!-- Tabs Content Panels -->
          <div class="tabs-content">
            <!-- Tab 1: Product Description -->
            <div v-show="activeTab === 'description'" class="tab-panel">
              <div class="description-content" v-html="productDetail.moTa || 'Chưa có mô tả'"></div>
            </div>

            <!-- Tab 2: Technical Specifications -->
            <div v-show="activeTab === 'specs'" class="tab-panel">
              <SpecsTable :specs="productSpecs" />
            </div>

            <!-- Tab 3: Reviews -->
            <div v-show="activeTab === 'reviews'" class="tab-panel">
              <ReviewSummary
                :summary="{
                  averageRating: productDetail?.averageRating || 0,
                  totalReviews: productDetail?.reviewCount || 0,
                  ratingDistribution: {},
                }"
                @write-review="showReviewForm = true"
              />
              <ReviewList :product-id="productId" @submit-review="handleSubmitReview" />
            </div>
          </div>
        </div>
      </section>

      <!-- Related Products -->
      <section class="pdp-row related-row" v-if="relatedProducts && relatedProducts.length > 0">
        <RelatedProducts :products="relatedProducts" />
      </section>

      <!-- Frequently Bought Together -->
      <section class="pdp-row combo-row">
        <FrequentlyBoughtTogether :product-id="productId" />
      </section>
    </div>

    <!-- Review Form Modal -->
    <ReviewForm
      v-if="showReviewForm"
      :product-id="productId"
      :product-name="productDetail?.tenSanPham || 'Sản phẩm'"
      :variant-id="selectedVariantId"
      @close="showReviewForm = false"
      @submit="handleSubmitReview"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
// SEO will be handled via useHead if available, otherwise via document.title

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
import ReviewForm from '@/components/customer/product-detail/ReviewForm.vue'
import RelatedProducts from '@/components/customer/product-detail/RelatedProducts.vue'
import ProductComparisonButton from '@/components/customer/product-detail/ProductComparisonButton.vue'

// Composables
import { useProductDetail } from '@/composables/product-detail/useProductDetail'
import { useProductReviews } from '@/composables/product-detail/useProductReviews'
// import { useProductComparison } from '@/composables/product-detail/useProductComparison'
import { useProductCart } from '@/composables/product-detail/useProductCart'

const route = useRoute()

// State
const activeTab = ref('description')
const showReviewForm = ref(false)
const productId = computed(() => route.params.id)

// Use composables
const {
  loading,
  error,
  productDetail,
  relatedProducts,
  selectedVariantId,
  selectedVariant,
  productImages,
  productSpecs,
  productMetadata,
  loadProduct,
  loadRelatedProducts,
  handleVariantChange,
} = useProductDetail(productId.value)

const { handleAddToCart, handleBuyNow: originalHandleBuyNow, handleContact } = useProductCart()

// Wrap handleBuyNow để thêm logging
const handleBuyNow = async (data) => {
  console.log('📦 [ProductDetailPage] handleBuyNow received:', data)
  try {
    const result = await originalHandleBuyNow(data)
    console.log('✅ [ProductDetailPage] handleBuyNow completed:', result)
    return result
  } catch (error) {
    console.error('❌ [ProductDetailPage] handleBuyNow error:', error)
    throw error
  }
}
// const { toggleComparison } = useProductComparison()

// Computed product data for comparison (reactive to variant changes)
const comparisonProductData = computed(() => {
  if (!productDetail.value) return null

  return {
    id: productDetail.value.id,
    tenSanPham: productDetail.value.tenSanPham,
    name: productDetail.value.tenSanPham,
    imageUrl: productImages.value[0]?.url,
    image: productImages.value[0]?.url,
    price: selectedVariant.value?.giaBan || productDetail.value.giaBan,
    giaBan: selectedVariant.value?.giaBan || productDetail.value.giaBan,
    variant: selectedVariant.value,
    variants: productDetail.value.variants,
    specs: productSpecs.value,
  }
})

// SEO
const seoTitle = computed(() => {
  if (!productDetail.value) return 'Chi tiết sản phẩm - LaptopStore'
  return `${productDetail.value.tenSanPham} - LaptopStore`
})

const seoDescription = computed(() => {
  if (!productDetail.value) return 'Chi tiết sản phẩm laptop'
  return (
    productDetail.value.moTa?.substring(0, 160) ||
    `Mua ${productDetail.value.tenSanPham} với giá tốt nhất`
  )
})

const seoImage = computed(() => {
  if (!productImages.value || productImages.value.length === 0) return ''
  return productImages.value[0]?.url || ''
})

const canonicalUrl = computed(() => {
  return `${window.location.origin}${route.path}`
})

const structuredData = computed(() => {
  if (!productDetail.value || !selectedVariant.value) return {}

  return {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: productDetail.value.tenSanPham,
    description: productDetail.value.moTa,
    image: productImages.value.map((img) => img.url),
    brand: {
      '@type': 'Brand',
      name: 'LaptopStore',
    },
    offers: {
      '@type': 'Offer',
      price: selectedVariant.value.giaGiam || selectedVariant.value.giaBan,
      priceCurrency: 'VND',
      availability:
        selectedVariant.value.soLuongTon > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    aggregateRating: productDetail.value.reviewSummary
      ? {
          '@type': 'AggregateRating',
          ratingValue: productDetail.value.reviewSummary.averageRating,
          reviewCount: productDetail.value.reviewSummary.totalReviews,
        }
      : undefined,
  }
})

// Update document title and meta tags for SEO
watch(
  seoTitle,
  (newTitle) => {
    if (newTitle) {
      document.title = newTitle
    }
  },
  { immediate: true },
)

// Update meta tags
watch([seoTitle, seoDescription, seoImage], () => {
  updateMetaTags()
})

// Inject structured data JSON-LD
watch(
  structuredData,
  (data) => {
    if (data && Object.keys(data).length > 0) {
      injectStructuredData(data)
    }
  },
  { deep: true },
)

// Function to update meta tags
const updateMetaTags = () => {
  // Update description
  let metaDesc = document.querySelector('meta[name="description"]')
  if (!metaDesc) {
    metaDesc = document.createElement('meta')
    metaDesc.setAttribute('name', 'description')
    document.head.appendChild(metaDesc)
  }
  metaDesc.setAttribute('content', seoDescription.value)

  // Update Open Graph tags
  const ogTags = {
    'og:title': seoTitle.value,
    'og:description': seoDescription.value,
    'og:image': seoImage.value,
    'og:type': 'product',
    'og:url': canonicalUrl.value,
  }

  Object.entries(ogTags).forEach(([property, content]) => {
    let tag = document.querySelector(`meta[property="${property}"]`)
    if (!tag) {
      tag = document.createElement('meta')
      tag.setAttribute('property', property)
      document.head.appendChild(tag)
    }
    tag.setAttribute('content', content)
  })

  // Update Twitter Card
  let twitterCard = document.querySelector('meta[name="twitter:card"]')
  if (!twitterCard) {
    twitterCard = document.createElement('meta')
    twitterCard.setAttribute('name', 'twitter:card')
    document.head.appendChild(twitterCard)
  }
  twitterCard.setAttribute('content', 'summary_large_image')

  // Update canonical URL
  let canonical = document.querySelector('link[rel="canonical"]')
  if (!canonical) {
    canonical = document.createElement('link')
    canonical.setAttribute('rel', 'canonical')
    document.head.appendChild(canonical)
  }
  canonical.setAttribute('href', canonicalUrl.value)
}

// Function to inject structured data JSON-LD
const injectStructuredData = (data) => {
  // Remove existing structured data script
  const existingScript = document.querySelector(
    'script[type="application/ld+json"][data-product-detail]',
  )
  if (existingScript) {
    existingScript.remove()
  }

  // Create new script tag
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.setAttribute('data-product-detail', 'true')
  script.textContent = JSON.stringify(data)
  document.head.appendChild(script)
}

// Cleanup on unmount
onUnmounted(() => {
  const script = document.querySelector('script[type="application/ld+json"][data-product-detail]')
  if (script) {
    script.remove()
  }
})

// Methods
const handleToggleComparison = (product) => {
  // Logic is handled in ProductComparisonButton component
  // We just listen to the event if needed
  console.log('Comparison toggled for:', product?.id)
}

const handleSubmitReview = async (reviewData) => {
  showReviewForm.value = false
  // Review sẽ được submit qua ReviewList component
}

// Watch route changes
watch(
  () => route.params.id,
  (newId) => {
    if (newId) {
      loadProduct(newId)
    }
  },
)

// Initial load
onMounted(() => {
  if (productId.value) {
    loadProduct(productId.value)
  }
})
</script>

<style scoped src="./ProductDetailPage.css"></style>
