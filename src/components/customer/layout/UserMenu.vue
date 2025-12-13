<template>
  <div class="user-menu">
    <!-- Nếu chưa đăng nhập -->
    <div v-if="!isLoggedIn" class="login-actions">
      <button ref="actionButtonRef" @click="toggleDropdown" class="action-btn">
        <i class="bi bi-person fs-4"></i>
        <span class="label">Tài khoản</span>
        <span class="dropdown-icon-small"><i class="bi bi-caret-down-fill" style="font-size: 8px;"></i></span>
      </button>

      <!-- Dropdown khi chưa đăng nhập -->
      <transition name="dropdown">
        <div ref="loggedOutDropdownRef" v-if="showDropdown" v-click-outside="closeDropdown" class="dropdown-menu shadow"
          @click.stop>
          <button @click="handleLoginClick" class="dropdown-item">
            <i class="bi bi-box-arrow-in-right me-2 text-primary"></i>
            <span>Đăng nhập</span>
          </button>
          <button @click="handleRegisterClick" class="dropdown-item">
            <i class="bi bi-pencil-square me-2 text-info"></i>
            <span>Đăng ký</span>
          </button>
        </div>
      </transition>
    </div>

    <!-- Nếu đã đăng nhập -->
    <div v-else class="user-actions">
      <button ref="userButtonRef" @click.stop="toggleDropdown" @mousedown.stop class="user-btn" type="button"
        style="position: relative; z-index: 1">
        <div class="user-avatar shadow-sm">{{ displayName.charAt(0).toUpperCase() }}</div>
        <span class="user-name d-none d-md-block">{{ displayName }}</span>
        <i class="bi bi-caret-down-fill ms-1 text-muted" style="font-size: 10px;"></i>
      </button>

      <!-- Dropdown Menu khi đã đăng nhập -->
      <transition name="dropdown">
        <div ref="loggedInDropdownRef" v-if="showDropdown" v-click-outside="closeDropdown" class="dropdown-menu shadow"
          @click.stop>
          <div class="dropdown-header">
            <div class="user-info">
              <div class="user-avatar-large shadow-sm">{{ displayName.charAt(0).toUpperCase() }}</div>
              <div class="user-details">
                <div class="user-name-display">{{ displayName }}</div>
                <div class="user-email" v-if="userEmail">{{ userEmail }}</div>
              </div>
            </div>
          </div>
          <hr class="dropdown-divider" />
          <router-link to="/account/profile" class="dropdown-item" @click="closeDropdown">
            <i class="bi bi-person-circle me-3 text-secondary"></i>
            <span>Tài khoản của tôi</span>
          </router-link>

          <router-link to="/orders" class="dropdown-item" @click="closeDropdown">
            <i class="bi bi-box-seam me-3 text-secondary"></i>
            <span>Đơn hàng của tôi</span>
          </router-link>

          <router-link to="/account/addresses" class="dropdown-item" @click="closeDropdown">
            <i class="bi bi-geo-alt me-3 text-secondary"></i>
            <span>Địa chỉ</span>
          </router-link>
          <router-link to="/account/warranty" class="dropdown-item" @click="closeDropdown">
            <i class="bi bi-shield-check me-3 text-secondary"></i>
            <span>Bảo hành</span>
          </router-link>
          <router-link to="/account/points" class="dropdown-item" @click="closeDropdown">
            <i class="bi bi-star me-3 text-warning"></i>
            <span>Điểm tích lũy</span>
          </router-link>
          <hr class="dropdown-divider" />
          <button @click="handleLogout" class="dropdown-item logout-btn">
            <i class="bi bi-box-arrow-right me-3"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/customer/layoutStore'
import authService from '@/service/customer/authService'
import { useToast } from 'vue-toastification'

const router = useRouter()
const layoutStore = useLayoutStore()
const toast = useToast()

const showDropdown = ref(false)
const userButtonRef = ref(null)
const actionButtonRef = ref(null)
const loggedInDropdownRef = ref(null)
const loggedOutDropdownRef = ref(null)

// Computed - Sử dụng layoutStore để reactive
const isLoggedIn = computed(() => {
  return layoutStore.isLoggedIn
})

// Đóng dropdown khi trạng thái đăng nhập thay đổi
watch(isLoggedIn, () => {
  showDropdown.value = false
})

const displayName = computed(() => {
  return layoutStore.displayName
})

const userEmail = computed(() => {
  return layoutStore.user?.email || ''
})

// Methods
const toggleDropdown = (event) => {
  if (event) {
    event.preventDefault()
    event.stopPropagation()
  }
  showDropdown.value = !showDropdown.value

  // Tính toán vị trí dropdown khi mở
  if (showDropdown.value) {
    nextTick(() => {
      const button = userButtonRef.value || actionButtonRef.value
      const dropdown = loggedInDropdownRef.value || loggedOutDropdownRef.value
      if (button && dropdown) {
        const rect = button.getBoundingClientRect()
        dropdown.style.top = `${rect.bottom + window.scrollY + 8}px`
        dropdown.style.right = `${window.innerWidth - rect.right}px`
      }
    })
  }
}

const closeDropdown = () => {
  showDropdown.value = false
}

const handleLoginClick = () => {
  closeDropdown()
  layoutStore.openLoginModal()
}

const handleRegisterClick = () => {
  closeDropdown()
  layoutStore.openLoginModal()
  // Có thể thêm logic để tự động chuyển sang tab đăng ký
}

const handleLogout = async () => {
  try {
    await authService.logout()
    layoutStore.logout()
    closeDropdown()
    toast.success('Đăng xuất thành công')
    router.push('/')
  } catch (error) {
    console.error('Lỗi đăng xuất:', error)
    toast.error('Có lỗi xảy ra khi đăng xuất')
  }
}

// Click outside directive
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      const userMenu = el.closest('.user-menu')
      if (!userMenu) return

      const button = userMenu.querySelector('.user-btn, .action-btn')
      const clickedInside =
        el.contains(event.target) ||
        (button && (button === event.target || button.contains(event.target)))

      if (!clickedInside) {
        binding.value()
      }
    }
    // Delay để tránh conflict với button click
    setTimeout(() => {
      document.addEventListener('click', el.clickOutsideEvent)
    }, 100)
  },
  unmounted(el) {
    if (el.clickOutsideEvent) {
      document.removeEventListener('click', el.clickOutsideEvent)
    }
  },
}
</script>

<style scoped>
.user-menu {
  position: relative;
}

.login-actions {
  position: relative;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: none;
  border: none;
  color: #1e293b;
  border-radius: 8px;
  transition: background 0.2s;
  cursor: pointer;
}

.action-btn:hover {
  background: #f1f5f9;
}

.action-btn .icon {
  font-size: 24px;
}

.action-btn .label {
  font-size: 12px;
}

.dropdown-icon-small {
  font-size: 8px;
  color: #64748b;
  margin-top: -2px;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: none;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.user-btn:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #10b981;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1e293b;
}

.dropdown-icon {
  font-size: 10px;
  color: #64748b;
}

.user-actions {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: fixed;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 220px;
  padding: 8px 0;
  z-index: 10001;
  overflow: visible;
  max-height: none;
  height: auto;
  display: block;
}

/* Đảm bảo tất cả children hiển thị */
.dropdown-menu>* {
  visibility: visible !important;
  opacity: 1 !important;
}

/* Đảm bảo router-link và button hiển thị đúng */
.dropdown-menu .dropdown-item {
  display: flex !important;
}

.dropdown-header {
  padding: 12px 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar-large {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name-display {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-item {
  display: flex !important;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  text-decoration: none;
  color: #1e293b;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  visibility: visible !important;
  opacity: 1 !important;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-item .icon {
  font-size: 18px;
}

.dropdown-divider {
  margin: 8px 0;
  border: none;
  border-top: 1px solid #e2e8f0;
}

.logout-btn {
  color: #ef4444;
}

/* Dropdown Transition */
.dropdown-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.dropdown-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
