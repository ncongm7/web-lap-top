<template>
  <div class="statistics-dashboard">
    <!-- Header với Date Range Picker -->
    <div class="dashboard-header">
      <h1>📊 Thống Kê Doanh Thu</h1>
      <div class="date-range-picker">
        <input 
          type="date" 
          v-model="startDate" 
          @change="loadStatistics"
          class="date-input"
        />
        <span>đến</span>
        <input 
          type="date" 
          v-model="endDate" 
          @change="loadStatistics"
          class="date-input"
        />
        <button @click="loadStatistics" class="btn-refresh">
          🔄 Làm mới
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Đang tải dữ liệu...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-message">
      ❌ {{ error }}
    </div>

    <!-- Main Statistics Content -->
    <div v-if="!loading && !error && revenueData" class="statistics-content">
      
      <!-- Tổng Quan Doanh Thu -->
      <section class="revenue-overview">
        <h2>💰 Tổng Quan Doanh Thu</h2>
        <div class="revenue-cards">
          <div class="revenue-card actual">
            <div class="card-icon">✅</div>
            <div class="card-content">
              <h3>Doanh Thu Thực</h3>
              <p class="amount">{{ formatCurrency(revenueData.data.doanhThuThuc) }}</p>
              <small>Đã xác nhận thanh toán</small>
            </div>
          </div>
          
          <div class="revenue-card expected">
            <div class="card-icon">⏳</div>
            <div class="card-content">
              <h3>Doanh Thu Kỳ Vọng</h3>
              <p class="amount">{{ formatCurrency(revenueData.data.doanhThuKyVong) }}</p>
              <small>Đang chờ xác nhận</small>
            </div>
          </div>
          
          <div class="revenue-card orders">
            <div class="card-icon">📦</div>
            <div class="card-content">
              <h3>Đơn Hàng</h3>
              <p class="amount">{{ revenueData.data.soDonThanhCong }}</p>
              <small>
                Thành công: {{ revenueData.data.soDonThanhCong }} | 
                Hủy: {{ revenueData.data.soDonDaHuy }} 
                ({{ revenueData.data.tyLeHuyDon?.toFixed(1) }}%)
              </small>
            </div>
          </div>
        </div>
      </section>

      <!-- Chi Tiết Doanh Thu Thực -->
      <section class="revenue-breakdown">
        <h2>💵 Chi Tiết Doanh Thu Đã Xác Nhận</h2>
        <div class="breakdown-cards">
          <div class="breakdown-item cash">
            <span class="icon">💵</span>
            <div class="info">
              <h4>Tiền Mặt Tại Quầy</h4>
              <p class="value">{{ formatCurrency(revenueData.data.tienMatTaiQuay) }}</p>
            </div>
          </div>
          
          <div class="breakdown-item qr">
            <span class="icon">📲</span>
            <div class="info">
              <h4>QR Đã Xác Nhận</h4>
              <p class="value">{{ formatCurrency(revenueData.data.qrDaXacNhan) }}</p>
            </div>
          </div>
          
          <div class="breakdown-item cod">
            <span class="icon">🚚</span>
            <div class="info">
              <h4>COD Đã Giao</h4>
              <p class="value">{{ formatCurrency(revenueData.data.codDaGiao) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Doanh Thu Đang Chờ -->
      <section class="pending-revenue">
        <h2>⏳ Doanh Thu Đang Chờ Xác Nhận</h2>
        <div class="breakdown-cards">
          <div class="breakdown-item qr-pending">
            <span class="icon">⏰</span>
            <div class="info">
              <h4>QR Chưa Xác Nhận</h4>
              <p class="value">{{ formatCurrency(revenueData.data.qrChuaXacNhan) }}</p>
            </div>
          </div>
          
          <div class="breakdown-item cod-shipping">
            <span class="icon">📦</span>
            <div class="info">
              <h4>COD Đang Giao</h4>
              <p class="value">{{ formatCurrency(revenueData.data.codDangGiao) }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Thống Kê Theo Kênh -->
      <section class="channel-statistics" v-if="channelData">
        <h2>🏪 Thống Kê Theo Kênh Bán</h2>
        <div class="channel-cards">
          <div 
            v-for="channel in channelData.data" 
            :key="channel.tenKenh"
            class="channel-card"
            :class="channel.tenKenh.toLowerCase()"
          >
            <h3>{{ channel.tenKenh === 'POS' ? '🏪 Bán Tại Quầy' : '🌐 Bán Online' }}</h3>
            <div class="channel-stats">
              <div class="stat">
                <label>Doanh Thu:</label>
                <span class="amount">{{ formatCurrency(channel.doanhThu) }}</span>
              </div>
              <div class="stat">
                <label>Số Đơn:</label>
                <span>{{ channel.soDon }}</span>
              </div>
              <div class="stat">
                <label>Tỷ Lệ Hủy:</label>
                <span :class="{ 'high-cancel': channel.tyLeHuy > 10 }">
                  {{ channel.tyLeHuy?.toFixed(1) }}%
                </span>
              </div>
              <div class="stat">
                <label>Giá Trị TB:</label>
                <span>{{ formatCurrency(channel.giaTriTrungBinh) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Thống Kê Theo Phương Thức Thanh Toán -->
      <section class="payment-statistics" v-if="paymentData">
        <h2>💳 Thống Kê Theo Phương Thức</h2>
        <div class="payment-table">
          <table>
            <thead>
              <tr>
                <th>Phương Thức</th>
                <th>Đã Xác Nhận</th>
                <th>Chưa Xác Nhận</th>
                <th>Tổng</th>
                <th>Số Đơn</th>
                <th>Tỷ Lệ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="method in paymentData.data" :key="method.phuongThuc">
                <td>
                  <span class="payment-icon">
                    {{ getPaymentIcon(method.phuongThuc) }}
                  </span>
                  {{ getPaymentName(method.phuongThuc) }}
                </td>
                <td class="amount">{{ formatCurrency(method.doanhThuDaXacNhan) }}</td>
                <td class="amount">{{ formatCurrency(method.doanhThuChuaXacNhan) }}</td>
                <td class="amount strong">{{ formatCurrency(method.doanhThu) }}</td>
                <td>{{ method.soDon }}</td>
                <td>{{ method.tyLeSuDung?.toFixed(1) }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Phân Tích Dòng Tiền -->
      <section class="cashflow-analysis" v-if="cashFlowData">
        <h2>💸 Phân Tích Dòng Tiền</h2>
        <div class="cashflow-grid">
          <div class="cashflow-section received">
            <h3>✅ Tiền Đã Về</h3>
            <div class="cashflow-items">
              <div class="item">
                <label>Tiền Mặt:</label>
                <span>{{ formatCurrency(cashFlowData.data.tienMatVe) }}</span>
              </div>
              <div class="item">
                <label>QR Đã Về:</label>
                <span>{{ formatCurrency(cashFlowData.data.qrDaVe) }}</span>
              </div>
              <div class="item">
                <label>COD Đã Thu:</label>
                <span>{{ formatCurrency(cashFlowData.data.codDaThu) }}</span>
              </div>
              <div class="item total">
                <label>Tổng Đã Về:</label>
                <span>{{ formatCurrency(cashFlowData.data.tongTienDaVe) }}</span>
              </div>
            </div>
          </div>
          
          <div class="cashflow-section pending">
            <h3>⏳ Tiền Đang Chờ</h3>
            <div class="cashflow-items">
              <div class="item">
                <label>QR Đang Chờ:</label>
                <span>{{ formatCurrency(cashFlowData.data.qrDangCho) }}</span>
              </div>
              <div class="item">
                <label>COD Đang Giao:</label>
                <span>{{ formatCurrency(cashFlowData.data.codDangGiao) }}</span>
              </div>
              <div class="item total">
                <label>Tổng Đang Chờ:</label>
                <span>{{ formatCurrency(cashFlowData.data.tongTienDangCho) }}</span>
              </div>
            </div>
          </div>
          
          <div class="cashflow-section lost">
            <h3>❌ Tiền Mất</h3>
            <div class="cashflow-items">
              <div class="item">
                <label>Hủy Đơn:</label>
                <span>{{ formatCurrency(cashFlowData.data.tienMatDoHuy) }}</span>
              </div>
              <div class="item">
                <label>Hoàn Trả:</label>
                <span>{{ formatCurrency(cashFlowData.data.tienHoanTra) }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import statisticsService from '@/service/statisticsService';

export default {
  name: 'StatisticsDashboard',
  
  setup() {
    const loading = ref(false);
    const error = ref(null);
    
    // Date range
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDate = ref(formatDate(firstDayOfMonth));
    const endDate = ref(formatDate(today));
    
    // Data
    const revenueData = ref(null);
    const channelData = ref(null);
    const paymentData = ref(null);
    const cashFlowData = ref(null);
    
    // Load all statistics
    const loadStatistics = async () => {
      loading.value = true;
      error.value = null;
      
      try {
        const [revenue, channel, payment, cashflow] = await Promise.all([
          statisticsService.getDetailedRevenue(startDate.value, endDate.value),
          statisticsService.getStatisticsByChannel(startDate.value, endDate.value),
          statisticsService.getStatisticsByPaymentMethod(startDate.value, endDate.value),
          statisticsService.getCashFlowAnalysis(startDate.value, endDate.value)
        ]);
        
        revenueData.value = revenue;
        channelData.value = channel;
        paymentData.value = payment;
        cashFlowData.value = cashflow;
      } catch (err) {
        error.value = 'Không thể tải dữ liệu thống kê. Vui lòng thử lại.';
        console.error('Lỗi khi tải thống kê:', err);
      } finally {
        loading.value = false;
      }
    };
    
    // Helper functions
    function formatDate(date) {
      return date.toISOString().split('T')[0];
    }
    
    function formatCurrency(value) {
      if (!value && value !== 0) return '0 ₫';
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(value);
    }
    
    function getPaymentIcon(method) {
      const icons = {
        'CASH': '💵',
        'QR': '📲',
        'COD': '🚚'
      };
      return icons[method] || '💳';
    }
    
    function getPaymentName(method) {
      const names = {
        'CASH': 'Tiền Mặt',
        'QR': 'Chuyển Khoản QR',
        'COD': 'Thu Tiền Khi Giao'
      };
      return names[method] || method;
    }
    
    onMounted(() => {
      loadStatistics();
    });
    
    return {
      loading,
      error,
      startDate,
      endDate,
      revenueData,
      channelData,
      paymentData,
      cashFlowData,
      loadStatistics,
      formatCurrency,
      getPaymentIcon,
      getPaymentName
    };
  }
};
</script>

<style scoped>
.statistics-dashboard {
  padding: 2rem;
  background: #f5f7fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.8rem;
}

.date-range-picker {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.date-input {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.btn-refresh {
  padding: 0.5rem 1.5rem;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s;
}

.btn-refresh:hover {
  background: #45a049;
  transform: translateY(-2px);
}

/* Loading & Error */
.loading {
  text-align: center;
  padding: 4rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

/* Revenue Overview */
.revenue-overview {
  margin-bottom: 2rem;
}

.revenue-overview h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.revenue-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.revenue-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: flex;
  gap: 1rem;
  transition: transform 0.3s;
}

.revenue-card:hover {
  transform: translateY(-5px);
}

.revenue-card.actual {
  border-left: 5px solid #4CAF50;
}

.revenue-card.expected {
  border-left: 5px solid #FF9800;
}

.revenue-card.orders {
  border-left: 5px solid #2196F3;
}

.card-icon {
  font-size: 3rem;
}

.card-content h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 1rem;
}

.card-content .amount {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0.5rem 0;
}

.card-content small {
  color: #999;
}

/* Breakdown Cards */
.revenue-breakdown,
.pending-revenue {
  margin-bottom: 2rem;
}

.revenue-breakdown h2,
.pending-revenue h2 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.breakdown-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.breakdown-item {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.breakdown-item .icon {
  font-size: 2.5rem;
}

.breakdown-item .info h4 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

.breakdown-item .value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin: 0;
}

/* Channel Statistics */
.channel-statistics {
  margin-bottom: 2rem;
}

.channel-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.channel-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.channel-card.pos {
  border-top: 4px solid #9C27B0;
}

.channel-card.online {
  border-top: 4px solid #00BCD4;
}

.channel-card h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.channel-stats .stat {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.channel-stats .stat:last-child {
  border-bottom: none;
}

.channel-stats label {
  color: #666;
}

.high-cancel {
  color: #f44336;
  font-weight: bold;
}

/* Payment Table */
.payment-table {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  background: #f5f5f5;
  padding: 1rem;
  text-align: left;
  color: #666;
  font-weight: 600;
}

tbody td {
  padding: 1rem;
  border-bottom: 1px solid #f0f0f0;
}

.payment-icon {
  font-size: 1.5rem;
  margin-right: 0.5rem;
}

.amount {
  font-family: monospace;
  color: #2c3e50;
}

.amount.strong {
  font-weight: bold;
  font-size: 1.1rem;
}

/* Cash Flow */
.cashflow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.cashflow-section {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.cashflow-section.received {
  border-left: 5px solid #4CAF50;
}

.cashflow-section.pending {
  border-left: 5px solid #FF9800;
}

.cashflow-section.lost {
  border-left: 5px solid #f44336;
}

.cashflow-section h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
}

.cashflow-items .item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.cashflow-items .item.total {
  border-top: 2px solid #e0e0e0;
  font-weight: bold;
  margin-top: 0.5rem;
  padding-top: 1rem;
}

.cashflow-items label {
  color: #666;
}

.cashflow-items span {
  font-family: monospace;
  color: #2c3e50;
}

/* Responsive */
@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .date-range-picker {
    flex-direction: column;
    width: 100%;
  }
  
  .date-input {
    width: 100%;
  }
}
</style>
