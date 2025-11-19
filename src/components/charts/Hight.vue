<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[40rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-2"></div>
    <p class="text-lg font-semibold text-gray-600 dark:text-gray-300">Memuat postingan...</p>
    <p v-if="apiError" class="text-sm text-red-500 mt-2">{{ apiError }}</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    <div v-for="(column, index) in allColumns" :key="index" class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-[4px_4px_6px_rgba(128,128,128,0.3)] flex flex-col p-4">
      <h3 class="text-lg font-bold text-[#03255C] mb-3">{{ column.title }}</h3>

      <div class="relative mb-4">
        <input type="text" placeholder="Cari Akun" class="w-full border border-gray-300 dark:border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 dark:bg-gray-700 dark:text-gray-200">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <div class="space-y-4 flex-grow">
        <div v-for="post in paginatedPosts(column)" :key="post.id" class="bg-[#F8F7FA] dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div class="flex items-start mb-4">
            <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
            <div class="flex-grow">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2 min-w-0 max-w-[66%]">
                  <i :class="[post.socialIcon, 'h-4 w-4']"></i> <span class="font-bold text-sm text-[#03255C] block overflow-hidden whitespace-nowrap text-ellipsis">
                    {{ post.author }}
                  </span>
                </div>

                <div class="flex items-center gap-3 flex-shrink-0">
                  <span :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                    {{ post.postStatus }}
                  </span>
                  <FontAwesomeIcon :icon="faBookmark" @click="toggleBookmark(post)"
                    :class="[
                      'h-4 w-4 cursor-pointer transition-colors',
                      post.isBookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 dark:text-gray-500 hover:text-[#03255C] dark:hover:text-white'
                    ]" />
                </div>
              </div>
              <div class="flex justify-start items-center gap-4 mt-0.5">
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FontAwesomeIcon :icon="faUsers" class="h-4 w-4" />
                  {{ post.stats.followers }}
                </p>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FontAwesomeIcon :icon="faUser" class="h-4 w-4" />
                  {{ post.stats.following }}
                </p>
                <p class="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <FontAwesomeIcon :icon="faChartLine" class="h-4 w-4" />
                  {{ post.stats.engagement }}
                </p>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-5">
            <FontAwesomeIcon :icon="faCalendarDays" class="h-4 w-4" />
            {{ post.date }}
          </p>
          <p class="text-sm text-[#03255C] mb-4 line-clamp-2">{{ post.content }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faEye" class="h-4 w-4 dark:text-gray-400" />
                <span>{{ post.stats.views }}</span>
              </div>
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faHeart" class="h-4 w-4 dark:text-gray-400" />
                <span>{{ post.stats.favorites }}</span>
              </div>
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faCommentDots" class="h-4 w-4 dark:text-gray-400" />
                <span>{{ post.stats.replies }}</span>
              </div>
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faShareNodes" class="h-4 w-4 dark:text-gray-400" />
                <span>{{ post.stats.retweets }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="min-w-0 mr-4">
              <span class="text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-600 dark:border-gray-500 px-2 py-0.5 rounded-lg block overflow-hidden whitespace-nowrap text-ellipsis bg-transparent">
                {{ post.topicTag }}
              </span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0">
              <button @click="openLinkInNewTab(post)"
                class="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-[#2092EC] dark:text-blue-400 border border-[#2092EC] dark:border-blue-500 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-1">
                <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" />
                Kunjungi
              </button>
              <button @click="openDetailModal(post)" class="text-xs font-semibold bg-[#2092EC] dark:bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition flex items-center gap-1">
                <i class="fas fa-eye h-3 w-3"></i>
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
        <p v-if="column.posts.length === 0" class="text-sm text-gray-500 text-center py-4">Tidak ada data postingan.</p>
      </div>

      <div v-if="column.posts.length > 0" class="p-2 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="flex justify-between items-center text-sm text-gray-700 dark:text-gray-300">
          <span class="text-xs">{{ displayRange(column) }}</span>

          <div class="flex items-center space-x-2">
            <button @click="prevPage(column)" :disabled="column.pagination.currentPage === 1"
              :class="{ 'opacity-30 cursor-not-allowed': column.pagination.currentPage === 1, 'hover:bg-gray-100 dark:hover:bg-gray-700': column.pagination.currentPage !== 1 }"
              class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold dark:text-gray-200">
              &lt;
            </button>

            <div class="flex items-center justify-center space-x-2">
              <div v-if="column.pagination.currentPage > 1"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-semibold">
                {{ column.pagination.currentPage - 1 }}
              </div>
              <div v-else class="w-6 h-6"></div>

              <div
                class="w-8 h-8 flex items-center justify-center bg-[#03255C] dark:bg-blue-600 text-white rounded-full text-base font-bold shadow-md">
                {{ column.pagination.currentPage }}
              </div>

              <div v-if="column.pagination.currentPage < totalPages(column)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                {{ column.pagination.currentPage + 1 }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>

            <button @click="nextPage(column)" :disabled="column.pagination.currentPage === totalPages(column)"
              :class="{ 'opacity-30 cursor-not-allowed': column.pagination.currentPage === totalPages(column), 'hover:bg-gray-100 dark:hover:bg-gray-700': column.pagination.currentPage !== totalPages(column) }"
              class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold dark:text-gray-200">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isDetailModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-85 backdrop-blur-sm transition-opacity duration-300"
      @click.self="closeDetailModal" @keydown.esc="closeDetailModal" tabindex="0">
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 w-11/12 max-w-lg transform transition-all duration-300 scale-100 opacity-100">
        <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-4">
          <h3 class="text-xl font-bold text-[#03255C] dark:text-gray-100">Detail Postingan</h3>
          <button @click="closeDetailModal" class="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div v-if="selectedPost" class="space-y-4">
          <div class="flex items-center">
            <img :src="selectedPost.avatar" alt="Avatar" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-lg text-[#03255C] dark:text-gray-100 flex items-center gap-2">
                <i :class="[selectedPost.socialIcon, 'h-4 w-4 text-sm flex items-center justify-center']"></i>
                {{ selectedPost.author }}
              </p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Diposting pada: {{ selectedPost.date }}
              </p>
            </div>
          </div>
          <p class="text-gray-700 dark:text-gray-200 text-base border-t dark:border-gray-700 pt-4">{{ selectedPost.content }}</p>
          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p><strong>Status EWS:</strong> <span
                :class="[selectedPost.statusColor, 'font-bold px-2 py-0.5 rounded']">{{
                  selectedPost.postStatus
                }}</span></p>
            <p class="dark:text-gray-300"><strong>Topik:</strong> <span class="font-semibold text-blue-600 dark:text-blue-400">{{ selectedPost.topicTag
                }}</span></p>
            <p class="dark:text-gray-300"><strong>Followers:</strong> {{ selectedPost.stats.followers }}</p>
            <p class="dark:text-gray-300"><strong>Following:</strong> {{ selectedPost.stats.following }}</p>
            <p class="dark:text-gray-300"><strong>Engagement Total:</strong> {{ selectedPost.stats.engagement }}</p>
            <p class="dark:text-gray-300"><strong>Shares (Retweets):</strong> {{ selectedPost.stats.retweets }}</p>
            <p class="dark:text-gray-300"><strong>Likes (Favorites):</strong> {{ selectedPost.stats.favorites }}</p>
            <p class="dark:text-gray-300"><strong>Komentar (Replies):</strong> {{ selectedPost.stats.replies }}</p>
            <p class="dark:text-gray-300"><strong>Views (Impression):</strong> {{ selectedPost.stats.views }}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="openLinkInNewTab(selectedPost)" class="text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-[#2092EC] dark:text-blue-400 border border-[#2092EC] dark:border-blue-500 px-3 py-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-1">
            <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" />
            Kunjungi sumber asli
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import {
  ref,
  onMounted,
  computed,
  watch,
  reactive 
} from 'vue';
import {
  FontAwesomeIcon
} from '@fortawesome/vue-fontawesome';
import {
  faBookmark,
  faEye,
  faHeart,
  faCommentDots,
  faShareNodes,
  faUsers,
  faUser,
  faChartLine,
  faCalendarDays,
  faUpRightFromSquare 
} from '@fortawesome/free-solid-svg-icons'

import { useFilterStore, useBookmarkStore } from '@/stores'
import { useApi } from '@/composables/useApi'
import { ewsApi } from '@/api/ews.api'
import { logger } from '@/utils/logger'

const filterStore = useFilterStore()
const bookmarkStore = useBookmarkStore()
const { loading: loadingPosts, execute: executePostsApi } = useApi()
const isLoading = ref(true)
const apiError = ref(null);
const columnsData = ref([]);
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);

const openLinkInNewTab = (post) => {
  if (post && post.url) {
    window.open(post.url, '_blank', 'noopener,noreferrer');
  } else {
    logger.error('Hight', 'URL tidak ditemukan untuk postingan ini:', post);
  }
};


const bookmarkedPosts = ref([]);
const BOOKMARK_STORAGE_KEY = 'vue-bookmarked-posts';
const bookmarkedColumn = reactive({
  title: 'Posts From Marked Accounts',
  posts: [],
  pagination: {
    total: 0,
    currentPage: 1,
    perPage: 5
  }
});

watch(bookmarkedPosts, (newPosts) => {
  bookmarkedColumn.posts = newPosts;
  bookmarkedColumn.pagination.total = newPosts.length;
  
  const totalP = Math.ceil(newPosts.length / bookmarkedColumn.pagination.perPage) || 1;
  if (bookmarkedColumn.pagination.currentPage > totalP) {
    bookmarkedColumn.pagination.currentPage = 1;
  }
}, { deep: true });

const ICONS = {
  twitter: 'fab fa-x-twitter text-[#03255C]',
  instagram: 'fab fa-instagram text-pink-600',
  tiktok: 'fab fa-tiktok text-[#03255C]',
};

const STATUS_MAPPING = {
  'Crisis': { title: 'Crisis', color: 'text-[#E60000] border border-[#E60000] bg-[#E60000]/10' },
  'Current': { title: 'Current', color: 'text-[#FF9900] border border-[#FF9900] bg-[#FF9900]/10' },
  'Emerging': { title: 'Emerging', color: 'text-[#AAD816] border border-[#AAD816] bg-[#AAD816]/10' },
  'Early': { title: 'Early', color: 'text-[#28C76F] border border-[#28C76F] bg-[#28C76F]/10' },
  'Normal': { title: 'Normal', color: 'text-[#2092EC] border border-[#2092EC] bg-[#2092EC]/10' },
  'N/A': { title: 'Unknown', color: 'text-gray-500 border border-gray-500 bg-gray-100' },
};

const openDetailModal = (post) => {
  selectedPost.value = post;
  isDetailModalOpen.value = true;
};
const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  selectedPost.value = null;
};

const saveBookmarks = () => {
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarkedPosts.value));
};

const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  if (savedBookmarks) {
    try {
      const parsedData = JSON.parse(savedBookmarks);
      if (Array.isArray(parsedData)) {
        bookmarkedPosts.value = parsedData;
      } else {
        logger.warn('Hight', 'Data bookmark yang dimuat bukan array, direset menjadi kosong.');
        bookmarkedPosts.value = [];
      }
    } catch (error) {
      logger.error('Hight', 'Gagal memuat bookmark dari localStorage. Data mungkin rusak:', error);
      bookmarkedPosts.value = [];
      localStorage.removeItem(BOOKMARK_STORAGE_KEY);
    }
  }
};

const toggleBookmark = (post) => {
  const postIndex = bookmarkedPosts.value.findIndex(p => p.id === post.id);
  let isNowBookmarked; 

  if (postIndex === -1) {
    post.isBookmarked = true;
    isNowBookmarked = true;
    bookmarkedPosts.value.unshift(post);
  } else {
    post.isBookmarked = false;
    isNowBookmarked = false;
    bookmarkedPosts.value.splice(postIndex, 1);
  }

  for (const column of columnsData.value) {
    const originalPost = column.posts.find(p => p.id === post.id);
    if (originalPost) {
      originalPost.isBookmarked = isNowBookmarked;
      break; 
    }
  }
  
  saveBookmarks();
};


const totalPages = (column) => {
  if (!column.pagination || !column.pagination.total) return 1;
  return Math.ceil(column.pagination.total / column.pagination.perPage);
};

const paginatedPosts = (column) => {
  const { currentPage, perPage } = column.pagination;
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  return column.posts.slice(startIndex, endIndex);
};

const displayRange = (column) => {
  const { currentPage, perPage, total } = column.pagination;
  if (total === 0) return 'Tidak ada data';
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(start + perPage - 1, total);
  return `${start} - ${end} dari ${total} Data`;
};

const goToPage = (column, page) => {
  if (page >= 1 && page <= totalPages(column)) {
    column.pagination.currentPage = page;
  }
};
const prevPage = (column) => { goToPage(column, column.pagination.currentPage - 1); };
const nextPage = (column) => { goToPage(column, column.pagination.currentPage + 1); };


const createDummyPost = (id, social) => {
  const status = 'Normal';
  const statusData = STATUS_MAPPING[status];
  return {
    id, author: `Dummy-${social}-${id}`, avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=DA',
    socialIcon: ICONS[social],
    stats: { followers: `${id}K`, following: 'N/A', retweets: 'N/A', favorites: 'N/A', replies: 'N/A', views: 'N/A', engagement: 'N/A', },
    date: new Date().toLocaleDateString('id-ID'), postStatus: statusData.title, statusColor: statusData.color,
    content: `Ini adalah postingan dummy #${id} untuk mengisi kolom karena API gagal terhubung.`, topicTag: 'FallBack-Data', isBookmarked: false,
  };
};
const mapApiPostToLocalPost = (apiPost, postId) => {
  const platformKey = apiPost.platform?.toLowerCase();
  const socialIcon = ICONS[platformKey];
  let url = apiPost.url;
  const authorName = apiPost.user?.screen_name || apiPost.user?.username;
  const avatarUrl = apiPost.user?.profile_image_url || apiPost.user?.profil || apiPost.user?.foto_profil || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  const postContent = apiPost.text_content;
  const statusKey = apiPost.latest_status || 'N/A';
  const statusData = STATUS_MAPPING[statusKey] || STATUS_MAPPING['N/A'];
  const metrics = apiPost.metrics_detail[platformKey] || {};

  let views = metrics.views || 'N/A';
    let favorites = metrics.favorites || metrics.likes || 'N/A'; 
    let replies = metrics.replies || metrics.comments || metrics.coments || 'N/A'; 
    let retweets = metrics.retweets || metrics.reposts || metrics.shares || 'N/A'; 
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('en-US');
  };
  const dateString = apiPost.created_at ? new Date(apiPost.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tanggal tidak tersedia';
  
  return {
        id: apiPost.post_id, 
        author: authorName, 
        avatar: avatarUrl,
        socialIcon: socialIcon,
        
        stats: { 
            followers: formatNumber(apiPost.user.followers_count), 
            following: formatNumber(apiPost.user.following_count), 
            engagement: formatNumber(apiPost.engagement), 
            views: formatNumber(views), 
            favorites: formatNumber(favorites), 
            replies: formatNumber(replies), 
            retweets: formatNumber(retweets), 
        },
        
        date: dateString, postStatus: statusData.title, statusColor: statusData.color,
        content: postContent,
        topicTag: apiPost.topik || 'N/A', 
        isBookmarked: false, 
        url: url
    };
};
const fetchPostsData = async (startDate, endDate) => {
  isLoading.value = true;
  apiError.value = null;

  await executePostsApi(
    async () => {
      logger.info('Hight', `Fetching posts data: ${startDate} to ${endDate}`)
      const [engagementData, followersData] = await Promise.all([
        ewsApi.posts.getPostsByEngagement({ start_date: startDate, end_date: endDate }),
        ewsApi.posts.getPostsByFollowers({ start_date: startDate, end_date: endDate })
      ])

      let engagementPosts = []
      let followersPosts = []

      if (engagementData.posts_by_engagement?.length > 0) {
        engagementPosts = engagementData.posts_by_engagement.map((post, index) =>
          mapApiPostToLocalPost(post, `engage-${index}`)
        )
        logger.info('Hight', `Loaded ${engagementPosts.length} engagement posts`)
      } else {
        logger.warn('Hight', 'No engagement posts data, using dummy data')
        engagementPosts = Array.from({ length: 10 }, (_, i) => createDummyPost(i + 1, 'x'))
      }

      if (followersData.posts_by_followers?.length > 0) {
        followersPosts = followersData.posts_by_followers.map((post, index) =>
          mapApiPostToLocalPost(post, `foll-${index}`)
        )
        logger.info('Hight', `Loaded ${followersPosts.length} followers posts`)
      } else {
        logger.warn('Hight', 'No followers posts data, using dummy data')
        followersPosts = Array.from({ length: 10 }, (_, i) => createDummyPost(i + 1, 'facebook'))
      }

      const bookmarkedIds = new Set(bookmarkedPosts.value.map(p => p.id))
      engagementPosts.forEach(p => { if (bookmarkedIds.has(p.id)) p.isBookmarked = true })
      followersPosts.forEach(p => { if (bookmarkedIds.has(p.id)) p.isBookmarked = true })

      columnsData.value = [{
        title: 'Posts From Highest Engagement',
        posts: engagementPosts,
        pagination: { total: engagementPosts.length, currentPage: 1, perPage: 5 }
      }, {
        title: 'Posts From Highest Followers',
        posts: followersPosts,
        pagination: { total: followersPosts.length, currentPage: 1, perPage: 5 }
      }]

      logger.info('Hight', 'Posts data loaded successfully')
    },
    {
      showErrorNotification: true,
      errorMessage: 'Gagal memuat data postingan',
      onError: (err) => {
        logger.error('Hight', 'Failed to fetch posts data:', err)
        apiError.value = 'Gagal memuat data dari server'

        const dummyEngagement = Array.from({ length: 10 }, (_, i) => createDummyPost(i + 1, 'x'))
        const dummyFollowers = Array.from({ length: 10 }, (_, i) => createDummyPost(i + 1, 'facebook'))

        columnsData.value = [{
          title: 'Posts From Highest Engagement',
          posts: dummyEngagement,
          pagination: { total: dummyEngagement.length, currentPage: 1, perPage: 5 }
        }, {
          title: 'Posts From Highest Followers',
          posts: dummyFollowers,
          pagination: { total: dummyFollowers.length, currentPage: 1, perPage: 5 }
        }]
      }
    }
  )

  isLoading.value = false;
};

function loadAllData() {
  fetchPostsData(filterStore.startDate, filterStore.endDate);
}

watch(() => [filterStore.startDate, filterStore.endDate], () => {
  logger.info('Hight', `Filter tanggal berubah ke: ${filterStore.startDate} - ${filterStore.endDate}. Memuat ulang data...`);
  loadAllData();
});

const allColumns = computed(() => {
  return [...columnsData.value, bookmarkedColumn];
});

onMounted(() => {
  loadBookmarks();
  logger.info('Hight', 'Komponen dimuat, mengambil data awal...');
  loadAllData();
});
</script>


<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>