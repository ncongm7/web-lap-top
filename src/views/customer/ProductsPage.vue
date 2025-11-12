<template>
  <div class="products-page">
  

    <!-- Main Content -->
    <div class="container">
      <ProductListing />
    </div>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2>Tại sao chọn laptop tại cửa hàng chúng tôi?</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">🚚</div>
            <h3>Giao hàng miễn phí</h3>
            <p>Miễn phí giao hàng cho đơn hàng trên 10 triệu</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🛡️</div>
            <h3>Bảo hành chính hãng</h3>
            <p>Bảo hành chính hãng từ 12-36 tháng</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">💰</div>
            <h3>Giá tốt nhất</h3>
            <p>Cam kết giá tốt nhất thị trường</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔧</div>
            <h3>Hỗ trợ kỹ thuật</h3>
            <p>Đội ngũ kỹ thuật chuyên nghiệp 24/7</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import ProductListing from '@/components/customer/san_pham/ProductListing.vue'

// SEO Meta
const pageTitle = 'Laptop Gaming & Văn Phòng - Giá Tốt Nhất'
const pageDescription = 'Mua laptop gaming, văn phòng chính hãng với giá tốt nhất. Bảo hành chính hãng, giao hàng miễn phí. Tư vấn 24/7.'

onMounted(() => {
  // Update page title
  document.title = pageTitle
  
  // Update meta description
  const metaDescription = document.querySelector('meta[name="description"]')
  if (metaDescription) {
    metaDescription.setAttribute('content', pageDescription)
  } else {
    const meta = document.createElement('meta')
    meta.name = 'description'
    meta.content = pageDescription
    document.head.appendChild(meta)
  }
})
</script>

<style scoped>
.products-page {
  min-height: 100vh;
  background: #f8fafc;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Page Header */
.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 0;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.page-description {
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Breadcrumb */
.breadcrumb {
  background: white;
  padding: 16px 0;
  border-bottom: 1px solid #e2e8f0;
}

.breadcrumb-list {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
}

.breadcrumb-list li {
  display: flex;
  align-items: center;
}

.breadcrumb-list li:not(:last-child)::after {
  content: '›';
  margin-left: 8px;
  color: #94a3b8;
  font-weight: 500;
}

.breadcrumb-list a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-list a:hover {
  color: #1d4ed8;
}

.breadcrumb-list .active {
  color: #64748b;
  font-weight: 500;
}

/* Features Section */
.features-section {
  background: white;
  padding: 80px 0;
  margin-top: 60px;
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 48px 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  margin-top: 48px;
}

.feature-card {
  text-align: center;
  padding: 32px 24px;
  background: #f8fafc;
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.feature-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.feature-card p {
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .page-description {
    font-size: 1rem;
  }
  
  .features-section {
    padding: 60px 0;
  }
  
  .features-section h2 {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .feature-card {
    padding: 24px 20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 16px;
  }
  
  .page-header {
    padding: 40px 0;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
}
</style>
