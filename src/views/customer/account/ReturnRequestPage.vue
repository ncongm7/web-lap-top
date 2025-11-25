<template>
  <div class="return-request-page">
    <div class="container pt-4 pb-5">
      <div class="header-bar d-flex align-items-center justify-content-between flex-wrap gap-3">
        <h2 class="page-title mb-0">Tạo yêu cầu trả hàng</h2>
        <button class="btn btn-primary" @click="goToHistory">
          <i class="bi bi-clock-history me-1"></i>
          Xem lịch sử trả hàng
        </button>
      </div>
      <CreateReturnRequest />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import CreateReturnRequest from '@/components/trahang/CreateReturnRequest.vue'

const router = useRouter()

const goToHistory = () => {
  router.push('/account/return-request/history')
}
</script>

<style scoped>
.return-request-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 0;
  margin: 0;
}
</style>
