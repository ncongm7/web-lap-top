<template>
  <div class="about-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-overlay"></div>
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Về VietLapTop</h1>
          <p class="hero-desc">Đối tác tin cậy của bạn trong việc tìm kiếm laptop hoàn hảo</p>
          <div class="hero-stats">
            <div class="stat-item">
              <div class="stat-number">10+</div>
              <div class="stat-label">Năm kinh nghiệm</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">500K+</div>
              <div class="stat-label">Khách hàng tin tưởng</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">50+</div>
              <div class="stat-label">Cửa hàng toàn quốc</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">1000+</div>
              <div class="stat-label">Sản phẩm đa dạng</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="content-section">
      <div class="container">
        <Breadcrumb :items="breadcrumbs" />

        <div class="about-content">
          <!-- Giới thiệu -->
          <section class="about-section intro-section">
            <div class="section-header">
              <span class="section-badge">Giới thiệu</span>
              <h2>VietLapTop - Thương hiệu laptop hàng đầu Việt Nam</h2>
            </div>
            <div class="intro-content">
              <p class="lead-text">
                VietLapTop là hệ thống cửa hàng chuyên cung cấp các dòng laptop chính hãng hàng đầu
                Việt Nam, đa dạng từ phân khúc phổ thông đến cao cấp. Với hơn 10 năm kinh nghiệm
                trong ngành công nghệ, chúng tôi tự hào là đối tác tin cậy của hàng trăm nghìn khách
                hàng trên toàn quốc.
              </p>
              <p>
                Được thành lập với tầm nhìn trở thành địa chỉ mua sắm laptop uy tín nhất, VietLapTop
                không ngừng nỗ lực mang đến những sản phẩm chất lượng cao, dịch vụ chuyên nghiệp và
                trải nghiệm mua sắm tuyệt vời cho mọi khách hàng. Chúng tôi hợp tác trực tiếp với
                các thương hiệu lớn như Dell, HP, Lenovo, Asus, Acer, MSI, Apple để đảm bảo nguồn
                hàng chính hãng và giá cả cạnh tranh nhất.
              </p>
            </div>
          </section>

          <!-- Sứ mệnh & Tầm nhìn -->
          <section class="about-section mission-vision-section">
            <div class="mission-vision-grid">
              <div class="mission-card">
                <div class="card-icon mission-icon">🎯</div>
                <h3>Sứ mệnh</h3>
                <p>
                  Chúng tôi cam kết mang đến cho khách hàng những sản phẩm laptop chất lượng cao với
                  giá cả cạnh tranh nhất thị trường. Không chỉ bán hàng, chúng tôi còn đồng hành
                  cùng khách hàng trong suốt quá trình sử dụng với dịch vụ bảo hành chính hãng, hỗ
                  trợ kỹ thuật tận tâm và chăm sóc khách hàng chu đáo.
                </p>
                <ul class="mission-list">
                  <li>✓ Cung cấp sản phẩm chính hãng 100%</li>
                  <li>✓ Giá cả minh bạch, cạnh tranh</li>
                  <li>✓ Dịch vụ khách hàng xuất sắc</li>
                  <li>✓ Hỗ trợ kỹ thuật 24/7</li>
                </ul>
              </div>
              <div class="vision-card">
                <div class="card-icon vision-icon">🔮</div>
                <h3>Tầm nhìn</h3>
                <p>
                  Trở thành hệ thống bán lẻ laptop số 1 Việt Nam, được khách hàng tin tưởng và lựa
                  chọn hàng đầu. Chúng tôi hướng tới việc mở rộng mạng lưới cửa hàng trên toàn quốc,
                  phát triển nền tảng thương mại điện tử hiện đại và xây dựng cộng đồng người dùng
                  laptop lớn nhất Việt Nam.
                </p>
                <ul class="vision-list">
                  <li>→ Mở rộng 100+ cửa hàng vào 2026</li>
                  <li>→ Trở thành đối tác chiến lược của các hãng lớn</li>
                  <li>→ Phát triển hệ sinh thái công nghệ hoàn chỉnh</li>
                  <li>→ Dẫn đầu về trải nghiệm khách hàng</li>
                </ul>
              </div>
            </div>
          </section>

          <!-- Giá trị cốt lõi -->
          <section class="about-section values-section">
            <div class="section-header">
              <span class="section-badge">Giá trị cốt lõi</span>
              <h2>Những điều làm nên thương hiệu VietLapTop</h2>
            </div>
            <div class="values-grid">
              <div class="value-card">
                <div class="value-icon-wrapper">
                  <div class="value-icon">✓</div>
                </div>
                <h3>Chất lượng đảm bảo</h3>
                <p>
                  100% sản phẩm chính hãng, đầy đủ giấy tờ, tem bảo hành. Tất cả sản phẩm đều được
                  kiểm tra kỹ lưỡng trước khi giao đến tay khách hàng.
                </p>
              </div>
              <div class="value-card">
                <div class="value-icon-wrapper">
                  <div class="value-icon">💰</div>
                </div>
                <h3>Giá tốt nhất thị trường</h3>
                <p>
                  Cam kết giá cạnh tranh, hoàn tiền 110% nếu tìm thấy giá thấp hơn. Chính sách giá
                  minh bạch, không phát sinh phí ẩn.
                </p>
              </div>
              <div class="value-card">
                <div class="value-icon-wrapper">
                  <div class="value-icon">🛡️</div>
                </div>
                <h3>Bảo hành uy tín</h3>
                <p>
                  Bảo hành chính hãng từ nhà sản xuất, hỗ trợ nhanh chóng khi có sự cố. Mạng lưới
                  trung tâm bảo hành rộng khắp toàn quốc.
                </p>
              </div>
              <div class="value-card">
                <div class="value-icon-wrapper">
                  <div class="value-icon">🚚</div>
                </div>
                <h3>Giao hàng nhanh chóng</h3>
                <p>
                  Miễn phí vận chuyển cho đơn hàng trên 10 triệu. Giao hàng trong 24h tại TP.HCM và
                  Hà Nội, 2-3 ngày tại các tỉnh thành khác.
                </p>
              </div>
              <div class="value-card">
                <div class="value-icon-wrapper">
                  <div class="value-icon">💬</div>
                </div>
                <h3>Tư vấn chuyên nghiệp</h3>
                <p>
                  Đội ngũ chuyên viên giàu kinh nghiệm, tư vấn tận tâm giúp bạn chọn được sản phẩm
                  phù hợp nhất với nhu cầu và ngân sách.
                </p>
              </div>
              <div class="value-card">
                <div class="value-icon-wrapper">
                  <div class="value-icon">🔄</div>
                </div>
                <h3>Đổi trả linh hoạt</h3>
                <p>
                  Chính sách đổi trả trong 7 ngày đầu, hỗ trợ trả góp 0% lãi suất. Mua hàng không lo
                  lắng, mua sắm an tâm.
                </p>
              </div>
            </div>
          </section>

          <!-- Lịch sử phát triển -->
          <section class="about-section timeline-section">
            <div class="section-header">
              <span class="section-badge">Hành trình</span>
              <h2>Lịch sử phát triển</h2>
            </div>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-year">2014</div>
                <div class="timeline-content">
                  <h3>Khởi đầu</h3>
                  <p>
                    VietLapTop được thành lập với cửa hàng đầu tiên tại TP.HCM, bắt đầu hành trình
                    phục vụ khách hàng với tầm nhìn trở thành địa chỉ mua laptop uy tín.
                  </p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-year">2017</div>
                <div class="timeline-content">
                  <h3>Mở rộng</h3>
                  <p>
                    Mở rộng mạng lưới lên 10 cửa hàng tại các thành phố lớn, trở thành đối tác chính
                    thức của nhiều thương hiệu laptop hàng đầu thế giới.
                  </p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-year">2020</div>
                <div class="timeline-content">
                  <h3>Chuyển đổi số</h3>
                  <p>
                    Ra mắt nền tảng thương mại điện tử, phục vụ khách hàng online trên toàn quốc.
                    Đạt mốc 100.000 khách hàng thân thiết.
                  </p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-year">2023</div>
                <div class="timeline-content">
                  <h3>Bước tiến mới</h3>
                  <p>
                    Mở rộng lên 50+ cửa hàng trên toàn quốc, đạt mốc 500.000 khách hàng. Được vinh
                    danh là "Nhà bán lẻ laptop tốt nhất Việt Nam".
                  </p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-year">2025</div>
                <div class="timeline-content">
                  <h3>Tương lai</h3>
                  <p>
                    Tiếp tục mở rộng mạng lưới, phát triển công nghệ AI trong tư vấn sản phẩm, và
                    hướng tới mục tiêu phục vụ 1 triệu khách hàng vào cuối năm.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Thành tựu -->
          <section class="about-section achievements-section">
            <div class="section-header">
              <span class="section-badge">Thành tựu</span>
              <h2>Những dấu ấn đáng tự hào</h2>
            </div>
            <div class="achievements-grid">
              <div class="achievement-card">
                <div class="achievement-icon">🏆</div>
                <h3>Top 1</h3>
                <p>Nhà bán lẻ laptop tốt nhất Việt Nam 2023</p>
              </div>
              <div class="achievement-card">
                <div class="achievement-icon">⭐</div>
                <h3>4.8/5</h3>
                <p>Đánh giá trung bình từ khách hàng</p>
              </div>
              <div class="achievement-card">
                <div class="achievement-icon">👥</div>
                <h3>500K+</h3>
                <p>Khách hàng hài lòng và tin tưởng</p>
              </div>
              <div class="achievement-card">
                <div class="achievement-icon">🤝</div>
                <h3>20+</h3>
                <p>Đối tác thương hiệu quốc tế</p>
              </div>
            </div>
          </section>

          <!-- Hệ thống cửa hàng -->
          <section class="about-section stores-section">
            <div class="section-header">
              <span class="section-badge">Hệ thống</span>
              <h2>Mạng lưới cửa hàng rộng khắp</h2>
            </div>
            <div class="stores-content">
              <p class="lead-text">
                Với mạng lưới hơn 50 cửa hàng trên toàn quốc, VietLapTop luôn sẵn sàng phục vụ bạn
                tại bất kỳ đâu. Mỗi cửa hàng đều được thiết kế hiện đại, trưng bày đầy đủ các sản
                phẩm mới nhất để khách hàng có thể trải nghiệm trực tiếp.
              </p>
              <div class="stores-features">
                <div class="store-feature">
                  <div class="feature-icon">📍</div>
                  <div>
                    <h4>50+ Cửa hàng</h4>
                    <p>Có mặt tại tất cả các thành phố lớn trên toàn quốc</p>
                  </div>
                </div>
                <div class="store-feature">
                  <div class="feature-icon">🖥️</div>
                  <div>
                    <h4>Showroom hiện đại</h4>
                    <p>Không gian trưng bày rộng rãi, đầy đủ sản phẩm để trải nghiệm</p>
                  </div>
                </div>
                <div class="store-feature">
                  <div class="feature-icon">👨‍💼</div>
                  <div>
                    <h4>Đội ngũ chuyên nghiệp</h4>
                    <p>Chuyên viên tư vấn giàu kinh nghiệm, nhiệt tình và tận tâm</p>
                  </div>
                </div>
                <div class="store-feature">
                  <div class="feature-icon">🅿️</div>
                  <div>
                    <h4>Tiện ích đầy đủ</h4>
                    <p>Bãi đỗ xe miễn phí, wifi tốc độ cao, khu vực nghỉ ngơi</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Dịch vụ -->
          <section class="about-section services-section">
            <div class="section-header">
              <span class="section-badge">Dịch vụ</span>
              <h2>Dịch vụ toàn diện cho khách hàng</h2>
            </div>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon">🔧</div>
                <h3>Bảo hành & Sửa chữa</h3>
                <p>
                  Bảo hành chính hãng từ nhà sản xuất, dịch vụ sửa chữa nhanh chóng với đội ngũ kỹ
                  thuật viên chuyên nghiệp.
                </p>
              </div>
              <div class="service-card">
                <div class="service-icon">💳</div>
                <h3>Trả góp 0%</h3>
                <p>
                  Hỗ trợ trả góp linh hoạt với lãi suất 0% cho đơn hàng từ 5 triệu, thủ tục đơn
                  giản, duyệt nhanh.
                </p>
              </div>
              <div class="service-card">
                <div class="service-icon">📦</div>
                <h3>Giao hàng & Lắp đặt</h3>
                <p>
                  Giao hàng tận nơi miễn phí, hỗ trợ lắp đặt và cài đặt phần mềm cơ bản tại nhà.
                </p>
              </div>
              <div class="service-card">
                <div class="service-icon">🎓</div>
                <h3>Đào tạo & Hỗ trợ</h3>
                <p>
                  Khóa học sử dụng laptop miễn phí, hỗ trợ kỹ thuật 24/7 qua hotline và chat online.
                </p>
              </div>
            </div>
          </section>

          <!-- Liên hệ -->
          <section class="about-section contact-section">
            <div class="section-header">
              <span class="section-badge">Liên hệ</span>
              <h2>Kết nối với chúng tôi</h2>
            </div>
            <div class="contact-grid">
              <div class="contact-card">
                <div class="contact-icon">📞</div>
                <h3>Hotline</h3>
                <p class="contact-value">1900-xxxx</p>
                <p class="contact-note">Tư vấn 24/7, hỗ trợ kỹ thuật</p>
              </div>
              <div class="contact-card">
                <div class="contact-icon">✉️</div>
                <h3>Email</h3>
                <p class="contact-value">support@VietLapTop.vn</p>
                <p class="contact-note">Phản hồi trong 24h</p>
              </div>
              <div class="contact-card">
                <div class="contact-icon">📍</div>
                <h3>Địa chỉ</h3>
                <p class="contact-value">123 Đường ABC, Quận XYZ</p>
                <p class="contact-note">TP.HCM, Việt Nam</p>
              </div>
              <div class="contact-card">
                <div class="contact-icon">🕐</div>
                <h3>Giờ làm việc</h3>
                <p class="contact-value">8:00 - 22:00</p>
                <p class="contact-note">Hàng ngày (kể cả cuối tuần)</p>
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
  { label: 'Về chúng tôi', to: '/about' },
])
</script>

<style scoped>
.about-page {
  min-height: 100vh;
  background: #ffffff;
}

/* Hero Section */
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%);
  color: #ffffff;
  padding: 100px 0 80px;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: 56px;
  font-weight: 800;
  margin: 0 0 20px 0;
  letter-spacing: -0.02em;
  animation: fadeInUp 0.8s ease-out;
}

.hero-desc {
  font-size: 22px;
  margin: 0 0 50px 0;
  opacity: 0.95;
  font-weight: 300;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 60px;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 0.8s ease-out 0.4s both;
}

.stat-item {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  font-weight: 400;
}

/* Container */
.container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 24px;
  width: 100%;
}

/* Content Section */
.content-section {
  padding: 80px 0;
  background: linear-gradient(to bottom, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
}

.about-content {
  margin-top: 40px;
}

.about-section {
  margin-bottom: 80px;
  animation: fadeIn 0.6s ease-out;
}

.section-header {
  text-align: center;
  margin-bottom: 50px;
}

.section-badge {
  display: inline-block;
  padding: 8px 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
  text-transform: uppercase;
}

.about-section h2 {
  font-size: 40px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.02em;
}

.about-section p {
  font-size: 17px;
  line-height: 1.9;
  color: #475569;
  margin: 0 0 20px 0;
}

.lead-text {
  font-size: 20px;
  font-weight: 500;
  color: #334155;
  line-height: 1.8;
}

/* Intro Section */
.intro-section {
  background: #ffffff;
  padding: 60px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.intro-content {
  max-width: 900px;
  margin: 0 auto;
}

/* Mission & Vision */
.mission-vision-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.mission-card,
.vision-card {
  padding: 40px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border-top: 4px solid;
}

.mission-card {
  border-top-color: #10b981;
}

.vision-card {
  border-top-color: #3b82f6;
}

.mission-card:hover,
.vision-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
}

.card-icon {
  font-size: 56px;
  margin-bottom: 24px;
  display: inline-block;
}

.mission-card h3,
.vision-card h3 {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 20px 0;
}

.mission-list,
.vision-list {
  list-style: none;
  padding: 0;
  margin: 20px 0 0 0;
}

.mission-list li,
.vision-list li {
  padding: 10px 0;
  font-size: 16px;
  color: #475569;
  line-height: 1.6;
}

/* Values Section */
.values-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.value-card {
  padding: 40px 30px;
  background: #ffffff;
  border-radius: 16px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid #f1f5f9;
  position: relative;
  overflow: hidden;
}

.value-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  transform: scaleX(0);
  transition: transform 0.4s ease;
}

.value-card:hover::before {
  transform: scaleX(1);
}

.value-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.15);
  border-color: #10b981;
}

.value-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.value-card:hover .value-icon-wrapper {
  transform: scale(1.1) rotate(5deg);
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.value-icon {
  font-size: 36px;
  transition: all 0.3s ease;
}

.value-card:hover .value-icon {
  transform: scale(1.2);
  filter: brightness(0) invert(1);
}

.value-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.value-card p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  line-height: 1.7;
}

/* Timeline Section */
.timeline-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
  padding: 60px;
  border-radius: 20px;
}

.timeline {
  position: relative;
  max-width: 900px;
  margin: 50px auto 0;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #10b981 0%, #059669 100%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 50px;
  padding-left: 60px;
  animation: fadeInLeft 0.6s ease-out;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 0;
  width: 20px;
  height: 20px;
  background: #10b981;
  border-radius: 50%;
  border: 4px solid #ffffff;
  box-shadow: 0 0 0 4px #10b981;
}

.timeline-year {
  position: absolute;
  left: -100px;
  top: 0;
  font-size: 24px;
  font-weight: 700;
  color: #10b981;
  background: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
}

.timeline-content {
  background: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.timeline-content:hover {
  transform: translateX(10px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.timeline-content h3 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.timeline-content p {
  margin: 0;
  color: #475569;
}

/* Achievements Section */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.achievement-card {
  padding: 40px 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  border-radius: 16px;
  text-align: center;
  transition: all 0.4s ease;
  border: 2px solid transparent;
}

.achievement-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 20px 50px rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #d1fae5 100%);
}

.achievement-icon {
  font-size: 64px;
  margin-bottom: 20px;
  display: inline-block;
  animation: bounce 2s infinite;
}

.achievement-card h3 {
  font-size: 36px;
  font-weight: 700;
  color: #10b981;
  margin: 0 0 12px 0;
}

.achievement-card p {
  font-size: 16px;
  color: #475569;
  margin: 0;
  font-weight: 500;
}

/* Stores Section */
.stores-content {
  max-width: 1000px;
  margin: 0 auto;
}

.stores-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.store-feature {
  display: flex;
  gap: 20px;
  padding: 30px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.store-feature:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.feature-icon {
  font-size: 40px;
  flex-shrink: 0;
}

.store-feature h4 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.store-feature p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
}

/* Services Section */
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.service-card {
  padding: 40px 30px;
  background: #ffffff;
  border-radius: 16px;
  text-align: center;
  transition: all 0.4s ease;
  border: 2px solid #f1f5f9;
  position: relative;
  overflow: hidden;
}

.service-card::after {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.service-card:hover::after {
  opacity: 1;
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.15);
  border-color: #10b981;
}

.service-icon {
  font-size: 56px;
  margin-bottom: 24px;
  display: inline-block;
  transition: transform 0.3s ease;
}

.service-card:hover .service-icon {
  transform: scale(1.2) rotate(5deg);
}

.service-card h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.service-card p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  line-height: 1.7;
}

/* Contact Section */
.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 50px;
}

.contact-card {
  padding: 40px 30px;
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
  border-radius: 16px;
  text-align: center;
  transition: all 0.4s ease;
  border: 2px solid #e2e8f0;
  position: relative;
}

.contact-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
  border-color: #10b981;
  background: linear-gradient(135deg, #ffffff 0%, #d1fae5 100%);
}

.contact-icon {
  font-size: 48px;
  margin-bottom: 20px;
  display: inline-block;
}

.contact-card h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 16px 0;
}

.contact-value {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
  margin: 0 0 8px 0;
}

.contact-note {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .mission-vision-grid {
    grid-template-columns: 1fr;
  }

  .timeline-year {
    position: static;
    display: inline-block;
    margin-bottom: 16px;
  }

  .timeline-item {
    padding-left: 40px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0 50px;
  }

  .hero-title {
    font-size: 36px;
  }

  .hero-desc {
    font-size: 18px;
    margin-bottom: 40px;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 40px;
  }

  .stat-number {
    font-size: 28px;
  }

  .stat-label {
    font-size: 12px;
  }

  .content-section {
    padding: 40px 0;
  }

  .about-section {
    margin-bottom: 60px;
  }

  .about-section h2 {
    font-size: 28px;
  }

  .section-badge {
    font-size: 12px;
    padding: 6px 16px;
  }

  .intro-section,
  .timeline-section {
    padding: 30px 20px;
  }

  .mission-card,
  .vision-card {
    padding: 30px 20px;
  }

  .values-grid,
  .achievements-grid,
  .services-grid,
  .contact-grid {
    grid-template-columns: 1fr;
  }

  .stores-features {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: 30px;
  }

  .timeline-item {
    padding-left: 30px;
  }

  .timeline-year {
    position: static;
    display: block;
    margin-bottom: 16px;
    left: 0;
  }
}

@media (max-width: 480px) {
  .hero-stats {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 28px;
  }

  .about-section h2 {
    font-size: 24px;
  }

  .value-card,
  .service-card,
  .contact-card {
    padding: 30px 20px;
  }
}
</style>
