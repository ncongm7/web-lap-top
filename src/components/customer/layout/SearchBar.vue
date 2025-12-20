<template>
    <div class="search-bar">
        <!-- <form @submit.prevent="handleSearch" class="search-form">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm laptop, phụ kiện..." class="search-input"
                @input="handleInput" @focus="showSuggestions = true" @blur="handleBlur"
                @keydown.down.prevent="navigateDown" @keydown.up.prevent="navigateUp"
                @keydown.enter.prevent="handleEnter" />
            <button type="submit" class="search-btn" :disabled="isSearching">
                <span v-if="isSearching" class="spinner"></span>
                <span v-else class="icon">🔍</span>
            </button>
        </form> -->

        <!-- Search Suggestions with Autocomplete -->
        <div v-if="showSuggestions && (suggestions.length > 0 || isLoading || error)" class="search-suggestions">
            <!-- Loading State -->
            <div v-if="isLoading" class="suggestion-loading">
                <span class="spinner-small"></span>
                <span>Đang tìm kiếm...</span>
            </div>

            <!-- Error State -->
            <div v-else-if="error" class="suggestion-error">
                <span>⚠️ {{ error }}</span>
            </div>

            <!-- Suggestions List -->
            <div v-else-if="suggestions.length > 0">
                <div v-for="(item, index) in suggestions" :key="item.id || index" @click="selectSuggestion(item)"
                    @mouseenter="selectedIndex = index" class="suggestion-item"
                    :class="{ 'selected': selectedIndex === index }">
                    <div class="suggestion-image">
                        <img :src="getProductImage(item)" :alt="item.tenSanPham || item.ten"
                            @error="handleImageError" />
                    </div>
                    <div class="suggestion-info">
                        <div class="suggestion-name">{{ item.tenSanPham || item.ten || 'Sản phẩm' }}</div>
                        <div v-if="getProductPrice(item)" class="suggestion-price">
                            {{ formatPrice(getProductPrice(item)) }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- No Results -->
            <div v-else-if="searchQuery.trim().length > 0 && !isLoading" class="suggestion-empty">
                Không tìm thấy sản phẩm nào
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { searchProducts } from '@/service/customer/searchService'
import { formatCurrency } from '@/utils/helpers'

const router = useRouter()
const searchQuery = ref('')
const showSuggestions = ref(false)
const suggestions = ref([])
const isLoading = ref(false)
const isSearching = ref(false)
const error = ref(null)
const selectedIndex = ref(-1)
let debounceTimer = null

// Format price helper
const formatPrice = (price) => {
    if (!price || price === 0) return 'Liên hệ'
    return formatCurrency(price)
}

// Get product image
const getProductImage = (product) => {
    const imageFields = ['anhDaiDien', 'hinhAnh', 'image', 'imageUrl', 'thumbnail']
    for (const field of imageFields) {
        if (product[field] && typeof product[field] === 'string' && product[field].trim() !== '') {
            return product[field]
        }
    }
    // Fallback placeholder
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWc8L3RleHQ+PC9zdmc+'
}

// Handle image error
const handleImageError = (event) => {
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM2NDc0OGIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWc8L3RleHQ+PC9zdmc+'
}

// Get product price
const getProductPrice = (product) => {
    const priceFields = ['giaBan', 'gia', 'price', 'giaThapNhat', 'minPrice']
    for (const field of priceFields) {
        if (product[field] && product[field] > 0) {
            return product[field]
        }
    }
    return null
}

// Handle input with debounce
const handleInput = () => {
    // Clear previous timer
    if (debounceTimer) {
        clearTimeout(debounceTimer)
    }

    // Reset selected index
    selectedIndex.value = -1

    // If query is empty, clear suggestions
    if (!searchQuery.value.trim()) {
        suggestions.value = []
        isLoading.value = false
        error.value = null
        return
    }

    // Show loading state
    isLoading.value = true
    error.value = null

    // Debounce API call (300ms)
    debounceTimer = setTimeout(async () => {
        try {
            const results = await searchProducts(searchQuery.value.trim(), 8)
            suggestions.value = results
            error.value = null
        } catch (err) {
            console.error('Search error:', err)
            error.value = 'Không thể tìm kiếm. Vui lòng thử lại.'
            suggestions.value = []
        } finally {
            isLoading.value = false
        }
    }, 300)
}

// Handle search submit
const handleSearch = () => {
    if (searchQuery.value.trim()) {
        isSearching.value = true
        router.push({
            path: '/products',
            query: { q: searchQuery.value.trim() },
        })
        searchQuery.value = ''
        showSuggestions.value = false
        suggestions.value = []
        setTimeout(() => {
            isSearching.value = false
        }, 500)
    }
}

// Handle suggestion selection
const selectSuggestion = (item) => {
    const productId = item.id || item.idCTSP || item.maSanPham
    if (productId) {
        router.push(`/products/${productId}`)
    } else {
        // Fallback to search page
        router.push({
            path: '/products',
            query: { q: searchQuery.value.trim() },
        })
    }
    searchQuery.value = ''
    showSuggestions.value = false
    suggestions.value = []
    selectedIndex.value = -1
}

// Handle blur with delay to allow click
const handleBlur = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}

// Keyboard navigation
const navigateDown = () => {
    if (selectedIndex.value < suggestions.value.length - 1) {
        selectedIndex.value++
    }
}

const navigateUp = () => {
    if (selectedIndex.value > 0) {
        selectedIndex.value--
    }
}

const handleEnter = () => {
    if (selectedIndex.value >= 0 && suggestions.value[selectedIndex.value]) {
        selectSuggestion(suggestions.value[selectedIndex.value])
    } else {
        handleSearch()
    }
}

// Watch for query changes to hide suggestions when empty
watch(searchQuery, (newVal) => {
    if (!newVal.trim()) {
        suggestions.value = []
        error.value = null
    }
})
</script>

<style scoped>
.search-bar {
    position: relative;
    width: 100%;
}

.search-form {
    display: flex;
    align-items: center;
    background: #f8fafc;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid transparent;
    transition: border-color 0.2s;
}

.search-form:focus-within {
    border-color: #10b981;
}

.search-input {
    flex: 1;
    padding: 12px 16px;
    border: none;
    background: transparent;
    font-size: 14px;
    outline: none;
}

.search-input::placeholder {
    color: #94a3b8;
}

.search-btn {
    padding: 12px 16px;
    background: #10b981;
    border: none;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 48px;
}

.search-btn:hover:not(:disabled) {
    background: #059669;
}

.search-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.search-btn .icon {
    font-size: 18px;
    filter: brightness(0) invert(1);
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.search-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 4px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    border: 1px solid #e2e8f0;
}

.suggestion-loading,
.suggestion-error,
.suggestion-empty {
    padding: 16px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
}

.suggestion-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.spinner-small {
    width: 14px;
    height: 14px;
    border: 2px solid #e2e8f0;
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

.suggestion-error {
    color: #ef4444;
}

.suggestion-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s;
}

.suggestion-item:hover,
.suggestion-item.selected {
    background: #f8fafc;
}

.suggestion-item:last-child {
    border-bottom: none;
}

.suggestion-image {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    border-radius: 6px;
    overflow: hidden;
    background: #f1f5f9;
}

.suggestion-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.suggestion-info {
    flex: 1;
    min-width: 0;
}

.suggestion-name {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.suggestion-price {
    font-size: 13px;
    font-weight: 600;
    color: #ef4444;
}

/* Scrollbar styling */
.search-suggestions::-webkit-scrollbar {
    width: 6px;
}

.search-suggestions::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
}

.search-suggestions::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}
</style>
