<template>
    <div class="home-page">
        <!-- Hero Banner Slider -->
        <HeroSlider :banners="banners" />

        <!-- Featured Products Section -->
        <FeaturedProducts :products="featuredProducts" :loading="loadingProducts" :error="productsError"
            @add-to-cart="handleAddToCart" @retry="fetchFeaturedProducts" />

        <!-- Category Grid -->
        <CategoryGrid :categories="categories" />

        <!-- Promotion Banner -->
        <PromotionBanner :promotions="activePromotions" :loading="loadingPromotions" />

        <!-- Customer Reviews -->
        <TestimonialSlider :reviews="topReviews" :loading="loadingReviews" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import HeroSlider from '@/components/customer/home/HeroSlider.vue'
import FeaturedProducts from '@/components/customer/home/FeaturedProducts.vue'
import CategoryGrid from '@/components/customer/home/CategoryGrid.vue'
import PromotionBanner from '@/components/customer/home/PromotionBanner.vue'
import TestimonialSlider from '@/components/customer/home/TestimonialSlider.vue'
import { useHomeStore } from '@/stores/customer/homeStore'
import { useLayoutStore } from '@/stores/customer/layoutStore'

const router = useRouter()
const toast = useToast()
const homeStore = useHomeStore()
const layoutStore = useLayoutStore()

// State
const loadingProducts = ref(false)
const loadingPromotions = ref(false)
const loadingReviews = ref(false)
const productsError = ref(null)

// Data from store
const featuredProducts = ref([])
const activePromotions = ref([])
const topReviews = ref([])

// Hero banners data (static for now, can be fetched from backend later)
const banners = ref([
    {
        id: 1,
        title: 'Laptop Gaming Cao Cấp',
        description: 'Giảm đến 30% các dòng laptop gaming hàng đầu',
        buttonText: 'Mua ngay',
        link: '/products?category=gaming',
        image: '',
        bgColor: '#047857'
    },
    {
        id: 2,
        title: 'Laptop Văn Phòng Tiện Lợi',
        description: 'Năng suất cao, pin trâu, giá tốt nhất',
        buttonText: 'Khám phá',
        link: '/products?category=office',
        image: '',
        bgColor: '#059669'
    },
    {
        id: 3,
        title: 'MacBook Pro M3',
        description: 'Chip M3 mới nhất, hiệu năng đột phá',
        buttonText: 'Xem chi tiết',
        link: '/products?brand=apple',
        image: '',
        bgColor: '#10b981'
    }
])

// Categories data (static for now, can be fetched from backend later)
const categories = ref([
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
])

// Fetch featured products
const fetchFeaturedProducts = async () => {
    try {
        loadingProducts.value = true
        loadingPromotions.value = true
        loadingReviews.value = true
        productsError.value = null

        // TODO: Replace with real API call when backend is ready
        // await homeStore.fetchHomeData()

        // Mock data for testing UI
        setTimeout(() => {
            featuredProducts.value = [
                {
                    id: 1,
                    tenSanPham: 'Dell XPS 13 2024',
                    ten: 'Dell XPS 13',
                    gia: 25990000,
                    giaGoc: 29990000,
                    hinhAnh: '',
                    soSao: 4.5,
                    soLuongDanhGia: 128,
                    trangThai: 1,
                    soLuongTon: 15
                },
                {
                    id: 2,
                    tenSanPham: 'MacBook Air M3',
                    ten: 'MacBook Air M3',
                    gia: 32990000,
                    giaGoc: 35990000,
                    hinhAnh: '',
                    soSao: 5.0,
                    soLuongDanhGia: 256,
                    trangThai: 1,
                    soLuongTon: 8
                },
                {
                    id: 3,
                    tenSanPham: 'Asus ROG Strix G16',
                    ten: 'Asus ROG Strix',
                    gia: 35990000,
                    giaGoc: 42990000,
                    hinhAnh: '',
                    soSao: 4.8,
                    soLuongDanhGia: 89,
                    trangThai: 1,
                    soLuongTon: 5
                },
                {
                    id: 4,
                    tenSanPham: 'Lenovo ThinkPad X1 Carbon',
                    ten: 'Lenovo ThinkPad',
                    gia: 28990000,
                    hinhAnh: '',
                    soSao: 4.6,
                    soLuongDanhGia: 145,
                    trangThai: 1,
                    soLuongTon: 12
                }
            ]

            activePromotions.value = [
                {
                    id: 1,
                    name: 'Giảm giá Black Friday',
                    moTa: 'Giảm đến 40% cho các dòng laptop gaming cao cấp',
                    phanTramGiam: 40,
                    ngayKetThuc: '2025-11-30'
                },
                {
                    id: 2,
                    name: 'Khuyến mãi sinh viên',
                    moTa: 'Ưu đãi đặc biệt cho sinh viên với giảm giá 20%',
                    phanTramGiam: 20,
                    ngayKetThuc: '2025-12-15'
                }
            ]

            topReviews.value = [
                {
                    id: 1,
                    customerName: 'Nguyễn Văn An',
                    productName: 'Dell XPS 13',
                    noiDung: 'Laptop rất tốt, màn hình đẹp, pin trâu. Rất hài lòng với sản phẩm!',
                    rating: 5,
                    ngayDanhGia: '2025-10-25'
                },
                {
                    id: 2,
                    customerName: 'Trần Thị Bình',
                    productName: 'MacBook Air M3',
                    noiDung: 'Hiệu năng mạnh mẽ, thiết kế sang trọng. Đáng tiền!',
                    rating: 5,
                    ngayDanhGia: '2025-10-20'
                },
                {
                    id: 3,
                    customerName: 'Lê Minh Cường',
                    productName: 'Asus ROG Strix',
                    noiDung: 'Chơi game mượt mà, tản nhiệt tốt. Recommended!',
                    rating: 4,
                    ngayDanhGia: '2025-10-18'
                }
            ]

            loadingProducts.value = false
            loadingPromotions.value = false
            loadingReviews.value = false
        }, 500)

    } catch (error) {
        console.error('Error loading homepage data:', error)
        productsError.value = 'Không thể tải dữ liệu. Vui lòng thử lại.'
    } finally {
        loadingProducts.value = false
        loadingPromotions.value = false
        loadingReviews.value = false
    }
}

// Handle add to cart
const handleAddToCart = async (product) => {
    try {
        // Check if user is logged in
        if (!layoutStore.isAuthenticated) {
            toast.warning('Vui lòng đăng nhập để thêm vào giỏ hàng')
            router.push('/login')
            return
        }

        // TODO: Call cart API to add product
        // For now, just show success message and update cart count
        toast.success(`Đã thêm ${product.tenSanPham || product.ten} vào giỏ hàng`)

        // Update cart count (will be replaced with actual cart count from API)
        layoutStore.updateCartCount(layoutStore.cartItemCount + 1)

    } catch (error) {
        console.error('Error adding to cart:', error)
        toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
    }
}

// Lifecycle
onMounted(() => {
    fetchFeaturedProducts()
})
</script>

<style scoped>
.home-page {
    min-height: 100vh;
    background: #ffffff;
    overflow-x: hidden;
    width: 100%;
}
</style>
