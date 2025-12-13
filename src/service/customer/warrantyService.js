import axios from 'axios'

const API_URL = 'http://localhost:8080/api/warranties'

export default {
  // Get customer's eligible warranties (serials from purchases)
  async getMyWarranties() {
    const token = localStorage.getItem('customer_token')
    const response = await axios.get(`${API_URL}/eligible-serials`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  },

  // Create warranty request
  async createWarrantyRequest(data) {
    const token = localStorage.getItem('customer_token')
    const response = await axios.post(`${API_URL}`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}
