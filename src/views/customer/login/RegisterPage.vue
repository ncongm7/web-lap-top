<template>
    <div class="register-page">
        <div class="register-container">
            <div class="register-card">
                <div class="loading-message">
                    <div class="spinner"></div>
                    <p>Đang chuyển hướng...</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLayoutStore } from '@/stores/customer/layoutStore'

const router = useRouter()
const layoutStore = useLayoutStore()

// Redirect về trang chủ và mở modal đăng ký
onMounted(() => {
  layoutStore.openLoginModal(null, true) // true = tự động chuyển sang tab đăng ký
  router.replace({ name: 'home' })
})
</script>

<style scoped>
.register-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.register-container {
    width: 100%;
    max-width: 480px;
}

.register-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(5, 150, 105, 0.15);
    padding: clamp(32px, 5vw, 48px);
    animation: slideIn 0.5s ease-out;
    text-align: center;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.loading-message {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 40px 20px;
}

.loading-message p {
    color: #64748b;
    font-size: 16px;
    margin: 0;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(16, 185, 129, 0.2);
    border-top-color: #10b981;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>




