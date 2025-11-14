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

                        <!-- Promotion Section (moved here) -->
                        <div class="promotion-section" style="margin-top: 2rem;">
                            <div class="promotion-header">
                                <svg viewBox="0 0 24 24" fill="currentColor" class="promotion-icon">
                                    <path
                                        d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 0 0-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
                                </svg>
                                <div>
                                    <div class="promotion-title">Khuyến mãi & Quà tặng</div>
                                    <div class="promotion-subtitle">Áp dụng khi mua sản phẩm này</div>
                                </div>
                            </div>
                            <ul class="promotion-list">
                                <li>
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Tặng Windows bản quyền trị giá 3.000.000đ
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Miễn phí cân màu màn hình chuyên nghiệp
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Tặng balo cao cấp + Chuột không dây
                                </li>
                                <li>
                                    <svg viewBox="0 0 24 24" fill="currentColor" class="check-icon">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                                    </svg>
                                    Voucher 500.000đ cho lần mua tiếp theo
                                </li>
                            </ul>
                        </div>
                    </div>

                    <!-- Column 2: Product Info & Actions (~60% width) -->
                    <div class="product-info-col">
                        <!-- 1. Product Title (H1) -->
                        <header class="product-header">
                            <h1 class="product-title">{{ product.name }}</h1>
                        </header>

                        <!-- 2. Product Meta Info -->
                        <div class="product-meta">
                            <div class="meta-row">
                                <span class="meta-label">Mã SP:</span>
                                <span class="meta-value meta-code">{{ productMetadata.code }}</span>
                            </div>
                            <div class="meta-row">
                                <span class="meta-label">Đánh giá:</span>
                                <div class="meta-value meta-rating">
                                    <span v-for="i in 5" :key="i" class="star-icon" :class="{ filled: i <= 5 }">★</span>
                                    <span class="rating-text">| Bình luận: {{ productMetadata.reviewCount }}</span>
                                </div>
                            </div>
                            <div class="meta-row">
                                <span class="meta-label">Lượt xem:</span>
                                <span class="meta-value">{{ productMetadata.views }}</span>
                            </div>
                        </div>

                        <!-- specs-summary removed per request -->

                        <!-- 4. Price Section -->
                        <div v-if="selectedVariant" class="price-section">
                            <div class="price-label">Giá khuyến mãi:</div>
                            <div class="price-display">
                                <span class="price-current">{{ formatPrice(selectedVariant.price) }}</span>
                                <del v-if="selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price"
                                    class="price-old">{{ formatPrice(selectedVariant.originalPrice) }}</del>
                            </div>
                            <div v-if="selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price"
                                class="price-save">
                                <span class="save-icon">⬇</span>
                                Tiết kiệm: {{ formatPrice(selectedVariant.originalPrice - selectedVariant.price) }}
                            </div>
                        </div>

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
                    <div class="detail-main-col" ref="specsSectionRef">
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

                                <!-- Tab 2: Technical Specifications (Table) -->
                                <div v-show="activeTab === 'specs'" class="tab-panel">
                                    <div class="specs-table-wrapper">
                                        <table class="specs-table">
                                            <tbody>
                                                <tr v-for="spec in productSpecs" :key="spec.key">
                                                    <td class="spec-label-cell">{{ spec.label }}</td>
                                                    <td class="spec-value-cell">
                                                        {{ spec.value }}
                                                        <span v-if="spec.hex" class="color-dot"
                                                            :style="{ backgroundColor: spec.hex }"
                                                            :title="`Màu: ${spec.value}`"></span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <!-- Tab 3: Reviews (Placeholder) -->
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
                        <!-- Similar Products Widget -->
                        <div class="sidebar-widget">
                            <h3 class="widget-title">Sản phẩm tương tự</h3>
                            <ul class="widget-list">
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Laptop Asus Vivobook 15 OLED A1505</a>
                                </li>
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Laptop HP Pavilion 14 2024</a>
                                </li>
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Laptop Dell Inspiron 14 Plus</a>
                                </li>
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Laptop MSI Modern 15 B13M</a>
                                </li>
                            </ul>
                            <button class="widget-btn">Xem tất cả →</button>
                        </div>

                        <!-- Related News Widget -->
                        <div class="sidebar-widget">
                            <h3 class="widget-title">Tin tức liên quan</h3>
                            <ul class="widget-list">
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Top 5 laptop học tập đáng mua 2024</a>
                                </li>
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Hướng dẫn tối ưu hiệu năng Windows 11</a>
                                </li>
                                <li class="widget-list-item">
                                    <a href="#" class="widget-link">Kinh nghiệm chọn laptop đồ họa</a>
                                </li>
                            </ul>
                            <button class="widget-btn">Đọc thêm →</button>
                        </div>
                    </aside>
                </div>
            </section>

            <!-- ============================================ -->
            <!-- ROW 4: REVIEWS & RATINGS (2 COLUMNS) -->
            <!-- ============================================ -->
            <section class="pdp-row reviews-row">
                <div class="reviews-grid">
                    <!-- Column 1: Review Summary (~40% width) -->
                    <div class="review-summary-col">
                        <div class="review-summary-card">
                            <h3 class="summary-heading">Tóm tắt đánh giá</h3>
                            <div class="rating-overview">
                                <div class="rating-score">
                                    <div class="score-number">4.5</div>
                                    <div class="score-stars">
                                        <span v-for="i in 5" :key="`star-${i}`"
                                            :class="['star', i <= 4.5 ? 'filled' : '']">★</span>
                                    </div>
                                    <div class="score-text">Dựa trên 128 đánh giá</div>
                                </div>
                            </div>

                            <!-- Rating Distribution Bars -->
                            <div class="rating-bars">
                                <div v-for="item in reviewBreakdown" :key="item.stars" class="rating-bar-item">
                                    <span class="bar-label">{{ item.stars }} sao</span>
                                    <div class="bar-track">
                                        <div class="bar-fill" :style="{ width: item.percent + '%' }"></div>
                                    </div>
                                    <span class="bar-percent">{{ item.percent }}%</span>
                                </div>
                            </div>

                            <button class="submit-review-btn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                                Gửi đánh giá của bạn
                            </button>
                        </div>
                    </div>

                    <!-- Column 2: Review List (~60% width) -->
                    <div class="review-list-col">
                        <div class="review-list-card">
                            <div class="review-list-header">
                                <h3 class="list-heading">Danh sách bình luận</h3>
                                <div class="filter-tabs">
                                    <button v-for="filter in reviewFilters" :key="filter" class="filter-tab" disabled>
                                        {{ filter }}
                                    </button>
                                </div>
                            </div>

                            <div class="review-list-body">
                                <!-- Empty State for Reviews -->
                                <div class="empty-reviews-state">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon">
                                        <path
                                            d="M12 20c4.418 0 8-3.134 8-7 0-1.42-.4-2.75-1.098-3.877L22 4l-4.5 1.315C16.104 4.483 14.118 4 12 4 7.582 4 4 7.134 4 11s3.582 7 8 7z" />
                                    </svg>
                                    <p class="empty-text">Chưa có đánh giá nào.</p>
                                    <p class="empty-subtext">Hãy là người đầu tiên đánh giá sản phẩm này!</p>
                                </div>

                                <!-- Placeholder for future review items -->
                                <!--
                                <div class="review-item">
                                    <div class="review-avatar">User Avatar</div>
                                    <div class="review-content">
                                        <div class="review-author">Tên người dùng</div>
                                        <div class="review-rating">5 sao</div>
                                        <div class="review-text">Nội dung đánh giá...</div>
                                        <div class="review-date">1 ngày trước</div>
                                    </div>
                                </div>
                                -->
                            </div>

                            <!-- Review Input Area (Future feature) -->
                            <div class="review-input-area" style="display: none;">
                                <textarea class="review-textarea" placeholder="Nhập bình luận của bạn..."></textarea>
                                <button class="post-review-btn">Gửi bình luận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGallery from '@/components/customer/san_pham/ProductGallery.vue'
import VariantQuickSelector from '@/components/customer/san_pham/VariantQuickSelector.vue'
import AddToCartForm from '@/components/customer/san_pham/AddToCartForm.vue'
import { sanPhamService } from '@/service/customer/san_pham_service'
import cartService from '@/service/customer/cartService'

const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const error = ref(null)
const product = ref(null)
const variants = ref([])
const selectedVariantId = ref(null)
const activeTab = ref('specs')
const productImagesMap = ref({}) // Map ctspId -> images array
const specsSectionRef = ref(null)
const reviewFilters = ['Tất cả', '5 sao', '4 sao', '3 sao', '2 sao', '1 sao']
const defaultDescription = 'Thông tin chi tiết sản phẩm đang được cập nhật. Vui lòng liên hệ với chúng tôi để biết thêm chi tiết.'

// Current selected variant
const selectedVariant = computed(() => {
    return formattedVariants.value.find((v) => v.id === selectedVariantId.value) || null
})

// Format variants cho VariantSelector component
const formattedVariants = computed(() => {
    return variants.value.map((v) => {
        // Get correct ID field
        const variantId = v.idctsp || v.id || v.idCTSP

        return {
            id: variantId,
            attributes: {
                cpu: v.tenCpu,
                gpu: v.tenGpu,
                ram: v.tenRam,
                dungLuongOCung: v.dungLuongOCung,
            },
            price: v.giaSauGiam || v.giaBan,
            originalPrice: v.giaTruocGiam || v.giaBan,
            stock: v.soLuongTon || v.soLuong || 0,
            summary: [v.tenCpu, v.tenGpu, v.tenRam, v.dungLuongOCung].filter(Boolean).join(' | '),
            ...v, // Keep all original data
        }
    })
})

// Product images for selected variant
const productImages = computed(() => {
    if (!selectedVariantId.value) return []

    // Get images for selected variant from map
    const images = productImagesMap.value[selectedVariantId.value] || []

    // If no images, return placeholder
    if (images.length === 0) {
        return [
            {
                url: 'https://laptopaz.vn/media/product/3789_46549_ap7.jpg',
                alt: product.value?.name || 'Sản phẩm',
            },
        ]
    }

    return images.map((img, index) => ({
        url: img.url || img.duongDanHinhAnh,
        alt: `${product.value?.name || 'Sản phẩm'} - Ảnh ${index + 1}`,
    }))
})

// Product specifications
const productSpecs = computed(() => {
    if (!selectedVariant.value) return []

    const v = selectedVariant.value
    return [
        { key: 'name', label: 'Tên sản phẩm', value: v.tenSp },
        { key: 'cpu', label: 'CPU', value: withDesc(v.tenCpu, v.moTaCpu) },
        { key: 'gpu', label: 'GPU', value: withDesc(v.tenGpu, v.moTaGpu) },
        { key: 'ram', label: 'RAM', value: withDesc(v.tenRam, v.moTaRam) },
        { key: 'storage', label: 'Ổ cứng', value: withDesc(v.dungLuongOCung, v.moTaOCung) },
        { key: 'screen', label: 'Màn hình', value: withDesc(v.kichThuocManHinh, v.moTaManHinh) },
        { key: 'battery', label: 'Pin', value: withDesc(v.dungLuongPin, v.moTaPin) },
        { key: 'color', label: 'Màu sắc', value: v.tenMauSac, hex: v.hexCodeMauSac },
        { key: 'weight', label: 'Trọng lượng', value: v.trongLuong },
    ].filter((s) => s.value)
})

// highlightSpecs removed — UI no longer displays the compact specs list

const productMetadata = computed(() => {
    const variant = selectedVariant.value
    return {
        code: variant?.maSp || variant?.sku || variant?.model || variant?.id || product.value?.id || 'Đang cập nhật',
        rating: '5.0',
        reviewCount: '128',
        views: variant?.luotXem || variant?.viewCount || '1.2K',
    }
})

const reviewBreakdown = computed(() => [
    { stars: 5, percent: 68 },
    { stars: 4, percent: 20 },
    { stars: 3, percent: 7 },
    { stars: 2, percent: 3 },
    { stars: 1, percent: 2 },
])

// Methods
const loadProduct = async () => {
    const productId = route.params.id
    if (!productId) {
        error.value = 'Không tìm thấy ID sản phẩm'
        return
    }

    loading.value = true
    error.value = null

    try {
        // Fetch variants - use correct API endpoint
        const response = await sanPhamService.getProductDetails(productId)
        variants.value = response.data || []

        if (variants.value.length === 0) {
            throw new Error('Sản phẩm không có phiên bản nào')
        }

        console.log('✅ Loaded variants:', variants.value)
        console.log('✅ First variant keys:', Object.keys(variants.value[0]))

        // Set product info from first variant
        const firstVariant = variants.value[0]
        product.value = {
            id: productId,
            name: firstVariant.tenSp || firstVariant.tenSanPham,
            description: firstVariant.moTaSp || firstVariant.moTa || '',
        }

        // Auto select first variant - check which ID field exists
        selectedVariantId.value = firstVariant.idctsp || firstVariant.id || firstVariant.idCTSP

        // Load images for all variants
        await loadAllVariantImages()
    } catch (err) {
        console.error('Error loading product:', err)
        error.value = err.response?.data?.message || err.message || 'Không thể tải sản phẩm'
    } finally {
        loading.value = false
    }
}

const loadAllVariantImages = async () => {
    // Load images for all variants in parallel
    const imagePromises = variants.value.map(async (variant) => {
        try {
            // Get the correct ID field
            const variantId = variant.idctsp || variant.id || variant.idCTSP

            if (!variantId) {
                console.warn('⚠️ Variant missing ID:', variant)
                return
            }

            const response = await sanPhamService.getImagesByProductDetailId(variantId)
            productImagesMap.value[variantId] = response.data || []
        } catch (err) {
            const variantId = variant.idctsp || variant.id || variant.idCTSP
            console.error(`Error loading images for variant ${variantId}:`, err)
            productImagesMap.value[variantId] = []
        }
    })

    await Promise.all(imagePromises)
}

const handleVariantChange = (variant) => {
    console.log('✅ Variant changed:', variant)
    // selectedVariantId is already updated by v-model
}

const handleAddToCart = async ({ productId, productName, quantity }) => {
    try {
        const khachHangId = localStorage.getItem('userId')

        if (!khachHangId) {
            alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng')
            router.push('/login')
            return
        }

        console.log('🛒 Adding to cart:', { productId, quantity, khachHangId })

        await cartService.addToCart(khachHangId, {
            ctspId: productId,
            quantity: quantity,
        })

        // Show success toast (you can use a toast library here)
        alert(`✅ Đã thêm "${productName}" vào giỏ hàng!`)

        // TODO: Update cart count in header
    } catch (err) {
        console.error('Error adding to cart:', err)
        alert(err.response?.data?.message || 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
    }
}

const handleBuyNow = async ({ productId, productName, quantity }) => {
    try {
        // Add to cart first
        await handleAddToCart({ productId, productName, quantity })

        // Navigate to cart/checkout
        router.push('/cart')
    } catch (err) {
        console.error('Error buy now:', err)
    }
}

// scrollToSpecs removed because the compact specs UI was deleted

// Utility functions
const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(price)
}

const calculateDiscount = (original, current) => {
    if (!original || !current || current >= original) return 0
    return Math.round(((original - current) / original) * 100)
}

const withDesc = (name, desc) => {
    const n = name?.toString().trim()
    const d = desc?.toString().trim()
    if (n && d) return `${n} (${d})`
    return n || d || ''
}

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

<style scoped>
/* ========================================== */
/* DESIGN SYSTEM - E-COMMERCE STANDARD */
/* ========================================== */
:root {
    --pdp-primary: #000000;
    --pdp-secondary: #86868b;
    --pdp-accent: #0071e3;
    --pdp-success: #34c759;
    --pdp-error: #ff3b30;
    --pdp-warning: #ff9500;
    --pdp-bg: #ffffff;
    --pdp-bg-secondary: #f5f5f7;
    --pdp-border: #d2d2d7;
    --pdp-shadow: rgba(0, 0, 0, 0.08);
    --pdp-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ========================================== */
/* BASE CONTAINER */
/* ========================================== */
.pdp-page {
    min-height: 100vh;
    background: var(--pdp-bg-secondary);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.pdp-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem; /* reduced horizontal padding for tighter layout */
}

/* ========================================== */
/* LOADING & ERROR STATES */
/* ========================================== */
.pdp-state {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    text-align: center;
}

.loading-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--pdp-border);
    border-top-color: var(--pdp-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.state-icon svg {
    width: 64px;
    height: 64px;
    stroke: var(--pdp-error);
    stroke-width: 2px;
}

.state-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--pdp-primary);
    margin: 0;
}

.state-text {
    font-size: 1rem;
    color: var(--pdp-secondary);
    margin: 0;
}

.primary-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 2rem;
    background: var(--pdp-accent);
    color: white;
    border: none;
    border-radius: 980px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--pdp-transition);
}

.primary-button:hover {
    background: #0077ed;
    transform: translateY(-2px);
}

.primary-button svg {
    width: 20px;
    height: 20px;
}

/* ========================================== */
/* ROW STRUCTURE */
/* ========================================== */
.pdp-row {
    margin-bottom: 1.5rem; /* reduced vertical spacing between rows */
}

/* ========================================== */
/* ROW 1: BREADCRUMB */
/* ========================================== */
.breadcrumb-row {
    padding: 1.5rem 0;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    flex-wrap: wrap;
}

.breadcrumb-link {
    color: var(--pdp-accent);
    text-decoration: none;
    transition: var(--pdp-transition);
}

.breadcrumb-link:hover {
    text-decoration: underline;
}

.breadcrumb-separator {
    color: var(--pdp-secondary);
}

.breadcrumb-current {
    color: var(--pdp-secondary);
}

/* ========================================== */
/* ROW 2: MAIN PRODUCT INFO (2 COLUMNS) */
/* ========================================== */
.product-main-row {
    margin-bottom: 4rem;
}

.product-main-grid {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 1.5rem; /* tighter gap */
    background: var(--pdp-bg);
    border-radius: 12px;
    padding: 1.25rem; /* reduced padding */
    box-shadow: 0 2px 12px var(--pdp-shadow);
}

/* Column 1: Gallery */
.product-gallery-col {
    position: sticky;
    top: 2rem;
    height: fit-content;
}

/* Column 2: Product Info */
.product-info-col {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Product Header */
.product-header {
    border-bottom: 1px solid var(--pdp-border);
    padding-bottom: 1.5rem;
}

.product-title {
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 1rem 0;
    letter-spacing: -0.03em;
    color: var(--pdp-primary);
}

/* Product Meta */
.product-meta {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem 0;
    border-bottom: 1px solid var(--pdp-border);
}

.meta-row {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.meta-label {
    font-size: 0.875rem;
    color: var(--pdp-secondary);
    font-weight: 500;
    min-width: 80px;
}

.meta-value {
    font-size: 0.875rem;
    color: var(--pdp-primary);
    font-weight: 600;
}

.meta-code {
    color: var(--pdp-accent);
}

.meta-rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.star-icon {
    font-size: 1rem;
    color: var(--pdp-border);
}

.star-icon.filled {
    color: var(--pdp-warning);
}

.rating-text {
    color: var(--pdp-secondary);
    font-weight: 400;
}

/* Specs Summary Box */
.specs-summary-box {
    background: var(--pdp-bg-secondary);
    border: 1px solid var(--pdp-border);
    border-radius: 12px;
    padding: 0.75rem; /* reduced */
}

.specs-title {
    font-size: 1rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: var(--pdp-primary);
}

.specs-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
}

.spec-item {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    font-size: 0.875rem;
    line-height: 1.5;
}

.spec-dash {
    color: var(--pdp-secondary);
    flex-shrink: 0;
}

.spec-label {
    color: var(--pdp-secondary);
    font-weight: 500;
}

.spec-value {
    color: var(--pdp-primary);
    font-weight: 600;
}

.specs-expand-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.625rem;
    background: transparent;
    border: 1px solid var(--pdp-border);
    border-radius: 6px;
    color: var(--pdp-accent);
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: var(--pdp-transition);
}

.specs-expand-btn:hover {
    background: var(--pdp-bg);
    border-color: var(--pdp-accent);
}

.chevron-icon {
    width: 16px;
    height: 16px;
}

/* Price Section */
.price-section {
    background: var(--pdp-bg);
    border: 2px solid var(--pdp-error);
    border-radius: 12px;
    padding: 0.75rem; /* reduced */
}

.price-label {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--pdp-primary);
    margin-bottom: 0.75rem;
}

.price-display {
    display: flex;
    align-items: baseline;
    gap: 1rem;
    margin-bottom: 0.5rem;
}

.price-current {
    font-size: 2rem;
    font-weight: 700;
    color: var(--pdp-error);
    letter-spacing: -0.02em;
    line-height: 1;
}

.price-old {
    font-size: 1rem;
    color: var(--pdp-secondary);
    text-decoration: line-through;
    font-weight: 400;
}

.price-save {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.875rem;
    color: var(--pdp-error);
    font-weight: 600;
}

.save-icon {
    font-size: 1rem;
}

/* Promotion Section */
.promotion-section {
    background: #fff9e6;
    border: 2px solid #ffd700;
    border-radius: 16px;
    padding: 0.75rem; /* reduced */
}

.promotion-header {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.25rem;
    align-items: flex-start;
}

.promotion-icon {
    width: 32px;
    height: 32px;
    fill: var(--pdp-warning);
    flex-shrink: 0;
}

.promotion-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--pdp-primary);
    margin: 0 0 0.25rem 0;
}

.promotion-subtitle {
    font-size: 0.875rem;
    color: var(--pdp-secondary);
    margin: 0;
}

.promotion-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.promotion-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    font-size: 0.9375rem;
    line-height: 1.5;
}

.check-icon {
    width: 20px;
    height: 20px;
    fill: var(--pdp-success);
    flex-shrink: 0;
    margin-top: 2px;
}

/* Variant & Action Sections */
.variant-section {
    padding: 0;
}

.action-section {
    padding: 0;
}

/* ========================================== */
/* ROW 3: DETAIL TABS & SIDEBAR (2 COLUMNS) */
/* ========================================== */
.detail-row {
    margin-bottom: 4rem;
}

.detail-grid {
    display: grid;
    grid-template-columns: 70% 30%;
    gap: 2rem;
}

/* Column 1: Tabs */
.detail-main-col {
    background: var(--pdp-bg);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 2px 12px var(--pdp-shadow);
}

.detail-tabs-wrapper {
    position: relative;
}

.tabs-navigation {
    display: flex;
    border-bottom: 1px solid var(--pdp-border);
    background: var(--pdp-bg-secondary);
}

.tab-nav-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1.25rem 1.5rem;
    background: none;
    border: none;
    color: var(--pdp-secondary);
    font-weight: 600;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: var(--pdp-transition);
    position: relative;
}

.tab-nav-btn:hover {
    background: rgba(0, 113, 227, 0.05);
    color: var(--pdp-accent);
}

.tab-nav-btn.active {
    color: var(--pdp-accent);
    background: var(--pdp-bg);
}

.tab-nav-btn.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--pdp-accent);
}

.tab-icon {
    width: 20px;
    height: 20px;
    stroke-width: 2px;
}

.tabs-content {
    padding: 1rem; /* reduced */
}

.tab-panel {
    animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Description Tab */
.description-content {
    font-size: 1rem;
    line-height: 1.8;
    color: var(--pdp-primary);
}

.description-content p {
    margin-bottom: 1.5rem;
}

/* Specs Table */
.specs-table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.specs-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid var(--pdp-border);
    border-radius: 12px;
    overflow: hidden;
}

.specs-table tr:nth-child(even) {
    background: var(--pdp-bg-secondary);
}

.spec-label-cell {
    padding: 0.5rem 0.75rem; /* reduced */
    font-weight: 600;
    color: var(--pdp-secondary);
    width: 30%;
    border-right: 1px solid var(--pdp-border);
}

.spec-value-cell {
    padding: 0.5rem 0.75rem; /* reduced */
    color: var(--pdp-primary);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

/* Empty Placeholder */
.empty-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem 1rem; /* reduced */
    text-align: center;
}

.placeholder-icon {
    width: 64px;
    height: 64px;
    stroke: var(--pdp-secondary);
    stroke-width: 2px;
}

.placeholder-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--pdp-secondary);
    margin: 0;
}

/* Column 2: Sidebar */
.detail-sidebar-col {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.sidebar-widget {
    background: var(--pdp-bg);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px var(--pdp-shadow);
}

.widget-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: var(--pdp-primary);
}

.widget-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.widget-list-item {
    line-height: 1.5;
}

.widget-link {
    color: var(--pdp-primary);
    text-decoration: none;
    font-size: 0.9375rem;
    line-height: 1.5;
    transition: var(--pdp-transition);
    display: block;
}

.widget-link:hover {
    color: var(--pdp-accent);
    padding-left: 0.5rem;
}

.widget-btn {
    width: 100%;
    padding: 0.75rem;
    background: var(--pdp-bg-secondary);
    border: 1px solid var(--pdp-border);
    border-radius: 8px;
    color: var(--pdp-accent);
    font-weight: 600;
    cursor: pointer;
    transition: var(--pdp-transition);
}

.widget-btn:hover {
    background: var(--pdp-accent);
    color: white;
    border-color: var(--pdp-accent);
}

/* ========================================== */
/* ROW 4: REVIEWS (2 COLUMNS) */
/* ========================================== */
.reviews-row {
    margin-bottom: 4rem;
}

.reviews-grid {
    display: grid;
    grid-template-columns: 40% 60%;
    gap: 2rem;
}

/* Column 1: Review Summary */
.review-summary-col {
    height: fit-content;
}

.review-summary-card {
    background: var(--pdp-bg);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 2px 12px var(--pdp-shadow);
}

.summary-heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 2rem 0;
}

.rating-overview {
    text-align: center;
    margin-bottom: 2rem;
}

.rating-score {
    margin-bottom: 1.5rem;
}

.score-number {
    font-size: 4rem;
    font-weight: 700;
    line-height: 1;
    color: var(--pdp-primary);
    margin-bottom: 0.5rem;
}

.score-stars {
    display: flex;
    justify-content: center;
    gap: 0.25rem;
    margin-bottom: 0.5rem;
}

.star {
    font-size: 1.5rem;
    color: var(--pdp-border);
}

.star.filled {
    color: var(--pdp-warning);
}

.score-text {
    font-size: 0.875rem;
    color: var(--pdp-secondary);
}

.rating-bars {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
}

.rating-bar-item {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.bar-label {
    font-size: 0.875rem;
    color: var(--pdp-secondary);
    width: 50px;
    flex-shrink: 0;
}

.bar-track {
    flex: 1;
    height: 8px;
    background: var(--pdp-border);
    border-radius: 4px;
    overflow: hidden;
}

.bar-fill {
    height: 100%;
    background: var(--pdp-warning);
    transition: width 0.6s ease;
}

.bar-percent {
    font-size: 0.875rem;
    color: var(--pdp-secondary);
    width: 40px;
    text-align: right;
    flex-shrink: 0;
}

.submit-review-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 1rem;
    background: var(--pdp-accent);
    color: white;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: var(--pdp-transition);
}

.submit-review-btn:hover {
    background: #0077ed;
    transform: translateY(-2px);
}

.btn-icon {
    width: 20px;
    height: 20px;
    stroke-width: 2px;
}

/* Column 2: Review List */
.review-list-col {
    min-height: 400px;
}

.review-list-card {
    background: var(--pdp-bg);
    border-radius: 20px;
    padding: 2.5rem;
    box-shadow: 0 2px 12px var(--pdp-shadow);
}

.review-list-header {
    margin-bottom: 2rem;
}

.list-heading {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
}

.filter-tabs {
    display: flex;
    gap: 0.625rem;
    flex-wrap: wrap;
}

.filter-tab {
    padding: 0.5rem 1rem;
    background: var(--pdp-bg-secondary);
    border: 1px solid var(--pdp-border);
    border-radius: 980px;
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--pdp-secondary);
    cursor: pointer;
    transition: var(--pdp-transition);
}

.filter-tab:not(:disabled):hover {
    background: var(--pdp-accent);
    color: white;
    border-color: var(--pdp-accent);
}

.filter-tab:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.review-list-body {
    min-height: 300px;
}

.empty-reviews-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 4rem 2rem;
    text-align: center;
}

.empty-icon {
    width: 64px;
    height: 64px;
    stroke: var(--pdp-secondary);
    stroke-width: 2px;
}

.empty-text {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--pdp-secondary);
    margin: 0;
}

.empty-subtext {
    font-size: 0.9375rem;
    color: var(--pdp-secondary);
    margin: 0;
}

/* ========================================== */
/* RESPONSIVE DESIGN */
/* ========================================== */
@media (max-width: 1024px) {
    .product-main-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .product-gallery-col {
        position: static;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .reviews-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .pdp-content {
        padding: 0 1rem;
    }

    .product-main-grid {
        padding: 2rem 1.5rem;
        gap: 2rem;
    }

    .product-title {
        font-size: 2rem;
    }

    .price-main {
        font-size: 2.25rem;
    }

    .config-summary-grid {
        grid-template-columns: 1fr;
    }

    .tabs-navigation {
        flex-direction: column;
    }

    .tab-nav-btn.active::after {
        left: 0;
        right: auto;
        width: 4px;
        height: 100%;
        top: 0;
        bottom: 0;
    }

    .tabs-content {
        padding: 1.5rem;
    }

    .score-number {
        font-size: 3rem;
    }
}

@media (max-width: 480px) {
    .product-title {
        font-size: 1.5rem;
    }

    .price-main {
        font-size: 1.875rem;
    }

    .breadcrumb {
        font-size: 0.8125rem;
    }
}
</style>
--pdp-border: #d2d2d7;
--pdp-shadow: rgba(0, 0, 0, 0.08);
--pdp-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* ===== CONTAINER & LAYOUT ===== */
.pdp-container {
min-height: 100vh;
background: var(--pdp-bg-secondary);
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
color: var(--pdp-primary);
line-height: 1.6;
}

/* ===== LOADING STATE ===== */
.loading-state {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 60vh;
gap: 1.5rem;
}

.loading-spinner {
width: 48px;
height: 48px;
border: 3px solid var(--pdp-bg-secondary);
border-top-color: var(--pdp-accent);
border-radius: 50%;
animation: spin 0.8s linear infinite;
}

@keyframes spin {
to {
transform: rotate(360deg);
}
}

.loading-text {
font-size: 1rem;
color: var(--pdp-secondary);
font-weight: 500;
}

/* ===== ERROR STATE ===== */
.error-state {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
min-height: 60vh;
gap: 1.5rem;
padding: 2rem;
text-align: center;
}

.error-icon {
width: 80px;
height: 80px;
color: var(--pdp-error);
}

.error-icon svg {
width: 100%;
height: 100%;
stroke-width: 1.5;
}

.error-title {
font-size: 1.75rem;
font-weight: 700;
color: var(--pdp-primary);
margin: 0;
}

.error-message {
font-size: 1.125rem;
color: var(--pdp-secondary);
margin: 0;
max-width: 500px;
}

.retry-button {
display: inline-flex;
align-items: center;
gap: 0.5rem;
padding: 0.875rem 2rem;
background: var(--pdp-primary);
color: white;
border: none;
border-radius: 980px;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
transition: var(--pdp-transition);
margin-top: 1rem;
}

.retry-button svg {
width: 20px;
height: 20px;
stroke-width: 2;
}

.retry-button:hover {
background: #1d1d1f;
transform: translateY(-2px);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

/* ===== BREADCRUMB ===== */
.pdp-content {
max-width: 1440px;
margin: 0 auto;
padding: 0 1.5rem;
}

.breadcrumb {
display: flex;
align-items: center;
gap: 0.5rem;
padding: 1.5rem 0;
font-size: 0.875rem;
font-weight: 500;
}

.breadcrumb-link {
color: var(--pdp-accent);
text-decoration: none;
transition: var(--pdp-transition);
}

.breadcrumb-link:hover {
color: #0077ed;
text-decoration: underline;
}

.breadcrumb-separator {
color: var(--pdp-secondary);
user-select: none;
}

.breadcrumb-current {
color: var(--pdp-secondary);
}

/* ===== MAIN PRODUCT SECTION ===== */
.product-wrapper {
display: grid;
grid-template-columns: 45% 55%;
gap: 4rem;
background: var(--pdp-bg);
border-radius: 18px;
padding: 3rem;
margin-bottom: 2rem;
box-shadow: 0 2px 16px var(--pdp-shadow);
}

.gallery-section {
position: sticky;
top: 2rem;
align-self: start;
}

.info-section {
display: flex;
flex-direction: column;
gap: 2rem;
}

/* ===== PRODUCT HEADER ===== */
.product-header {
padding-bottom: 1.5rem;
}

.product-title {
font-size: 2.5rem;
font-weight: 700;
line-height: 1.2;
letter-spacing: -0.02em;
color: var(--pdp-primary);
margin: 0 0 1rem 0;
}

.product-meta {
display: flex;
align-items: center;
gap: 1.5rem;
}

.rating-badge {
display: inline-flex;
align-items: center;
gap: 0.5rem;
padding: 0.5rem 1rem;
background: var(--pdp-bg-secondary);
border-radius: 980px;
font-size: 0.875rem;
}

.stars-display {
display: flex;
gap: 2px;
}

.star {
font-size: 1rem;
line-height: 1;
}

.star.filled {
color: #ff9500;
}

.rating-score {
font-weight: 700;
color: var(--pdp-primary);
}

.rating-divider {
color: var(--pdp-border);
}

.rating-count {
color: var(--pdp-secondary);
}

/* ===== PRICE SECTION ===== */
.price-block {
padding: 1.75rem 0;
}

.price-main {
font-size: 2.75rem;
font-weight: 700;
color: var(--pdp-primary);
line-height: 1;
letter-spacing: -0.03em;
margin-bottom: 0.75rem;
}

.price-compare {
display: flex;
align-items: center;
gap: 1rem;
}

.price-old {
font-size: 1.25rem;
color: var(--pdp-secondary);
font-weight: 500;
}

.price-save {
display: inline-flex;
padding: 0.375rem 0.875rem;
background: linear-gradient(135deg, #ff3b30, #ff6b58);
color: white;
border-radius: 6px;
font-size: 0.875rem;
font-weight: 600;
}

/* ===== STOCK STATUS ===== */
.stock-status {
padding: 1rem 0;
}

.stock-available,
.stock-out {
display: inline-flex;
align-items: center;
gap: 0.5rem;
padding: 0.625rem 1.125rem;
border-radius: 8px;
font-size: 0.9375rem;
font-weight: 600;
}

.stock-available {
background: #e8f5e9;
color: #2e7d32;
}

.stock-available svg {
width: 20px;
height: 20px;
}

.stock-out {
background: #ffebee;
color: #c62828;
}

.stock-out svg {
width: 20px;
height: 20px;
}

/* ===== SECTION DIVIDER ===== */
.section-divider {
height: 1px;
background: var(--pdp-border);
margin: 0.5rem 0;
}

/* ===== CONFIG SECTION ===== */
.config-section {
padding: 0.5rem 0;
}

.section-title {
font-size: 1.125rem;
font-weight: 700;
color: var(--pdp-primary);
margin: 0 0 1.25rem 0;
}

/* ===== CART SECTION ===== */
.cart-section {
padding: 0.5rem 0;
}

/* ===== BENEFITS & POLICIES ===== */
.benefits-section {
display: flex;
flex-direction: column;
gap: 1rem;
padding: 0.5rem 0;
}

.benefit-accordion {
border: 1px solid var(--pdp-border);
border-radius: 12px;
background: var(--pdp-bg);
overflow: hidden;
transition: var(--pdp-transition);
}

.benefit-accordion:hover {
border-color: var(--pdp-accent);
}

.accordion-header {
display: flex;
align-items: center;
gap: 0.875rem;
padding: 1.125rem 1.25rem;
cursor: pointer;
user-select: none;
font-size: 1rem;
font-weight: 600;
color: var(--pdp-primary);
list-style: none;
transition: var(--pdp-transition);
}

.accordion-header::-webkit-details-marker {
display: none;
}

.accordion-icon {
width: 24px;
height: 24px;
flex-shrink: 0;
color: var(--pdp-accent);
}

.accordion-header span {
flex: 1;
}

.chevron {
width: 20px;
height: 20px;
flex-shrink: 0;
color: var(--pdp-secondary);
stroke-width: 2;
transition: transform 0.3s ease;
}

.benefit-accordion[open] .chevron {
transform: rotate(180deg);
}

.accordion-content {
padding: 0 1.25rem 1.25rem 1.25rem;
margin: 0;
list-style: none;
}

.accordion-content li {
display: flex;
align-items: flex-start;
gap: 0.75rem;
padding: 0.625rem 0;
font-size: 0.9375rem;
color: var(--pdp-secondary);
line-height: 1.5;
}

.accordion-content li svg {
width: 20px;
height: 20px;
flex-shrink: 0;
color: var(--pdp-success);
margin-top: 0.125rem;
}

/* ===== DETAILS SECTION ===== */
.details-section {
background: var(--pdp-bg);
border-radius: 18px;
padding: 0;
margin-bottom: 3rem;
box-shadow: 0 2px 16px var(--pdp-shadow);
overflow: hidden;
}

.tabs-container {
width: 100%;
}

.tabs-nav {
display: flex;
border-bottom: 1px solid var(--pdp-border);
background: var(--pdp-bg-secondary);
}

.tab-button {
flex: 1;
display: flex;
align-items: center;
justify-content: center;
gap: 0.625rem;
padding: 1.25rem 1.5rem;
border: none;
background: transparent;
font-size: 1rem;
font-weight: 600;
color: var(--pdp-secondary);
cursor: pointer;
transition: var(--pdp-transition);
position: relative;
}

.tab-button svg {
width: 20px;
height: 20px;
stroke-width: 2;
}

.tab-button:hover {
color: var(--pdp-primary);
background: rgba(0, 113, 227, 0.05);
}

.tab-button.active {
color: var(--pdp-accent);
background: var(--pdp-bg);
}

.tab-button.active::after {
content: '';
position: absolute;
bottom: -1px;
left: 0;
right: 0;
height: 3px;
background: var(--pdp-accent);
border-radius: 3px 3px 0 0;
}

.tabs-panels {
padding: 2.5rem 3rem;
}

.tab-panel {
animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
from {
opacity: 0;
transform: translateY(10px);
}

to {
opacity: 1;
transform: translateY(0);
}
}

/* ===== SPECIFICATIONS ===== */
.specs-grid {
display: grid;
gap: 1px;
background: var(--pdp-border);
border: 1px solid var(--pdp-border);
border-radius: 12px;
overflow: hidden;
}

.spec-item {
display: grid;
grid-template-columns: 280px 1fr;
background: var(--pdp-bg);
}

.spec-label {
padding: 1.125rem 1.5rem;
background: var(--pdp-bg-secondary);
font-weight: 600;
font-size: 0.9375rem;
color: var(--pdp-primary);
}

.spec-value {
padding: 1.125rem 1.5rem;
display: flex;
align-items: center;
gap: 0.75rem;
font-size: 0.9375rem;
color: var(--pdp-secondary);
}

.color-indicator {
display: inline-block;
width: 28px;
height: 28px;
border-radius: 50%;
border: 2px solid var(--pdp-border);
box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* ===== DESCRIPTION ===== */
.description-text {
font-size: 1.0625rem;
line-height: 1.75;
color: var(--pdp-secondary);
max-width: 800px;
}

/* ===== REVIEWS ===== */
.reviews-container {
max-width: 800px;
margin: 0 auto;
}

.reviews-header {
text-align: center;
margin-bottom: 3rem;
}

.reviews-score {
display: inline-flex;
flex-direction: column;
align-items: center;
gap: 0.75rem;
padding: 2rem 3rem;
background: var(--pdp-bg-secondary);
border-radius: 16px;
}

.score-number {
font-size: 4rem;
font-weight: 700;
line-height: 1;
color: var(--pdp-accent);
}

.score-stars {
display: flex;
gap: 4px;
}

.score-stars .star {
font-size: 1.5rem;
color: #ff9500;
}

.score-count {
font-size: 0.9375rem;
color: var(--pdp-secondary);
font-weight: 500;
}

.reviews-empty {
display: flex;
flex-direction: column;
align-items: center;
gap: 1rem;
padding: 3rem;
text-align: center;
color: var(--pdp-secondary);
}

.reviews-empty svg {
width: 64px;
height: 64px;
stroke-width: 1.5;
}

.reviews-empty p {
font-size: 1.0625rem;
margin: 0;
}

/* ===== RESPONSIVE DESIGN ===== */
@media (max-width: 1024px) {
.product-wrapper {
grid-template-columns: 1fr;
gap: 2.5rem;
padding: 2rem;
}

.gallery-section {
position: static;
}

.product-title {
font-size: 2rem;
}

.price-main {
font-size: 2.25rem;
}
}

@media (max-width: 768px) {
.pdp-content {
padding: 0 1rem;
}

.product-wrapper {
padding: 1.5rem;
gap: 2rem;
}

.product-title {
font-size: 1.75rem;
}

.price-main {
font-size: 2rem;
}

.tabs-nav {
flex-direction: column;
}

.tab-button {
justify-content: flex-start;
border-bottom: 1px solid var(--pdp-border);
}

.tab-button.active::after {
left: 0;
right: auto;
width: 4px;
height: 100%;
top: 0;
bottom: 0;
border-radius: 0 3px 3px 0;
}

.tabs-panels {
padding: 1.5rem;
}

.specs-grid {
display: flex;
flex-direction: column;
}

.spec-item {
grid-template-columns: 1fr;
}

.spec-label {
border-bottom: none;
}

.score-number {
font-size: 3rem;
}
}

@media (max-width: 480px) {
.breadcrumb {
font-size: 0.8125rem;
}

.product-title {
font-size: 1.5rem;
}

.price-main {
font-size: 1.75rem;
}

.tab-button span {
font-size: 0.875rem;
}
}
