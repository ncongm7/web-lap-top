import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const authService = {
  /**
   * Đăng nhập
   */
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        tenDangNhap: credentials.tenDangNhap,
        matKhau: credentials.matKhau
      })
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  /**
   * Đăng ký tài khoản khách hàng
   */
  register: async (registerData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, registerData)
      return response.data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  },

  /**
   * Đăng xuất
   */
  logout: async () => {
    try {
      const token = localStorage.getItem('customer_token')
      if (token) {
        await axios.post(`${API_URL}/api/auth/logout`, null, {
          headers: {
            'Authorization': token
          }
        })
      }
      // Clear localStorage
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      localStorage.removeItem('customer_id')
    } catch (error) {
      console.error('Logout error:', error)
      // Still clear localStorage even if API call fails
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      localStorage.removeItem('customer_id')
    }
  },

  /**
   * Kiểm tra xem user đã đăng nhập chưa
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('customer_token')
    const user = localStorage.getItem('customer_user')
    return !!(token && user)
  },

  /**
   * Lấy thông tin user hiện tại
   */
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('customer_user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  },

  /**
   * Lấy customer ID
   */
  getCustomerId: () => {
    const user = authService.getCurrentUser()
    return user?.userId || localStorage.getItem('customer_id')
  }
}

export default authService

