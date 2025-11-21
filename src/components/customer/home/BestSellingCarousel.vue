<template>
    <ProductCarousel
        :products="products"
        :title="title"
        :view-all-link="viewAllLink"
        :items-to-show="itemsToShow"
        @add-to-cart="handleAddToCart"
    />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ProductCarousel from '@/components/customer/common/ProductCarousel.vue'
import { getBestSellingProducts } from '@/service/customer/homeService'

const props = defineProps({
    title: {
        type: String,
        default: 'Sản phẩm bán chạy',
    },
    limit: {
        type: Number,
        default: 10,
    },
    viewAllLink: {
        type: String,
        default: '/products?sortBy=best-selling',
    },
    itemsToShow: {
        type: Number,
        default: 4,
    },
})

const emit = defineEmits(['add-to-cart'])

const products = ref([])

// Fetch best-selling products
const fetchBestSelling = async () => {
    try {
        console.log('🔄 [BestSellingCarousel] Fetching best-selling products...')
        const data = await getBestSellingProducts(props.limit)
        products.value = data
        console.log('✅ [BestSellingCarousel] Loaded:', products.value.length, 'products')
    } catch (error) {
        console.error('❌ [BestSellingCarousel] Error loading products:', error)
        products.value = []
    }
}

// Handle add to cart
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

