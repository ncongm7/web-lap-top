import { ref, computed } from 'vue'
import { sanPhamService } from '@/service/customer/san_pham_service'

/**
 * ========================================
 * COMPOSABLE: useProductDetail
 * ========================================
 * Quản lý logic load và xử lý thông tin sản phẩm từ API mới
 */
export function useProductDetail(productId) {
  // State
  const loading = ref(false)
  const error = ref(null)
  const productDetail = ref(null)
  const relatedProducts = ref([])
  const selectedVariantId = ref(null)
  const currentProductId = ref(productId)

  /**
   * Current selected variant
   */
  const selectedVariant = computed(() => {
    if (!productDetail.value?.variants) return null
    return productDetail.value.variants.find((v) => v.id === selectedVariantId.value) ||
           productDetail.value.variants[0] || null
  })

  /**
   * Product images for selected variant or all images
   */
  const productImages = computed(() => {
    if (!productDetail.value) return []

    // Nếu có variant được chọn, ưu tiên hình ảnh của variant đó
    if (selectedVariant.value?.images?.length > 0) {
      return selectedVariant.value.images.map((url, index) => ({
        url: typeof url === 'string' ? url : url.url || url,
        alt: `${productDetail.value.tenSanPham} - Ảnh ${index + 1}`,
      }))
    }

    // Fallback: dùng imageUrls nếu có
    if (selectedVariant.value?.imageUrls?.length > 0) {
      return selectedVariant.value.imageUrls.map((url, index) => ({
        url: url,
        alt: `${productDetail.value.tenSanPham} - Ảnh ${index + 1}`,
      }))
    }

    // Fallback: dùng tất cả hình ảnh của sản phẩm
    if (productDetail.value.images?.length > 0) {
      return productDetail.value.images.map((img) => ({
        url: typeof img === 'string' ? img : img.url || img,
        alt: `${productDetail.value.tenSanPham} - ${img.isMain ? 'Ảnh chính' : 'Ảnh phụ'}`,
      }))
    }

    return [{
      url: 'https://via.placeholder.com/600x600.png?text=No+Image',
      alt: productDetail.value.tenSanPham || 'Sản phẩm',
    }]
  })

  /**
   * Product specifications từ variant được chọn
   */
  const productSpecs = computed(() => {
    if (!selectedVariant.value) return []

    const v = selectedVariant.value
    return [
      { key: 'cpu', label: 'CPU', value: v.cpu, category: 'Hiệu năng' },
      { key: 'gpu', label: 'GPU', value: v.gpu, category: 'Hiệu năng' },
      { key: 'ram', label: 'RAM', value: v.ram, category: 'Hiệu năng' },
      { key: 'storage', label: 'Ổ cứng', value: v.oCung, category: 'Lưu trữ' },
      { key: 'screen', label: 'Màn hình', value: v.kichThuocManHinh, category: 'Màn hình' },
      { key: 'color', label: 'Màu sắc', value: v.mauSac, category: 'Thiết kế' },
      { key: 'battery', label: 'Pin', value: v.dungLuongPin, category: 'Pin' },
    ].filter((s) => s.value)
  })

  /**
   * Product metadata
   */
  const productMetadata = computed(() => {
    if (!productDetail.value) return {}

    return {
      code: productDetail.value.maSanPham || productDetail.value.id || 'Đang cập nhật',
      rating: productDetail.value.reviewSummary?.averageRating?.toFixed(1) || '0.0',
      reviewCount: productDetail.value.reviewSummary?.totalReviews || 0,
      views: '1.2K', // TODO: Thêm từ backend nếu có
    }
  })

  /**
   * Load product detail từ API mới
   */
  const loadProduct = async (id) => {
    const idToLoad = id || currentProductId.value

    if (!idToLoad) {
      error.value = 'Không tìm thấy ID sản phẩm'
      return
    }

    loading.value = true
    error.value = null
    currentProductId.value = idToLoad

    try {
      const response = await sanPhamService.getProductDetail(idToLoad)
      productDetail.value = response.data?.data || response.data

      if (!productDetail.value) {
        throw new Error('Không tìm thấy sản phẩm')
      }

      // Auto select first variant (kể cả khi hết hàng, để người dùng có thể chọn để liên hệ và so sánh)
      if (productDetail.value.variants?.length > 0) {
        // Map fields for frontend display
        productDetail.value.variants.forEach(variant => {
          variant.discountedPrice = variant.giaGiam || variant.giaBan
          variant.originalPrice = variant.giaGoc || variant.giaBan
          variant.hasDiscount = variant.coGiamGia
        })

        // Luôn chọn variant đầu tiên, kể cả khi hết hàng
        selectedVariantId.value = productDetail.value.variants[0].id
      } else {
        selectedVariantId.value = null
      }

      // Load related products
      await loadRelatedProducts(idToLoad)

    } catch (err) {
      console.error('Error loading product:', err)
      error.value = err.response?.data?.message || err.message || 'Không thể tải sản phẩm'
    } finally {
      loading.value = false
    }
  }

  /**
   * Load related products
   */
  const loadRelatedProducts = async (id) => {
    const idToLoad = id || currentProductId.value
    if (!idToLoad) return

    try {
      const response = await sanPhamService.getRelatedProducts(idToLoad, 8)
      relatedProducts.value = response.data?.data || response.data || []
    } catch (err) {
      console.error('Error loading related products:', err)
      // Không throw error, chỉ log
    }
  }

  /**
   * Handle variant change
   */
  const handleVariantChange = (variant) => {
    if (variant?.id) {
      selectedVariantId.value = variant.id
    }
  }

  return {
    // State
    loading,
    error,
    productDetail,
    relatedProducts,
    selectedVariantId,

    // Computed
    selectedVariant,
    productImages,
    productSpecs,
    productMetadata,

    // Methods
    loadProduct,
    loadRelatedProducts,
    handleVariantChange,
  }
}
