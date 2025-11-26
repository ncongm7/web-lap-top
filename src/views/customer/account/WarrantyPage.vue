<template>
  <div class="warranty-page">
    <div class="container pt-4 pb-5">
      <div class="header-bar d-flex align-items-center justify-content-between flex-wrap gap-3">
        <h2 class="page-title mb-0">Tạo yêu cầu bảo hành</h2>
        <button class="btn btn-primary" @click="goToHistory">
          <i class="bi bi-clock-history me-1"></i>
          Xem lịch sử bảo hành
        </button>
      </div>
      <CreateWarrantyRequest />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CreateWarrantyRequest from '@/components/baohanh/CreateWarrantyRequest.vue'

const router = useRouter()

const goToHistory = () => {
  router.push('/account/warranty/history')
}
</script>

<style scoped>
.warranty-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.page-title {
  font-weight: 700;
  color: #14213d;
}
</style>
