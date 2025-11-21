<template>
  <div class="return-request-page">
    <CreateReturnRequest />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import CreateReturnRequest from '@/components/trahang/CreateReturnRequest.vue'

onMounted(() => {
  console.log('ReturnRequestPage mounted')
})
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
