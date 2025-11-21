<template>
  <div class="specs-table-wrapper">
    <div v-for="(group, groupKey) in groupedSpecs" :key="groupKey" class="specs-group">
      <h4 class="group-title">
        <span class="group-icon">{{ getGroupIcon(groupKey) }}</span>
        {{ getGroupLabel(groupKey) }}
      </h4>
      <table class="specs-table">
        <tbody>
          <tr v-for="spec in group" :key="spec.key">
            <td class="spec-label-cell">
              <span class="spec-icon">{{ getSpecIcon(spec.key) }}</span>
              {{ spec.label }}
            </td>
            <td class="spec-value-cell">
              {{ spec.value }}
              <span
                v-if="spec.hex"
                class="color-dot"
                :style="{ backgroundColor: spec.hex }"
                :title="`Màu: ${spec.value}`"
              ></span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  specs: {
    type: Array,
    required: true,
  },
})

const groupedSpecs = computed(() => {
  const groups = {}
  props.specs.forEach((spec) => {
    const category = spec.category || 'Khác'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(spec)
  })
  return groups
})

const getGroupLabel = (category) => {
  const labels = {
    'Hiệu năng': 'Hiệu năng',
    'Màn hình': 'Màn hình',
    'Lưu trữ': 'Lưu trữ',
    'Kết nối': 'Kết nối',
    'Thiết kế': 'Thiết kế',
    'Pin': 'Pin',
    'Khác': 'Thông tin khác',
  }
  return labels[category] || category
}

const getGroupIcon = (category) => {
  const icons = {
    'Hiệu năng': '⚡',
    'Màn hình': '🖥️',
    'Lưu trữ': '💾',
    'Kết nối': '🔌',
    'Thiết kế': '🎨',
    'Pin': '🔋',
    'Khác': 'ℹ️',
  }
  return icons[category] || 'ℹ️'
}

const getSpecIcon = (key) => {
  const icons = {
    cpu: '⚙️',
    gpu: '🎮',
    ram: '💿',
    storage: '💾',
    screen: '🖥️',
    color: '🎨',
    battery: '🔋',
  }
  return icons[key] || ''
}
</script>

<style scoped>
.specs-table-wrapper {
  width: 100%;
}

.specs-group {
  margin-bottom: 32px;
}

.specs-group:last-child {
  margin-bottom: 0;
}

.group-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-icon {
  font-size: 20px;
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
  padding: 0.75rem 1rem;
  font-weight: 600;
  color: #86868b;
  width: 35%;
  border-right: 1px solid #d2d2d7;
  display: flex;
  align-items: center;
  gap: 8px;
}

.spec-icon {
  font-size: 16px;
}

.spec-value-cell {
  padding: 0.75rem 1rem;
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

@media (max-width: 768px) {
  .spec-label-cell {
    width: 40%;
    font-size: 14px;
  }

  .spec-value-cell {
    font-size: 14px;
  }
}
</style>
