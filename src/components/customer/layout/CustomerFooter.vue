<template>
    <footer class="customer-footer">
        <div class="footer-main">
            <div class="container">
                <div class="footer-grid">
                    <!-- Về chúng tôi -->
                    <div class="footer-column">
                        <h3 class="footer-title">Về VietLapTop</h3>
                        <p class="footer-desc">Chuyên cung cấp laptop chính hãng, giá tốt nhất thị trường. Bảo hành uy
                            tín, hỗ trợ 24/7.</p>
                        <div class="social-links">
                            <a href="#" class="social-link" aria-label="Facebook">📘</a>
                            <a href="#" class="social-link" aria-label="Instagram">📷</a>
                            <a href="#" class="social-link" aria-label="YouTube">📹</a>
                            <a href="#" class="social-link" aria-label="TikTok">🎵</a>
                        </div>
                    </div>

                    <!-- Chính sách -->
                    <div class="footer-column">
                        <h3 class="footer-title">Chính sách</h3>
                        <ul class="footer-links">
                            <li><router-link to="/warranty-policy">Chính sách bảo hành</router-link></li>
                            <li><router-link to="/return-policy">Chính sách đổi trả</router-link></li>
                            <li><router-link to="/shipping-policy">Chính sách vận chuyển</router-link></li>
                            <li><router-link to="/privacy-policy">Chính sách bảo mật</router-link></li>
                            <li><router-link to="/terms">Điều khoản sử dụng</router-link></li>
                        </ul>
                    </div>

                    <!-- Hỗ trợ khách hàng -->
                    <div class="footer-column">
                        <h3 class="footer-title">Hỗ trợ khách hàng</h3>
                        <ul class="footer-links">
                            <li><router-link to="/account/orders">Tra cứu đơn hàng</router-link></li>
                            <li><router-link to="/account/warranty">Tra cứu bảo hành</router-link></li>
                            <li><router-link to="/faq">Câu hỏi thường gặp</router-link></li>
                            <li><router-link to="/contact">Liên hệ hỗ trợ</router-link></li>
                            <li><router-link to="/stores">Hệ thống cửa hàng</router-link></li>
                        </ul>
                    </div>

                    <!-- Liên hệ -->
                    <div class="footer-column">
                        <h3 class="footer-title">Liên hệ</h3>
                        <ul class="footer-contact">
                            <li class="contact-item">
                                <i class="icon">📍</i>
                                <span>123 Đường ABC, Quận XYZ, TP.HCM</span>
                            </li>
                            <li class="contact-item">
                                <i class="icon">📞</i>
                                <span>Hotline: 1900-xxxx</span>
                            </li>
                            <li class="contact-item">
                                <i class="icon">📧</i>
                                <span>support@laptop.vn</span>
                            </li>
                            <li class="contact-item">
                                <i class="icon">⏰</i>
                                <span>8:00 - 22:00 (Hàng ngày)</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Bottom -->
        <div class="footer-bottom">
            <div class="container">
                <div class="footer-bottom-content">
                    <p class="copyright">&copy; {{ currentYear }} VietLapTop. All rights reserved.</p>
                    <div class="payment-methods">
                        <span>Phương thức thanh toán:</span>
                        <div class="payment-icons">
                            <span class="payment-icon">💳</span>
                            <span class="payment-icon">🏦</span>
                            <span class="payment-icon">📱</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
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
    max-width: 100%;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 60px);
    width: 100%;
    box-sizing: border-box;
}

.footer-main {
    padding: 60px 0 40px;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
}

.footer-column {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.footer-title {
    font-size: 18px;
    font-weight: 600;
    color: #ffffff;
    margin: 0 0 8px 0;
}

.footer-desc {
    font-size: 14px;
    line-height: 1.6;
    color: #cbd5e1;
    margin: 0;
}

.social-links {
    display: flex;
    gap: 12px;
    margin-top: 12px;
}

.social-link {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    text-decoration: none;
    font-size: 20px;
    transition: background 0.2s;
}

.social-link:hover {
    background: rgba(255, 255, 255, 0.2);
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
    transition: color 0.2s;
}

.footer-links a:hover {
    color: #ffffff;
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
    gap: 12px;
    font-size: 14px;
    color: #cbd5e1;
}

.contact-item .icon {
    font-size: 18px;
    flex-shrink: 0;
}

.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 24px 0;
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

.payment-icons {
    display: flex;
    gap: 8px;
}

.payment-icon {
    font-size: 24px;
}

@media (min-width: 1441px) {
    .footer-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: clamp(40px, 3vw, 80px);
    }
}

@media (max-width: 1440px) and (min-width: 1025px) {
    .footer-grid {
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 32px;
    }
}

@media (max-width: 1024px) {
    .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 32px;
    }
}

@media (max-width: 768px) {
    .footer-grid {
        grid-template-columns: 1fr;
    }

    .footer-bottom-content {
        flex-direction: column;
        text-align: center;
    }
}
</style>
