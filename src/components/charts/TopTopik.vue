<template>
    <div v-if="isLoading"
        class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[48rem]">
        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
        <p class="text-lg font-semibold text-gray-600">Memuat data topik terkini...</p>
    </div>

    <div v-else class="space-y-6 animate-fade-in">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
                class="lg:col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)] flex flex-col justify-between">
                <div class="flex flex-col items-center">
                    <div class="text-6xl font-bold text-gray-800 tracking-wider">
                        {{ currentTime }}
                    </div>
                    <div class="text-lg text-gray-500">
                        {{ currentDate }}
                    </div>
                </div>
                <div class="mt-6 flex flex-col items-center space-y-4">
                    <div v-for="(stat, index) in topTopics" :key="index"
                        class="p-4 w-64 rounded-lg border border-gray-200 bg-white flex items-center">
                        <div class="p-3 bg-blue-100 rounded-lg mr-4 flex items-center justify-center">
                            <FontAwesomeIcon :icon="faChartSimple" class="text-blue-600 text-2xl" />
                        </div>


                        <div class="flex flex-col items-start">
                            <div class="flex items-baseline space-x-2">
                                <span class="text-3xl font-bold text-gray-900">{{ stat.value }}</span>
                                <span class="text-xs font-semibold bg-gray-900 text-white px-2 py-1 rounded-md">
                                    {{ stat.change }}
                                </span>
                            </div>
                            <p class="text-sm text-gray-500 mt-1">{{ stat.title }}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div
                class="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)]">
                <h3 class="text-lg font-bold text-gray-800 mb-4">Kompas Status Terkini</h3>
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
                class="bg-white rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)] flex flex-col">
                <div class="p-4 border-b border-gray-200">
                    <h3 class="text-lg font-bold text-gray-800">Topik {{ index + 1 }}: {{ topic.title }}</h3>
                </div>
                <div class="p-4 flex flex-col items-center">
                    <div :class="[topic.statusColor.bg, topic.statusColor.text]"
                        class="px-4 py-1 text-sm font-bold rounded-full mb-2">
                        {{ topic.status }}
                    </div>
                    <div class="w-full max-w-[200px] aspect-video relative mt-2">
                        <div class="gauge-container">
                            <div class="gauge-segment normal"></div>
                            <div class="gauge-segment early"></div>
                            <div class="gauge-segment emerging"></div>
                            <div class="gauge-segment current-s"></div>
                            <div class="gauge-segment crisis"></div>
                            <div class="gauge-needle" :style="{ transform: `rotate(${topic.gaugeValue}deg)` }"></div>
                            <div class="gauge-center-circle"></div>
                        </div>
                        <div
                            class="absolute w-full h-full flex justify-between items-end text-xs text-gray-500 font-semibold -bottom-2">
                            <span>Normal</span>
                            <span>Crisis</span>
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
                                            <span class="font-bold text-sm text-gray-800">{{ post.author }}</span>
                                        </div>

                                        <div class="flex items-center gap-2">
                                            <FontAwesomeIcon v-if="post.isBookmarked" :icon="faStar"
                                                class="h-4 w-4 text-yellow-500 cursor-pointer hover:text-yellow-600 transition" />
                                            <span
                                                :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                                                {{ post.postStatus }}
                                            </span>
                                        </div>
                                    </div>

                                    <div class="flex justify-start items-center gap-4 mt-0.5">
                                        <p class="text-xs text-gray-500">{{ post.date }}</p>
                                        <p class="text-xs font-semibold text-blue-500">Folls: {{ post.followers }}</p>
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

                                <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">Topik: {{ post.topicTag }}</span>
                            </div>
                            <div class="flex items-center justify-end gap-2 mt-3">
                                <button
                                    class="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition">Kunjungi</button>
                                <button
                                    class="text-xs font-semibold bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition">Lihat
                                    Detail</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="p-4 border-t border-gray-200 mt-auto">
                    <div class="flex justify-between items-center text-xs text-gray-600">
                        <span>Menampilkan 1 - 3 dari {{ topic.pagination.total }} Data</span>
                        <div class="flex items-center">...</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-white p-4 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(0,0,0,0.3)]">
            <div class="grid grid-cols-[1.5fr,1fr,1fr,1fr,1fr,1fr] gap-2 text-center text-sm font-semibold">
                <div class="p-2 bg-gray-800 text-white rounded-t-lg md:rounded-lg flex items-center justify-center">
                    Status Setiap Platform
                </div>
                <div v-for="platform in platforms" :key="platform.name"
                    class="p-2 bg-white rounded-lg border border-gray-200 flex flex-col items-center justify-center">
                    <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-6 w-6']" />
                    <span class="text-xs text-gray-700 mt-1">{{ platform.name }}</span>
                </div>

                <template v-for="(item, topicIndex) in platformStatuses" :key="topicIndex">
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
                    <div v-for="(status, statusIndex) in item.statuses" :key="statusIndex"
                        :class="getStatusClass(status)"
                        class="p-2 rounded-lg flex items-center justify-center font-bold">
                        {{ status }}
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// --- FONT AWESOME IMPORTS ---
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// Ikon Merek Sosial
import { faTiktok, faFacebook, faYoutube, faXTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
// Ikon Solid Baru untuk Metrik
// PERBAIKAN: Menambahkan faChartSimple ke impor solid
import { faStar, faEye, faHeart, faCommentDots, faShareNodes, faChartSimple } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// --- COMBINED STATE ---
const isLoading = ref(true);
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;

// State for Section 1
const topTopics = ref([]);
const pieChartData = ref({ labels: [], datasets: [] });
const pieChartLabels = ref([]);

// --- Data for Platform Status Table ---
const platforms = ref([
    { name: 'TikTok', icon: faTiktok, color: 'text-black' },
    { name: 'Facebook', icon: faFacebook, color: 'text-blue-600' },
    { name: 'YouTube', icon: faYoutube, color: 'text-red-600' },
    { name: 'X / Twitter', icon: faXTwitter, color: 'text-black' },
    { name: 'Instagram', icon: faInstagram, color: 'text-pink-600' },
]);
const platformStatuses = ref([]);

// State for Section 2
const topicsDetailsData = ref([]);

// --- CHART OPTIONS ---
const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
};

// --- LOGIC FOR SOCIAL ICON COLORS (Refactored) ---
const socialIconColors = {
    [faTiktok.iconName]: 'text-black',
    [faFacebook.iconName]: 'text-blue-600',
    [faYoutube.iconName]: 'text-red-600',
    [faXTwitter.iconName]: 'text-black',
    [faInstagram.iconName]: 'text-pink-600',
};

const getSocialIconColor = (icon) => {
    // Menggunakan iconName untuk pencarian yang lebih solid
    return socialIconColors[icon.iconName] || 'text-gray-700';
};

// --- LOGIC FOR STATUS COLORS (Perbaikan) ---
const getStatusClass = (status) => {
    // PERBAIKAN: Menambahkan kelas teks agar tidak selalu putih (terutama untuk Emerging)
    const classes = {
        'Normal': 'bg-blue-500 text-white',
        'Early': 'bg-green-500 text-white',
        'Emerging': 'bg-lime-400 text-gray-800', // Teks gelap untuk keterbacaan yang lebih baik
        'Current': 'bg-orange-500 text-white',
        'Crisis': 'bg-red-600 text-white',
    };
    return classes[status] || 'bg-gray-400 text-white';
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
const updateTime = () => {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};


const fetchAllDashboardData = () => {
    // Simulate one single API call for all data in this component
    setTimeout(() => {
        // --- Data for Section 1 (Top Cards & Pie Chart) ---
        topTopics.value = [
            { title: 'Total Post Topik 1', value: '1,836', change: '-3.2%' },
            { title: 'Total Post Topik 2', value: '1,836', change: '-3.2%' },
            { title: 'Total Post Topik 3', value: '1,836', change: '-3.2%' },
        ];
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

        // --- Data for Topic Details Section ---
        topicsDetailsData.value = [
            {
                title: 'Kereta Api', status: 'CRISIS', statusColor: { bg: 'bg-red-600', text: 'text-white' }, gaugeValue: 160,
                posts: [
                    {
                        id: 1,
                        author: 'fachryAlamsyah',
                        avatar: 'https://placehold.co/40x40/3B82F6/FFFFFF?text=F',
                        date: '02 Juni 2024 12:00:15',
                        postStatus: 'Early',
                        statusColor: 'bg-green-100 text-green-800',
                        content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
                        topicTag: 'Kereta',
                        isBookmarked: true,
                        socialIcon: faTiktok,
                        followers: '1.2M',
                        engagementScore: '9.8',
                        views: '125K',
                        likes: '15K',
                        comments: '3.1K',
                        shares: '7.5K',
                    }
                ],
                pagination: { total: 8 }
            },
            {
                title: 'Komisaris', status: 'EMERGING', statusColor: { bg: 'bg-yellow-400', text: 'text-yellow-900' }, gaugeValue: 80,
                posts: [
                    {
                        id: 4,
                        author: 'Budi_Santoso',
                        avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=BS',
                        date: '02 Juni 2024 12:00:15',
                        postStatus: 'Normal',
                        statusColor: 'bg-blue-100 text-blue-800',
                        content: 'Berita terbaru mengenai restrukturisasi perusahaan harus dicermati oleh publik. Kita perlu transparansi.',
                        topicTag: 'Bisnis',
                        isBookmarked: false,
                        socialIcon: faFacebook,
                        followers: '30K',
                        engagementScore: '5.2',
                        views: '5K',
                        likes: '450',
                        comments: '80',
                        shares: '12',
                    }
                ],
                pagination: { total: 8 }
            },
            {
                title: 'Presiden', status: 'NORMAL', statusColor: { bg: 'bg-blue-500', text: 'text-white' }, gaugeValue: 20,
                posts: [
                    {
                        id: 7,
                        author: 'PolitikToday',
                        avatar: 'https://placehold.co/40x40/10B981/FFFFFF?text=PT',
                        date: '02 Juni 2024 12:00:15',
                        postStatus: 'Current',
                        statusColor: 'bg-orange-100 text-orange-800',
                        content: 'Presiden hari ini menyampaikan pidato penting tentang ketahanan pangan nasional di Istana Negara.',
                        topicTag: 'Pemerintahan',
                        isBookmarked: true,
                        socialIcon: faXTwitter,
                        followers: '5M',
                        engagementScore: '7.9',
                        views: '2M',
                        likes: '150K',
                        comments: '20K',
                        shares: '50K',
                    }
                ],
                pagination: { total: 8 }
            },
        ];

        // --- Data for new Platform Status Table ---
        platformStatuses.value = [
            {
                topic: 'Kereta Api',
                statuses: ['Normal', 'Early', 'Emerging', 'Current', 'Crisis']
            },
            {
                topic: 'Komisaris',
                statuses: ['Crisis', 'Current', 'Emerging', 'Early', 'Normal']
            },
            {
                topic: 'Presiden',
                statuses: ['Emerging', 'Normal', 'Current', 'Early', 'Crisis']
            },
        ];

        isLoading.value = false;
    }, 1500);
};
</script>


<style scoped>
/* Styles from previous components are combined here */
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

.gauge-container {
    width: 100%;
    height: 50%;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    border-radius: 100px 100px 0 0;
}

.gauge-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 100px 100px 0 0;
    transform-origin: 50% 100%;
    clip-path: polygon(50% 100%, 0 100%, 0 0, 50% 0);
}

.gauge-segment.normal {
    background-color: #3b82f6;
    transform: rotate(0deg);
}

.gauge-segment.early {
    background-color: #22c55e;
    transform: rotate(36deg);
}

.gauge-segment.emerging {
    background-color: #eab308;
    transform: rotate(72deg);
}

.gauge-segment.current-s {
    background-color: #f97316;
    transform: rotate(108deg);
}

.gauge-segment.crisis {
    background-color: #ef4444;
    transform: rotate(144deg);
}

.gauge-needle {
    position: absolute;
    width: 2px;
    height: 45%;
    background-color: #1f2937;
    bottom: 0;
    left: 50%;
    transform-origin: 50% 100%;
    transition: transform 0.5s ease-out;
    z-index: 10;
}

.gauge-center-circle {
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: #1f2937;
    border-radius: 50%;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 11;
}
</style>