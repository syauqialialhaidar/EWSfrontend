import { ref } from 'vue'
import { apiService, ApiError } from '@/services/api.service'
import { logger } from '@/utils/logger'
import { useNotificationStore } from '@/stores/useNotificationStore'
export function useApi() {
  const loading = ref(false)
  const error = ref(null)
  const notificationStore = useNotificationStore()

  /**
   * Execute an API call with automatic loading and error handling
   * @param {Function} apiCall 
   * @param {Object} options
   * @param {boolean} options.showErrorNotification 
   * @param {boolean} options.showSuccessNotification 
   * @param {string} options.successMessage 
   * @param {Function} options.onError 
   * @param {Function} options.onSuccess 
   * @returns {Promise} 
   */
  const execute = async (apiCall, options = {}) => {
    const {
      showErrorNotification = true,
      showSuccessNotification = false,
      successMessage = 'Operasi berhasil',
      onError = null,
      onSuccess = null
    } = options

    loading.value = true
    error.value = null

    try {
      const data = await apiCall()

      if (onSuccess) {
        onSuccess(data)
      }

      if (showSuccessNotification) {
        notificationStore.success(successMessage)
      }

      return data
    } catch (err) {
      error.value = err instanceof ApiError ? err : new ApiError(err.message, null, err)
      logger.error('useApi', 'API call failed:', err)

      if (onError) {
        onError(err)
      }

      if (showErrorNotification) {
        const errorMessage = err instanceof ApiError ? err.message : 'Terjadi kesalahan'
        notificationStore.error(errorMessage)
      }

      throw error.value
    } finally {
      loading.value = false
    }
  }

  /**
   * GET request with state management
   */
  const get = async (endpoint, params = {}, options = {}) => {
    return execute(() => apiService.get(endpoint, params), options)
  }

  /**
   * POST request with state management
   */
  const post = async (endpoint, data = {}, options = {}) => {
    return execute(() => apiService.post(endpoint, data), options)
  }

  /**
   * PUT request with state management
   */
  const put = async (endpoint, data = {}, options = {}) => {
    return execute(() => apiService.put(endpoint, data), options)
  }

  /**
   * PATCH request with state management
   */
  const patch = async (endpoint, data = {}, options = {}) => {
    return execute(() => apiService.patch(endpoint, data), options)
  }

  /**
   * DELETE request with state management
   */
  const del = async (endpoint, options = {}) => {
    return execute(() => apiService.delete(endpoint), options)
  }

  /**
   * Reset error state
   */
  const resetError = () => {
    error.value = null
  }

  return {
    loading,
    error,
    execute,
    get,
    post,
    put,
    patch,
    delete: del,
    resetError
  }
}

export function useFetch(endpoint, params = {}, options = {}) {
  const data = ref(null)
  const { loading, error, get } = useApi()

  const {
    immediate = true,
    cache = false
  } = options

  const cacheKey = cache ? `${endpoint}_${JSON.stringify(params)}` : null
  const cacheStore = new Map()
  const fetch = async (newParams = null) => {
    const finalParams = newParams || params

    if (cacheKey && cacheStore.has(cacheKey)) {
      data.value = cacheStore.get(cacheKey)
      return data.value
    }

    try {
      const response = await get(endpoint, finalParams, options)
      data.value = response

      if (cacheKey) {
        cacheStore.set(cacheKey, response)
      }

      return data.value
    } catch (err) {
      return null
    }
  }

  const refetch = () => fetch(params)

  if (immediate) {
    fetch()
  }

  return {
    data,
    loading,
    error,
    fetch,
    refetch
  }
}
