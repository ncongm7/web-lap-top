<template>
  <button
    class="comparison-button"
    :class="{ 'in-comparison': isInComparison }"
    @click="handleToggle"
    :title="isInComparison ? 'Xóa khỏi so sánh' : 'Thêm vào so sánh'"
  >
    <svg v-if="isInComparison" viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon">
      <path d="M20 6L9 17l-5-5"></path>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" class="icon">
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
    <span class="button-text">{{ isInComparison ? 'Đã thêm' : 'So sánh' }}</span>
  </button>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useProductComparison } from '@/composables/product-detail/useProductComparison'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['toggle'])

const { isInComparison: checkInComparison, addToComparison, removeFromComparison, canAddMore, comparisonList } = useProductComparison()
const { showSuccess, showError, showWarning } = useToast()

// Tạo unique ID cho variant (hoặc product nếu không có variant)
const getComparisonId = computed(() => {
  // Nếu có variant, dùng variant.id để phân biệt
  // Nếu không có variant, dùng product.id
  if (props.product?.variant?.id) {
    return `variant-${props.product.variant.id}`
  }
  return `product-${props.product?.id}`
})

// Watch for variant changes to update comparison status
watch(() => props.product?.variant?.id, () => {
  // Force reactivity when variant changes
}, { immediate: true })

const isInComparison = computed(() => {
  // Kiểm tra theo comparison ID (variant ID hoặc product ID)
  // Also watch comparisonList to ensure reactivity
  const currentId = getComparisonId.value
  return comparisonList.value.some(p => p.id === currentId)
})

const handleToggle = () => {
  // Debug log to see actual data being used
  console.log('🔄 [ProductComparisonButton] Toggling. Current props.product:', {
    id: props.product.id,
    variantId: props.product.variant?.id,
    price: props.product.price,
    variantPrice: props.product.variant?.giaBan
  })
  try {
    if (isInComparison.value) {
      // Xóa khỏi so sánh - dùng comparison ID
      removeFromComparison(getComparisonId.value)
      showSuccess('Đã xóa khỏi danh sách so sánh')
      emit('toggle', { ...props.product, added: false })
    } else {
      // Thêm vào so sánh
      if (!canAddMore.value) {
        showWarning(`Chỉ có thể so sánh tối đa 3 sản phẩm. Vui lòng xóa một sản phẩm khỏi danh sách so sánh trước.`)
        return
      }

      // Lấy đầy đủ thông tin sản phẩm và variant để lưu vào comparison
      const productData = {
        ...props.product, // Move to top to avoid overwriting explicit fields
        // Dùng comparison ID làm id chính để phân biệt các variant
        id: getComparisonId.value,
        // Giữ product ID gốc
        productId: props.product.id,
        // Tên sản phẩm kèm thông tin variant nếu có
        tenSanPham: props.product.variant
          ? `${props.product.tenSanPham || props.product.name} (${getVariantDisplayName(props.product.variant)})`
          : (props.product.tenSanPham || props.product.name),
        name: props.product.variant
          ? `${props.product.name || props.product.tenSanPham} (${getVariantDisplayName(props.product.variant)})`
          : (props.product.name || props.product.tenSanPham),
        image: props.product.image || props.product.imageUrl || props.product.images?.[0]?.url,
        imageUrl: props.product.imageUrl || props.product.image || props.product.images?.[0]?.url,
        price: props.product.price || props.product.giaBan,
        giaBan: props.product.giaBan || props.product.price,
        // Lưu thêm thông tin variant nếu có
        variant: props.product.variant,
        variantId: props.product.variant?.id,
        variants: props.product.variants,
        // Lưu thông số kỹ thuật nếu có
        specs: props.product.specs,
      }

      addToComparison(productData)
      showSuccess('Đã thêm vào danh sách so sánh')
      emit('toggle', { ...productData, added: true })
    }
  } catch (error) {
    console.error('Lỗi khi thêm/xóa so sánh:', error)
    showError(error.message || 'Không thể thêm vào danh sách so sánh')
  }
}

// Helper function để tạo tên hiển thị cho variant
const getVariantDisplayName = (variant) => {
  if (!variant) return ''

  const parts = []
  if (variant.cpu) parts.push(variant.cpu)
  if (variant.gpu) parts.push(variant.gpu)
  if (variant.ram) parts.push(variant.ram)
  if (variant.mauSac) parts.push(variant.mauSac)

  return parts.length > 0 ? parts.join(' | ') : 'Variant'
}
</script>

<style scoped>
.comparison-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #f5f5f7;
  border: 2px solid #d2d2d7;
  border-radius: 8px;
  color: #1a1a1a;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.comparison-button:hover {
  background: #e5e5ea;
  border-color: #2563eb;
  color: #2563eb;
}

.comparison-button.in-comparison {
  background: #2563eb;
  border-color: #2563eb;
  color: white;
}

.comparison-button.in-comparison:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.button-text {
  font-weight: 500;
}
</style>

