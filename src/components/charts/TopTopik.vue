<template>
    <div v-if="isLoading"
        class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[48rem]">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p class="text-lg font-semibold text-gray-600">Memuat data topik terkini dari API...</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
                class="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(3,37,92,0.3)] flex flex-col justify-between">
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
                class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(3,37,92,0.3)]">
                <h3 class="text-lg font-bold text-[#03255C] mb-4">Kompas Status Terkini</h3>
                <div class="relative w-full h-80 md:h-96 flex justify-center items-center">
                    <div class="absolute w-full h-full">
                        <Pie :data="pieChartData" :options="pieChartOptions" />
                    </div>
                    <div v-for="label in pieChartLabels" :key="label.name" :style="label.position"
                        class="absolute px-3 py-1.5 bg-white rounded-md shadow-lg border border-gray-200 flex items-center gap-2 text-xs font-semibold">
                        <span v-html="label.icon" class="h-4 w-4"></span>
                        <span>{{ label.name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(topic, index) in topicsDetailsData" :key="index"
                class="bg-white rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(3,37,92,0.3)] flex flex-col">
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
                        <div v-for="post in topic.posts" :key="post.id" class="border border-gray-200 rounded-lg p-3">
                            <div class="flex items-start mb-2">
                                <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
                                <div class="flex-grow">
                                    <div class="flex justify-between items-center">
                                        <div class="flex items-center gap-2">
                                            <FontAwesomeIcon :icon="post.socialIcon"
                                                :class="getSocialIconColor(post.socialIcon)" class="h-4 w-4" />
                                            <span class="font-bold text-sm text-[#03255C]">{{ post.author }}</span>
                                        </div>
                                        <div class="flex items-center gap-2">
                                            <span
                                                :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                                                {{ post.postStatus }}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="flex justify-start items-center gap-4 mt-0.5">
                                        <p class="text-xs text-gray-500">{{ post.date }}</p>
                                        <p class="text-xs font-semibold text-blue-500">Folls: {{ post.followers }}</p>
                                        <p class="text-xs font-semibold text-cyan-500">Follwing: {{ post.following }}
                                        </p>
                                        <p class="text-xs font-semibold text-purple-500">Engg: {{ post.engagementScore
                                            }}</p>
                                    </div>
                                </div>
                            </div>
                            <p class="text-sm text-gray-600 mb-3">{{ post.content }}</p>

                            <div class="flex items-center justify-between text-xs text-gray-500">
                                <div class="flex items-center gap-4">
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faEye" class="h-4 w-4" />
                                        <span>{{ post.views }}</span>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <FontAwesomeIcon :icon="faHeart" class="h-4 w-4 text-red-500" />
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
                                    class="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition">Kunjungi</button>
                                <button @click="openDetailModal(post)"
                                    class="text-xs font-semibold bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition">Lihat
                                    Detail</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border-t border-gray-200 mt-auto">
                    <div class="flex justify-between items-center text-xs text-gray-600">
                        <span>Menampilkan 1 - {{ topic.pagination.total }} dari {{ topic.pagination.total }} Data</span>
                        <div class="flex items-center">...</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(3,37,92,0.3)]">
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
                        :class="getStatusClass(status)"
                        class="p-2 rounded-lg flex items-center justify-center font-bold">
                        {{ status }}
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
// Menghapus TikTok, Facebook, Youtube, Instagram (karena API hanya dari X)
import { faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { faEye, faHeart, faCommentDots, faShareNodes, faChartSimple } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// --- KONSTANTA API ---
const API_URL = 'http://127.0.0.1:8000/top-topics'; // Endpoint API Anda

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
const platforms = ref([
    { name: 'TikTok', icon: faXTwitter, color: 'text-[#03255C]' },
    { name: 'Facebook', icon: faXTwitter, color: 'text-blue-600' },
    { name: 'YouTube', icon: faXTwitter, color: 'text-red-600' },
    { name: 'X / Twitter', icon: faXTwitter, color: 'text-[#03255C]' },
    { name: 'Instagram', icon: faXTwitter, color: 'text-pink-600' },
]);
const platformStatuses = ref([
    // Mock data untuk mengisi tabel agar tidak kosong
    { topic: 'Topik A', statuses: ['Normal', 'Early', 'Emerging', 'Current', 'Crisis'] },
    { topic: 'Topik B', statuses: ['Crisis', 'Current', 'Emerging', 'Early', 'Normal'] },
]);

// State for Section 2 (Mock/diisi dari API)
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
        'NORMAL': 'bg-blue-500 text-white',
        'EARLY': 'bg-green-500 text-white',
        'EMERGING': 'bg-lime-400 text-gray-800',
        'CURRENT': 'bg-orange-500 text-white',
        'CRISIS': 'bg-red-600 text-white',
        'N/A': 'bg-gray-400 text-white',
        'UNKNOWN': 'bg-gray-400 text-white',
    };
    return classes[status.toUpperCase()] || 'bg-gray-400 text-white';
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


// --- FUNGSI UTAMA: MENGAMBIL DATA DARI API NYATA ---
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
            // Data perubahan masih mock
            change: index % 2 === 0 ? '+5.0%' : '-1.5%',
        }));

        // --- MOCK DATA UNTUK PIE CHART (Tetap karena API tidak menyediakan) ---
        pieChartData.value = {
            labels: ['Crisis', 'Kereta Api', 'Normal Early', 'Current Emerging', 'Komisaris', 'Presiden'],
            datasets: [{
                backgroundColor: ['#DC2626', '#16A34A', '#22C55E', '#A3E635', '#A855F7', '#2563EB'],
                data: [10, 15, 25, 30, 10, 10],
                borderWidth: 2,
                borderColor: '#ffffff',
            }],
        };
        pieChartLabels.value = [
            { name: 'Komisaris', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="text-purple-500" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v2.228h-1.307c-.983 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>`, position: { top: '20%', left: '5%' } },
            { name: 'Crisis', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="text-red-600" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>`, position: { top: '10%', left: '45%' } },
            { name: 'Kereta Api', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="text-green-600" viewBox="0 0 16 16" fill="currentColor"><path d="M8.051 1.999a6.062 6.062 0 00-4.287 1.777A6.062 6.062 0 001.999 8.05a6.062 6.062 0 001.766 4.288 6.062 6.062 0 004.287 1.777 6.062 6.062 0 004.287-1.777A6.062 6.062 0 0014.102 8.05a6.062 6.062 0 00-1.765-4.287A6.062 6.062 0 008.05 1.999zM6.387 11.25V4.85l4.433 3.2z"/></svg>`, position: { top: '20%', right: '5%' } },
            { name: 'Presiden', icon: `<svg xmlns="http://www.w3.org/2000/svg" class="text-blue-600" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v2.228h-1.307c-.983 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>`, position: { bottom: '15%', right: '20%' } },
        ];


        // 2. Memformat data untuk topicsDetailsData (Bagian Detail Topik)
        topicsDetailsData.value = topTopicsApiData.map((topicItem, index) => {

            // Tentukan status topik (ambil status dari post teratas untuk keperluan visualisasi gauge)
            const topicStatus = topicItem.top_10_posts[0]?.latest_status || 'N/A';

            return {
                title: topicItem.topic,
                status: topicStatus.toUpperCase(),
                gaugeValue: index * 40, // Mocked, untuk mengatur jarum

                posts: topicItem.top_10_posts.map(post => {
                    // Konversi created_at dari string ISO (hasil datetime.fromtimestamp)
                    const dateObj = new Date(post.created_at);
                    const formattedDate = dateObj.toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

                    // Hitung views (estimasi)
                    const totalInteractions = (post.retweet_count || 0) + (post.favorite_count || 0) + (post.reply_count || 0);

                    return {
                        id: post.tweet_id,
                        author: post.user.name || post.user.screen_name,
                        avatar: post.user.profile_image_url || 'https://placehold.co/40x40/E2E8F0/4A5568?text=U',
                        date: formattedDate,
                        postStatus: post.latest_status,
                        statusColor: getStatusClass(post.latest_status),
                        content: post.text,
                        topicTag: 'N/A', // Dihilangkan sesuai permintaan
                        isBookmarked: false, // Dihilangkan sesuai permintaan
                        socialIcon: faXTwitter, // Hardcode X/Twitter

                        followers: String(post.user.followers_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        following: String(post.user.following_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","), // TAMBAHAN: Following

                        engagementScore: (post.engagement || 0).toFixed(2),
                        views: String(totalInteractions).replace(/\B(?=(\d{3})+(?!\d))/g, ","), // Views dihitung dari interaksi
                        likes: String(post.favorite_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        comments: String(post.reply_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                        shares: String(post.retweet_count || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
                    };
                }),

                pagination: { total: topicItem.top_10_posts.length }
            };
        });

    } catch (error) {
        console.error("Gagal mengambil data dari API:", error);
        // Fallback
        topTopics.value = [{ title: 'Gagal Memuat', value: '0', change: 'Error' }];
        topicsDetailsData.value = [];
        pieChartData.value = { labels: [], datasets: [] };

    } finally {
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
/* Segmen 1: Normal */
.five .slice-colors .st.slice-item:nth-child(1) {
    border-top: 50px #3B82F6 solid;
    border-left: 50px #3B82F6 solid;
    transform: translateX(-50%) rotate(0deg);
    z-index: 5;
}

/* Segmen 2: Early */
.five .slice-colors .st.slice-item:nth-child(2) {
    border-top: 50px #22C55E solid;
    border-right: 50px #22C55E solid;
    transform: translateX(-50%) rotate(36deg);
    z-index: 4;
}

/* Segmen 3: Emerging */
.five .slice-colors .st.slice-item:nth-child(3) {
    border-bottom: 50px #EAB308 solid;
    border-right: 50px #EAB308 solid;
    transform: translateX(-50%) rotate(72deg);
    z-index: 3;
}

/* Segmen 4: Current */
.five .slice-colors .st.slice-item:nth-child(4) {
    border-bottom: 50px #F97316 solid;
    border-right: 50px #F97316 solid;
    transform: translateX(-50%) rotate(108deg);
    z-index: 2;
}

/* Segmen 5: Crisis */
.five .slice-colors .st.slice-item:nth-child(5) {
    border-bottom: 50px #EF4444 solid;
    border-right: 50px #EF4444 solid;
    transform: translateX(-50%) rotate(144deg);
    z-index: 1;
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
</style>