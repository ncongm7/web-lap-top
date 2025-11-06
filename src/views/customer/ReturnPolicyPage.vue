<template>
    <div class="policy-page">
        <div class="hero-section">
            <div class="container">
                <h1 class="hero-title">Chính sách đổi trả</h1>
                <p class="hero-desc">Mua hàng yên tâm, đổi trả dễ dàng trong 7 ngày</p>
            </div>
        </div>

        <div class="content-section">
            <div class="container">
                <Breadcrumb :items="breadcrumbs" />

                <div class="policy-content">
                    <section class="policy-section">
                        <h2>1. Điều kiện đổi trả</h2>
                        <p>Sản phẩm được đổi trả khi đáp ứng các điều kiện sau:</p>
                        <ul>
                            <li>Sản phẩm còn trong thời hạn đổi trả (7 ngày kể từ ngày nhận hàng)</li>
                            <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                            <li>Còn đầy đủ hộp, phụ kiện, tài liệu kèm theo</li>
                            <li>Tem bảo hành, serial còn nguyên vẹn</li>
                            <li>Có hóa đơn mua hàng hợp lệ</li>
                        </ul>
                    </section>

                    <section class="policy-section">
                        <h2>2. Các trường hợp được đổi trả</h2>
                        <div class="case-grid">
                            <div class="case-card">
                                <div class="case-icon">✅</div>
                                <h3>Lỗi nhà sản xuất</h3>
                                <p>Sản phẩm bị lỗi kỹ thuật do nhà sản xuất</p>
                            </div>
                            <div class="case-card">
                                <div class="case-icon">📦</div>
                                <h3>Giao sai sản phẩm</h3>
                                <p>Nhận được sản phẩm không đúng đơn hàng đã đặt</p>
                            </div>
                            <div class="case-card">
                                <div class="case-icon">💔</div>
                                <h3>Hàng bị hư hỏng</h3>
                                <p>Sản phẩm bị hư hỏng trong quá trình vận chuyển</p>
                            </div>
                            <div class="case-card">
                                <div class="case-icon">🔄</div>
                                <h3>Không vừa ý</h3>
                                <p>Khách hàng muốn đổi sang sản phẩm khác</p>
                            </div>
                        </div>
                    </section>

                    <section class="policy-section">
                        <h2>3. Quy trình đổi trả</h2>
                        <div class="process-steps">
                            <div class="step">
                                <div class="step-number">1</div>
                                <div class="step-content">
                                    <h3>Liên hệ</h3>
                                    <p>Gọi hotline 1900-xxxx hoặc mang sản phẩm đến cửa hàng trong vòng 7 ngày</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">2</div>
                                <div class="step-content">
                                    <h3>Kiểm tra sản phẩm</h3>
                                    <p>Nhân viên kiểm tra tình trạng sản phẩm và các điều kiện đổi trả</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">3</div>
                                <div class="step-content">
                                    <h3>Xác nhận đổi trả</h3>
                                    <p>Nếu đủ điều kiện, tiến hành đổi sản phẩm mới hoặc hoàn tiền</p>
                                </div>
                            </div>
                            <div class="step">
                                <div class="step-number">4</div>
                                <div class="step-content">
                                    <h3>Hoàn tất</h3>
                                    <p>Nhận sản phẩm mới hoặc hoàn tiền trong 3-5 ngày làm việc</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="policy-section">
                        <h2>4. Chi phí đổi trả</h2>
                        <div class="fee-table">
                            <div class="fee-row">
                                <div class="fee-case">Lỗi nhà sản xuất</div>
                                <div class="fee-cost free">Miễn phí</div>
                            </div>
                            <div class="fee-row">
                                <div class="fee-case">Giao sai sản phẩm</div>
                                <div class="fee-cost free">Miễn phí</div>
                            </div>
                            <div class="fee-row">
                                <div class="fee-case">Hàng bị hư hỏng khi vận chuyển</div>
                                <div class="fee-cost free">Miễn phí</div>
                            </div>
                            <div class="fee-row">
                                <div class="fee-case">Đổi ý, muốn đổi sản phẩm khác</div>
                                <div class="fee-cost paid">Phí vận chuyển 2 chiều</div>
                            </div>
                        </div>
                    </section>

                    <section class="policy-section">
                        <h2>5. Lưu ý quan trọng</h2>
                        <div class="note-box">
                            <ul>
                                <li>Sản phẩm đã qua sử dụng, có dấu hiệu trầy xước sẽ không được đổi trả</li>
                                <li>Khách hàng cần quay video khi mở hộp nếu phát hiện sản phẩm lỗi</li>
                                <li>Sản phẩm khuyến mãi, giảm giá đặc biệt có thể có điều kiện đổi trả khác</li>
                                <li>Phụ kiện đi kèm cần được trả lại đầy đủ, còn nguyên vẹn</li>
                            </ul>
                        </div>
                    </section>

                    <section class="policy-section">
                        <h2>6. Liên hệ hỗ trợ</h2>
                        <div class="contact-box">
                            <p>Nếu có bất kỳ thắc mắc nào về chính sách đổi trả, vui lòng liên hệ:</p>
                            <div class="contact-details">
                                <p>📞 Hotline: 1900-xxxx</p>
                                <p>📧 Email: support@vietlaptop.vn</p>
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
    { label: 'Chính sách đổi trả', to: '/return-policy' }
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

.case-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 24px;
}

.case-card {
    padding: 24px;
    background: #f0fdf4;
    border-radius: 12px;
    text-align: center;
    border: 2px solid #10b981;
}

.case-icon {
    font-size: 48px;
    margin-bottom: 12px;
}

.case-card h3 {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.case-card p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
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

.fee-table {
    background: #f8fafc;
    border-radius: 12px;
    overflow: hidden;
}

.fee-row {
    display: flex;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid #e2e8f0;
}

.fee-row:last-child {
    border-bottom: none;
}

.fee-case {
    font-size: 16px;
    color: #1e293b;
    font-weight: 500;
}

.fee-cost {
    font-size: 16px;
    font-weight: 600;
}

.fee-cost.free {
    color: #10b981;
}

.fee-cost.paid {
    color: #f59e0b;
}

.note-box {
    padding: 24px;
    background: #fef3c7;
    border-radius: 12px;
    border-left: 4px solid #f59e0b;
}

.note-box ul {
    margin: 0;
}

.contact-box {
    padding: 24px;
    background: #f0fdf4;
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

    .case-grid {
        grid-template-columns: 1fr;
    }

    .fee-row {
        flex-direction: column;
        gap: 8px;
    }
}
</style>
