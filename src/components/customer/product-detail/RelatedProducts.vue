<template>
  <div class="related-products-section" v-if="products && products.length > 0">
    <ProductCarousel
      :products="formattedProducts"
      title="Sản phẩm tương tự"
      :loading="loading"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ProductCarousel from '@/components/customer/common/ProductCarousel.vue'

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const formattedProducts = computed(() => {
  return props.products.map((product) => {
    // Get first variant or use product data
    const variant = product.variants?.[0] || product
    
    // Get first image from variant or product
    const imageUrl = variant.images?.[0] || 
                    variant.imageUrls?.[0] ||
                    product.images?.[0]?.url ||
                    'https://via.placeholder.com/300x300.png?text=Product'
    
    // Get price from variant or product
    const price = variant.discountedPrice || 
                  variant.giaGiam || 
                  variant.giaBan || 
                  product.giaBan || 
                  0
    
    const originalPrice = variant.originalPrice || 
                         variant.giaGoc || 
                         (variant.giaBan && variant.giaGiam ? variant.giaBan : null)
    
    return {
      id: product.id,
      name: product.tenSanPham || product.name,
      image: imageUrl,
      price: price,
      originalPrice: originalPrice,
      hasDiscount: !!originalPrice && originalPrice > price,
      discountPercentage: originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0,
      rating: product.averageRating || 0,
      reviewCount: product.reviewCount || 0,
      ...product, // Keep all original data
    }
  })
})
</script>

<style scoped>
.related-products-section {
  margin-top: 48px;
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

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 24px;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  padding: 16px;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: #2563eb;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 16px;
  }
}
</style>

