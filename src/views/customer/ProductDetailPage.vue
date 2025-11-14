<template>
    <div class="product-detail-page">
        <!-- Loading State -->
        <div v-if="loading" class="loading-container">
            <div class="spinner-large"></div>
            <p>Đang tải thông tin sản phẩm...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-container">
            <svg width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                <path
                    d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </svg>
            <h3>Không thể tải sản phẩm</h3>
            <p>{{ error }}</p>
            <button class="btn-retry" @click="loadProduct">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z" />
                    <path
                        d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
                </svg>
                Thử lại
            </button>
        </div>

        <!-- Product Content -->
        <div v-else-if="product" class="product-content container">
            <!-- Breadcrumb -->
            <nav class="breadcrumb-nav">
                <router-link to="/">Trang chủ</router-link>
                <span>/</span>
                <router-link to="/products">Sản phẩm</router-link>
                <span>/</span>
                <span class="current">{{ product.name }}</span>
            </nav>

            <!-- Main Product Section -->
            <div class="product-main-section">
                <!-- Left: Gallery -->
                <div class="gallery-column">
                    <ProductGallery :images="productImages" :product-name="product.name" />
                </div>

                <!-- Right: Product Info -->
                <div class="info-column">
                    <!-- Product Name -->
                    <h1 class="product-name">{{ product.name }}</h1>

                    <!-- Product Summary -->
                    <div v-if="selectedVariant" class="product-summary">
                        {{ selectedVariant.summary }}
                    </div>

                    <!-- Rating & Reviews (Optional) -->
                    <div class="rating-section">
                        <div class="stars">
                            <span v-for="i in 5" :key="i" class="star">★</span>
                        </div>
                        <span class="rating-text">5.0</span>
                        <span class="reviews-count">(128 đánh giá)</span>
                    </div>

                    <!-- Price Display -->
                    <div v-if="selectedVariant" class="price-section">
                        <div class="current-price">{{ formatPrice(selectedVariant.price) }}</div>
                        <div v-if="selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price"
                            class="price-meta">
                            <del class="original-price">{{ formatPrice(selectedVariant.originalPrice) }}</del>
                            <span class="discount-badge">
                                -{{ calculateDiscount(selectedVariant.originalPrice, selectedVariant.price) }}%
                            </span>
                        </div>
                    </div>

                    <!-- Variant Selector -->
                    <VariantSelector :variants="formattedVariants" v-model="selectedVariantId"
                        @change="handleVariantChange" />

                    <!-- Add to Cart Form -->
                    <AddToCartForm :product-id="selectedVariantId"
                        :product-name="selectedVariant?.summary || product.name"
                        :max-quantity="selectedVariant?.stock || 0"
                        :disabled="!selectedVariantId || selectedVariant?.stock <= 0" @add-to-cart="handleAddToCart"
                        @buy-now="handleBuyNow" />

                    <!-- Promotions & Benefits -->
                    <div class="benefits-section">
                        <div class="benefit-box promotions">
                            <div class="benefit-header">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path
                                        d="M2.5 8a5.5 5.5 0 0 1 8.25-4.764.5.5 0 0 0 .5-.866A6.5 6.5 0 1 0 14.5 8a.5.5 0 0 0-1 0 5.5 5.5 0 1 1-11 0z" />
                                    <path
                                        d="M15.354 3.354a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l7-7z" />
                                </svg>
                                <span>Khuyến mãi đặc biệt</span>
                            </div>
                            <ul>
                                <li>🎁 Tặng Windows bản quyền</li>
                                <li>🎁 Miễn phí cân màu màn hình chuyên nghiệp</li>
                                <li>🎁 Balo thời trang + Chuột không dây cao cấp</li>
                                <li>🎁 Voucher giảm giá cho lần mua tiếp theo</li>
                            </ul>
                        </div>

                        <div class="benefit-box policies">
                            <div class="benefit-header">
                                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                                    <path
                                        d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                                </svg>
                                <span>Chính sách bán hàng</span>
                            </div>
                            <ul>
                                <li>✅ Bảo hành chính hãng 12-24 tháng</li>
                                <li>✅ Đổi trả trong 15 ngày đầu tiên</li>
                                <li>✅ Hỗ trợ trả góp 0% lãi suất</li>
                                <li>✅ Giao hàng miễn phí toàn quốc</li>
                                <li>✅ Hỗ trợ kỹ thuật trọn đời</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Product Details Tabs -->
            <div class="product-details-section">
                <div class="tabs-header">
                    <button :class="['tab-btn', { active: activeTab === 'specs' }]" @click="activeTab = 'specs'">
                        Thông số kỹ thuật
                    </button>
                    <button :class="['tab-btn', { active: activeTab === 'description' }]"
                        @click="activeTab = 'description'">
                        Mô tả sản phẩm
                    </button>
                    <button :class="['tab-btn', { active: activeTab === 'reviews' }]" @click="activeTab = 'reviews'">
                        Đánh giá (128)
                    </button>
                </div>

                <div class="tabs-content">
                    <!-- Specifications Tab -->
                    <div v-show="activeTab === 'specs'" class="tab-pane specs-pane">
                        <table class="specs-table">
                            <tbody>
                                <tr v-for="spec in productSpecs" :key="spec.key">
                                    <th>{{ spec.label }}</th>
                                    <td>
                                        <span>{{ spec.value }}</span>
                                        <span v-if="spec.hex" class="color-swatch"
                                            :style="{ backgroundColor: spec.hex }" :title="spec.hex"></span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <!-- Description Tab -->
                    <div v-show="activeTab === 'description'" class="tab-pane description-pane">
                        <div class="description-content">
                            <p>{{ product.description || 'Thông tin chi tiết sản phẩm đang được cập nhật...' }}</p>
                        </div>
                    </div>

                    <!-- Reviews Tab -->
                    <div v-show="activeTab === 'reviews'" class="tab-pane reviews-pane">
                        <div class="reviews-summary">
                            <div class="average-rating">
                                <div class="rating-number">5.0</div>
                                <div class="stars">
                                    <span v-for="i in 5" :key="i" class="star">★</span>
                                </div>
                                <div class="total-reviews">128 đánh giá</div>
                            </div>
                        </div>
                        <div class="reviews-list">
                            <p class="text-center text-muted">Chức năng đánh giá đang được phát triển...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductGallery from '@/components/customer/san_pham/ProductGallery.vue'
import VariantSelector from '@/components/customer/san_pham/VariantSelector.vue'
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

// Current selected variant
const selectedVariant = computed(() => {
    return formattedVariants.value.find((v) => v.id === selectedVariantId.value) || null
})

// Format variants cho VariantSelector component
const formattedVariants = computed(() => {
    return variants.value.map((v) => ({
        id: v.idctsp,
        attributes: {
            ram: v.tenRam,
            storage: v.dungLuongOCung,
            color: v.tenMauSac,
            cpu: v.tenCpu,
            gpu: v.tenGpu,
            screen: v.kichThuocManHinh,
        },
        price: v.giaSauGiam || v.giaBan,
        originalPrice: v.giaTruocGiam || v.giaBan,
        stock: v.soLuongTon || v.soLuong || 0,
        summary: [v.tenCpu, v.tenRam, v.dungLuongOCung, v.tenMauSac].filter(Boolean).join(' | '),
        ...v, // Keep all original data
    }))
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
        // Fetch variants with discount info
        const response = await sanPhamService.getProductDetailsWithDiscount(productId)
        variants.value = response.data || []

        if (variants.value.length === 0) {
            throw new Error('Sản phẩm không có phiên bản nào')
        }

        // Set product info from first variant
        const firstVariant = variants.value[0]
        product.value = {
            id: productId,
            name: firstVariant.tenSp,
            description: firstVariant.moTaSp || '',
        }

        // Auto select first variant
        selectedVariantId.value = firstVariant.idctsp

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
            const response = await sanPhamService.getImagesByProductDetailId(variant.idctsp)
            productImagesMap.value[variant.idctsp] = response.data || []
        } catch (err) {
            console.error(`Error loading images for variant ${variant.idctsp}:`, err)
            productImagesMap.value[variant.idctsp] = []
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
.product-detail-page {
    min-height: 100vh;
    background: #f8f9fa;
    padding: 2rem 0;
}

/* Loading & Error States */
.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
    gap: 1rem;
    color: #6c757d;
}

.spinner-large {
    width: 64px;
    height: 64px;
    border: 4px solid #dee2e6;
    border-top-color: #dc3545;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.error-container svg {
    color: #dc3545;
}

.error-container h3 {
    color: #212529;
    margin: 0.5rem 0;
}

.btn-retry {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
    transition: all 0.2s;
}

.btn-retry:hover {
    background: #c82333;
    transform: translateY(-2px);
}

/* Product Content */
.product-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Breadcrumb */
.breadcrumb-nav {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 0;
    font-size: 0.9rem;
    color: #6c757d;
}

.breadcrumb-nav a {
    color: #007bff;
    text-decoration: none;
}

.breadcrumb-nav a:hover {
    text-decoration: underline;
}

.breadcrumb-nav .current {
    color: #212529;
    font-weight: 500;
}

/* Main Product Section */
.product-main-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.gallery-column {
    position: sticky;
    top: 2rem;
    align-self: start;
}

.info-column {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

/* Product Name */
.product-name {
    font-size: 1.75rem;
    font-weight: 700;
    color: #212529;
    margin: 0;
    line-height: 1.3;
}

.product-summary {
    font-size: 1rem;
    color: #6c757d;
    line-height: 1.5;
}

/* Rating */
.rating-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.stars {
    display: flex;
    gap: 2px;
}

.star {
    color: #ffc107;
    font-size: 1.25rem;
}

.rating-text {
    font-weight: 600;
    color: #212529;
}

.reviews-count {
    color: #6c757d;
    font-size: 0.9rem;
}

/* Price */
.price-section {
    padding: 1.5rem;
    background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
    border-radius: 12px;
    border: 2px solid #dc3545;
}

.current-price {
    font-size: 2rem;
    font-weight: 700;
    color: #dc3545;
    line-height: 1;
    margin-bottom: 0.5rem;
}

.price-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.original-price {
    font-size: 1.1rem;
    color: #6c757d;
}

.discount-badge {
    padding: 0.25rem 0.75rem;
    background: #dc3545;
    color: white;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
}

/* Benefits Section */
.benefits-section {
    display: grid;
    gap: 1rem;
    margin-top: 1rem;
}

.benefit-box {
    padding: 1.25rem;
    border-radius: 8px;
    border: 1px solid #dee2e6;
}

.benefit-box.promotions {
    background: linear-gradient(135deg, #fff8dc 0%, #fffacd 100%);
    border-color: #ffc107;
}

.benefit-box.policies {
    background: linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%);
    border-color: #0dcaf0;
}

.benefit-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    color: #212529;
    margin-bottom: 0.75rem;
    font-size: 1rem;
}

.benefit-box ul {
    margin: 0;
    padding-left: 1.25rem;
    list-style: none;
}

.benefit-box li {
    padding: 0.35rem 0;
    color: #495057;
    font-size: 0.9rem;
}

/* Product Details Tabs */
.product-details-section {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.tabs-header {
    display: flex;
    border-bottom: 2px solid #dee2e6;
    background: #f8f9fa;
}

.tab-btn {
    flex: 1;
    padding: 1rem 1.5rem;
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 1rem;
    color: #6c757d;
    cursor: pointer;
    transition: all 0.2s;
    position: relative;
}

.tab-btn:hover {
    color: #dc3545;
    background: rgba(220, 53, 69, 0.05);
}

.tab-btn.active {
    color: #dc3545;
    background: white;
}

.tab-btn.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 3px;
    background: #dc3545;
}

.tabs-content {
    padding: 2rem;
}

/* Specs Table */
.specs-table {
    width: 100%;
    border-collapse: collapse;
}

.specs-table tr {
    border-bottom: 1px solid #dee2e6;
}

.specs-table th {
    width: 30%;
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    color: #495057;
    background: #f8f9fa;
}

.specs-table td {
    padding: 1rem;
    color: #212529;
}

.color-swatch {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 1px solid #dee2e6;
    margin-left: 0.5rem;
    vertical-align: middle;
}

/* Reviews */
.reviews-summary {
    margin-bottom: 2rem;
}

.average-rating {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: #f8f9fa;
    border-radius: 8px;
}

.rating-number {
    font-size: 3rem;
    font-weight: 700;
    color: #ffc107;
    line-height: 1;
}

.average-rating .stars {
    margin: 0.5rem 0;
}

.total-reviews {
    color: #6c757d;
    font-size: 0.95rem;
}

/* Mobile Responsive */
@media (max-width: 992px) {
    .product-main-section {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .gallery-column {
        position: static;
    }

    .product-name {
        font-size: 1.5rem;
    }

    .current-price {
        font-size: 1.75rem;
    }
}

@media (max-width: 576px) {
    .product-detail-page {
        padding: 1rem 0;
    }

    .product-main-section {
        padding: 1rem;
        border-radius: 8px;
    }

    .tabs-header {
        flex-direction: column;
    }

    .tab-btn {
        text-align: left;
        border-bottom: 1px solid #dee2e6;
    }

    .tabs-content {
        padding: 1rem;
    }

    .specs-table th,
    .specs-table td {
        padding: 0.75rem 0.5rem;
        font-size: 0.9rem;
    }

    .specs-table th {
        width: 40%;
    }
}
</style>
