import { ref, computed } from 'vue'
import { sanPhamService } from '@/service/customer/san_pham_service'
import { withDescription } from '@/utils/product-detail/formatters'

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
  const productImagesMap = ref({})

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
      const variantId = v.idctsp || v.id || v.idCTSP

      return {
        id: variantId,
        attributes: {
          cpu: v.tenCpu,
          gpu: v.tenGpu,
          ram: v.tenRam,
          storage: v.dungLuongOCung,
          color: v.tenMauSac,
          screen: v.kichThuocManHinh,
        },
        price: v.giaSauGiam || v.giaBan,
        originalPrice: v.giaTruocGiam || v.giaBan,
        stock: v.soLuongTon || v.soLuong || 0,
        summary: [v.tenCpu, v.tenGpu, v.tenRam, v.dungLuongOCung].filter(Boolean).join(' | '),
        ...v, // Keep all original data
      }
    })
  })

  /**
   * Product images for selected variant
   */
  const productImages = computed(() => {
    if (!selectedVariantId.value) return []

    const images = productImagesMap.value[selectedVariantId.value] || []

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

  /**
   * Product specifications
   */
  const productSpecs = computed(() => {
    if (!selectedVariant.value) return []

    const v = selectedVariant.value
    return [
      { key: 'name', label: 'Tên sản phẩm', value: v.tenSp },
      { key: 'cpu', label: 'CPU', value: withDescription(v.tenCpu, v.moTaCpu) },
      { key: 'gpu', label: 'GPU', value: withDescription(v.tenGpu, v.moTaGpu) },
      { key: 'ram', label: 'RAM', value: withDescription(v.tenRam, v.moTaRam) },
      { key: 'storage', label: 'Ổ cứng', value: withDescription(v.dungLuongOCung, v.moTaOCung) },
      { key: 'screen', label: 'Màn hình', value: withDescription(v.kichThuocManHinh, v.moTaManHinh) },
      { key: 'battery', label: 'Pin', value: withDescription(v.dungLuongPin, v.moTaPin) },
      { key: 'color', label: 'Màu sắc', value: v.tenMauSac, hex: v.hexCodeMauSac },
      { key: 'weight', label: 'Trọng lượng', value: v.trongLuong },
    ].filter((s) => s.value)
  })

  /**
   * Product metadata (code, rating, views)
   */
  const productMetadata = computed(() => {
    const variant = selectedVariant.value
    return {
      code: variant?.maSp || variant?.sku || variant?.model || variant?.id || product.value?.id || 'Đang cập nhật',
      rating: '5.0',
      reviewCount: '128',
      views: variant?.luotXem || variant?.viewCount || '1.2K',
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
      const response = await sanPhamService.getProductDetails(productId)
      variants.value = response.data || []

      if (variants.value.length === 0) {
        throw new Error('Sản phẩm không có phiên bản nào')
      }

      console.log('✅ Loaded variants:', variants.value)

      // Set product info from first variant
      const firstVariant = variants.value[0]
      product.value = {
        id: productId,
        name: firstVariant.tenSp || firstVariant.tenSanPham,
        description: firstVariant.moTaSp || firstVariant.moTa || '',
      }

      // Auto select first variant
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

  /**
   * Load images for all variants
   */
  const loadAllVariantImages = async () => {
    const imagePromises = variants.value.map(async (variant) => {
      try {
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
    productImagesMap,

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

