<template>
    <footer class="customer-footer">
        <div class="footer-main">
            <div class="container">
                <div class="footer-grid">
                    <!-- Cột 1: Thông tin cửa hàng -->
                    <div class="footer-column">
                        <button 
                            v-if="isMobile" 
                            @click="toggleColumn(0)"
                            class="footer-column-toggle"
                            :class="{ 'active': openColumns[0] }"
                        >
                            <h3 class="footer-title">Thông tin cửa hàng</h3>
                            <span class="toggle-icon">{{ openColumns[0] ? '−' : '+' }}</span>
                        </button>
                        <h3 v-else class="footer-title">Thông tin cửa hàng</h3>
                        <div 
                            class="footer-column-content"
                            :class="{ 'mobile-collapsed': isMobile && !openColumns[0] }"
                        >
                            <div class="store-info">
                                <div class="logo-text">
                                    <h4 class="store-name">VietLapTop</h4>
                                    <p class="store-slogan">Chuyên cung cấp laptop chính hãng, giá tốt nhất thị trường</p>
                                </div>
                                <ul class="footer-contact">
                                    <li class="contact-item">
                                        <i class="icon">📍</i>
                                        <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                                    </li>
                                    <li class="contact-item">
                                        <i class="icon">📞</i>
                                        <a href="tel:1900xxxx" class="contact-link">Hotline: 1900-xxxx</a>
                                    </li>
                                    <li class="contact-item">
                                        <i class="icon">📧</i>
                                        <a href="mailto:support@laptop.vn" class="contact-link">support@laptop.vn</a>
                                    </li>
                                    <li class="contact-item">
                                        <i class="icon">⏰</i>
                                        <span>8:00 - 22:00 (Hàng ngày)</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <!-- Cột 2: Chính sách -->
                    <div class="footer-column">
                        <button 
                            v-if="isMobile" 
                            @click="toggleColumn(1)"
                            class="footer-column-toggle"
                            :class="{ 'active': openColumns[1] }"
                        >
                            <h3 class="footer-title">Chính sách</h3>
                            <span class="toggle-icon">{{ openColumns[1] ? '−' : '+' }}</span>
                        </button>
                        <h3 v-else class="footer-title">Chính sách</h3>
                        <div 
                            class="footer-column-content"
                            :class="{ 'mobile-collapsed': isMobile && !openColumns[1] }"
                        >
                            <ul class="footer-links">
                                <li><router-link to="/warranty-policy">Chính sách bảo hành</router-link></li>
                                <li><router-link to="/return-policy">Chính sách đổi trả</router-link></li>
                                <li><router-link to="/shipping-policy">Chính sách vận chuyển</router-link></li>
                                <li><router-link to="/privacy-policy">Chính sách bảo mật</router-link></li>
                                <li><router-link to="/terms">Điều khoản sử dụng</router-link></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Cột 3: Hỗ trợ khách hàng -->
                    <div class="footer-column">
                        <button 
                            v-if="isMobile" 
                            @click="toggleColumn(2)"
                            class="footer-column-toggle"
                            :class="{ 'active': openColumns[2] }"
                        >
                            <h3 class="footer-title">Hỗ trợ khách hàng</h3>
                            <span class="toggle-icon">{{ openColumns[2] ? '−' : '+' }}</span>
                        </button>
                        <h3 v-else class="footer-title">Hỗ trợ khách hàng</h3>
                        <div 
                            class="footer-column-content"
                            :class="{ 'mobile-collapsed': isMobile && !openColumns[2] }"
                        >
                            <ul class="footer-links">
                                <li><router-link to="/orders">Tra cứu đơn hàng</router-link></li>
                                <li><router-link to="/warranty">Tra cứu bảo hành</router-link></li>
                                <li><router-link to="/faq">Câu hỏi thường gặp</router-link></li>
                                <li><router-link to="/contact">Liên hệ hỗ trợ</router-link></li>
                                <li><router-link to="/stores">Hệ thống cửa hàng</router-link></li>
                                <li><router-link to="/about">Giới thiệu</router-link></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Cột 4: Liên kết mạng xã hội -->
                    <div class="footer-column">
                        <button 
                            v-if="isMobile" 
                            @click="toggleColumn(3)"
                            class="footer-column-toggle"
                            :class="{ 'active': openColumns[3] }"
                        >
                            <h3 class="footer-title">Kết nối với chúng tôi</h3>
                            <span class="toggle-icon">{{ openColumns[3] ? '−' : '+' }}</span>
                        </button>
                        <h3 v-else class="footer-title">Kết nối với chúng tôi</h3>
                        <div 
                            class="footer-column-content"
                            :class="{ 'mobile-collapsed': isMobile && !openColumns[3] }"
                        >
                            <p class="social-desc">Theo dõi chúng tôi trên các mạng xã hội để nhận thông tin mới nhất</p>
                            <div class="social-links">
                                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                    <span class="social-icon">📘</span>
                                    <span class="social-label">Facebook</span>
                                </a>
                                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="Zalo">
                                    <span class="social-icon">💬</span>
                                    <span class="social-label">Zalo</span>
                                </a>
                                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                    <span class="social-icon">📹</span>
                                    <span class="social-label">YouTube</span>
                                </a>
                                <a href="#" class="social-link" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                                    <span class="social-icon">🎵</span>
                                    <span class="social-label">TikTok</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <p class="copyright">&copy; {{ currentYear }} VietLapTop. Tất cả quyền được bảo lưu.</p>
                    <div class="payment-methods">
                        <span class="payment-label">Phương thức thanh toán:</span>
                        <div class="payment-icons">
                            <span class="payment-icon" title="Thẻ tín dụng">💳</span>
                            <span class="payment-icon" title="Chuyển khoản">🏦</span>
                            <span class="payment-icon" title="Ví điện tử">📱</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
const isMobile = ref(false)
const openColumns = ref([false, false, false, false])

// Check if mobile
const checkMobile = () => {
    isMobile.value = window.innerWidth <= 768
}

// Toggle column on mobile
const toggleColumn = (index) => {
    if (!isMobile.value) return
    openColumns.value[index] = !openColumns.value[index]
}

onMounted(() => {
    checkMobile()
    window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
})
</script>

<style scoped>
.customer-footer {
    background: #064e3b;
    color: #e2e8f0;
    margin-top: 60px;
    width: 100%;
    overflow: hidden;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    width: 100%;
    box-sizing: border-box;
}

.footer-main {
    padding: 60px 0 40px;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 40px;
}

.footer-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.footer-column-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-align: left;
}

.footer-title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 0;
}

.toggle-icon {
    font-size: 24px;
    font-weight: 300;
    color: #ffffff;
    transition: transform 0.3s;
}

.footer-column-toggle.active .toggle-icon {
    transform: rotate(180deg);
}

.footer-column-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: max-height 0.3s ease, opacity 0.3s ease;
    overflow: hidden;
}

.footer-column-content.mobile-collapsed {
    max-height: 0;
    opacity: 0;
    padding: 0;
    margin: 0;
}

.store-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.store-name {
    font-size: 24px;
    font-weight: 700;
    color: #10b981;
    margin: 0 0 8px 0;
}

.store-slogan {
    font-size: 14px;
    line-height: 1.6;
    color: #cbd5e1;
    margin: 0;
}

.social-desc {
    font-size: 14px;
    line-height: 1.6;
    color: #cbd5e1;
    margin: 0 0 16px 0;
}

.social-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    text-decoration: none;
    color: #cbd5e1;
    transition: all 0.2s;
    border: 1px solid transparent;
}

.social-link:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: #ffffff;
    transform: translateX(4px);
}

.social-icon {
    font-size: 20px;
    flex-shrink: 0;
}

.social-label {
    font-size: 14px;
    font-weight: 500;
}

.footer-links {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.footer-links a {
    color: #cbd5e1;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.2s;
    display: inline-block;
}

.footer-links a:hover {
    color: #10b981;
    transform: translateX(4px);
}

.footer-contact {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.contact-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 14px;
    color: #cbd5e1;
    line-height: 1.6;
}

.contact-item .icon {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
}

.contact-link {
    color: #cbd5e1;
    text-decoration: none;
    transition: color 0.2s;
}

.contact-link:hover {
    color: #10b981;
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 24px 0;
    background: rgba(0, 0, 0, 0.2);
}

.footer-bottom-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
}

.copyright {
    font-size: 14px;
    color: #94a3b8;
    margin: 0;
}

.payment-methods {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    color: #94a3b8;
}

.payment-label {
    font-size: 13px;
}

.payment-icons {
    display: flex;
    gap: 8px;
}

.payment-icon {
    font-size: 24px;
    cursor: pointer;
    transition: transform 0.2s;
}

.payment-icon:hover {
    transform: scale(1.1);
}

/* Responsive */
@media (max-width: 1024px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
    }
}

@media (max-width: 768px) {
    .footer-main {
        padding: 40px 0 32px;
    }

    .footer-grid {
        grid-template-columns: 1fr;
        gap: 0;
    }

    .footer-column {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding: 20px 0;
    }

    .footer-column:last-child {
        border-bottom: none;
    }

    .footer-column-toggle {
        padding: 0;
    }

    .footer-column-content {
        padding-top: 16px;
    }

    .footer-bottom-content {
        flex-direction: column;
        text-align: center;
    }

    .payment-methods {
        flex-direction: column;
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .container {
        padding: 0 16px;
    }

    .footer-main {
        padding: 32px 0 24px;
    }

    .store-name {
        font-size: 20px;
    }

    .social-link {
        padding: 10px 12px;
    }
}
</style>
