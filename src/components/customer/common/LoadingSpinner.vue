<template>
    <div class="loading-spinner">
        <div class="spinner"></div>
        <p v-if="message" class="loading-message">{{ message }}</p>
    </div>
</template>

<script setup>
defineProps({
    message: {
        type: String,
        default: 'Đang tải...',
    },
})
</script>

<style scoped>
.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #10b981;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.loading-message {
    margin-top: 16px;
    color: #64748b;
    font-size: 14px;
}
</style>



