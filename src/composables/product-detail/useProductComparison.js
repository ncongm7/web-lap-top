import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'product_comparison_list'
const MAX_COMPARISON = 4

/**
 * ========================================
 * COMPOSABLE: useProductComparison
 * ========================================
 * Quản lý danh sách so sánh sản phẩm (localStorage)
 */
export function useProductComparison() {
  // State
  const comparisonList = ref([])

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
   * Initialize
   */
  loadFromStorage()

  /**
   * Watch for changes and save
   */
  watch(comparisonList, () => {
    saveToStorage()
  }, { deep: true })

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
    if (!product || !product.id) {
      throw new Error('Product ID is required')
    }

    if (isInComparison(product.id)) {
      return false // Already in list
    }

    if (!canAddMore.value) {
      throw new Error(`Chỉ có thể so sánh tối đa ${MAX_COMPARISON} sản phẩm`)
    }

    comparisonList.value.push({
      id: product.id,
      name: product.tenSanPham || product.name,
      image: product.image || product.images?.[0]?.url,
      price: product.price || product.giaBan,
      ...product, // Keep all product data
    })

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

