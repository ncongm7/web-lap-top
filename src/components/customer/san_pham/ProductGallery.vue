<template>
    <div class="product-gallery">
        <!-- Main Image với Zoom on Hover -->
        <div class="main-image-wrapper" @mousemove="handleMouseMove" @mouseleave="hideZoom">
            <img 
                :src="currentImage" 
                :alt="productName" 
                class="main-image" 
                @click="openLightbox" 
                ref="mainImageRef"
                loading="eager"
                :data-src="currentImage"
            />

            <!-- Zoom Overlay (hiển thị khi hover) -->
            <div v-if="showZoom" class="zoom-overlay" :style="zoomStyle">
                <img :src="currentImage" :alt="productName" :style="zoomedImageStyle" />
            </div>

            <!-- Click để xem full -->
            <div class="click-to-zoom-hint">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path
                        d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                </svg>
                <span>Click để phóng to</span>
            </div>
        </div>

        <!-- Thumbnails -->
        <div class="thumbnails-wrapper">
            <button v-for="(img, index) in images" :key="index"
                :class="['thumbnail', { active: currentIndex === index }]" @click="selectImage(index)">
                <img 
                    :src="img.url" 
                    :alt="`Ảnh ${index + 1}`" 
                    loading="lazy"
                    :data-src="img.url"
                />
            </button>
        </div>

        <!-- Lightbox -->
        <teleport to="body">
            <div v-if="lightboxOpen" class="lightbox-overlay" @click="closeLightbox">
                <div class="lightbox-content" @click.stop>
                    <!-- Close Button -->
                    <button class="lightbox-close" @click="closeLightbox">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path
                                d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" />
                        </svg>
                    </button>

                    <!-- Previous Button -->
                    <button v-if="images.length > 1" class="lightbox-nav lightbox-prev" @click="prevImage">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                        </svg>
                    </button>

                    <!-- Main Lightbox Image -->
                    <img :src="currentImage" :alt="productName" class="lightbox-image" />

                    <!-- Next Button -->
                    <button v-if="images.length > 1" class="lightbox-nav lightbox-next" @click="nextImage">
                        <svg width="32" height="32" fill="currentColor" viewBox="0 0 16 16">
                            <path fill-rule="evenodd"
                                d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </button>

                    <!-- Image Counter -->
                    <div class="lightbox-counter">{{ currentIndex + 1 }} / {{ images.length }}</div>

                    <!-- Thumbnail Strip in Lightbox -->
                    <div class="lightbox-thumbnails">
                        <button v-for="(img, index) in images" :key="index"
                            :class="['lightbox-thumbnail', { active: currentIndex === index }]"
                            @click="selectImage(index)">
                            <img :src="img.url" :alt="`Ảnh ${index + 1}`" />
                        </button>
                    </div>
                </div>
            </div>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
    images: {
        type: Array,
        required: true,
        // Format: [{ url: '...', alt: '...' }, ...]
    },
    productName: {
        type: String,
        default: 'Sản phẩm',
    },
})

// State
const currentIndex = ref(0)
const lightboxOpen = ref(false)
const showZoom = ref(false)
const mouseX = ref(0)
const mouseY = ref(0)
const mainImageRef = ref(null)

// Current image URL
const currentImage = computed(() => {
    return props.images[currentIndex.value]?.url || ''
})

// Select image
const selectImage = (index) => {
    currentIndex.value = index
}

// Lightbox controls
const openLightbox = () => {
    lightboxOpen.value = true
    document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
    lightboxOpen.value = false
    document.body.style.overflow = ''
}

const prevImage = () => {
    currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : props.images.length - 1
}

const nextImage = () => {
    currentIndex.value = currentIndex.value < props.images.length - 1 ? currentIndex.value + 1 : 0
}

// Keyboard navigation
const handleKeydown = (e) => {
    if (!lightboxOpen.value) return
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') prevImage()
    if (e.key === 'ArrowRight') nextImage()
}

watch(lightboxOpen, (isOpen) => {
    if (isOpen) {
        window.addEventListener('keydown', handleKeydown)
    } else {
        window.removeEventListener('keydown', handleKeydown)
    }
})

// Zoom on hover
const handleMouseMove = (e) => {
    if (!mainImageRef.value) return

    const rect = mainImageRef.value.getBoundingClientRect()
    mouseX.value = ((e.clientX - rect.left) / rect.width) * 100
    mouseY.value = ((e.clientY - rect.top) / rect.height) * 100
    showZoom.value = true
}

const hideZoom = () => {
    showZoom.value = false
}

const zoomStyle = computed(() => ({
    left: `${mouseX.value}%`,
    top: `${mouseY.value}%`,
}))

const zoomedImageStyle = computed(() => ({
    transformOrigin: `${mouseX.value}% ${mouseY.value}%`,
}))

// Reset index when images change
watch(() => props.images, () => {
    currentIndex.value = 0
}, { deep: true })
</script>

<style scoped>
.product-gallery {
    width: 100%;
}

.main-image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1;
    background: #f5f5f7;
    border-radius: 16px;
    overflow: hidden;
    cursor: zoom-in;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-image-wrapper:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-image-wrapper:hover .main-image {
    opacity: 0.95;
    transform: scale(1.02);
}

/* Zoom Overlay */
.zoom-overlay {
    position: absolute;
    width: 200px;
    height: 200px;
    border: 2px solid #fff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: #fff;
    overflow: hidden;
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 10;
    border-radius: 4px;
}

.zoom-overlay img {
    width: 400%;
    height: 400%;
    object-fit: contain;
    transform: scale(1.5);
}

/* Click Hint */
.click-to-zoom-hint {
    position: absolute;
    bottom: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 4px;
    font-size: 13px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s;
}

.main-image-wrapper:hover .click-to-zoom-hint {
    opacity: 1;
}

/* Thumbnails - Apple Style */
.thumbnails-wrapper {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 6px 0;
    scrollbar-width: thin;
    scrollbar-color: #d2d2d7 transparent;
}

.thumbnails-wrapper::-webkit-scrollbar {
    height: 6px;
}

.thumbnails-wrapper::-webkit-scrollbar-track {
    background: transparent;
}

.thumbnails-wrapper::-webkit-scrollbar-thumb {
    background: #d2d2d7;
    border-radius: 3px;
}

.thumbnail {
    flex-shrink: 0;
    width: 84px;
    height: 84px;
    border: 2px solid #d2d2d7;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: #f5f5f7;
    padding: 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.thumbnail:hover {
    border-color: #0071e3;
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(0, 113, 227, 0.15);
}

.thumbnail.active {
    border-color: #0071e3;
    box-shadow: 0 4px 12px rgba(0, 113, 227, 0.3), 0 1px 4px rgba(0, 113, 227, 0.2);
    transform: scale(1.03);
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Lightbox - Premium with Backdrop Blur */
.lightbox-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
    from {
        opacity: 0;
        backdrop-filter: blur(0px);
    }

    to {
        opacity: 1;
        backdrop-filter: blur(20px);
    }
}

.lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes scaleIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

.lightbox-image {
    max-width: 100%;
    max-height: calc(90vh - 120px);
    object-fit: contain;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6), 0 8px 24px rgba(0, 0, 0, 0.4);
}

.lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    border: none;
    color: white;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: rotate(90deg) scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    border: none;
    color: white;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}

.lightbox-prev {
    left: -70px;
}

.lightbox-next {
    right: -70px;
}

.lightbox-counter {
    position: absolute;
    top: -50px;
    left: 0;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 10px 18px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    border-radius: 980px;
    letter-spacing: 0.01em;
}

.lightbox-thumbnails {
    display: flex;
    gap: 10px;
    margin-top: 24px;
    max-width: 90vw;
    overflow-x: auto;
    padding: 6px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.lightbox-thumbnails::-webkit-scrollbar {
    height: 6px;
}

.lightbox-thumbnails::-webkit-scrollbar-track {
    background: transparent;
}

.lightbox-thumbnails::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
}

.lightbox-thumbnail {
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(10px);
    padding: 0;
}

.lightbox-thumbnail:hover {
    border-color: rgba(255, 255, 255, 0.5);
    transform: scale(1.08);
}

.lightbox-thumbnail.active {
    border-color: #0071e3;
    box-shadow: 0 0 16px rgba(0, 113, 227, 0.6), 0 0 4px rgba(0, 113, 227, 0.4);
    transform: scale(1.05);
}

.lightbox-thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* Mobile Responsive */
@media (max-width: 768px) {
    .zoom-overlay {
        display: none;
    }

    .lightbox-nav {
        width: 40px;
        height: 40px;
    }

    .lightbox-prev {
        left: 10px;
    }

    .lightbox-next {
        right: 10px;
    }

    .lightbox-counter,
    .lightbox-close {
        top: 10px;
    }

    .thumbnail {
        width: 60px;
        height: 60px;
    }
}
</style>
