<template>
  <div class="phieu-giam-gia-page">
    <h1>Quản lý Phiếu Giảm Giá</h1>

    <div v-if="loading">Đang tải dữ liệu...</div>
    <div v-else-if="error">{{ error }}</div>

    <table v-else>
      <thead>
        <tr>
          <th>Mã Phiếu</th>
          <th>Tên Phiếu</th>
          <th>Loại Phiếu</th>
          <th>Giá trị</th>
          <th>Ngày Bắt Đầu</th>
          <th>Ngày Kết Thúc</th>
          <th>Trạng Thái</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="pgg in phieuGiamGias" :key="pgg.id">
          <td>{{ pgg.ma }}</td>
          <td>{{ pgg.tenPhieuGiamGia }}</td>
          <td>{{ formatLoaiPhieu(pgg.loaiPhieuGiamGia) }}</td>
          <td>{{ formatGiaTri(pgg) }}</td>
          <td>{{ formatDate(pgg.ngayBatDau) }}</td>
          <td>{{ formatDate(pgg.ngayKetThuc) }}</td>
          <td>{{ formatTrangThai(pgg.trangThai) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { usePhieuGiamGiaStore } from '@/stores/phieuGiamGiaStore';

const store = usePhieuGiamGiaStore();

const phieuGiamGias = computed(() => store.allPhieuGiamGias);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

onMounted(() => {
  store.fetchPhieuGiamGias();
});

// Helpers
const formatLoaiPhieu = (loai) => (loai === 1 ? 'Giảm theo %' : 'Giảm theo số tiền');

const formatGiaTri = (pgg) => {
  if (pgg.loaiPhieuGiamGia === 1) {
    const max = (pgg.soTienGiamToiDa ?? 0).toLocaleString('vi-VN');
    return `${pgg.giaTriGiamGia}% (Tối đa: ${max}đ)`;
  }
  return `${(pgg.giaTriGiamGia ?? 0).toLocaleString('vi-VN')}đ`;
};

const formatDate = (str) => {
  if (!str) return 'N/A';
  const d = new Date(str);
  return isNaN(d) ? 'N/A' : d.toLocaleDateString('vi-VN');
};

const formatTrangThai = (st) => (st === 1 ? 'Hoạt động' : 'Không hoạt động');
</script>
