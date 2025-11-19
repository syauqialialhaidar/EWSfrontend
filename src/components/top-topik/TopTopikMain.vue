<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[48rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600">Memuat data topik terkini...</p>
  </div>

  <div v-else class="space-y-6 animate-fade-in">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1 space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div class="text-5xl font-bold text-[#03255C] tracking-tight">{{ currentTime }}</div>
          <div class="text-base font-semibold text-gray-500">{{ currentDate }}</div>
        </div>

        <ViralPostsFeed :posts="allViralPosts" :available-topics="availableTopics" :per-page="5"
          @open-detail="openDetailModal" @open-link="openLinkInNewTab" />
      </div>

      <div class="lg:col-span-2 space-y-6">
        <CompassChart :top-topics="topTopics" :pie-chart-data="pieChartData" :primary-status="pieStatus"
          :secondary-status="pieStatus2" :tertiary-status="pieStatus3" :all-posts="allViralPosts" />

        <TopicCarousel :topics="allTopicsForCarousel" :items-per-page="3" @topic-selected="handleTopicSelected" />
      </div>
    </div>

    <TopicDetailCards :topics-details="topicsDetailsData" :all-posts="allViralPosts" @bookmark-toggle="handleBookmarkToggle"
      @open-detail="openDetailModal" @open-link="openLinkInNewTab" />
    <PlatformMatrix :platform-statuses="platformStatuses" :platforms="platforms" :all-posts="allViralPosts" />

    <PostDetailModal :post="selectedPost" :is-open="isDetailModalOpen" @close="closeDetailModal"
      @open-link="openLinkInNewTab" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { faXTwitter, faTiktok, faInstagram } from '@fortawesome/free-brands-svg-icons'
import { useFilterStore } from '@/stores'
import { useTopicData } from '@/composables/useTopicData'
import { logger } from '@/utils/logger'
import CompassChart from './CompassChart.vue'
import TopicCarousel from './TopicCarousel.vue'
import ViralPostsFeed from './ViralPostsFeed.vue'
import TopicDetailCards from './TopicDetailCards.vue'
import PlatformMatrix from './PlatformMatrix.vue'
import PostDetailModal from './PostDetailModal.vue'

const filterStore = useFilterStore()

const {
  isLoading,
  topTopics,
  allTopicsForCarousel,
  topicsDetailsData,
  platformStatuses,
  allViralPosts,
  pieChartData,
  pieStatus,
  pieStatus2,
  pieStatus3,
  availableTopics,
  loadAllData,
  updatePlatformStatuses,
  syncBookmarkStatus
} = useTopicData()

const currentTime = ref('')
const currentDate = ref('')
let timerInterval = null
const isDetailModalOpen = ref(false)
const selectedPost = ref(null)

const platforms = ref([
  { name: 'X / Twitter', icon: faXTwitter, color: 'text-gray-800' },
  { name: 'TikTok', icon: faTiktok, color: 'text-black' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' }
])

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
  currentDate.value = now.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadDashboardData = async () => {
  await loadAllData(filterStore.startDate, filterStore.endDate)
  updatePlatformStatuses(platforms.value)
  logger.info('TopTopikMain', 'Dashboard data loaded')
}

const openDetailModal = (post) => {
  selectedPost.value = post
  isDetailModalOpen.value = true
}

const closeDetailModal = () => {
  isDetailModalOpen.value = false
  selectedPost.value = null
}

const openLinkInNewTab = (post) => {
  if (post && post.url) {
    window.open(post.url, '_blank', 'noopener,noreferrer')
  }
}

const handleTopicSelected = (topic) => {
  logger.info('TopTopikMain', 'Topic selected:', topic.title)
}

const handleBookmarkToggle = (post) => {
  syncBookmarkStatus(post)
}

watch(
  () => [filterStore.startDate, filterStore.endDate],
  () => {
    logger.info('TopTopikMain', 'Filters changed, reloading data...')
    loadDashboardData()
  }
)

onMounted(() => {
  updateTime()
  timerInterval = setInterval(updateTime, 1000)
  loadDashboardData()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

<style scoped>
.loader {
  border-top-color: #3B82F6;
  animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
  100% {
    transform: rotate(360deg);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
