<template>
    <div class="specs-table-wrapper">
        <table class="specs-table">
            <tbody>
                <tr v-for="spec in specs" :key="spec.key">
                    <td class="spec-label-cell">{{ spec.label }}</td>
                    <td class="spec-value-cell">
                        {{ spec.value }}
                        <span v-if="spec.hex" class="color-dot" :style="{ backgroundColor: spec.hex }"
                            :title="`Màu: ${spec.value}`"></span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    specs: {
        type: Array,
        required: true,
    },
})
</script>

<style scoped>
.specs-table-wrapper {
    width: 100%;
    overflow-x: auto;
}

.specs-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border: 1px solid #d2d2d7;
    border-radius: 12px;
    overflow: hidden;
    background: #ffffff;
}

.specs-table tr:nth-child(even) {
    background: #f5f5f7;
}

.spec-label-cell {
    padding: 0.5rem 0.75rem;
    font-weight: 600;
    color: #86868b;
    width: 30%;
    border-right: 1px solid #d2d2d7;
}

.spec-value-cell {
    padding: 0.5rem 0.75rem;
    color: #000000;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.color-dot {
    display: inline-block;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid #d2d2d7;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>

