<template>
  <Transition name="slide-up">
    <div v-if="comparisonList.length > 0" class="comparison-floating-bar">
      <div class="bar-content">
        <div class="bar-left">
          <div class="comparison-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path>
            </svg>
          </div>
          <div class="bar-info">
            <span class="bar-title">So sánh sản phẩm</span>
            <span class="bar-count">{{ comparisonList.length }}/3 sản phẩm</span>
          </div>
        </div>

        <div class="bar-products">
          <div
            v-for="product in comparisonList"
            :key="product.id"
            class="product-mini"
            @click.stop="goToCompare"
          >
            <img
              :src="product.image || product.imageUrl || getPlaceholderImage()"
              :alt="product.name || product.tenSanPham"
              class="product-mini-image"
            />
            <button
              class="remove-mini-btn"
              @click.stop="handleRemove(product.id)"
              title="Xóa"
            >
              ×
            </button>
          </div>
        </div>

        <div class="bar-right">
          <button class="view-compare-btn" @click="goToCompare">
            Xem so sánh
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M5 12h14M12 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useProductComparison } from '@/composables/product-detail/useProductComparison'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { comparisonList, removeFromComparison } = useProductComparison()
const { showSuccess } = useToast()

// Debug: watch comparisonList changes
watch(comparisonList, (newList) => {
  console.log('🔵 [ComparisonFloatingBar] comparisonList changed:', newList.length, 'items')
  console.log('🔵 [ComparisonFloatingBar] Items:', newList.map(p => ({ id: p.id, name: p.name || p.tenSanPham })))
}, { deep: true, immediate: true })

onMounted(() => {
  console.log('🔵 [ComparisonFloatingBar] Mounted, comparisonList.length:', comparisonList.value.length)
})

const handleRemove = (productId) => {
  removeFromComparison(productId)
  showSuccess('Đã xóa khỏi danh sách so sánh')
}

const goToCompare = () => {
  router.push('/products/compare')
}

const getPlaceholderImage = () => {
  return 'https://via.placeholder.com/60x60.png?text=No+Image'
}
</script>

<style scoped>
.comparison-floating-bar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 12px 20px;
  min-width: 500px;
  max-width: 90vw;
  border: 1px solid #e5e7eb;
}

.bar-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comparison-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2563eb;
  color: white;
  border-radius: 8px;
}

.comparison-icon svg {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.bar-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bar-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.bar-count {
  font-size: 12px;
  color: #6b7280;
}

.bar-products {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.product-mini {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.product-mini:hover {
  border-color: #2563eb;
  transform: scale(1.05);
}

.product-mini-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-mini-btn {
  position: absolute;
  top: -6px;
  right: -6px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: 2px solid white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s;
}

.remove-mini-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.bar-right {
  display: flex;
  align-items: center;
}

.view-compare-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-compare-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.view-compare-btn svg {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Transition */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateX(-50%) translateY(100%);
  opacity: 0;
}

@media (max-width: 768px) {
  .comparison-floating-bar {
    min-width: auto;
    width: calc(100vw - 40px);
    padding: 10px 16px;
  }

  .bar-content {
    gap: 12px;
  }

  .bar-info {
    display: none;
  }

  .bar-products {
    flex: 1;
  }

  .product-mini {
    width: 40px;
    height: 40px;
  }

  .view-compare-btn {
    padding: 8px 16px;
    font-size: 12px;
  }

  .view-compare-btn span {
    display: none;
  }
}
</style>

