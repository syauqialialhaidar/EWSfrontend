<template>
    <div class="space-y-6">

        <div>
            <h3 class="text-xl font-bold text-[#03255C]">Ringkasan Status Postingan</h3>
            <p class="text-sm text-gray-500">Distribusi postingan berdasarkan status deteksi dini.</p>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-if="isLoading.analysis" class="text-gray-500 col-span-5 text-center py-10">Memuat status posts...</div>
            <div v-else-if="error.analysis" class="text-red-500 col-span-5 text-center py-10">Gagal memuat status</div>
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
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCheckCircle, faExclamationTriangle, faFire, faRadiation, faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { useFilterStore } from '@/stores'
import { useApi } from '@/composables/useApi'
import { ewsApi } from '@/api/ews.api'
import { logger } from '@/utils/logger'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)
const filterStore = useFilterStore()
const { loading: loadingTotal, execute: executeTotalApi } = useApi()
const { loading: loadingViral, execute: executeViralApi } = useApi()
const { loading: loadingAnalysis, execute: executeAnalysisApi } = useApi()
const { loading: loadingStatus, execute: executeStatusApi } = useApi()
const totalApiData = ref(null);
const viralApiData = ref(null);
const analysisApiData = ref(null);
const isLoading = reactive({
  total: false,
  viral: false,
  status: false,
  analysis: false
});

const error = reactive({
  total: null,
  viral: null,
  status: null,
  analysis: null
});

const sentimentChartData = ref({
    labels: ['Positif', 'Negatif', 'Netral'],
    datasets: [{
        backgroundColor: ['#22c55e', '#ef4444', '#60a5fa'],
        data: [],
        borderWidth: 3,
        borderColor: '#ffffff'
    }]
});

const viralSentimentChartData = ref({
    labels: [],
    datasets: [{
        label: 'Jumlah Post Viral',
        backgroundColor: ['#22c55e', '#ef4444', '#60a5fa'],
        borderColor: '#ffffff',
        borderWidth: 2,
        borderRadius: 5,
        data: [],
    }]
});

async function fetchTotalData(startDate, endDate) {
    isLoading.total = true;
    error.total = null;

    await executeTotalApi(
        async () => {
            logger.info('Post', `Fetching total & sentiment data: ${startDate} to ${endDate}`)
            const [totalData, sentimentData] = await Promise.all([
                ewsApi.posts.getTotalUniquePosts({ start_date: startDate, end_date: endDate }),
                ewsApi.posts.getSentimentDistribution({ start_date: startDate, end_date: endDate })
            ])

            const sentiment = sentimentData.sentiment_distribution;
            totalApiData.value = {
                total: totalData.total_unique_posts,
                negative: sentiment.negative,
                positive: sentiment.positive,
                neutral: sentiment.neutral
            };

            sentimentChartData.value.datasets[0].data = [
                sentiment.positive,
                sentiment.negative,
                sentiment.neutral
            ];

            logger.info('Post', 'Total & sentiment data loaded')
        },
        {
            showErrorNotification: true,
            errorMessage: 'Gagal memuat data sentimen',
            onError: (err) => {
                logger.error('Post', 'Failed to fetch total/sentiment data:', err)
                error.total = err.message
                totalApiData.value = null
            }
        }
    )

    isLoading.total = false;
}

async function fetchViralData(startDate, endDate) {
    isLoading.viral = true;
    error.viral = null;

    await executeViralApi(
        async () => {
            logger.info('Post', `Fetching viral posts: ${startDate} to ${endDate}`)

            const data = await ewsApi.posts.getViralPosts({
                start_date: startDate,
                end_date: endDate
            })

            const sentiment = data.sentiment_distribution || {};
            viralApiData.value = {
                total: data.total_viral_posts || 0,
                by_status: data.by_status || {},
                viral_positive: sentiment.positive || 0,
                viral_negative: sentiment.negative || 0
            };

            const positive = sentiment.positive || 0;
            const negative = sentiment.negative || 0;
            const neutral = sentiment.neutral || 0;

            viralSentimentChartData.value.labels = ['Viral Positif', 'Viral Negatif', 'Viral Netral'];
            viralSentimentChartData.value.datasets[0].data = [positive, negative, neutral];

            logger.info('Post', `Viral posts loaded: ${data.total_viral_posts || 0} posts`)
        },
        {
            showErrorNotification: true,
            errorMessage: 'Gagal memuat data postingan viral',
            onError: (err) => {
                logger.error('Post', 'Failed to fetch viral data:', err)
                error.viral = err.message
                viralApiData.value = null
            }
        }
    )

    isLoading.viral = false;
}

async function fetchAnalysisData(startDate, endDate) {
    isLoading.analysis = true;
    error.analysis = null;

    await executeAnalysisApi(
        async () => {
            logger.info('Post', `Fetching analysis summary: ${startDate} to ${endDate}`)

            const data = await ewsApi.analysis.getSummary({
                topic: 'all',
                start_date: startDate,
                end_date: endDate
            })

            analysisApiData.value = data

            logger.info('Post', 'Analysis summary loaded')
        },
        {
            showErrorNotification: true,
            errorMessage: 'Gagal memuat data ringkasan analisis',
            onError: (err) => {
                logger.error('Post', 'Failed to fetch analysis data:', err)
                error.analysis = err.message
                analysisApiData.value = null
            }
        }
    )

    isLoading.analysis = false;
}

async function fetchStatusData(startDate, endDate) {
    isLoading.status = true;
    error.status = null;

    await executeStatusApi(
        async () => {
            logger.debug('Post', `Fetching status distribution: ${startDate} to ${endDate}`)

            await ewsApi.posts.getStatusDistribution({
                start_date: startDate,
                end_date: endDate
            })

            logger.debug('Post', 'Status distribution loaded (unused)')
        },
        {
            showErrorNotification: false, 
            onError: (err) => {
                logger.warn('Post', 'Failed to fetch status data (unused):', err)
                error.status = err.message
            }
        }
    )

    isLoading.status = false;
}

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
    logger.info('Post', 'Loading all dashboard data')

    fetchTotalData(filterStore.startDate, filterStore.endDate);
    fetchViralData(filterStore.startDate, filterStore.endDate);
    fetchAnalysisData(filterStore.startDate, filterStore.endDate);
    fetchStatusData(filterStore.startDate, filterStore.endDate);
}

watch(() => [filterStore.startDate, filterStore.endDate], () => {
  logger.info('Post', 'Filters changed, reloading data...');
  loadAllData();
});

onMounted(() => {
    loadAllData();
});

const pieChartOptions = {
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

const barChartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
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
