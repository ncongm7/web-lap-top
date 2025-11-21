import axiosInstance from '@/service/axiosInstance'

const API_BASE = '/api/products'

/**
 * Search products with autocomplete
 * @param {string} keyword - Search keyword
 * @param {number} limit - Maximum number of results (default: 10)
 * @returns {Promise<Array>} Array of products
 */
export async function searchProducts(keyword, limit = 10) {
  try {
    if (!keyword || keyword.trim().length === 0) {
      return []
    }

    console.log('🔍 [SearchService] Searching products:', keyword)

    // Try the dedicated search endpoint first
    try {
      const response = await axiosInstance.get(`${API_BASE}/search`, {
        params: {
          q: keyword.trim(),
          limit: limit,
        },
      })

      // Extract data from response
      const data = response.data?.data || response.data?.content || response.data
      
      if (Array.isArray(data)) {
        console.log('✅ [SearchService] Found', data.length, 'products')
        return data
      }

      return []
    } catch (error) {
      // If search endpoint doesn't exist, fallback to products list with filter
      if (error.response?.status === 404) {
        console.warn('⚠️ [SearchService] Search endpoint not found, using fallback')
        
        try {
          const fallbackResponse = await axiosInstance.get(`${API_BASE}/page`, {
            params: {
              page: 0,
              size: limit,
              search: keyword.trim(),
            },
          })

          const content = fallbackResponse.data?.content || fallbackResponse.data?.data || []
          console.log('✅ [SearchService] Fallback found', content.length, 'products')
          return content
        } catch (fallbackError) {
          console.error('❌ [SearchService] Fallback also failed:', fallbackError)
          return []
        }
      }

      throw error
    }
  } catch (error) {
    console.error('❌ [SearchService] Error searching products:', error)
    return []
  }
}

export default {
  searchProducts,
}

