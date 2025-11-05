<template>
    <header class="customer-header">
        <!-- Top Bar -->
        <div class="header-top">
            <div class="container">
                <div class="top-bar-content">
                    <div class="top-bar-left">
                        <span class="contact-item">
                            <i class="icon">📞</i>
                            <span>Hotline: 1900-xxxx</span>
                        </span>
                        <span class="contact-item">
                            <i class="icon">📧</i>
                            <span>support@laptop.vn</span>
                        </span>
                    </div>
                    <div class="top-bar-right">
                        <router-link to="/warranty-policy" class="top-link">Chính sách bảo hành</router-link>
                        <router-link to="/return-policy" class="top-link">Chính sách đổi trả</router-link>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Header -->
        <div class="header-main">
            <div class="container">
                <div class="header-content">
                    <!-- Logo -->
                    <router-link to="/" class="logo">
                        <h1>VietLapTop</h1>
                    </router-link>

                    <!-- Search Bar -->
                    <div class="search-wrapper">
                        <SearchBar />
                    </div>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <!-- Cart Icon -->
                        <router-link to="/cart" class="action-btn cart-btn">
                            <i class="icon">🛒</i>
                            <span v-if="cartCount > 0" class="badge">{{ cartCount }}</span>
                            <span class="label">Giỏ hàng</span>
                        </router-link>

                        <!-- User Menu -->
                        <UserMenu />
                    </div>

                    <!-- Mobile Menu Toggle -->
                    <button @click="toggleMobileMenu" class="mobile-menu-toggle">
                        <span class="hamburger">☰</span>
                    </button>
                </div>
            </div>
        </div>

        <!-- Navigation -->
        <nav class="header-nav">
            <div class="container">
                <ul class="nav-list">
                    <li><router-link to="/" class="nav-link">Trang chủ</router-link></li>
                    <li><router-link to="/products" class="nav-link">Sản phẩm</router-link></li>
                    <li><router-link to="/promotions" class="nav-link">Khuyến mãi</router-link></li>
                    <li><router-link to="/warranty" class="nav-link">Bảo hành</router-link></li>
                    <li><router-link to="/about" class="nav-link">Giới thiệu</router-link></li>
                    <li><router-link to="/contact" class="nav-link">Liên hệ</router-link></li>
                </ul>
            </div>
        </nav>

        <!-- Mobile Menu Overlay -->
        <transition name="slide">
            <div v-if="isMobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
                <div class="mobile-menu" @click.stop>
                    <div class="mobile-menu-header">
                        <h3>Menu</h3>
                        <button @click="closeMobileMenu" class="close-btn">✕</button>
                    </div>
                    <ul class="mobile-nav-list">
                        <li><router-link to="/" @click="closeMobileMenu">Trang chủ</router-link></li>
                        <li><router-link to="/products" @click="closeMobileMenu">Sản phẩm</router-link></li>
                        <li><router-link to="/promotions" @click="closeMobileMenu">Khuyến mãi</router-link></li>
                        <li><router-link to="/warranty" @click="closeMobileMenu">Bảo hành</router-link></li>
                        <li><router-link to="/about" @click="closeMobileMenu">Giới thiệu</router-link></li>
                        <li><router-link to="/contact" @click="closeMobileMenu">Liên hệ</router-link></li>
                    </ul>
                </div>
            </div>
        </transition>
    </header>
</template>

<script setup>
import { computed } from 'vue'
import { useLayoutStore } from '@/stores/customer/layoutStore'
import SearchBar from './SearchBar.vue'
import UserMenu from './UserMenu.vue'

const layoutStore = useLayoutStore()

const cartCount = computed(() => layoutStore.cartItemCount)
const isMobileMenuOpen = computed(() => layoutStore.isMobileMenuOpen)

const toggleMobileMenu = () => {
    layoutStore.toggleMobileMenu()
}

const closeMobileMenu = () => {
    layoutStore.closeMobileMenu()
}
</script>

<style scoped>
.customer-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 100%;
    overflow: hidden;
}

.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 60px);
    width: 100%;
    box-sizing: border-box;
}

/* Top Bar */
.header-top {
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.top-bar-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    font-size: 13px;
}

.top-bar-left,
.top-bar-right {
    display: flex;
    gap: 20px;
    align-items: center;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
}

.top-link {
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
}

.top-link:hover {
    color: #10b981;
}

/* Main Header */
.header-main {
    padding: 16px 0;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 24px;
}

.logo h1 {
    font-size: 24px;
    font-weight: 700;
    color: #059669;
    margin: 0;
}

.search-wrapper {
    flex: 1;
    max-width: 600px;
}

.header-actions {
    display: flex;
    gap: 16px;
    align-items: center;
}

.action-btn {
    position: relative;
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

.badge {
    position: absolute;
    top: 4px;
    right: 4px;
    background: #059669;
    color: #ffffff;
    font-size: 10px;
    font-weight: 600;
    padding: 2px 6px;
    border-radius: 10px;
    min-width: 18px;
    text-align: center;
}

.mobile-menu-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #1e293b;
}

/* Navigation */
.header-nav {
    background: #047857;
}

.nav-list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
}

.nav-link {
    display: block;
    padding: 12px 20px;
    color: #ffffff;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background 0.2s;
    border-radius: 4px;
}

.nav-link:hover,
.nav-link.router-link-active {
    background: rgba(255, 255, 255, 0.1);
}

/* Mobile Menu */
.mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 2000;
}

.mobile-menu {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 280px;
    background: #ffffff;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #e2e8f0;
}

.mobile-menu-header h3 {
    margin: 0;
    font-size: 18px;
    color: #1e293b;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #64748b;
}

.mobile-nav-list {
    list-style: none;
    margin: 0;
    padding: 0;
}

.mobile-nav-list li a {
    display: block;
    padding: 16px 20px;
    color: #1e293b;
    text-decoration: none;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s;
}

.mobile-nav-list li a:hover {
    background: #f8fafc;
}

/* Slide Transition */
.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.3s;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
}

.slide-enter-active .mobile-menu {
    transition: transform 0.3s;
}

.slide-enter-from .mobile-menu {
    transform: translateX(-100%);
}

/* Responsive */
@media (max-width: 1024px) {
    .header-content {
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .header-top {
        display: none;
    }

    .header-content {
        gap: 12px;
    }

    .search-wrapper {
        display: none;
    }

    .header-actions .label {
        display: none;
    }

    .mobile-menu-toggle {
        display: block;
    }

    .header-nav {
        display: none;
    }
}
</style>
