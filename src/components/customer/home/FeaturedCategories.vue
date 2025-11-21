<template>
    <section class="featured-categories">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Danh mục nổi bật</h2>
                <p class="section-desc">Khám phá các dòng laptop phù hợp với nhu cầu của bạn</p>
            </div>

            <div v-if="isLoading" class="loading-state">
                <span class="spinner"></span>
                <span>Đang tải danh mục...</span>
            </div>

            <div v-else-if="error" class="error-state">
                <span>⚠️ {{ error }}</span>
            </div>

            <div v-else-if="categories.length > 0" class="categories-grid">
                <router-link
                    v-for="category in categories"
                    :key="category.id || category.maDanhMuc"
                    :to="getCategoryLink(category)"
                    class="category-card"
                    @click="handleCategoryClick"
                >
                    <div class="category-icon-wrapper">
                        <span v-if="category.icon" class="category-icon">{{ category.icon }}</span>
                        <span v-else class="category-icon default-icon">📦</span>
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

            <div v-else class="empty-state">
                <span>Không có danh mục nào</span>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '@/service/customer/categoryService'
import axiosInstance from '@/service/axiosInstance'

const router = useRouter()
const categories = ref([])
const isLoading = ref(false)
const error = ref(null)

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
    // Navigation handled by router-link
}

// Fetch featured categories
const fetchFeaturedCategories = async () => {
    try {
        isLoading.value = true
        error.value = null

        // Try to get featured categories from API
        try {
            const response = await axiosInstance.get('/api/categories', {
                params: { featured: true },
            })
            
            const data = response.data?.data || response.data?.content || response.data
            
            if (Array.isArray(data) && data.length > 0) {
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
                
                console.log('✅ [FeaturedCategories] Featured categories loaded:', categories.value.length)
                return
            }
        } catch (apiError) {
            if (apiError.response?.status !== 404) {
                console.warn('⚠️ [FeaturedCategories] Featured categories API not available, using fallback')
            }
        }

        // Fallback: Get all categories and take first 6
        const allCategories = await getCategories()
        categories.value = allCategories.slice(0, 6).map(cat => ({
            id: cat.id || cat.maDanhMuc,
            maDanhMuc: cat.maDanhMuc || cat.id,
            tenDanhMuc: cat.tenDanhMuc || cat.name,
            name: cat.name || cat.tenDanhMuc,
            productCount: cat.productCount || cat.soLuongSanPham || 0,
            soLuongSanPham: cat.soLuongSanPham || cat.productCount || 0,
            icon: cat.icon || cat.iconUrl || '',
            slug: cat.slug || generateSlug(cat.tenDanhMuc || cat.name || ''),
        }))

        console.log('✅ [FeaturedCategories] Categories loaded (fallback):', categories.value.length)
    } catch (err) {
        console.error('❌ [FeaturedCategories] Error loading categories:', err)
        error.value = 'Không thể tải danh mục'
        categories.value = []
    } finally {
        isLoading.value = false
    }
}

onMounted(() => {
    fetchFeaturedCategories()
})
</script>

<style scoped>
.featured-categories {
    padding: 60px 0;
    background: #ffffff;
    overflow: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.section-header {
    text-align: center;
    margin-bottom: 40px;
}

.section-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.section-desc {
    font-size: 16px;
    color: #64748b;
    margin: 0;
}

.loading-state,
.error-state,
.empty-state {
    padding: 40px;
    text-align: center;
    color: #64748b;
    font-size: 14px;
}

.loading-state {
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
    to { transform: rotate(360deg); }
}

.error-state {
    color: #ef4444;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    border-radius: 16px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 2px solid transparent;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    min-height: 200px;
}

.category-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.15);
    border-color: #10b981;
    background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.category-icon-wrapper {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #10b981;
    border-radius: 20px;
    margin-bottom: 16px;
    transition: transform 0.3s ease;
}

.category-card:hover .category-icon-wrapper {
    transform: scale(1.1) rotate(5deg);
}

.category-icon {
    font-size: 40px;
    line-height: 1;
}

.default-icon {
    font-size: 40px;
}

.category-info {
    text-align: center;
}

.category-name {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.category-count {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

/* Responsive */
@media (max-width: 1024px) {
    .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .featured-categories {
        padding: 40px 0;
    }

    .section-title {
        font-size: 28px;
    }

    .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }

    .category-card {
        padding: 24px 16px;
        min-height: 180px;
    }

    .category-icon-wrapper {
        width: 60px;
        height: 60px;
        margin-bottom: 12px;
    }

    .category-icon {
        font-size: 32px;
    }

    .category-name {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
    }

    .category-card {
        padding: 20px 12px;
        min-height: 160px;
    }

    .category-icon-wrapper {
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
    }

    .category-icon {
        font-size: 28px;
    }

    .category-name {
        font-size: 14px;
    }

    .category-count {
        font-size: 12px;
    }
}
</style>

