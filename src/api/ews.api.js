import { apiService } from '@/services/api.service'
import { API_ENDPOINTS } from '@/config/api.config'


export const topTopicsApi = {
  /**
   * Get top topics with optional date range
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date 
   */
  getTopTopics(params = {}) {
    return apiService.get(API_ENDPOINTS.topTopics, params)
  }
}

export const analysisApi = {
  /**
   * Get analysis summary
   * @param {Object} params 
   * @param {string} params.topic
   * @param {string} params.start_date 
   * @param {string} params.end_date 
   */
  getSummary(params = {}) {
    return apiService.get(API_ENDPOINTS.analysisSummary, params)
  },

  /**
   * Get topic trend analysis
   * @param {Object} params 
   */
  getTrendAnalysis(params = {}) {
    return apiService.get(API_ENDPOINTS.topicTrendAnalysis, params)
  }
}


export const topicsApi = {
  getAllUniqueTopics() {
    return apiService.get(API_ENDPOINTS.allUniqueTopics)
  },

  /**
   * Get threshold for a project
   * @param {string} projectId 
   */
  getThreshold(projectId) {
    return apiService.get(`${API_ENDPOINTS.threshold}/${projectId}`)
  },

  /**
   * Save threshold rules
   * @param {Object} data
   * @param {string} data.id_project 
   * @param {Array} data.threshold 
   */
  saveThreshold(data) {
    return apiService.post(API_ENDPOINTS.threshold, data)
  },

  /**
   * Update threshold rules
   * @param {string} projectId 
   * @param {Object} data 
   */
  updateThreshold(projectId, data) {
    return apiService.put(`${API_ENDPOINTS.threshold}/${projectId}`, data)
  }
}

export const postsApi = {
  /**
   * Get posts with filters
   * @param {Object} params 
   */
  getPosts(params = {}) {
    return apiService.get(API_ENDPOINTS.posts, params)
  },

  /**
   * Get viral posts
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date 
   */
  getViralPosts(params = {}) {
    return apiService.get(API_ENDPOINTS.viralPosts, params)
  },

  /**
   * Get total unique posts count
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date 
   */
  getTotalUniquePosts(params = {}) {
    return apiService.get(API_ENDPOINTS.totalUniquePosts, params)
  },

  /**
   * Get sentiment distribution
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date 
   */
  getSentimentDistribution(params = {}) {
    return apiService.get(API_ENDPOINTS.sentimentDistribution, params)
  },

  /**
   * Get status distribution
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date
   */
  getStatusDistribution(params = {}) {
    return apiService.get(API_ENDPOINTS.statusDistribution, params)
  },

  /**
   * Get posts by engagement
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date 
   */
  getPostsByEngagement(params = {}) {
    return apiService.get(API_ENDPOINTS.postsByEngagement, params)
  },

  /**
   * Get posts by followers
   * @param {Object} params 
   * @param {string} params.start_date 
   * @param {string} params.end_date
   */
  getPostsByFollowers(params = {}) {
    return apiService.get(API_ENDPOINTS.postsByFollowers, params)
  }
}

export const ewsApi = {
  topTopics: topTopicsApi,
  analysis: analysisApi,
  topics: topicsApi,
  posts: postsApi
}
