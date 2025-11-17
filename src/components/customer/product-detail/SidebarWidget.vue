<template>
    <div class="sidebar-widget">
        <h3 class="widget-title">{{ title }}</h3>
        <ul class="widget-list">
            <li v-for="item in items" :key="item.id" class="widget-list-item">
                <a :href="item.url" class="widget-link">{{ item.name || item.title }}</a>
            </li>
        </ul>
        <button v-if="showButton" class="widget-btn" @click="$emit('view-all')">
            {{ buttonText }} →
        </button>
    </div>
</template>

<script setup>
defineProps({
    title: {
        type: String,
        required: true,
    },
    items: {
        type: Array,
        default: () => [],
    },
    showButton: {
        type: Boolean,
        default: true,
    },
    buttonText: {
        type: String,
        default: 'Xem tất cả',
    },
})

defineEmits(['view-all'])
</script>

<style scoped>
.sidebar-widget {
    background: #ffffff;
    border-radius: 14px;
    padding: 1.25rem;
    box-shadow: 0 6px 18px rgba(2, 6, 23, 0.04);
    border: 1px solid #d2d2d7;
}

.widget-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: #000000;
}

.widget-list {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.widget-list-item {
    line-height: 1.5;
}

.widget-link {
    color: #000000;
    text-decoration: none;
    font-size: 0.9375rem;
    line-height: 1.5;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: block;
}

.widget-link:hover {
    color: #0071e3;
    padding-left: 0.5rem;
}

.widget-btn {
    width: 100%;
    padding: 0.75rem;
    background: #f5f5f7;
    border: 1px solid #d2d2d7;
    border-radius: 8px;
    color: #0071e3;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.widget-btn:hover {
    background: #0071e3;
    color: white;
    border-color: #0071e3;
}
</style>

