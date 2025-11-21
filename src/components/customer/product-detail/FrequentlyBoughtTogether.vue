<template>
  <div class="combo-section">
    <h2 class="section-title">Thường được mua cùng</h2>
    <div v-if="loading" class="loading-state">
      <p>Đang tải...</p>
    </div>
    <div v-else-if="comboProducts && comboProducts.length > 0" class="combo-content">
      <div class="combo-products">
        <div
          v-for="product in comboProducts"
          :key="product.id"
          class="combo-product-item"
        >
          <input
            type="checkbox"
            :id="`combo-${product.id}`"
            v-model="selectedProducts"
            :value="product.id"
            class="combo-checkbox"
          />
          <label :for="`combo-${product.id}`" class="combo-product-label">
            <div class="combo-product-image">
              <img :src="getProductImage(product)" :alt="product.name" />
            </div>
            <div class="combo-product-info">
              <h4 class="combo-product-name">{{ product.name || product.tenSanPham }}</h4>
              <p class="combo-product-price">{{ formatPrice(getProductPrice(product)) }}</p>
            </div>
          </label>
        </div>
      </div>

      <div class="combo-summary">
        <div class="combo-total">
          <span class="total-label">Tổng giá:</span>
          <span class="total-price">{{ formatPrice(totalPrice) }}</span>
        </div>
        <button class="combo-add-btn" @click="handleAddAllToCart">
          Thêm tất cả vào giỏ
        </button>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>Không có sản phẩm đề xuất</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { sanPhamService } from '@/service/customer/san_pham_service'

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
})

const loading = ref(false)
const comboProducts = ref([])
const selectedProducts = ref([])

const getProductPrice = (product) => {
  const variant = product.variants?.[0] || product
  return variant.discountedPrice || 
         variant.giaGiam || 
         variant.giaBan || 
         product.price || 
         product.giaBan || 
         0
}

const totalPrice = computed(() => {
  return comboProducts.value
    .filter((p) => selectedProducts.value.includes(p.id))
    .reduce((sum, p) => sum + getProductPrice(p), 0)
})

const getProductImage = (product) => {
  // Get from variant images or product images
  const variant = product.variants?.[0] || product
  return variant.images?.[0] || 
         variant.imageUrls?.[0] ||
         product.images?.[0]?.url ||
         product.image || 
         'https://via.placeholder.com/100x100.png?text=Product'
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const handleAddAllToCart = () => {
  // TODO: Implement add to cart
  console.log('Add to cart:', selectedProducts.value)
}

const loadComboProducts = async () => {
  loading.value = true
  try {
    // Call API to get combo products (related products as fallback)
    const response = await sanPhamService.getRelatedProducts(props.productId, 5)
    const products = response.data?.data || response.data || []
    
    // Format products for combo display
    comboProducts.value = products.map((product) => ({
      id: product.id,
      name: product.tenSanPham || product.name,
      price: getProductPrice(product),
      image: getProductImage(product),
      ...product, // Keep all original data
    }))
    
    // Select all by default
    selectedProducts.value = comboProducts.value.map((p) => p.id)
  } catch (error) {
    console.error('Error loading combo products:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadComboProducts()
})
</script>

<style scoped>
.combo-section {
  margin-top: 48px;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #1a1a1a;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.combo-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.combo-products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.combo-product-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.combo-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.combo-product-label {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
  cursor: pointer;
}

.combo-product-image {
  width: 80px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
}

.combo-product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.combo-product-info {
  flex: 1;
}

.combo-product-name {
  font-size: 16px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.combo-product-price {
  font-size: 18px;
  font-weight: 600;
  color: #2563eb;
}

.combo-summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.combo-total {
  display: flex;
  align-items: center;
  gap: 12px;
}

.total-label {
  font-size: 16px;
  color: #6b7280;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: #2563eb;
}

.combo-add-btn {
  padding: 12px 24px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.combo-add-btn:hover {
  background: #1d4ed8;
}

@media (max-width: 768px) {
  .combo-summary {
    flex-direction: column;
    gap: 16px;
  }

  .combo-total {
    width: 100%;
    justify-content: space-between;
  }

  .combo-add-btn {
    width: 100%;
  }
}
</style>

