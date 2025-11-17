<template>
    <div class="policy-page">
        <section class="policy-hero">
            <div class="container hero-content">
                <div class="hero-text">
                    <p class="eyebrow">VietLaptop Care+</p>
                    <h1>Chính sách bảo hành toàn diện</h1>
                    <p>Cam kết bảo hành chính hãng, quy trình minh bạch và đội ngũ kỹ thuật tận tâm để bạn luôn yên tâm
                        sử dụng.</p>
                    <div class="hero-actions">
                        <button class="btn primary">Đăng ký bảo hành</button>
                        <button class="btn secondary">Xem trạm bảo hành</button>
                    </div>
                </div>
                <div class="hero-stats">
                    <div v-for="stat in heroStats" :key="stat.label" class="stat-card">
                        <p class="stat-value">{{ stat.value }}</p>
                        <p class="stat-label">{{ stat.label }}</p>
                        <p class="stat-desc">{{ stat.desc }}</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="policy-body">
            <div class="container">
                <Breadcrumb :items="breadcrumbs" />

                <div class="layout-grid">
                    <div class="main-column">
                        <article class="card policy-card">
                            <header>
                                <div>
                                    <p class="eyebrow">Điều kiện bảo hành</p>
                                    <h2>1. Sản phẩm đủ điều kiện</h2>
                                </div>
                                <span class="badge">Bắt buộc</span>
                            </header>
                            <p>Sản phẩm cần đáp ứng đầy đủ các điều kiện sau để được áp dụng bảo hành chính hãng.</p>
                            <ul class="check-list">
                                <li v-for="item in conditions" :key="item">
                                    <span class="dot"></span>
                                    {{ item }}
                                </li>
                            </ul>
                        </article>

                        <article class="card policy-card">
                            <header>
                                <div>
                                    <p class="eyebrow">Thời hạn bảo hành</p>
                                    <h2>2. Phạm vi và thời gian</h2>
                                </div>
                                <span class="badge badge-soft">12-24 tháng</span>
                            </header>
                            <div class="warranty-grid">
                                <div v-for="item in coverageDurations" :key="item.title" class="warranty-card">
                                    <div class="warranty-title">{{ item.title }}</div>
                                    <div class="warranty-duration">{{ item.duration }}</div>
                                    <p>{{ item.note }}</p>
                                </div>
                            </div>
                            <div class="info-bar">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="16" x2="12" y2="12" />
                                    <line x1="12" y1="8" x2="12.01" y2="8" />
                                </svg>
                                <span>Thời gian bảo hành được tính từ ngày trên hóa đơn bán hàng hoặc kích hoạt điện
                                    tử.</span>
                            </div>
                        </article>

                        <article class="card policy-card">
                            <header>
                                <div>
                                    <p class="eyebrow">Quy trình chuẩn</p>
                                    <h2>3. Các bước bảo hành</h2>
                                </div>
                            </header>
                            <div class="timeline">
                                <div v-for="(step, index) in processSteps" :key="step.title" class="timeline-item">
                                    <div class="timeline-index">{{ index + 1 }}</div>
                                    <div class="timeline-content">
                                        <h3>{{ step.title }}</h3>
                                        <p>{{ step.desc }}</p>
                                        <span>{{ step.support }}</span>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article class="card policy-card warning">
                            <header>
                                <div>
                                    <p class="eyebrow">Lưu ý quan trọng</p>
                                    <h2>4. Trường hợp từ chối bảo hành</h2>
                                </div>
                            </header>
                            <ul class="warning-list">
                                <li v-for="caseItem in exclusions" :key="caseItem">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10" />
                                        <line x1="8" y1="8" x2="16" y2="16" />
                                        <line x1="16" y1="8" x2="8" y2="16" />
                                    </svg>
                                    {{ caseItem }}
                                </li>
                            </ul>
                        </article>

                        <article class="card policy-card contact-card">
                            <div class="contact-content">
                                <div>
                                    <p class="eyebrow">Cần hỗ trợ ngay?</p>
                                    <h2>5. Trung tâm hỗ trợ khách hàng</h2>
                                    <p>Đội ngũ chuyên viên của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc về bảo
                                        hành,
                                        sửa chữa và kỹ thuật.</p>
                                </div>
                                <div class="contact-actions">
                                    <button class="btn primary">Gọi hotline</button>
                                    <button class="btn secondary">Gửi yêu cầu</button>
                                </div>
                            </div>
                            <div class="contact-details">
                                <div class="contact-item">
                                    <span>📞 Hotline 24/7</span>
                                    <strong>1900-xxxx</strong>
                                </div>
                                <div class="contact-item">
                                    <span>📧 Email hỗ trợ</span>
                                    <strong>warranty@vietlaptop.vn</strong>
                                </div>
                                <div class="contact-item">
                                    <span>🕐 Giờ làm việc</span>
                                    <strong>08:00 - 22:00 (Hàng ngày)</strong>
                                </div>
                            </div>
                        </article>
                    </div>

                    <aside class="side-column">
                        <div class="card highlight-card" v-for="highlight in assuranceHighlights"
                            :key="highlight.title">
                            <div class="icon-chip"
                                :style="{ backgroundColor: highlight.color + '20', color: highlight.color }">
                                {{ highlight.icon }}
                            </div>
                            <h3>{{ highlight.title }}</h3>
                            <p>{{ highlight.desc }}</p>
                        </div>

                        <div class="card support-card">
                            <header>
                                <p class="eyebrow">Kênh hỗ trợ</p>
                                <h3>Liên hệ nhanh</h3>
                            </header>
                            <ul>
                                <li v-for="channel in supportChannels" :key="channel.label">
                                    <div>
                                        <p>{{ channel.label }}</p>
                                        <span>{{ channel.hint }}</span>
                                    </div>
                                    <strong>{{ channel.value }}</strong>
                                </li>
                            </ul>
                        </div>

                        <div class="card tips-card">
                            <header>
                                <p class="eyebrow">Tài liệu cần chuẩn bị</p>
                                <h3>Check-list mang theo</h3>
                            </header>
                            <ul>
                                <li>Phiếu bảo hành hoặc giấy hẹn bảo hành</li>
                                <li>Hóa đơn mua hàng hoặc chứng từ thanh toán</li>
                                <li>Phụ kiện đi kèm để kiểm tra lỗi chính xác</li>
                                <li>Thông tin liên hệ chính xác để nhận thông báo</li>
                            </ul>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup>
import Breadcrumb from '@/components/customer/common/Breadcrumb.vue'

const breadcrumbs = [
    { label: 'Trang chủ', to: '/' },
    { label: 'Chính sách bảo hành', to: '/warranty-policy' },
]

const heroStats = [
    { value: '12-24 tháng', label: 'Thời hạn bảo hành', desc: 'Theo từng dòng sản phẩm' },
    { value: '30 phút', label: 'Phản hồi hỗ trợ', desc: 'Trung bình trong giờ hành chính' },
    { value: '98%', label: 'Khách hài lòng', desc: 'Sau khi sử dụng dịch vụ' },
]

const conditions = [
    'Sản phẩm còn trong thời hạn bảo hành, tem và serial nguyên vẹn',
    'Có hóa đơn mua hàng hoặc lịch sử giao dịch điện tử',
    'Lỗi phát sinh do nhà sản xuất hoặc lỗi kỹ thuật khách quan',
    'Sản phẩm chưa bị can thiệp bởi đơn vị không thuộc hệ thống VietLaptop',
]

const coverageDurations = [
    {
        title: 'Laptop chính hãng',
        duration: '12 - 24 tháng',
        note: 'Tùy theo từng dòng sản phẩm và chương trình kèm theo.',
    },
    {
        title: 'Pin & sạc',
        duration: '12 tháng',
        note: 'Đổi mới trong 30 ngày đầu nếu phát hiện lỗi do nhà sản xuất.',
    },
    {
        title: 'Phụ kiện kèm theo',
        duration: '6 - 12 tháng',
        note: 'Áp dụng cho phụ kiện chính hãng bán kèm hoặc tặng kèm.',
    },
    {
        title: 'Dịch vụ onsite',
        duration: 'Trong giờ hành chính',
        note: 'Hỗ trợ tận nơi với gói VietLaptop Care+ tại TP lớn.',
    },
]

const processSteps = [
    {
        title: 'Liên hệ và mô tả lỗi',
        desc: 'Gọi hotline 1900-xxxx, chat trực tuyến hoặc mang sản phẩm đến cửa hàng gần nhất.',
        support: 'Hỗ trợ 24/7',
    },
    {
        title: 'Tiếp nhận & kiểm tra',
        desc: 'Kỹ thuật viên kiểm tra hiện trạng, xác định nguyên nhân và công bố thời gian dự kiến.',
        support: 'Trong 30 phút',
    },
    {
        title: 'Sửa chữa / thay thế',
        desc: 'Tiến hành xử lý theo tiêu chuẩn hãng, cập nhật trạng thái qua SMS và email.',
        support: '1-5 ngày làm việc',
    },
    {
        title: 'Bàn giao & hướng dẫn',
        desc: 'Khách hàng kiểm tra sản phẩm, nhận hướng dẫn sử dụng và phiếu bảo hành mới.',
        support: 'Kiểm tra trực tiếp',
    },
]

const exclusions = [
    'Thiết bị hết hạn bảo hành hoặc không có chứng từ hợp lệ',
    'Sản phẩm bị va đập mạnh, cong vênh, nứt vỡ khung vỏ',
    'Lỗi do chất lỏng, cháy nổ, thiên tai hoặc côn trùng gây hư hại',
    'Tự ý tháo lắp, can thiệp phần cứng bởi đơn vị không được ủy quyền',
    'Tem niêm phong, serial bị rách, mờ hoặc có dấu hiệu chỉnh sửa',
    'Không tuân thủ hướng dẫn sử dụng dẫn đến hư hỏng',
]

const assuranceHighlights = [
    {
        title: 'Bảo hành tận nơi',
        desc: 'Áp dụng cho doanh nghiệp và khách hàng VietLaptop Care+ tại 6 thành phố lớn.',
        icon: '🚚',
        color: '#2563eb',
    },
    {
        title: 'Laptop thay thế',
        desc: 'Cung cấp thiết bị dự phòng khi thời gian sửa chữa vượt quá 72 giờ làm việc.',
        icon: '💻',
        color: '#10b981',
    },
    {
        title: 'Theo dõi trực tuyến',
        desc: 'Cập nhật trạng thái bảo hành theo thời gian thực qua ứng dụng VietLaptop.',
        icon: '📱',
        color: '#f59e0b',
    },
]

const supportChannels = [
    { label: 'Hotline kỹ thuật', value: '1900-xxxx', hint: 'Ưu tiên khách hàng Care+' },
    { label: 'Email hỗ trợ', value: 'support@vietlaptop.vn', hint: 'Trả lời trong 2 giờ' },
    { label: 'Live Chat', value: 'vietlaptop.vn/chat', hint: '08:00 - 22:00 hằng ngày' },
]
</script>

<style scoped>
:root {
    --page-bg: #f5f7fb;
    --surface: #ffffff;
    --surface-muted: #f9fafb;
    --text: #0f172a;
    --text-muted: #475569;
    --border: #e2e8f0;
    --border-strong: #cbd5f5;
    --accent: #2563eb;
    --accent-soft: #dbeafe;
    --success: #10b981;
    --warning: #f97316;
    --danger: #ef4444;
    --radius-lg: 24px;
    --radius-md: 16px;
    --radius-sm: 10px;
    --shadow-soft: 0 20px 40px rgba(15, 23, 42, 0.08);
    --shadow-card: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.policy-page {
    min-height: 100vh;
    background: var(--page-bg);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    color: var(--text);
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--accent);
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}

.policy-hero {
    background: linear-gradient(135deg, #1d4ed8, #22d3ee);
    color: #fff;
    padding: 64px 0 80px;
}

.hero-content {
    display: grid;
    gap: 32px;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
}

.hero-text h1 {
    font-size: clamp(2.2rem, 4vw, 3.2rem);
    margin: 0 0 16px;
}

.hero-text p {
    margin: 0 0 24px;
    font-size: 1.125rem;
    max-width: 560px;
    color: rgba(255, 255, 255, 0.9);
}

.hero-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}

.btn {
    border: none;
    border-radius: 999px;
    padding: 0.85rem 1.75rem;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn.primary {
    background: #fff;
    color: #0f172a;
    box-shadow: var(--shadow-soft);
}

.btn.secondary {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(255, 255, 255, 0.4);
}

.btn:hover {
    transform: translateY(-2px);
}

.hero-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 16px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-md);
    padding: 18px 20px;
    backdrop-filter: blur(6px);
}

.stat-value {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0 0 4px;
}

.stat-label {
    margin: 0;
    font-weight: 600;
}

.stat-desc {
    margin: 6px 0 0;
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
}

.policy-body {
    padding: 48px 0 80px;
}

.layout-grid {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
    gap: 32px;
    margin-top: 32px;
}

.card {
    background: var(--surface);
    border-radius: var(--radius-lg);
    padding: 28px 32px;
    box-shadow: var(--shadow-card);
    border: 1px solid rgba(15, 23, 42, 0.05);
}

.policy-card header {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
}

.policy-card h2 {
    margin: 4px 0 0;
    font-size: 1.8rem;
}

.policy-card p {
    color: var(--text-muted);
    line-height: 1.7;
    margin-bottom: 16px;
}

.badge {
    padding: 0.35rem 0.8rem;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    font-weight: 600;
    font-size: 0.85rem;
}

.badge-soft {
    background: rgba(16, 185, 129, 0.15);
    color: var(--success);
}

.check-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.check-list li {
    display: flex;
    gap: 12px;
    font-weight: 500;
    line-height: 1.5;
}

.check-list .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--accent);
    margin-top: 8px;
}

.warranty-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 16px;
}

.warranty-card {
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    padding: 16px;
    background: var(--surface-muted);
}

.warranty-title {
    font-weight: 600;
    margin-bottom: 6px;
}

.warranty-duration {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--success);
    margin-bottom: 8px;
}

.info-bar {
    display: flex;
    gap: 10px;
    align-items: center;
    border-radius: var(--radius-md);
    background: #eef2ff;
    color: #312e81;
    padding: 12px 16px;
    font-size: 0.95rem;
}

.info-bar svg {
    width: 20px;
    height: 20px;
}

.timeline {
    display: flex;
    flex-direction: column;
    gap: 18px;
    margin-top: 12px;
}

.timeline-item {
    display: flex;
    gap: 16px;
    padding: 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
}

.timeline-index {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--accent);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
}

.timeline-content h3 {
    margin: 0 0 6px;
}

.timeline-content span {
    color: var(--accent);
    font-weight: 600;
    font-size: 0.85rem;
}

.warning {
    border: 1px solid rgba(239, 68, 68, 0.2);
    background: #fff1f2;
}

.warning-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.warning-list li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    color: #991b1b;
    font-weight: 500;
}

.warning-list svg {
    width: 20px;
    height: 20px;
    stroke: #ef4444;
}

.contact-card {
    background: linear-gradient(135deg, #0f172a, #1f2937);
    color: #fff;
}

.contact-card p {
    color: rgba(255, 255, 255, 0.8);
}

.contact-content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.contact-actions {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.contact-details {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
}

.contact-item {
    background: rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-md);
    padding: 12px 14px;
}

.contact-item span {
    display: block;
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
}

.contact-item strong {
    margin-top: 4px;
    display: block;
}

.side-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.highlight-card {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.icon-chip {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    display: grid;
    place-items: center;
    font-size: 1.3rem;
}

.highlight-card h3 {
    margin: 0;
}

.support-card ul,
.tips-card ul {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.support-card li,
.tips-card li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
}

.support-card li:last-child,
.tips-card li:last-child {
    border-bottom: none;
    padding-bottom: 0;
}

.support-card span {
    display: block;
    color: var(--text-muted);
    font-size: 0.85rem;
}

.tips-card ul li {
    color: var(--text-muted);
    font-weight: 500;
}

@media (max-width: 1024px) {
    .hero-content {
        grid-template-columns: 1fr;
    }

    .layout-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 600px) {
    .hero-actions {
        flex-direction: column;
    }

    .card {
        padding: 22px;
    }

    .timeline-item {
        flex-direction: column;
    }

    .contact-details {
        grid-template-columns: 1fr;
    }
}
</style>
