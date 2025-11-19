
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://154.26.134.72:8438',
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,

  retry: {
    maxRetries: 3,
    retryDelay: 1000,
    retryableStatuses: [408, 429, 500, 502, 503, 504]
  },

  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
}

export const API_ENDPOINTS = {
  // Top Topics
  topTopics: '/top-topics',

  // Analysis
  analysisSummary: '/analysis-summary',
  topicTrendAnalysis: '/topic-trend-analysis',

  // Topics
  allUniqueTopics: '/all-unique-topics',
  threshold: '/threshold',

  // Posts
  posts: '/posts',
  viralPosts: '/viral-posts',
  totalUniquePosts: '/total-unique-posts',
  sentimentDistribution: '/sentiment-distribution',
  statusDistribution: '/status-distribution',
  postsByEngagement: '/posts-by-engagement',
  postsByFollowers: '/posts-by-followers',

}

/**
 * HTTP Status Codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TIMEOUT: 408,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
}
