import axios from 'axios'

const API_URL = 'http://localhost:8080/api/chat'

export const chatService = {
  // Gửi tin nhắn mới
  sendMessage: async (data) => {
    const res = await axios.post(`${API_URL}/send`, data)
    return res.data
  },

  // Lấy danh sách tin nhắn trong conversation
  getMessages: async (conversationId) => {
    const res = await axios.get(`${API_URL}/conversation/${conversationId}/messages`)
    return res.data
  },

  // Lấy danh sách conversation của khách hàng
  getCustomerConversations: async (khachHangId) => {
    const res = await axios.get(`${API_URL}/customer/${khachHangId}/conversations`)
    return res.data
  },

  // Đánh dấu đã đọc
  markAsRead: async (conversationId, isFromCustomer) => {
    const res = await axios.put(`${API_URL}/conversation/${conversationId}/read`, null, {
      params: { isFromCustomer }
    })
    return res.data
  },

  // Đếm số tin nhắn chưa đọc của khách hàng
  getUnreadCount: async (khachHangId) => {
    const res = await axios.get(`${API_URL}/customer/${khachHangId}/unread-count`)
    return res.data
  },

  // Tìm hoặc tạo conversation
  findOrCreateConversation: async (khachHangId, nhanVienId = null) => {
    const res = await axios.get(`${API_URL}/find-conversation`, {
      params: { khachHangId, nhanVienId }
    })
    return res.data
  },

  // Manual escalation: Switch to human support
  async escalateToHuman(conversationId) {
    const response = await axios.post(
      `${API_URL}/conversation/${conversationId}/escalate-to-human`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('customer_token')}`
        }
      }
    )
    return response.data
  },

  // Return to AI bot
  async returnToBot(conversationId) {
    const response = await axios.post(
      `${API_URL}/conversation/${conversationId}/return-to-bot`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('customer_token')}`
        }
      }
    )
    return response.data
  },

  // Get escalation status
  async getEscalationStatus(conversationId) {
    const response = await axios.get(
      `${API_URL}/conversation/${conversationId}/escalation-status`
    )
    return response.data?.data || {}
  },

  // Upload file
  async uploadFile(formData) {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  }
}
