<template>
  <section class="category-grid">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Danh mục sản phẩm</h2>
        <p class="section-desc">Khám phá các dòng laptop phù hợp với nhu cầu của bạn</p>
      </div>

      <div class="categories-container">
        <router-link
          v-for="category in categories"
          :key="category.id"
          :to="category.link"
          class="category-card"
          :style="{ backgroundColor: category.bgColor || '#f8fafc' }"
        >
          <div class="category-icon">{{ category.icon || '📦' }}</div>
          <h3 class="category-name">{{ category.name }}</h3>
          <p class="category-count">{{ category.count || 0 }} sản phẩm</p>
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.category-grid {
  padding: 60px 0;
  background: #ffffff;
  overflow: hidden;
  width: 100%;
}

.container {
  max-width: 100%;
  margin: 0 auto;
  padding: 0 clamp(16px, 3vw, 60px);
  width: 100%;
  box-sizing: border-box;
}

.section-header {
  text-align: center;
  margin-bottom: clamp(32px, 4vw, 48px);
}

.section-title {
  font-size: clamp(28px, 2.5vw, 42px);
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.section-desc {
  font-size: clamp(14px, 1.2vw, 18px);
  color: #64748b;
  margin: 0;
}

.categories-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 180px;
}

.category-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.category-icon {
  font-size: 48px;
  margin-bottom: 16px;
  line-height: 1;
}

.category-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
  text-align: center;
}

.category-count {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  text-align: center;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .categories-container {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .category-grid {
    padding: 40px 0;
  }

  .section-title {
    font-size: 28px;
  }

  .categories-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .category-card {
    padding: 24px 16px;
    min-height: 160px;
  }

  .category-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .category-name {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .categories-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .category-card {
    padding: 20px 12px;
    min-height: 140px;
  }

  .category-icon {
    font-size: 36px;
    margin-bottom: 8px;
  }

  .category-name {
    font-size: 14px;
  }

  .category-count {
    font-size: 12px;
  }
}
</style>
