<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[30rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600">Memuat data analisis...</p>
  </div>

  <div v-else class="space-y-6 animate-fade-in">
    <div
      class="bg-white p-4 rounded-xl border border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)] flex items-center justify-start gap-8">
      <span class="text-sm font-semibold text-gray-600">Filter Analysis by</span>

      <div class="relative flex-grow max-w-xs">
        <label for="topic-filter" class="text-xs text-gray-500 absolute -top-2 left-2 bg-white px-1 z-10">Pilih
          Topik</label>
        <select id="topic-filter"
          class="border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-300 w-full">
          <option>Semua Topik</option>
          <option>Kereta Api</option>
          <option>Komisaris</option>
          <option>Presiden</option>
        </select>
      </div>

      <div class="relative flex-grow max-w-xs">
        <label for="platform-filter"
          class="text-xs text-gray-500 absolute -top-2 left-2 bg-white px-1 z-10">Platform</label>
        <div class="flex items-center border border-gray-300 rounded-lg px-3 py-2 w-full">
          <div class="flex items-center gap-2 text-gray-600">
            <i class="fab fa-facebook-f text-blue-600 h-5 w-5 flex items-center justify-center text-sm"></i>
            <i class="fab fa-youtube text-red-600 h-5 w-5 flex items-center justify-center text-sm"></i>
            <i class="fab fa-tiktok text-black h-5 w-5 flex items-center justify-center text-sm"></i>
            <i class="fab fa-instagram text-pink-600 h-5 w-5 flex items-center justify-center text-sm"></i>
            <i class="fab fa-x-twitter text-gray-800 h-5 w-5 flex items-center justify-center text-sm"></i>
          </div>
          <select id="platform-filter" class="w-full absolute inset-0 opacity-0"></select>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 text-white">
      <div v-for="card in summaryCards" :key="card.title"
        :class="[card.color, 'rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center']">
        <h4 class="font-semibold">{{ card.title }}</h4>
        <p class="text-5xl font-bold mt-2">{{ card.value }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)]">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Analisis Topik</h3>
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
import { ref, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const isLoading = ref(true);
const summaryCards = ref([]);
const lineChartData = ref({ labels: [], datasets: [] });

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

const fetchAnalysisData = () => {
  setTimeout(() => {
    summaryCards.value = [
      { title: 'Total Normal Posts', value: 123, color: 'bg-blue-500' },
      { title: 'Total Early Posts', value: 54, color: 'bg-green-500' },
      { title: 'Total Emerging Posts', value: 45, color: 'bg-yellow-400' },
      { title: 'Total Current Posts', value: 39, color: 'bg-orange-500' },
      { title: 'Total Crisis Posts', value: 12, color: 'bg-red-600' },
    ];

    lineChartData.value = {
      labels: ['00.00', '06.00', '06.00', '03.00', '12.00', '15.00', '00.00', '06.00', '06.00', '09.00', '09.00', '12.00', '18.00', '20.00', '23.00'],
      datasets: [
        { label: 'Crisis', data: [700, 680, 500, 550, 750, 700, 600, 620, 580, 650, 700, 600, 620, 650, 680], borderColor: '#ef4444', tension: 0.4, borderWidth: 2.5 },
        { label: 'Current', data: [800, 820, 850, 800, 780, 880, 900, 850, 780, 800, 750, 780, 800, 780, 820], borderColor: '#f97316', tension: 0.4, borderWidth: 2.5 },
        { label: 'Emerging', data: [750, 800, 780, 820, 850, 820, 780, 750, 800, 880, 820, 750, 780, 800, 750], borderColor: '#eab308', tension: 0.4, borderWidth: 2.5 },
        { label: 'Early', data: [780, 750, 700, 720, 680, 750, 700, 680, 700, 720, 680, 700, 720, 750, 780], borderColor: '#22c55e', tension: 0.4, borderWidth: 2.5 },
        { label: 'Normal', data: [600, 650, 700, 680, 720, 750, 720, 680, 700, 750, 780, 700, 650, 680, 700], borderColor: '#3b82f6', tension: 0.4, borderWidth: 2.5 },
      ]
    };

    isLoading.value = false;
  }, 1200);
};

onMounted(fetchAnalysisData);
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

<!-- nusdhoijewfhygewkfq -->