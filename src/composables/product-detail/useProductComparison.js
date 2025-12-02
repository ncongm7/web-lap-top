import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'product_comparison_list'
const MAX_COMPARISON = 3 // Tối đa 3 sản phẩm để so sánh

// Singleton state - đảm bảo tất cả components dùng chung một instance
const globalComparisonList = ref([])
let isInitialized = false
let storageWatcher = null

/**
 * ========================================
 * COMPOSABLE: useProductComparison
 * ========================================
 * Quản lý danh sách so sánh sản phẩm (localStorage)
 * Sử dụng singleton pattern để đảm bảo tất cả components dùng chung state
 */
export function useProductComparison() {
  // Sử dụng global state thay vì tạo mới mỗi lần
  const comparisonList = globalComparisonList

  /**
   * Load từ localStorage
   */
  const loadFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        comparisonList.value = JSON.parse(stored)
      }
    } catch (err) {
      console.error('Error loading comparison list from storage:', err)
      comparisonList.value = []
    }
  }

  /**
   * Save to localStorage
   */
  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(comparisonList.value))
    } catch (err) {
      console.error('Error saving comparison list to storage:', err)
    }
  }

  /**
   * Initialize - chỉ load một lần khi module được import lần đầu
   */
  if (!isInitialized) {
    loadFromStorage()
    isInitialized = true

    /**
     * Watch for changes and save - chỉ setup một lần
     */
    storageWatcher = watch(comparisonList, () => {
      saveToStorage()
      console.log('🔵 [useProductComparison] comparisonList changed, saved to storage:', comparisonList.value.length, 'items')
    }, { deep: true })

    /**
     * Listen to storage events để sync giữa các tabs/windows
     */
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        console.log('🔵 [useProductComparison] Storage changed, reloading...')
        loadFromStorage()
      }
    }

    // Setup storage event listener
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
    }
  }

  /**
   * Check if product is in comparison list
   */
  const isInComparison = (productId) => {
    return comparisonList.value.some(p => p.id === productId)
  }

  /**
   * Check if can add more products
   */
  const canAddMore = computed(() => {
    return comparisonList.value.length < MAX_COMPARISON
  })

  /**
   * Add product to comparison
   */
  const addToComparison = (product) => {
    console.log('🔵 [useProductComparison] addToComparison called with:', {
      id: product?.id,
      name: product?.name || product?.tenSanPham,
      variantId: product?.variantId
    })

    if (!product || !product.id) {
      throw new Error('Product ID is required')
    }

    if (isInComparison(product.id)) {
      console.log('⚠️ [useProductComparison] Product already in comparison:', product.id)
      return false // Already in list
    }

    if (!canAddMore.value) {
      throw new Error(`Chỉ có thể so sánh tối đa ${MAX_COMPARISON} sản phẩm`)
    }

    const newItem = {
      id: product.id,
      name: product.tenSanPham || product.name,
      image: product.image || product.images?.[0]?.url,
      price: product.price || product.giaBan,
      ...product, // Keep all product data
    }

    comparisonList.value.push(newItem)
    console.log('✅ [useProductComparison] Added to comparison. New length:', comparisonList.value.length)
    console.log('📊 [useProductComparison] Current list:', comparisonList.value.map(p => ({ id: p.id, name: p.name || p.tenSanPham })))

    return true
  }

  /**
   * Remove product from comparison
   */
  const removeFromComparison = (productId) => {
    const index = comparisonList.value.findIndex(p => p.id === productId)
    if (index > -1) {
      comparisonList.value.splice(index, 1)
      return true
    }
    return false
  }

  /**
   * Clear comparison list
   */
  const clearComparison = () => {
    comparisonList.value = []
  }

  /**
   * Toggle product in comparison
   */
  const toggleComparison = (product) => {
    if (isInComparison(product.id)) {
      removeFromComparison(product.id)
      return false
    } else {
      return addToComparison(product)
    }
  }

  return {
    // State
    comparisonList,

    // Computed
    canAddMore,

    // Methods
    isInComparison,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparison,
    loadFromStorage,
  }
}

