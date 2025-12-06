<template>
  <div class="points-page container py-4">
    <h2 class="mb-4">Điểm tích lũy của tôi</h2>
    
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
    </div>
    
    <!-- Error state -->
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <!-- Content -->
    <div v-else>
      <!-- Cards tổng điểm -->
      <div class="row mb-4">
        <div class="col-md-4 mb-3">
          <div class="card text-center bg-primary text-white">
            <div class="card-body">
              <h5 class="card-title">Tổng điểm</h5>
              <h2 class="mb-0">{{ tichDiem?.tongDiem || 0 }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card text-center bg-success text-white">
            <div class="card-body">
              <h5 class="card-title">Đã tích</h5>
              <h2 class="mb-0">{{ tichDiem?.diemDaCong || 0 }}</h2>
            </div>
          </div>
        </div>
        <div class="col-md-4 mb-3">
          <div class="card text-center bg-warning text-white">
            <div class="card-body">
              <h5 class="card-title">Đã dùng</h5>
              <h2 class="mb-0">{{ tichDiem?.diemDaDung || 0 }}</h2>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Tab lịch sử -->
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: filterLoaiDiem === null }" 
                 @click.prevent="filterLoaiDiem = null; loadLichSu(0)">Tất cả</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: filterLoaiDiem === 1 }" 
                 @click.prevent="filterLoaiDiem = 1; loadLichSu(0)">Tích điểm</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: filterLoaiDiem === 2 }" 
                 @click.prevent="filterLoaiDiem = 2; loadLichSu(0)">Tiêu điểm</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <!-- Loading lịch sử -->
          <div v-if="loadingHistory" class="text-center py-3">
            <div class="spinner-border spinner-border-sm" role="status">
              <span class="visually-hidden">Đang tải...</span>
            </div>
          </div>
          
          <!-- Table lịch sử -->
          <div v-else-if="lichSuDiem && lichSuDiem.content && lichSuDiem.content.length > 0">
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Loại</th>
                    <th>Số điểm</th>
                    <th>Hóa đơn</th>
                    <th>Trạng thái</th>
                    <th>Hạn sử dụng</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in lichSuDiem.content" :key="item.id">
                    <td>{{ formatDate(item.thoiGian) }}</td>
                    <td>
                      <span :class="item.loaiDiem === 1 ? 'badge bg-success' : 'badge bg-warning'">
                        {{ item.tenLoaiDiem || (item.loaiDiem === 1 ? 'Tích điểm' : 'Tiêu điểm') }}
                      </span>
                    </td>
                    <td>
                      <strong :class="item.loaiDiem === 1 ? 'text-success' : 'text-danger'">
                        {{ item.loaiDiem === 1 ? '+' : '-' }}{{ item.soDiemCong || item.soDiemDaDung || 0 }}
                      </strong>
                    </td>
                    <td>
                      <span v-if="item.maHoaDon" class="text-primary">{{ item.maHoaDon }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <span :class="getTrangThaiBadgeClass(item.trangThai)">
                        {{ item.tenTrangThai || getTrangThaiText(item.trangThai) }}
                      </span>
                    </td>
                    <td>
                      <span v-if="item.hanSuDung">{{ formatDate(item.hanSuDung) }}</span>
                      <span v-else class="text-muted">-</span>
                    </td>
                    <td>
                      <small class="text-muted">{{ item.ghiChu || '-' }}</small>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Pagination -->
            <nav v-if="lichSuDiem.totalPages > 1">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: lichSuDiem.first }">
                  <a class="page-link" @click.prevent="loadLichSu(lichSuDiem.number - 1)">Trước</a>
                </li>
                <li class="page-item disabled">
                  <span class="page-link">
                    Trang {{ lichSuDiem.number + 1 }} / {{ lichSuDiem.totalPages }}
                  </span>
                </li>
                <li class="page-item" :class="{ disabled: lichSuDiem.last }">
                  <a class="page-link" @click.prevent="loadLichSu(lichSuDiem.number + 1)">Sau</a>
                </li>
              </ul>
            </nav>
          </div>
          
          <!-- Empty state -->
          <div v-else class="text-center py-5 text-muted">
            <p>Chưa có lịch sử điểm nào</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tichDiemService } from '@/service/diem/tichDiemService';

export default {
  name: 'PointsPage',
  data() {
    return {
      tichDiem: null,
      lichSuDiem: null,
      loading: true,
      loadingHistory: false,
      error: null,
      filterLoaiDiem: null,
      userId: null
    };
  },
  mounted() {
    this.getUserId();
    this.loadTichDiem();
    this.loadLichSu();
  },
  methods: {
    getUserId() {
      try {
        const userStr = localStorage.getItem('customer_user');
        if (userStr) {
          const user = JSON.parse(userStr);
          this.userId = user.id || user.userId;
        }
      } catch (e) {
        console.error('Lỗi khi lấy userId:', e);
      }
    },
    async loadTichDiem() {
      if (!this.userId) {
        this.error = 'Vui lòng đăng nhập để xem điểm tích lũy';
        this.loading = false;
        return;
      }
      
      try {
        this.loading = true;
        this.error = null;
        this.tichDiem = await tichDiemService.getTichDiemByUserId(this.userId);
      } catch (error) {
        console.error('Lỗi khi tải thông tin điểm:', error);
        this.error = error.response?.data?.message || 'Không thể tải thông tin điểm. Vui lòng thử lại sau.';
      } finally {
        this.loading = false;
      }
    },
    async loadLichSu(page = 0) {
      if (!this.userId) {
        return;
      }
      
      try {
        this.loadingHistory = true;
        this.lichSuDiem = await tichDiemService.getLichSuDiem(
          this.userId, 
          page, 
          10, 
          this.filterLoaiDiem
        );
      } catch (error) {
        console.error('Lỗi khi tải lịch sử điểm:', error);
        this.lichSuDiem = null;
      } finally {
        this.loadingHistory = false;
      }
    },
    formatDate(date) {
      if (!date) return '-';
      try {
        return new Date(date).toLocaleDateString('vi-VN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
      } catch (e) {
        return date;
      }
    },
    getTrangThaiText(trangThai) {
      const map = { 
        0: 'Chưa sử dụng', 
        1: 'Đã sử dụng', 
        2: 'Hết hạn' 
      };
      return map[trangThai] || 'N/A';
    },
    getTrangThaiBadgeClass(trangThai) {
      const map = {
        0: 'badge bg-success',
        1: 'badge bg-secondary',
        2: 'badge bg-danger'
      };
      return map[trangThai] || 'badge bg-secondary';
    }
  }
};
</script>

<style scoped>
.points-page {
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  border: none;
}

.nav-tabs .nav-link {
  cursor: pointer;
  color: #495057;
}

.nav-tabs .nav-link.active {
  color: #007bff;
  font-weight: bold;
}

.table th {
  background-color: #f8f9fa;
  border-top: none;
}

.badge {
  font-size: 0.875rem;
  padding: 0.35em 0.65em;
}
</style>
