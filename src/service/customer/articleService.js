import axiosInstance from '@/service/axiosInstance'

const API_BASE = '/api/articles'

/**
 * Get articles/news
 * @param {number} limit - Maximum number of articles
 * @returns {Promise<Array>} Array of articles
 */
export async function getArticles(limit = 4) {
  try {
    console.log('🔄 [ArticleService] Fetching articles...')

    // Try dedicated articles API
    try {
      const response = await axiosInstance.get(API_BASE, {
        params: { limit },
      })
      
      const data = response.data?.data || response.data?.content || response.data
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ [ArticleService] Articles loaded:', data.length)
        return data
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.warn('⚠️ [ArticleService] Articles API not available, using fallback')
      }
    }

    // Fallback: Return empty array (will show reviews instead)
    console.warn('⚠️ [ArticleService] No articles API, returning empty array')
    return []
  } catch (error) {
    console.error('❌ [ArticleService] Error fetching articles:', error)
    return []
  }
}

export default {
  getArticles,
}

