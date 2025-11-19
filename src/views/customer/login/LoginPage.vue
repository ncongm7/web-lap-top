<template>
    <div class="login-page">
        <div class="login-container">
            <div class="login-card">
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

// Redirect về trang chủ và mở modal đăng nhập
onMounted(() => {
  layoutStore.openLoginModal()
  router.replace({ name: 'home' })
})
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.login-container {
    width: 100%;
    max-width: 480px;
}

/* Card */
.login-card {
    background: white;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(5, 150, 105, 0.15);
    padding: clamp(32px, 5vw, 48px);
    animation: slideIn 0.5s ease-out;
    text-align: center;
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

/* Header */
.login-header {
    text-align: center;
    margin-bottom: 32px;
}

.logo-link {
    text-decoration: none;
    display: inline-block;
}

.logo {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    border-radius: 20px;
    margin-bottom: 16px;
    box-shadow: 0 8px 20px rgba(5, 150, 105, 0.2);
}

.logo-icon {
    font-size: 40px;
}

.brand-name {
    font-size: clamp(28px, 5vw, 36px);
    font-weight: 700;
    color: #059669;
    margin: 0 0 8px 0;
    letter-spacing: -0.5px;
}

.brand-tagline {
    color: #64748b;
    font-size: clamp(14px, 2vw, 16px);
    margin: 0;
}

/* Form */
.login-form {
    margin-bottom: 24px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
    font-size: 14px;
}

/* Input wrapper */
.input-wrapper {
    position: relative;
}

.input-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 20px;
    pointer-events: none;
    z-index: 1;
}

.form-control {
    width: 100%;
    padding: 14px 16px 14px 48px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.3s ease;
    background-color: #f8fafc;
    box-sizing: border-box;
}

.form-control:focus {
    outline: none;
    border-color: #10b981;
    background-color: white;
    box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
}

.form-control:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
    opacity: 0.6;
}

.form-control::placeholder {
    color: #94a3b8;
}

/* Password toggle */
.password-toggle {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    font-size: 20px;
    transition: opacity 0.2s;
}

.password-toggle:hover:not(:disabled) {
    opacity: 0.7;
}

.password-toggle:disabled {
    cursor: not-allowed;
    opacity: 0.4;
}

/* Form Options */
.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    font-size: 14px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    user-select: none;
}

.remember-me input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: #10b981;
}

.remember-me span {
    color: #64748b;
}

.forgot-password {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.2s;
}

.forgot-password:hover {
    color: #059669;
}

/* Button */
.btn-login {
    width: 100%;
    padding: 16px;
    background: linear-gradient(135deg, #059669 0%, #10b981 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-login:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-login:active:not(:disabled) {
    transform: translateY(0);
}

.btn-login:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}

.spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Register Link */
.register-link {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #64748b;
}

.register-link a {
    color: #10b981;
    text-decoration: none;
    font-weight: 600;
    margin-left: 4px;
    transition: color 0.2s;
}

.register-link a:hover {
    color: #059669;
}

/* Alert */
.alert {
    padding: 14px 16px;
    border-radius: 12px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    animation: shake 0.5s;
}

.alert-danger {
    background-color: #fee2e2;
    border: 1px solid #fecaca;
    color: #dc2626;
}

.alert .icon {
    font-size: 20px;
    flex-shrink: 0;
}

@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-5px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(5px);
    }
}

/* Divider */
.divider {
    position: relative;
    text-align: center;
    margin: 32px 0 24px;
}

.divider::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    height: 1px;
    background: #e2e8f0;
}

.divider span {
    position: relative;
    background: white;
    padding: 0 16px;
    font-size: 14px;
    color: #94a3b8;
}

/* Social Login */
.social-login {
    display: flex;
    gap: 12px;
}

.btn-social {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    background: white;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-social:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-social:hover:not(:disabled) {
    border-color: #cbd5e1;
    background: #f8fafc;
}

.btn-google {
    color: #ea4335;
}

.btn-google span:first-child {
    font-size: 20px;
    font-weight: 700;
}

.btn-facebook {
    color: #1877f2;
}

.btn-facebook span:first-child {
    font-size: 20px;
    font-weight: 700;
}

/* Footer */
.login-footer {
    text-align: center;
    margin-top: 24px;
}

.login-footer p {
    color: #047857;
    font-size: 14px;
    margin: 0;
}

/* Responsive */
@media (max-width: 576px) {
    .login-page {
        padding: 20px 16px;
    }

    .login-card {
        padding: 24px 20px;
    }

    .form-control {
        padding: 12px 16px 12px 44px;
    }

    .btn-login {
        padding: 14px;
    }

    .social-login {
        flex-direction: column;
    }
}
</style>
