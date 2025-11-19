import { ref } from 'vue'
import { useAppStore } from '@/stores/useAppStore'


export function useApi() {
  const appStore = useAppStore()
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Make an API request
   * @param {string} endpoint - API endpoint (e.g., '/top-topics')
   * @param {object} options - Fetch options
   * @returns {Promise<any>} - API response data
   */
  async function request(endpoint, options = {}) {
    isLoading.value = true
    error.value = null

    try {
      const url = `${appStore.apiBaseUrl}${endpoint}`

      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      }

      const response = await fetch(url, { ...defaultOptions, ...options })

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      error.value = err.message
      console.error('API Error:', err)

      appStore.addNotification({
        type: 'error',
        title: 'API Error',
        message: err.message,
        autoRemove: true
      })

      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * GET request
   */
  async function get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = queryString ? `${endpoint}?${queryString}` : endpoint
    return request(url, { method: 'GET' })
  }

  /**
   * POST request
   */
  async function post(endpoint, data = {}) {
    return request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  /**
   * PUT request
   */
  async function put(endpoint, data = {}) {
    return request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  /**
   * DELETE request
   */
  async function del(endpoint) {
    return request(endpoint, { method: 'DELETE' })
  }

  return {
    isLoading,
    error,
    request,
    get,
    post,
    put,
    del
  }
}

/**
 * Specific API endpoints
 */
export function useEwsApi() {
  const api = useApi()

  return {
    // Top Topics
    getTopTopics: (startDate, endDate) =>
      api.get('/top-topics', { start_date: startDate, end_date: endDate }),

    // Posts
    getPostsByEngagement: (startDate, endDate) =>
      api.get('/posts-by-engagement', { start_date: startDate, end_date: endDate }),

    getPostsByFollowers: (startDate, endDate) =>
      api.get('/posts-by-followers', { start_date: startDate, end_date: endDate }),

    // Analysis
    getAnalysisSummary: (topic, startDate, endDate) =>
      api.get('/analysis-summary', { topic, start_date: startDate, end_date: endDate }),

    getSentimentDistribution: (startDate, endDate) =>
      api.get('/sentiment-distribution', { start_date: startDate, end_date: endDate }),

    // Viral Posts
    getViralPosts: (startDate, endDate) =>
      api.get('/viral-posts', { start_date: startDate, end_date: endDate }),

    // Status
    getStatusDistribution: (startDate, endDate) =>
      api.get('/status-distribution', { start_date: startDate, end_date: endDate }),

    // Projects
    getAllUniqueTopics: () =>
      api.get('/all-unique-topics'),

    // Threshold
    getThreshold: (projectId) =>
      api.get(`/threshold/${projectId}`),

    // Total Posts
    getTotalUniquePosts: (startDate, endDate) =>
      api.get('/total-unique-posts', { start_date: startDate, end_date: endDate }),

    ...api
  }
}
