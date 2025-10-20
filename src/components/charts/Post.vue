<template>
  <div class="space-y-6">

    <!-- Bagian Statistik Total & Viral -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="card in summaryStatistics"
        :key="card.key"
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)]"
      >
        <div class="grid grid-cols-2 gap-4 mb-4">
          
          <!-- Total Posts -->
          <div class="border border-gray-400 rounded-lg p-4 flex items-center justify-center h-full">
            <div class="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="w-10 h-10 text-gray-400">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <div>
                <div v-if="isLoading[card.key]" class="text-gray-500">Memuat...</div>
                <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal</div>
                <div v-else-if="card.apiData" class="flex items-center gap-2">
                  <span class="text-3xl font-bold text-gray-800">
                    {{ card.apiData.total }}
                  </span>
                </div>
                <p class="text-sm text-blue-900 font-semibold mt-1">
                  {{ card.totalTitle }}
                </p>
              </div>
            </div>
          </div>

          <!-- Negative Posts -->
          <div class="border border-gray-400 rounded-lg p-4 flex items-center justify-center h-full">
            <div class="flex items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor"
                   stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   class="w-10 h-10 text-red-500">
                <line x1="12" y1="20" x2="12" y2="10"></line>
                <line x1="18" y1="20" x2="18" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="16"></line>
              </svg>
              <div>
                <div v-if="isLoading[card.key]" class="text-gray-500">Memuat...</div>
                <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal</div>
                <div v-else-if="card.apiData" class="flex items-center gap-2">
                  <span class="text-3xl text-red-600 font-bold text-gray-800">
                    {{ card.apiData.negative }}
                  </span>
                </div>
                <p :class="['text-sm font-semibold mt-1', card.negativeTextClass]">
                  {{ card.negativeTitle }}
                </p>
              </div>
            </div>
          </div>

        </div>

        <!-- Pie Chart -->
        <div class="h-64 w-full flex justify-center items-center">
          <div v-if="isLoading[card.key]" class="text-gray-500">Memuat chart...</div>
          <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal memuat chart</div>
          <Pie
            v-else-if="card.apiData && card.apiData.total > 0"
            :data="card.chartData"
            :options="chartOptions"
          />
          <div v-else class="text-gray-500">Tidak ada data untuk ditampilkan</div>
        </div>
      </div>
    </div>

    <!-- Bagian Recently In & Viral -->
    <div>
      <h3 class="text-lg font-semibold text-gray-700">Recently In & Viral</h3>
      <p class="text-sm text-gray-500">status, topik, terkini</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
      <div
        v-for="card in summaryCards"
        :key="card.title"
        :class="[card.bgColor,
          'p-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 text-white flex flex-col justify-center items-center aspect-square md:aspect-auto md:h-40'
        ]"
      >
        <p class="text-base font-medium text-center">{{ card.title }}</p>
        <span class="text-5xl font-bold">{{ card.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// State
const totalApiData = ref(null);
const viralApiData = ref(null);
const isLoading = reactive({ total: true, viral: true });
const error = reactive({ total: null, viral: null });

// Chart data
const leftChartData = ref({
  labels: [],
  datasets: [{ backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'], data: [], borderWidth: 0 }]
});
const rightChartData = ref({
  labels: [],
  datasets: [{ backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'], data: [], borderWidth: 0 }]
});

// Computed property
const summaryStatistics = computed(() => [
  {
    key: 'total',
    apiData: totalApiData.value,
    chartData: leftChartData.value,
    totalTitle: 'Total Post Keseluruhan',
    negativeTitle: 'Total Post Negatif',
    negativeTextClass: 'text-red-600'
  },
  {
    key: 'viral',
    apiData: viralApiData.value,
    chartData: rightChartData.value,
    totalTitle: 'Total Post Viral',
    negativeTitle: 'Total Post Negatif Viral',
    negativeTextClass: 'text-red-600'
  }
]);

// Fetch total data
async function fetchTotalData() {
  try {
    const response = await fetch('http://154.26.134.72:8031/api/analytics/total-posts');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    totalApiData.value = data;
    leftChartData.value.labels = ['Positif', 'Negatif', 'Netral'];
    leftChartData.value.datasets[0].data = [data.positive, data.negative, data.neutral];
  } catch (err) {
    error.total = err.message;
  } finally {
    isLoading.total = false;
  }
}

// Fetch viral data
async function fetchViralData() {
  try {
    const response = await fetch('http://154.26.134.72:8031/api/analytics/viral-posts');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    viralApiData.value = data;
    rightChartData.value.labels = ['Positif', 'Negatif', 'Netral'];
    rightChartData.value.datasets[0].data = [data.positive, data.negative, data.neutral];
  } catch (err) {
    error.viral = err.message;
  } finally {
    isLoading.viral = false;
  }
}

// Mount
onMounted(() => {
  console.log('Komponen dimuat sekali ✅');
  fetchTotalData();
  fetchViralData();
});

// Chart options
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
    }
  }
};

// Summary cards data
const summaryCards = [
  { title: 'Total Normal Posts', value: 123, bgColor: 'bg-blue-500' },
  { title: 'Total Early Posts', value: 54, bgColor: 'bg-green-500' },
  { title: 'Total Emerging Posts', value: 45, bgColor: 'bg-yellow-500' },
  { title: 'Total Current Posts', value: 39, bgColor: 'bg-orange-500' },
  { title: 'Total Crisis Posts', value: 12, bgColor: 'bg-red-600' }
];
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
</style>
