<template>
  <div class="product-listing">
    <div class="main-content">
      <!-- Left Sidebar - Filters -->
      <ProductFilters
        :selected-filters="selectedFilters"
        :price-range="priceRange"
        :has-active-filters="hasActiveFilters"
        @update-filter="updateFilter"
        @clear-filters="clearAllFilters"
        @set-price-preset="setPricePreset"
        @update-price-range="updatePriceRange"
      />

      <!-- Right Content - Products -->
      <main class="products-content">
        <!-- Toolbar -->
        <div class="products-toolbar">
          <div class="results-info">
            <span v-if="!loading">
              Hiển thị {{ products.length }} / {{ totalElements }} sản phẩm
            </span>
          </div>
          
          <div class="sort-controls">
            <label for="sort-select">Sắp xếp:</label>
            <select
              id="sort-select"
              v-model="currentSort"
              @change="handleSortChange"
              class="sort-select"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp → Cao</option>
              <option value="price-desc">Giá: Cao → Thấp</option>
              <option value="bestseller">Bán chạy nhất</option>
              <option value="name-asc">Tên A-Z</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <p>{{ error }}</p>
          <button @click="retryLoad" class="retry-btn">Thử lại</button>
        </div>

        <!-- No Results -->
        <div v-else-if="!hasProducts" class="no-results">
          <div class="no-results-icon">🔍</div>
          <h3>Không tìm thấy sản phẩm</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          <button @click="clearAllFilters" class="clear-all-btn">Xóa tất cả bộ lọc</button>
        </div>

        <!-- Products Grid -->
        <div v-else class="products-grid">
          <ProductCard
            v-for="product in products"
            :key="product.id"
            :product="product"
            @add-to-cart="handleAddToCart"
          />
        </div>

        <!-- Pagination -->
        <div v-if="hasProducts && totalPages > 1" class="pagination">
          <button
            @click="goToPrevPage"
            :disabled="isFirstPage"
            class="pagination-btn"
            :class="{ disabled: isFirstPage }"
          >
            ‹ Trước
          </button>
          
          <div class="pagination-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="goToPage(page - 1)"
              class="pagination-number"
              :class="{ active: page - 1 === currentPage }"
            >
              {{ page }}
            </button>
          </div>
          
          <button
            @click="goToNextPage"
            :disabled="isLastPage"
            class="pagination-btn"
            :class="{ disabled: isLastPage }"
          >
            Sau ›
          </button>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useSanPhamStore } from '@/stores/customer/san_pham_stores'
import ProductCard from '@/components/customer/common/ProductCard.vue'
import ProductFilters from './ProductFilters.vue'

// Store
const sanPhamStore = useSanPhamStore()

// Reactive data
const searchQuery = ref('')
const showSuggestions = ref(false)
const selectedSuggestionIndex = ref(-1)
const priceRange = ref({ min: null, max: null })
const selectedFilters = ref({
  keyword: null,
  status: null
})


// Computed properties
const {
  products,
  loading,
  error,
  totalElements,
  totalPages,
  currentPage,
  searchSuggestions,
  sortBy,
  hasProducts,
  isFirstPage,
  isLastPage,
  hasActiveFilters
} = sanPhamStore

const currentSort = computed({
  get: () => sortBy,
  set: (value) => sanPhamStore.updateSort(value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

// Methods
const handleSearchInput = async () => {
  if (searchQuery.value.length >= 2) {
    await sanPhamStore.getSearchSuggestions(searchQuery.value)
    showSuggestions.value = true
  } else {
    showSuggestions.value = false
  }
}

const handleSearch = () => {
  showSuggestions.value = false
  sanPhamStore.searchProducts(searchQuery.value)
}

const clearSearch = () => {
  searchQuery.value = ''
  showSuggestions.value = false
  sanPhamStore.clearSearch()
  sanPhamStore.fetchProducts()
}

const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.tenSanPham
  showSuggestions.value = false
  sanPhamStore.searchProducts(suggestion.tenSanPham)
}

const highlightKeyword = (text, keyword) => {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const updatePriceFilter = () => {
  sanPhamStore.updateFilters({
    minPrice: priceRange.value.min,
    maxPrice: priceRange.value.max
  })
}

const updatePriceRange = (type, value) => {
  priceRange.value[type] = value
  updatePriceFilter()
}

const setPricePreset = (preset) => {
  priceRange.value.min = preset.min
  priceRange.value.max = preset.max
  updatePriceFilter()
}

const updateFilter = (filterName, value) => {
  selectedFilters.value[filterName] = value
  sanPhamStore.updateFilter(filterName, value)
}

const clearAllFilters = () => {
  // Clear local filters
  priceRange.value = { min: null, max: null }
  selectedFilters.value = {
    keyword: null,
    status: null
  }
  
  // Clear search
  searchQuery.value = ''
  
  // Clear store filters
  sanPhamStore.clearFilters()
  sanPhamStore.clearSearch()
}

const handleSortChange = () => {
  // Sort change is handled by computed property
}

const goToPage = (page) => {
  sanPhamStore.goToPage(page)
}

const goToPrevPage = () => {
  sanPhamStore.prevPage()
}

const goToNextPage = () => {
  sanPhamStore.nextPage()
}

const retryLoad = () => {
  sanPhamStore.fetchProducts()
}

const handleAddToCart = (product) => {
  // TODO: Implement add to cart functionality
  console.log('Add to cart:', product)
}

// Hide suggestions when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.search-container')) {
    showSuggestions.value = false
  }
}

// Lifecycle
onMounted(() => {
  // Load products
  sanPhamStore.fetchProducts()
  document.addEventListener('click', handleClickOutside)
})

// Cleanup
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.product-listing {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* Main Content */
.main-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 30px;
}


/* Products Content */
.products-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.products-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.results-info {
  font-size: 14px;
  color: #6b7280;
}

.sort-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sort-controls label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f4f6;
  border-top: 3px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #ef4444;
}

.retry-btn {
  margin-top: 16px;
  padding: 8px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* No Results */
.no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results h3 {
  margin: 0 0 8px 0;
  color: #374151;
}

.no-results p {
  margin: 0 0 24px 0;
  color: #6b7280;
}

.clear-all-btn {
  padding: 12px 24px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
}

.pagination-btn {
  padding: 8px 16px;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(.disabled) {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: 4px;
}

.pagination-number {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-number:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.pagination-number.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

/* Responsive */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }
  
  .filters-sidebar {
    order: 2;
  }
  
  .products-content {
    order: 1;
  }
}

@media (max-width: 768px) {
  .product-listing {
    padding: 16px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .products-toolbar {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }
  
  .sort-controls {
    justify-content: space-between;
  }
}

/* Highlight search results */
:deep(mark) {
  background-color: #fef08a;
  color: #92400e;
  padding: 2px 4px;
  border-radius: 3px;
}
</style>
