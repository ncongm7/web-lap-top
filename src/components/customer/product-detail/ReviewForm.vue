<template>
  <Teleport to="body">
    <div class="modal-overlay" @click.self="handleClose">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">Gửi đánh giá</h2>
          <button class="modal-close" @click="handleClose">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="review-form">
          <!-- Product Info -->
          <div class="form-section">
            <p class="product-name">{{ productName }}</p>
          </div>

          <!-- Rating -->
          <div class="form-section">
            <label class="form-label">Đánh giá của bạn *</label>
            <div class="rating-selector">
              <button v-for="i in 5" :key="i" type="button" class="rating-star-btn" :class="{ active: rating >= i }"
                @click="rating = i">
                ★
              </button>
            </div>
            <p v-if="ratingError" class="error-text">{{ ratingError }}</p>
          </div>

          <!-- Content -->
          <div class="form-section">
            <label class="form-label" for="review-title">Tiêu đề đánh giá</label>
            <input id="review-title" v-model="reviewTitle" type="text" class="form-input"
              placeholder="Tóm tắt ngắn gọn về đánh giá của bạn..." maxlength="255" />
          </div>

          <div class="form-section">
            <label class="form-label" for="review-content">Nội dung đánh giá *</label>
            <textarea id="review-content" v-model="content" rows="6" class="form-textarea"
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."></textarea>
            <p v-if="contentError" class="error-text">{{ contentError }}</p>
            <p class="form-hint">Tối thiểu 10 ký tự</p>
          </div>

          <!-- Pros -->
          <div class="form-section">
            <label class="form-label">Điểm mạnh</label>
            <div class="tags-input-container">
              <div class="tags-list">
                <span v-for="(pro, idx) in pros" :key="idx" class="tag tag-success">
                  {{ pro }}
                  <button type="button" @click="removePro(idx)" class="tag-remove">×</button>
                </span>
              </div>
              <input v-model="proInput" type="text" class="tags-input" placeholder="Nhập điểm mạnh và nhấn Enter..."
                @keydown.enter.prevent="addPro" />
            </div>
          </div>

          <!-- Cons -->
          <div class="form-section">
            <label class="form-label">Điểm yếu</label>
            <div class="tags-input-container">
              <div class="tags-list">
                <span v-for="(con, idx) in cons" :key="idx" class="tag tag-warning">
                  {{ con }}
                  <button type="button" @click="removeCon(idx)" class="tag-remove">×</button>
                </span>
              </div>
              <input v-model="conInput" type="text" class="tags-input" placeholder="Nhập điểm yếu và nhấn Enter..."
                @keydown.enter.prevent="addCon" />
            </div>
          </div>

          <!-- Images -->
          <div class="form-section">
            <label class="form-label">Hình ảnh (tối đa 5 ảnh)</label>
            <div class="image-upload-area">
              <input ref="fileInput" type="file" multiple accept="image/*" @change="handleFileSelect"
                class="file-input" />
              <div class="upload-preview">
                <div v-for="(img, idx) in imagePreviews" :key="idx" class="preview-item">
                  <img :src="img.url" :alt="`Preview ${idx + 1}`" />
                  <button type="button" class="remove-image" @click="removeImage(idx)">
                    ×
                  </button>
                </div>
                <button v-if="imagePreviews.length < 5" type="button" class="add-image-btn"
                  @click="$refs.fileInput.click()">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Thêm ảnh
                </button>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="handleClose">
              Hủy
            </button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? 'Đang gửi...' : 'Gửi đánh giá' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useProductReviews } from '@/composables/product-detail/useProductReviews'
import { useAuthStore } from '@/stores/customer/authStore'

const props = defineProps({
  productId: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    default: 'Sản phẩm',
  },
  variantId: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const authStore = useAuthStore()
const { submitReview, submitting } = useProductReviews(props.productId)

const rating = ref(0)
const reviewTitle = ref('')
const content = ref('')
const pros = ref([])
const cons = ref([])
const proInput = ref('')
const conInput = ref('')
const imagePreviews = ref([])
const ratingError = ref('')
const contentError = ref('')

const validate = () => {
  ratingError.value = ''
  contentError.value = ''

  if (rating.value === 0) {
    ratingError.value = 'Vui lòng chọn số sao đánh giá'
    return false
  }

  if (!content.value || content.value.trim().length < 10) {
    contentError.value = 'Nội dung đánh giá phải có ít nhất 10 ký tự'
    return false
  }

  return true
}

const addPro = () => {
  if (proInput.value.trim() && pros.value.length < 5) {
    pros.value.push(proInput.value.trim())
    proInput.value = ''
  }
}

const removePro = (index) => {
  pros.value.splice(index, 1)
}

const addCon = () => {
  if (conInput.value.trim() && cons.value.length < 5) {
    cons.value.push(conInput.value.trim())
    conInput.value = ''
  }
}

const removeCon = (index) => {
  cons.value.splice(index, 1)
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files || [])
  const remaining = 5 - imagePreviews.value.length

  files.slice(0, remaining).forEach((file) => {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} quá lớn. Tối đa 5MB.`)
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(`File ${file.name} không phải là hình ảnh.`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreviews.value.push({
        file,
        url: e.target.result,
      })
    }
    reader.readAsDataURL(file)
  })
}

const removeImage = (index) => {
  imagePreviews.value.splice(index, 1)
}

const handleSubmit = async () => {
  if (!validate()) return

  try {
    // Get customer ID from auth store
    const khachHangId = authStore.customerId || authStore.user?.userId

    if (!khachHangId) {
      alert('Vui lòng đăng nhập để gửi đánh giá')
      return
    }

    const reviewData = {
      khachHangId: khachHangId,
      chiTietSanPhamId: props.variantId,
      soSao: rating.value,
      reviewTitle: reviewTitle.value,
      noiDung: content.value,
      pros: pros.value.length > 0 ? pros.value : undefined,
      cons: cons.value.length > 0 ? cons.value : undefined,
      imageUrls: [], // TODO: Upload images first
      hoaDonChiTietId: props.hoaDonChiTietId || null // Optional
    }

    await submitReview(reviewData)
    emit('submit')
    handleClose()
  } catch (error) {
    console.error('Error submitting review:', error)
    alert(error.response?.data?.message || 'Không thể gửi đánh giá. Vui lòng thử lại.')
  }
}

const handleClose = () => {
  emit('close')
  // Reset form
  rating.value = 0
  content.value = ''
  imagePreviews.value = []
  ratingError.value = ''
  contentError.value = ''
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #6b7280;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #1a1a1a;
}

.modal-close svg {
  width: 24px;
  height: 24px;
}

.review-form {
  padding: 24px;
}

.form-section {
  margin-bottom: 24px;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #2563eb;
}

.rating-selector {
  display: flex;
  gap: 8px;
}

.rating-star-btn {
  font-size: 32px;
  color: #d1d5db;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.rating-star-btn:hover,
.rating-star-btn.active {
  color: #fbbf24;
}

.form-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

.form-textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.tags-input-container {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px;
  min-height: 60px;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.tag-success {
  background: #dcfce7;
  color: #166534;
}

.tag-warning {
  background: #fef3c7;
  color: #92400e;
}

.tag-remove {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  color: inherit;
  opacity: 0.7;
}

.tag-remove:hover {
  opacity: 1;
}

.tags-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  padding: 4px;
  width: 100%;
}

.form-hint {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.error-text {
  font-size: 12px;
  color: #ef4444;
  margin-top: 4px;
}

.image-upload-area {
  margin-top: 8px;
}

.file-input {
  display: none;
}

.upload-preview {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 80px;
  height: 80px;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ef4444;
  color: white;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-image-btn {
  width: 80px;
  height: 80px;
  border: 2px dashed #d1d5db;
  border-radius: 6px;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.add-image-btn:hover {
  border-color: #2563eb;
  color: #2563eb;
}

.add-image-btn svg {
  width: 24px;
  height: 24px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-cancel:hover {
  border-color: #d1d5db;
}

.btn-submit {
  background: #2563eb;
  border: none;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
