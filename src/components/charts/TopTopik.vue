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
                    <div class="font-poppins text-6xl font-bold text-[#03255C] tracking-wider">
                        {{ currentTime }}
                    </div>
                    <div class="font-poppins text-lg font-bold text-[#03255C] ">
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

                            </div>
                            <p class="font-poppins font-bold text-[#03255C] text-sm mt-1">{{ stat.title }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
                <h3 class="text-xl font-bold text-[#03255C] mb-4">Kompas Status Terkini</h3>
                <div class="relative w-full h-80 md:h-96 flex justify-center items-cente pie-chart-wrapper">
                    <div class="absolute left-4 z-20 space-y-6" v-if="topTopicsForCards.length > 0">
                        <div v-for="(topic, index) in topTopicsForCards" :key="index"
                            class="flex items-center justify-center gap-5 p-3 rounded-lg border-2 shadow-xl backdrop-blur-sm"
                            :style="{ borderColor: topic.color, backgroundColor: topic.color + '80' }">

                            <div class="min-w-0 text-center">
                                <p class="font-bold text-sm text-[#03255C] truncate" :title="topic.title">
                                    {{ topic.title }}
                                </p>
                                <div
                                    class="flex items-center justify-center gap-1.5 text-xs text-gray-700 font-bold mt-3">
                                    <FontAwesomeIcon v-if="topic.platform.icon" :icon="topic.platform.icon"
                                        class="h-3 w-3" />
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <!-- <div class="slice-colors">
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                                <div class="st slice-item"></div>
                            </div> -->
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
                                                class="font-bold text-sm text-[#03255C] block overflow-hidden whitespace-nowrap text-ellipsis">
                                                {{ post.author }}
                                            </span>
                                        </div>
                                        <div class="flex items-center gap-3 flex-shrink-0">
                                            <span
                                                :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                                                {{ post.postStatus }}
                                            </span>
                                            <FontAwesomeIcon :icon="faBookmark" @click="toggleBookmark(post)" :class="[
                                                'h-4 w-4 cursor-pointer transition-colors',
                                                post.isBookmarked
                                                    ? 'text-yellow-500 hover:text-yellow-600'
                                                    : 'text-gray-400 hover:text-[#03255C]'
                                            ]" />
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
                            <p class="text-sm text-[#03255C] mb-5 line-clamp-2">{{ post.content }}</p>
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

                            <div class="flex items-center justify-between mt-3">
                                <div class="min-w-0 mr-4">
                                    <span
                                        class="text-xs font-medium text-gray-600 border border-gray-600 px-2 py-0.5 rounded-lg block overflow-hidden whitespace-nowrap text-ellipsis bg-transparent">
                                        {{ post.topicTag }}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2 flex-shrink-0">
                                    <button @click="openLinkInNewTab(post)"
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
                </div>

                <div class="p-4 border-t border-gray-200 mt-auto">
                    <div v-if="topic.totalPosts > POSTS_PER_PAGE"
                        class="flex justify-between items-center text-xs text-gray-600">
                        <span>
                            {{ (topic.currentPage - 1) * POSTS_PER_PAGE + 1 }} -
                            {{ Math.min(topic.currentPage * POSTS_PER_PAGE, topic.totalPosts) }} dari
                            {{ topic.totalPosts }} Data
                        </span>

                        <div class="flex items-center space-x-2">
                            <button @click="changePage(topic, topic.currentPage - 1)"
                                :disabled="topic.currentPage === 1"
                                :class="{ 'opacity-30 cursor-not-allowed': topic.currentPage === 1, 'hover:bg-gray-100': topic.currentPage !== 1 }"
                                class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold">
                                &lt;
                            </button>

                            <div class="flex items-center justify-center space-x-2">
                                <div v-if="topic.currentPage > 1"
                                    class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                                    {{ topic.currentPage - 1 }}
                                </div>
                                <div v-else class="w-6 h-6"></div>

                                <div
                                    class="w-8 h-8 flex items-center justify-center bg-[#03255C] text-white rounded-full text-base font-bold shadow-md">
                                    {{ topic.currentPage }}
                                </div>

                                <div v-if="topic.currentPage < totalPages(topic)"
                                    class="w-6 h-6 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full text-xs font-semibold">
                                    {{ topic.currentPage + 1 }}
                                </div>
                                <div v-else class="w-6 h-6"></div>
                            </div>

                            <button @click="changePage(topic, topic.currentPage + 1)"
                                :disabled="topic.currentPage === totalPages(topic)"
                                :class="{ 'opacity-30 cursor-not-allowed': topic.currentPage === totalPages(topic), 'hover:bg-gray-100': topic.currentPage !== totalPages(topic) }"
                                class="w-8 h-8 flex items-center justify-center rounded-full transition text-lg font-bold">
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
                <div
                    class="p-2 bg-[#03255C] text-white text-lg font-bold rounded-t-lg md:rounded-lg flex items-center justify-center">
                    Status Setiap Platform
                </div>
                <div v-for="platform in platforms" :key="platform.name"
                    class="p-2 bg-white rounded-lg font-poppins font-bold text-[#03255C] border border-gray-200 flex flex-col items-center justify-center">
                    <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-6 w-6']" />
                    <span class="font-poppins text-sm font-bold text-[#03255C] mt-1">{{ platform.name }}</span>
                </div>

                <template v-for="(item, topicIndex) in platformStatuses" :key="item.topic">
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
                    <button @click="openLinkInNewTab(selectedPost)"
                        class="text-xs font-semibold bg-gray-100 text-[#2092EC] border border-[#2092EC] px-3 py-1.5 rounded-md hover:bg-gray-200 transition flex items-center gap-1">
                        <FontAwesomeIcon :icon="faUpRightFromSquare" class="h-3 w-3" />
                        Kunjungi sumber asli
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTiktok, faFacebook, faYoutube, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBookmark, faEye, faHeart, faCommentDots, faShareNodes, faUsers, faUser, faChartLine, faCalendarDays, faChartSimple, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// ================= PERUBAHAN 1: Menambahkan URL API baru =================
const API_URL = 'http://127.0.0.1:8000/top-topics';
const STATUS_API_URL = 'http://127.0.0.1:8000/topic-status'; // URL untuk status detail
// ================= AKHIR PERUBAHAN 1 =================

const POSTS_PER_PAGE = 3;
const pieStatus = ref('EMERGING');
const pieStatus2 = ref('CURRENT');
const pieStatus3 = ref('NORMAL');
const isLoading = ref(true);
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);
const topTopics = ref([]);
const pieChartData = ref({ labels: [], datasets: [] });
const pieChartLabels = ref([]);

const platforms = ref([
    { name: 'X / Twitter', icon: faXTwitter, color: 'text-gray-800' },
    { name: 'TikTok', icon: faTiktok, color: 'text-black' },
    { name: 'Facebook', icon: faFacebook, color: 'text-blue-600' },
    { name: 'YouTube', icon: faYoutube, color: 'text-red-600' },
    { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' },
]);
const platformStatuses = ref([]);
const topicsDetailsData = ref([]);

const needleColors = {
    primary: '#f2ff00',   // Warna jarum 1
    secondary: '#95ff00', // Warna jarum 2
    tertiary: '#00f9cb'  // Warna jarum 3
};

const topTopicsForCards = computed(() => {
    // Ambil 3 topik pertama dari data utama
    const topics = topicsDetailsData.value.slice(0, 3);
    const colors = [needleColors.primary, needleColors.secondary, needleColors.tertiary];
    // Cari data platform X/Twitter dari ref yang sudah ada
    const twitterPlatform = platforms.value.find(p => p.name === 'X / Twitter');

    // Format data agar mudah digunakan di template
    return topics.map((topic, index) => ({
        title: topic.title,
        color: colors[index],
        platform: twitterPlatform ? { name: twitterPlatform.name, icon: twitterPlatform.icon } : { name: 'N/A', icon: null }
    }));
});


const bookmarkedPosts = ref([]);
// --- BARU: Kunci untuk menyimpan data di localStorage ---
const BOOKMARK_STORAGE_KEY = 'vue-bookmarked-posts';

const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    events: [],
};

const socialIconColors = {
    [faXTwitter.iconName]: 'text-[#03255C]',
};

const getSocialIconColor = (icon) => {
    return socialIconColors[icon.iconName] || 'text-gray-700';
};

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

const totalPages = (topic) => {
    return Math.ceil(topic.totalPosts / POSTS_PER_PAGE);
};

const paginatedPosts = (topic) => {
    const start = (topic.currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    if (topic.allPosts) {
        return topic.allPosts.slice(start, end);
    }
    return [];
};

const changePage = (topic, page) => {
    if (page >= 1 && page <= totalPages(topic)) {
        topic.currentPage = page;
    }
};



const saveBookmarks = () => {
    localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarkedPosts.value));
};

// --- BARU: Fungsi untuk memuat bookmark dari localStorage ---
const loadBookmarks = () => {
    const savedBookmarks = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    if (savedBookmarks) {
        bookmarkedPosts.value = JSON.parse(savedBookmarks);
    }
};


// --- DIUBAH: Fungsi toggleBookmark sekarang melakukan sinkronisasi dua arah ---
const toggleBookmark = (post) => {
    const postIndex = bookmarkedPosts.value.findIndex(p => p.id === post.id);
    let isNowBookmarked;

    if (postIndex === -1) {
        // Kasus: Menambahkan bookmark baru
        post.isBookmarked = true;
        isNowBookmarked = true;
        bookmarkedPosts.value.unshift(post);
    } else {
        // Kasus: Menghapus bookmark
        post.isBookmarked = false;
        isNowBookmarked = false;
        bookmarkedPosts.value.splice(postIndex, 1);
    }

    // --- SINKRONISASI YANG DIPERBAIKI ---
    // Cari postingan asli di dalam `topicsDetailsData` untuk menyamakan status `isBookmarked`.
    // Ini penting agar status bookmark tetap konsisten saat berganti halaman (paginasi).
    for (const topic of topicsDetailsData.value) {
        const originalPost = topic.allPosts.find(p => p.id === post.id);
        if (originalPost) {
            originalPost.isBookmarked = isNowBookmarked;
            break; // Hentikan pencarian jika sudah ditemukan
        }
    }
    // --- AKHIR SINKRONISASI ---

    // Simpan perubahan ke localStorage setiap kali ada aksi
    saveBookmarks();
};


onMounted(() => {
    loadBookmarks();
    updateTime();
    timerInterval = setInterval(updateTime, 1000);
    fetchAllDashboardData();
});

onUnmounted(() => {
    clearInterval(timerInterval);
});

const openDetailModal = (post) => {
    selectedPost.value = post;
    isDetailModalOpen.value = true;
};

const closeDetailModal = () => {
    isDetailModalOpen.value = false;
    selectedPost.value = null;
};

const openLinkInNewTab = (post) => {
    if (post && post.url) {
        // Membuka URL di tab baru. '_blank' adalah targetnya.
        // 'noopener,noreferrer' adalah untuk keamanan.
        window.open(post.url, '_blank', 'noopener,noreferrer');
    } else {
        console.error('URL tidak ditemukan untuk postingan ini:', post);
    }
};

const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};


// ================= AWAL FUNGSI fetchAllDashboardData =================
const fetchAllDashboardData = async () => {
    isLoading.value = true;
    try {
        // --- TAHAP 1: Ambil daftar topik dan detail postingannya ---
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const topTopicsApiData = data.top_topics || [];

        // --- TAHAP 2: Ambil status kalkulasi untuk SETIAP topik secara bersamaan ---
        const enrichedTopicsData = await Promise.all(
            topTopicsApiData.map(async (topicItem) => {
                try {
                    const topicName = encodeURIComponent(topicItem.topic);
                    const statusResponse = await fetch(`${STATUS_API_URL}/${topicName}`);
                    if (!statusResponse.ok) {
                        console.error(`Gagal mengambil status untuk topik: ${topicItem.topic}`);
                        return { ...topicItem, calculated_status: 'N/A' };
                    }
                    const statusData = await statusResponse.json();

                    // --- TAHAP 3: Gabungkan data ---
                    return {
                        ...topicItem,
                        calculated_status: statusData.topic_status,
                    };
                } catch (e) {
                    console.error(`Error saat fetch status untuk ${topicItem.topic}:`, e);
                    return { ...topicItem, calculated_status: 'N/A' };
                }
            })
        );

        // --- TAHAP 4: Proses data yang sudah digabungkan untuk ditampilkan ---

        // Mengisi ringkasan topik teratas
        topTopics.value = topTopicsApiData.map((item, index) => ({
            title: `Topik ${index + 1}: ${item.topic}`,
            value: String(item.total_posts).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
            change: index % 2 === 0 ? '+5.0%' : '-1.5%',
        }));

        // Data Pie Chart
        pieChartData.value = {
            labels: ['Crisis', 'Normal', 'Early', 'Emerging', 'Current'],
            datasets: [{
                backgroundColor: ['#E60000', '#2092EC', '#28C76F', '#AAD816', '#FF9900'],
                data: [10, 15, 25, 25, 25],
                borderWidth: 2,
                borderColor: '#ffffff',
            }],
        };
        pieChartLabels.value = [];

        // Mengisi data detail topik per kartu
        topicsDetailsData.value = enrichedTopicsData.map((topicItem) => {
            const topicStatus = topicItem.calculated_status || 'N/A';
            const formattedPosts = topicItem.top_10_posts.map(post => {
                const dateObj = new Date(post.created_at);
                const datePart = dateObj.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                const timePart = dateObj.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                const formattedDate = `${datePart} | ${timePart}`;
                const totalInteractions = (post.retweet_count || 0) + (post.favorite_count || 0) + (post.reply_count || 0);

                return {
                    id: post.tweet_id,
                    author: post.user.name || post.user.screen_name,
                    avatar: post.user.profile_image_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
                    date: formattedDate,
                    postStatus: post.latest_status,
                    statusColor: getStatusClass(post.latest_status),
                    content: post.text,
                    socialIcon: faXTwitter,
                    followers: String(post.user.followers_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    following: String(post.user.following_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    engagementScore: (post.engagement || 0).toFixed(2),
                    views: String(totalInteractions).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    likes: String(post.favorite_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    comments: String(post.reply_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    shares: String(post.retweet_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    topicTag: topicItem.topic,
                    url: `https://x.com/any/status/${post.tweet_id}`,
                    // isBookmarked: false // Default state, akan di-update nanti
                };
            });

            return {
                title: topicItem.topic,
                status: topicStatus.toUpperCase(),
                allPosts: formattedPosts,
                totalPosts: formattedPosts.length,
                currentPage: 1,
            };
        });

        // Mengisi data tabel platform
        const topThreeTopicsForTable = topicsDetailsData.value.slice(0, 3);
        platformStatuses.value = topThreeTopicsForTable.map(topic => {
            const numPlatforms = platforms.value.length;
            const twitterIndex = platforms.value.findIndex(p => p.name === 'X / Twitter');
            const statusArray = Array(numPlatforms).fill('');
            if (twitterIndex > -1) {
                statusArray[twitterIndex] = topic.status;
            }
            return {
                topic: topic.title,
                statuses: statusArray,
            };
        });

        // Mengatur jarum Pie Chart
        pieStatus.value = topicsDetailsData.value.length > 0 ? topicsDetailsData.value[0].status : 'NORMAL';
        pieStatus2.value = topicsDetailsData.value.length > 1 ? topicsDetailsData.value[1].status : 'NORMAL';
        pieStatus3.value = topicsDetailsData.value.length > 2 ? topicsDetailsData.value[2].status : 'NORMAL';

        // --- TAHAP 5 (KRUSIAL): Sinkronisasi Status Bookmark dari localStorage ---
        // Setelah semua data API dimuat, periksa setiap post dan atur status `isBookmarked`
        // berdasarkan data yang sudah ada di `bookmarkedPosts`.
        const bookmarkedIds = new Set(bookmarkedPosts.value.map(p => p.id));

        topicsDetailsData.value.forEach(topic => {
            topic.allPosts.forEach(post => {
                if (bookmarkedIds.has(post.id)) {
                    post.isBookmarked = true;
                } else {
                    post.isBookmarked = false; // Pastikan properti ini selalu ada
                }
            });
        });

    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        topTopics.value = [{ title: 'Gagal Memuat Data', value: '0', change: 'Error' }];
        topicsDetailsData.value = [];
        platformStatuses.value = [];
        pieChartData.value = { labels: [], datasets: [] };
        pieStatus.value = 'NORMAL';
        pieStatus2.value = 'NORMAL';
        pieStatus3.value = 'NORMAL';
    } finally {
        isLoading.value = false;
    }
};
// ================= AKHIR FUNGSI fetchAllDashboardData =================
// ================= AKHIR PERUBAHAN 2 =================
</script>

<style scoped>
.pie-chart-wrapper :deep(canvas) {
    filter: drop-shadow(12px 8px 10px rgba(0, 0, 0, 0.25));
}

/* Semua style CSS di sini tetap sama, tidak perlu diubah */
/* ======================================= */
/* GAUGE CSS (5 LEVEL) */
/* ======================================= */

.gauge-wrapper {
    display: inline-block;
    width: auto;
    margin: 0 auto;
    padding: 20px 15px 15px;
}

/* .gauge {
    background: #e7e7e7;
    box-shadow: 0 -3px 6px 2px rgba(0, 0, 0, 0.50);
    width: 250px;
    height: 100px;
    border-radius: 100px 100px 0 0 !important;
    position: relative;
    overflow: hidden;
} */

.gauge {
    position: relative;
    /* Penting agar elemen di dalamnya (needle, center) tetap di posisi yang benar */
    width: 250px;
    /* Sesuaikan lebar sesuai kebutuhan Anda */
    height: 125px;
    /* Biasanya setengah dari lebar untuk bentuk setengah lingkaran */
    top: 5px;

    /* Properti utama untuk latar belakang gambar */
    background-image: url('@/assets/image/warna.png');
    /* GANTI DENGAN PATH GAMBAR ANDA */
    background-repeat: no-repeat;
    /* Agar gambar tidak diulang-ulang */
    /* MENJADI SEPERTI INI: */
    background-position: center calc(100% + 1cm);
    background-size: 408px;
    /* Pastikan gambar pas di dalam div tanpa terpotong atau distorsi */
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

.five .slice-colors .st.slice-item:nth-child(1) {
    border-top: 50px #e5e7eb solid;
    border-left: 50px #e5e7eb solid;
    transform: translateX(-75%) rotate(-60deg);
    z-index: 5;
}

.five .slice-colors .st.slice-item:nth-child(2) {
    border-top: 50px #e5e7eb solid;
    border-right: 50px #e5e7eb solid;
    transform: translateX(-140%) rotate(0deg);
    z-index: 5;
}

.five .slice-colors .st.slice-item:nth-child(3) {
    border-top: 50px #e5e7eb solid;
    border-right: 50px #e5e7eb solid;
    transform: translateX(-90%) rotate(0deg);
    z-index: 5;
}

.five .slice-colors .st.slice-item:nth-child(4) {
    border-top: 50px #e5e7eb solid;
    border-right: 50px #e5e7eb solid;
    transform: translateX(-25%) rotate(30deg);
    z-index: 5;
}

.five .slice-colors .st.slice-item:nth-child(5) {
    border-top: 50px #e5e7eb solid;
    border-right: 50px #e5e7eb solid;
    transform: translateX(-25%) rotate(70deg);
    z-index: 5;
}

/* ======================================= */
/* PIE CHART NEEDLE CSS (3 JARUM) */
/* ======================================= */

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

/* ...DENGAN BLOK INI */

/* Primary Needle Animations */
.pie-needle-wrapper.primary.normal {
    animation: fivespeed1-pie 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.early {
    animation: fivespeed2-pie 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.emerging {
    animation: fivespeed3-pie 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.current {
    animation: fivespeed4-pie 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.primary.crisis {
    animation: fivespeed5-pie 2s 1 both;
    animation-delay: 1s;
}

/* Secondary Needle Animations */
.pie-needle-wrapper.secondary.normal {
    animation: fivespeed1-pie-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.early {
    animation: fivespeed2-pie-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.emerging {
    animation: fivespeed3-pie-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.current {
    animation: fivespeed4-pie-secondary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.secondary.crisis {
    animation: fivespeed5-pie-secondary 2s 1 both;
    animation-delay: 1s;
}

/* Tertiary Needle Animations */
.pie-needle-wrapper.tertiary.normal {
    animation: fivespeed1-pie-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.early {
    animation: fivespeed2-pie-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.emerging {
    animation: fivespeed3-pie-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.current {
    animation: fivespeed4-pie-tertiary 2s 1 both;
    animation-delay: 1s;
}

.pie-needle-wrapper.tertiary.crisis {
    animation: fivespeed5-pie-tertiary 2s 1 both;
    animation-delay: 1s;
}

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

@keyframes fivespeed1 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(18deg);
    }
}

@keyframes fivespeed2 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(54deg);
    }
}

@keyframes fivespeed3 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(90deg);
    }
}

@keyframes fivespeed4 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(126deg);
    }
}

@keyframes fivespeed5 {
    0% {
        transform: rotate(0);
    }

    100% {
        transform: rotate(162deg);
    }
}

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


/* ======================================= */
/* KEYFRAMES UNTUK PIE CHART (OFFSET 10deg) */
/* ======================================= */

/* Sudut Dasar untuk Jarum Utama (Primary) */
@keyframes fivespeed1-pie {
    100% {
        transform: rotate(45deg);
    }
}

/* Early */
@keyframes fivespeed2-pie {
    100% {
        transform: rotate(135deg);
    }
}

/* Emerging */
@keyframes fivespeed3-pie {
    100% {
        transform: rotate(225deg);
    }
}

/* Current */
@keyframes fivespeed4-pie {
    100% {
        transform: rotate(-27deg);
    }
}

/* Crisis */
@keyframes fivespeed5-pie {
    100% {
        transform: rotate(-72deg);
    }
}


/* Sudut untuk Jarum Kedua (offset -10deg) */
@keyframes fivespeed1-pie-secondary {
    100% {
        transform: rotate(35deg);
        /* 45 - 10 */
    }
}

@keyframes fivespeed2-pie-secondary {
    100% {
        transform: rotate(125deg);
        /* 135 - 10 */
    }
}

@keyframes fivespeed3-pie-secondary {
    100% {
        transform: rotate(215deg);
        /* 225 - 10 */
    }
}

@keyframes fivespeed4-pie-secondary {
    100% {
        transform: rotate(-37deg);
        /* -27 - 10 */
    }
}

@keyframes fivespeed5-pie-secondary {
    100% {
        transform: rotate(-82deg);
        /* -72 - 10 */
    }
}


/* Sudut untuk Jarum Ketiga (offset +10deg) */
@keyframes fivespeed1-pie-tertiary {
    100% {
        transform: rotate(55deg);
        /* 45 + 10 */
    }
}

@keyframes fivespeed2-pie-tertiary {
    100% {
        transform: rotate(145deg);
        /* 135 + 10 */
    }
}

@keyframes fivespeed3-pie-tertiary {
    100% {
        transform: rotate(235deg);
        /* 225 + 10 */
    }
}

@keyframes fivespeed4-pie-tertiary {
    100% {
        transform: rotate(-17deg);
        /* -27 + 10 */
    }
}

@keyframes fivespeed5-pie-tertiary {
    100% {
        transform: rotate(-62deg);
        /* -72 + 10 */
    }
}
</style>