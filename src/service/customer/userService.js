import axios from 'axios'

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const userService = {
    getMyProfile: async () => {
        try {
            const token = localStorage.getItem('customer_token')
            const response = await axios.get(`${API_URL}/api/users/me`, {
                headers: {
                    Authorization: token
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    updateMyProfile: async (profileData) => {
        try {
            const token = localStorage.getItem('customer_token')
            const response = await axios.put(`${API_URL}/api/users/me/profile`, profileData, {
                headers: {
                    Authorization: token
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    },

    changePassword: async (passwordData) => {
        try {
            const token = localStorage.getItem('customer_token')
            const response = await axios.post(`${API_URL}/api/users/me/password`, passwordData, {
                headers: {
                    Authorization: token
                }
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
}

export default userService
