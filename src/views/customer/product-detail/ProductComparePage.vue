<template>
  <div class="compare-page">
    <div class="compare-container">
      <!-- Header -->
      <div class="compare-header">
        <h1 class="page-title">So sánh sản phẩm</h1>
        <button v-if="comparisonList.length > 0" class="clear-btn" @click="handleClearAll">
          Xóa tất cả
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="comparisonList.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon">
          <path
            d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          ></path>
        </svg>
        <h2 class="empty-title">Chưa có sản phẩm nào để so sánh</h2>
        <p class="empty-text">Thêm sản phẩm vào danh sách so sánh để xem chi tiết</p>
        <router-link to="/products" class="browse-btn">
          Xem sản phẩm
        </router-link>
      </div>

      <!-- Comparison Table - Hiển thị khi có items trong comparisonList -->
      <div v-else class="compare-content">
        <div class="compare-table-wrapper">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="sticky-col">Thông số</th>
                <th v-for="product in (productsWithDetails.length > 0 ? productsWithDetails : comparisonList)" :key="product.id" class="product-col">
                  <div class="product-header">
                    <button class="remove-btn" @click="handleRemove(product.id)" title="Xóa">
                      ×
                    </button>
                    <div class="product-image">
                      <img :src="product.image || product.imageUrl || getPlaceholderImage()" :alt="product.name || product.tenSanPham" />
                    </div>
                    <h3 class="product-name">{{ product.name || product.tenSanPham }}</h3>
                    <div class="product-price">
                      {{ formatPrice(product.price || product.giaBan) }}
                    </div>
                    <router-link :to="`/products/${product.productId || product.id?.replace('variant-', '').replace('product-', '') || product.id}`" class="view-detail-btn">
                      Xem chi tiết
                    </router-link>
                  </div>
                </th>
                <!-- Placeholder slots for remaining items -->
                <th v-for="n in (3 - (productsWithDetails.length > 0 ? productsWithDetails.length : comparisonList.length))" :key="`placeholder-${n}`" class="product-col placeholder-col">
                  <div class="product-header placeholder-header">
                    <div class="placeholder-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </div>
                    <p class="placeholder-text">Thêm sản phẩm</p>
                    <router-link to="/products" class="add-product-btn">
                      Thêm
                    </router-link>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <template v-if="loading">
                <tr>
                  <td :colspan="(productsWithDetails.length > 0 ? productsWithDetails : comparisonList).length + 1" class="loading-cell">
                    <div class="loading-spinner"></div>
                    <p>Đang tải thông số kỹ thuật...</p>
                  </td>
                </tr>
              </template>
              <template v-else>
                <!-- Sử dụng productsWithDetails nếu có, nếu không thì dùng comparisonList -->
                <template v-if="productsWithDetails.length > 0">
                  <!-- Basic Info -->
                  <tr class="section-row">
                    <td :colspan="productsWithDetails.length + 1" class="section-header">Thông tin cơ bản</td>
                  </tr>
                <tr>
                  <td class="spec-label">Tên sản phẩm</td>
                  <td v-for="product in productsWithDetails" :key="product.id" class="spec-value">
                    {{ product.name || product.tenSanPham }}
                  </td>
                </tr>
                <tr>
                  <td class="spec-label">Giá</td>
                  <td v-for="product in productsWithDetails" :key="product.id" class="spec-value">
                    {{ formatPrice(product.price || product.giaBan) }}
                  </td>
                </tr>

                <!-- Technical Specifications by Category -->
                <template v-for="category in allCategories" :key="category">
                  <tr class="section-row">
                    <td :colspan="productsWithDetails.length + 1" class="section-header">
                      {{ category }}
                    </td>
                  </tr>
                  <template v-for="specKey in allSpecKeys" :key="specKey">
                    <template v-if="productsWithDetails.some(p => {
                      const spec = p.specs?.find(s => s.key === specKey)
                      return spec && spec.category === category
                    })">
                      <tr>
                        <td class="spec-label">
                          {{ getSpecLabel(specKey) }}
                        </td>
                        <td v-for="product in productsWithDetails" :key="product.id" class="spec-value">
                          <span v-if="specKey === 'color' && getSpecValue(product, specKey) !== '-'" class="color-value">
                            <span class="color-dot" :style="{ backgroundColor: getSpecValue(product, specKey) }"></span>
                            {{ getSpecValue(product, specKey) }}
                          </span>
                          <span v-else>
                            {{ getSpecValue(product, specKey) }}
                          </span>
                        </td>
                      </tr>
                    </template>
                  </template>
                </template>
                </template>
                <!-- Fallback: hiển thị thông báo nếu không có productsWithDetails -->
                <template v-else>
                  <tr>
                    <td :colspan="comparisonList.length + 1" class="loading-cell">
                      <p>Đang tải thông tin sản phẩm... Vui lòng đợi trong giây lát.</p>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="compare-actions">
          <button class="add-to-cart-all-btn" @click="handleAddAllToCart">
            Thêm tất cả vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useProductComparison } from '@/composables/product-detail/useProductComparison'
import { sanPhamService } from '@/service/customer/san_pham_service'

const { comparisonList, clearComparison, removeFromComparison } = useProductComparison()

// Load full product details
const productsWithDetails = ref([])
const loading = ref(false)

const loadProductDetails = async () => {
  console.log('🔵 [ProductComparePage] loadProductDetails called, comparisonList.length:', comparisonList.value.length)

  if (comparisonList.value.length === 0) {
    productsWithDetails.value = []
    return
  }

  console.log('🔵 [ProductComparePage] Starting to load', comparisonList.value.length, 'products')
  loading.value = true

  try {
    const promises = comparisonList.value.map(async (product, index) => {
      // Nếu đã có đầy đủ thông tin (specs, variant, variantId), không cần load lại
      // Nhưng vẫn cần đảm bảo có productId
      if (product.specs && product.variant && product.variantId && product.productId) {
        console.log(`✅ [ProductComparePage] [${index}] Sử dụng data có sẵn cho:`, product.id, 'variant:', product.variantId)
        return product
      }

      console.log(`🔵 [ProductComparePage] [${index}] Cần load data cho:`, product.id, {
        hasSpecs: !!product.specs,
        hasVariant: !!product.variant,
        hasVariantId: !!product.variantId,
        hasProductId: !!product.productId
      })

      try {
        // Ưu tiên dùng productId (ID sản phẩm chính), không phải variant ID
        // Nếu product.id bắt đầu bằng "variant-", thì cần dùng productId
        let productIdToLoad = null

        if (product.productId) {
          // Có productId rõ ràng, dùng nó
          productIdToLoad = product.productId
        } else if (product.id && product.id.startsWith('variant-')) {
          // Nếu id là "variant-{variantId}", cần lấy productId từ variant
          // Nhưng không có productId, nên cần load từ variant
          // Tạm thời dùng logic cũ: parse từ id

          // Không thể load product từ variantId, cần có productId
          console.warn('⚠️ [ProductComparePage] Không có productId cho variant:', product.id)
          // Nếu có variantId trong product, có thể dùng nó để tìm variant
          if (product.variantId) {
            // Cần productId để load, nhưng không có
            // Fallback: dùng variant đã có sẵn
            if (product.variant) {
              return product
            }
          }
          return product
        } else if (product.id && product.id.startsWith('product-')) {
          // Nếu id là "product-{productId}", parse ra productId
          productIdToLoad = product.id.replace('product-', '')
        } else {
          // Có thể id chính là productId
          productIdToLoad = product.id
        }

        if (!productIdToLoad) {
          console.warn('⚠️ [ProductComparePage] Không tìm thấy productId để load:', product.id)
          return product
        }

        console.log('🔵 [ProductComparePage] Loading product:', productIdToLoad, 'for comparison item:', product.id)

        const response = await sanPhamService.getProductDetail(productIdToLoad)
        const fullProduct = response.data?.data || response.data

        if (fullProduct) {
          // Tìm variant đã chọn - ưu tiên variantId từ product
          let variant = null
          if (product.variantId && fullProduct.variants) {
            variant = fullProduct.variants.find(v => v.id === product.variantId)
            console.log('✅ [ProductComparePage] Tìm thấy variant:', product.variantId, variant ? 'có' : 'không')
          }

          // Nếu không tìm thấy variant theo variantId, thử parse từ comparisonId
          if (!variant && product.id && product.id.startsWith('variant-')) {
            const variantIdFromComparisonId = product.id.replace('variant-', '')
            // Tìm variant theo ID (có thể là string hoặc UUID)
            variant = fullProduct.variants?.find(v => {
              // So sánh cả string và UUID
              return v.id === variantIdFromComparisonId ||
                     String(v.id) === String(variantIdFromComparisonId) ||
                     v.id?.toString() === variantIdFromComparisonId?.toString()
            })
            console.log('🔵 [ProductComparePage] Tìm variant từ comparisonId:', variantIdFromComparisonId, variant ? 'có' : 'không')
          }

          // Nếu vẫn không tìm thấy, thử tìm trong product.variant đã có sẵn
          if (!variant && product.variant && product.variant.id) {
            variant = fullProduct.variants?.find(v => {
              return v.id === product.variant.id ||
                     String(v.id) === String(product.variant.id) ||
                     v.id?.toString() === product.variant.id?.toString()
            })
            console.log('🔵 [ProductComparePage] Tìm variant từ product.variant:', product.variant.id, variant ? 'có' : 'không')
          }

          // Fallback: lấy variant đầu tiên nếu không tìm thấy (NHƯNG chỉ khi không có variantId cụ thể)
          // Nếu có variantId nhưng không tìm thấy, có thể là lỗi, nên không dùng fallback
          if (!variant && !product.variantId && !product.id?.startsWith('variant-') && fullProduct.variants?.length > 0) {
            variant = fullProduct.variants[0]
            console.log('⚠️ [ProductComparePage] Dùng variant đầu tiên làm fallback (không có variantId cụ thể)')
          }

          // Nếu vẫn không có variant và có variantId, có thể là lỗi
          if (!variant && (product.variantId || product.id?.startsWith('variant-'))) {
            console.error('❌ [ProductComparePage] Không tìm thấy variant cho:', {
              comparisonId: product.id,
              variantId: product.variantId,
              availableVariants: fullProduct.variants?.map(v => v.id)
            })
          }

          // Tạo specs từ variant
          const specs = variant ? [
            { key: 'cpu', label: 'CPU', value: variant.cpu, category: 'Hiệu năng' },
            { key: 'gpu', label: 'GPU', value: variant.gpu, category: 'Hiệu năng' },
            { key: 'ram', label: 'RAM', value: variant.ram, category: 'Hiệu năng' },
            { key: 'storage', label: 'Ổ cứng', value: variant.oCung, category: 'Lưu trữ' },
            { key: 'screen', label: 'Màn hình', value: variant.kichThuocManHinh, category: 'Màn hình' },
            { key: 'color', label: 'Màu sắc', value: variant.mauSac, category: 'Thiết kế' },
            { key: 'battery', label: 'Pin', value: variant.dungLuongPin, category: 'Pin' },
          ].filter(s => s.value) : []

          const result = {
            ...product,
            ...fullProduct,
            specs,
            variant: variant || product.variant,
            variantId: variant?.id || product.variantId,
            variants: fullProduct.variants || [],
            // Đảm bảo giữ nguyên comparisonId
            id: product.id,
            // Đảm bảo có productId
            productId: productIdToLoad,
          }

          console.log('✅ [ProductComparePage] Loaded product details:', result.id, 'variant:', result.variantId)
          return result
        }
        return product
      } catch (error) {
        console.error(`❌ [ProductComparePage] Error loading product ${product.id}:`, error)
        return product
      }
    })

    const results = await Promise.all(promises)

    // Filter out any null/undefined results và đảm bảo có data
    productsWithDetails.value = results.filter(p => p != null && p.id != null)

    console.log('✅ [ProductComparePage] Loaded products:', productsWithDetails.value.length, 'items')
    console.log('📊 [ProductComparePage] Products details:', productsWithDetails.value.map(p => ({
      id: p.id,
      name: p.name || p.tenSanPham,
      variantId: p.variantId,
      hasSpecs: !!p.specs,
      hasVariant: !!p.variant
    })))

    // Nếu không có products sau khi load, dùng comparisonList làm fallback
    if (productsWithDetails.value.length === 0 && comparisonList.value.length > 0) {
      console.warn('⚠️ [ProductComparePage] Không load được products, dùng comparisonList làm fallback')
      productsWithDetails.value = comparisonList.value
    }
  } catch (error) {
    console.error('❌ [ProductComparePage] Error loading product details:', error)
    // Fallback: dùng comparisonList nếu có lỗi
    productsWithDetails.value = comparisonList.value.length > 0 ? comparisonList.value : []
  } finally {
    loading.value = false
  }
}

// Watch comparisonList changes
watch(comparisonList, () => {
  loadProductDetails()
}, { deep: true, immediate: true })

const handleRemove = (productId) => {
  removeFromComparison(productId)
  if (comparisonList.value.length === 0) {
    // Optionally redirect to products page
  }
}

const handleClearAll = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách so sánh?')) {
    clearComparison()
  }
}

const handleAddAllToCart = () => {
  // TODO: Implement add all to cart
  console.log('Add all to cart:', comparisonList.value)
}

// Get all unique spec keys from all products
const allSpecKeys = computed(() => {
  const keys = new Set()
  productsWithDetails.value.forEach(product => {
    if (product.specs && Array.isArray(product.specs)) {
      product.specs.forEach(spec => {
        if (spec.key) {
          keys.add(spec.key)
        }
      })
    }
  })
  return Array.from(keys)
})

const allCategories = computed(() => {
  const categories = new Set()
  productsWithDetails.value.forEach(product => {
    if (product.specs && Array.isArray(product.specs)) {
      product.specs.forEach(spec => {
        if (spec.category) {
          categories.add(spec.category)
        }
      })
    }
  })
  return Array.from(categories).sort()
})

// Get spec value for a product

// Get spec value for a product
const getSpecValue = (product, specKey) => {
  if (!product.specs || !Array.isArray(product.specs)) {
    // Fallback: try to get from variant
    const variant = product.variant || product.variants?.[0]
    if (variant) {
      const specMap = {
        cpu: variant.cpu,
        gpu: variant.gpu,
        ram: variant.ram,
        storage: variant.oCung,
        screen: variant.kichThuocManHinh,
        color: variant.mauSac,
        battery: variant.dungLuongPin,
      }
      return specMap[specKey] || '-'
    }
    return '-'
  }

  const spec = product.specs.find(s => s.key === specKey)
  return spec?.value || '-'
}

// Get spec label
const getSpecLabel = (specKey) => {
  const labels = {
    cpu: 'CPU',
    gpu: 'GPU',
    ram: 'RAM',
    storage: 'Ổ cứng',
    screen: 'Màn hình',
    color: 'Màu sắc',
    battery: 'Pin',
  }
  return labels[specKey] || specKey
}

const formatPrice = (price) => {
  if (!price) return '-'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getPlaceholderImage = () => {
  return 'https://via.placeholder.com/200x200.png?text=No+Image'
}

// Load product details on mount
onMounted(() => {
  loadProductDetails()
})
</script>

<style scoped>
.compare-page {
  min-height: 100vh;
  background: #f5f5f7;
  padding: 24px;
}

.compare-container {
  max-width: 1400px;
  margin: 0 auto;
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
}

.clear-btn {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #d1d5db;
  margin: 0 auto 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
}

.browse-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #1d4ed8;
}

.compare-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.compare-table-wrapper {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 10;
  padding: 16px;
  font-weight: 600;
  color: #1a1a1a;
  border-right: 2px solid #e5e7eb;
  text-align: left;
}

.product-col {
  min-width: 250px;
  padding: 0;
  vertical-align: top;
}

.product-header {
  padding: 20px;
  text-align: center;
  position: relative;
  border-right: 1px solid #e5e7eb;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #dc2626;
}

.product-image {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f7;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  min-height: 48px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 16px;
}

.view-detail-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.view-detail-btn:hover {
  background: #1d4ed8;
}

.section-row {
  background: #f9fafb;
}

.section-header {
  padding: 16px;
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
  text-align: left;
}

.spec-label {
  padding: 16px;
  font-weight: 600;
  color: #374151;
  background: white;
  border-right: 2px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.spec-value {
  padding: 16px;
  text-align: center;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  color: #1a1a1a;
}

.compare-actions {
  padding: 24px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.add-to-cart-all-btn {
  padding: 14px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart-all-btn:hover {
  background: #1d4ed8;
}

.loading-cell {
  padding: 40px;
  text-align: center;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.color-value {
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.color-dot {
  display: inline-block;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .compare-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .compare-table {
    min-width: 600px;
  }

  .product-header {
    padding: 16px;
  }


  .product-image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

/* Placeholder Styles */
.placeholder-col {
  vertical-align: top;
  background: #f9fafb;
}

.placeholder-header {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 250px;
  border-right: 1px dashed #d1d5db;
}

.placeholder-icon {
  width: 48px;
  height: 48px;
  color: #9ca3af;
  margin-bottom: 12px;
  background: white;
  border-radius: 50%;
  padding: 10px;
  border: 1px dashed #d1d5db;
}

.placeholder-text {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 16px;
}

.add-product-btn {
  padding: 8px 24px;
  background: white;
  color: #2563eb;
  border: 1px solid #2563eb;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.add-product-btn:hover {
  background: #2563eb;
  color: white;
}
</style>

