import { ref, computed } from 'vue'
import { faInstagram, faTiktok, faXTwitter } from '@fortawesome/free-brands-svg-icons'
import { getHighestPriorityStatus } from '@/utils/status-helpers'
import { useBookmarkStore } from '@/stores'
import { useApi } from '@/composables/useApi'
import { ewsApi } from '@/api/ews.api'
import { logger } from '@/utils/logger'

export function useTopicData() {
  const bookmarkStore = useBookmarkStore()
  const { loading: isLoading, error, execute } = useApi()

  const topTopics = ref([]) 
  const allTopicsForCarousel = ref([]) 
  const topicsDetailsData = ref([]) 
  const platformStatuses = ref([])
  const allViralPosts = ref([]) 
  const pieChartData = ref({
    labels: ['CRISIS', 'NORMAL', 'EARLY', 'EMERGING', 'CURRENT'],
    datasets: [{
      backgroundColor: ['#E60000', '#2092EC', '#28C76F', '#AAD816', '#FF9900'],
      data: [20, 20, 20, 20, 20],
      borderWidth: 2,
      borderColor: '#ffffff',
    }]
  })

  const pieStatus = ref('EMERGING')
  const pieStatus2 = ref('CURRENT')
  const pieStatus3 = ref('NORMAL')

  const availableTopics = computed(() => {
    const topics = allViralPosts.value.map(p => p.topicTag).filter(Boolean)
    return [...new Set(topics)]
  })

  /**
   * Enrich post data with proper formatting and icons
   * @param {Object} post 
   * @param {string} topicTag 
   * @returns {Object} Enriched post object
   */
  const enrichPost = (post, topicTag) => {
    const platform = post.platform

    return {
      id: post.post_id,
      url: post.url,
      content: post.text_content,
      postStatus: (post.latest_status || 'N/A').toUpperCase(),

      // User info
      author: post.user?.name || post.user?.screen_name || 'Unknown',
      avatar: post.user?.profile_image_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',

      // Platform info
      platform: platform,
      socialIcon: platform === 'instagram' ? faInstagram
        : platform === 'tiktok' ? faTiktok
        : faXTwitter,

      // Date info
      dateRaw: post.created_at,
      date: post.created_at
        ? new Date(post.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })
        : 'N/A',

      followers: post.user?.followers_count || 0,
      following: post.user?.following_count || 0,
      engagementScore: post.engagement || 0,
      likes: String(post.metrics_detail?.[platform]?.likes || post.metrics_detail?.twitter?.favorites || 0),
      comments: String(post.metrics_detail?.[platform]?.comments || post.metrics_detail?.twitter?.replies || 0),
      shares: String(post.metrics_detail?.[platform]?.shares || post.metrics_detail?.twitter?.retweets || 0),
      topicTag: topicTag,
      isBookmarked: false
    }
  }

  /**
   * Calculate platform statuses for matrix table
   * @param {Array} platforms - Platform configurations
   * @returns {Array} Platform status matrix
   */
  const calculatePlatformStatuses = (platforms) => {
    return topicsDetailsData.value.map(topic => {
      const statusArray = Array(platforms.length).fill('')
      const allPosts = topic.allPosts

      const platformCounts = allPosts.reduce((acc, post) => {
        const platform = post.platform || 'unknown'
        acc[platform] = (acc[platform] || 0) + 1
        return acc
      }, {})

      logger.debug('useTopicData', `Topic "${topic.title}" - Platform distribution:`, platformCounts)

      platforms.forEach((platform, index) => {
        const platformPosts = allPosts.filter(p => {
          if (!p.platform) return false
          const platformName = platform.name.toLowerCase().includes('twitter') ? 'twitter'
            : platform.name.toLowerCase().includes('tiktok') ? 'tiktok'
            : platform.name.toLowerCase().includes('instagram') ? 'instagram'
            : 'unknown'

          const postPlatform = p.platform.toLowerCase()
          if (platformName === 'twitter' && (postPlatform === 'twitter' || postPlatform === 'x')) {
            return true
          }

          return postPlatform === platformName
        })

        const platformStatus = getHighestPriorityStatus(platformPosts)
        logger.debug('useTopicData', `  Platform "${platform.name}": ${platformPosts.length} posts, status: ${platformStatus}`)
        statusArray[index] = platformStatus
      })

      return { topic: topic.title, statuses: statusArray }
    })
  }

  /**
   * Fetch all dashboard data from API
   * @param {string} startDate 
   * @param {string} endDate 
   */
  const fetchAllDashboardData = async (startDate, endDate) => {
    await execute(
      async () => {
        logger.info('useTopicData', `Fetching dashboard data: ${startDate} to ${endDate}`)

        const data = await ewsApi.topTopics.getTopTopics({
          start_date: startDate,
          end_date: endDate
        })

        const topTopicsApiData = data.all_topics_with_top_posts || []

        logger.info('useTopicData', `Fetched ${topTopicsApiData.length} topics`)

        const enrichedTopicsData = topTopicsApiData.map(topicItem => {
          const topicPosts = (topicItem.top_10_posts || []).map(post =>
            enrichPost(post, topicItem.topic)
          )

          const calculated_status = getHighestPriorityStatus(topicPosts)

          return {
            ...topicItem,
            calculated_status: calculated_status,
            mapped_posts: topicPosts
          }
        })

        topTopics.value = enrichedTopicsData.slice(0, 3).map((item) => ({
          title: item.topic,
          value: String(item.total_unique_posts || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          status: item.calculated_status || 'N/A'
        }))

        allTopicsForCarousel.value = enrichedTopicsData.map((item) => ({
          title: item.topic,
          value: String(item.total_unique_posts || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
          status: item.calculated_status || 'N/A'
        }))

        let collectedPosts = []
        topicsDetailsData.value = enrichedTopicsData.slice(0, 3).map((topicItem) => {
          const topicPostsWithBookmark = topicItem.mapped_posts.map(post => ({
            ...post,
            isBookmarked: bookmarkStore.isBookmarked(post.id)
          }))

          collectedPosts.push(...topicPostsWithBookmark)

          return {
            title: topicItem.topic,
            status: (topicItem.calculated_status || 'N/A').toUpperCase(),
            allPosts: topicPostsWithBookmark,
          }
        })

        pieStatus.value = enrichedTopicsData.length > 0
          ? enrichedTopicsData[0].calculated_status.toUpperCase()
          : 'NORMAL'

        pieStatus2.value = enrichedTopicsData.length > 1
          ? enrichedTopicsData[1].calculated_status.toUpperCase()
          : 'NORMAL'

        pieStatus3.value = enrichedTopicsData.length > 2
          ? enrichedTopicsData[2].calculated_status.toUpperCase()
          : 'NORMAL'

        const uniquePosts = Array.from(
          new Map(collectedPosts.map(p => [p.id, p])).values()
        )
        uniquePosts.sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw))

        allViralPosts.value = uniquePosts

        logger.info('useTopicData', `Processed ${uniquePosts.length} unique viral posts`)
      },
      {
        showErrorNotification: true,
        errorMessage: 'Gagal memuat data topik terkini',
        onError: (err) => {
          logger.error('useTopicData', 'Failed to fetch dashboard data:', err)
          topTopics.value = []
          allTopicsForCarousel.value = []
          topicsDetailsData.value = []
          allViralPosts.value = []
          pieStatus.value = 'NORMAL'
          pieStatus2.value = 'NORMAL'
          pieStatus3.value = 'NORMAL'
        }
      }
    )
  }

  /**
   * Load data with filter store dates
   * This will be called by the main component
   */
  const loadAllData = (startDate, endDate) => {
    return fetchAllDashboardData(startDate, endDate)
  }

  /**
   * Update platform statuses (should be called after data is loaded)
   * @param {Array} platforms
   */
  const updatePlatformStatuses = (platforms) => {
    platformStatuses.value = calculatePlatformStatuses(platforms)
  }

  /**
   * Sync bookmark status for a post across all data structures
   * @param {Object} post 
   */
  const syncBookmarkStatus = (post) => {
    const isBookmarked = bookmarkStore.isBookmarked(post.id)

    // Update in allViralPosts
    const postInFeed = allViralPosts.value.find(p => p.id === post.id)
    if (postInFeed) {
      postInFeed.isBookmarked = isBookmarked
    }

    // Update in topicsDetailsData
    for (const topic of topicsDetailsData.value) {
      const originalPost = topic.allPosts.find(p => p.id === post.id)
      if (originalPost) {
        originalPost.isBookmarked = isBookmarked
      }
    }
  }

  return {
    // State
    isLoading,
    error,
    topTopics,
    allTopicsForCarousel,
    topicsDetailsData,
    platformStatuses,
    allViralPosts,
    pieChartData,
    pieStatus,
    pieStatus2,
    pieStatus3,

    // Computed
    availableTopics,

    // Methods
    fetchAllDashboardData,
    loadAllData,
    updatePlatformStatuses,
    syncBookmarkStatus
  }
}
