<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[40rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-2"></div>
    <p class="text-lg font-semibold text-gray-600">Memuat postingan...</p>
    <p v-if="apiError" class="text-sm text-red-500 mt-2">{{ apiError }}</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    <div v-for="(column, index) in allColumns" :key="index"
      class="bg-white rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)] flex flex-col p-4">
      <h3 class="text-lg font-bold text-[#03255C] mb-3">{{ column.title }}</h3>

      <div class="relative mb-4">
        <input type="text" placeholder="Cari Akun"
          class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <div class="space-y-4 flex-grow">
        <div v-for="post in paginatedPosts(column)" :key="post.id"
          class="bg-[#F8F7FA] border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div class="flex items-start mb-4">
            <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
            <div class="flex-grow">
              <div class="flex justify-between items-center mb-2">
                <div class="flex items-center gap-2 min-w-0 max-w-[66%]">
                  <i :class="[post.socialIcon, 'h-4 w-4']"></i>
                  <span class="font-bold text-sm text-[#03255C] block overflow-hidden whitespace-nowrap text-ellipsis">
                    {{ post.author }}
                  </span>
                </div>

                <div class="flex items-center gap-3 flex-shrink-0">
                  <span :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                    {{ post.postStatus }}
                  </span>
                  <FontAwesomeIcon :icon="faBookmark" @click="toggleBookmark(post)" :class="[
                    'h-4 w-4 cursor-pointer transition-colors',
                    post.isBookmarked
                      ? 'text-yellow-500 hover:text-yellow-600'
                      : 'text-gray-400 hover:text-[#03255C]'
                  ]" />
                </div>
              </div>
              <div class="flex justify-start items-center gap-4 mt-0.5">
                <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <FontAwesomeIcon :icon="faUsers" class="h-4 w-4" />
                  {{ post.stats.followers }}
                </p>
                <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <FontAwesomeIcon :icon="faUser" class="h-4 w-4" />
                  {{ post.stats.following }}
                </p>
                <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                  <FontAwesomeIcon :icon="faChartLine" class="h-4 w-4" />
                  {{ post.stats.engagement }}
                </p>
              </div>
            </div>
          </div>
          <p class="text-xs text-gray-500 flex items-center gap-1 mb-5">
            <FontAwesomeIcon :icon="faCalendarDays" class="h-4 w-4" />
            {{ post.date }}
          </p>
          <p class="text-sm text-[#03255C] mb-4 line-clamp-2">{{ post.content }}</p>
          <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faEye" class="h-4 w-4" />
                <span>{{ post.stats.views }}</span>
              </div>
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faHeart" class="h-4 w-4" />
                <span>{{ post.stats.favorites }}</span>
              </div>
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faCommentDots" class="h-4 w-4" />
                <span>{{ post.stats.replies }}</span>
              </div>
              <div class="flex items-center gap-1">
                <FontAwesomeIcon :icon="faShareNodes" class="h-4 w-4" />
                <span>{{ post.stats.retweets }}</span>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-3">
            <div class="min-w-0 mr-4">
              <span
                class="text-xs font-medium text-gray-600 border border-gray-600 px-2 py-0.5 rounded-lg block overflow-hidden whitespace-nowrap text-ellipsis bg-transparent">
                {{ post.topicTag }}
              </span>
            </div>
            <div class="flex items-center gap-2 flex-shrink-0"> <button @click="openLinkInNewTab(post)"
                class="text-xs font-semibold bg-gray-100 text-[#2092EC] border border-[#2092EC] px-3 py-1.5 rounded-md hover:bg-gray-200 transition flex items-center gap-1">
                <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" />
                Kunjungi
              </button>
              <button @click="openDetailModal(post)"
                class="text-xs font-semibold bg-[#2092EC] text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition flex items-center gap-1">
                <i class="fas fa-eye h-3 w-3"></i>
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
        <p v-if="column.posts.length === 0" class="text-sm text-gray-500 text-center py-4">Tidak ada data postingan.</p>
      </div>

      <div v-if="column.posts.length > 0" class="p-2 border-t border-gray-200 mt-auto">
        <div class="flex justify-between items-center text-sm text-gray-700">
          <span class="text-xs">{{ displayRange(column) }}</span>

          <div class="flex items-center space-x-2">
            <button @click="prevPage(column)" :disabled="column.pagination.currentPage === 1"
              :class="{ 'opacity-30 cursor-not-allowed': column.pagination.currentPage === 1, 'hover:bg-gray-100': column.pagination.currentPage !== 1 }"
              class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold">
              &lt;
            </button>

            <div class="flex items-center justify-center space-x-2">
              <div v-if="column.pagination.currentPage > 1"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                {{ column.pagination.currentPage - 1 }}
              </div>
              <div v-else class="w-6 h-6"></div>

              <div
                class="w-8 h-8 flex items-center justify-center bg-[#03255C] text-white rounded-full text-base font-bold shadow-md">
                {{ column.pagination.currentPage }}
              </div>

              <div v-if="column.pagination.currentPage < totalPages(column)"
                class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                {{ column.pagination.currentPage + 1 }}
              </div>
              <div v-else class="w-6 h-6"></div>
            </div>

            <button @click="nextPage(column)" :disabled="column.pagination.currentPage === totalPages(column)"
              :class="{ 'opacity-30 cursor-not-allowed': column.pagination.currentPage === totalPages(column), 'hover:bg-gray-100': column.pagination.currentPage !== totalPages(column) }"
              class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="isDetailModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
      @click.self="closeDetailModal" @keydown.esc="closeDetailModal" tabindex="0">
      <div
        class="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg transform transition-all duration-300 scale-100 opacity-100">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h3 class="text-xl font-bold text-[#03255C]">Detail Postingan</h3>
          <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div v-if="selectedPost" class="space-y-4">
          <div class="flex items-center">
            <img :src="selectedPost.avatar" alt="Avatar" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-lg text-[#03255C] flex items-center gap-2">
                <i :class="[selectedPost.socialIcon, 'h-4 w-4 text-sm flex items-center justify-center']"></i>
                {{ selectedPost.author }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Diposting pada: {{ selectedPost.date }}
              </p>
            </div>
          </div>
          <p class="text-gray-700 text-base border-t pt-4">{{ selectedPost.content }}</p>
          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm p-3 bg-gray-50 rounded-lg">
            <p><strong>Status EWS:</strong> <span
                :class="[selectedPost.statusColor, 'font-bold px-2 py-0.5 rounded']">{{
                  selectedPost.postStatus
                }}</span></p>
            <p><strong>Topik:</strong> <span class="font-semibold text-blue-600">{{ selectedPost.topicTag
                }}</span></p>
            <p><strong>Followers:</strong> {{ selectedPost.stats.followers }}</p>
            <p><strong>Following:</strong> {{ selectedPost.stats.following }}</p>
            <p><strong>Engagement Total:</strong> {{ selectedPost.stats.engagement }}</p>
            <p><strong>Shares (Retweets):</strong> {{ selectedPost.stats.retweets }}</p>
            <p><strong>Likes (Favorites):</strong> {{ selectedPost.stats.favorites }}</p>
            <p><strong>Komentar (Replies):</strong> {{ selectedPost.stats.replies }}</p>
            <p><strong>Views (Impression):</strong> {{ selectedPost.stats.views }}</p>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button @click="openLinkInNewTab(selectedPost)"
            class="text-xs font-semibold bg-gray-100 text-[#2092EC] border border-[#2092EC] px-3 py-1.5 rounded-md hover:bg-gray-200 transition flex items-center gap-1">
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
  computed, watch
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
  faCalendarDays
} from '@fortawesome/free-solid-svg-icons';

import { filters } from '@/stores/filterStore.js';

const isLoading = ref(true);
const apiError = ref(null);
const columnsData = ref([]);
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);

const openLinkInNewTab = (post) => {
  if (post && post.url) {
    // Membuka URL di tab baru. '_blank' adalah targetnya.
    // 'noopener,noreferrer' adalah untuk keamanan.
    window.open(post.url, '_blank', 'noopener,noreferrer');
  } else {
    console.error('URL tidak ditemukan untuk postingan ini:', post);
  }
};


const bookmarkedPosts = ref([]);
// --- BARU: Kunci untuk menyimpan data di localStorage ---
const BOOKMARK_STORAGE_KEY = 'vue-bookmarked-posts';


const ICONS = {
  x: 'fab fa-x-twitter text-[#03255C]',
  facebook: 'fab fa-facebook-f text-blue-600',
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


// --- BARU: Fungsi untuk menyimpan bookmark ke localStorage ---
const saveBookmarks = () => {
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarkedPosts.value));
};

// --- DIUBAH: Fungsi untuk memuat bookmark dengan penanganan error ---
const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  if (savedBookmarks) {
    try {
      const parsedData = JSON.parse(savedBookmarks);
      // Pastikan data yang di-parse adalah sebuah array
      if (Array.isArray(parsedData)) {
        bookmarkedPosts.value = parsedData;
      } else {
        // Jika data valid JSON tapi bukan array, anggap saja kosong
        console.warn('Data bookmark yang dimuat bukan array, direset menjadi kosong.');
        bookmarkedPosts.value = [];
      }
    } catch (error) {
      // Jika JSON.parse gagal, beri tahu developer dan reset state
      console.error('Gagal memuat bookmark dari localStorage. Data mungkin rusak:', error);
      bookmarkedPosts.value = []; // Atur ke array kosong agar aplikasi tidak crash
      localStorage.removeItem(BOOKMARK_STORAGE_KEY); // Opsional: Hapus data yang rusak
    }
  }
};

// --- DIUBAH: Fungsi toggleBookmark sekarang melakukan sinkronisasi dua arah ---
const toggleBookmark = (post) => {
  const postIndex = bookmarkedPosts.value.findIndex(p => p.id === post.id);
  let isNowBookmarked; // Variabel untuk menyimpan status baru

  if (postIndex === -1) {
    // Kasus: Menambahkan bookmark baru
    post.isBookmarked = true;
    isNowBookmarked = true;
    bookmarkedPosts.value.unshift(post);
  } else {
    // Kasus: Menghapus bookmark
    post.isBookmarked = false;
    isNowBookmarked = false;
    bookmarkedPosts.value.splice(postIndex, 1);
  }

  // --- SINKRONISASI DUA ARAH ---
  // Cari postingan yang sama di kolom data asli (Engagement/Followers)
  // dan pastikan status isBookmarked-nya juga diperbarui.
  for (const column of columnsData.value) {
    const originalPost = column.posts.find(p => p.id === post.id);
    if (originalPost) {
      originalPost.isBookmarked = isNowBookmarked;
      break; // Hentikan pencarian jika sudah ditemukan
    }
  }
  // --- AKHIR SINKRONISASI ---

  // Simpan perubahan ke localStorage setiap kali ada aksi
  saveBookmarks();
};


// Logika Paginasi (Tidak berubah)
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
  const statusKey = apiPost.latest_status || 'N/A';
  const statusData = STATUS_MAPPING[statusKey] || STATUS_MAPPING['N/A'];
  const formatNumber = (num) => {
    if (typeof num !== 'number') return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString('en-US');
  };
  const dateString = apiPost.created_at ? new Date(apiPost.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Tanggal tidak tersedia';
  return {
    id: apiPost.tweet_id || postId, author: apiPost.user?.screen_name || 'Anonim', avatar: apiPost.user?.profile_image_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    socialIcon: ICONS.x, stats: { followers: formatNumber(apiPost.user?.followers_count), following: formatNumber(apiPost.user?.following_count), retweets: formatNumber(apiPost.retweet_count), favorites: formatNumber(apiPost.favorite_count), replies: formatNumber(apiPost.reply_count), views: formatNumber(apiPost.views_count), engagement: formatNumber(apiPost.engagement), },
    date: dateString, postStatus: statusData.title, statusColor: statusData.color, content: apiPost.text || 'Tidak ada konten.',
    topicTag: apiPost.topik || 'N/A', isBookmarked: false, url: `https://x.com/any/status/${apiPost.tweet_id}`
  };
};
const callApi = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status} for ${url}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch data from ${url}:`, error);
    throw error;
  }
};

const fetchPostsData = async (startDate, endDate) => {
  // Bangun URL dengan parameter tanggal
  const ENGAGEMENT_URL = `http://127.0.0.1:8000/posts-by-engagement?start_date=${startDate}&end_date=${endDate}`;
  const FOLLOWERS_URL = `http://127.0.0.1:8000/posts-by-followers?start_date=${startDate}&end_date=${endDate}`;

  let engagementPosts = [];
  let followersPosts = [];
  let errorMessages = [];
  isLoading.value = true;
  apiError.value = null;

  try {
    const data = await callApi(ENGAGEMENT_URL);
    const apiPostsArray = data.posts_by_engagement;
    if (apiPostsArray && apiPostsArray.length > 0) {
      engagementPosts = apiPostsArray.map((post, index) => mapApiPostToLocalPost(post, `engage-${index}`));
    }
  } catch (e) {
    errorMessages.push(`Engagement: ${e.message}`);
    engagementPosts = Array.from({ length: 10 }, (_, i) => createDummyPost(i + 1, 'x'));
  }
  try {
    const data = await callApi(FOLLOWERS_URL);
    const apiPostsArray = data.posts_by_followers;
    if (apiPostsArray && apiPostsArray.length > 0) {
      followersPosts = apiPostsArray.map((post, index) => mapApiPostToLocalPost(post, `foll-${index}`));
    }
  } catch (e) {
    errorMessages.push(`Followers: ${e.message}`);
    followersPosts = Array.from({ length: 10 }, (_, i) => createDummyPost(i + 1, 'facebook'));
  }

  if (errorMessages.length > 0) {
    apiError.value = errorMessages.join(' | ');
  }

  const bookmarkedIds = new Set(bookmarkedPosts.value.map(p => p.id));
  engagementPosts.forEach(p => { if (bookmarkedIds.has(p.id)) p.isBookmarked = true; });
  followersPosts.forEach(p => { if (bookmarkedIds.has(p.id)) p.isBookmarked = true; });

  columnsData.value = [{
    title: 'Posts From Highest Engagement', posts: engagementPosts,
    pagination: { total: engagementPosts.length, currentPage: 1, perPage: 5 }
  }, {
    title: 'Posts From Highest Followers', posts: followersPosts,
    pagination: { total: followersPosts.length, currentPage: 1, perPage: 5 }
  }];
  isLoading.value = false;
};

// 4. BUAT FUNGSI BARU untuk membungkus pemanggilan data
function loadAllData() {
  fetchPostsData(filters.startDate, filters.endDate);
}

// 5. GUNAKAN 'watch' untuk memanggil loadAllData setiap kali tanggal di store berubah
watch(filters, (newFilters) => {
  console.log(`Filter tanggal berubah ke: ${newFilters.startDate} - ${newFilters.endDate}. Memuat ulang data Hight.vue...`);
  loadAllData();
});

const allColumns = computed(() => {
  const bookmarkedColumn = {
    title: 'Posts From Marked Accounts', // Judul diubah agar lebih umum
    posts: bookmarkedPosts.value,
    pagination: {
      total: bookmarkedPosts.value.length,
      currentPage: 1,
      perPage: 5
    }
  };

  return [...columnsData.value, bookmarkedColumn];
});

// --- DIUBAH: onMounted sekarang memuat data dari localStorage terlebih dahulu ---
onMounted(() => {
  loadBookmarks();
  console.log('Komponen Hight.vue dimuat, mengambil data awal...');
  loadAllData();
});
</script>


<style scoped>
/* Style tidak berubah */
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