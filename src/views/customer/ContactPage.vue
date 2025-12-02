<template>
  <div class="contact-page">
    <div class="contact-container">
      <!-- Header -->
      <div class="contact-header">
        <h1 class="page-title">Liên hệ với chúng tôi</h1>
        <p class="page-subtitle">Chúng tôi luôn sẵn sàng hỗ trợ bạn</p>
      </div>

      <!-- Product Info (if coming from product page) -->
      <div v-if="productInfo" class="product-info-card">
        <div class="product-info-content">
          <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.196-.897.4-1.125.59-.125 1.175h1.25c.612 0 .837-.412.837-1.25 0-.344-.062-.618-.207-.93l-.966-1.73C7.51 4.27 6.727 3.5 5.651 3.5c-1.344 0-2.163.88-2.163 2.05 0 .38.164.712.41.94zM11 7.5c.552 0 .5-.447.5-1 0-.552.052-1 .5-1 .552 0 .5.448.5 1 0 .553-.052 1-.5 1z"/>
          </svg>
          <div class="product-info-text">
            <strong>Bạn đang quan tâm đến sản phẩm:</strong>
            <p class="product-name">{{ productInfo.productName }}</p>
          </div>
        </div>
      </div>

      <div class="contact-content">
        <!-- Contact Info Cards -->
        <div class="contact-info-grid">
          <!-- Store Address -->
          <div class="info-card">
            <div class="info-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
            </div>
            <h3 class="info-title">Địa chỉ cửa hàng</h3>
            <p class="info-text">123 Đường ABC, Phường XYZ</p>
            <p class="info-text">Quận 1, TP. Hồ Chí Minh</p>
          </div>

          <!-- Phone -->
          <div class="info-card">
            <div class="info-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122L9.65 10.5a.678.678 0 0 1-.64-.39l-.84-1.68a.678.678 0 0 1-.122-.58l.122-2.307a.678.678 0 0 0-.122-.58L6.5 2.65a.678.678 0 0 0-.39-.64L4.47 1.21a.678.678 0 0 0-.58-.122l-2.307.45z"/>
              </svg>
            </div>
            <h3 class="info-title">Hotline</h3>
            <p class="info-text">
              <a href="tel:1900123456" class="contact-link">1900 123 456</a>
            </p>
            <p class="info-text">
              <a href="tel:0912345678" class="contact-link">0912 345 678</a>
            </p>
          </div>

          <!-- Email -->
          <div class="info-card">
            <div class="info-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
              </svg>
            </div>
            <h3 class="info-title">Email</h3>
            <p class="info-text">
              <a href="mailto:info@laptopstore.vn" class="contact-link">info@laptopstore.vn</a>
            </p>
            <p class="info-text">
              <a href="mailto:support@laptopstore.vn" class="contact-link">support@laptopstore.vn</a>
            </p>
          </div>

          <!-- Business Hours -->
          <div class="info-card">
            <div class="info-icon">
              <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
              </svg>
            </div>
            <h3 class="info-title">Giờ làm việc</h3>
            <p class="info-text">Thứ 2 - Thứ 6: 8:00 - 20:00</p>
            <p class="info-text">Thứ 7 - Chủ nhật: 9:00 - 18:00</p>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="contact-form-section">
          <h2 class="section-title">Gửi tin nhắn cho chúng tôi</h2>
          <form @submit.prevent="handleSubmit" class="contact-form">
            <div class="form-row">
              <div class="form-group">
                <label for="name">Họ và tên *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  required
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div class="form-group">
                <label for="phone">Số điện thoại *</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  required
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="email">Email *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  required
                  placeholder="Nhập email"
                />
              </div>
              <div class="form-group">
                <label for="subject">Chủ đề *</label>
                <select id="subject" v-model="form.subject" required>
                  <option value="">Chọn chủ đề</option>
                  <option value="product-inquiry">Tư vấn sản phẩm</option>
                  <option value="order">Đơn hàng</option>
                  <option value="warranty">Bảo hành</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label for="message">Nội dung tin nhắn *</label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                required
                placeholder="Nhập nội dung tin nhắn..."
              ></textarea>
            </div>

            <button type="submit" class="submit-btn" :disabled="submitting">
              <span v-if="submitting">Đang gửi...</span>
              <span v-else>Gửi tin nhắn</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const { showSuccess, showError } = useToast()

const productInfo = ref(null)
const submitting = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  subject: '',
  message: '',
})

onMounted(() => {
  // Lấy thông tin sản phẩm từ query params nếu có
  if (route.query.productId && route.query.productName) {
    productInfo.value = {
      productId: route.query.productId,
      productName: route.query.productName,
    }

    // Tự động điền chủ đề và nội dung
    form.value.subject = 'product-inquiry'
    form.value.message = `Tôi quan tâm đến sản phẩm: ${route.query.productName}\n\nVui lòng liên hệ với tôi để được tư vấn thêm về sản phẩm này.`
  }
})

const handleSubmit = async () => {
  submitting.value = true

  try {
    // TODO: Gửi form đến backend API
    // const response = await contactService.submitContactForm({
    //   ...form.value,
    //   productId: productInfo.value?.productId,
    // })

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    showSuccess('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.')

    // Reset form
    form.value = {
      name: '',
      phone: '',
      email: '',
      subject: '',
      message: '',
    }

    // Clear product info
    productInfo.value = null
  } catch (error) {
    console.error('Error submitting contact form:', error)
    showError('Không thể gửi tin nhắn. Vui lòng thử lại sau.')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: #f5f5f7;
  padding: 40px 16px;
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
}

.contact-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-title {
  font-size: 48px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.page-subtitle {
  font-size: 20px;
  color: #6b7280;
}

.product-info-card {
  background: #e3f2fd;
  border: 2px solid #2196f3;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
}

.product-info-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.product-info-content svg {
  color: #2196f3;
  flex-shrink: 0;
}

.product-info-text {
  flex: 1;
}

.product-info-text strong {
  display: block;
  color: #1976d2;
  margin-bottom: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.contact-content {
  display: grid;
  gap: 48px;
}

.contact-info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.info-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f7;
  border-radius: 50%;
  color: #2563eb;
}

.info-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.info-text {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
}

.contact-link {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s;
}

.contact-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

.contact-form-section {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 32px;
}

.contact-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #2563eb;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  padding: 16px 32px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .contact-info-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .contact-form-section {
    padding: 24px;
  }
}
</style>
