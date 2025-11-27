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
import { getNewArrivalsProducts } from '@/service/customer/homeService'

const props = defineProps({
  title: { type: String, default: 'Sản phẩm mới' },
  limit: { type: Number, default: 10 },
  viewAllLink: { type: String, default: '/products?sortBy=newest' }
})

const emit = defineEmits(['add-to-cart'])

const products = ref([])
const loading = ref(false)
const error = ref(null)

const fetchNewArrivals = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await getNewArrivalsProducts(props.limit)
    products.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('❌ [NewArrivalsCarousel] Error loading products:', e)
    error.value = 'Không thể tải sản phẩm mới. Vui lòng thử lại sau.'
    products.value = []
  } finally {
    loading.value = false
  }
}

const handleAddToCart = (product) => {
  emit('add-to-cart', product)
}

onMounted(() => {
  fetchNewArrivals()
})
</script>

<style scoped>
/* Styles are handled by ProductCarousel component */
</style>