import axiosInstance from '../axiosInstance'

const API_BASE = '/api/chat'

/**
 * Service cho consultation flow với Gemini AI
 */
export const consultationService = {
    /**
     * Submit consultation data và nhận recommendations từ Gemini
     * @param {Object} consultationData - Dữ liệu consultation
     * @param {Array<string>} consultationData.purposes - Mục đích sử dụng
     * @param {number} consultationData.budget - Ngân sách (VNĐ)
     * @param {Array<string>} consultationData.features - Tính năng quan trọng
     * @param {string} consultationData.userMessage - Message từ user (optional)
     * @returns {Promise} Response với ChatbotResponse
     */
    async submitConsultation(consultationData) {
        try {
            const response = await axiosInstance.post(`${API_BASE}/consult`, consultationData)

            // Backend trả về ResponseObject { data, message, success }
            if (response.data && response.data.data !== undefined) {
                return response.data.data
            }
            return response.data
        } catch (error) {
            console.error('Error submitting consultation:', error)
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message)
            }
            throw error
        }
    },

    /**
     * Wrapper method - alias cho submitConsultation
     */
    async getRecommendations(consultationData) {
        return this.submitConsultation(consultationData)
    }
}

export default consultationService

