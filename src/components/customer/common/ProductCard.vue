<template>
    <div class="product-card">
        <router-link :to="`/products/${product.id}`" class="product-link">
            <!-- Hình ảnh sản phẩm -->
            <div class="product-image-wrapper">
                <img :src="getProductThumbnail()" :alt="product.tenSanPham" class="product-image" loading="lazy" />

                <!-- Badge giảm giá -->
                <div v-if="hasActiveDiscount" class="discount-badge">
                    <!-- Hiển thị % nếu có, nếu không thì hiển thị số tiền -->
                    <span v-if="discountPercent > 0">-{{ discountPercent }}%</span>
                    <span v-else-if="discountAmount > 0">-{{ formatDiscountAmount(discountAmount) }}</span>
                    <span v-else>SALE</span>
                </div>

                <!-- Tag trạng thái sản phẩm (thay thế badge hết hàng) -->
                <div class="status-badge-top" :class="getStatusClass(product.trangThai)">
                    {{ getStatusText(product.trangThai) }}
                </div>
            </div>

            <!-- Thông tin sản phẩm -->
            <div class="product-info">
                <!-- Mã sản phẩm -->
                <div class="product-code">{{ product.maSanPham || `SP-${product.id}` }}</div>
                
                <h3 class="product-name">{{ product.tenSanPham }}</h3>

                <!-- Khoảng giá (hiển thị giá thấp nhất - giá cao nhất) -->
                <div class="price-range-main">
                    <div v-if="isLoadingDetails" class="price-label">Đang tải giá...</div>
                    <div v-else-if="displayMinPrice > 0" class="price-label">Giá từ:</div>
                    <div v-else class="price-label">Giá:</div>
                    
                    <!-- Giá gốc (gạch ngang) nếu có giảm giá -->
                    <div v-if="hasActiveDiscount && originalMinPrice" class="original-price-range">
                        <span class="original-min-price">{{ formatCurrency(originalMinPrice) }}</span>
                        <span v-if="originalMaxPrice && originalMinPrice !== originalMaxPrice" class="price-separator">-</span>
                        <span v-if="originalMaxPrice && originalMinPrice !== originalMaxPrice" class="original-max-price">
                            {{ formatCurrency(originalMaxPrice) }}
                        </span>
                    </div>
                    
                    <!-- Giá hiện tại (sau giảm giá) -->
                    <div class="price-values">
                        <span v-if="isLoadingDetails" class="price-loading">⏳ Đang tải...</span>
                        <span v-else-if="displayMinPrice > 0" class="min-price" :class="{ 'discounted-price': hasActiveDiscount }">{{ formatCurrency(displayMinPrice) }}</span>
                        <span v-else class="price-unavailable">Liên hệ</span>
                        <span v-if="!isLoadingDetails && displayMaxPrice && displayMinPrice !== displayMaxPrice && displayMinPrice > 0" class="price-separator">-</span>
                        <span v-if="!isLoadingDetails && displayMaxPrice && displayMinPrice !== displayMaxPrice && displayMinPrice > 0" class="max-price" :class="{ 'discounted-price': hasActiveDiscount }">
                            {{ formatCurrency(displayMaxPrice) }}
                        </span>
                    </div>
                </div>


                <!-- Rating -->
                <div v-if="product.danhGiaTrungBinh" class="product-rating">
                    <div class="stars">
                        <span v-for="star in 5" :key="star"
                            :class="['star', star <= product.danhGiaTrungBinh ? 'filled' : '']">
                            ★
                        </span>
                    </div>
                    <span class="rating-count">({{ product.soLuongDanhGia || 0 }})</span>
                </div>
            </div>
        </router-link>

        <!-- Nút Thêm vào giỏ -->
        <button v-if="product.conHang" @click.prevent="handleAddToCart" class="add-to-cart-btn" :disabled="isAdding">
            <span v-if="!isAdding">Thêm vào giỏ</span>
            <span v-else>Đang thêm...</span>
        </button>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { sanPhamService } from '@/service/customer/san_pham_service'
import { formatCurrency } from '@/utils/helpers'

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['add-to-cart'])

const isAdding = ref(false)
const productDetails = ref([])
const isLoadingDetails = ref(false)

// Load chi tiết sản phẩm
const loadProductDetails = async () => {
    if (!props.product.id) return
    
    try {
        isLoadingDetails.value = true
        console.log('🔄 Loading product details for ID:', props.product.id)
        
        const response = await sanPhamService.getProductDetailsWithDiscount(props.product.id)
        productDetails.value = response.data || []
        
        console.log('✅ Product details loaded:', productDetails.value)
        
        // Nếu có chi tiết sản phẩm nhưng không có hình ảnh, thử lấy hình ảnh riêng
        if (productDetails.value.length > 0) {
            for (const detail of productDetails.value) {
                if (!detail.hinhAnh && detail.id) {
                    try {
                        console.log('🔄 Loading images for detail ID:', detail.id)
                        const imageResponse = await sanPhamService.getImagesByProductDetailId(detail.id)
                        if (imageResponse.data && imageResponse.data.length > 0) {
                            detail.hinhAnhs = imageResponse.data
                            console.log('✅ Images loaded for detail:', detail.hinhAnhs)
                        }
                    } catch (imageError) {
                        console.log('⚠️ Could not load images for detail:', imageError.message)
                    }
                }
            }
        }
    } catch (error) {
        console.error('❌ Error loading product details:', error)
        productDetails.value = []
    } finally {
        isLoadingDetails.value = false
    }
}

// Tính giá hiện tại (sau giảm giá)
const currentPrice = computed(() => {
    return props.product.giamGia ? props.product.giaThapNhat : props.product.giaThapNhat
})

// Computed properties cũ đã được thay thế bởi hasActiveDiscount và discountPercent mới

// Kiểm tra có khoảng giá không (khi giá thấp nhất khác giá cao nhất)
const hasPriceRange = computed(() => {
    return props.product.giaThapNhat && props.product.giaCaoNhat && 
           props.product.giaThapNhat !== props.product.giaCaoNhat
})

// Kiểm tra có khoảng giá từ variants không
const hasPriceRangeFromVariants = computed(() => {
    if (!props.product.variants || props.product.variants.length === 0) return false
    const minPrice = getMinPrice(props.product.variants)
    const maxPrice = getMaxPrice(props.product.variants)
    return minPrice !== maxPrice && minPrice > 0 && maxPrice > 0
})

// Computed properties cho giảm giá
const hasActiveDiscount = computed(() => {
    return productDetails.value && productDetails.value.length > 0 && 
           productDetails.value.some(detail => detail.coGiamGia === true)
})

const bestDiscount = computed(() => {
    if (!hasActiveDiscount.value) return null
    
    return productDetails.value
        .filter(detail => detail.coGiamGia === true)
        .reduce((best, current) => {
            if (!best || (current.phanTramGiam || 0) > (best.phanTramGiam || 0)) {
                return current
            }
            return best
        }, null)
})

const discountPercent = computed(() => {
    // Nếu backend đã tính sẵn % thì dùng luôn
    if (bestDiscount.value?.phanTramGiam && bestDiscount.value.phanTramGiam > 0) {
        return bestDiscount.value.phanTramGiam
    }
    
    // Nếu không có % nhưng có giá gốc và giá giảm, tự tính %
    if (bestDiscount.value?.giaGoc && bestDiscount.value?.giaGiam) {
        const giaGoc = bestDiscount.value.giaGoc
        const giaGiam = bestDiscount.value.giaGiam
        
        if (giaGoc > 0 && giaGiam < giaGoc) {
            const percent = Math.round(((giaGoc - giaGiam) / giaGoc) * 100)
            return percent
        }
    }
    
    return 0
})

// Số tiền giảm (để hiển thị thay thế cho %)
const discountAmount = computed(() => {
    if (bestDiscount.value?.giaGoc && bestDiscount.value?.giaGiam) {
        return bestDiscount.value.giaGoc - bestDiscount.value.giaGiam
    }
    return 0
})

// Format số tiền giảm (VD: 500K, 1.2M)
const formatDiscountAmount = (amount) => {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(1).replace('.0', '') + 'M'
    } else if (amount >= 1000) {
        return (amount / 1000).toFixed(0) + 'K'
    }
    return amount.toString()
}

// Giá gốc để hiển thị gạch ngang
const originalMinPrice = computed(() => {
    if (!hasActiveDiscount.value) return null
    
    if (productDetails.value && productDetails.value.length > 0) {
        const originalPrices = productDetails.value
            .filter(detail => detail.coGiamGia && detail.giaGoc && detail.giaGoc > 0)
            .map(detail => detail.giaGoc)
        
        if (originalPrices.length > 0) {
            return Math.min(...originalPrices)
        }
    }
    return null
})

const originalMaxPrice = computed(() => {
    if (!hasActiveDiscount.value) return null
    
    if (productDetails.value && productDetails.value.length > 0) {
        const originalPrices = productDetails.value
            .filter(detail => detail.coGiamGia && detail.giaGoc && detail.giaGoc > 0)
            .map(detail => detail.giaGoc)
        
        if (originalPrices.length > 0) {
            return Math.max(...originalPrices)
        }
    }
    return null
})

// Computed properties cho giá hiển thị
const displayMinPrice = computed(() => {
    console.log('💰 Computing displayMinPrice...')
    console.log('💰 Product details:', productDetails.value)
    
    // Ưu tiên lấy từ chi tiết sản phẩm
    if (productDetails.value && productDetails.value.length > 0) {
        const prices = productDetails.value
            .filter(detail => {
                // Ưu tiên giá sau giảm giá nếu có
                const price = detail.coGiamGia ? detail.giaGiam : detail.giaBan
                return price && price > 0
            })
            .map(detail => detail.coGiamGia ? detail.giaGiam : detail.giaBan)
        
        if (prices.length > 0) {
            const minPrice = Math.min(...prices)
            console.log('💰 Min price from details (after discount):', minPrice)
            return minPrice
        }
    }
    
    // Fallback sang dữ liệu sản phẩm gốc
    console.log('💰 Full product object:', props.product)
    console.log('💰 Product keys:', Object.keys(props.product))
    
    // Try different possible price fields
    const possiblePriceFields = [
        'gia', 'giaThapNhat', 'price', 'giaBan', 'minPrice', 
        'giaMin', 'priceMin', 'lowestPrice'
    ]
    
    for (const field of possiblePriceFields) {
        if (props.product[field] && props.product[field] > 0) {
            console.log(`💰 Using ${field}:`, props.product[field])
            return props.product[field]
        }
    }
    
    console.log('💰 No valid price found, returning 0')
    return 0
})

const displayMaxPrice = computed(() => {
    console.log('💰 Computing displayMaxPrice...')
    
    // Ưu tiên lấy từ chi tiết sản phẩm
    if (productDetails.value && productDetails.value.length > 0) {
        const prices = productDetails.value
            .filter(detail => {
                // Ưu tiên giá sau giảm giá nếu có
                const price = detail.coGiamGia ? detail.giaGiam : detail.giaBan
                return price && price > 0
            })
            .map(detail => detail.coGiamGia ? detail.giaGiam : detail.giaBan)
        
        if (prices.length > 0) {
            const maxPrice = Math.max(...prices)
            console.log('💰 Max price from details (after discount):', maxPrice)
            return maxPrice
        }
    }
    
    // Fallback sang dữ liệu sản phẩm gốc
    console.log('💰 Product data:', {
        giaGoc: props.product.giaGoc,
        giaCaoNhat: props.product.giaCaoNhat,
        gia: props.product.gia
    })
    
    // Try different possible max price fields
    const possibleMaxPriceFields = [
        'giaGoc', 'giaCaoNhat', 'maxPrice', 'priceMax', 
        'giaMax', 'highestPrice', 'originalPrice'
    ]
    
    for (const field of possibleMaxPriceFields) {
        if (props.product[field] && props.product[field] > 0) {
            console.log(`💰 Using ${field}:`, props.product[field])
            return props.product[field]
        }
    }
    
    // If no max price found, return the same as min price (no range)
    console.log('💰 No valid max price found, returning min price')
    return displayMinPrice.value
})

// Lấy class CSS cho trạng thái sản phẩm
const getStatusClass = (trangThai) => {
    return trangThai === 1 ? 'status-active' : 'status-inactive'
}

// Lấy text hiển thị cho trạng thái sản phẩm
const getStatusText = (trangThai) => {
    return trangThai === 1 ? 'Còn hàng' : 'Hết hàng'
}

// Lấy hình ảnh đại diện sản phẩm (tương tự ProductList.vue)
const getProductThumbnail = () => {
    console.log('🖼️ ProductCard - Full product object:', props.product)
    console.log('🖼️ ProductCard - Product details:', productDetails.value)
    
    // Thử lấy hình ảnh từ chi tiết sản phẩm trước
    if (productDetails.value && productDetails.value.length > 0) {
        console.log('🔍 Checking product details for images...')
        // Tìm chi tiết sản phẩm có hình ảnh
        for (const detail of productDetails.value) {
            console.log('🔍 Detail object:', detail)
            const possibleImageFields = ['hinhAnh', 'image', 'imageUrl', 'thumbnail', 'avatar', 'anhDaiDien']
            for (const field of possibleImageFields) {
                if (detail[field] && typeof detail[field] === 'string' && detail[field].trim() !== '') {
                    console.log(`✅ Using ${field} from detail:`, detail[field])
                    return detail[field]
                }
            }
            
            // Thử lấy từ hình ảnh của chi tiết sản phẩm nếu có
            if (detail.hinhAnhs && Array.isArray(detail.hinhAnhs) && detail.hinhAnhs.length > 0) {
                const firstImage = detail.hinhAnhs[0]
                if (firstImage && firstImage.url && firstImage.url.trim() !== '') {
                    console.log('✅ Using hinhAnhs[0].url from detail:', firstImage.url)
                    return firstImage.url
                }
            }
        }
    }
    
    console.log('🖼️ ProductCard - Product keys:', Object.keys(props.product))
    console.log('🖼️ ProductCard - Image fields:', {
        anhDaiDien: props.product.anhDaiDien,
        hinhAnh: props.product.hinhAnh,
        image: props.product.image,
        imageUrl: props.product.imageUrl,
        thumbnail: props.product.thumbnail,
        avatar: props.product.avatar
    })
    
    // Return product thumbnail if exists and not empty
    if (props.product.anhDaiDien && props.product.anhDaiDien.trim() !== '') {
        console.log('✅ Using anhDaiDien:', props.product.anhDaiDien)
        return props.product.anhDaiDien
    }
    
    // Try hinhAnh property as fallback (check for non-empty string)
    if (props.product.hinhAnh && props.product.hinhAnh.trim() !== '') {
        console.log('✅ Using hinhAnh:', props.product.hinhAnh)
        return props.product.hinhAnh
    }
    
    // Try other possible image fields from the product data
    const imageFields = ['image', 'imageUrl', 'thumbnail', 'avatar', 'photo', 'picture', 'img', 'src', 'url']
    for (const field of imageFields) {
        if (props.product[field] && typeof props.product[field] === 'string' && props.product[field].trim() !== '') {
            console.log(`✅ Using ${field}:`, props.product[field])
            return props.product[field]
        }
    }
    
    // Otherwise try to get from first variant with images
    if (props.product.variants && props.product.variants.length > 0) {
        console.log('🔍 Checking variants for images...')
        for (const variant of props.product.variants) {
            console.log('🔍 Variant:', variant)
            if (variant.images && Array.isArray(variant.images) && variant.images.length > 0) {
                const firstImage = variant.images[0]
                console.log('🔍 First image:', firstImage)
                // Handle both object with url property and direct string url
                if (typeof firstImage === 'string' && firstImage.trim() !== '') {
                    console.log('✅ Using string image:', firstImage)
                    return firstImage
                }
                if (firstImage && firstImage.url && firstImage.url.trim() !== '') {
                    console.log('✅ Using image.url:', firstImage.url)
                    return firstImage.url
                }
                // Try other possible properties
                if (firstImage && firstImage.uri && firstImage.uri.trim() !== '') {
                    console.log('✅ Using image.uri:', firstImage.uri)
                    return firstImage.uri
                }
            }
        }
    }
    
    console.log('❌ No valid image found, using placeholder')
    // Fallback to a simple data URL placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZTJlOGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzY0NzQ4YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
}

// Lấy giá thấp nhất từ variants (tương tự ProductList.vue)
const getMinPrice = (variants) => {
    console.log('💰 ProductCard - getMinPrice variants:', variants)
    if (!variants || variants.length === 0) {
        console.log('💰 No variants, returning 0')
        return 0
    }
    const prices = variants.map(v => v.giaBan || 0)
    console.log('💰 Variant prices:', prices)
    const minPrice = Math.min(...prices)
    console.log('💰 Min price:', minPrice)
    return minPrice
}

// Lấy giá cao nhất từ variants (tương tự ProductList.vue)
const getMaxPrice = (variants) => {
    console.log('💰 ProductCard - getMaxPrice variants:', variants)
    if (!variants || variants.length === 0) {
        console.log('💰 No variants, returning 0')
        return 0
    }
    const prices = variants.map(v => v.giaBan || 0)
    const maxPrice = Math.max(...prices)
    console.log('💰 Max price:', maxPrice)
    return maxPrice
}

// Handle thêm vào giỏ
const handleAddToCart = async () => {
    isAdding.value = true
    try {
        emit('add-to-cart', props.product)
        // Giả lập loading
        await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
        isAdding.value = false
    }
}

// Load chi tiết sản phẩm khi component mount
onMounted(() => {
    // Bật lại API chi tiết sản phẩm vì ID bây giờ đã là UUID đúng format
    loadProductDetails()
    console.log('🔄 ProductCard mounted, loading product details')
})
</script>

<style scoped>
.product-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
    /* 1:1 Aspect Ratio */
    overflow: hidden;
    background: #f8fafc;
}

.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.placeholder-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    gap: 8px;
}

.placeholder-icon {
    font-size: 48px;
}

.placeholder-text {
    font-size: 14px;
    font-weight: 600;
    color: #047857;
    text-align: center;
    padding: 0 12px;
    max-width: 80%;
}

.discount-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #ef4444;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.status-badge-top {
    position: absolute;
    top: 8px;
    left: 8px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    z-index: 3;
}

.status-badge-top.status-active {
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
}

.status-badge-top.status-inactive {
    background: #f1f5f9;
    color: #475569;
    border: 1px solid #cbd5e1;
}

.product-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.product-code {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    background: #f1f5f9;
    padding: 4px 8px;
    border-radius: 4px;
    width: fit-content;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 48px;
}

.price-range-main {
    margin: 8px 0;
}

.price-label {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
    margin-bottom: 4px;
}

.price-values {
    display: flex;
    align-items: center;
    gap: 6px;
}

.min-price {
    font-size: 18px;
    font-weight: 700;
    color: #ef4444;
}

.price-separator {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

.max-price {
    font-size: 16px;
    font-weight: 600;
    color: #059669;
}

.price-unavailable {
    font-size: 16px;
    font-weight: 600;
    color: #6b7280;
    font-style: italic;
}

.price-loading {
    color: #3b82f6;
    font-size: 0.9rem;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

/* Giá gốc gạch ngang */
.original-price-range {
    margin-bottom: 4px;
}

.original-min-price,
.original-max-price {
    font-size: 14px;
    color: #9ca3af;
    text-decoration: line-through;
    font-weight: 500;
}

/* Giá sau giảm giá */
.discounted-price {
    color: #dc2626 !important;
    font-weight: 700 !important;
}

/* Discount badge */
.discount-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    background: linear-gradient(135deg, #dc2626, #ef4444);
    color: white;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 700;
    z-index: 3;
    box-shadow: 0 2px 4px rgba(220, 38, 38, 0.3);
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 6px;
}

.stars {
    display: flex;
    gap: 2px;
}

.star {
    color: #e2e8f0;
    font-size: 16px;
}

.star.filled {
    color: #fbbf24;
}

.rating-count {
    font-size: 13px;
    color: #64748b;
}

.add-to-cart-btn {
    width: 100%;
    padding: 12px 16px;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 0 0 12px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
    background: #059669;
}

.add-to-cart-btn:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
}
</style>
