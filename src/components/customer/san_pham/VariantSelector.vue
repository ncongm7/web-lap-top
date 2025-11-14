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
.variant-selector {
    width: 100%;
}

.selector-title {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: #212529;
}

.attribute-group {
    margin-bottom: 1.5rem;
}

.group-label {
    font-weight: 600;
    font-size: 0.95rem;
    color: #495057;
    margin-bottom: 0.75rem;
}

.options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 0.75rem;
}

.option-chip {
    position: relative;
    padding: 0.75rem 1rem;
    border: 2px solid #dee2e6;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
    text-align: center;
    font-size: 0.9rem;
    min-height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
}

.option-chip:hover:not(:disabled) {
    border-color: #dc3545;
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.15);
    transform: translateY(-1px);
}

.option-chip.active {
    border-color: #dc3545;
    background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.option-chip.disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #f8f9fa;
}

.option-chip.out-of-stock {
    opacity: 0.5;
    background: #f8f9fa;
    cursor: not-allowed;
}

.option-chip.out-of-stock::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #dc3545;
    transform: translateY(-50%) rotate(-15deg);
}

.option-text {
    font-weight: 500;
    line-height: 1.3;
}

.option-chip.active .option-text {
    color: white;
}

.stock-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    font-size: 0.7rem;
    padding: 2px 6px;
    background: #dc3545;
    color: white;
    border-radius: 4px;
    font-weight: 600;
}

.price-badge {
    font-size: 0.8rem;
    color: #dc3545;
    font-weight: 600;
}

.option-chip.active .price-badge {
    color: rgba(255, 255, 255, 0.9);
}

/* Selected Variant Info */
.selected-variant-info {
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #dc3545;
}

.info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.info-row:last-child {
    margin-bottom: 0;
}

.info-label {
    font-weight: 600;
    color: #6c757d;
    font-size: 0.9rem;
}

.info-value {
    font-weight: 500;
    color: #212529;
    font-size: 0.95rem;
}

.price-row .info-value {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price-row .price {
    font-size: 1.25rem;
    font-weight: 700;
    color: #dc3545;
}

.original-price {
    font-size: 0.9rem;
    color: #6c757d;
    font-weight: 400;
}

.text-success {
    color: #28a745 !important;
}

.text-danger {
    color: #dc3545 !important;
}

/* Mobile Responsive */
@media (max-width: 576px) {
    .options-grid {
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 0.5rem;
    }

    .option-chip {
        padding: 0.6rem 0.75rem;
        font-size: 0.85rem;
        min-height: 55px;
    }

    .selector-title {
        font-size: 1.1rem;
    }

    .selected-variant-info {
        padding: 0.75rem;
    }

    .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
    }

    .price-row .price {
        font-size: 1.1rem;
    }
}
</style>
