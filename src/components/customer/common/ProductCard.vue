<template>
    <div class="product-card">
        <router-link :to="`/products/${product.id}`" class="product-link">
            <!-- Hình ảnh sản phẩm -->
            <div class="product-image-wrapper" :class="{ 'no-image': !product.anhDaiDien && !product.hinhAnh }">
                <img v-if="product.anhDaiDien || product.hinhAnh" :src="product.anhDaiDien || product.hinhAnh"
                    :alt="product.tenSanPham" class="product-image" loading="lazy" />
                <div v-else class="placeholder-image">
                    <span class="placeholder-icon">💻</span>
                    <span class="placeholder-text">{{ product.ten || product.tenSanPham }}</span>
                </div>

                <!-- Badge giảm giá -->
                <div v-if="hasDiscount" class="discount-badge">-{{ discountPercent }}%</div>

                <!-- Badge trạng thái -->
                <div v-if="!product.conHang" class="status-badge out-of-stock">Hết hàng</div>
                <div v-else-if="product.isNew" class="status-badge new">Mới</div>
            </div>

            <!-- Thông tin sản phẩm -->
            <div class="product-info">
                <h3 class="product-name">{{ product.tenSanPham }}</h3>

                <!-- Giá -->
                <div class="product-price">
                    <span class="current-price">{{ formatCurrency(currentPrice) }}</span>
                    <span v-if="hasDiscount" class="original-price">{{ formatCurrency(product.giaCaoNhat) }}</span>
                </div>

                <!-- Rating -->
                <div v-if="product.danhGiaTrungBinh" class="product-rating">
                    <div class="stars">
                        <span v-for="star in 5" :key="star"
                            :class="['star', star <= product.danhGiaTrungBinh ? 'filled' : '']">
                            ★
                        </span>
                    </div>
                    <span class="rating-count">({{ product.soLuongDanhGia || 0 }})</span>
                </div>
            </div>
        </router-link>

        <!-- Nút Thêm vào giỏ -->
        <button v-if="product.conHang" @click.prevent="handleAddToCart" class="add-to-cart-btn" :disabled="isAdding">
            <span v-if="!isAdding">Thêm vào giỏ</span>
            <span v-else>Đang thêm...</span>
        </button>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { formatCurrency } from '@/utils/helpers'

const props = defineProps({
    product: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['add-to-cart'])

const isAdding = ref(false)

// Tính giá hiện tại (sau giảm giá)
const currentPrice = computed(() => {
    return props.product.giamGia ? props.product.giaThapNhat : props.product.giaThapNhat
})

// Kiểm tra có giảm giá không
const hasDiscount = computed(() => {
    return props.product.giamGia && props.product.giamGia > 0
})

// Tính % giảm giá
const discountPercent = computed(() => {
    if (!hasDiscount.value) return 0
    return Math.round(props.product.giamGia)
})

// Handle thêm vào giỏ
const handleAddToCart = async () => {
    isAdding.value = true
    try {
        emit('add-to-cart', props.product)
        // Giả lập loading
        await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
        isAdding.value = false
    }
}
</script>

<style scoped>
.product-card {
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-4px);
}

.product-link {
    text-decoration: none;
    color: inherit;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.product-image-wrapper {
    position: relative;
    padding-top: 100%;
    /* 1:1 Aspect Ratio */
    overflow: hidden;
    background: #f8fafc;
}

.product-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-image {
    transform: scale(1.05);
}

.placeholder-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
    gap: 8px;
}

.placeholder-icon {
    font-size: 48px;
}

.placeholder-text {
    font-size: 14px;
    font-weight: 600;
    color: #047857;
    text-align: center;
    padding: 0 12px;
    max-width: 80%;
}

.discount-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #ef4444;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.status-badge {
    position: absolute;
    top: 12px;
    left: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
}

.status-badge.new {
    background: #10b981;
    color: #ffffff;
}

.status-badge.out-of-stock {
    background: #64748b;
    color: #ffffff;
}

.product-info {
    padding: 16px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.product-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    min-height: 48px;
}

.product-price {
    display: flex;
    align-items: center;
    gap: 8px;
}

.current-price {
    font-size: 20px;
    font-weight: 700;
    color: #ef4444;
}

.original-price {
    font-size: 14px;
    color: #94a3b8;
    text-decoration: line-through;
}

.product-rating {
    display: flex;
    align-items: center;
    gap: 6px;
}

.stars {
    display: flex;
    gap: 2px;
}

.star {
    color: #e2e8f0;
    font-size: 16px;
}

.star.filled {
    color: #fbbf24;
}

.rating-count {
    font-size: 13px;
    color: #64748b;
}

.add-to-cart-btn {
    width: 100%;
    padding: 12px 16px;
    background: #10b981;
    color: #ffffff;
    border: none;
    border-radius: 0 0 12px 12px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.add-to-cart-btn:hover:not(:disabled) {
    background: #059669;
}

.add-to-cart-btn:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
}
</style>
