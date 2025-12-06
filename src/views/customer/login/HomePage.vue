<template>
  <div class="home-page">
    <!-- Hero Banner Slider -->
    <HeroSlider :banners="banners" :auto-fetch="true" />


    <!-- Flash Sale -->
    <FlashSale @add-to-cart="handleAddToCart" />

    <!-- Best-Selling Products Carousel -->
    <BestSellingCarousel @add-to-cart="handleAddToCart" />

    <!-- New Arrivals Carousel -->
    <NewArrivalsCarousel @add-to-cart="handleAddToCart" />

    <!-- News & Reviews Section -->
    <NewsReviewsSection />

    <!-- Customer Reviews (Keep existing) -->
    <TestimonialSlider :reviews="topReviews" :loading="loadingReviews" />

    <!-- Login/Register Modal -->
    <LoginRegisterModal :show="showLoginModal" @close="showLoginModal = false" @success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import HeroSlider from '@/components/customer/home/HeroSlider.vue'
import FlashSale from '@/components/customer/home/FlashSale.vue'
import BestSellingCarousel from '@/components/customer/home/BestSellingCarousel.vue'
import NewArrivalsCarousel from '@/components/customer/home/NewArrivalsCarousel.vue'
import NewsReviewsSection from '@/components/customer/home/NewsReviewsSection.vue'
import TestimonialSlider from '@/components/customer/home/TestimonialSlider.vue'
import LoginRegisterModal from '@/components/customer/auth/LoginRegisterModal.vue'
import { useLayoutStore } from '@/stores/customer/layoutStore'
import { useCartStore } from '@/stores/customer/cartStore'
import authService from '@/service/customer/authService'

const router = useRouter()
const toast = useToast()
const layoutStore = useLayoutStore()
const cartStore = useCartStore()

// State
const loadingReviews = ref(false)
const showLoginModal = ref(false)
const pendingProduct = ref(null) // Lưu sản phẩm đang chờ thêm vào giỏ

// Data from store
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
    bgColor: '#047857',
  },
  {
    id: 2,
    title: 'Laptop Văn Phòng Tiện Lợi',
    description: 'Năng suất cao, pin trâu, giá tốt nhất',
    buttonText: 'Khám phá',
    link: '/products?category=office',
    image: '',
    bgColor: '#059669',
  },
  {
    id: 3,
    title: 'MacBook Pro M3',
    description: 'Chip M3 mới nhất, hiệu năng đột phá',
    buttonText: 'Xem chi tiết',
    link: '/products?brand=apple',
    image: '',
    bgColor: '#10b981',
  },
])

// Load reviews
const loadReviews = async () => {
  try {
    loadingReviews.value = true
    // Mock data for reviews (sẽ thay bằng API sau)
    topReviews.value = [
      {
        id: 1,
        customerName: 'Nguyễn Văn An',
        productName: 'Dell XPS 13',
        noiDung: 'Laptop rất tốt, màn hình đẹp, pin trâu. Rất hài lòng với sản phẩm!',
        rating: 5,
        ngayDanhGia: '2025-10-25',
      },
      {
        id: 2,
        customerName: 'Trần Thị Bình',
        productName: 'MacBook Air M3',
        noiDung: 'Hiệu năng mạnh mẽ, thiết kế sang trọng. Đáng tiền!',
        rating: 5,
        ngayDanhGia: '2025-10-20',
      },
      {
        id: 3,
        customerName: 'Lê Minh Cường',
        productName: 'Asus ROG Strix',
        noiDung: 'Chơi game mượt mà, tản nhiệt tốt. Recommended!',
        rating: 4,
        ngayDanhGia: '2025-10-18',
      },
    ]
    loadingReviews.value = false
  } catch (error) {
    console.error('Error loading reviews:', error)
    loadingReviews.value = false
  }
}

// Handle add to cart
const handleAddToCart = async (product) => {
  try {
    // Check if user is logged in
    if (!authService.isAuthenticated()) {
      // Lưu sản phẩm để thêm sau khi đăng nhập
      pendingProduct.value = product
      showLoginModal.value = true
      toast.info('Vui lòng đăng nhập để tiếp tục')
      return
    }

    // Thêm vào giỏ hàng
    await addProductToCart(product)
  } catch (error) {
    console.error('Error adding to cart:', error)
    toast.error('Không thể thêm vào giỏ hàng. Vui lòng thử lại.')
  }
}

// Thêm sản phẩm vào giỏ hàng
const addProductToCart = async (product) => {
  try {
    // TODO: Cần lấy ctspId từ product, hiện tại dùng product.id tạm
    const ctspId = product.idCTSP || product.id

    const result = await cartStore.addToCart(ctspId, 1)

    if (result.success) {
      toast.success(`Đã thêm ${product.tenSanPham || product.ten} vào giỏ hàng`)
    } else {
      toast.error(result.message || 'Không thể thêm sản phẩm vào giỏ hàng')
    }
  } catch (error) {
    console.error('Error adding product to cart:', error)
    toast.error('Lỗi khi thêm sản phẩm vào giỏ hàng')
  }
}

// Handle đăng nhập thành công
const handleLoginSuccess = async (authData) => {
  console.log('Login successful:', authData)

  // Cập nhật layoutStore
  if (authData && authData.user && authData.token) {
    layoutStore.setUser(authData.user, authData.token)
  }

  toast.success('Đăng nhập thành công!')

  // Nếu có sản phẩm đang chờ, thêm vào giỏ hàng
  if (pendingProduct.value) {
    await addProductToCart(pendingProduct.value)
    pendingProduct.value = null
  }

  // Refresh giỏ hàng
  await cartStore.fetchCart()

  // Chuyển đến trang giỏ hàng
  router.push('/cart')
}

// Lifecycle
onMounted(() => {
  loadReviews()
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
