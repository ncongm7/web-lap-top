<template>
  <div class="home-page">
    <!-- Hero Banner Slider -->
    <HeroSlider :banners="banners" />

    <!-- Featured Products Section -->
    <FeaturedProducts
      :products="featuredProducts"
      :loading="loadingProducts"
      :error="productsError"
      @add-to-cart="handleAddToCart"
      @retry="fetchFeaturedProducts"
    />

    <!-- Category List -->
    <CategoryList />

    <!-- Promotion Banner -->
    <PromotionBanner :promotions="activePromotions" :loading="loadingPromotions" />

    <!-- Customer Reviews -->
    <TestimonialSlider :reviews="topReviews" :loading="loadingReviews" />

    <!-- Login/Register Modal -->
    <LoginRegisterModal
      :show="showLoginModal"
      @close="showLoginModal = false"
      @success="handleLoginSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import HeroSlider from '@/components/customer/home/HeroSlider.vue'
import FeaturedProducts from '@/components/customer/home/FeaturedProducts.vue'
import CategoryList from '@/components/customer/home/CategoryList.vue'
import PromotionBanner from '@/components/customer/home/PromotionBanner.vue'
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
const loadingProducts = ref(false)
const loadingPromotions = ref(false)
const loadingReviews = ref(false)
const productsError = ref(null)
const showLoginModal = ref(false)
const pendingProduct = ref(null) // Lưu sản phẩm đang chờ thêm vào giỏ

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

// Fetch featured products
const fetchFeaturedProducts = async () => {
  try {
    loadingProducts.value = true
    loadingPromotions.value = true
    loadingReviews.value = true
    productsError.value = null

    // Lấy sản phẩm thật từ API
    console.log('🔄 [HomePage] Fetching products from API...')
    const { getFeaturedProducts } = await import('@/service/customer/homeService')
    const products = await getFeaturedProducts()

    console.log('📦 [HomePage] Raw products from API:', products)
    console.log('📊 [HomePage] First product sample:', products[0])

    // Lấy tối đa 8 sản phẩm để hiển thị
    featuredProducts.value = products.slice(0, 8)

    console.log('✅ [HomePage] Loaded featured products:', featuredProducts.value.length)
    console.log(
      '🔍 [HomePage] Featured products IDs:',
      featuredProducts.value.map((p) => ({ id: p.id, name: p.tenSanPham })),
    )

    // Lấy promotions từ API
    console.log('🔄 [HomePage] Fetching promotions from API...')
    const { getCampaigns } = await import('@/service/customer/promotionService')
    const promotionsData = await getCampaigns('active', 0, 10)
    activePromotions.value = promotionsData.campaigns || []
    console.log('✅ [HomePage] Loaded promotions:', activePromotions.value.length)

    // Cập nhật banners từ promotions (lấy 3 campaigns đầu tiên)
    if (activePromotions.value.length > 0) {
      banners.value = activePromotions.value.slice(0, 3).map((campaign) => ({
        id: campaign.id,
        tenKm: campaign.tenKm,
        moTa: campaign.moTa,
        bannerImageUrl: campaign.bannerImageUrl,
        link: `/khuyen-mai/${campaign.id}`,
        buttonText: 'Xem ngay',
        bgColor: '#047857',
      }))
    }

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

    loadingProducts.value = false
    loadingPromotions.value = false
    loadingReviews.value = false
  } catch (error) {
    console.error('Error loading homepage data:', error)
    productsError.value = 'Không thể tải dữ liệu. Vui lòng thử lại.'
    loadingProducts.value = false
    loadingPromotions.value = false
    loadingReviews.value = false
  }
}

// Test function để debug API
const testFeaturedProductsAPI = async () => {
  try {
    console.log('🧪 Testing featured products API directly...')
    const { getFeaturedProducts } = await import('@/service/customer/homeService')
    const products = await getFeaturedProducts() // Lấy tất cả sản phẩm
    console.log('🧪 Direct API test result:', products)
    console.log('🧪 Products count:', products.length)
    return products
  } catch (error) {
    console.error('🧪 Direct API test failed:', error)
    return []
  }
}

// Expose test function to window
if (typeof window !== 'undefined') {
  window.testFeaturedProductsAPI = testFeaturedProductsAPI
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
