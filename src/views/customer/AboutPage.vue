<template>
    <div class="about-page">
        <div class="hero-section">
            <div class="container">
                <h1 class="hero-title">Về VietLapTop</h1>
                <p class="hero-desc">Đối tác tin cậy của bạn trong việc tìm kiếm laptop hoàn hảo</p>
            </div>
        </div>

        <div class="content-section">
            <div class="container">
                <Breadcrumb :items="breadcrumbs" />

                <div class="about-content">
                    <section class="about-section">
                        <h2>Giới thiệu</h2>
                        <p>VietLapTop là cửa hàng chuyên cung cấp các dòng laptop chính hãng, đa dạng từ phân khúc phổ
                            thông đến cao cấp. Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác tin
                            cậy của hàng trăm nghìn khách hàng trên toàn quốc.</p>
                    </section>

                    <section class="about-section">
                        <h2>Sứ mệnh</h2>
                        <p>Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chất lượng cao với giá cả cạnh tranh
                            nhất thị trường. Không chỉ bán hàng, chúng tôi còn đồng hành cùng khách hàng trong suốt quá
                            trình sử dụng với dịch vụ bảo hành và hỗ trợ kỹ thuật tận tâm.</p>
                    </section>

                    <section class="about-section">
                        <h2>Giá trị cốt lõi</h2>
                        <div class="values-grid">
                            <div class="value-card">
                                <div class="value-icon">✅</div>
                                <h3>Chất lượng</h3>
                                <p>100% sản phẩm chính hãng, đầy đủ giấy tờ, tem bảo hành</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">💰</div>
                                <h3>Giá tốt nhất</h3>
                                <p>Cam kết giá cạnh tranh, hoàn tiền nếu tìm thấy giá thấp hơn</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">🛡️</div>
                                <h3>Bảo hành uy tín</h3>
                                <p>Bảo hành chính hãng, hỗ trợ nhanh chóng khi có sự cố</p>
                            </div>
                            <div class="value-card">
                                <div class="value-icon">🚚</div>
                                <h3>Giao hàng toàn quốc</h3>
                                <p>Miễn phí vận chuyển cho đơn hàng trên 10 triệu</p>
                            </div>
                        </div>
                    </section>

                    <section class="about-section">
                        <h2>Hệ thống cửa hàng</h2>
                        <p>Với mạng lưới hơn 50 cửa hàng trên toàn quốc, chúng tôi luôn sẵn sàng phục vụ bạn. Ghé thăm
                            showroom gần nhất để trải nghiệm trực tiếp sản phẩm và nhận tư vấn từ đội ngũ chuyên viên
                            giàu kinh nghiệm.</p>
                    </section>

                    <section class="about-section">
                        <h2>Liên hệ</h2>
                        <div class="contact-info">
                            <p><strong>Hotline:</strong> 1900-xxxx</p>
                            <p><strong>Email:</strong> support@VietLapTop.vn</p>
                            <p><strong>Địa chỉ:</strong> 123 Đường ABC, Quận XYZ, TP.HCM</p>
                            <p><strong>Giờ làm việc:</strong> 8:00 - 22:00 (Hàng ngày)</p>
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
    { label: 'Về chúng tôi', to: '/about' }
])
</script>

<style scoped>
.about-page {
    min-height: 100vh;
    background: #ffffff;
}

.hero-section {
    background: linear-gradient(135deg, #047857 0%, #059669 100%);
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

.about-content {
    margin-top: 32px;
}

.about-section {
    margin-bottom: 48px;
}

.about-section h2 {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.about-section p {
    font-size: 16px;
    line-height: 1.8;
    color: #475569;
    margin: 0 0 16px 0;
}

.values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-top: 24px;
}

.value-card {
    padding: 32px;
    background: #f8fafc;
    border-radius: 12px;
    text-align: center;
    transition: all 0.3s;
}

.value-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.value-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.value-card h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.value-card p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.contact-info {
    padding: 24px;
    background: #f8fafc;
    border-radius: 12px;
    border-left: 4px solid #10b981;
}

.contact-info p {
    margin: 0 0 12px 0;
}

.contact-info p:last-child {
    margin-bottom: 0;
}

@media (max-width: 768px) {
    .hero-title {
        font-size: 32px;
    }

    .hero-desc {
        font-size: 16px;
    }

    .about-section h2 {
        font-size: 24px;
    }

    .values-grid {
        grid-template-columns: 1fr;
    }
}
</style>
