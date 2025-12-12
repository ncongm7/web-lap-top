<template>
  <div v-if="show" class="consultation-modal-overlay" @click.self="handleClose">
    <div class="consultation-modal-container">
      <!-- Header -->
      <div class="consultation-header">
        <h5 class="mb-0">
          <i class="bi bi-robot me-2"></i>
          Tư vấn chọn laptop tự động
        </h5>
        <button class="btn btn-sm btn-link" @click="handleClose">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <!-- Progress Bar -->
      <div class="consultation-progress">
        <div class="progress-bar-container">
          <div 
            v-for="step in 4" 
            :key="step"
            class="progress-step"
            :class="{ 
              'active': currentStep === step,
              'completed': currentStep > step
            }"
          >
            <div class="step-circle">{{ step }}</div>
            <div class="step-label">{{ getStepLabel(step) }}</div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="consultation-content">
        <!-- Step 1: Mục đích sử dụng -->
        <div v-if="currentStep === 1" class="step-container">
          <h6 class="step-title">Bạn muốn dùng laptop cho mục đích gì?</h6>
          <p class="step-description">Chọn một hoặc nhiều mục đích phù hợp với bạn</p>
          
          <div class="option-grid">
            <button
              v-for="purpose in purposes"
              :key="purpose.id"
              @click="togglePurpose(purpose.id)"
              class="option-card"
              :class="{ 'selected': selectedPurposes.includes(purpose.id) }"
            >
              <i :class="purpose.icon"></i>
              <span>{{ purpose.name }}</span>
            </button>
          </div>
        </div>

        <!-- Step 2: Ngân sách -->
        <div v-if="currentStep === 2" class="step-container">
          <h6 class="step-title">Ngân sách của bạn là bao nhiêu?</h6>
          <p class="step-description">Kéo thanh trượt hoặc chọn mức giá phù hợp</p>
          
          <div class="budget-container">
            <div class="budget-slider-wrapper">
              <input
                type="range"
                v-model.number="selectedBudget"
                :min="minBudget"
                :max="maxBudget"
                :step="stepBudget"
                class="budget-slider"
              />
              <div class="budget-display">
                <span class="budget-value">{{ formatPrice(selectedBudget) }} VNĐ</span>
              </div>
            </div>
            
            <div class="budget-presets">
              <button
                v-for="preset in budgetPresets"
                :key="preset.label"
                @click="selectedBudget = preset.value"
                class="budget-preset-btn"
                :class="{ 'active': selectedBudget === preset.value }"
              >
                {{ preset.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 3: Tính năng quan trọng -->
        <div v-if="currentStep === 3" class="step-container">
          <h6 class="step-title">Bạn quan tâm đến tính năng nào? (Chọn nhiều)</h6>
          <p class="step-description">Chọn các tính năng quan trọng với bạn</p>
          
          <div class="feature-checkboxes">
            <label
              v-for="feature in features"
              :key="feature.id"
              class="feature-checkbox"
              :class="{ 'checked': selectedFeatures.includes(feature.id) }"
            >
              <input
                type="checkbox"
                :value="feature.id"
                v-model="selectedFeatures"
                class="feature-input"
              />
              <span class="feature-label">
                <i :class="feature.icon"></i>
                {{ feature.name }}
              </span>
            </label>
          </div>
        </div>

        <!-- Step 4: Kết quả từ Gemini -->
        <div v-if="currentStep === 4" class="step-container">
          <div v-if="loadingRecommendations" class="loading-container">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Đang phân tích và tư vấn...</p>
            <small class="text-muted">Vui lòng đợi trong giây lát</small>
          </div>
          
          <div v-else-if="error" class="error-container">
            <div class="alert alert-danger">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ error }}
            </div>
            <button class="btn btn-primary" @click="retryConsultation">
              Thử lại
            </button>
          </div>
          
          <div v-else-if="recommendations" class="recommendations-container">
            <h6 class="recommendations-title">
              <i class="bi bi-lightbulb me-2"></i>
              Gợi ý dựa trên yêu cầu của bạn:
            </h6>
            
            <!-- Gemini Response Text -->
            <div class="gemini-response-text" v-html="formatResponseText(recommendations.responseText)"></div>
            
            <!-- Recommended Products -->
            <div v-if="recommendedProducts && recommendedProducts.length > 0" class="recommended-products">
              <h6 class="products-title">Sản phẩm được đề xuất:</h6>
              <div class="products-grid">
                <div
                  v-for="product in recommendedProducts"
                  :key="product.id"
                  class="product-card"
                  @click="viewProduct(product.id)"
                >
                  <div class="product-image">
                    <i class="bi bi-laptop"></i>
                  </div>
                  <div class="product-info">
                    <h6 class="product-name">{{ product.tenSanPham }}</h6>
                    <p class="product-id">ID: {{ product.id }}</p>
                  </div>
                  <i class="bi bi-chevron-right product-arrow"></i>
                </div>
              </div>
            </div>
            
            <!-- Quick Replies -->
            <div v-if="recommendations.quickReplies && recommendations.quickReplies.length > 0" class="quick-replies-section">
              <div class="quick-replies">
                <button
                  v-for="reply in recommendations.quickReplies"
                  :key="reply.id"
                  @click="handleQuickReply(reply)"
                  class="quick-reply-btn"
                >
                  <i v-if="reply.icon" :class="reply.icon"></i>
                  {{ reply.replyText }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="consultation-footer">
        <button
          v-if="currentStep > 1 && currentStep < 4"
          @click="prevStep"
          class="btn btn-outline-secondary"
        >
          <i class="bi bi-arrow-left me-2"></i>
          Quay lại
        </button>
        
        <div class="footer-spacer"></div>
        
        <button
          v-if="currentStep < 3"
          @click="nextStep"
          class="btn btn-primary"
          :disabled="!canProceed"
        >
          Tiếp theo
          <i class="bi bi-arrow-right ms-2"></i>
        </button>
        
        <button
          v-if="currentStep === 3"
          @click="submitConsultation"
          class="btn btn-primary"
          :disabled="!canProceed || loadingRecommendations"
        >
          <span v-if="loadingRecommendations" class="spinner-border spinner-border-sm me-2"></span>
          <span v-else>
            <i class="bi bi-search me-2"></i>
            Tìm kiếm
          </span>
        </button>
        
        <button
          v-if="currentStep === 4 && !loadingRecommendations"
          @click="handleComplete"
          class="btn btn-success"
        >
          Hoàn thành
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import consultationService from '@/service/customer/consultationService'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'complete'])

const router = useRouter()

// State
const currentStep = ref(1)
const selectedPurposes = ref([])
const selectedBudget = ref(15000000) // Default 15 triệu
const selectedFeatures = ref([])
const loadingRecommendations = ref(false)
const recommendations = ref(null)
const recommendedProducts = ref([])
const error = ref(null)

// Constants
const minBudget = 5000000 // 5 triệu
const maxBudget = 50000000 // 50 triệu
const stepBudget = 1000000 // 1 triệu

const purposes = [
  { id: 'hoc-tap', name: 'Học tập', icon: 'bi bi-book' },
  { id: 'van-phong', name: 'Làm việc văn phòng', icon: 'bi bi-briefcase' },
  { id: 'gaming', name: 'Gaming', icon: 'bi bi-controller' },
  { id: 'do-hoa', name: 'Đồ họa/Video', icon: 'bi bi-palette' },
  { id: 'lap-trinh', name: 'Lập trình', icon: 'bi bi-code-slash' },
  { id: 'khac', name: 'Khác', icon: 'bi bi-three-dots' }
]

const budgetPresets = [
  { label: 'Dưới 10tr', value: 10000000 },
  { label: '10-20tr', value: 15000000 },
  { label: '20-30tr', value: 25000000 },
  { label: '30-50tr', value: 40000000 },
  { label: 'Trên 50tr', value: 50000000 }
]

const features = [
  { id: 'cpu-manh', name: 'CPU mạnh', icon: 'bi bi-cpu' },
  { id: 'ram-lon', name: 'RAM lớn (16GB+)', icon: 'bi bi-memory' },
  { id: 'o-cung-ssd', name: 'Ổ cứng SSD lớn', icon: 'bi bi-hdd' },
  { id: 'man-hinh-tot', name: 'Màn hình tốt', icon: 'bi bi-display' },
  { id: 'pin-lau', name: 'Pin lâu', icon: 'bi bi-battery-full' },
  { id: 'nhe', name: 'Nhẹ', icon: 'bi bi-feather' },
  { id: 'gia-re', name: 'Giá rẻ', icon: 'bi bi-tag' }
]

// Computed
const canProceed = computed(() => {
  if (currentStep.value === 1) {
    return selectedPurposes.value.length > 0
  }
  if (currentStep.value === 2) {
    return selectedBudget.value >= minBudget
  }
  if (currentStep.value === 3) {
    return true // Features are optional
  }
  return false
})

// Methods
const getStepLabel = (step) => {
  const labels = {
    1: 'Mục đích',
    2: 'Ngân sách',
    3: 'Tính năng',
    4: 'Kết quả'
  }
  return labels[step] || ''
}

const togglePurpose = (purposeId) => {
  const index = selectedPurposes.value.indexOf(purposeId)
  if (index > -1) {
    selectedPurposes.value.splice(index, 1)
  } else {
    selectedPurposes.value.push(purposeId)
  }
}

const nextStep = () => {
  if (canProceed.value && currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
    error.value = null
  }
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN').format(price)
}

const submitConsultation = async () => {
  loadingRecommendations.value = true
  error.value = null
  recommendations.value = null
  recommendedProducts.value = []

  try {
    const consultationData = {
      purposes: selectedPurposes.value.map(id => {
        const purpose = purposes.find(p => p.id === id)
        return purpose ? purpose.name : id
      }),
      budget: selectedBudget.value,
      features: selectedFeatures.value.map(id => {
        const feature = features.find(f => f.id === id)
        return feature ? feature.name : id
      }),
      userMessage: 'Tư vấn chọn laptop dựa trên thông tin đã cung cấp'
    }

    const response = await consultationService.submitConsultation(consultationData)
    
    recommendations.value = response
    
    // Extract product IDs from response text if available
    if (response && response.responseText) {
      extractProductsFromResponse(response.responseText)
    }
    
    currentStep.value = 4

  } catch (err) {
    console.error('Error submitting consultation:', err)
    error.value = err.message || 'Không thể tư vấn lúc này. Vui lòng thử lại sau.'
  } finally {
    loadingRecommendations.value = false
  }
}

const extractProductsFromResponse = (text) => {
  // Try to extract product IDs from response text
  // Format: "ID: xxx" or similar patterns
  const idPattern = /ID:\s*([a-f0-9-]{36})/gi
  const matches = text.matchAll(idPattern)
  const productIds = Array.from(matches, m => m[1])
  
  // For now, we'll just store the IDs
  // In a real implementation, you might want to fetch product details
  recommendedProducts.value = productIds.map(id => ({ id, tenSanPham: `Product ${id.substring(0, 8)}...` }))
}

const formatResponseText = (text) => {
  if (!text) return ''
  // Convert newlines to <br>
  return text.replace(/\n/g, '<br>')
}

const handleQuickReply = (reply) => {
  if (reply.replyType === 'url' && reply.replyValue) {
    router.push(reply.replyValue)
    handleClose()
  }
}

const viewProduct = (productId) => {
  router.push(`/san-pham/${productId}`)
  handleClose()
}

const retryConsultation = () => {
  error.value = null
  submitConsultation()
}

const handleClose = () => {
  emit('close')
  // Reset state
  currentStep.value = 1
  selectedPurposes.value = []
  selectedBudget.value = 15000000
  selectedFeatures.value = []
  recommendations.value = null
  recommendedProducts.value = []
  error.value = null
}

const handleComplete = () => {
  emit('complete', {
    purposes: selectedPurposes.value,
    budget: selectedBudget.value,
    features: selectedFeatures.value,
    recommendations: recommendations.value
  })
  handleClose()
}

// Watch show prop to reset when closed
watch(() => props.show, (newVal) => {
  if (!newVal) {
    handleClose()
  }
})
</script>

<style scoped>
.consultation-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.consultation-modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.consultation-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 16px 16px 0 0;
}

.consultation-header h5 {
  color: white;
  font-weight: 600;
}

.consultation-header .btn-link {
  color: white;
  opacity: 0.9;
}

.consultation-header .btn-link:hover {
  opacity: 1;
}

.consultation-progress {
  padding: 20px 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.progress-bar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.progress-bar-container::before {
  content: '';
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  height: 2px;
  background: #e5e7eb;
  z-index: 0;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  flex: 1;
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
  transition: all 0.3s;
}

.progress-step.active .step-circle {
  background: #667eea;
  border-color: #667eea;
  color: white;
  transform: scale(1.1);
}

.progress-step.completed .step-circle {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.step-label {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.progress-step.active .step-label {
  color: #667eea;
  font-weight: 600;
}

.consultation-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.step-container {
  min-height: 300px;
}

.step-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.step-description {
  color: #6b7280;
  margin-bottom: 24px;
}

.option-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.option-card {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-card:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.option-card.selected {
  border-color: #667eea;
  background: #eef2ff;
  color: #667eea;
}

.option-card i {
  font-size: 24px;
}

.budget-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.budget-slider-wrapper {
  position: relative;
}

.budget-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.budget-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.budget-slider::-moz-range-thumb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.budget-display {
  text-align: center;
  margin-top: 16px;
}

.budget-value {
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
}

.budget-presets {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.budget-preset-btn {
  padding: 10px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.budget-preset-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.budget-preset-btn.active {
  border-color: #667eea;
  background: #eef2ff;
  color: #667eea;
}

.feature-checkboxes {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-checkbox {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 12px;
}

.feature-checkbox:hover {
  border-color: #667eea;
}

.feature-checkbox.checked {
  border-color: #667eea;
  background: #eef2ff;
}

.feature-input {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.feature-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  flex: 1;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 40px 20px;
}

.recommendations-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.recommendations-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.gemini-response-text {
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  line-height: 1.6;
  color: #374151;
}

.recommended-products {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.products-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-card {
  padding: 16px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: #667eea;
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.product-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.product-id {
  font-size: 12px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.product-arrow {
  font-size: 20px;
  color: #9ca3af;
}

.quick-replies-section {
  margin-top: 16px;
}

.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-reply-btn {
  padding: 10px 16px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: white;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.quick-reply-btn:hover {
  background: #667eea;
  color: white;
}

.consultation-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
  background: #f9fafb;
  border-radius: 0 0 16px 16px;
}

.footer-spacer {
  flex: 1;
}

@media (max-width: 768px) {
  .consultation-modal-container {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .option-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>

