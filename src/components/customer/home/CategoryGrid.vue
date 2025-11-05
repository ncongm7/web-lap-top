<template>
    <section class="category-grid">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Danh mục sản phẩm</h2>
                <p class="section-desc">Tìm laptop phù hợp với nhu cầu của bạn</p>
            </div>

            <div class="categories-grid">
                <router-link v-for="category in categories" :key="category.id" :to="category.link" class="category-card"
                    :style="{ backgroundColor: category.bgColor }">
                    <div class="category-icon">{{ category.icon }}</div>
                    <div class="category-info">
                        <h3 class="category-name">{{ category.name }}</h3>
                        <p class="category-count">{{ category.count }} sản phẩm</p>
                    </div>
                    <div class="category-arrow">→</div>
                </router-link>
            </div>
        </div>
    </section>
</template>

<script setup>
defineProps({
    categories: {
        type: Array,
        default: () => [
            {
                id: 1,
                name: 'Laptop Gaming',
                icon: '🎮',
                count: 150,
                link: '/products?category=gaming',
                bgColor: '#dbeafe'
            },
            {
                id: 2,
                name: 'Laptop Văn Phòng',
                icon: '💼',
                count: 230,
                link: '/products?category=office',
                bgColor: '#dcfce7'
            },
            {
                id: 3,
                name: 'Laptop Đồ Họa',
                icon: '🎨',
                count: 85,
                link: '/products?category=graphics',
                bgColor: '#fef3c7'
            },
            {
                id: 4,
                name: 'Laptop Sinh Viên',
                icon: '🎓',
                count: 180,
                link: '/products?category=student',
                bgColor: '#fce7f3'
            },
            {
                id: 5,
                name: 'Laptop Mỏng Nhẹ',
                icon: '✨',
                count: 120,
                link: '/products?category=ultrabook',
                bgColor: '#e0e7ff'
            },
            {
                id: 6,
                name: 'Laptop Cao Cấp',
                icon: '⭐',
                count: 95,
                link: '/products?category=premium',
                bgColor: '#fae8ff'
            }
        ]
    }
})
</script>

<style scoped>
.category-grid {
    padding: 60px 0;
    background: #ffffff;
    overflow: hidden;
    width: 100%;
}

.container {
    max-width: 100%;
    margin: 0 auto;
    padding: 0 clamp(16px, 3vw, 60px);
    width: 100%;
    box-sizing: border-box;
}

.section-header {
    text-align: center;
    margin-bottom: clamp(32px, 4vw, 60px);
}

.section-title {
    font-size: clamp(28px, 2.5vw, 42px);
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
}

.section-desc {
    font-size: 16px;
    color: #64748b;
    margin: 0;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 24px;
}

.category-card {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 24px;
    border-radius: 12px;
    text-decoration: none;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.category-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #10b981;
}

.category-icon {
    font-size: 48px;
    flex-shrink: 0;
}

.category-info {
    flex: 1;
}

.category-name {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.category-count {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.category-arrow {
    font-size: 24px;
    color: #10b981;
    flex-shrink: 0;
    transition: transform 0.3s;
}

.category-card:hover .category-arrow {
    transform: translateX(4px);
}

@media (min-width: 1441px) {
    .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: clamp(24px, 2vw, 40px);
    }
}

@media (max-width: 1440px) and (min-width: 1025px) {
    .categories-grid {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 24px;
    }
}

@media (max-width: 1024px) {
    .categories-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
}

@media (max-width: 768px) {
    .category-grid {
        padding: 40px 0;
    }

    .section-title {
        font-size: 28px;
    }

    .categories-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }

    .category-card {
        padding: 20px;
    }

    .category-icon {
        font-size: 40px;
    }

    .category-name {
        font-size: 18px;
    }
}
</style>
