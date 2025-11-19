<template>
  <section class="category-section">
    <div class="container">
      <div class="section-header">
        <div>
          <p class="section-eyebrow">Danh mục sản phẩm</p>
          <h2>Khám phá theo nhu cầu của bạn</h2>
          <p class="section-description">
            Chọn nhanh danh mục bạn quan tâm để hệ thống gợi ý đúng dòng máy phù hợp nhất.
          </p>
        </div>
      </div>

      <div v-if="loading" class="state state-loading">
        <span class="spinner" />
        <p>Đang tải danh mục...</p>
      </div>

      <div v-else-if="error" class="state state-error">
        <p>{{ error }}</p>
        <button class="retry-btn" @click="fetchCategories">Thử lại</button>
      </div>

      <div v-else-if="categories.length === 0" class="state state-empty">
        <p>Chưa có danh mục nào được công bố.</p>
      </div>

      <div v-else class="categories-grid">
        <RouterLink
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          :to="getCategoryLink(category)"
        >
          <div class="icon-wrapper">
            <img
              v-if="category.iconUrl"
              :src="category.iconUrl"
              :alt="category.name"
              loading="lazy"
            />
            <span v-else class="icon-placeholder">💻</span>
          </div>
          <div class="category-info">
            <h3>{{ category.name }}</h3>
            <p>{{ formatProductCount(category.productCount) }}</p>
          </div>
          <span class="category-link">Xem ngay →</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCategories } from '@/service/customer/categoryService'
const categories = ref([])
const loading = ref(false)
const error = ref(null)

const fetchCategories = async () => {
  try {
    loading.value = true
    error.value = null
    const data = await getCategories()
    categories.value = Array.isArray(data) ? data : []
  } catch (err) {
    error.value = 'Không thể tải danh mục. Vui lòng thử lại.'
    console.error('[CategoryList] fetchCategories error:', err)
  } finally {
    loading.value = false
  }
}

const slugify = (value = '') =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

const getCategoryLink = (category) => {
  const slug = category.slug || slugify(category.name)
  return {
    path: '/products',
    query: {
      category: slug,
    },
  }
}

const formatProductCount = (count) => {
  const value = Number(count) || 0
  return `${value} sản phẩm`
}

onMounted(fetchCategories)
</script>

<style scoped>
.category-section {
  padding: clamp(32px, 5vw, 64px) 0;
  background: #f8fafc;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 32px);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: clamp(16px, 2.5vw, 32px);
}

.section-eyebrow {
  text-transform: uppercase;
  letter-spacing: 3px;
  font-size: 12px;
  color: #0f766e;
  margin-bottom: 8px;
}

.section-description {
  color: #64748b;
  max-width: 520px;
  margin-top: 8px;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: clamp(16px, 2vw, 24px);
}

.category-card {
  background: #ffffff;
  padding: 20px;
  border-radius: 20px;
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: 14px;
  border: 1px solid #e2e8f0;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  border-color: #0f766e;
  box-shadow: 0 18px 30px rgba(15, 118, 110, 0.15);
}

.icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: #ecfeff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.icon-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.icon-placeholder {
  font-size: 32px;
}

.category-info h3 {
  font-size: 18px;
  margin: 0;
  color: #0f172a;
}

.category-info p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

.category-link {
  margin-top: auto;
  font-size: 13px;
  color: #0f766e;
  font-weight: 600;
}

.state {
  background: #ffffff;
  border-radius: 20px;
  padding: 32px;
  text-align: center;
  border: 1px dashed #e2e8f0;
}

.state-loading p,
.state-error p,
.state-empty p {
  margin-top: 12px;
  color: #475569;
}

.spinner {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 3px solid #e2e8f0;
  border-top-color: #0f766e;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

.retry-btn {
  margin-top: 12px;
  border: none;
  background: #0f766e;
  color: #ffffff;
  padding: 10px 18px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
}

.retry-btn:hover {
  background: #0c5f59;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 640px) {
  .category-card {
    flex-direction: row;
    align-items: center;
  }

  .icon-wrapper {
    width: 56px;
    height: 56px;
    border-radius: 14px;
  }

  .category-link {
    margin-left: auto;
  }
}
</style>
