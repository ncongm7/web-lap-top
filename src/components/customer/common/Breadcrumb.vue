<template>
    <nav class="breadcrumb" aria-label="Breadcrumb">
        <ol class="breadcrumb-list">
            <li v-for="(item, index) in items" :key="index" class="breadcrumb-item">
                <router-link v-if="item.to && index < items.length - 1" :to="item.to" class="breadcrumb-link">
                    {{ item.label }}
                </router-link>
                <span v-else class="breadcrumb-current">{{ item.label }}</span>
                <span v-if="index < items.length - 1" class="breadcrumb-separator">/</span>
            </li>
        </ol>
    </nav>
</template>

<script setup>
defineProps({
    items: {
        type: Array,
        required: true,
        // Example: [{ label: 'Trang chủ', to: '/' }, { label: 'Sản phẩm' }]
    },
})
</script>

<style scoped>
.breadcrumb {
    padding: 12px 0;
}

.breadcrumb-list {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 14px;
}

.breadcrumb-item {
    display: flex;
    align-items: center;
}

.breadcrumb-link {
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s;
}

.breadcrumb-link:hover {
    color: #10b981;
}

.breadcrumb-current {
    color: #1e293b;
    font-weight: 500;
}

.breadcrumb-separator {
    margin: 0 8px;
    color: #cbd5e1;
}
</style>



