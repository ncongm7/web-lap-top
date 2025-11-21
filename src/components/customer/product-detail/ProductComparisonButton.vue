<template>
  <div class="comparison-button-wrapper">
    <button
      class="comparison-btn"
      :class="{ active: isInComparisonComputed }"
      @click="handleToggle"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="btn-icon">
        <path
          d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
        ></path>
      </svg>
      <span>{{ isInComparisonComputed ? 'Đã thêm vào so sánh' : 'Thêm vào so sánh' }}</span>
      <span v-if="comparisonCount > 0" class="comparison-badge">
        {{ comparisonCount }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProductComparison } from '@/composables/product-detail/useProductComparison'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle'])

const router = useRouter()
const { comparisonList, isInComparison, toggleComparison } = useProductComparison()

const comparisonCount = computed(() => {
  return comparisonList.value.length
})

const isInComparisonComputed = computed(() => {
  return isInComparison(props.product.id)
})

const handleToggle = () => {
  try {
    toggleComparison(props.product)
    emit('toggle', props.product)
    
    // Navigate to compare page if max reached
    if (comparisonCount.value >= 4) {
      router.push('/compare')
    }
  } catch (error) {
    // Show error message
    alert(error.message || 'Không thể thêm sản phẩm vào danh sách so sánh')
  }
}

</script>

<style scoped>
.comparison-button-wrapper {
  margin-bottom: 16px;
}

.comparison-btn {
  width: 100%;
  padding: 12px 24px;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  position: relative;
}

.comparison-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.comparison-btn.active {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.comparison-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  font-weight: 600;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

