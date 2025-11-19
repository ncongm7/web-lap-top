import axiosInstance from '../axiosInstance'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const customerService = {
    /**
     * Lấy thông tin profile đầy đủ của khách hàng
     */
    getCustomerProfile: async (khachHangId) => {
        try {
            const response = await axiosInstance.get(`${API_URL}/api/customer/profile`, {
                params: { khachHangId }
            })
            return response.data
        } catch (error) {
            console.error('Error fetching customer profile:', error)
            throw error
        }
    }
}

export default customerService

