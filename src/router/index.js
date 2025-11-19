import { createRouter, createWebHistory } from 'vue-router'
import CustomerLayout from '@/layout/CustomerLayout.vue'
import { useAuthStore } from '@/stores/customer/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: CustomerLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/views/customer/login/HomePage.vue'),
          meta: { title: 'Trang chủ - VietLapTop' },
        },
        {
          path: 'products',
          name: 'products',
          component: () => import('@/views/customer/product/ProductsPage.vue'),
          meta: { title: 'Danh sách sản phẩm - LaptopStore' },
        },
        {
          path: 'products/:id',
          name: 'product-detail',
          component: () => import('@/views/customer/product-detail/ProductDetailPage.vue'),
          meta: { title: 'Chi tiết sản phẩm - LaptopStore' },
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/customer/CartPage.vue'),
          meta: { title: 'Giỏ hàng - LaptopStore', requiresAuth: true },
        },
        {
          path: 'checkout',
          name: 'checkout',
          component: () => import('@/views/customer/CheckoutPage.vue'),
          meta: { title: 'Thanh toán - LaptopStore', requiresAuth: true },
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('@/views/customer/AboutPage.vue'),
          meta: { title: 'Về chúng tôi - LaptopStore' },
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('@/views/customer/ContactPage.vue'),
          meta: { title: 'Liên hệ - LaptopStore' },
        },
        {
          path: 'warranty-policy',
          name: 'warranty-policy',
          component: () => import('@/views/customer/WarrantyPolicyPage.vue'),
          meta: { title: 'Chính sách bảo hành - LaptopStore' },
        },
        {
          path: 'return-policy',
          name: 'return-policy',
          component: () => import('@/views/customer/ReturnPolicyPage.vue'),
          meta: { title: 'Chính sách đổi trả - LaptopStore' },
        },
        {
          path: 'khuyen-mai',
          alias: '/promotions',
          name: 'promotions',
          component: () => import('@/views/customer/promotions/PromotionsPage.vue'),
          meta: { title: 'Chương trình khuyến mãi - LaptopStore' },
        },
        {
          path: 'khuyen-mai/:id',
          alias: '/promotions/:id',
          name: 'promotion-detail',
          component: () => import('@/views/customer/promotions/PromotionDetailPage.vue'),
          meta: { title: 'Chi tiết khuyến mãi - LaptopStore' },
        },
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/customer/login/LoginPage.vue'),
          meta: { title: 'Đăng nhập - LaptopStore', hideForAuth: true },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/customer/login/RegisterPage.vue'),
          meta: { title: 'Đăng ký - LaptopStore', hideForAuth: true },
        },
        // Direct order routes (không cần vào account)
        {
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/customer/order/OrdersPage.vue'),
          meta: { title: 'Đơn hàng của tôi - LaptopStore', requiresAuth: true },
        },
        {
          path: 'orders/:id',
          name: 'order-detail',
          component: () => import('@/views/customer/order/OrderDetailPage.vue'),
          meta: { title: 'Chi tiết đơn hàng - LaptopStore', requiresAuth: true },
        },
        // Account routes
        {
          path: 'account',
          component: () => import('@/views/customer/account/AccountLayout.vue'),
          meta: { requiresAuth: true },
          children: [
            {
              path: '',
              redirect: '/account/profile',
            },
            {
              path: 'profile',
              name: 'account-profile',
              component: () => import('@/views/customer/account/ProfilePage.vue'),
              meta: { title: 'Thông tin tài khoản - LaptopStore' },
            },
            {
              path: 'orders',
              name: 'account-orders',
              component: () => import('@/views/customer/account/OrdersPage.vue'),
              meta: { title: 'Đơn hàng của tôi - LaptopStore' },
            },
            {
              path: 'orders/:id',
              name: 'account-order-detail',
              component: () => import('@/views/customer/account/OrderDetailPage.vue'),
              meta: { title: 'Chi tiết đơn hàng - LaptopStore' },
            },
            {
              path: 'addresses',
              name: 'account-addresses',
              component: () => import('@/views/customer/account/AddressesPage.vue'),
              meta: { title: 'Địa chỉ giao hàng - LaptopStore' },
            },
            {
              path: 'warranty',
              name: 'account-warranty',
              component: () => import('@/views/customer/account/WarrantyPage.vue'),
              meta: { title: 'Bảo hành của tôi - LaptopStore' },
            },
            {
              path: 'points',
              name: 'account-points',
              component: () => import('@/views/customer/account/PointsPage.vue'),
              meta: { title: 'Điểm tích lũy - LaptopStore' },
            },
          ],
        },
      ],
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  // Update document title
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Check authentication using authStore
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Redirect to login if route requires auth
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Redirect to home if already logged in and trying to access login/register
  if (to.meta.hideForAuth && isAuthenticated) {
    next({ name: 'home' })
    return
  }

  next()
})

export default router
