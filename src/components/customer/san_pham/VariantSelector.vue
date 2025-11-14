<template>
    <div class="variant-selector">
        <h3 class="selector-title">Chọn phiên bản</h3>

        <!-- Nhóm thuộc tính động (RAM, Ổ cứng, Màu sắc, etc.) -->
        <div v-for="(group, groupKey) in attributeGroups" :key="groupKey" class="attribute-group">
            <div class="group-label">{{ group.label }}</div>
            <div class="options-grid">
                <button v-for="option in group.options" :key="option.value" :class="[
                    'option-chip',
                    {
                        active: isSelected(groupKey, option.value),
                        disabled: isDisabled(groupKey, option.value),
                        'out-of-stock': option.outOfStock,
                    },
                ]" :disabled="isDisabled(groupKey, option.value) || option.outOfStock"
                    @click="selectOption(groupKey, option.value)">
                    <span class="option-text">{{ option.label }}</span>
                    <span v-if="option.outOfStock" class="stock-badge">Hết hàng</span>
                    <span v-else-if="option.price" class="price-badge">{{ formatPrice(option.price) }}</span>
                </button>
            </div>
        </div>

        <!-- Thông tin phiên bản đã chọn -->
        <div v-if="selectedVariant" class="selected-variant-info">
            <div class="info-row">
                <span class="info-label">Phiên bản đã chọn:</span>
                <span class="info-value">{{ selectedVariant.summary }}</span>
            </div>
            <div v-if="selectedVariant.price" class="info-row price-row">
                <span class="info-label">Giá:</span>
                <span class="info-value price">
                    {{ formatPrice(selectedVariant.price) }}
                    <del v-if="selectedVariant.originalPrice && selectedVariant.originalPrice > selectedVariant.price"
                        class="original-price">
                        {{ formatPrice(selectedVariant.originalPrice) }}
                    </del>
                </span>
            </div>
            <div v-if="selectedVariant.stock !== undefined" class="info-row">
                <span class="info-label">Tồn kho:</span>
                <span :class="['info-value', selectedVariant.stock > 0 ? 'text-success' : 'text-danger']">
                    {{ selectedVariant.stock > 0 ? `${selectedVariant.stock} sản phẩm` : 'Hết hàng' }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    variants: {
        type: Array,
        required: true,
        // Format: [{ id, attributes: { ram: '16GB', storage: '512GB', color: 'Xám' }, price, originalPrice, stock, ... }]
    },
    modelValue: {
        type: [String, Number, Object],
        default: null,
    },
    // Danh sách thuộc tính cần hiển thị (theo thứ tự)
    attributeKeys: {
        type: Array,
        default: () => ['ram', 'storage', 'color'],
    },
    // Labels cho các thuộc tính
    attributeLabels: {
        type: Object,
        default: () => ({
            ram: 'RAM',
            storage: 'Ổ cứng',
            color: 'Màu sắc',
            cpu: 'CPU',
            gpu: 'GPU',
            screen: 'Màn hình',
        }),
    },
})

const emit = defineEmits(['update:modelValue', 'change'])

// State lưu lựa chọn hiện tại cho mỗi nhóm
const selections = ref({})

// Tạo nhóm thuộc tính từ variants
const attributeGroups = computed(() => {
    const groups = {}

    props.attributeKeys.forEach((key) => {
        const optionsSet = new Set()
        const optionsData = new Map()

        props.variants.forEach((variant) => {
            const value = variant.attributes?.[key]
            if (value) {
                optionsSet.add(value)

                // Lưu thông tin giá và stock cho mỗi option (dùng variant đầu tiên có option này)
                if (!optionsData.has(value)) {
                    optionsData.set(value, {
                        value,
                        label: value,
                        price: variant.price,
                        outOfStock: variant.stock <= 0,
                    })
                }
            }
        })

        if (optionsSet.size > 0) {
            groups[key] = {
                label: props.attributeLabels[key] || key,
                options: Array.from(optionsData.values()),
            }
        }
    })

    return groups
})

// Kiểm tra option có được chọn không
const isSelected = (groupKey, value) => {
    return selections.value[groupKey] === value
}

// Kiểm tra option có bị vô hiệu hóa không (không tương thích với selections hiện tại)
const isDisabled = (groupKey, value) => {
    // Tạm thời chọn option này
    const testSelections = { ...selections.value, [groupKey]: value }

    // Kiểm tra có variant nào match tất cả selections đã chọn không
    const hasMatchingVariant = props.variants.some((variant) => {
        return Object.entries(testSelections).every(([key, val]) => {
            return variant.attributes?.[key] === val
        })
    })

    return !hasMatchingVariant
}

// Chọn option
const selectOption = (groupKey, value) => {
    selections.value[groupKey] = value
    updateSelectedVariant()
}

// Tìm variant khớp với selections hiện tại
const selectedVariant = computed(() => {
    const variant = props.variants.find((v) => {
        return Object.entries(selections.value).every(([key, val]) => {
            return v.attributes?.[key] === val
        })
    })

    if (variant) {
        return {
            ...variant,
            summary: Object.values(variant.attributes || {}).filter(Boolean).join(' | '),
        }
    }

    return null
})

// Cập nhật modelValue khi selectedVariant thay đổi
const updateSelectedVariant = () => {
    const variant = selectedVariant.value
    emit('update:modelValue', variant?.id || null)
    emit('change', variant)
}

// Watch modelValue từ parent để sync selections
watch(
    () => props.modelValue,
    (newVal) => {
        if (!newVal) {
            selections.value = {}
            return
        }

        // Tìm variant theo ID
        const variant = props.variants.find((v) => v.id === newVal || v === newVal)
        if (variant?.attributes) {
            selections.value = { ...variant.attributes }
        }
    },
    { immediate: true }
)

// Tự động chọn variant đầu tiên nếu chưa có selection
watch(
    () => props.variants,
    (newVariants) => {
        if (newVariants.length > 0 && Object.keys(selections.value).length === 0) {
            const firstVariant = newVariants[0]
            if (firstVariant?.attributes) {
                selections.value = { ...firstVariant.attributes }
                updateSelectedVariant()
            }
        }
    },
    { immediate: true, deep: true }
)

// Format price
const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
    }).format(price)
}
</script>

<style scoped>
/* Design System Variables */
:root {
    --vs-primary: #000000;
    --vs-secondary: #86868b;
    --vs-accent: #0071e3;
    --vs-success: #34c759;
    --vs-error: #ff3b30;
    --vs-bg: #ffffff;
    --vs-bg-secondary: #f5f5f7;
    --vs-border: #d2d2d7;
    --vs-shadow: rgba(0, 0, 0, 0.08);
    --vs-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.variant-selector {
    width: 100%;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
}

.selector-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--vs-primary);
    letter-spacing: -0.01em;
}

.attribute-group {
    margin-bottom: 2rem;
}

.group-label {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--vs-secondary);
    margin-bottom: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.625rem;
}

/* Apple-style Chip Design */
.option-chip {
    position: relative;
    padding: 1rem 1.25rem;
    border: 1.5px solid var(--vs-border);
    border-radius: 12px;
    background: var(--vs-bg);
    cursor: pointer;
    transition: var(--vs-transition);
    text-align: center;
    font-size: 0.875rem;
    min-height: 64px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.375rem;
    box-shadow: 0 1px 3px var(--vs-shadow);
}

.option-chip:hover:not(:disabled) {
    border-color: var(--vs-accent);
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.15);
    transform: translateY(-2px) scale(1.02);
}

.option-chip.active {
    border-color: var(--vs-accent);
    background: var(--vs-accent);
    color: white;
    box-shadow: 0 4px 16px rgba(0, 113, 227, 0.3), 0 1px 3px rgba(0, 113, 227, 0.2);
    transform: translateY(-1px);
}

.option-chip.disabled {
    opacity: 0.35;
    cursor: not-allowed;
    background: var(--vs-bg-secondary);
    border-color: var(--vs-border);
    transform: none;
}

.option-chip.out-of-stock {
    opacity: 0.4;
    background: var(--vs-bg-secondary);
    cursor: not-allowed;
    position: relative;
}

.option-chip.out-of-stock::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 10%;
    right: 10%;
    height: 1.5px;
    background: var(--vs-error);
    transform: translateY(-50%) rotate(-12deg);
    opacity: 0.8;
}

.option-text {
    font-weight: 500;
    line-height: 1.4;
    letter-spacing: -0.01em;
}

.option-chip.active .option-text {
    color: white;
    font-weight: 600;
}

.stock-badge {
    position: absolute;
    top: 6px;
    right: 6px;
    font-size: 0.625rem;
    padding: 3px 6px;
    background: var(--vs-error);
    color: white;
    border-radius: 6px;
    font-weight: 600;
    letter-spacing: 0.02em;
}

.price-badge {
    font-size: 0.75rem;
    color: var(--vs-accent);
    font-weight: 600;
}

.option-chip.active .price-badge {
    color: rgba(255, 255, 255, 0.95);
}

/* Selected Variant Info - Premium Card */
.selected-variant-info {
    margin-top: 2rem;
    padding: 1.25rem 1.5rem;
    background: var(--vs-bg-secondary);
    border-radius: 16px;
    border: 1px solid var(--vs-border);
    box-shadow: 0 2px 8px var(--vs-shadow);
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-label {
    font-weight: 500;
    color: var(--vs-secondary);
    font-size: 0.875rem;
}

.info-value {
    font-weight: 600;
    color: var(--vs-primary);
    font-size: 0.9375rem;
}

.price-row .info-value {
    display: flex;
    align-items: center;
    gap: 0.625rem;
}

.price-row .price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--vs-primary);
    letter-spacing: -0.02em;
}

.original-price {
    font-size: 0.875rem;
    color: var(--vs-secondary);
    font-weight: 400;
    text-decoration: line-through;
}

.text-success {
    color: var(--vs-success) !important;
    font-weight: 600;
}

.text-danger {
    color: var(--vs-error) !important;
    font-weight: 600;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .options-grid {
        grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
        gap: 0.5rem;
    }

    .option-chip {
        padding: 0.875rem 1rem;
        font-size: 0.8125rem;
        min-height: 58px;
    }

    .selector-title {
        font-size: 1rem;
    }

    .selected-variant-info {
        padding: 1rem 1.25rem;
    }

    .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.375rem;
    }

    .price-row .price {
        font-size: 1.25rem;
    }
}

@media (max-width: 480px) {
    .options-grid {
        grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
    }

    .option-chip {
        padding: 0.75rem 0.875rem;
        min-height: 54px;
    }
}
</style>
