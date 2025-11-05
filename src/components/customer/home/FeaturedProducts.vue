<template>
    <section class="featured-products">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Sản phẩm nổi bật</h2>
                <p class="section-desc">Những laptop được yêu thích nhất hiện nay</p>
            </div>

            <LoadingSpinner v-if="loading" message="Đang tải sản phẩm..." />

            <div v-else-if="error" class="error-state">
                <p>{{ error }}</p>
                <button @click="$emit('retry')" class="retry-btn">Thử lại</button>
            </div>

            <div v-else class="products-grid">
                <ProductCard v-for="product in products" :key="product.id" :product="product"
                    @add-to-cart="handleAddToCart" />
            </div>

            <div v-if="!loading && !error && products.length > 0" class="section-footer">
                <router-link to="/products" class="view-all-btn">
                    Xem tất cả sản phẩm →
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
import ProductCard from '@/components/customer/common/ProductCard.vue'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'

defineProps({
    products: {
        type: Array,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    error: {
        type: String,
        default: null
    }
})

const emit = defineEmits(['add-to-cart', 'retry'])

const handleAddToCart = (product) => {
    emit('add-to-cart', product)
}
</script>

<style scoped>
.featured-products {
    padding: 60px 0;
    background: #f8fafc;
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
    margin-bottom: clamp(32px, 4vw, 60px);
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

.products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
}

.error-state {
    text-align: center;
    padding: 60px 0;
}

.error-state p {
    color: #ef4444;
    margin: 0 0 16px 0;
}

.retry-btn {
    padding: 10px 24px;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
}

.retry-btn:hover {
    background: #059669;
}

.section-footer {
    text-align: center;
}

.view-all-btn {
    display: inline-flex;
    align-items: center;
    padding: 14px 32px;
    background: #10b981;
    color: #ffffff;
    text-decoration: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s;
}

.view-all-btn:hover {
    background: #059669;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

@media (min-width: 1441px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: clamp(24px, 2vw, 40px);
    }
}

@media (max-width: 1440px) and (min-width: 1025px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
        gap: 24px;
    }
}

@media (max-width: 1024px) {
    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 768px) {
    .featured-products {
        padding: 40px 0;
    }

    .section-title {
        font-size: 28px;
    }

    .products-grid {
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 16px;
    }
}
</style>
