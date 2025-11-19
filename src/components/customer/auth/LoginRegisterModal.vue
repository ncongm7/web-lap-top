<template>
  <div v-if="show" class="modal-overlay" @click.self="handleClose">
    <div class="modal-container">
      <!-- Close button -->
      <button class="close-btn" @click="handleClose">
        <i class="fas fa-times"></i>
      </button>

      <!-- Header -->
      <div class="modal-header">
        <h2>{{ isLogin ? 'Đăng nhập' : 'Đăng ký tài khoản' }}</h2>
        <p class="subtitle">
          {{ isLogin ? 'Đăng nhập để tiếp tục mua sắm' : 'Tạo tài khoản mới để bắt đầu mua sắm' }}
        </p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button :class="['tab', { active: isLogin }]" @click="isLogin = true">Đăng nhập</button>
        <button :class="['tab', { active: !isLogin }]" @click="isLogin = false">Đăng ký</button>
      </div>

      <!-- Login Form -->
      <form v-if="isLogin" @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label>Số điện thoại</label>
          <input v-model="loginForm.soDienThoai" type="text" placeholder="Nhập số điện thoại" required
            :disabled="loading" @input="error = ''" />
        </div>

        <div class="form-group">
          <label>Mật khẩu</label>
          <div class="password-input">
            <input v-model="loginForm.matKhau" :type="showPassword ? 'text' : 'password'" placeholder="Nhập mật khẩu"
              required :disabled="loading" @input="error = ''" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading"> <i class="fas fa-spinner fa-spin"></i> Đang đăng nhập... </span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <!-- Register Form -->
      <form v-else @submit.prevent="handleRegister" class="form">
        <div class="form-group">
          <label>Họ và tên <span class="required">*</span></label>
          <input v-model="registerForm.hoTen" type="text" placeholder="Nhập họ và tên" required :disabled="loading" />
        </div>

        <div class="form-group">
          <label>Số điện thoại <span class="required">*</span></label>
          <input v-model="registerForm.soDienThoai" type="text" placeholder="Nhập số điện thoại (VD: 0987654321)"
            required pattern="^0\d{9}$" :disabled="loading" />
          <small class="help-text">Số điện thoại sẽ dùng làm tên đăng nhập</small>
        </div>

        <div class="form-group">
          <label>Email <span class="optional">(không bắt buộc)</span></label>
          <input v-model="registerForm.email" type="email" placeholder="Nhập email (không bắt buộc)"
            :disabled="loading" />
          <small class="help-text">Có thể cập nhật sau trong hồ sơ</small>
        </div>

        <!-- Các trường gioiTinh và ngaySinh đã được bỏ - sẽ cấu hình sau trong hồ sơ -->

        <div class="form-group">
          <label>Mật khẩu <span class="required">*</span></label>
          <div class="password-input">
            <input v-model="registerForm.matKhau" :type="showPassword ? 'text' : 'password'" placeholder="Nhập mật khẩu"
              required minlength="6" :disabled="loading" />
            <button type="button" class="toggle-password" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Xác nhận mật khẩu <span class="required">*</span></label>
          <div class="password-input">
            <input v-model="registerForm.xacNhanMatKhau" :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Nhập lại mật khẩu" required minlength="6" :disabled="loading" />
            <button type="button" class="toggle-password" @click="showConfirmPassword = !showConfirmPassword">
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
        </div>

        <div v-if="error" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          {{ error }}
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading"> <i class="fas fa-spinner fa-spin"></i> Đang đăng ký... </span>
          <span v-else>Đăng ký</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import authService from '@/service/customer/authService'

const route = useRoute()

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'success'])

// State
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Form data
const loginForm = ref({
  soDienThoai: '',
  matKhau: '',
})

const registerForm = ref({
  hoTen: '',
  soDienThoai: '',
  email: '', // Optional - có thể để trống
  matKhau: '',
  xacNhanMatKhau: '',
  // Các trường gioiTinh và ngaySinh đã được bỏ - sẽ cấu hình sau trong hồ sơ
})

// Import layoutStore để lấy showRegisterTab
import { useLayoutStore } from '@/stores/customer/layoutStore'
const layoutStore = useLayoutStore()

// Watch for show prop to reset form
watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      resetForms()
      // Tự động chuyển sang tab đăng ký nếu layoutStore.showRegisterTab = true
      if (layoutStore.showRegisterTab) {
        isLogin.value = false
        layoutStore.showRegisterTab = false // Reset sau khi dùng
      } else {
        isLogin.value = true
      }
    }
  },
)


// Methods
const resetForms = () => {
  error.value = ''
  loginForm.value = {
    soDienThoai: '',
    matKhau: '',
  }
  registerForm.value = {
    hoTen: '',
    soDienThoai: '',
    email: '', // Optional
    matKhau: '',
    xacNhanMatKhau: '',
    // Các trường gioiTinh và ngaySinh đã được bỏ
  }
  showPassword.value = false
  showConfirmPassword.value = false
}

const handleClose = () => {
  if (!loading.value) {
    emit('close')
  }
}

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const response = await authService.login({
      tenDangNhap: loginForm.value.soDienThoai,
      matKhau: loginForm.value.matKhau,
    })

    // Lưu vào localStorage
    if (response.data) {
      const { token, user } = response.data
      localStorage.setItem('customer_token', token)
      localStorage.setItem('customer_user', JSON.stringify(user))
      localStorage.setItem('customer_id', user.userId)
    }

    emit('success', response.data)
    emit('close')
  } catch (err) {
    console.error('Login error:', err)
    // Xử lý các loại lỗi cụ thể
    if (err.response?.status === 401 || err.response?.status === 403) {
      error.value = 'Số điện thoại hoặc mật khẩu không chính xác. Vui lòng thử lại.'
    } else if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.'
    }
    // Modal vẫn mở, không emit 'close'
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  error.value = ''

  // Validate
  if (registerForm.value.matKhau !== registerForm.value.xacNhanMatKhau) {
    error.value = 'Mật khẩu xác nhận không khớp'
    return
  }

  if (!/^0\d{9}$/.test(registerForm.value.soDienThoai)) {
    error.value = 'Số điện thoại phải bắt đầu bằng 0 và có đúng 10 chữ số'
    return
  }

  loading.value = true

  try {
    // Chỉ gửi các trường cần thiết, bỏ email nếu empty
    const registerData = {
      hoTen: registerForm.value.hoTen,
      soDienThoai: registerForm.value.soDienThoai,
      matKhau: registerForm.value.matKhau,
      xacNhanMatKhau: registerForm.value.xacNhanMatKhau,
    }
    // Chỉ thêm email nếu có giá trị
    if (registerForm.value.email && registerForm.value.email.trim()) {
      registerData.email = registerForm.value.email.trim()
    }

    const response = await authService.register(registerData)

    // Lưu vào localStorage
    if (response.data) {
      const { token, user } = response.data
      localStorage.setItem('customer_token', token)
      localStorage.setItem('customer_user', JSON.stringify(user))
      localStorage.setItem('customer_id', user.userId)
    }

    emit('success', response.data)
    emit('close')
  } catch (err) {
    console.error('Register error:', err)
    // Xử lý các loại lỗi cụ thể
    if (err.response?.data?.message) {
      error.value = err.response.data.message
    } else if (err.message) {
      error.value = err.message
    } else {
      error.value = 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
    }
    // Modal vẫn mở, không emit 'close'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.modal-container {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(30px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: #e5e7eb;
  transform: rotate(90deg);
}

.modal-header {
  padding: 32px 32px 24px;
  text-align: center;
}

.modal-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.tabs {
  display: flex;
  gap: 8px;
  padding: 0 32px;
  margin-bottom: 24px;
}

.tab {
  flex: 1;
  padding: 12px;
  background: #f3f4f6;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.form {
  padding: 0 32px 32px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #10b981;
}

.form-group input:disabled,
.form-group select:disabled {
  background: #f9fafb;
  cursor: not-allowed;
}

.help-text {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 6px;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
}

.toggle-password:hover {
  color: #6b7280;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header,
  .tabs,
  .form {
    padding-left: 20px;
    padding-right: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
