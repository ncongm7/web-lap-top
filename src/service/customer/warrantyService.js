import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const warrantyService = {
  getMyWarranties: async () => {
    try {
      const token = localStorage.getItem('customer_token')
      
      if (!token) {
        throw new Error('Bạn cần đăng nhập để xem bảo hành')
      }
      
      const response = await axios.get(`${API_URL}/api/serial/my-warranties`, {
        headers: {
           Authorization: `Bearer ${token}`
          // Authorization: token // Token already has "Bearer-" prefix from backend
        }
      })
      return response.data
    } catch (error) {
      console.error('Warranty service error:', error)
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại')
      }
      throw error
    }
  }
}

export default warrantyService
