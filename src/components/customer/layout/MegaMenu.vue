<template>
    <div v-if="isVisible" class="mega-menu" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div class="mega-menu-container">
            <div v-if="isLoading" class="mega-menu-loading">
                <span class="spinner"></span>
                <span>Đang tải...</span>
            </div>

            <div v-else-if="error" class="mega-menu-error">
                <span>⚠️ {{ error }}</span>
            </div>

            <div v-else-if="categories.length > 0" class="mega-menu-grid">
                <router-link v-for="category in categories" :key="category.id || category.maDanhMuc"
                    :to="getCategoryLink(category)" class="mega-menu-item" @click="handleCategoryClick">
                    <div class="category-icon">
                        <span v-if="category.icon">{{ category.icon }}</span>
                        <span v-else class="default-icon">📦</span>
                    </div>
                    <div class="category-info">
                        <h3 class="category-name">{{ category.tenDanhMuc || category.name || 'Danh mục' }}</h3>
                        <p v-if="category.productCount !== undefined" class="category-count">
                            {{ category.productCount }} sản phẩm
                        </p>
                        <p v-else-if="category.soLuongSanPham !== undefined" class="category-count">
                            {{ category.soLuongSanPham }} sản phẩm
                        </p>
                    </div>
                </router-link>
            </div>

            <div v-else class="mega-menu-empty">
                <span>Không có danh mục nào</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '@/service/customer/categoryService'

const props = defineProps({
    isVisible: {
        type: Boolean,
        default: false,
    },
})

const emit = defineEmits(['close'])

const router = useRouter()
const categories = ref([])
const isLoading = ref(false)
const error = ref(null)
let mouseLeaveTimer = null

// Fetch categories
const fetchCategories = async () => {
    if (categories.value.length > 0) {
        return // Already loaded
    }

    try {
        isLoading.value = true
        error.value = null

        const data = await getCategories()

        // Map data to consistent format
        categories.value = data.map(cat => ({
            id: cat.id || cat.maDanhMuc,
            maDanhMuc: cat.maDanhMuc || cat.id,
            tenDanhMuc: cat.tenDanhMuc || cat.name,
            name: cat.name || cat.tenDanhMuc,
            productCount: cat.productCount || cat.soLuongSanPham || 0,
            soLuongSanPham: cat.soLuongSanPham || cat.productCount || 0,
            icon: cat.icon || cat.iconUrl || '',
            slug: cat.slug || generateSlug(cat.tenDanhMuc || cat.name || ''),
        }))

        console.log('✅ [MegaMenu] Loaded categories:', categories.value.length)
    } catch (err) {
        console.error('❌ [MegaMenu] Error loading categories:', err)
        error.value = 'Không thể tải danh mục'
        categories.value = []
    } finally {
        isLoading.value = false
    }
}

// Generate slug from text
const generateSlug = (text) => {
    if (!text) return ''
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// Get category link
const getCategoryLink = (category) => {
    const categoryId = category.id || category.maDanhMuc
    if (categoryId) {
        return `/products?category=${categoryId}`
    }
    return '/products'
}

// Handle category click
const handleCategoryClick = () => {
    emit('close')
}

// Handle mouse enter
const handleMouseEnter = () => {
    if (mouseLeaveTimer) {
        clearTimeout(mouseLeaveTimer)
        mouseLeaveTimer = null
    }
}

// Handle mouse leave
const handleMouseLeave = () => {
    mouseLeaveTimer = setTimeout(() => {
        emit('close')
    }, 200)
}

// Watch for visibility changes
watch(() => props.isVisible, (newVal) => {
    if (newVal && categories.value.length === 0) {
        fetchCategories()
    }
})

// Load categories on mount if visible
onMounted(() => {
    if (props.isVisible) {
        fetchCategories()
    }
})
</script>

<style scoped>
.mega-menu {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border-top: 2px solid #10b981;
    z-index: 999;
    animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.mega-menu-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
}

.mega-menu-loading,
.mega-menu-error,
.mega-menu-empty {
    padding: 40px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
}

.mega-menu-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 2px solid #e2e8f0;
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.mega-menu-error {
    color: #ef4444;
}

.mega-menu-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
}

.mega-menu-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    background: #f8fafc;
    border: 2px solid transparent;
}

.mega-menu-item:hover {
    background: #ffffff;
    border-color: #10b981;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
    transform: translateY(-2px);
}

.category-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #10b981;
    border-radius: 10px;
    font-size: 24px;
    flex-shrink: 0;
}

.default-icon {
    font-size: 24px;
}

.category-info {
    flex: 1;
    min-width: 0;
}

.category-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.category-count {
    font-size: 13px;
    color: #64748b;
    margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
    .mega-menu-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .mega-menu {
        position: fixed;
        top: auto;
        left: 0;
        right: 0;
        bottom: 0;
        max-height: 70vh;
        overflow-y: auto;
        animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }

        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .mega-menu-container {
        padding: 24px 16px;
    }

    .mega-menu-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .mega-menu-item {
        padding: 12px;
        flex-direction: column;
        text-align: center;
    }

    .category-icon {
        width: 40px;
        height: 40px;
        font-size: 20px;
    }

    .category-name {
        font-size: 14px;
    }

    .category-count {
        font-size: 12px;
    }
}

@media (max-width: 480px) {
    .mega-menu-grid {
        grid-template-columns: 1fr;
    }
}
</style>
