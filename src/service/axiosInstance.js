import axios from 'axios'

// Tạo axios instance với base URL
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Tự động thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('customer_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Xử lý lỗi chung
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Xử lý lỗi 401 - Unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('customer_token')
      localStorage.removeItem('customer_user')
      window.location.href = '/auth/login'
    }

    // Xử lý lỗi 403 - Forbidden
    if (error.response && error.response.status === 403) {
      console.error('❌ Access denied')
    }

    // Xử lý lỗi 500 - Server Error
    if (error.response && error.response.status === 500) {
      console.error('❌ Server error:', error.response.data)
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
