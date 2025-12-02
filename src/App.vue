<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/customer/authStore'
import ComparisonFloatingBar from '@/components/customer/product-detail/ComparisonFloatingBar.vue'

const authStore = useAuthStore()

// Initialize auth state from localStorage
onMounted(() => {
  authStore.initialize()
})
</script>

<template>
  <router-view />
  <ComparisonFloatingBar />
</template>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
  width: 100%;
  max-width: 100vw;
  background: #ffffff;
  /* force light background to avoid black bars in dark mode */
}

#app {
  min-height: 100vh;
  overflow-x: hidden;
  width: 100%;
}
</style>
