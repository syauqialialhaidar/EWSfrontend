<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[30rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600 dark:text-gray-300">Memuat data analisis...</p>
  </div>

  <div v-else class="space-y-6 animate-fade-in">

    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-wrap items-center justify-start gap-4 z-20 relative">
      <h3 class="text-sm font-bold text-[#03255C] dark:text-gray-100 whitespace-nowrap">Filter Analisis:</h3>

      <div class="relative min-w-[200px]" ref="topicDropdownEl">
        <button @click.stop="isTopicDropdownOpen = !isTopicDropdownOpen"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors">
          <span class="font-medium text-gray-700 dark:text-gray-200 truncate mr-2">{{ selectedTopic }}</span>
          <FontAwesomeIcon :icon="faChevronDown" class="w-4 h-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': isTopicDropdownOpen }" />
        </button>
        <transition name="dropdown-fade">
          <div v-if="isTopicDropdownOpen"
            class="absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
            <ul>
              <li v-for="topic in topicOptions" :key="topic" @click="selectTopic(topic)"
                class="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-0 border-gray-100 dark:border-gray-700">
                {{ topic }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <div class="relative min-w-[220px]" ref="platformDropdownEl">
        <button @click.stop="isPlatformDropdownOpen = !isPlatformDropdownOpen"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors">
          <span class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
            <FontAwesomeIcon :icon="selectedPlatform.icon" :class="[selectedPlatform.color, 'h-4 w-4']" />
            <span>{{ selectedPlatform.name }}</span>
          </span>
          <FontAwesomeIcon :icon="faChevronDown" class="w-4 h-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': isPlatformDropdownOpen }" />
        </button>
        <transition name="dropdown-fade">
          <div v-if="isPlatformDropdownOpen"
            class="absolute z-30 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
            <ul>
              <li v-for="platform in platformOptions" :key="platform.name" @click="selectPlatform(platform)"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer border-b last:border-0 border-gray-100 dark:border-gray-700">
                <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-4 w-4']" />
                <span>{{ platform.name }}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      <div v-for="card in summaryCards" :key="card.key" :class="[card.gradient,
        'relative p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between h-36 overflow-hidden cursor-pointer'
      ]" @click="openCardModal(card)">
        <FontAwesomeIcon :icon="card.icon" class="absolute -right-3 -bottom-3 text-white/10 text-7xl" />
        <div>
          <p class="text-base font-bold">{{ card.title }}</p>
        </div>
        <p class="text-4xl font-bold text-right">{{ card.value }}</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 class="text-xl font-bold text-[#03255C] dark:text-gray-100">Tren Analisis Topik</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Pergerakan jumlah postingan berdasarkan status dari
        waktu ke waktu.</p>
      <div class="h-80">
        <Line :data="lineChartData" :options="lineChartOptions" />
      </div>
      <div class="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4">
        <div v-for="item in lineChartData.datasets" :key="item.label" class="flex items-center text-sm">
          <span :style="{ backgroundColor: item.borderColor }" class="w-3 h-3 rounded-full mr-2"></span>
          <span class="font-semibold text-gray-700 dark:text-gray-300">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalOpen"
        class="fixed inset-0 z-[9999] flex items-center justify-center p-4 perspective-container">
        <div class="fixed inset-0 bg-gray-900/90 backdrop-blur-sm transition-opacity" @click="closeModal"></div>

        <div v-if="activeCard" :class="[
          activeCard.gradient,
          'animate-flip-zoom',
          'relative z-10 flex flex-col w-full max-w-4xl h-[85vh] overflow-hidden text-left shadow-2xl rounded-2xl text-white'
        ]">
          <FontAwesomeIcon :icon="activeCard.icon"
            class="absolute -right-20 -bottom-20 text-white/10 text-[20rem] rotate-12 pointer-events-none" />

          <div
            class="relative z-20 p-6 pb-4 border-b border-white/20 flex justify-between items-start bg-black/10 backdrop-blur-md">
            <div>
              <h3 class="text-3xl font-bold flex items-center gap-3 mb-1">
                <FontAwesomeIcon :icon="activeCard.icon" />
                Status: {{ activeCard.title }}
              </h3>
              <p class="text-white/80 text-sm">Daftar postingan yang terdeteksi dalam kategori ini.</p>
            </div>

            <div class="flex items-center gap-6">
              <div class="text-right hidden sm:block">
                <div class="text-3xl font-bold tracking-tight leading-none font-mono">{{ currentTime }}</div>
                <div class="text-xs font-medium text-white/70 mt-1">{{ currentDate }}</div>
              </div>
              <div class="hidden sm:block w-px h-10 bg-white/20"></div>
              <div class="text-right">
                <p class="text-xs uppercase tracking-wider opacity-70">Total Data</p>
                <p class="text-3xl font-bold leading-none">{{ activeCard.value }}</p>
              </div>
              <button @click="closeModal"
                class="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors ml-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div class="relative z-20 flex-1 overflow-y-auto bg-white/5 custom-scrollbar">
            <div v-if="isLoadingDetails" class="flex flex-col items-center justify-center h-full text-white/70 p-6">
              <div class="loader mb-4 border-white border-t-transparent"></div>
              <p>Mengambil detail postingan...</p>
            </div>

            <div v-else-if="activePosts.length === 0"
              class="flex flex-col items-center justify-center h-full text-white/60 p-6">
              <FontAwesomeIcon :icon="activeCard.icon" class="text-6xl mb-4 opacity-50" />
              <p class="text-lg">Belum ada detail data untuk status ini.</p>
            </div>

            <div v-else>
              <div
                class="sticky top-0 z-30 flex justify-between items-center border-b border-white/20 backdrop-blur-sm p-6 shadow-lg transition-colors duration-300"
                :class="{
                  'bg-blue-600/95': activeCard.key === 'normal',
                  'bg-green-600/95': activeCard.key === 'early',
                  'bg-yellow-600/95': activeCard.key === 'emerging',
                  'bg-orange-600/95': activeCard.key === 'current',
                  'bg-red-700/95': activeCard.key === 'crisis'
                }">
                <div class="text-sm text-white/90 font-medium">
                  Halaman <span class="font-bold">{{ pagination.currentPage }}</span> dari {{ pagination.totalPages }}
                  <span class="text-white/70 font-normal ml-1">(Total: {{ pagination.total }})</span>
                </div>
                <div class="flex gap-2">
                  <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm transition-colors text-white border border-white/10 shadow-sm">
                    Sebelumnya
                  </button>
                  <button @click="changePage(pagination.currentPage + 1)"
                    :disabled="pagination.currentPage >= pagination.totalPages"
                    class="px-4 py-2 bg-white/20 hover:bg-white/30 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-sm transition-colors text-white border border-white/10 shadow-sm">
                    Selanjutnya
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 px-6 pb-6 pt-4">
                <div v-for="(post, index) in activePosts" :key="index"
                  class="bg-white text-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 border-l-4"
                  :class="{
                    'border-blue-500': activeCard.key === 'normal',
                    'border-green-500': activeCard.key === 'early',
                    'border-yellow-500': activeCard.key === 'emerging',
                    'border-orange-500': activeCard.key === 'current',
                    'border-red-600': activeCard.key === 'crisis'
                  }">
                  <div class="flex justify-between items-start mb-3">
                    <div class="flex items-center gap-3">
                      <img :src="post.user?.profile_image_url || 'https://via.placeholder.com/40'" alt="Avatar"
                        class="w-10 h-10 rounded-full object-cover border border-gray-200"
                        @error="$event.target.src = 'https://via.placeholder.com/40'" />
                      <div>
                        <p class="font-bold text-sm leading-tight">{{ post.user?.name || 'Anonim' }}</p>
                        <p class="text-xs text-gray-500">@{{ post.user?.screen_name || 'unknown' }}</p>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span
                        class="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 capitalize flex items-center gap-1">
                        <FontAwesomeIcon :icon="getPlatformIcon(post.platform)" />
                        {{ post.platform }}
                      </span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700 mb-3 line-clamp-3 leading-relaxed">
                    {{ post.text_content || 'Tidak ada konten teks.' }}
                  </p>
                  <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div class="flex gap-4 text-xs text-gray-500">
                      <span class="flex items-center gap-1">
                        <FontAwesomeIcon :icon="faChartBar" /> {{ post.engagement?.toLocaleString() || 0 }}
                      </span>
                      <span class="flex items-center gap-1">
                        <FontAwesomeIcon :icon="faCalendarAlt" />
                        {{ post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID') : '-' }}
                      </span>
                    </div>
                    <a :href="post.url" target="_blank"
                      class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline">
                      Lihat Post <FontAwesomeIcon :icon="faExternalLinkAlt" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <div class="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <div class="mb-6">
        <h3 class="text-xl font-bold text-[#03255C] dark:text-gray-100">Detail Akun Terdeteksi</h3>
        <p class="text-sm text-gray-500 dark:text-gray-400">Daftar akun terbaru yang berkontribusi pada grafik analisis di atas.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div v-for="col in accountColumns" :key="col.key" 
             class="rounded-lg border flex flex-col h-[500px] bg-gray-50 dark:bg-gray-900/50"
             :class="[col.borderColor, isLoadingPreviews ? 'opacity-50' : 'opacity-100']">
          
          <div class="p-3 border-b text-center bg-white dark:bg-gray-800 rounded-t-lg" :class="col.borderColor">
            <h4 class="font-bold text-sm" :class="col.textColor">
              {{ col.title }} 
              <span v-if="isLoadingPreviews" class="ml-2 animate-pulse">...</span>
            </h4>
          </div>

          <div class="p-2 overflow-y-auto custom-scrollbar flex-1 space-y-3">
            
            <div v-if="!isLoadingPreviews && col.accounts.length === 0" class="h-full flex flex-col items-center justify-center text-gray-400 italic text-xs">
              <p>Tidak ada data</p>
            </div>

            <div v-else v-for="(post, idx) in col.accounts" :key="idx" 
                 class="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              
              <div class="flex items-start gap-3 mb-3">
                <div class="relative flex-shrink-0">
                   <img :src="post.user?.profile_image_url || 'https://via.placeholder.com/40'" 
                        class="w-10 h-10 rounded-full object-cover border border-gray-200" 
                        @error="$event.target.src = 'https://via.placeholder.com/40'" />
                   <div class="absolute -bottom-1 -right-1 bg-white dark:bg-gray-700 rounded-full p-0.5 shadow-sm">
                      <FontAwesomeIcon :icon="getPlatformIcon(post.platform)" class="w-3 h-3" :class="getPlatformColor(post.platform)"/>
                   </div>
                </div>
                <div class="overflow-hidden min-w-0">
                  <p class="font-bold text-sm truncate text-gray-800 dark:text-gray-200" :title="post.user?.name">
                    {{ post.user?.name || 'No Name' }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">@{{ post.user?.screen_name || 'unknown' }}</p>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-1 text-center mb-3 py-2 border-y border-gray-100 dark:border-gray-700">
                <div>
                  <p class="text-[10px] text-gray-400 uppercase font-bold">Foll</p>
                  <p class="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {{ formatNumber(post.user?.followers_count || 0) }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-400 uppercase font-bold">Eng</p>
                  <p class="text-xs font-bold text-gray-700 dark:text-gray-300">
                    {{ formatNumber(post.engagement || 0) }}
                  </p>
                </div>
                <div>
                  <p class="text-[10px] text-gray-400 uppercase font-bold">Date</p>
                  <p class="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                     {{ post.created_at ? new Date(post.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'numeric'}) : '-' }}
                  </p>
                </div>
              </div>

              <a :href="post.url" target="_blank"
                 class="block w-full py-1.5 text-center text-xs font-medium bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 rounded transition-colors border border-gray-200 dark:border-gray-600">
                Lihat Post
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>



  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, reactive } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTiktok, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faChevronDown, faCheckCircle, faShieldAlt, faExclamationTriangle, faFire, faRadiation, faExternalLinkAlt, faCalendarAlt, faChartBar } from '@fortawesome/free-solid-svg-icons'

// Import Pinia stores
import { useFilterStore } from '@/stores/useFilterStore'
import { storeToRefs } from 'pinia'

// Get filter store
const filterStore = useFilterStore()
const { startDate, endDate } = storeToRefs(filterStore)

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

// --- KONFIGURASI API ---
const API_BASE_URL = 'http://154.26.134.72:8438';
const TOP_TOPICS_URL = `${API_BASE_URL}/top-topics`;
const SUMMARY_URL = `${API_BASE_URL}/analysis-summary`;
const TOPIC_TREND_URL = `${API_BASE_URL}/topic-trend-analysis`;
const POSTS_PAGINATION_URL = `${API_BASE_URL}/posts-by-status`; // Endpoint pagination baru

// --- STATE UTAMA DASHBOARD ---
const isLoading = ref(true);
const lineChartData = ref({ labels: [], datasets: [] });
const summaryCards = ref([
  { title: 'Normal Posts', value: '...', key: 'normal', icon: faCheckCircle, gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { title: 'Early Posts', value: '...', key: 'early', icon: faShieldAlt, gradient: 'bg-gradient-to-br from-green-500 to-green-600' },
  { title: 'Emerging Posts', value: '...', key: 'emerging', icon: faExclamationTriangle, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
  { title: 'Current Posts', value: '...', key: 'current', icon: faFire, gradient: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { title: 'Crisis Posts', value: '...', key: 'crisis', icon: faRadiation, gradient: 'bg-gradient-to-br from-red-600 to-red-700' },
]);

// --- STATE MODAL & PAGINATION ---
const isModalOpen = ref(false);
const activeCard = ref(null);
const isLoadingDetails = ref(false);
const activePosts = ref([]);
const pagination = reactive({
  currentPage: 1, limit: 10, total: 0, totalPages: 0
});

// --- STATE WAKTU (JAM) ---
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;


const isLoadingPreviews = ref(false);


const updateTime = () => {
  const now = new Date();
  // Format 24 jam (Titik dua)
  currentTime.value = now.toLocaleTimeString('en-GB', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  // Format Tanggal Indonesia
  currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

// --- DROPDOWN FILTER STATE ---
const isTopicDropdownOpen = ref(false);
const selectedTopic = ref('Semua Topik');
const topicOptions = ref(['Semua Topik']);
const topicDropdownEl = ref(null);
const isPlatformDropdownOpen = ref(false);
const platformOptions = ref([
  { name: 'Semua Platform', icon: faGlobe, color: 'text-gray-500' },
  { name: 'TikTok', icon: faTiktok, color: 'text-[#03255C]' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-600' },
  { name: 'X (Twitter)', icon: faXTwitter, color: 'text-[#03255C]' }
]);
const selectedPlatform = ref(platformOptions.value[0]);
const platformDropdownEl = ref(null);

// --- CHART OPTIONS ---
const lineChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { color: '#6b7280' }, grid: { color: '#e5e7eb' } },
    x: { ticks: { color: '#6b7280' }, grid: { display: false } }
  },
  interaction: { intersect: false, mode: 'index' },
};
const categoryStyles = {
  'Crisis': { borderColor: '#E60000' }, 'Current': { borderColor: '#FF9900' },
  'Emerging': { borderColor: '#AAD816' }, 'Early': { borderColor: '#28C76F' }, 'Normal': { borderColor: '#2092EC' },
};

const updateChartOptionsTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tickColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  lineChartOptions.scales.y.ticks.color = tickColor;
  lineChartOptions.scales.y.grid.color = gridColor;
  lineChartOptions.scales.x.ticks.color = tickColor;
};

// --- HELPERS ---
const getPlatformParam = () => {
  const platformName = selectedPlatform.value.name;
  if (platformName === 'Semua Platform') return 'all';
  return platformName.toLowerCase().replace(' (twitter)', '');
};

const getPlatformIcon = (platform) => {
  if (!platform) return faGlobe;
  const p = platform.toLowerCase();
  if (p.includes('twitter') || p.includes('x')) return faXTwitter;
  if (p.includes('instagram')) return faInstagram;
  if (p.includes('tiktok')) return faTiktok;
  return faGlobe;
};

// --- FETCH DATA UTAMA ---
const fetchSummaryData = async (startDate, endDate) => {
  summaryCards.value.forEach(card => card.value = '...');
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;
  const platformParam = getPlatformParam();

  try {
    // Gunakan endpoint summary-counts (yang ringan) jika ada, atau summary biasa
    // Disini pakai logic endpoint count agar konsisten dengan modal
    const url = `${API_BASE_URL}/analysis-summary-counts?topic=${encodeURIComponent(topicParam)}&platform=${platformParam}&start_date=${startDate}&end_date=${endDate}`;
    
    // Fallback ke URL SUMMARY_URL jika endpoint count belum disesuaikan di backend untuk menerima platform
    // Tapi idealnya backend sudah mendukung filter platform di semua endpoint
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    
    summaryCards.value.forEach(card => {
      // Data API bisa huruf kecil (normal) atau properti lain, sesuaikan
      card.value = data[card.key] !== undefined ? data[card.key] : (data[card.title] || 0);
    });
  } catch (error) {
    console.error("Gagal memuat summary:", error);
    summaryCards.value.forEach(card => card.value = 0);
  }
};

const fetchLineChartData = async (startDate, endDate) => {
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;
  const platformParam = getPlatformParam();

  try {
    const url = `${TOPIC_TREND_URL}?topic=${encodeURIComponent(topicParam)}&platform=${platformParam}&start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const styledDatasets = data.datasets.map(dataset => ({
      ...dataset,
      borderColor: categoryStyles[dataset.label]?.borderColor || '#cccccc',
      backgroundColor: (categoryStyles[dataset.label]?.borderColor || '#cccccc') + '30',
      tension: 0.4, borderWidth: 2.5, fill: true,
    }));
    lineChartData.value = { labels: data.labels, datasets: styledDatasets };
  } catch (error) {
    console.error("Gagal chart data:", error);
    lineChartData.value = { labels: [], datasets: [] };
  }
};

// --- FETCH DATA MODAL (PAGINATION) ---
const fetchPaginatedPosts = async (statusKey, page = 1) => {
  isLoadingDetails.value = true;
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;
  const platformParam = getPlatformParam();

  try {
    // statusKey biasanya 'normal', 'early' dst.
    const url = `${POSTS_PAGINATION_URL}?status=${statusKey}&topic=${encodeURIComponent(topicParam)}&platform=${platformParam}&page=${page}&limit=${pagination.limit}&start_date=${startDate.value}&end_date=${endDate.value}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Gagal fetch detail");
    const result = await response.json();

    activePosts.value = result.data;
    pagination.currentPage = result.meta.page;
    pagination.total = result.meta.total;
    pagination.totalPages = result.meta.total_pages;
  } catch (err) {
    console.error(err);
    activePosts.value = [];
  } finally {
    isLoadingDetails.value = false;
  }
};

const fetchTopicOptions = async (startDate, endDate) => {
  try {
    const url = `${TOP_TOPICS_URL}?start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(url);
    const data = await response.json();
    const fetchedTopicNames = (data.all_topics_with_top_posts || []).map(item => item.topic);
    topicOptions.value = ['Semua Topik', ...fetchedTopicNames];
    if (!topicOptions.value.includes(selectedTopic.value)) selectedTopic.value = 'Semua Topik';
  } catch (error) {
    topicOptions.value = ['Semua Topik'];
  }
};

function loadDashboardData() {
  isLoading.value = true;
  updateChartOptionsTheme();
  Promise.all([
    fetchSummaryData(startDate.value, endDate.value),
    fetchLineChartData(startDate.value, endDate.value),
    fetchAccountPreviews()
  ]).finally(() => isLoading.value = false);
}

// --- EVENT HANDLERS ---
const selectTopic = (topic) => { selectedTopic.value = topic; isTopicDropdownOpen.value = false; };
const selectPlatform = (platform) => { selectedPlatform.value = platform; isPlatformDropdownOpen.value = false; loadDashboardData(); };
const closeDropdowns = (event) => {
  if (topicDropdownEl.value && !topicDropdownEl.value.contains(event.target)) isTopicDropdownOpen.value = false;
  if (platformDropdownEl.value && !platformDropdownEl.value.contains(event.target)) isPlatformDropdownOpen.value = false;
};

// MODAL HANDLERS
const openCardModal = (card) => {
  activeCard.value = card;
  isModalOpen.value = true;
  activePosts.value = [];
  pagination.currentPage = 1;
  fetchPaginatedPosts(card.key, 1); // Gunakan card.key ('normal', dll)
};
const closeModal = () => {
  isModalOpen.value = false;
  setTimeout(() => activeCard.value = null, 300);
};
const changePage = (newPage) => {
  if (newPage < 1 || newPage > pagination.totalPages) return;
  fetchPaginatedPosts(activeCard.value.key, newPage);
};

const accountColumns = ref([
  { key: 'normal', title: 'Normal', borderColor: 'border-blue-500', textColor: 'text-blue-600', accounts: [] },
  { key: 'early', title: 'Early', borderColor: 'border-green-500', textColor: 'text-green-600', accounts: [] },
  { key: 'emerging', title: 'Emerging', borderColor: 'border-yellow-500', textColor: 'text-yellow-600', accounts: [] },
  { key: 'current', title: 'Current', borderColor: 'border-orange-500', textColor: 'text-orange-600', accounts: [] },
  { key: 'crisis', title: 'Crisis', borderColor: 'border-red-600', textColor: 'text-red-600', accounts: [] },
]);

// --- HELPER FORMAT NUMBER (ex: 24.4M) ---
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

const getPlatformColor = (platform) => {
  const p = (platform || '').toLowerCase();
  if (p.includes('twitter') || p.includes('x')) return 'text-black dark:text-white'; 
  if (p.includes('instagram')) return 'text-pink-500';
  if (p.includes('tiktok')) return 'text-black dark:text-white';
  return 'text-gray-400';
}

// --- FUNGSI UTAMA: FETCH DATA KE KOLOM ---
const fetchAccountPreviews = async () => {
  isLoadingPreviews.value = true;
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;
  const platformParam = getPlatformParam();

  // Kita akan melakukan 5 request sekaligus (Parallel) agar cepat
  // Menggunakan limit=5 atau 10 agar tidak berat, karena cuma preview
  const fetchPromises = accountColumns.value.map(async (col) => {
    try {
      const url = `${POSTS_PAGINATION_URL}?status=${col.key}&topic=${encodeURIComponent(topicParam)}&platform=${platformParam}&page=1&limit=10&start_date=${startDate.value}&end_date=${endDate.value}`;
      
      const response = await fetch(url);
      if (!response.ok) return []; // Jika error, kembalikan array kosong
      
      const result = await response.json();
      // Simpan data ke state kolom masing-masing
      col.accounts = result.data || []; 
    } catch (error) {
      console.error(`Error fetching ${col.key}:`, error);
      col.accounts = [];
    }
  });

  await Promise.all(fetchPromises);
  isLoadingPreviews.value = false;
};

// --- WATCHERS ---
watch(selectedTopic, () => loadDashboardData());
watch(selectedPlatform, () => loadDashboardData()); // Redundant jika selectPlatform manggil load, tapi aman
watch([startDate, endDate], async () => {
  isLoading.value = true;
  await fetchTopicOptions(startDate.value, endDate.value);
  loadDashboardData();
});

onMounted(async () => {
  await fetchTopicOptions(startDate.value, endDate.value);
  loadDashboardData();
  fetchTaggedAccounts();
  document.addEventListener('click', closeDropdowns);
  
  // Jam
  updateTime();
  timerInterval = setInterval(updateTime, 1000);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateChartOptionsTheme);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
  if (timerInterval) clearInterval(timerInterval);
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateChartOptionsTheme);
});
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spinner 1.5s linear infinite;
}
@keyframes spinner { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
.dropdown-fade-enter-active, .dropdown-fade-leave-active { transition: all 0.2s ease-out; }
.dropdown-fade-enter-from, .dropdown-fade-leave-to { opacity: 0; transform: translateY(-5px); }

.perspective-container { perspective: 1000px; }
@keyframes flip-zoom-in {
  0% { opacity: 0; transform: scale(0.5) rotateY(90deg) translateY(50px); }
  100% { opacity: 1; transform: scale(1) rotateY(0deg) translateY(0); }
}
.animate-flip-zoom {
  animation: flip-zoom-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  transform-style: preserve-3d; backface-visibility: hidden;
}
</style>