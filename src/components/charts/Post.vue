<template>
    <div class="space-y-6">

        <div>
            <h3 class="text-xl font-bold text-[#03255C]">Ringkasan Status Postingan</h3>
            <p class="text-sm text-gray-500">Distribusi postingan berdasarkan status deteksi dini.</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-if="isLoading.analysis" class="text-gray-500 col-span-5 text-center py-10">Memuat status posts...
            </div>
            <div v-else-if="error.analysis" class="text-red-500 col-span-5 text-center py-10">Gagal memuat status: {{
                error.analysis }}</div>

            <div v-else v-for="card in analysisCards" :key="card.title"
                :class="[card.gradient, 'relative p-5 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-white flex flex-col justify-between h-40 overflow-hidden cursor-pointer']"
                @click="openCardModal(card)">
                <FontAwesomeIcon :icon="card.icon" class="absolute -right-4 -bottom-4 text-white/10 text-8xl" />
                <div>
                    <p class="text-lg font-bold">{{ card.title }}</p>
                </div>
                <p class="text-5xl font-bold text-right">{{ card.value }}</p>
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
                                <div class="text-3xl font-bold tracking-tight leading-none font-mono">
                                    {{ currentTime }}
                                </div>
                                <div class="text-xs font-medium text-white/70 mt-1">
                                    {{ currentDate }}
                                </div>
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
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div class="relative z-20 flex-1 overflow-y-auto bg-white/5 custom-scrollbar">

                        <div v-if="isLoadingDetails"
                            class="flex flex-col items-center justify-center h-full text-white/70 p-6">
                            <div class="loader mb-4 border-white border-t-transparent"></div>
                            <p>Mengambil detail postingan...</p>
                        </div>

                        <div v-else-if="activePosts.length === 0"
                            class="flex flex-col items-center justify-center h-full text-white/60 p-6">
                            <FontAwesomeIcon :icon="activeCard.icon" class="text-6xl mb-4 opacity-50" />
                            <p class="text-lg">Belum ada detail data untuk status ini.</p>
                        </div>

                        <div v-else>

                            <div class="sticky top-0 z-30 flex justify-between items-center border-b border-white/20 backdrop-blur-sm p-6 shadow-lg transition-colors duration-300"
                                :class="{
                                    'bg-blue-600/95': activeCard.title === 'Normal',
                                    'bg-green-600/95': activeCard.title === 'Early',
                                    'bg-yellow-600/95': activeCard.title === 'Emerging',
                                    'bg-orange-600/95': activeCard.title === 'Current',
                                    'bg-red-700/95': activeCard.title === 'Crisis'
                                }">

                                <div class="text-sm text-white/90 font-medium">
                                    Halaman <span class="font-bold">{{ pagination.currentPage }}</span> dari {{
                                        pagination.totalPages }}
                                    <span class="text-white/70 font-normal ml-1">(Total: {{ pagination.total }})</span>
                                </div>

                                <div class="flex gap-2">
                                    <button @click="changePage(pagination.currentPage - 1)"
                                        :disabled="pagination.currentPage === 1"
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
                                        'border-blue-500': activeCard.title === 'Normal',
                                        'border-green-500': activeCard.title === 'Early',
                                        'border-yellow-500': activeCard.title === 'Emerging',
                                        'border-orange-500': activeCard.title === 'Current',
                                        'border-red-600': activeCard.title === 'Crisis'
                                    }">

                                    <div class="flex justify-between items-start mb-3">
                                        <div class="flex items-center gap-3">
                                            <img :src="post.user?.profile_image_url || 'https://via.placeholder.com/40'"
                                                alt="Avatar"
                                                class="w-12 h-12 rounded-full object-cover border border-gray-200"
                                                @error="$event.target.src = 'https://via.placeholder.com/40'" />

                                            <div>
                                                <div class="flex items-baseline gap-2">
                                                    <p class="font-bold text-sm leading-tight">{{ post.user?.name ||
                                                        'Anonim' }}</p>
                                                    <p class="text-xs text-gray-500">@{{ post.user?.screen_name ||
                                                        'unknown' }}</p>
                                                </div>

                                                <div
                                                    class="flex items-center gap-3 mt-1 text-[10px] text-gray-500 font-medium">
                                                    <span class="flex items-center gap-1" title="Followers">
                                                        <FontAwesomeIcon :icon="faUsers" class="text-gray-400" />
                                                        {{ formatNumber(post.user?.followers_count || 0) }}
                                                    </span>
                                                    <span class="flex items-center gap-1" title="Following">
                                                        <FontAwesomeIcon :icon="faUserFriends" class="text-gray-400" />
                                                        {{ formatNumber(post.user?.friends_count || 0) }}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="flex flex-col items-end gap-1">
                                            <span
                                                class="text-xs font-medium px-2 py-1 rounded bg-gray-100 text-gray-600 capitalize flex items-center gap-1 w-fit">
                                                <FontAwesomeIcon :icon="getPlatformIcon(post.platform)" />
                                                {{ post.platform }}
                                            </span>

                                            <span
                                                class="text-[10px] font-bold px-2 py-0.5 rounded border capitalize w-fit shadow-sm"
                                                :class="getSentimentClass(post.sentiment)">
                                                {{ post.sentiment || 'Unknown' }}
                                            </span>
                                        </div>
                                    </div>

                                    <p class="text-sm text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                                        {{ post.text_content || 'Tidak ada konten teks.' }}
                                    </p>

                                    <div class="pt-3 border-t border-gray-100">

                                        <div class="grid grid-cols-4 gap-2 mb-3 text-gray-500">

                                            <div class="flex flex-col items-center justify-center p-1 rounded hover:bg-red-50 hover:text-red-500 transition-colors group"
                                                title="Likes/Favorites">
                                                <FontAwesomeIcon :icon="faHeart"
                                                    class="text-xs mb-1 group-hover:scale-110 transition-transform" />
                                                <span class="text-xs font-semibold">{{
                                                    formatNumber(getPostMetrics(post).like) }}</span>
                                            </div>

                                            <div class="flex flex-col items-center justify-center p-1 rounded hover:bg-blue-50 hover:text-blue-500 transition-colors group"
                                                title="Comments/Replies">
                                                <FontAwesomeIcon :icon="faComment"
                                                    class="text-xs mb-1 group-hover:scale-110 transition-transform" />
                                                <span class="text-xs font-semibold">{{
                                                    formatNumber(getPostMetrics(post).comment) }}</span>
                                            </div>

                                            <div class="flex flex-col items-center justify-center p-1 rounded hover:bg-green-50 hover:text-green-500 transition-colors group"
                                                title="Shares/Retweets">
                                                <FontAwesomeIcon :icon="faShare"
                                                    class="text-xs mb-1 group-hover:scale-110 transition-transform" />
                                                <span class="text-xs font-semibold">{{
                                                    formatNumber(getPostMetrics(post).share) }}</span>
                                            </div>

                                            <div class="flex flex-col items-center justify-center p-1 rounded hover:bg-gray-100 hover:text-gray-800 transition-colors group"
                                                title="Views">
                                                <FontAwesomeIcon :icon="faEye"
                                                    class="text-xs mb-1 group-hover:scale-110 transition-transform" />
                                                <span class="text-xs font-semibold">{{
                                                    formatNumber(getPostMetrics(post).view) }}</span>
                                            </div>
                                        </div>

                                        <div class="flex justify-between items-center">
                                            <span class="flex items-center gap-1 text-xs text-gray-400">
                                                <FontAwesomeIcon :icon="faCalendarAlt" />
                                                {{ post.created_at ? new
                                                    Date(post.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) :
                                                '-' }}
                                            </span>
                                            <a :href="post.url" target="_blank"
                                                class="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline">
                                                Lihat Post
                                                <FontAwesomeIcon :icon="faExternalLinkAlt" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Teleport>

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
                    <Pie v-else-if="totalApiData && totalApiData.total > 0" :data="sentimentChartData"
                        :options="pieChartOptions" />
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
                    <Bar v-else-if="viralApiData && viralApiData.total > 0" :data="viralSentimentChartData"
                        :options="barChartOptions" />
                    <div v-else class="text-gray-500">Tidak ada data postingan viral</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue';
import { Pie, Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useFilterStore } from '@/stores/useFilterStore'
import { storeToRefs } from 'pinia'
import { faTwitter, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons'
import {
    faHeart,
    faComment,
    faShare,
    faEye,
    faUsers,
    faUserFriends,
    faCheckCircle,
    faExclamationTriangle,
    faFire,
    faRadiation,
    faShieldAlt,
    faExternalLinkAlt,
    faCalendarAlt,
    faChartBar
} from '@fortawesome/free-solid-svg-icons'

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement)

const filterStore = useFilterStore()
const { startDate, endDate } = storeToRefs(filterStore)

// SENTIMENT
const getSentimentClass = (sentiment) => {
    if (!sentiment) return 'bg-gray-100 text-gray-600 border-gray-200';
    const s = String(sentiment).toLowerCase();
    if (s.includes('pos')) return 'bg-green-50 text-green-700 border-green-200'; // Positif
    if (s.includes('neg')) return 'bg-red-50 text-red-700 border-red-200'; // Negatif
    return 'bg-blue-50 text-blue-700 border-blue-200'; // Netral
};

const formatNumber = (num) => {
    if (!num) return '0';
    const n = parseInt(num); // Pastikan dikonversi ke number dulu (karena di JSON "views": "6207" itu string)
    if (isNaN(n)) return '0';

    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
};

const getPostMetrics = (post) => {
    const platform = post.platform ? post.platform.toLowerCase() : '';
    const metrics = post.metrics_detail?.[platform] || {}; // Ambil object di dalam key platform (twitter/instagram/tiktok)

    let data = { like: 0, comment: 0, share: 0, view: 0 };

    if (platform.includes('twitter') || platform.includes('x')) {
        // Mapping Twitter: favorites->like, retweets->share, replies->comment
        data.like = metrics.favorites || 0;
        data.share = metrics.retweets || 0;
        data.comment = metrics.replies || 0;
        data.view = metrics.views || 0;
    } else if (platform.includes('instagram')) {
        // Mapping Instagram
        data.like = metrics.likes || 0;
        data.comment = metrics.comments || 0;
        data.share = metrics.shares || metrics.reposts || 0;
        data.view = 0; // IG API kadang tidak kasih views di endpoint tertentu
    } else if (platform.includes('tiktok')) {
        // Mapping TikTok
        data.like = metrics.likes || 0;
        data.comment = metrics.comments || 0;
        data.share = metrics.shares || 0;
        data.view = metrics.views || 0;
    }

    return data;
};


// JAM
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;

const updateTime = () => {
    const now = new Date();
    // Format Jam: 14:30:45
    currentTime.value = now.toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    // Format Tanggal: Kamis, 20 November 2025
    currentDate.value = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

onMounted(() => {
    loadAllData();

    // Jalankan timer
    updateTime();
    timerInterval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
    // Bersihkan timer saat komponen di-destroy agar tidak memory leak
    if (timerInterval) clearInterval(timerInterval);
});

// --- STATE UTAMA (PINDAHKAN KE ATAS) ---
const activePosts = ref([]); // Data list postingan
const isLoadingDetails = ref(false);
const pagination = reactive({
    currentPage: 1,
    limit: 10,
    total: 0,
    totalPages: 0
});

const totalApiData = ref(null);
const viralApiData = ref(null);
const analysisApiData = ref(null);
const isLoading = reactive({ total: true, viral: true, status: true, analysis: true });
const error = reactive({ total: null, viral: null, status: null, analysis: null });

// State Modal
const isModalOpen = ref(false);
const activeCard = ref(null);

// State Chart
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

// --- HELPER ---
const getPlatformIcon = (platform) => {
    if (!platform) return faCheckCircle;
    const p = platform.toLowerCase();
    if (p.includes('twitter') || p.includes('x')) return faTwitter;
    if (p.includes('instagram')) return faInstagram;
    if (p.includes('tiktok')) return faTiktok;
    return faCheckCircle;
};

// --- FUNGSI FETCH ---

async function fetchTotalData(startDate, endDate) {
    isLoading.total = true;
    error.total = null;
    try {
        const totalUrl = `http://154.26.134.72:8438/total-unique-posts?start_date=${startDate}&end_date=${endDate}`;
        const sentimentUrl = `http://154.26.134.72:8438/sentiment-distribution?start_date=${startDate}&end_date=${endDate}`;

        const [totalResponse, sentimentResponse] = await Promise.all([
            fetch(totalUrl),
            fetch(sentimentUrl)
        ]);

        if (!totalResponse.ok) throw new Error(`HTTP error fetching total! status: ${totalResponse.status}`);
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

async function fetchViralData(startDate, endDate) {
    isLoading.viral = true;
    error.viral = null;
    try {
        const url = `http://154.26.134.72:8438/viral-posts?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        viralApiData.value = {
            total: data.total_viral_posts || 0,
            by_status: data.by_status || {},
            viral_positive: data.sentiment_distribution.positive || 0,
            viral_negative: data.sentiment_distribution.negative || 0,
            viral_neutral: data.sentiment_distribution.neutral || 0
        };

        const positive = viralApiData.value.viral_positive;
        const negative = viralApiData.value.viral_negative;
        const neutral = viralApiData.value.viral_neutral;

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
    try {
        const url = `http://154.26.134.72:8438/analysis-summary-counts?topic=all&start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        analysisApiData.value = await response.json();
    } catch (err) {
        console.error("Gagal memuat data analysis:", err);
    } finally {
        isLoading.analysis = false;
    }
}

async function fetchStatusData(startDate, endDate) {
    isLoading.status = true;
    try {
        const url = `http://154.26.134.72:8438/status-distribution?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    } catch (err) {
        console.error("Gagal memuat data status:", err);
        error.status = err.message;
    } finally {
        isLoading.status = false;
    }
}

// --- FUNGSI PAGINATION ---
async function fetchPaginatedPosts(statusTitle, page = 1) {
    isLoadingDetails.value = true;
    try {
        const statusParam = statusTitle.toLowerCase();
        const url = `http://154.26.134.72:8438/posts-by-status?status=${statusParam}&page=${page}&limit=${pagination.limit}&start_date=${startDate.value}&end_date=${endDate.value}`;

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
}

// --- COMPUTED ---
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
        const rawData = analysisApiData.value[status];
        const count = rawData || 0;
        const style = cardStyles[status] || {};
        return {
            title: style.title || status,
            value: count,
            icon: style.icon,
            gradient: style.gradient || 'bg-gray-400',
        };
    });
});

// --- HANDLERS ---
function openCardModal(card) {
    activeCard.value = card;
    isModalOpen.value = true;
    activePosts.value = []; // Bersihkan data lama
    pagination.currentPage = 1;
    fetchPaginatedPosts(card.title, 1);
}

function changePage(newPage) {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchPaginatedPosts(activeCard.value.title, newPage);
}

function closeModal() {
    isModalOpen.value = false;
    setTimeout(() => {
        activeCard.value = null;
    }, 300);
}

function loadAllData() {
    isLoading.total = true;
    isLoading.viral = true;
    isLoading.analysis = true;
    isLoading.status = true

    fetchTotalData(startDate.value, endDate.value)
    fetchViralData(startDate.value, endDate.value)
    fetchAnalysisData(startDate.value, endDate.value)
    fetchStatusData(startDate.value, endDate.value)
    // fetchGroupedDetails SUDAH DIHAPUS DARI SINI
}

watch([startDate, endDate], () => {
    loadAllData()
})

onMounted(() => {
    loadAllData()
})

// --- CHART OPTIONS ---
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
            ticks: { precision: 0 },
            grid: { display: true }
        },
        y: { grid: { display: false } }
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

/* UPDATE 5: CSS UNTUK MODAL 3D FLIP */
.perspective-container {
    perspective: 1000px;
}

@keyframes flip-zoom-in {
    0% {
        opacity: 0;
        transform: scale(0.5) rotateY(90deg) translateY(50px);
    }

    100% {
        opacity: 1;
        transform: scale(1) rotateY(0deg) translateY(0);
    }
}

.animate-flip-zoom {
    animation: flip-zoom-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    transform-style: preserve-3d;
    backface-visibility: hidden;
}
</style>