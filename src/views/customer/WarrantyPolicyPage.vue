<template>
    <div class="policy-page">
        <div class="hero-section">
            <div class="container">
                <h1 class="hero-title">Chính sách bảo hành</h1>
                <p class="hero-desc">Cam kết bảo hành chính hãng, hỗ trợ tận tâm</p>
            </div>
        </div>

        <div class="content-section">
            <div class="container">
                <Breadcrumb :items="breadcrumbs" />

                <div class="policy-content">
                    <section class="policy-section">
                        <h2>1. Điều kiện bảo hành</h2>
                        <p>Sản phẩm được bảo hành khi đáp ứng các điều kiện sau:</p>
                        <ul>
                            <li>Sản phẩm còn trong thời hạn bảo hành ghi trên phiếu bảo hành</li>
                            <li>Tem bảo hành, serial còn nguyên vẹn, không bị tẩy xóa, sửa chữa</li>
                            <li>Có phiếu bảo hành và hóa đơn mua hàng hợp lệ</li>
                            <li>Lỗi do nhà sản xuất, không do người sử dụng gây ra</li>
                        </ul>
                    </section>

                    <section class="policy-section">
                        <h2>2. Thời gian bảo hành</h2>
                        <div class="warranty-table">
                            <div class="warranty-row">
                                <div class="warranty-item">Laptop</div>
                                <div class="warranty-duration">12-24 tháng</div>
                            </div>
                            <div class="warranty-row">
                                <div class="warranty-item">Pin laptop</div>
                                <div class="warranty-duration">12 tháng</div>
                            </div>
                            <div class="warranty-row">
                                <div class="warranty-item">Sạc laptop</div>
                                <div class="warranty-duration">12 tháng</div>
                            </div>
                            <div class="warranty-row">
                                <div class="warranty-item">Phụ kiện đi kèm</div>
                                <div class="warranty-duration">6 tháng</div>
                            </div>
                        </div>
                    </section>

                    <section class="policy-section">
                        <h2>3. Quy trình bảo hành</h2>
                        <div class="process-steps">
                            <div class="step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h3>Liên hệ hỗ trợ</h3>
                                    <p>Gọi hotline 1900-xxxx hoặc mang sản phẩm đến cửa hàng gần nhất</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h3>Kiểm tra sản phẩm</h3>
                                    <p>Nhân viên kiểm tra tình trạng và xác định lỗi sản phẩm</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h3>Tiếp nhận bảo hành</h3>
                                    <p>Xuất phiếu tiếp nhận bảo hành, thông báo thời gian dự kiến</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h3>Nhận máy</h3>
                                    <p>Nhận máy sau khi sửa chữa, kiểm tra kỹ trước khi ký nhận</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="policy-section">
                        <h2>4. Các trường hợp không được bảo hành</h2>
                        <ul class="warning-list">
                            <li>Sản phẩm hết thời hạn bảo hành</li>
                            <li>Sản phẩm bị rơi, vỡ, cong, móp, méo, biến dạng</li>
                            <li>Sản phẩm bị hỏng do côn trùng, động vật gây ra</li>
                            <li>Sản phẩm bị hỏng do thiên tai, hỏa hoạn, mất điện đột ngột</li>
                            <li>Sản phẩm bị can thiệp, sửa chữa bởi người không có thẩm quyền</li>
                            <li>Tem bảo hành, serial bị rách, mờ, tẩy xóa hoặc không xác định được</li>
                            <li>Không có hóa đơn, phiếu bảo hành hợp lệ</li>
                        </ul>
                    </section>

                    <section class="policy-section">
                        <h2>5. Liên hệ hỗ trợ</h2>
                        <div class="contact-box">
                            <p>Nếu có bất kỳ thắc mắc nào về chính sách bảo hành, vui lòng liên hệ:</p>
                            <div class="contact-details">
                                <p>📞 Hotline: 1900-xxxx</p>
                                <p>📧 Email: warranty@vietlaptop.vn</p>
                                <p>🕐 Giờ làm việc: 8:00 - 22:00 (Hàng ngày)</p>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/customer/common/Breadcrumb.vue'

const breadcrumbs = ref([
    { label: 'Trang chủ', to: '/' },
    { label: 'Chính sách bảo hành', to: '/warranty-policy' }
])
</script>

<style scoped>
.policy-page {
    min-height: 100vh;
    background: #ffffff;
}

.hero-section {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #ffffff;
    padding: 80px 0;
    text-align: center;
}

.container {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 24px;
    width: 100%;
}

.hero-title {
    font-size: 48px;
    font-weight: 700;
    margin: 0 0 16px 0;
}

.hero-desc {
    font-size: 20px;
    margin: 0;
    opacity: 0.9;
}

.content-section {
    padding: 60px 0;
}

.policy-content {
    margin-top: 32px;
    max-width: 900px;
}

.policy-section {
    margin-bottom: 48px;
}

.policy-section h2 {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px 0;
}

.policy-section p {
    font-size: 16px;
    line-height: 1.8;
    color: #475569;
    margin: 0 0 16px 0;
}

.policy-section ul {
    margin: 16px 0;
    padding-left: 24px;
}

.policy-section li {
    font-size: 16px;
    line-height: 1.8;
    color: #475569;
    margin-bottom: 12px;
}

.warning-list li {
    color: #ef4444;
}

.warranty-table {
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
}

.warranty-row {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #e2e8f0;
}

.warranty-row:last-child {
    border-bottom: none;
}

.warranty-item {
    font-size: 16px;
    color: #1e293b;
    font-weight: 500;
}

.warranty-duration {
    font-size: 16px;
    color: #10b981;
    font-weight: 600;
}

.process-steps {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-top: 24px;
}

.step {
    display: flex;
    gap: 20px;
    align-items: flex-start;
}

.step-number {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: #10b981;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 700;
    flex-shrink: 0;
}

.step-content h3 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.step-content p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.contact-box {
    padding: 24px;
    background: #d1fae5;
    border-radius: 12px;
    border-left: 4px solid #10b981;
}

.contact-box>p {
    margin-bottom: 16px;
    font-weight: 500;
}

.contact-details p {
    margin: 0 0 8px 0;
    font-size: 15px;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 32px;
    }

    .hero-desc {
        font-size: 16px;
    }

    .policy-section h2 {
        font-size: 24px;
    }

    .warranty-row {
        flex-direction: column;
        gap: 8px;
    }

    .process-steps {
        gap: 32px;
    }
}
</style>
