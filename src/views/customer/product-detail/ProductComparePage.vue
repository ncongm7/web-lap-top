<template>
  <div class="compare-page">
    <div class="compare-container">
      <!-- Header -->
      <div class="compare-header">
        <h1 class="page-title">So sánh sản phẩm</h1>
        <button v-if="comparisonList.length > 0" class="clear-btn" @click="handleClearAll">
          Xóa tất cả
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="comparisonList.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="empty-icon">
          <path
            d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
          ></path>
        </svg>
        <h2 class="empty-title">Chưa có sản phẩm nào để so sánh</h2>
        <p class="empty-text">Thêm sản phẩm vào danh sách so sánh để xem chi tiết</p>
        <router-link to="/products" class="browse-btn">
          Xem sản phẩm
        </router-link>
      </div>

      <!-- Comparison Table -->
      <div v-else class="compare-content">
        <div class="compare-table-wrapper">
          <table class="compare-table">
            <thead>
              <tr>
                <th class="sticky-col">Thông số</th>
                <th v-for="product in comparisonList" :key="product.id" class="product-col">
                  <div class="product-header">
                    <button class="remove-btn" @click="handleRemove(product.id)" title="Xóa">
                      ×
                    </button>
                    <div class="product-image">
                      <img :src="product.image || product.imageUrl || getPlaceholderImage()" :alt="product.name" />
                    </div>
                    <h3 class="product-name">{{ product.name || product.tenSanPham }}</h3>
                    <div class="product-price">
                      {{ formatPrice(product.price || product.giaBan) }}
                    </div>
                    <router-link :to="`/products/${product.id}`" class="view-detail-btn">
                      Xem chi tiết
                    </router-link>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Basic Info -->
              <tr class="section-row">
                <td colspan="100%" class="section-header">Thông tin cơ bản</td>
              </tr>
              <tr>
                <td class="spec-label">Tên sản phẩm</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ product.name || product.tenSanPham }}
                </td>
              </tr>
              <tr>
                <td class="spec-label">Giá</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ formatPrice(product.price || product.giaBan) }}
                </td>
              </tr>

              <!-- Performance -->
              <tr class="section-row">
                <td colspan="100%" class="section-header">Hiệu năng</td>
              </tr>
              <tr>
                <td class="spec-label">CPU</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'cpu') || '-' }}
                </td>
              </tr>
              <tr>
                <td class="spec-label">GPU</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'gpu') || '-' }}
                </td>
              </tr>
              <tr>
                <td class="spec-label">RAM</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'ram') || '-' }}
                </td>
              </tr>

              <!-- Storage -->
              <tr class="section-row">
                <td colspan="100%" class="section-header">Lưu trữ</td>
              </tr>
              <tr>
                <td class="spec-label">Ổ cứng</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'storage') || getSpec(product, 'oCung') || '-' }}
                </td>
              </tr>

              <!-- Display -->
              <tr class="section-row">
                <td colspan="100%" class="section-header">Màn hình</td>
              </tr>
              <tr>
                <td class="spec-label">Kích thước</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'screen') || getSpec(product, 'kichThuocManHinh') || '-' }}
                </td>
              </tr>

              <!-- Design -->
              <tr class="section-row">
                <td colspan="100%" class="section-header">Thiết kế</td>
              </tr>
              <tr>
                <td class="spec-label">Màu sắc</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'color') || getSpec(product, 'mauSac') || '-' }}
                </td>
              </tr>

              <!-- Battery -->
              <tr class="section-row">
                <td colspan="100%" class="section-header">Pin</td>
              </tr>
              <tr>
                <td class="spec-label">Dung lượng pin</td>
                <td v-for="product in comparisonList" :key="product.id" class="spec-value">
                  {{ getSpec(product, 'battery') || getSpec(product, 'dungLuongPin') || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Actions -->
        <div class="compare-actions">
          <button class="add-to-cart-all-btn" @click="handleAddAllToCart">
            Thêm tất cả vào giỏ hàng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useProductComparison } from '@/composables/product-detail/useProductComparison'
import { useRouter } from 'vue-router'

const router = useRouter()
const { comparisonList, clearComparison, removeFromComparison } = useProductComparison()

const handleRemove = (productId) => {
  removeFromComparison(productId)
  if (comparisonList.value.length === 0) {
    // Optionally redirect to products page
  }
}

const handleClearAll = () => {
  if (confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi danh sách so sánh?')) {
    clearComparison()
  }
}

const handleAddAllToCart = () => {
  // TODO: Implement add all to cart
  console.log('Add all to cart:', comparisonList.value)
}

const getSpec = (product, key) => {
  // Try to get from product directly or from variants
  if (product[key]) return product[key]
  if (product.variants && product.variants.length > 0) {
    return product.variants[0][key]
  }
  return null
}

const formatPrice = (price) => {
  if (!price) return '-'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getPlaceholderImage = () => {
  return 'https://via.placeholder.com/200x200.png?text=No+Image'
}

// Load product details if needed
onMounted(() => {
  // Optionally load full product details for comparison
})
</script>

<style scoped>
.compare-page {
  min-height: 100vh;
  background: #f5f5f7;
  padding: 24px;
}

.compare-container {
  max-width: 1400px;
  margin: 0 auto;
}

.compare-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
}

.clear-btn {
  padding: 10px 20px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  width: 80px;
  height: 80px;
  color: #d1d5db;
  margin: 0 auto 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 32px;
}

.browse-btn {
  display: inline-block;
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.2s;
}

.browse-btn:hover {
  background: #1d4ed8;
}

.compare-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.compare-table-wrapper {
  overflow-x: auto;
}

.compare-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.sticky-col {
  position: sticky;
  left: 0;
  background: white;
  z-index: 10;
  padding: 16px;
  font-weight: 600;
  color: #1a1a1a;
  border-right: 2px solid #e5e7eb;
  text-align: left;
}

.product-col {
  min-width: 250px;
  padding: 0;
  vertical-align: top;
}

.product-header {
  padding: 20px;
  text-align: center;
  position: relative;
  border-right: 1px solid #e5e7eb;
}

.remove-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.remove-btn:hover {
  background: #dc2626;
}

.product-image {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f7;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  min-height: 48px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 20px;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 16px;
}

.view-detail-btn {
  display: inline-block;
  padding: 8px 16px;
  background: #2563eb;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.view-detail-btn:hover {
  background: #1d4ed8;
}

.section-row {
  background: #f9fafb;
}

.section-header {
  padding: 16px;
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
  text-align: left;
}

.spec-label {
  padding: 16px;
  font-weight: 600;
  color: #374151;
  background: white;
  border-right: 2px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  text-align: left;
}

.spec-value {
  padding: 16px;
  text-align: center;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  color: #1a1a1a;
}

.compare-actions {
  padding: 24px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
}

.add-to-cart-all-btn {
  padding: 14px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.add-to-cart-all-btn:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .compare-page {
    padding: 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .compare-table {
    min-width: 600px;
  }

  .product-header {
    padding: 16px;
  }

  .product-image {
    width: 80px;
    height: 80px;
  }
}
</style>

