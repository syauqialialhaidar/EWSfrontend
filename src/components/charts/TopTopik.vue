<template>
    <div v-if="isLoading"
        class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[48rem]">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p class="text-lg font-semibold text-gray-600">Memuat data topik terkini dari API...</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
                class="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)] flex flex-col justify-between">
                <div class="flex flex-col items-center">
                    <div class="font-poppins text-6xl font-bold text-[#03255C] tracking-wider">{{ currentTime }}</div>
                    <div class="font-poppins text-lg font-bold text-[#03255C]">{{ currentDate }}</div>
                </div>
                <div class="mt-6 flex flex-col items-center space-y-4">
                    <div v-for="stat in topTopics" :key="stat.title"
                        class="p-4 w-64 rounded-lg border border-gray-200 bg-white flex items-center">
                        <div class="p-3 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                            <FontAwesomeIcon :icon="faChartSimple" class="text-blue-600 text-2xl" />
                        </div>
                        <div class="flex flex-col items-start">
                            <div class="flex items-baseline space-x-2">
                                <span class="text-3xl font-bold text-[#03255C]">{{ stat.value }}</span>
                            </div>
                            <p class="font-poppins font-bold text-[#03255C] text-sm mt-1">{{ stat.title }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
                <h3 class="text-xl font-bold text-[#03255C] mb-4">Kompas Status Terkini</h3>
                <div class="relative w-full h-80 md:h-96 flex justify-center items-center pie-chart-wrapper">
                    <div class="absolute left-4 z-20 space-y-6" v-if="topTopicsForCards.length > 0">
                        <div v-for="(topic, index) in topTopicsForCards" :key="index"
                            class="flex items-center justify-center gap-5 p-3 rounded-lg border-2 shadow-xl backdrop-blur-sm"
                            :style="{ borderColor: topic.color, backgroundColor: topic.color + '80' }">
                            <div class="min-w-0 text-center">
                                <p class="font-bold text-sm text-[#03255C] truncate" :title="topic.title">{{ topic.title
                                }}</p>
                                <div
                                    class="flex items-center justify-center gap-1.5 text-xs text-gray-700 font-bold mt-3">
                                    <FontAwesomeIcon v-if="topic.platform.icon" :icon="topic.platform.icon"
                                        class="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="absolute w-full h-full">
                        <Pie :data="pieChartData" :options="pieChartOptions" :plugins="[pieChartTextPlugin]" />
                    </div>
                    <div class="pie-needle-wrapper primary" :class="pieStatus.toLowerCase()">
                        <div class="needle"></div>
                        <div class="pie-center-dot"></div>
                    </div>
                    <div class="pie-needle-wrapper secondary" :class="pieStatus2.toLowerCase()">
                        <div class="needle"></div>
                    </div>
                    <div class="pie-needle-wrapper tertiary" :class="pieStatus3.toLowerCase()">
                        <div class="needle"></div>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(topic, index) in topicsDetailsData" :key="index"
                class="bg-white rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)] flex flex-col">
                <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-bold text-[#03255C]">Topik {{ index + 1 }}: {{ topic.title }}</h3>
                </div>
                <div class="p-4 flex flex-col items-center">
                    <div :class="getStatusClass(topic.status)" class="px-4 py-1 text-sm font-bold rounded-full mb-2">{{
                        topic.status }}</div>
                    <div class="gauge-wrapper">
                        <div :class="['gauge five', topic.status.toLowerCase()]">
                            <div class="needle"></div>
                            <div class="gauge-center">
                                <div class="label">STATUS</div>
                                <div class="number">{{ topic.status }}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 flex-grow">
                    <h4 class="font-poppins text-lg font-bold text-[#03255C] mb-3">Postingan Viral Terbaru</h4>
                    <div class="space-y-4">
                        <div v-for="post in paginatedPosts(topic)" :key="post.id"
                            class="bg-[#F8F7FA] border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-md">
                            <div class="flex items-start mb-4">
                                <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
                                <div class="flex-grow">
                                    <div class="flex justify-between items-center mb-2">
                                        <div class="flex items-center gap-2 min-w-0 max-w-[66%]">
                                            <FontAwesomeIcon :icon="post.socialIcon"
                                                :class="getSocialIconColor(post.socialIcon)" class="h-4 w-4" />
                                            <span
                                                class="font-bold text-sm text-[#03255C] block overflow-hidden whitespace-nowrap text-ellipsis">{{
                                                    post.author }}</span>
                                        </div>
                                        <div class="flex items-center gap-3 flex-shrink-0">
                                            <span
                                                :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">{{
                                                    post.postStatus }}</span>
                                            <FontAwesomeIcon :icon="faBookmark" @click="toggleBookmark(post)"
                                                :class="['h-4 w-4 cursor-pointer transition-colors', post.isBookmarked ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-[#03255C]']" />
                                        </div>
                                    </div>
                                    <div class="flex justify-start items-center gap-6 mt-0.5">
                                        <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                            <FontAwesomeIcon :icon="faUsers" class="h-4 w-4" /> {{ post.followers }}
                                        </p>
                                        <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                            <FontAwesomeIcon :icon="faUser" class="h-4 w-4" /> {{ post.following }}
                                        </p>
                                        <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                            <FontAwesomeIcon :icon="faChartLine" class="h-4 w-4" /> {{
                                                post.engagementScore }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <p class="text-xs text-gray-500 flex items-center gap-1 mb-5">
                                <FontAwesomeIcon :icon="faCalendarDays" class="h-4 w-4" /> {{ post.date }}
                            </p>
                            <p class="text-sm text-[#03255C] mb-5 line-clamp-2">{{ post.content }}</p>
                            <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faEye" class="h-4 w-4" /> <span>{{ post.views }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faHeart" class="h-4 w-4" /> <span>{{ post.likes
                                        }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faCommentDots" class="h-4 w-4" /> <span>{{ post.comments
                                        }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faShareNodes" class="h-4 w-4" /> <span>{{ post.shares
                                        }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between mt-3">
                                <div class="min-w-0 mr-4">
                                    <span
                                        class="text-xs font-medium text-gray-600 border border-gray-600 px-2 py-0.5 rounded-lg block overflow-hidden whitespace-nowrap text-ellipsis bg-transparent">{{
                                            post.topicTag }}</span>
                                </div>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <button @click="openLinkInNewTab(post)"
                                        class="text-xs font-semibold bg-gray-100 text-[#2092EC] border border-[#2092EC] px-3 py-1.5 rounded-md hover:bg-gray-200 transition flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" /> Kunjungi
                                    </button>
                                    <button @click="openDetailModal(post)"
                                        class="text-xs font-semibold bg-[#2092EC] text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faEye" class="h-3 w-3" /> Lihat Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border-t border-gray-200 mt-auto">
                    <div v-if="topic.totalPosts > POSTS_PER_PAGE"
                        class="flex justify-between items-center text-xs text-gray-600">
                        <span>{{ (topic.currentPage - 1) * POSTS_PER_PAGE + 1 }} - {{ Math.min(topic.currentPage *
                            POSTS_PER_PAGE, topic.totalPosts) }} dari {{ topic.totalPosts }} Data</span>
                        <div class="flex items-center space-x-2">
                            <button @click="changePage(topic, topic.currentPage - 1)"
                                :disabled="topic.currentPage === 1"
                                :class="{ 'opacity-30 cursor-not-allowed': topic.currentPage === 1, 'hover:bg-gray-100': topic.currentPage !== 1 }"
                                class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold">&lt;</button>
                            <div class="flex items-center justify-center space-x-2">
                                <div v-if="topic.currentPage > 1"
                                    class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                                    {{ topic.currentPage - 1 }}</div>
                                <div v-else class="w-6 h-6"></div>
                                <div
                                    class="w-8 h-8 flex items-center justify-center bg-[#03255C] text-white rounded-full text-base font-bold shadow-md">
                                    {{ topic.currentPage }}</div>
                                <div v-if="topic.currentPage < totalPages(topic)"
                                    class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                                    {{ topic.currentPage + 1 }}</div>
                                <div v-else class="w-6 h-6"></div>
                            </div>
                            <button @click="changePage(topic, topic.currentPage + 1)"
                                :disabled="topic.currentPage === totalPages(topic)"
                                :class="{ 'opacity-30 cursor-not-allowed': topic.currentPage === totalPages(topic), 'hover:bg-gray-100': topic.currentPage !== totalPages(topic) }"
                                class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold">&gt;</button>
                        </div>
                    </div>
                    <div v-else class="text-center text-xs text-gray-600">Menampilkan semua {{ topic.totalPosts }} Data
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
            <div class="grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr,1fr] gap-2 text-center text-sm font-semibold">
                <div
                    class="p-2 bg-[#03255C] text-white text-lg font-bold rounded-t-lg md:rounded-lg flex items-center justify-center">
                    Status Setiap Platform</div>
                <div v-for="platform in platforms" :key="platform.name"
                    class="p-2 bg-white rounded-lg font-poppins font-bold text-[#03255C] border border-gray-200 flex flex-col items-center justify-center">
                    <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-6 w-6']" />
                    <span class="font-poppins text-sm font-bold text-[#03255C] mt-1">{{ platform.name }}</span>
                </div>
                <template v-for="item in platformStatuses" :key="item.topic">
                    <div
                        class="p-2 bg-white border border-gray-200 rounded-lg flex items-center justify-start gap-3 text-left font-bold font-poppins text-sm text-[#03255C]">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
                        </svg>
                        <span>{{ item.topic }}</span>
                    </div>
                    <div v-for="(status, statusIndex) in item.statuses" :key="`${item.topic}-${statusIndex}`"
                        class="px-4 py-1 p-2 rounded-lg flex items-center justify-center font-bold">
                        <div v-if="status" :class="getStatusClass(status)"
                            class="w-full h-full flex items-center justify-center rounded-md">{{ status }}</div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div v-if="isDetailModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm"
            @click.self="closeDetailModal">
            <div
                class="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg transform transition-all scale-100 opacity-100">
                <div class="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 class="text-xl font-bold text-[#03255C]">Detail Postingan Viral</h3>
                    <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12">
                            </path>
                        </svg>
                    </button>
                </div>
                <div v-if="selectedPost" class="space-y-4">
                    <div class="flex items-center">
                        <img :src="selectedPost.avatar" alt="Avatar" class="w-12 h-12 rounded-full mr-4">
                        <div>
                            <p class="font-bold text-lg text-[#03255C]">{{ selectedPost.author }}</p>
                            <p class="text-sm text-gray-500 flex items-center gap-2">
                                <FontAwesomeIcon :icon="selectedPost.socialIcon"
                                    :class="getSocialIconColor(selectedPost.socialIcon)" class="h-4 w-4" />{{
                                        selectedPost.date }}
                            </p>
                        </div>
                    </div>
                    <p class="text-gray-700 text-base border-t pt-4">{{ selectedPost.content }}</p>
                    <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm p-3 bg-gray-50 rounded-lg">
                        <p><strong>Status Post:</strong> <span
                                :class="[selectedPost.statusColor, 'font-bold px-2 py-0.5 rounded']">{{
                                    selectedPost.postStatus }}</span></p>
                        <p></p>
                        <p><strong>Followers:</strong> {{ selectedPost.followers }}</p>
                        <p><strong>Following:</strong> {{ selectedPost.following }}</p>
                        <p><strong>Engagement:</strong> {{ selectedPost.engagementScore }}</p>
                        <p><strong>Views (Est.):</strong> {{ selectedPost.views }}</p>
                        <p><strong>Likes:</strong> {{ selectedPost.likes }}</p>
                        <p><strong>Comments:</strong> {{ selectedPost.comments }}</p>
                        <p><strong>Shares:</strong> {{ selectedPost.shares }}</p>
                    </div>
                </div>
                <div class="mt-6 flex justify-end">
                    <button @click="openLinkInNewTab(selectedPost)"
                        class="text-xs font-semibold bg-gray-100 text-[#2092EC] border border-[#2092EC] px-3 py-1.5 rounded-md hover:bg-gray-200 transition flex items-center gap-1">
                        <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" /> Kunjungi sumber asli
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTiktok, faFacebook, faYoutube, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBookmark, faEye, faHeart, faCommentDots, faShareNodes, faUsers, faUser, faChartLine, faCalendarDays, faChartSimple, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

import { filters } from '@/stores/filterStore.js';

// ==========================================================
// REGISTRASI KOMPONEN & PLUGIN CHART.JS
// ==========================================================
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// PLUGIN KUSTOM BARU: Untuk menggambar teks di dalam segmen pie chart
const pieChartTextPlugin = {
    id: 'pieChartText',
    afterDraw(chart) {
        const { ctx, data } = chart;
        ctx.save();

        const centerX = chart.getDatasetMeta(0).data[0].x;
        const centerY = chart.getDatasetMeta(0).data[0].y;

        ctx.font = 'bold 18px Poppins, sans-serif';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Atur radius agar teks berada di dalam segmen
        const radius = chart.getDatasetMeta(0).data[0].outerRadius * 0.65;

        data.labels.forEach((label, i) => {
            const meta = chart.getDatasetMeta(0);
            const arc = meta.data[i];
            const midAngle = arc.startAngle + (arc.endAngle - arc.startAngle) / 2;

            const x = centerX + Math.cos(midAngle) * radius;
            const y = centerY + Math.sin(midAngle) * radius;

            ctx.fillText(label, x, y);
        });
        ctx.restore();
    }
};

// ==========================================================
// VARIABEL REAKTIF (STATE)
// ==========================================================
const API_URL = 'http://127.0.0.1:8000/top-topics';
const STATUS_API_URL = 'http://127.0.0.1:8000/topic-status';
const POSTS_PER_PAGE = 3;
const BOOKMARK_STORAGE_KEY = 'vue-bookmarked-posts';

const isLoading = ref(true);
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);
const topTopics = ref([]);
const pieStatus = ref('EMERGING');
const pieStatus2 = ref('CURRENT');
const pieStatus3 = ref('NORMAL');
const topicsDetailsData = ref([]);
const platformStatuses = ref([]);
const bookmarkedPosts = ref([]);
const pieChartData = ref({ labels: [], datasets: [] });

const platforms = ref([
    { name: 'X / Twitter', icon: faXTwitter, color: 'text-gray-800' },
    { name: 'TikTok', icon: faTiktok, color: 'text-black' },
    { name: 'Facebook', icon: faFacebook, color: 'text-blue-600' },
    { name: 'YouTube', icon: faYoutube, color: 'text-red-600' },
    { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' },
]);

const needleColors = { primary: '#f2ff00', secondary: '#95ff00', tertiary: '#00f9cb' };

// ==========================================================
// PROPERTI KOMPUTASI (COMPUTED PROPERTIES)
// ==========================================================
const topTopicsForCards = computed(() => {
    const topics = topicsDetailsData.value.slice(0, 3);
    const colors = [needleColors.primary, needleColors.secondary, needleColors.tertiary];
    const twitterPlatform = platforms.value.find(p => p.name === 'X / Twitter');
    return topics.map((topic, index) => ({
        title: topic.title,
        color: colors[index],
        platform: twitterPlatform ? { name: twitterPlatform.name, icon: twitterPlatform.icon } : { name: 'N/A', icon: null }
    }));
});

// ==========================================================
// OPSI & KONFIGURASI
// ==========================================================
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
        pieChartText: true,
    },
    events: [],
};

// ==========================================================
// METODE & FUNGSI
// ==========================================================
const getSocialIconColor = (icon) => ({ [faXTwitter.iconName]: 'text-[#03255C]' }[icon.iconName] || 'text-gray-700');
const getStatusClass = (status) => ({
    NORMAL: 'text-[#2092EC] border border-[#2092EC] bg-[#2092EC]/10',
    EARLY: 'text-[#28C76F] border border-[#28C76F] bg-[#28C76F]/10',
    EMERGING: 'text-[#AAD816] border border-[#AAD816] bg-[#AAD816]/10',
    CURRENT: 'text-[#FF9900] border border-[#FF9900] bg-[#FF9900]/10',
    CRISIS: 'text-[#E60000] border border-[#E60000] bg-[#E60000]/10',
}[status.toUpperCase()] || 'bg-gray-400 text-white');

const totalPages = (topic) => Math.ceil(topic.totalPosts / POSTS_PER_PAGE);
const paginatedPosts = (topic) => topic.allPosts ? topic.allPosts.slice((topic.currentPage - 1) * POSTS_PER_PAGE, topic.currentPage * POSTS_PER_PAGE) : [];
const changePage = (topic, page) => { if (page >= 1 && page <= totalPages(topic)) topic.currentPage = page; };
const saveBookmarks = () => localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarkedPosts.value));
const loadBookmarks = () => {
    const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (saved) bookmarkedPosts.value = JSON.parse(saved);
};
const toggleBookmark = (post) => {
    const postIndex = bookmarkedPosts.value.findIndex(p => p.id === post.id);
    const isNowBookmarked = postIndex === -1;
    post.isBookmarked = isNowBookmarked;
    if (isNowBookmarked) {
        bookmarkedPosts.value.unshift(post);
    } else {
        bookmarkedPosts.value.splice(postIndex, 1);
    }
    for (const topic of topicsDetailsData.value) {
        const originalPost = topic.allPosts.find(p => p.id === post.id);
        if (originalPost) {
            originalPost.isBookmarked = isNowBookmarked;
            break;
        }
    }
    saveBookmarks();
};
const openDetailModal = (post) => { selectedPost.value = post; isDetailModalOpen.value = true; };
const closeDetailModal = () => { isDetailModalOpen.value = false; selectedPost.value = null; };
const openLinkInNewTab = (post) => { if (post && post.url) window.open(post.url, '_blank', 'noopener,noreferrer'); };
const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

// 3. FUNGSI FETCH DIMODIFIKASI untuk menerima dan menggunakan parameter tanggal
const fetchAllDashboardData = async (startDate, endDate) => {
    isLoading.value = true;
    try {
        // Tambahkan query parameter tanggal ke URL API
        const API_URL = `http://127.0.0.1:8000/top-topics?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const topTopicsApiData = data.top_topics || [];

        const enrichedTopicsData = await Promise.all(
            topTopicsApiData.map(async (topicItem) => {
                try {
                    const topicName = encodeURIComponent(topicItem.topic);
                    const statusResponse = await fetch(`${STATUS_API_URL}/${topicName}`);
                    if (!statusResponse.ok) return { ...topicItem, calculated_status: 'N/A' };
                    const statusData = await statusResponse.json();
                    return { ...topicItem, calculated_status: statusData.topic_status };
                } catch (e) {
                    return { ...topicItem, calculated_status: 'N/A' };
                }
            })
        );
        topTopics.value = topTopicsApiData.map((item, index) => ({
            title: `Topik ${index + 1}: ${item.topic}`,
            value: String(item.total_posts).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        }));
        pieChartData.value = {
            labels: ['CRISIS', 'NORMAL', 'EARLY', 'EMERGING', 'CURRENT'],
            datasets: [{
                backgroundColor: ['#E60000', '#2092EC', '#28C76F', '#AAD816', '#FF9900'],
                data: [10, 15, 25, 25, 25],
                borderWidth: 2,
                borderColor: '#ffffff',
            }],
        };
        topicsDetailsData.value = enrichedTopicsData.map((topicItem) => ({
            title: topicItem.topic,
            status: (topicItem.calculated_status || 'N/A').toUpperCase(),
            allPosts: topicItem.top_10_posts.map(post => ({
                id: post.tweet_id,
                author: post.user.name || post.user.screen_name,
                avatar: post.user.profile_image_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                date: new Date(post.created_at).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'medium' }),
                postStatus: post.latest_status,
                statusColor: getStatusClass(post.latest_status),
                content: post.text,
                socialIcon: faXTwitter,
                followers: String(post.user.followers_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                following: String(post.user.following_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                engagementScore: (post.engagement || 0).toFixed(2),
                views: String((post.retweet_count || 0) + (post.favorite_count || 0) + (post.reply_count || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                likes: String(post.favorite_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                comments: String(post.reply_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                shares: String(post.retweet_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                topicTag: topicItem.topic,
                url: `https://x.com/any/status/${post.tweet_id}`,
                isBookmarked: false,
            })),
            totalPosts: topicItem.top_10_posts.length,
            currentPage: 1,
        }));
        platformStatuses.value = topicsDetailsData.value.slice(0, 3).map(topic => {
            const statusArray = Array(platforms.value.length).fill('');
            const twitterIndex = platforms.value.findIndex(p => p.name === 'X / Twitter');
            if (twitterIndex > -1) statusArray[twitterIndex] = topic.status;
            return { topic: topic.title, statuses: statusArray };
        });
        pieStatus.value = topicsDetailsData.value.length > 0 ? topicsDetailsData.value[0].status : 'NORMAL';
        pieStatus2.value = topicsDetailsData.value.length > 1 ? topicsDetailsData.value[1].status : 'NORMAL';
        pieStatus3.value = topicsDetailsData.value.length > 2 ? topicsDetailsData.value[2].status : 'NORMAL';
        const bookmarkedIds = new Set(bookmarkedPosts.value.map(p => p.id));
        topicsDetailsData.value.forEach(topic => {
            topic.allPosts.forEach(post => {
                post.isBookmarked = bookmarkedIds.has(post.id);
            });
        });
    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
    } finally {
        isLoading.value = false;
    }
};

// 4. BUAT FUNGSI BARU untuk membungkus pemanggilan data
function loadAllData() {
    fetchAllDashboardData(filters.startDate, filters.endDate);
}

// 5. GUNAKAN 'watch' untuk memanggil loadAllData setiap kali tanggal di store berubah
watch(filters, (newFilters) => {
    console.log(`Filter tanggal berubah ke: ${newFilters.startDate} - ${newFilters.endDate}. Memuat ulang data TopTopik.vue...`);
    loadAllData();
});

// ==========================================================
// LIFECYCLE HOOKS
// ==========================================================
onMounted(() => {
    loadBookmarks();
    updateTime();
    timerInterval = setInterval(updateTime, 1000);
    // 6. Panggil pembungkus data untuk pemuatan awal
    loadAllData();
});

onUnmounted(() => {
    clearInterval(timerInterval);
});

</script>

<style scoped>
/* Semua style CSS dari kode asli Anda tetap sama. */
/* Tidak ada perubahan yang diperlukan di sini. */

.pie-chart-wrapper :deep(canvas) {
    filter: drop-shadow(12px 8px 10px rgba(0, 0, 0, 0.25));
}

.gauge-wrapper {
    display: inline-block;
    width: auto;
    margin: 0 auto;
    padding: 20px 15px 15px;
}

.gauge {
    position: relative;
    width: 250px;
    height: 125px;
    top: 5px;
    background-image: url('@/assets/image/warna.png');
    /* PASTIKAN PATH INI BENAR */
    background-repeat: no-repeat;
    background-position: center calc(100% + 1cm);
    background-size: 408px;
}

.gauge-center {
    content: '';
    color: #fff;
    width: 61%;
    height: 50%;
    background: #15222E;
    border-radius: 100px 100px 0 0 !important;
    position: absolute;
    box-shadow: 0 -13px 15px -10px rgba(0, 0, 0, 0.28);
    right: 20%;
    bottom: 5px;
    color: #fff;
    z-index: 10;
}

.gauge-center .label,
.gauge-center .number {
    display: block;
    width: 100%;
    text-align: center;
    border: 0 !important;
}

.gauge-center .label {
    font-size: 0.75em;
    opacity: 0.6;
    margin: 0.5em 0 0.3em 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.gauge-center .number {
    font-size: 1.2em;
    font-weight: bold;
}

.needle {
    width: 97px;
    height: 10px;
    background: #ffffff;
    border-bottom-left-radius: 100% !important;
    border-bottom-right-radius: 5px !important;
    border-top-left-radius: 100% !important;
    border-top-right-radius: 5px !important;
    position: absolute;
    bottom: 3px;
    left: 25px;
    transform-origin: 100% 4px;
    transform: rotate(0deg);
    box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
    display: none;
    z-index: 9;
}

.five.normal .needle {
    animation: fivespeed1 2s 1 both;
    animation-delay: 1s;
    display: block;
}

.five.early .needle {
    animation: fivespeed2 2s 1 both;
    animation-delay: 1s;
    display: block;
}

.five.emerging .needle {
    animation: fivespeed3 2s 1 both;
    animation-delay: 1s;
    display: block;
}

.five.current .needle {
    animation: fivespeed4 2s 1 both;
    animation-delay: 1s;
    display: block;
}

.five.crisis .needle {
    animation: fivespeed5 2s 1 both;
    animation-delay: 1s;
    display: block;
}

.pie-needle-wrapper.primary .needle {
    width: 170px;
    height: 10px;
    background: #f2ff00;
    z-index: 11;
}

.pie-needle-wrapper.secondary .needle {
    width: 170px;
    height: 10px;
    background: #95ff00;
    z-index: 11;
}

.pie-needle-wrapper.tertiary .needle {
    width: 170px;
    height: 10px;
    background: #00f9cb;
    z-index: 11;
}

.pie-needle-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    transform: rotate(0deg);
}

.pie-center-dot {
    content: '';
    width: 20px;
    height: 20px;
    background: #15222E;
    border: 3px solid #e60000;
    border-radius: 50%;
    position: absolute;
    top: -10px;
    left: -10px;
    z-index: 13;
}

.pie-needle-wrapper .needle {
    border-radius: 4px;
    position: absolute;
    top: -7px;
    left: 0;
    transform-origin: 0% 50%;
    display: block;
    box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
}

.pie-needle-wrapper.primary .needle {
    top: -5px;
}

/* GANTI BLOK CSS LAMA ANDA DENGAN YANG INI */

/* === PRIMARY NEEDLE (JARUM 1) === */
.pie-needle-wrapper.primary.normal {
    animation: fivespeed4-pie 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.early {
    animation: fivespeed1-pie 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.emerging {
    animation: fivespeed2-pie 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.current {
    animation: fivespeed3-pie 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.crisis {
    animation: fivespeed5-pie 2s 1 both;
    /* Sudah benar */
    animation-delay: 1s;
}

/* === SECONDARY NEEDLE (JARUM 2) === */
.pie-needle-wrapper.secondary.normal {
    animation: fivespeed4-pie-secondary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.early {
    animation: fivespeed1-pie-secondary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.emerging {
    animation: fivespeed2-pie-secondary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.current {
    animation: fivespeed3-pie-secondary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.crisis {
    animation: fivespeed5-pie-secondary 2s 1 both;
    /* Sudah benar */
    animation-delay: 1s;
}

/* === TERTIARY NEEDLE (JARUM 3) === */
.pie-needle-wrapper.tertiary.normal {
    animation: fivespeed4-pie-tertiary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.early {
    animation: fivespeed1-pie-tertiary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.emerging {
    animation: fivespeed2-pie-tertiary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.current {
    animation: fivespeed3-pie-tertiary 2s 1 both;
    /* Diperbaiki */
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.crisis {
    animation: fivespeed5-pie-tertiary 2s 1 both;
    /* Sudah benar */
    animation-delay: 1s;
}

@keyframes fivespeed1 {
    100% {
        transform: rotate(18deg);
    }
}

@keyframes fivespeed2 {
    100% {
        transform: rotate(54deg);
    }
}

@keyframes fivespeed3 {
    100% {
        transform: rotate(90deg);
    }
}

@keyframes fivespeed4 {
    100% {
        transform: rotate(126deg);
    }
}

@keyframes fivespeed5 {
    100% {
        transform: rotate(162deg);
    }
}

.loader {
    border-top-color: #3B82F6;
    animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
    100% {
        transform: rotate(360deg);
    }
}

.animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
}

@keyframes fivespeed1-pie {
    100% {
        transform: rotate(45deg);
    }
}

@keyframes fivespeed2-pie {
    100% {
        transform: rotate(135deg);
    }
}

@keyframes fivespeed3-pie {
    100% {
        transform: rotate(225deg);
    }
}

@keyframes fivespeed4-pie {
    100% {
        transform: rotate(-27deg);
    }
}

@keyframes fivespeed5-pie {
    100% {
        transform: rotate(-72deg);
    }
}

@keyframes fivespeed1-pie-secondary {
    100% {
        transform: rotate(35deg);
    }
}

@keyframes fivespeed2-pie-secondary {
    100% {
        transform: rotate(125deg);
    }
}

@keyframes fivespeed3-pie-secondary {
    100% {
        transform: rotate(215deg);
    }
}

@keyframes fivespeed4-pie-secondary {
    100% {
        transform: rotate(-37deg);
    }
}

@keyframes fivespeed5-pie-secondary {
    100% {
        transform: rotate(-82deg);
    }
}

@keyframes fivespeed1-pie-tertiary {
    100% {
        transform: rotate(55deg);
    }
}

@keyframes fivespeed2-pie-tertiary {
    100% {
        transform: rotate(145deg);
    }
}

@keyframes fivespeed3-pie-tertiary {
    100% {
        transform: rotate(235deg);
    }
}

@keyframes fivespeed4-pie-tertiary {
    100% {
        transform: rotate(-17deg);
    }
}

@keyframes fivespeed5-pie-tertiary {
    100% {
        transform: rotate(-62deg);
    }
}
</style>