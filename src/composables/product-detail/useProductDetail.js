import { ref, computed } from 'vue'
import { sanPhamService } from '@/service/customer/san_pham_service'

/**
 * ========================================
 * COMPOSABLE: useProductDetail
 * ========================================
 * Quản lý logic load và xử lý thông tin sản phẩm
 */
export function useProductDetail(productId) {
  // State
  const loading = ref(false)
  const error = ref(null)
  const product = ref(null)
  const variants = ref([])
  const selectedVariantId = ref(null)

  /**
   * Current selected variant
   */
  const selectedVariant = computed(() => {
    return formattedVariants.value.find((v) => v.id === selectedVariantId.value) || null
  })

  /**
   * Format variants cho component selector
   */
  const formattedVariants = computed(() => {
    return variants.value.map((v) => {
      return {
        id: v.idctsp,
        attributes: {
          cpu: v.tenCpu,
          gpu: v.tenGpu,
          ram: v.tenRam,
          storage: v.dungLuongOCung,
          color: v.tenMauSac,
          screen: v.kichThuocManHinh,
        },
        price: v.giaBan,
        originalPrice: v.giaBan,
        stock: (v.soLuongTon || 0) - (v.soLuongTamGiu || 0),
        summary: [v.tenCpu, v.tenGpu, v.tenRam, v.dungLuongOCung].filter(Boolean).join(' | '),
        ...v, // Keep all original data
      }
    })
  })

  /**
   * Product images for selected variant
   */
  const productImages = computed(() => {
    const variant = selectedVariant.value
    if (!variant || !variant.hinhAnhs || variant.hinhAnhs.length === 0) {
      return [
        {
          url: 'https://via.placeholder.com/600x600.png?text=No+Image',
          alt: product.value?.name || 'Sản phẩm',
        },
      ]
    }

    return variant.hinhAnhs.map((url, index) => ({
      url: url,
      alt: `${product.value?.name || 'Sản phẩm'} - Ảnh ${index + 1}`,
    }))
  })

  /**
   * Product specifications
   */
  const productSpecs = computed(() => {
    if (!selectedVariant.value) return []

    const v = selectedVariant.value
    return [
      { key: 'name', label: 'Tên sản phẩm', value: v.tenSp },
      { key: 'cpu', label: 'CPU', value: v.tenCpu },
      { key: 'gpu', label: 'GPU', value: v.tenGpu },
      { key: 'ram', label: 'RAM', value: v.tenRam },
      { key: 'storage', label: 'Ổ cứng', value: v.dungLuongOCung },
      { key: 'screen', label: 'Màn hình', value: v.kichThuocManHinh },
      { key: 'color', label: 'Màu sắc', value: v.tenMauSac },
    ].filter((s) => s.value)
  })

  /**
   * Product metadata (code, rating, views)
   */
  const productMetadata = computed(() => {
    const variant = selectedVariant.value
    return {
      code: variant?.maSanPham || product.value?.id || 'Đang cập nhật',
      rating: '5.0',
      reviewCount: '128',
      views: '1.2K',
    }
  })

  /**
   * Load product data
   */
  const loadProduct = async () => {
    if (!productId) {
      error.value = 'Không tìm thấy ID sản phẩm'
      return
    }

    loading.value = true
    error.value = null

    try {
      // The service is expected to return a list of variants (CTSPResponseCustomer)
      const response = await sanPhamService.getProductDetails(productId)
      variants.value = response.data || []

      if (variants.value.length === 0) {
        throw new Error('Sản phẩm không có phiên bản nào hoặc đã hết hàng.')
      }

      console.log('✅ Loaded variants:', variants.value)

      // Set product info from first variant
      const firstVariant = variants.value[0]
      product.value = {
        id: productId,
        name: firstVariant.tenSp,
        description: '', // Description is not in the DTO
      }

      // Auto select first available variant
      const availableVariant = variants.value.find(v => v.soLuongTon > 0) || firstVariant;
      selectedVariantId.value = availableVariant.idctsp

    } catch (err) {
      console.error('Error loading product:', err)
      error.value = err.response?.data?.message || err.message || 'Không thể tải sản phẩm'
    } finally {
      loading.value = false
    }
  }

  /**
   * Handle variant change
   */
  const handleVariantChange = (variant) => {
    console.log('✅ Variant changed:', variant)
    // selectedVariantId is already updated by v-model
  }

  return {
    // State
    loading,
    error,
    product,
    variants,
    selectedVariantId,

    // Computed
    selectedVariant,
    formattedVariants,
    productImages,
    productSpecs,
    productMetadata,

    // Methods
    loadProduct,
    handleVariantChange,
  }
}

