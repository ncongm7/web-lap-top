import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import authService from '@/service/customer/authService'
import { useLayoutStore } from './layoutStore'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const token = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Computed
  const isAuthenticated = computed(() => {
    return !!(token.value && user.value)
  })

  const customerId = computed(() => {
    return user.value?.userId || null
  })

  // Actions
  /**
   * Khởi tạo auth state từ localStorage
   */
  const initialize = () => {
    try {
      const storedToken = localStorage.getItem('customer_token')
      const storedUser = localStorage.getItem('customer_user')
      const layoutStore = useLayoutStore()

      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        // Sync layout store
        layoutStore.setUser(user.value, token.value)
      } else {
        // Clear layout store if no auth data
        layoutStore.logout()
      }
    } catch (err) {
      console.error('Error initializing auth store:', err)
      // Clear invalid data
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      localStorage.removeItem('customer_id')

      const layoutStore = useLayoutStore()
      layoutStore.logout()
    }
  }

  /**
   * Đăng nhập
   */
  const login = async (credentials) => {
    loading.value = true
    error.value = null
    const layoutStore = useLayoutStore()

    try {
      const response = await authService.login(credentials)

      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data

        // Lưu vào localStorage
        localStorage.setItem('customer_token', authToken)
        localStorage.setItem('customer_user', JSON.stringify(userData))
        if (userData.userId) {
          localStorage.setItem('customer_id', userData.userId)
        }

        // Cập nhật state
        token.value = authToken
        user.value = userData

        // Sync layout store
        layoutStore.setUser(userData, authToken)

        return { success: true, message: response.message || 'Đăng nhập thành công', data: response.data }
      } else {
        throw new Error(response.message || 'Đăng nhập thất bại')
      }
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.response?.data?.message || err.message || 'Đăng nhập thất bại'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Đăng ký
   */
  const register = async (registerData) => {
    loading.value = true
    error.value = null
    const layoutStore = useLayoutStore()

    try {
      const response = await authService.register(registerData)

      if (response.success) {
        // Auto-login if token is returned
        if (response.data && response.data.token && response.data.user) {
          const { token: authToken, user: userData } = response.data

          // Save to localStorage
          localStorage.setItem('customer_token', authToken)
          localStorage.setItem('customer_user', JSON.stringify(userData))
          if (userData.userId) {
            localStorage.setItem('customer_id', userData.userId)
          }

          // Update state
          token.value = authToken
          user.value = userData

          // Sync layout store
          layoutStore.setUser(userData, authToken)

          return { success: true, message: response.message || 'Đăng ký thành công', data: response.data }
        }

        return { success: true, message: response.message || 'Đăng ký thành công. Vui lòng đăng nhập.' }
      } else {
        throw new Error(response.message || 'Đăng ký thất bại')
      }
    } catch (err) {
      console.error('Register error:', err)
      error.value = err.response?.data?.message || err.message || 'Đăng ký thất bại'
      return { success: false, message: error.value }
    } finally {
      loading.value = false
    }
  }

  /**
   * Đăng xuất
   */
  const logout = async () => {
    loading.value = true
    error.value = null
    const layoutStore = useLayoutStore()

    try {
      await authService.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear state regardless of API call result
      token.value = null
      user.value = null

      // Sync layout store
      layoutStore.logout()

      loading.value = false
    }
  }

  /**
   * Lấy thông tin user hiện tại
   */
  const getCurrentUser = () => {
    if (!user.value) {
      user.value = authService.getCurrentUser()
    }
    return user.value
  }

  /**
   * Lấy customer ID
   */
  const getCustomerId = () => {
    if (customerId.value) {
      return customerId.value
    }
    return authService.getCustomerId()
  }

  return {
    // State
    user,
    token,
    loading,
    error,

    // Computed
    isAuthenticated,
    customerId,

    // Actions
    initialize,
    login,
    register,
    logout,
    getCurrentUser,
    getCustomerId,
  }
})
