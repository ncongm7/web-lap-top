<template>
  <aside class="filters-sidebar">
    <div class="filters-header">
      <h3>Bộ lọc</h3>
      <button v-if="hasActiveFilters" @click="$emit('clear-filters')" class="clear-filters-btn">
        Xóa bộ lọc
      </button>
    </div>

    <!-- Search Filter -->
    <div class="filter-section">
      <h4>Tìm kiếm theo tên/mã</h4>
      <div class="search-input-wrapper">
        <input
          :value="selectedFilters.keyword"
          @input="updateKeyword($event.target.value)"
          type="text"
          placeholder="Nhập tên hoặc mã sản phẩm..."
          class="search-filter-input"
        />
        <button 
          v-if="selectedFilters.keyword" 
          @click="clearKeyword" 
          class="clear-keyword-btn"
        >
          ×
        </button>
      </div>
    </div>

    <!-- Price Filter -->
    <div class="filter-section">
      <h4>Khoảng giá</h4>
      <div class="price-inputs">
        <input
          :value="priceRange.min"
          @input="updatePriceRange('min', $event.target.value)"
          type="number"
          placeholder="Từ"
          class="price-input"
        />
        <span class="price-separator">-</span>
        <input
          :value="priceRange.max"
          @input="updatePriceRange('max', $event.target.value)"
          type="number"
          placeholder="Đến"
          class="price-input"
        />
      </div>
    </div>

    <!-- Status Filter -->
    <div class="filter-section">
      <h4>Trạng thái</h4>
      <div class="filter-options">
        <label v-for="status in statusOptions" :key="status.value" class="filter-option">
          <input
            :checked="selectedFilters.status === status.value"
            type="radio"
            @change="$emit('update-filter', 'status', status.value)"
          />
          <span>{{ status.label }}</span>
        </label>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  selectedFilters: {
    type: Object,
    required: true
  },
  priceRange: {
    type: Object,
    required: true
  },
  hasActiveFilters: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update-filter',
  'clear-filters',
  'set-price-preset',
  'update-price-range'
])

// Debounce timer for keyword search
const keywordTimer = ref(null)

const statusOptions = [
  { label: 'Tất cả', value: null },
  { label: 'Còn hàng', value: 1 },
  { label: 'Hết hàng', value: 0 }
]

const updatePriceRange = (type, value) => {
  const numValue = value ? Number(value) : null
  emit('update-price-range', type, numValue)
}

const updateKeyword = (value) => {
  // Clear existing timer
  if (keywordTimer.value) {
    clearTimeout(keywordTimer.value)
  }
  
  // Debounce the keyword search
  keywordTimer.value = setTimeout(() => {
    emit('update-filter', 'keyword', value.trim() || null)
  }, 500) // Wait 500ms after user stops typing
}

const clearKeyword = () => {
  if (keywordTimer.value) {
    clearTimeout(keywordTimer.value)
  }
  emit('update-filter', 'keyword', null)
}
</script>

<style scoped>
.filters-sidebar {
  background: white;
  border-radius: 12px;
  padding: 24px;
  height: fit-content;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.filters-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
}

.clear-filters-btn {
  background: none;
  border: none;
  color: #ef4444;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
}

.filter-section {
  margin-bottom: 24px;
}

.filter-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #374151;
}

/* Search Filter */
.search-input-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.search-filter-input {
  width: 100%;
  padding: 8px 32px 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.search-filter-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.clear-keyword-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 18px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.clear-keyword-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* Price Filter */
.price-inputs {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
}

.price-input {
  flex: 1;
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 13px;
  width: 0; /* Force equal width distribution */
  min-width: 60px;
}

.price-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.price-separator {
  color: #6b7280;
  font-weight: 500;
  font-size: 14px;
  flex-shrink: 0;
}

.price-presets {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.price-preset-btn {
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.price-preset-btn:hover {
  background: #f1f5f9;
}

.price-preset-btn.active {
  background: #dbeafe;
  border-color: #3b82f6;
  color: #1d4ed8;
}

/* Filter Options */
.filter-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 0;
}

.filter-option input[type="radio"] {
  margin: 0;
}

.filter-option span {
  font-size: 14px;
  color: #374151;
  flex: 1;
}

.color-swatch {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid #d1d5db;
  margin-left: auto;
}

/* Scrollbar styling */
.filter-options::-webkit-scrollbar {
  width: 4px;
}

.filter-options::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 2px;
}

.filter-options::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
