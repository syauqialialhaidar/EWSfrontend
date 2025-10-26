<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[30rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600">Memuat data analisis...</p>
  </div>

  <div v-else class="space-y-6 animate-fade-in">
    <!-- Bagian Filter -->
    <div
      class="bg-white p-4 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)] flex items-center justify-start gap-8">
      <span class="text-sm font-semibold text-gray-600">Filter Analysis by</span>

      <!-- Filter Topik Kustom -->
      <div class="relative min-w-[200px]" ref="topicDropdownEl">
        <label class="text-xs text-gray-500 absolute -top-2 left-2 bg-white px-1 z-10">Pilih Topik</label>
        <button @click.stop="isTopicDropdownOpen = !isTopicDropdownOpen"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
          <span>{{ selectedTopic }}</span>
          <svg class="w-4 h-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': isTopicDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <!-- Menu Dropdown Topik -->
        <transition name="dropdown-fade">
          <div v-if="isTopicDropdownOpen"
            class="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul>
              <li v-for="topic in topicOptions" :key="topic" @click="selectTopic(topic)"
                class="px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">
                {{ topic }}
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <!-- Filter Platform Kustom (DIPERBAIKI) -->
      <div class="relative min-w-[220px]" ref="platformDropdownEl">
        <label class="text-xs text-gray-500 absolute -top-2 left-2 bg-white px-1 z-10">Platform</label>
        <!-- Tombol Pemicu Dropdown (DIPERBAIKI) -->
        <button @click.stop="isPlatformDropdownOpen = !isPlatformDropdownOpen"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full flex justify-between items-center bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
          <span class="flex items-center gap-2">
            <!-- Ganti <i> dengan <FontAwesomeIcon> -->
            <FontAwesomeIcon :icon="selectedPlatform.icon"
              :class="[selectedPlatform.color, 'h-5 w-5 flex items-center justify-center text-sm']" />
            <span>{{ selectedPlatform.name }}</span>
          </span>
          <svg class="w-4 h-4 text-gray-500 transition-transform duration-200"
            :class="{ 'rotate-180': isPlatformDropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        <!-- Menu Dropdown Platform (DIPERBAIKI) -->
        <transition name="dropdown-fade">
          <div v-if="isPlatformDropdownOpen"
            class="absolute z-20 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul>
              <!-- Daftar Opsi (DIPERBAIKI) -->
              <li v-for="platform in platformOptions" :key="platform.name" @click="selectPlatform(platform)"
                class="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">
                <!-- Ganti <i> dengan <FontAwesomeIcon> -->
                <FontAwesomeIcon :icon="platform.icon"
                  :class="[platform.color, 'h-5 w-5 flex items-center justify-center text-sm']" />
                <span>{{ platform.name }}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
    <!-- Akhir Bagian Filter -->

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-white">
      <div v-for="card in summaryCards" :key="card.title" :class="[card.color,
        'p-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 text-white flex flex-col justify-center items-center aspect-square md:aspect-auto md:h-40'
      ]">
        <p class="text-base font-medium text-center">{{ card.title }}</p>
        <span class="text-5xl font-bold">{{ card.value }}</span>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
      <h3 class="text-lg font-bold text-[#03255C] mb-4">Analisis Topik</h3>
      <div class="h-80">
        <Line :data="lineChartData" :options="lineChartOptions" />
      </div>
      <div class="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mt-4">
        <div v-for="item in lineChartData.datasets" :key="item.label" class="flex items-center text-sm">
          <span :style="{ backgroundColor: item.borderColor }" class="w-3 h-3 rounded-full mr-2"></span>
          <span class="font-semibold text-gray-700">{{ item.label }}</span>
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
import { faTiktok, faFacebook, faYoutube, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// --- KONFIGURASI API ---
const API_BASE_URL = 'http://127.0.0.1:8000';
const TOP_TOPICS_URL = `${API_BASE_URL}/top-topics`;
const SUMMARY_URL = `${API_BASE_URL}/analysis-summary`;
const TOPIC_TREND_URL = `${API_BASE_URL}/topic-trend-analysis`; // BARU: Endpoint untuk data line chart

// --- STATE UTAMA ---
const isLoading = ref(true);
const lineChartData = ref({ labels: [], datasets: [] });

const summaryCards = ref([
  { title: 'Total Normal Posts', value: '...', color: 'bg-[#2092EC]', key: 'normal' },
  { title: 'Total Early Posts', value: '...', color: 'bg-[#28C76F]', key: 'early' },
  { title: 'Total Emerging Posts', value: '...', color: 'bg-[#AAD816]', key: 'emerging' },
  { title: 'Total Current Posts', value: '...', color: 'bg-[#FF9900]', key: 'current' },
  { title: 'Total Crisis Posts', value: '...', color: 'bg-[#E60000]', key: 'crisis' },
]);

// --- PENGATURAN GRAFIK ---
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, max: 1000 },
    x: { grid: { display: false } }
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
};

// BARU: Objek untuk mapping style agar konsisten
const categoryStyles = {
  'Crisis': { borderColor: '#E60000' },
  'Current': { borderColor: '#FF9900' },
  'Emerging': { borderColor: '#AAD816' },
  'Early': { borderColor: '#28C76F' },
  'Normal': { borderColor: '#2092EC' },
};


// --- LOGIKA DROPDOWN (Tidak ada perubahan di sini) ---
const isTopicDropdownOpen = ref(false);
const selectedTopic = ref('Semua Topik');
const topicOptions = ref(['Semua Topik']);
const topicDropdownEl = ref(null);

const isPlatformDropdownOpen = ref(false);
const platformOptions = ref([
  { name: 'Semua Platform', icon: faGlobe, color: 'text-gray-500' },
  { name: 'Facebook', icon: faFacebook, color: 'text-blue-600' },
  { name: 'YouTube', icon: faYoutube, color: 'text-red-600' },
  { name: 'TikTok', icon: faTiktok, color: 'text-[#03255C]' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-600' },
  { name: 'X (Twitter)', icon: faXTwitter, color: 'text-[#03255C]' }
]);
const selectedPlatform = ref(platformOptions.value[0]);
const platformDropdownEl = ref(null);


// --- FUNGSI PENGAMBILAN DATA ---

// Fungsi untuk mengambil data ringkasan kartu (Tidak ada perubahan)
const fetchSummaryData = async () => {
  summaryCards.value.forEach(card => card.value = '...');
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;
  try {
    const response = await fetch(`${SUMMARY_URL}?topic=${encodeURIComponent(topicParam)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    summaryCards.value.forEach(card => {
      card.value = data[card.key] !== undefined ? data[card.key] : 'N/A';
    });
  } catch (error) {
    console.error("Gagal memuat data summary:", error);
    summaryCards.value.forEach(card => card.value = 'N/A');
  }
};

// BARU: Fungsi khusus untuk mengambil data Line Chart
const fetchLineChartData = async () => {
  const topicParam = selectedTopic.value === 'Semua Topik' ? 'all' : selectedTopic.value;
  try {
    const response = await fetch(`${TOPIC_TREND_URL}?topic=${encodeURIComponent(topicParam)}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    // Asumsikan response API: { labels: [...], datasets: [{label: 'Crisis', data: [...]}, ...] }
    const data = await response.json();

    // Tambahkan style ke setiap dataset yang diterima dari API
    const styledDatasets = data.datasets.map(dataset => ({
      ...dataset,
      borderColor: categoryStyles[dataset.label]?.borderColor || '#cccccc', // Ambil warna dari map, fallback ke abu-abu
      tension: 0.4,
      borderWidth: 2.5,
    }));

    lineChartData.value = {
      labels: data.labels,
      datasets: styledDatasets
    };

  } catch (error) {
    console.error("Gagal memuat data line chart:", error);
    // Jika gagal, tampilkan grafik kosong
    lineChartData.value = { labels: [], datasets: [] };
  }
};


// MODIFIKASI: Fungsi ini sekarang hanya mengambil daftar topik
const fetchInitialData = async () => {
  try {
    const response = await fetch(TOP_TOPICS_URL);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    const fetchedTopicNames = (data.top_topics || []).map(item => item.topic);
    topicOptions.value = ['Semua Topik', ...fetchedTopicNames];

  } catch (error) {
    console.error("Gagal memuat daftar topik:", error);
    topicOptions.value = ['Semua Topik', 'Gagal memuat...'];
  }
  // Data dummy dan isLoading dipindahkan ke onMounted
};


// --- EVENT HANDLERS (Tidak ada perubahan di sini) ---
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

// MODIFIKASI: 'watch' sekarang juga memanggil fetchLineChartData
watch(selectedTopic, () => {
  fetchSummaryData();
  fetchLineChartData(); // Panggil fungsi untuk update grafik
});


// --- LIFECYCLE HOOKS ---
// MODIFIKASI: onMounted sekarang mengatur semua pemanggilan data awal
onMounted(async () => {
  await fetchInitialData(); // 1. Ambil daftar topik dulu

  // 2. Ambil data summary & chart secara bersamaan untuk topik default "Semua Topik"
  await Promise.all([
    fetchSummaryData(),
    fetchLineChartData()
  ]);

  isLoading.value = false; // 3. Sembunyikan loader setelah semua data siap
  document.addEventListener('click', closeDropdowns);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdowns);
});
</script>

<style scoped>
/* CSS lainnya tetap sama */
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
