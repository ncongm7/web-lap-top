import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import sanPhamService from '@/service/customer/san_pham_service'

export const useSanPhamStore = defineStore('sanPham', () => {
  // State
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalElements = ref(0)
  const totalPages = ref(0)
  const currentPage = ref(0)
  const pageSize = ref(6) // Giảm page size để dễ test pagination
  
  // Search and filters
  const searchKeyword = ref('')
  const searchSuggestions = ref([])
  const filters = ref({
    keyword: null,
    status: null,
    minPrice: null,
    maxPrice: null
  })
  
  // Sorting
  const sortBy = ref('newest') // newest, price-asc, price-desc, bestseller, name-asc
  
  // Getters
  const hasProducts = computed(() => products.value.length > 0)
  const hasNextPage = computed(() => currentPage.value < totalPages.value - 1)
  const hasPrevPage = computed(() => currentPage.value > 0)
  const isFirstPage = computed(() => currentPage.value === 0)
  const isLastPage = computed(() => currentPage.value === totalPages.value - 1)
  
  // Actions
  const setLoading = (value) => {
    loading.value = value
  }
  
  const setError = (errorMessage) => {
    error.value = errorMessage
  }
  
  const clearError = () => {
    error.value = null
  }
  
  // Fetch products with current filters and search
  const fetchProducts = async (page = currentPage.value) => {
    try {
      setLoading(true)
      setError(null)
      
      const params = {
        page,
        size: pageSize.value,
        sort: getSortParam()
      }
      
      console.log('📋 API request params:', params)
      
      let response
      if (searchKeyword.value || hasActiveFilters.value) {
        // Use advanced search with filters when there's search keyword or active filters
        const searchFilters = {
          keyword: searchKeyword.value,
          ...filters.value
        }
        console.log('🔍 Using advanced search with filters:', searchFilters)
        console.log('🔍 API params:', params)
        response = await sanPhamService.advancedSearch(searchFilters, params)
        console.log('✅ Advanced search response:', response.data)
      } else {
        // Use regular product listing
        console.log('📋 Using regular product listing')
        response = await sanPhamService.getAllProducts(params)
      }
      
      const productsData = response.data.content || []
      
      products.value = productsData
      totalElements.value = response.data.totalElements || 0
      totalPages.value = response.data.totalPages || 0
      currentPage.value = page
      
      // Ensure pagination info is valid
      if (totalPages.value === 0 && totalElements.value > 0) {
        totalPages.value = Math.ceil(totalElements.value / pageSize.value)
        console.log('🔧 Fixed totalPages calculation:', totalPages.value)
      }
      
      console.log('📊 Updated products count:', products.value.length)
      console.log('📊 Updated totalElements:', totalElements.value)
      console.log('📊 Updated totalPages:', totalPages.value)
      console.log('📊 Current page:', currentPage.value)
      console.log('📊 Page size:', pageSize.value)
      console.log('📊 Applied sorting:', sortBy.value)
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm')
      console.error('❌ Error fetching products:', err)
      console.error('❌ Error response:', err.response)
      console.error('❌ Error message:', err.message)
    } finally {
      setLoading(false)
    }
  }
  
  // Frontend sorting for price (since backend doesn't have aggregated price fields)
  const sortProductsByPrice = (products) => {
    return [...products]
  }
  
  // Get sort parameter for API
  const getSortParam = () => {
    console.log('🔄 Getting sort param for:', sortBy.value)
    switch (sortBy.value) {
      case 'name-asc':
        return 'tenSanPham,asc'
      case 'name-desc':
        return 'tenSanPham,desc'
      case 'bestseller':
        // Sort by creation date desc as proxy for popularity
        return 'ngayTao,desc'
      case 'newest':
      default:
        return 'ngayTao,desc'
    }
  }
  
  // Check if there are active filters
  const hasActiveFilters = computed(() => {
    return filters.value.keyword !== null || 
           filters.value.status !== null || 
           filters.value.minPrice !== null || 
           filters.value.maxPrice !== null ||
           searchKeyword.value !== ''
  })
  
  // Search products
  const searchProducts = async (keyword) => {
    searchKeyword.value = keyword
    currentPage.value = 0
    await fetchProducts(0)
  }
  
  // Get search suggestions
  const getSearchSuggestions = async (keyword) => {
    if (!keyword || keyword.length < 2) {
      searchSuggestions.value = []
      return
    }
    
    try {
      const response = await sanPhamService.getSearchSuggestions(keyword)
      searchSuggestions.value = response.data.slice(0, 8) // Limit to 8 suggestions
    } catch (err) {
      console.error('Error fetching suggestions:', err)
      searchSuggestions.value = []
    }
  }
  
  // Clear search
  const clearSearch = () => {
    searchKeyword.value = ''
    searchSuggestions.value = []
  }
  
  // Update filters
  const updateFilter = (filterName, value) => {
    console.log('📦 Store updateFilter:', filterName, value)
    filters.value[filterName] = value
    console.log('📦 Current filters:', filters.value)
    currentPage.value = 0
    fetchProducts(0)
  }
  
  // Update multiple filters
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
    currentPage.value = 0
    fetchProducts(0)
  }
  
  // Clear all filters
  const clearFilters = () => {
    filters.value = {
      keyword: null,
      status: null,
      minPrice: null,
      maxPrice: null
    }
    currentPage.value = 0
    fetchProducts(0)
  }
  
  // Update sorting
  const updateSort = (newSort) => {
    sortBy.value = newSort
    currentPage.value = 0
    fetchProducts(0)
  }
  
  // Pagination
  const goToPage = (page) => {
    if (page >= 0 && page < totalPages.value) {
      fetchProducts(page)
    }
  }
  
  const nextPage = () => {
    if (hasNextPage.value) {
      fetchProducts(currentPage.value + 1)
    }
  }
  
  const prevPage = () => {
    if (hasPrevPage.value) {
      fetchProducts(currentPage.value - 1)
    }
  }
  
  // Get product by ID
  const getProductById = async (id) => {
    try {
      setLoading(true)
      const response = await sanPhamService.getProductById(id)
      return response.data
    } catch (err) {
      setError('Không thể tải thông tin sản phẩm')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  
  return {
    // State
    products,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    pageSize,
    searchKeyword,
    searchSuggestions,
    filters,
    sortBy,
    
    // Getters
    hasProducts,
    hasNextPage,
    hasPrevPage,
    isFirstPage,
    isLastPage,
    
    // Actions
    fetchProducts,
    searchProducts,
    getSearchSuggestions,
    clearSearch,
    updateFilter,
    updateFilters,
    clearFilters,
    updateSort,
    goToPage,
    nextPage,
    prevPage,
    getProductById,
    clearError,
    hasActiveFilters
  }
})