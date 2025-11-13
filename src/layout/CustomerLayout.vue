<template>
  <div class="customer-layout">
    <CustomerHeader />

    <main class="main-content">
      <router-view />
    </main>

    <CustomerFooter />

    <!-- Global Login/Register Modal -->
    <LoginRegisterModal
      :show="layoutStore.showLoginModal"
      @close="layoutStore.closeLoginModal()"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import CustomerHeader from '@/components/customer/layout/CustomerHeader.vue'
import CustomerFooter from '@/components/customer/layout/CustomerFooter.vue'
import LoginRegisterModal from '@/components/customer/auth/LoginRegisterModal.vue'
import { useLayoutStore } from '@/stores/customer/layoutStore'
import { useCartStore } from '@/stores/customer/cartStore'
import authService from '@/service/customer/authService'

const router = useRouter()
const toast = useToast()
const layoutStore = useLayoutStore()
const cartStore = useCartStore()

// Khởi tạo auth state khi app load
onMounted(async () => {
  // Kiểm tra và khôi phục auth state từ localStorage
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser()
    const token = localStorage.getItem('customer_token')
    if (user && token) {
      layoutStore.setUser(user, token)
      // Fetch giỏ hàng nếu đã đăng nhập
      await cartStore.fetchCart()
    }
  }
})

// Handle đăng nhập thành công
const handleLoginSuccess = async (authData) => {
  console.log('Login successful:', authData)

  // Cập nhật layoutStore
  if (authData?.user && authData?.token) {
    layoutStore.setUser(authData.user, authData.token)
  }

  toast.success('Đăng nhập thành công!')

  // Refresh giỏ hàng
  await cartStore.fetchCart()

  // Nếu có pending navigation, điều hướng đến đó
  const pendingRoute = layoutStore.getPendingNavigation()
  if (pendingRoute) {
    router.push(pendingRoute)
  }

  // Đóng modal
  layoutStore.closeLoginModal()
}
</script>

<style scoped>
.customer-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
}

.main-content {
  flex: 1;
  overflow-x: hidden;
  width: 100%;
}
</style>
