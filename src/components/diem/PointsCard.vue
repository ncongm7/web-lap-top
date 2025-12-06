<template>
  <div class="points-card" @click="goToPointsPage">
    <div class="points-icon">
      <i class="bi bi-star-fill"></i>
    </div>
    <div class="points-info">
      <span class="points-label">Điểm tích lũy</span>
      <span class="points-value">{{ points || 0 }}</span>
    </div>
  </div>
</template>

<script>
import { tichDiemService } from '@/service/diem/tichDiemService';

export default {
  name: 'PointsCard',
  data() {
    return {
      points: 0,
      userId: null,
      loading: false
    };
  },
  mounted() {
    this.getUserId();
    if (this.userId) {
      this.loadPoints();
    }
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
    async loadPoints() {
      if (!this.userId) return;
      
      try {
        this.loading = true;
        const tichDiem = await tichDiemService.getTichDiemByUserId(this.userId);
        this.points = tichDiem?.tongDiem || 0;
      } catch (error) {
        console.error('Lỗi khi tải điểm:', error);
        this.points = 0;
      } finally {
        this.loading = false;
      }
    },
    goToPointsPage() {
      this.$router.push('/account/points');
    }
  },
  watch: {
    '$route'() {
      // Reload points when route changes (e.g., after checkout)
      if (this.userId) {
        this.loadPoints();
      }
    }
  }
};
</script>

<style scoped>
.points-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  color: white;
  min-width: 140px;
}

.points-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.points-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
}

.points-info {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.points-label {
  font-size: 0.75rem;
  opacity: 0.9;
}

.points-value {
  font-size: 1.1rem;
  font-weight: bold;
}
</style>

