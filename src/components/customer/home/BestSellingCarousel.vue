<template>
  <RelatedProducts
    :products="products"
    :loading="loading"
    :error="error"
    :title="title"
    :view-all-link="viewAllLink"
    @add-to-cart="handleAddToCart"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import RelatedProducts from '@/components/customer/product-detail/RelatedProducts.vue'
import { getBestSellingProducts } from '@/service/customer/homeService'

const props = defineProps({
  title: { type: String, default: 'Sản phẩm bán chạy' },
  limit: { type: Number, default: 10 },
  viewAllLink: { type: String, default: '/products?sortBy=best-selling' }
})

const emit = defineEmits(['add-to-cart'])

const products = ref([])
const loading = ref(false)
const error = ref(null)

const fetchBestSelling = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getBestSellingProducts(props.limit)
    products.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('❌ [BestSellingCarousel] Error loading products:', e)
    error.value = 'Không thể tải sản phẩm bán chạy. Vui lòng thử lại sau.'
    products.value = []
  } finally {
    loading.value = false
  }
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

onMounted(() => {
  fetchBestSelling()
})
</script>

<style scoped>
/* Styles are handled by ProductCarousel component */
</style>