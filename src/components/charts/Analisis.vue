<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[30rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600 dark:text-gray-300">Memuat data analisis...</p>
  </div>

  <div v-else class="space-y-6 animate-fade-in">
    
    <div
      class="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-start gap-4">
      <h3 class="text-sm font-bold text-[#03255C] dark:text-gray-100 whitespace-nowrap">Filter Analisis:</h3>

      <div class="relative min-w-[200px]" ref="topicDropdownEl">
        <button @click.stop="isTopicDropdownOpen = !isTopicDropdownOpen"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <span class="font-medium text-gray-700 dark:text-gray-200">{{ selectedTopic }}</span>
          <FontAwesomeIcon :icon="faChevronDown" class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isTopicDropdownOpen }" />
        </button>
        <transition name="dropdown-fade">
          <div v-if="isTopicDropdownOpen"
            class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <ul>
              <li v-for="topic in topicOptions" :key="topic" @click="selectTopic(topic)"
                class="px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
                {{ topic }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <div class="relative min-w-[220px]" ref="platformDropdownEl">
        <button @click.stop="isPlatformDropdownOpen = !isPlatformDropdownOpen"
          class="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <span class="flex items-center gap-2 font-medium text-gray-700 dark:text-gray-200">
            <FontAwesomeIcon :icon="selectedPlatform.icon" :class="[selectedPlatform.color, 'h-4 w-4']" />
            <span>{{ selectedPlatform.name }}</span>
          </span>
           <FontAwesomeIcon :icon="faChevronDown" class="w-4 h-4 text-gray-500 transition-transform duration-200" :class="{ 'rotate-180': isPlatformDropdownOpen }" />
        </button>
        <transition name="dropdown-fade">
          <div v-if="isPlatformDropdownOpen"
            class="absolute z-20 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
            <ul>
              <li v-for="platform in platformOptions" :key="platform.name" @click="selectPlatform(platform)"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer">
                <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-4 w-4']" />
                <span>{{ platform.name }}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="card in summaryCards" :key="card.key" :class="[card.gradient,
        'relative p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between h-40 overflow-hidden'
      ]">
        <FontAwesomeIcon :icon="card.icon" class="absolute -right-4 -bottom-4 text-white/10 text-8xl" />
        <div>
          <p class="text-lg font-bold">{{ card.title }}</p>
        </div>
        <p class="text-5xl font-bold text-right">{{ card.value }}</p>
      </div>
    </div>

    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <h3 class="text-xl font-bold text-[#03255C] dark:text-gray-100">Tren Analisis Topik</h3>
      <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Pergerakan jumlah postingan berdasarkan status dari waktu ke waktu.</p>
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
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTiktok, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe, faChevronDown, faCheckCircle, faShieldAlt, faExclamationTriangle, faFire, faRadiation } from '@fortawesome/free-solid-svg-icons'
import { useFilterStore } from '@/stores'
import { useApi } from '@/composables/useApi'
import { ewsApi } from '@/api/ews.api'
import { logger } from '@/utils/logger'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const filterStore = useFilterStore()
const { loading: loadingSummary, execute: executeSummaryApi } = useApi()
const { loading: loadingTrend, execute: executeTrendApi } = useApi()
const { loading: loadingTopics, execute: executeTopicsApi } = useApi()

const isLoading = ref(true);
const lineChartData = ref({ labels: [], datasets: [] });

const summaryCards = ref([
  { title: 'Normal Posts', value: '...', key: 'normal', icon: faCheckCircle, gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { title: 'Early Posts', value: '...', key: 'early', icon: faShieldAlt, gradient: 'bg-gradient-to-br from-green-500 to-green-600' },
  { title: 'Emerging Posts', value: '...', key: 'emerging', icon: faExclamationTriangle, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
  { title: 'Current Posts', value: '...', key: 'current', icon: faFire, gradient: 'bg-gradient-to-br from-orange-500 to-orange-600' },
  { title: 'Crisis Posts', value: '...', key: 'crisis', icon: faRadiation, gradient: 'bg-gradient-to-br from-red-600 to-red-700' },
]);

const lineChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { 
    y: { 
      beginAtZero: true,
      ticks: { color: '#6b7280' }, 
      grid: { color: '#e5e7eb' } 
    }, 
    x: { 
      ticks: { color: '#6b7280' }, 
      grid: { display: false } 
    } 
  },
  interaction: { intersect: false, mode: 'index' },
};
const updateChartOptionsTheme = () => {
  const isDarkMode = document.documentElement.classList.contains('dark');
  const tickColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  
  lineChartOptions.scales.y.ticks.color = tickColor;
  lineChartOptions.scales.y.grid.color = gridColor;
  lineChartOptions.scales.x.ticks.color = tickColor;
};


const categoryStyles = {
  'Crisis': { borderColor: '#E60000' }, 'Current': { borderColor: '#FF9900' },
  'Emerging': { borderColor: '#AAD816' }, 'Early': { borderColor: '#28C76F' },
  'Normal': { borderColor: '#2092EC' },
};

const isTopicDropdownOpen = ref(false);
const selectedTopic = ref('Semua Topik');
const topicOptions = ref(['Semua Topik']);
const topicDropdownEl = ref(null);
const isPlatformDropdownOpen = ref(false);
const platformOptions = ref([
  { name: 'Semua Platform', icon: faGlobe, color: 'text-gray-500' }, { name: 'TikTok', icon: faTiktok, color: 'text-[#03255C]' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-600' }, { name: 'X (Twitter)', icon: faXTwitter, color: 'text-[#03255C]' }
]);
const selectedPlatform = ref(platformOptions.value[0]);
const platformDropdownEl = ref(null);

const fetchSummaryData = async (startDate, endDate) => {
  summaryCards.value.forEach(card => card.value = '...');
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;

  await executeSummaryApi(
    async () => {
      logger.info('Analisis (chart)', `Fetching summary: topic=${topicParam}, ${startDate} to ${endDate}`)

      const data = await ewsApi.analysis.getSummary({
        topic: topicParam,
        start_date: startDate,
        end_date: endDate
      })

      summaryCards.value.forEach(card => {
        card.value = data[card.key] !== undefined ? data[card.key] : 'N/A'
      })

      logger.info('Analisis (chart)', 'Summary data loaded successfully')
    },
    {
      showErrorNotification: true,
      errorMessage: 'Gagal memuat data summary analisis',
      onError: (err) => {
        logger.error('Analisis (chart)', 'Failed to fetch summary data:', err)
        summaryCards.value.forEach(card => card.value = 'N/A')
      }
    }
  )
};

const fetchLineChartData = async (startDate, endDate) => {
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;

  await executeTrendApi(
    async () => {
      logger.info('Analisis (chart)', `Fetching trend analysis: topic=${topicParam}, ${startDate} to ${endDate}`)

      const data = await ewsApi.analysis.getTrendAnalysis({
        topic: topicParam,
        start_date: startDate,
        end_date: endDate
      })

      const styledDatasets = data.datasets.map(dataset => ({
        ...dataset,
        borderColor: categoryStyles[dataset.label]?.borderColor || '#cccccc',
        backgroundColor: (categoryStyles[dataset.label]?.borderColor || '#cccccc') + '30',
        tension: 0.4,
        borderWidth: 2.5,
        fill: true,
      }))

      lineChartData.value = {
        labels: data.labels,
        datasets: styledDatasets
      }

      logger.info('Analisis (chart)', `Trend analysis loaded: ${data.datasets?.length || 0} datasets`)
    },
    {
      showErrorNotification: true,
      errorMessage: 'Gagal memuat data grafik tren',
      onError: (err) => {
        logger.error('Analisis (chart)', 'Failed to fetch trend data:', err)
        lineChartData.value = { labels: [], datasets: [] }
      }
    }
  )
};

const fetchTopicOptions = async (startDate, endDate) => {
  await executeTopicsApi(
    async () => {
      logger.info('Analisis (chart)', `Fetching topic options: ${startDate} to ${endDate}`)

      const data = await ewsApi.topTopics.getTopTopics({
        start_date: startDate,
        end_date: endDate
      })

      const fetchedTopicNames = (data.top_topics || []).map(item => item.topic)
      topicOptions.value = ['Semua Topik', ...fetchedTopicNames]

      if (!topicOptions.value.includes(selectedTopic.value)) {
        selectedTopic.value = 'Semua Topik'
      }

      logger.info('Analisis (chart)', `Topic options loaded: ${fetchedTopicNames.length} topics`)
    },
    {
      showErrorNotification: true,
      errorMessage: 'Gagal memuat daftar topik',
      onError: (err) => {
        logger.error('Analisis (chart)', 'Failed to fetch topic options:', err)
        topicOptions.value = ['Semua Topik', 'Gagal memuat...']
      }
    }
  )
};

function loadDashboardData() {
  isLoading.value = true;
  updateChartOptionsTheme();
  Promise.all([
    fetchSummaryData(filterStore.startDate, filterStore.endDate),
    fetchLineChartData(filterStore.startDate, filterStore.endDate)
  ]).finally(() => {
    isLoading.value = false;
  });
}

const selectTopic = (topic) => {
  selectedTopic.value = topic;
  isTopicDropdownOpen.value = false;
};
const selectPlatform = (platform) => { 
  selectedPlatform.value = platform;
  isPlatformDropdownOpen.value = false;
};
const closeDropdowns = (event) => {
  if (topicDropdownEl.value && !topicDropdownEl.value.contains(event.target)) {
    isTopicDropdownOpen.value = false;
  }
  if (platformDropdownEl.value && !platformDropdownEl.value.contains(event.target)) {
    isPlatformDropdownOpen.value = false;
  }
};

watch(selectedTopic, () => {
  logger.info('Analisis (chart)', `Topic changed to: ${selectedTopic.value}`)
  loadDashboardData();
});

watch(() => [filterStore.startDate, filterStore.endDate], async () => {
  logger.info('Analisis (chart)', 'Date filter changed, reloading data...')
  isLoading.value = true;
  await fetchTopicOptions(filterStore.startDate, filterStore.endDate);
  loadDashboardData();
});

onMounted(async () => {
  await fetchTopicOptions(filterStore.startDate, filterStore.endDate);
  loadDashboardData();
  document.addEventListener('click', closeDropdowns);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateChartOptionsTheme);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
  window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', updateChartOptionsTheme);
});
</script>

<style scoped>
.loader {
  border-top-color: #3498db;
  animation: spinner 1.5s linear infinite;
}
@keyframes spinner {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>