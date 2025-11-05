<template>
    <div class="search-bar">
        <form @submit.prevent="handleSearch" class="search-form">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm laptop, phụ kiện..." class="search-input"
                @focus="showSuggestions = true" @blur="hideSuggestions" />
            <button type="submit" class="search-btn">
                <span class="icon">🔍</span>
            </button>
        </form>

        <!-- Search Suggestions (Optional - Phase 2) -->
        <div v-if="showSuggestions && suggestions.length > 0" class="search-suggestions">
            <div v-for="item in suggestions" :key="item.id" @click="selectSuggestion(item)" class="suggestion-item">
                {{ item.tenSanPham }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const searchQuery = ref('')
const showSuggestions = ref(false)
const suggestions = ref([])

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        router.push({
            path: '/products',
            query: { q: searchQuery.value.trim() },
        })
        searchQuery.value = ''
        showSuggestions.value = false
    }
}

const selectSuggestion = (item) => {
    router.push(`/products/${item.id}`)
    searchQuery.value = ''
    showSuggestions.value = false
}

const hideSuggestions = () => {
    setTimeout(() => {
        showSuggestions.value = false
    }, 200)
}
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
}

.search-btn:hover {
    background: #059669;
}

.search-btn .icon {
    font-size: 18px;
    filter: brightness(0) invert(1);
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
    max-height: 300px;
    overflow-y: auto;
    z-index: 100;
}

.suggestion-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s;
}

.suggestion-item:hover {
    background: #f8fafc;
}

.suggestion-item:last-child {
    border-bottom: none;
}
</style>



