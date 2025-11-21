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
import { getNewArrivalsProducts } from '@/service/customer/homeService'

const props = defineProps({
    title: {
        type: String,
        default: 'Sản phẩm mới',
    },
    limit: {
        type: Number,
        default: 10,
    },
    viewAllLink: {
        type: String,
        default: '/products?sortBy=newest',
    },
    itemsToShow: {
        type: Number,
        default: 4,
    },
})

const emit = defineEmits(['add-to-cart'])

const products = ref([])

// Fetch new arrivals products
const fetchNewArrivals = async () => {
    try {
        console.log('🔄 [NewArrivalsCarousel] Fetching new arrivals products...')
        const data = await getNewArrivalsProducts(props.limit)
        products.value = data
        console.log('✅ [NewArrivalsCarousel] Loaded:', products.value.length, 'products')
    } catch (error) {
        console.error('❌ [NewArrivalsCarousel] Error loading products:', error)
        products.value = []
    }
}

// Handle add to cart
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

