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
                    <div class="text-6xl font-bold text-[#03255C] tracking-wider">
                        {{ currentTime }}
                    </div>
                    <div class="text-lg text-gray-500">
                        {{ currentDate }}
                    </div>
                </div>
                <div class="mt-6 flex flex-col items-center space-y-4">
                    <div v-for="(stat, index) in topTopics" :key="stat.title"
                        class="p-4 w-64 rounded-lg border border-gray-200 bg-white flex items-center">
                        <div class="p-3 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                            <FontAwesomeIcon :icon="faChartSimple" class="text-blue-600 text-2xl" />
                        </div>
                        <div class="flex flex-col items-start">
                            <div class="flex items-baseline space-x-2">
                                <span class="text-3xl font-bold text-[#03255C]">{{ stat.value }}</span>
                                <span class="text-xs font-semibold bg-[#03255C] text-white px-2 py-1 rounded-md">
                                    {{ stat.change }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mt-1">{{ stat.title }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div
                class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
                <h3 class="text-lg font-bold text-[#03255C] mb-4">Kompas Status Terkini</h3>

                <div class="relative w-full h-80 md:h-96 flex justify-center items-center">
                    <div class="absolute w-full h-full">
                        <Pie :data="pieChartData" :options="pieChartOptions" />
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
                    <div :class="getStatusClass(topic.status)" class="px-4 py-1 text-sm font-bold rounded-full mb-2">
                        {{ topic.status }}
                    </div>

                    <div class="gauge-wrapper">
                        <div :class="['gauge five', topic.status.toLowerCase()]">
                            <div class="slice-colors">
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                            </div>
                            <div class="needle"></div>
                            <div class="gauge-center">
                                <div class="label">STATUS</div>
                                <div class="number">{{ topic.status }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 flex-grow">
                    <h4 class="font-bold text-gray-700 mb-3">Postingan Viral Terbaru</h4>
                    <div class="space-y-4">
                        <div v-for="post in paginatedPosts(topic)" :key="post.id"
                            class="border border-gray-200 rounded-lg p-3">

                            <div class="flex items-start mb-4">
                                <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">

                                <div class="flex-grow">

                                    <div class="flex justify-between items-center mb-2">

                                        <div class="flex items-center gap-2 min-w-0 max-w-[66%]">
                                            <FontAwesomeIcon :icon="post.socialIcon"
                                                :class="getSocialIconColor(post.socialIcon)" class="h-4 w-4" />
                                            <span
                                                class="font-bold text-sm text-[#03255C] block overflow-hidden whitespace-nowrap text-ellipsis">
                                                {{ post.author }}
                                            </span>
                                        </div>

                                        <div class="flex items-center gap-2 flex-shrink-0">
                                            <span
                                                :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                                                {{ post.postStatus }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex justify-start items-center gap-6 mt-0.5">
                                        <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                            <FontAwesomeIcon :icon="faUsers" class="h-4 w-4" />
                                            {{ post.followers }}
                                        </p>
                                        <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                            <FontAwesomeIcon :icon="faUser" class="h-4 w-4" />
                                            {{ post.following }}
                                        </p>
                                        <p class="text-xs font-semibold text-gray-600 flex items-center gap-1">
                                            <FontAwesomeIcon :icon="faChartLine" class="h-4 w-4" />
                                            {{ post.engagementScore }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p class="text-xs text-gray-500 flex items-center gap-1 mb-5">
                                <FontAwesomeIcon :icon="faCalendarDays" class="h-4 w-4" />
                                {{ post.date }}
                            </p>

                            <p class="text-sm text-gray-600 mb-5 line-clamp-2">{{ post.content }}</p>

                            <div class="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faEye" class="h-4 w-4" />
                                        <span>{{ post.views }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faHeart" class="h-4 w-4" />
                                        <span>{{ post.likes }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faCommentDots" class="h-4 w-4" />
                                        <span>{{ post.comments }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faShareNodes" class="h-4 w-4" />
                                        <span>{{ post.shares }}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="flex items-center justify-end gap-2 mt-3">
                                <button
                                    class="text-xs font-semibold bg-gray-100 text-[#2092EC] border border-[#2092EC] px-3 py-1.5 rounded-md hover:bg-gray-200 transition flex items-center gap-1">
                                    <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" />
                                    Kunjungi
                                </button>
                                <button @click="openDetailModal(post)"
                                    class="text-xs font-semibold bg-[#2092EC] text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition flex items-center gap-1">
                                    <FontAwesomeIcon :icon="faEye" class="h-3 w-3" />
                                    Lihat Detail
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-4 border-t border-gray-200 mt-auto">
                    <div v-if="topic.totalPosts > POSTS_PER_PAGE"
                        class="flex justify-between items-center text-xs text-gray-600">
                        <span>
                            Menampilkan {{ (topic.currentPage - 1) * POSTS_PER_PAGE + 1 }} -
                            {{ Math.min(topic.currentPage * POSTS_PER_PAGE, topic.totalPosts) }} dari
                            {{ topic.totalPosts }} Data
                        </span>

                        <div class="flex items-center space-x-1">
                            <button @click="changePage(topic, topic.currentPage - 1)"
                                :disabled="topic.currentPage === 1"
                                :class="{ 'opacity-50 cursor-not-allowed': topic.currentPage === 1 }"
                                class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                                &lt;
                            </button>

                            <button v-for="page in totalPages(topic)" :key="page" @click="changePage(topic, page)"
                                :class="{
                                    'bg-[#03255C] text-white': topic.currentPage === page,
                                    'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300': topic.currentPage !== page
                                }" class="w-6 h-6 text-xs font-semibold rounded-full transition">
                                {{ page }}
                            </button>

                            <button @click="changePage(topic, topic.currentPage + 1)"
                                :disabled="topic.currentPage === totalPages(topic)"
                                :class="{ 'opacity-50 cursor-not-allowed': topic.currentPage === totalPages(topic) }"
                                class="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 transition">
                                &gt;
                            </button>
                        </div>
                    </div>
                    <div v-else class="text-center text-xs text-gray-600">
                        Menampilkan semua {{ topic.totalPosts }} Data
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
            <div class="grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr,1fr] gap-2 text-center text-sm font-semibold">
                <div class="p-2 bg-[#03255C] text-white rounded-t-lg md:rounded-lg flex items-center justify-center">
                    Status Setiap Platform
                </div>
                <div v-for="platform in platforms" :key="platform.name"
                    class="p-2 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                    <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-6 w-6']" />
                    <span class="text-xs text-gray-700 mt-1">{{ platform.name }}</span>
                </div>

                <template v-for="(item, topicIndex) in platformStatuses" :key="item.topic">
                    <div
                        class="p-2 bg-white border border-gray-200 rounded-lg flex items-center justify-start gap-3 text-left font-bold text-gray-700">
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
                            class="w-full h-full flex items-center justify-center rounded-md">
                            {{ status }}
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>

    <Teleport to="body">
        <div v-if="isDetailModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity duration-300"
            @click.self="closeDetailModal">

            <div
                class="bg-white rounded-xl shadow-2xl p-6 w-11/12 max-w-lg transform transition-all duration-300 scale-100 opacity-100">
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
                                    :class="getSocialIconColor(selectedPost.socialIcon)" class="h-4 w-4" />
                                {{ selectedPost.date }}
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
                    <a :href="'#'" target="_blank"
                        class="text-sm font-semibold bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">Kunjungi
                        Sumber Asli</a>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// --- FONT AWESOME IMPORTS ---
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTiktok, faFacebook, faYoutube, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';

import { faEye, faHeart, faCommentDots, faShareNodes, faUsers, faUser, faChartLine, faCalendarDays, faChartSimple, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// --- KONSTANTA API ---
const API_URL = 'http://127.0.0.1:8000/top-topics'; // Endpoint API Anda
// Perubahan di sini: Mengubah batas postingan menjadi 3
const POSTS_PER_PAGE = 3;

// Di bagian STATE MANAGEMENT

// State untuk jarum Pie Chart (diambil dari status paling dominan)
const pieStatus = ref('EMERGING');

// State baru untuk jarum kedua (misalnya, status untuk TikTok)
const pieStatus2 = ref('CURRENT');

// State baru untuk jarum ketiga (misalnya, status untuk Twitter)
const pieStatus3 = ref('NORMAL');
// --- STATE MANAGEMENT ---
const isLoading = ref(true);
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;

// State for Modal Detail Post
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);

// State for Section 1 (Akan diisi dari API)
const topTopics = ref([]);
const pieChartData = ref({ labels: [], datasets: [] });
const pieChartLabels = ref([]);

// --- Data for Platform Status Table (Mock/Dummy) ---
// --- Data untuk Platform Status Table (Sekarang dengan ikon yang benar) ---
const platforms = ref([
    { name: 'X / Twitter', icon: faXTwitter, color: 'text-gray-800' },
    { name: 'TikTok', icon: faTiktok, color: 'text-black' },
    { name: 'Facebook', icon: faFacebook, color: 'text-blue-600' },
    { name: 'YouTube', icon: faYoutube, color: 'text-red-600' },    
    { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' },
]);
const platformStatuses = ref([]);

// State for Section 2 (diisi dari API, sekarang menampung state pagination)
const topicsDetailsData = ref([]);

// --- CHART OPTIONS (Tetap) ---
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
};

// --- LOGIC FOR SOCIAL ICON COLORS (Disimpelkan ke X/Twitter) ---
const socialIconColors = {
    [faXTwitter.iconName]: 'text-[#03255C]', // Hanya warna X/Twitter yang relevan
};

const getSocialIconColor = (icon) => {
    return socialIconColors[icon.iconName] || 'text-gray-700';
};

// --- LOGIC FOR STATUS COLORS (Perbaikan & Konsisten) ---
const getStatusClass = (status) => {
    const classes = {
        NORMAL: 'text-[#2092EC] border border-[#2092EC] bg-[#2092EC]/10',
        EARLY: 'text-[#28C76F] border border-[#28C76F] bg-[#28C76F]/10',
        EMERGING: 'text-[#AAD816] border border-[#AAD816] bg-[#AAD816]/10',
        CURRENT: 'text-[#FF9900] border border-[#FF9900] bg-[#FF9900]/10',
        CRISIS: 'text-[#E60000] border border-[#E60000] bg-[#E60000]/10',
    };
    return classes[status.toUpperCase()] || 'bg-gray-400 text-white';
};

// --- LOGIC FOR PAGINATION ---

// Menghitung total halaman yang diperlukan per topik
const totalPages = (topic) => {
    return Math.ceil(topic.totalPosts / POSTS_PER_PAGE);
};

// Mengambil post yang akan ditampilkan di halaman saat ini (Limit 3)
const paginatedPosts = (topic) => {
    const start = (topic.currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    // Pastikan allPosts sudah terdefinisi dan merupakan array
    if (topic.allPosts) {
        return topic.allPosts.slice(start, end);
    }
    return [];
};

// Fungsi untuk pindah halaman
const changePage = (topic, page) => {
    if (page >= 1 && page <= totalPages(topic)) {
        topic.currentPage = page;
    }
};

// --- LIFECYCLE HOOKS ---
onMounted(() => {
    updateTime();
    timerInterval = setInterval(updateTime, 1000);
    fetchAllDashboardData();
});

onUnmounted(() => {
    clearInterval(timerInterval);
});

// --- METHODS ---
const openDetailModal = (post) => {
    selectedPost.value = post;
    isDetailModalOpen.value = true;
};

const closeDetailModal = () => {
    isDetailModalOpen.value = false;
    selectedPost.value = null;
};

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};


// --- FUNGSI UTAMA: MENGAMBIL DAN MEMPROSES SEMUA DATA DASBOR DARI API ---
const fetchAllDashboardData = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const topTopicsApiData = data.top_topics || [];

        // 1. Memformat data untuk state topTopics (Kartu Statistik Atas)
        topTopics.value = topTopicsApiData.map((item, index) => ({
            title: `Topik ${index + 1}: ${item.topic}`,
            value: String(item.total_posts).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            // Data perubahan masih mock, bisa disesuaikan jika API menyediakan
            change: index % 2 === 0 ? '+5.0%' : '-1.5%',
        }));

        // --- MOCK DATA UNTUK PIE CHART (Tetap karena API tidak menyediakan) ---
        pieChartData.value = {
            labels: ['Crisis', 'Kereta Api', 'Normal Early', 'Current Emerging', 'Komisaris', 'Presiden'],
            datasets: [{
                backgroundColor: ['#E60000', '#2092EC', '#28C76F', '#AAD816', '#FF9900'],
                data: [10, 15, 25, 25, 25],
                borderWidth: 2,
                borderColor: '#ffffff',
            }],
        };
        pieChartLabels.value = [];


        // 2. Memformat data untuk topicsDetailsData (Bagian Detail Topik dengan Paginasi)
        topicsDetailsData.value = topTopicsApiData.map((topicItem) => {
            // Ambil status dari postingan teratas sebagai status representatif untuk topik tersebut
            const topicStatus = topicItem.top_10_posts[0]?.latest_status || 'N/A';

            const formattedPosts = topicItem.top_10_posts.map(post => {
                const dateObj = new Date(post.created_at);
                const datePart = dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                const timePart = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const formattedDate = `${datePart} | ${timePart}`;
                const totalInteractions = (post.retweet_count || 0) + (post.favorite_count || 0) + (post.reply_count || 0);

                return {
                    id: post.tweet_id,
                    author: post.user.name || post.user.screen_name,
                    avatar: post.user.profile_image_url || 'https://placehold.co/40x40/E2E8F0/4A5568?text=U',
                    date: formattedDate,
                    postStatus: post.latest_status,
                    statusColor: getStatusClass(post.latest_status),
                    content: post.text,
                    socialIcon: faXTwitter, // Hardcode ikon X/Twitter
                    followers: String(post.user.followers_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    following: String(post.user.following_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    engagementScore: (post.engagement || 0).toFixed(2),
                    views: String(totalInteractions).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    likes: String(post.favorite_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    comments: String(post.reply_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    shares: String(post.retweet_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                };
            });

            return {
                title: topicItem.topic,
                status: topicStatus.toUpperCase(), // Pastikan UPPERCASE untuk mencocokkan class
                allPosts: formattedPosts,
                totalPosts: formattedPosts.length,
                currentPage: 1, // State paginasi awal untuk setiap topik
            };
        });

        // 3. ⚡ LOGIKA BARU: Mengisi Tabel Status Platform dari Top 3 Topik
        const topThreeTopicsForTable = topicsDetailsData.value.slice(0, 3);
        platformStatuses.value = topThreeTopicsForTable.map(topic => {
            // 1. Tentukan jumlah platform untuk membuat array dengan panjang yang benar.
            const numPlatforms = platforms.value.length;

            // 2. Cari di mana posisi (indeks) "X / Twitter" berada.
            const twitterIndex = platforms.value.findIndex(p => p.name === 'X / Twitter');

            // 3. Buat sebuah array yang semuanya berisi string kosong.
            // Contoh: ['', '', '', '', '']
            const statusArray = Array(numPlatforms).fill('');

            // 4. Jika kolom "X / Twitter" ditemukan, isi status topik di posisi tersebut.
            if (twitterIndex > -1) {
                statusArray[twitterIndex] = topic.status; // misal: statusArray menjadi ['', '', '', 'CRISIS', '']
            }

            return {
                topic: topic.title,
                statuses: statusArray, // Gunakan array yang sudah dimodifikasi
            };
        });

        // 4. ⚡ LOGIKA BARU: Menghubungkan 3 Jarum Pie Chart dengan Status Topik
        // Jarum 1 untuk Topik 1
        pieStatus.value = topicsDetailsData.value.length > 0 ? topicsDetailsData.value[0].status : 'NORMAL';
        // Jarum 2 untuk Topik 2
        pieStatus2.value = topicsDetailsData.value.length > 1 ? topicsDetailsData.value[1].status : 'NORMAL';
        // Jarum 3 untuk Topik 3
        pieStatus3.value = topicsDetailsData.value.length > 2 ? topicsDetailsData.value[2].status : 'NORMAL';

    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        // Fallback jika API gagal untuk memastikan UI tidak rusak
        topTopics.value = [{ title: 'Gagal Memuat Data', value: '0', change: 'Error' }];
        topicsDetailsData.value = [];
        platformStatuses.value = [];
        pieChartData.value = { labels: [], datasets: [] };
        // Set semua jarum ke status default jika terjadi error
        pieStatus.value = 'NORMAL';
        pieStatus2.value = 'NORMAL';
        pieStatus3.value = 'NORMAL';

    } finally {
        // Pastikan loading state selalu dimatikan setelah selesai
        isLoading.value = false;
    }
};
</script>

---
<style scoped>
/* ======================================= */
/* GAUGE CSS (5 LEVEL) */
/* ======================================= */

.gauge-wrapper {
    display: inline-block;
    width: auto;
    margin: 0 auto;
    padding: 20px 15px 15px;
}

.gauge {
    background: #e7e7e7;
    box-shadow: 0 -3px 6px 2px rgba(0, 0, 0, 0.50);
    width: 250px;
    height: 100px;
    border-radius: 100px 100px 0 0 !important;
    position: relative;
    overflow: hidden;
}

.gauge-center {
    content: '';
    color: #fff;
    width: 60%;
    height: 60%;
    background: #15222E;
    border-radius: 100px 100px 0 0 !important;
    position: absolute;
    box-shadow: 0 -13px 15px -10px rgba(0, 0, 0, 0.28);
    right: 21%;
    bottom: 0;
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
    width: 110px;
    height: 10px;
    background: #e20404;
    border-bottom-left-radius: 100% !important;
    border-bottom-right-radius: 5px !important;
    border-top-left-radius: 100% !important;
    border-top-right-radius: 5px !important;
    position: absolute;
    bottom: -15x;
    left: 10px;
    transform-origin: 100% 4px;
    transform: rotate(0deg);
    box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
    display: none;
    z-index: 9;
}

/* --- ATURAN ANIMASI JARUM (NEEDLE) UNTUK 5 STATUS --- */
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


.slice-colors {
    height: 100%;
}

.slice-colors .st {
    position: absolute;
    bottom: 0;
    width: 0;
    height: 0;
    border: 50px solid transparent;
    transform-origin: 50% 100%;
    left: 50%;
    transform: translateX(-50%) rotate(0deg);
}

/* --- PENGATURAN WARNA 5 LEVEL (36 derajat per segmen) --- */
/* Segmen 1: Normal (TIDAK BERUBAH) */
.five .slice-colors .st.slice-item:nth-child(1) {
    border-top: 50px #e5e7eb solid;
    border-left: 50px #e5e7eb solid;
    transform: translateX(-75%) rotate(-60deg);
    /* Start: 0 deg */
    z-index: 5;
}

/* Segmen 2: Early (TIDAK BERUBAH) */
.five .slice-colors .st.slice-item:nth-child(2) {
    border-top: 50px #e5e7eb solid;
    border-right: 50px #e5e7eb solid;
    transform: translateX(-140%) rotate(0deg);
    /* Rotasi: 36 deg */
    z-index: 5;
}

/* Segmen 3: Emerging (PERBAIKAN ROTASI) */
.five .slice-colors .st.slice-item:nth-child(3) {
    border-top: 50px #e5e7eb solid;
    /* Ubah border-bottom ke border-top agar seragam */
    border-right: 50px #e5e7eb solid;
    /* Pertahankan border-right */
    transform: translateX(-90%) rotate(0deg);
    /* Rotasi: 72 deg (36 * 2) */
    z-index: 5;
}

/* Segmen 4: Current (PERBAIKAN ROTASI) */
.five .slice-colors .st.slice-item:nth-child(4) {
    border-top: 50px #e5e7eb solid;
    /* Ubah border-bottom ke border-top */
    border-right: 50px #e5e7eb solid;
    transform: translateX(-25%) rotate(30deg);
    /* Rotasi: 108 deg (36 * 3) */
    z-index: 5;
}

/* Segmen 5: Crisis (PERBAIKAN ROTASI) */
.five .slice-colors .st.slice-item:nth-child(5) {
    border-top: 50px #e5e7eb solid;
    /* Ubah border-bottom ke border-top */
    border-right: 50px #e5e7eb solid;
    transform: translateX(-25%) rotate(70deg);
    /* Rotasi: 144 deg (36 * 4) */
    z-index: 5;
}

/* ======================================= */
/* PIE CHART NEEDLE CSS (3 JARUM) */
/* ======================================= */

/* WARNA/KETEBALAN JARUM UTAMA (PRIMARY) */
.pie-needle-wrapper.primary .needle {
    width: 340px;
    /* Paling panjang */
    height: 15px;
    background: #03255C;
    /* Merah tebal */
    z-index: 11;
}

/* WARNA/KETEBALAN JARUM KEDUA (SECONDARY - Contoh: Hijau) */
.pie-needle-wrapper.secondary .needle {
    width: 340px;
    /* Sedang */
    height: 13px;
    background: #03255C;
    /* Hijau */
    z-index: 11;
}

/* WARNA/KETEBALAN JARUM KETIGA (TERTIARY - Contoh: Kuning) */
.pie-needle-wrapper.tertiary .needle {
    width: 340px;
    /* Paling pendek */
    height: 10px;
    background: #03255C;
    /* Kuning/Jingga */
    z-index: 11;
}

/* ATURAN UMUM JARUM (Dipertahankan dari perbaikan sebelumnya) */
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
    /* Paling depan */
}

/* Jarum individual - pastikan titik putar 0% 50% */
.pie-needle-wrapper .needle {
    border-radius: 4px;
    position: absolute;
    top: -7px;
    /* Tengah dari height 6px default untuk jarum baru */
    left: 0;
    transform-origin: 0% 50%;
    display: block;
    box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.38);
}

/* KARENA JARUM PERTAMA HEIGHTNYA 10PX, KITA PERLU TWEAK POSISI TOPNYA */
.pie-needle-wrapper.primary .needle {
    top: -5px;
    /* Setengah dari 10px */
}

/* --- ATURAN ANIMASI JARUM (NEEDLE) UNTUK 5 STATUS PIE CHART --- */

/* Jarum 1: PRIMARY (Menggunakan keyframes asli, tidak ada perubahan) */
.pie-needle-wrapper.primary.normal {
    animation: fivespeed1 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.early {
    animation: fivespeed2 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.emerging {
    animation: fivespeed3 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.current {
    animation: fivespeed4 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.crisis {
    animation: fivespeed5 2s 1 both;
    animation-delay: 1s;
}

/* Jarum 2: SECONDARY (Menggunakan keyframes offset negatif) */
.pie-needle-wrapper.secondary.normal {
    animation: fivespeed1-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.early {
    animation: fivespeed2-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.emerging {
    animation: fivespeed3-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.current {
    animation: fivespeed4-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.crisis {
    animation: fivespeed5-secondary 2s 1 both;
    animation-delay: 1s;
}

/* Jarum 3: TERTIARY (Menggunakan keyframes offset positif) */
.pie-needle-wrapper.tertiary.normal {
    animation: fivespeed1-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.early {
    animation: fivespeed2-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.emerging {
    animation: fivespeed3-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.current {
    animation: fivespeed4-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.crisis {
    animation: fivespeed5-tertiary 2s 1 both;
    animation-delay: 1s;
}

/* JANGAN LUPA: Pastikan semua keyframes fivespeed1 sampai fivespeed5 tetap ada di bagian bawah <style> */
/* --- KEYFRAMES BARU UNTUK JARUM SECONDARY (Offset Negatif 4 derajat) --- */
@keyframes fivespeed1-secondary {
    100% {
        transform: rotate(14deg);
    }
}

@keyframes fivespeed2-secondary {
    100% {
        transform: rotate(50deg);
    }
}

@keyframes fivespeed3-secondary {
    100% {
        transform: rotate(86deg);
    }
}

@keyframes fivespeed4-secondary {
    100% {
        transform: rotate(122deg);
    }
}

@keyframes fivespeed5-secondary {
    100% {
        transform: rotate(158deg);
    }
}

/* --- KEYFRAMES BARU UNTUK JARUM TERTIARY (Offset Positif 4 derajat) --- */
@keyframes fivespeed1-tertiary {
    100% {
        transform: rotate(22deg);
    }
}

@keyframes fivespeed2-tertiary {
    100% {
        transform: rotate(58deg);
    }
}

@keyframes fivespeed3-tertiary {
    100% {
        transform: rotate(94deg);
    }
}

@keyframes fivespeed4-tertiary {
    100% {
        transform: rotate(130deg);
    }
}

@keyframes fivespeed5-tertiary {
    100% {
        transform: rotate(166deg);
    }
}

/* --- KEYFRAMES UNTUK 5 KECEPATAN (SUDUT) --- */
@keyframes fivespeed1 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(18deg);
    }

    /* Normal */
}

@keyframes fivespeed2 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(54deg);
    }

    /* Early */
}

@keyframes fivespeed3 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(90deg);
    }

    /* Emerging (Tengah) */
}

@keyframes fivespeed4 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(126deg);
    }

    /* Current */
}

@keyframes fivespeed5 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(162deg);
    }

    /* Crisis */
}

/* ======================================= */
/* END GAUGE CSS */
/* ======================================= */

/* Loader style */
.loader {
    border-top-color: #3B82F6;
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

/* Animasi Fade In */
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


.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* Batasi menjadi 2 baris */
    overflow: hidden;
    text-overflow: ellipsis;
    /* Tambahkan elipsis jika terpotong */
}
</style>