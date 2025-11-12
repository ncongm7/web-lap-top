<template>
    <div class="user-menu">
        <!-- Nếu chưa đăng nhập -->
        <div v-if="!isLoggedIn" class="login-actions">
            <router-link to="/login" class="action-btn">
                <i class="icon">👤</i>
                <span class="label">Đăng nhập</span>
            </router-link>
        </div>

        <!-- Nếu đã đăng nhập -->
        <div v-else class="user-actions">
            <button @click="toggleDropdown" class="user-btn">
                <div class="user-avatar">{{ displayName.charAt(0).toUpperCase() }}</div>
                <span class="user-name">{{ displayName }}</span>
                <span class="dropdown-icon">▼</span>
            </button>

            <!-- Dropdown Menu -->
            <transition name="dropdown">
                <div v-if="showDropdown" v-click-outside="closeDropdown" class="dropdown-menu">
                    <router-link to="/account/profile" class="dropdown-item" @click="closeDropdown">
                        <i class="icon">👤</i>
                        <span>Tài khoản của tôi</span>
                    </router-link>
                    <router-link to="/account/orders" class="dropdown-item" @click="closeDropdown">
                        <i class="icon">📦</i>
                        <span>Đơn hàng</span>
                    </router-link>
                    <router-link to="/account/addresses" class="dropdown-item" @click="closeDropdown">
                        <i class="icon">📍</i>
                        <span>Sổ địa chỉ</span>
                    </router-link>
                    <router-link to="/account/warranty" class="dropdown-item" @click="closeDropdown">
                        <i class="icon">🛡️</i>
                        <span>Bảo hành</span>
                    </router-link>
                    <router-link to="/account/points" class="dropdown-item" @click="closeDropdown">
                        <i class="icon">⭐</i>
                        <span>Điểm tích lũy</span>
                    </router-link>
                    <hr class="dropdown-divider" />
                    <button @click="handleLogout" class="dropdown-item logout-btn">
                        <i class="icon">🚪</i>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/customer/authStore'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showDropdown = ref(false)

const isLoggedIn = computed(() => authStore.isAuthenticated)
const displayName = computed(() => authStore.getUserName || 'Khách hàng')

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value
}

const closeDropdown = () => {
    showDropdown.value = false
}

const handleLogout = async () => {
    try {
        await authStore.logout()
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
            if (!(el === event.target || el.contains(event.target))) {
                binding.value()
            }
        }
        document.addEventListener('click', el.clickOutsideEvent)
    },
    unmounted(el) {
        document.removeEventListener('click', el.clickOutsideEvent)
    },
}
</script>

<style scoped>
.user-menu {
    position: relative;
}

.action-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    text-decoration: none;
    color: #1e293b;
    border-radius: 8px;
    transition: background 0.2s;
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

.dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 8px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 220px;
    padding: 8px 0;
    z-index: 100;
}

.dropdown-item {
    display: flex;
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
.dropdown-enter-active,
.dropdown-leave-active {
    transition: all 0.2s;
}

.dropdown-enter-from,
.dropdown-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}
</style>
