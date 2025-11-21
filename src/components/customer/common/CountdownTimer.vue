<template>
    <div class="countdown-timer">
        <div v-if="timeLeft.days > 0" class="time-unit">
            <span class="time-value">{{ formatTime(timeLeft.days) }}</span>
            <span class="time-label">Ngày</span>
        </div>
        <div class="time-unit">
            <span class="time-value">{{ formatTime(timeLeft.hours) }}</span>
            <span class="time-label">Giờ</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
            <span class="time-value">{{ formatTime(timeLeft.minutes) }}</span>
            <span class="time-label">Phút</span>
        </div>
        <div class="time-separator">:</div>
        <div class="time-unit">
            <span class="time-value">{{ formatTime(timeLeft.seconds) }}</span>
            <span class="time-label">Giây</span>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
    endDate: {
        type: [String, Date],
        required: true,
    },
})

const now = ref(new Date())
let intervalId = null

// Parse end date
const endDateParsed = computed(() => {
    if (!props.endDate) return null
    const date = typeof props.endDate === 'string' ? new Date(props.endDate) : props.endDate
    return isNaN(date.getTime()) ? null : date
})

// Calculate time left
const timeLeft = computed(() => {
    if (!endDateParsed.value) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const diff = endDateParsed.value.getTime() - now.value.getTime()

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
})

// Check if expired
const isExpired = computed(() => {
    if (!endDateParsed.value) return true
    return now.value >= endDateParsed.value
})

// Format time value (add leading zero)
const formatTime = (value) => {
    return String(value).padStart(2, '0')
}

// Update time every second
const updateTime = () => {
    now.value = new Date()
}

// Watch for expiration
watch(isExpired, (expired) => {
    if (expired && intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
})

// Lifecycle
onMounted(() => {
    updateTime()
    intervalId = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
    }
})
</script>

<style scoped>
.countdown-timer {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.time-unit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
}

.time-value {
    font-size: 24px;
    font-weight: 700;
    color: #ef4444;
    background: #ffffff;
    padding: 8px 12px;
    border-radius: 8px;
    min-width: 50px;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time-label {
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.time-separator {
    font-size: 20px;
    font-weight: 700;
    color: #ef4444;
    margin: 0 4px;
    padding-top: 8px;
}

/* Responsive */
@media (max-width: 768px) {
    .time-value {
        font-size: 20px;
        padding: 6px 10px;
        min-width: 45px;
    }

    .time-label {
        font-size: 10px;
    }

    .time-separator {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .countdown-timer {
        gap: 4px;
    }

    .time-value {
        font-size: 18px;
        padding: 6px 8px;
        min-width: 40px;
    }

    .time-label {
        font-size: 9px;
    }

    .time-separator {
        font-size: 16px;
        margin: 0 2px;
    }
}
</style>

