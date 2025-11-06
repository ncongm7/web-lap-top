<template>
    <div class="customer-layout">
        <CustomerHeader />

        <main class="main-content">
            <router-view />
        </main>

        <CustomerFooter />
    </div>
</template>

<script setup>
import CustomerHeader from '@/components/customer/layout/CustomerHeader.vue'
import CustomerFooter from '@/components/customer/layout/CustomerFooter.vue'
</script>

<style scoped>
.customer-layout {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
}

.main-content {
    flex: 1;
    overflow-x: hidden;
    width: 100%;
}
</style>
