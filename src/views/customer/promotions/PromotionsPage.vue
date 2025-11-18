<template>
  <div class="promotions-page">
    <section class="page-hero">
      <div class="hero-content">
        <p class="hero-eyebrow">Ưu đãi dành riêng cho bạn</p>
        <h1>Khuyến mãi cực HOT tại VietLaptop</h1>
        <p class="hero-description">
          Săn những ưu đãi lớn, voucher độc quyền và các quà tặng hấp dẫn dành
          riêng cho cộng đồng đam mê công nghệ.
        </p>
        <div class="hero-stats">
          <div class="hero-stat">
            <span class="stat-label">Đang diễn ra</span>
            <strong class="stat-value">{{ campaignPagination.totalElements || campaigns.length || 0 }}</strong>
          </div>
          <div class="hero-stat">
            <span class="stat-label">Voucher khả dụng</span>
            <strong class="stat-value">{{ voucherPagination.totalElements || vouchers.length || 0 }}</strong>
          </div>
        </div>
        <div class="hero-actions">
          <button
            class="hero-btn"
            :class="{ active: activeTab === 'active' }"
            @click="handleStatusChange('active')"
          >
            Đang diễn ra
          </button>
          <button
            class="hero-btn"
            :class="{ active: activeTab === 'upcoming' }"
            @click="handleStatusChange('upcoming')"
          >
            Sắp diễn ra
          </button>
        </div>
      </div>
      <div v-if="featuredCampaign" class="hero-banner" @click="goToDetail(featuredCampaign.id)">
        <img
          v-if="featuredCampaign.bannerImageUrl"
          :src="featuredCampaign.bannerImageUrl"
          :alt="featuredCampaign.tenKm"
        />
        <div v-else class="hero-banner__placeholder">
          <span>🎉</span>
        </div>
        <div class="hero-banner__content">
          <p class="banner-label">Ưu đãi nổi bật</p>
          <h3>{{ featuredCampaign.tenKm }}</h3>
          <p>{{ featuredCampaign.moTa }}</p>
          <div class="banner-countdown" v-if="getCountdown(featuredCampaign.ngayKetThuc)">
            <template v-if="!getCountdown(featuredCampaign.ngayKetThuc).expired">
              <span v-for="(value, key) in getCountdown(featuredCampaign.ngayKetThuc).segments" :key="key">
                <strong>{{ value }}</strong>
                <small>{{ key }}</small>
              </span>
            </template>
            <span v-else class="countdown-expired">Đã kết thúc</span>
          </div>
        </div>
      </div>
    </section>

    <div class="layout-grid">
      <section class="campaigns-section">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Các chương trình khuyến mãi lớn</p>
            <h2>Chiến dịch ưu đãi nổi bật</h2>
          </div>
          <div class="tab-controls">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'active' }"
              @click="handleStatusChange('active')"
            >
              Đang diễn ra
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'upcoming' }"
              @click="handleStatusChange('upcoming')"
            >
              Sắp diễn ra
            </button>
          </div>
        </div>

        <LoadingSpinner
          v-if="loadingCampaigns"
          message="Đang tải các chương trình khuyến mãi..."
        />

        <div v-else>
          <div v-if="campaigns.length" class="campaigns-grid">
            <article
              v-for="promotion in campaigns"
              :key="promotion.id"
              class="promotion-card"
            >
              <div class="card-media" @click="goToDetail(promotion.id)">
                <img
                  v-if="promotion.bannerImageUrl"
                  :src="promotion.bannerImageUrl"
                  :alt="promotion.tenKm"
                />
                <div v-else class="card-media__placeholder">🎁</div>
                <div class="card-badge" v-if="promotion.giaTri">
                  Giảm {{ formatPrice(promotion.giaTri) }}
                </div>
                <div class="card-countdown" v-if="getCountdown(promotion.ngayKetThuc)">
                  <template v-if="!getCountdown(promotion.ngayKetThuc).expired">
                    <div
                      v-for="(value, key) in getCountdown(promotion.ngayKetThuc).segments"
                      :key="key"
                      class="countdown-item"
                    >
                      <span class="countdown-value">{{ value }}</span>
                      <span class="countdown-label">{{ key }}</span>
                    </div>
                  </template>
                  <span v-else class="countdown-expired">Đã kết thúc</span>
                </div>
              </div>

              <div class="card-content">
                <div>
                  <h3>{{ promotion.tenKm }}</h3>
                  <p>{{ promotion.moTa }}</p>
                </div>
                <div class="card-meta">
                  <div class="meta-item">
                    <span>Bắt đầu</span>
                    <strong>{{ formatDate(promotion.ngayBatDau) }}</strong>
                  </div>
                  <div class="meta-item">
                    <span>Kết thúc</span>
                    <strong>{{ formatDate(promotion.ngayKetThuc) }}</strong>
                  </div>
                </div>
                <button class="view-detail-btn" @click="goToDetail(promotion.id)">
                  Xem chi tiết →
                </button>
              </div>
            </article>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">🎁</div>
            <h3>Chưa có chương trình khuyến mãi</h3>
            <p>
              Hiện tại chưa có chương trình khuyến mãi nào
              {{ activeTab === 'active' ? 'đang diễn ra' : 'sắp diễn ra' }}.
            </p>
            <router-link to="/" class="back-home-btn">
              Về trang chủ
            </router-link>
          </div>

          <div
            v-if="campaigns.length && campaignPagination.totalPages > 1"
            class="pagination"
          >
            <button
              class="pagination-btn"
              :disabled="campaignPagination.page === 0"
              @click="changeCampaignPage(campaignPagination.page - 1)"
            >
              ‹ Trước
            </button>
            <span class="pagination-info">
              Trang {{ (campaignPagination.page || 0) + 1 }} / {{ campaignPagination.totalPages }}
            </span>
            <button
              class="pagination-btn"
              :disabled="campaignPagination.page >= campaignPagination.totalPages - 1"
              @click="changeCampaignPage((campaignPagination.page || 0) + 1)"
            >
              Sau ›
            </button>
          </div>
        </div>
      </section>

      <aside class="vouchers-section">
        <div class="section-header">
          <div>
            <p class="section-eyebrow">Kho Voucher</p>
            <h3>Tiết kiệm hơn với voucher</h3>
          </div>
        </div>

        <LoadingSpinner v-if="voucherLoading" message="Đang tải voucher..." />

        <div v-else>
          <div v-if="vouchers.length" class="voucher-list">
            <article
              v-for="voucher in vouchers"
              :key="voucher.id || voucher.ma || voucher.code"
              class="voucher-card"
            >
              <div class="voucher-info">
                <p class="voucher-value">{{ getVoucherValueText(voucher) }}</p>
                <p class="voucher-condition">{{ getVoucherConditionText(voucher) }}</p>
                <p class="voucher-expiry">
                  Hạn sử dụng: <strong>{{ getVoucherExpiry(voucher) }}</strong>
                </p>
              </div>
              <div class="voucher-actions">
                <div class="voucher-code">{{ getVoucherCode(voucher) || 'N/A' }}</div>
                <button class="copy-btn" @click="copyVoucherCode(voucher)">
                  <span v-if="copiedVoucherId === (voucher.id || getVoucherCode(voucher))">
                    Đã sao chép
                  </span>
                  <span v-else>Sao chép mã</span>
                </button>
              </div>
            </article>
          </div>

          <div v-else class="empty-voucher">
            <p>Chưa có voucher công khai nào.</p>
          </div>

          <div
            v-if="vouchers.length && voucherPagination.totalPages > 1"
            class="voucher-pagination"
          >
            <button
              class="pagination-btn"
              :disabled="voucherPagination.page === 0"
              @click="changeVoucherPage(voucherPagination.page - 1)"
            >
              ‹
            </button>
            <span>Trang {{ (voucherPagination.page || 0) + 1 }} / {{ voucherPagination.totalPages }}</span>
            <button
              class="pagination-btn"
              :disabled="voucherPagination.page >= voucherPagination.totalPages - 1"
              @click="changeVoucherPage((voucherPagination.page || 0) + 1)"
            >
              ›
            </button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/customer/common/LoadingSpinner.vue'
import { formatDate } from '@/utils/helpers'
import { getCampaigns, getVouchers } from '@/service/customer/promotionService'

const router = useRouter()

const activeTab = ref('active')
const loadingCampaigns = ref(false)
const campaigns = ref([])
const campaignPagination = ref({
  page: 0,
  pageSize: 8,
  totalPages: 0,
  totalElements: 0,
})

const voucherLoading = ref(false)
const vouchers = ref([])
const voucherPagination = ref({
  page: 0,
  pageSize: 6,
  totalPages: 0,
  totalElements: 0,
})

const now = ref(Date.now())
let countdownTimer = null
const copiedVoucherId = ref(null)

const featuredCampaign = computed(() => campaigns.value[0] || null)

const fetchPromotions = async (status = 'active') => {
  try {
    loadingCampaigns.value = true
    const result = await getCampaigns(status, campaignPagination.value.page, campaignPagination.value.pageSize)
    campaigns.value = result.campaigns || []
    campaignPagination.value = {
      ...campaignPagination.value,
      ...result.pagination,
    }
  } catch (error) {
    console.error('Error fetching promotions:', error)
    campaigns.value = []
  } finally {
    loadingCampaigns.value = false
  }
}

const fetchVouchers = async (page = voucherPagination.value.page) => {
  try {
    voucherLoading.value = true
    const result = await getVouchers(page)
    vouchers.value = result.vouchers || []
    voucherPagination.value = {
      page: result.pagination?.page ?? page,
      pageSize: result.pagination?.pageSize ?? voucherPagination.value.pageSize,
      totalPages: result.pagination?.totalPages ?? 0,
      totalElements: result.pagination?.totalElements ?? vouchers.value.length,
    }
  } catch (error) {
    console.error('Error fetching vouchers:', error)
    vouchers.value = []
  } finally {
    voucherLoading.value = false
  }
}

const handleStatusChange = (status) => {
  if (activeTab.value === status) return
  activeTab.value = status
  campaignPagination.value.page = 0
  fetchPromotions(status)
}

const changeCampaignPage = (newPage) => {
  campaignPagination.value.page = newPage
  fetchPromotions(activeTab.value)
}

const changeVoucherPage = (newPage) => {
  voucherPagination.value.page = newPage
  fetchVouchers(newPage)
}

const goToDetail = (id) => {
  router.push(`/khuyen-mai/${id}`)
}

const formatPrice = (price) => {
  if (price === undefined || price === null) return ''
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price)
}

const getCountdown = (endDate) => {
  if (!endDate) return null
  const endTime = new Date(endDate).getTime()
  if (Number.isNaN(endTime)) return null
  const diff = endTime - now.value
  if (diff <= 0) {
    return { expired: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return {
    expired: false,
    segments: {
      Ngày: days.toString().padStart(2, '0'),
      Giờ: hours.toString().padStart(2, '0'),
      Phút: minutes.toString().padStart(2, '0'),
      Giây: seconds.toString().padStart(2, '0'),
    },
  }
}

const getVoucherCode = (voucher) => voucher?.ma || voucher?.code || voucher?.maPhieu || voucher?.maVoucher || ''

const formatCurrency = (value) => {
  if (value === undefined || value === null || value === '') return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}

const getVoucherValueText = (voucher) => {
  const percent = voucher?.tyLeGiam ?? voucher?.tyLe ?? voucher?.phanTramGiam ?? voucher?.mucGiamPhanTram
  if (percent) {
    return `Giảm ${percent}%`
  }
  const moneyValue = voucher?.giaTri ?? voucher?.giaTriGiam ?? voucher?.mucGiamGia ?? voucher?.mucGiam ?? voucher?.soTienGiam
  if (moneyValue) {
    return `Giảm ${formatCurrency(moneyValue)}`
  }
  return voucher?.ten || 'Voucher hấp dẫn'
}

const getVoucherConditionText = (voucher) => {
  const minOrder = voucher?.giaTriDonToiThieu ?? voucher?.giaTriDonHangToiThieu ?? voucher?.dieuKienApDung ?? voucher?.apDungTu
  if (typeof minOrder === 'number' && minOrder > 0) {
    return `Cho đơn từ ${formatCurrency(minOrder)}`
  }
  if (typeof minOrder === 'string' && minOrder.trim()) {
    return minOrder
  }
  return 'Cho mọi đơn hàng'
}

const getVoucherExpiry = (voucher) => {
  const expiry = voucher?.ngayHetHan ?? voucher?.ngayKetThuc ?? voucher?.hanSuDung
  if (!expiry) return 'Không giới hạn'
  return formatDate(expiry)
}

const copyVoucherCode = async (voucher) => {
  const code = getVoucherCode(voucher)
  if (!code) return
  try {
    await navigator.clipboard.writeText(code)
    copiedVoucherId.value = voucher.id || code
    setTimeout(() => {
      if (copiedVoucherId.value === (voucher.id || code)) {
        copiedVoucherId.value = null
      }
    }, 2000)
  } catch (error) {
    console.error('Không thể sao chép mã voucher:', error)
  }
}

onMounted(() => {
  fetchPromotions(activeTab.value)
  fetchVouchers(0)
  countdownTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
})

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>

<style scoped>
.promotions-page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px clamp(16px, 4vw, 48px) 64px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-hero {
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  border-radius: 32px;
  padding: clamp(24px, 4vw, 48px);
  color: #fff;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
}

.hero-content h1 {
  font-size: clamp(32px, 4vw, 48px);
  margin: 12px 0;
  font-weight: 700;
}

.hero-eyebrow {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 13px;
  opacity: 0.8;
}

.hero-description {
  max-width: 500px;
  font-size: 16px;
  margin-bottom: 24px;
  color: rgba(255, 255, 255, 0.8);
}

.hero-stats {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.hero-stat {
  background: rgba(255, 255, 255, 0.12);
  padding: 16px 20px;
  border-radius: 16px;
  min-width: 160px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.8;
}

.stat-value {
  display: block;
  font-size: 32px;
  margin-top: 8px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.hero-btn {
  border: none;
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px 24px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.hero-btn.active,
.hero-btn:hover {
  background: #fff;
  color: #0f766e;
}

.hero-banner {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  position: relative;
  min-height: 320px;
  cursor: pointer;
}

.hero-banner img,
.hero-banner__placeholder {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-banner__placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  background: rgba(0, 0, 0, 0.2);
}

.hero-banner__content {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(15, 118, 110, 0.9) 100%);
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 8px;
}

.banner-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.8;
}

.banner-countdown {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
}

.banner-countdown span {
  background: rgba(0, 0, 0, 0.35);
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 13px;
}

.layout-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 32px;
}

.campaigns-section,
.vouchers-section {
  background: #fff;
  border-radius: 24px;
  padding: clamp(20px, 3vw, 32px);
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.05);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 24px;
}

.section-eyebrow {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #0f766e;
  margin-bottom: 8px;
}

.section-header h2,
.section-header h3 {
  margin: 0;
}

.tab-controls {
  display: flex;
  gap: 12px;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  cursor: pointer;
  font-weight: 600;
  color: #0f172a;
  transition: all 0.2s;
}

.tab-btn.active,
.tab-btn:hover {
  border-color: #0f766e;
  color: #0f766e;
  background: rgba(20, 184, 166, 0.1);
}

.campaigns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.promotion-card {
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
  transition: transform 0.2s, box-shadow 0.2s;
}

.promotion-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
}

.card-media {
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #0f766e, #14b8a6);
  cursor: pointer;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-media__placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #fff;
}

.card-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  background: #ef4444;
  color: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  font-weight: 600;
  font-size: 14px;
}

.card-countdown {
  position: absolute;
  bottom: 16px;
  left: 16px;
  display: flex;
  gap: 10px;
  background: rgba(15, 23, 42, 0.65);
  padding: 8px 12px;
  border-radius: 12px;
  color: #fff;
}

.countdown-item {
  text-align: center;
  min-width: 46px;
}

.countdown-value {
  display: block;
  font-weight: 700;
}

.countdown-label {
  font-size: 11px;
  opacity: 0.8;
}

.countdown-expired {
  font-weight: 600;
  color: #fecdd3;
}

.card-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
}

.card-content h3 {
  margin: 0;
  font-size: 20px;
  color: #0f172a;
}

.card-content p {
  margin: 8px 0 0;
  color: #475569;
  line-height: 1.5;
}

.card-meta {
  display: flex;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 16px;
  padding: 12px 16px;
  gap: 12px;
  flex-wrap: wrap;
}

.meta-item span {
  display: block;
  font-size: 12px;
  color: #94a3b8;
  text-transform: uppercase;
}

.meta-item strong {
  font-size: 14px;
  color: #0f172a;
}

.view-detail-btn {
  align-self: flex-start;
  padding: 10px 18px;
  background: #0f766e;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.view-detail-btn:hover {
  background: #0d6b63;
}

.empty-state {
  text-align: center;
  padding: 56px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.back-home-btn {
  display: inline-flex;
  padding: 10px 20px;
  border-radius: 999px;
  background: #0f766e;
  color: #fff;
  text-decoration: none;
  margin-top: 16px;
}

.pagination,
.voucher-pagination {
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
}

.pagination-btn {
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 8px 16px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-btn:not(:disabled):hover {
  border-color: #0f766e;
  color: #0f766e;
}

.voucher-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.voucher-card {
  border: 1px dashed #0f766e;
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: linear-gradient(135deg, rgba(20, 184, 166, 0.08), rgba(15, 118, 110, 0.05));
}

.voucher-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.voucher-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f766e;
  margin: 0;
}

.voucher-condition,
.voucher-expiry {
  margin: 0;
  color: #475569;
}

.voucher-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.voucher-code {
  font-family: 'Space Mono', monospace;
  background: #fff;
  border-radius: 12px;
  padding: 8px 12px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #0f766e;
  letter-spacing: 1.2px;
}

.copy-btn {
  border: none;
  border-radius: 999px;
  padding: 10px 16px;
  background: #0f766e;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
  align-self: flex-start;
  transition: background 0.2s;
}

.copy-btn:hover {
  background: #0c5f59;
}

.empty-voucher {
  text-align: center;
  padding: 32px 0;
  color: #475569;
}

@media (max-width: 1024px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-stats {
    flex-direction: column;
  }
  .card-meta {
    flex-direction: column;
  }
  .voucher-card {
    padding: 16px;
  }
}
</style>
