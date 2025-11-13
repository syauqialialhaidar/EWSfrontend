<template>
    <div class="space-y-6">

        <div>
            <h3 class="text-xl font-bold text-[#03255C]">Ringkasan Status Postingan</h3>
            <p class="text-sm text-gray-500">Distribusi postingan berdasarkan status deteksi dini.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-if="isLoading.analysis" class="text-gray-500 col-span-5 text-center py-10">Memuat status posts...</div>
            <div v-else-if="error.analysis" class="text-red-500 col-span-5 text-center py-10">Gagal memuat status: {{ error.analysis }}</div>
            <div v-else v-for="card in analysisCards" :key="card.title" :class="[card.gradient, 'relative p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between h-40 overflow-hidden']">
                <FontAwesomeIcon :icon="card.icon" class="absolute -right-4 -bottom-4 text-white/10 text-8xl" />
                <div><p class="text-lg font-bold">{{ card.title }}</p></div>
                <p class="text-5xl font-bold text-right">{{ card.value }}</p>
            </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 class="text-lg font-bold text-[#03255C] mb-1">Analisis Sentimen (Semua Post)</h3>
                <p class="text-sm text-gray-500 mb-4">Distribusi sentimen dari semua postingan unik.</p>
                
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                    <div class="text-center bg-gray-100 text-gray-800 rounded-lg p-2 border border-gray-300">
                        <p class="text-xs font-semibold">TOTAL POST</p>
                        <p class="text-2xl font-bold">{{ totalApiData?.total || 0 }}</p>
                    </div>
                    <div class="text-center bg-green-50 text-green-800 rounded-lg p-2">
                        <p class="text-xs font-semibold">POSITIF</p>
                        <p class="text-2xl font-bold">{{ totalApiData?.positive || 0 }}</p>
                    </div>
                    <div class="text-center bg-red-50 text-red-800 rounded-lg p-2">
                        <p class="text-xs font-semibold">NEGATIF</p>
                        <p class="text-2xl font-bold">{{ totalApiData?.negative || 0 }}</p>
                    </div>
                    <div class="text-center bg-blue-50 text-blue-800 rounded-lg p-2">
                        <p class="text-xs font-semibold">NETRAL</p>
                        <p class="text-2xl font-bold">{{ totalApiData?.neutral || 0 }}</p>
                    </div>
                </div>

                <div class="h-48 w-full flex justify-center items-center">
                    <div v-if="isLoading.total" class="text-gray-500">Memuat chart...</div>
                    <div v-else-if="error.total" class="text-red-500 text-sm">Gagal memuat chart</div>
                    <Pie v-else-if="totalApiData && totalApiData.total > 0" :data="sentimentChartData" :options="pieChartOptions" />
                    <div v-else class="text-gray-500">Tidak ada data sentimen</div>
                </div>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 class="text-lg font-bold text-[#03255C] mb-1">Sentimen Postingan Viral</h3>
                <p class="text-sm text-gray-500 mb-4">Breakdown sentimen dari total postingan viral.</p>

                <div class="grid grid-cols-3 gap-2 mb-4">
                    <div class="text-center bg-orange-50 text-orange-800 rounded-lg p-2">
                        <p class="text-xs font-semibold">TOTAL VIRAL</p>
                        <p class="text-2xl font-bold">{{ viralApiData?.total || 0 }}</p>
                    </div>
                    <div class="text-center bg-green-50 text-green-800 rounded-lg p-2">
                        <p class="text-xs font-semibold">VIRAL POSITIF</p>
                        <p class="text-2xl font-bold">{{ viralApiData?.viral_positive || 0 }}</p>
                    </div>
                    <div class="text-center bg-red-50 text-red-800 rounded-lg p-2">
                        <p class="text-xs font-semibold">VIRAL NEGATIF</p>
                        <p class="text-2xl font-bold">{{ viralApiData?.viral_negative || 0 }}</p>
                    </div>
                </div>

                <div class="h-48 w-full flex justify-center items-center">
                    <div v-if="isLoading.viral" class="text-gray-500">Memuat chart...</div>
                    <div v-else-if="error.viral" class="text-red-500 text-sm">Gagal memuat chart</div>
                    <Bar v-else-if="viralApiData && viralApiData.total > 0" :data="viralSentimentChartData" :options="barChartOptions" />
                    <div v-else class="text-gray-500">Tidak ada data postingan viral</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
// Impor Bar dan Pie
import { Pie, Bar } from 'vue-chartjs';
// Impor semua elemen Chart.js yang dibutuhkan
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheckCircle, faExclamationTriangle, faFire, faRadiation, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { filters } from '@/stores/filterStore.js';

// Daftarkan semua elemen
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

// --- STATE ---
const totalApiData = ref(null);
const viralApiData = ref(null); // Akan berisi { total, viral_positive, viral_negative, by_status: {...} }
const analysisApiData = ref(null);
const isLoading = reactive({ total: true, viral: true, status: true, analysis: true });
const error = reactive({ total: null, viral: null, status: null, analysis: null });

// State Chart untuk Sentimen (Pie)
const sentimentChartData = ref({
    labels: ['Positif', 'Negatif', 'Netral'],
    datasets: [{
        backgroundColor: ['#22c55e', '#ef4444', '#60a5fa'],
        data: [],
        borderWidth: 3,
        borderColor: '#ffffff'
    }]
});

// [REVISI] State Chart BARU untuk Sentimen Viral (Bar)
const viralSentimentChartData = ref({
    labels: [], // Akan diisi: ['Positif', 'Negatif', 'Netral']
    datasets: [{
        label: 'Jumlah Post Viral',
        backgroundColor: ['#22c55e', '#ef4444', '#60a5fa'], // Positif, Negatif, Netral
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 5,
        data: [], // Akan diisi: [10, 5, 11]
    }]
});


// --- FUNGSI FETCH ---

async function fetchTotalData(startDate, endDate) {
    isLoading.total = true;
    error.total = null;
    try {
        const totalUrl = `http://127.0.0.1:8000/total-unique-posts?start_date=${startDate}&end_date=${endDate}`;
        const sentimentUrl = `http://127.0.0.1:8000/sentiment-distribution?start_date=${startDate}&end_date=${endDate}`;

        const [totalResponse, sentimentResponse] = await Promise.all([
            fetch(totalUrl),
            fetch(sentimentUrl)
        ]);

        if (!totalResponse.ok) throw new Error(`HTTP error fetching total unique posts! status: ${totalResponse.status}`);
        if (!sentimentResponse.ok) throw new Error(`HTTP error fetching sentiment! status: ${sentimentResponse.status}`);

        const totalPostsData = await totalResponse.json();
        const sentimentData = await sentimentResponse.json();

        const sentiment = sentimentData.sentiment_distribution;
        totalApiData.value = {
            total: totalPostsData.total_unique_posts,
            negative: sentiment.negative,
            positive: sentiment.positive,
            neutral: sentiment.neutral
        };
        
        sentimentChartData.value.datasets[0].data = [sentiment.positive, sentiment.negative, sentiment.neutral];
    } catch (err) {
        console.error("Gagal memuat data total/sentimen:", err);
        error.total = err.message;
    } finally {
        isLoading.total = false;
    }
}

// [REVISI] fetchViralData sekarang mengisi data untuk Bar Chart Sentimen
async function fetchViralData(startDate, endDate) {
    isLoading.viral = true;
    error.viral = null;
    try {
        const url = `http://127.0.0.1:8000/viral-posts?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Simpan data ringkasan
        viralApiData.value = {
            total: data.total_viral_posts || 0,
            by_status: data.by_status || {},
            viral_positive: data.viral_positive || 0,
            viral_negative: data.viral_negative || 0
        };

        // --- INI PERBAIKANNYA ---
        // Hitung sentimen netral viral
        const total = viralApiData.value.total;
        const positive = viralApiData.value.viral_positive;
        const negative = viralApiData.value.viral_negative;
        // Pastikan tidak negatif jika API belum lengkap
        const neutral = Math.max(0, total - positive - negative); 
        
        // Update state bar chart
        viralSentimentChartData.value.labels = ['Viral Positif', 'Viral Negatif', 'Viral Netral'];
        viralSentimentChartData.value.datasets[0].data = [positive, negative, neutral];

    } catch (err) {
        console.error("Gagal memuat data viral:", err);
        error.viral = err.message;
    } finally {
        isLoading.viral = false;
    }
}

async function fetchAnalysisData(startDate, endDate) {
    isLoading.analysis = true;
    error.analysis = null;
    try {
        const url = `http://127.0.0.1:8000/analysis-summary?topic=all&start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        analysisApiData.value = await response.json();
    } catch (err) {
        console.error("Gagal memuat data analysis summary:", err);
        error.analysis = err.message;
    } finally {
        isLoading.analysis = false;
    }
}

// Tidak terpakai, tapi tidak apa-apa
async function fetchStatusData(startDate, endDate) {
    isLoading.status = true;
    try {
        const url = `http://127.0.0.1:8000/status-distribution?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        // statusApiData.value = await response.json(); // Datanya tidak terpakai
    } catch (err) {
        console.error("Gagal memuat data status:", err);
        error.status = err.message;
    } finally {
        isLoading.status = false;
    }
}


// --- COMPUTED & LIFECYCLE ---
const analysisCards = computed(() => {
    if (!analysisApiData.value) return [];
    const cardStyles = {
        'normal': { title: 'Normal', icon: faCheckCircle, gradient: 'bg-gradient-to-br from-blue-500 to-blue-600' },
        'early': { title: 'Early', icon: faShieldAlt, gradient: 'bg-gradient-to-br from-green-500 to-green-600' },
        'emerging': { title: 'Emerging', icon: faExclamationTriangle, gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-600' },
        'current': { title: 'Current', icon: faFire, gradient: 'bg-gradient-to-br from-orange-500 to-orange-600' },
        'crisis': { title: 'Crisis', icon: faRadiation, gradient: 'bg-gradient-to-br from-red-600 to-red-700' },
    };
    const desiredOrder = ['normal', 'early', 'emerging', 'current', 'crisis'];
    return desiredOrder.map(status => {
        const count = analysisApiData.value[status] || 0;
        const style = cardStyles[status] || {};
        return {
            title: style.title || status,
            value: count,
            icon: style.icon,
            gradient: style.gradient || 'bg-gray-400',
        };
    });
});

function loadAllData() {
    // Set loading
    isLoading.total = true; 
    isLoading.viral = true; 
    isLoading.analysis = true; 
    isLoading.status = true;
    
    // Panggil semua API
    fetchTotalData(filters.startDate, filters.endDate);
    fetchViralData(filters.startDate, filters.endDate);
    fetchAnalysisData(filters.startDate, filters.endDate);
    fetchStatusData(filters.startDate, filters.endDate); // Tidak terpakai, tapi tidak apa-apa
}
watch(filters, () => { loadAllData(); });
onMounted(() => { loadAllData(); });


// --- OPSI CHART ---
const pieChartOptions = { // Untuk Pie Chart Sentimen
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8, padding: 20 } },
        tooltip: {
            callbacks: {
                label: function (context) {
                    let total = context.dataset.data.reduce((a, b) => a + b, 0);
                    let value = context.parsed;
                    let percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                    return `${context.label}: ${value} (${percentage})`;
                }
            }
        },
    }
};

const barChartOptions = { // Untuk Bar Chart Sentimen Viral
    indexAxis: 'y', // Membuat chart menjadi horizontal
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false }, // Tidak perlu legenda
        tooltip: {
            callbacks: {
                label: function (context) {
                    return ` Jumlah: ${context.parsed.x}`;
                }
            }
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            ticks: {
                // Pastikan angka di sumbu X adalah bilangan bulat
                precision: 0
            },
            grid: { display: true }
        },
        y: {
            grid: { display: false }
        }
    }
};
</script>

<style scoped>
/* Style loader dan fade-in */
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
</style>