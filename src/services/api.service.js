import axios from 'axios'
import { API_CONFIG, HTTP_STATUS } from '@/config/api.config'
import { logger } from '@/utils/logger'
import { X } from 'lucide-vue-next'

export class ApiError extends Error {
  constructor(message, status, data = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
    this.timestamp = new Date().toISOString()
  }
}

const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

apiClient.interceptors.request.use(
  (config) => {
    logger.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data
    })

    config.metadata = { startTime: new Date() }
    return config
  },
  (error) => {
    logger.error('API Request Error', error)
    return Promise.reject(error)
  }
)

apiClient.interceptors.response.use(
  (response) => {
    const duration = new Date() - response.config.metadata.startTime
    logger.debug('API Response', {
      status: response.status,
      url: response.config.url,
      duration: `${duration}ms`
    })

    return response
  },
  async (error) => {
    const originalRequest = error.config

    logger.error('API Error', {
      message: error.message,
      status: error.response?.status,
      url: originalRequest?.url,
      data: error.response?.data
    })

    if (!error.response) {
      throw new ApiError(
        'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.',
        null,
        { type: 'NETWORK_ERROR', originalError: error.message }
      )
    }

    const { status, data } = error.response

    switch (status) {
      case HTTP_STATUS.BAD_REQUEST:
        throw new ApiError(
          data?.message || 'Request tidak valid',
          status,
          data
        )

      case HTTP_STATUS.UNAUTHORIZED:
        throw new ApiError(
          'Sesi Anda telah berakhir. Silakan login kembali.',
          status,
          data
        )

      case HTTP_STATUS.FORBIDDEN:
        throw new ApiError(
          'Anda tidak memiliki akses untuk resource ini.',
          status,
          data
        )

      case HTTP_STATUS.NOT_FOUND:
        throw new ApiError(
          'Data tidak ditemukan.',
          status,
          data
        )

      case HTTP_STATUS.TIMEOUT:
        throw new ApiError(
          'Request timeout. Server terlalu lama merespons.',
          status,
          data
        )

      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
      case HTTP_STATUS.BAD_GATEWAY:
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        if (!originalRequest._retry && shouldRetry(status, originalRequest._retryCount)) {
          originalRequest._retry = true
          originalRequest._retryCount = (originalRequest._retryCount || 0) + 1
          await sleep(API_CONFIG.retry.retryDelay * originalRequest._retryCount)

          logger.info('API Retry', `Retrying request (${originalRequest._retryCount}/${API_CONFIG.retry.maxRetries})`)

          return apiClient(originalRequest)
        }

        throw new ApiError(
          'Terjadi kesalahan pada server. Silakan coba lagi nanti.',
          status,
          data
        )

      default:
        throw new ApiError(
          data?.message || 'Terjadi kesalahan yang tidak diketahui.',
          status,
          data
        )
    }
  }
)

function shouldRetry(status, retryCount = 0) {
  return (
    retryCount < API_CONFIG.retry.maxRetries &&
    API_CONFIG.retry.retryableStatuses.includes(status)
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const apiService = {
  async get(endpoint, params = {}, config = {}) {
    try {
      const response = await apiClient.get(endpoint, { params, ...config })
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(error.message, null, error)
    }
  },

  async post(endpoint, data = {}, config = {}) {
    try {
      const response = await apiClient.post(endpoint, data, config)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(error.message, null, error)
    }
  },

  /**
   * PUT request
   */
  async put(endpoint, data = {}, config = {}) {
    try {
      const response = await apiClient.put(endpoint, data, config)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(error.message, null, error)
    }
  },

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, config = {}) {
    try {
      const response = await apiClient.patch(endpoint, data, config)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(error.message, null, error)
    }
  },

  /**
   * DELETE request
   */
  async delete(endpoint, config = {}) {
    try {
      const response = await apiClient.delete(endpoint, config)
      return response.data
    } catch (error) {
      if (error instanceof ApiError) {
        throw error
      }
      throw new ApiError(error.message, null, error)
    }
  }
}

// Export axios instance for direct access if needed
export { apiClient }
