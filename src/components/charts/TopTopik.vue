<template>
  <div v-if="isLoading"
    class="flex flex-col justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[48rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600">Memuat data topik terkini...</p>
  </div>

  <div v-else class="space-y-6 animate-fade-in">

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <div class="lg:col-span-1 space-y-6">

        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm text-center">
          <div class="text-5xl font-bold text-[#03255C] tracking-tight">{{ currentTime }}</div>
          <div class="text-base font-semibold text-gray-500">{{ currentDate }}</div>
        </div>
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[700px]">
          <div class="p-4 border-b border-gray-100">
            <h3 class="text-lg font-bold text-[#03255C]">Postingan Viral Terbaru</h3>
            <p class="text-sm text-gray-500">Semua postingan viral teratas, diurutkan.</p>
          </div>
          <div class="p-4 space-y-3 flex-grow overflow-y-auto">
            <div class="flex flex-wrap gap-2 mb-4">
              <button v-for="topic in availableTopics" :key="topic" @click="selectedTopic = topic" :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-full border transition',
                selectedTopic === topic
                  ? 'bg-[#03255C] text-white border-[#03255C]'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              ]">
                {{ topic }}
              </button>
              <button @click="selectedTopic = 'All'" :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-full border transition',
                selectedTopic === 'All'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
              ]">
                Semua
              </button>
            </div>

            <div v-if="paginatedFeedPosts.length === 0" class="text-center text-sm text-gray-500 pt-10">
              Tidak ada postingan viral{{ selectedTopic === 'All' ? '' : ' untuk topik ini' }}.
            </div>
            <div v-for="post in paginatedFeedPosts" :key="post.id"
              class="bg-gray-50 border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-md hover:border-blue-300">
              <div class="flex items-start">
                <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
                <div class="flex-grow min-w-0">

                  <div class="flex justify-between items-center">
                    <span class="font-bold text-sm text-gray-800 truncate">{{ post.author }}</span>
                    <span
                      :class="[getStatusClass(post.postStatus).badge, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                      {{ post.postStatus }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500">{{ post.date }}</p>

                  <div class="mt-1">
                    <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded"
                      :title="post.topicTag">
                      {{ post.topicTag }}
                    </span>
                  </div>

                  <p class="text-sm text-gray-700 mt-1.5 line-clamp-2">{{ post.content }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                <button @click="openLinkInNewTab(post)"
                  class="w-full text-xs font-semibold bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-1.5">
                  <FontAwesomeIcon :icon="faUpRightFromSquare" /> Kunjungi
                </button>
                <button @click="openDetailModal(post)"
                  class="w-full text-xs font-semibold bg-[#03255C] text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 transition flex items-center justify-center gap-1.5">
                  <FontAwesomeIcon :icon="faEye" /> Detail
                </button>
              </div>

            </div>
          </div>
          <div v-if="pagination.total > pagination.perPage" class="p-4 border-t border-gray-200 mt-auto">
            <div class="flex justify-between items-center text-xs text-gray-600">
              <span>{{ (pagination.currentPage - 1) * pagination.perPage + 1 }} - {{ Math.min(pagination.currentPage *
                pagination.perPage, pagination.total) }} dari {{ pagination.total }}</span>
              <div class="flex items-center space-x-1">
                <button @click="changeFeedPage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1"
                  class="pagination-arrow-btn">
                  <FontAwesomeIcon :icon="faChevronLeft" class="h-3 w-3" />
                </button>
                <button @click="changeFeedPage(pagination.currentPage + 1)"
                  :disabled="pagination.currentPage === totalFeedPages" class="pagination-arrow-btn">
                  <FontAwesomeIcon :icon="faChevronRight" class="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2 space-y-6">

        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-[#03255C] mb-2">Kompas Status Terkini</h3>
          <p class="text-sm text-gray-500 mb-4">Posisi 3 topik teratas berdasarkan status.</p>

          <div class="relative w-full h-80 md:h-96 flex justify-center items-center pie-chart-wrapper"
            @mouseleave="hidePieTooltip">
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
          <div class="grid grid-cols-3 gap-4 mt-4 text-center">
            <div v-for="(topic, index) in topTopicsForLegend" :key="topic.title">
              <div class="flex items-center justify-center gap-2">
                <span class="w-4 h-1.5 rounded-full" :style="{ backgroundColor: topic.color }"></span>
                <span class="text-sm font-semibold text-gray-600">Jarum {{ index + 1 }}</span>
              </div>
              <p class="text-sm font-bold text-[#03255C] mt-1 line-clamp-1" :title="topic.title">{{ topic.title }}</p>
            </div>
          </div>
        </div>

        <div class="flex space-x-4 overflow-x-auto p-2 carousel-container custom-scrollbar snap-x snap-mandatory">
          <div v-for="(stat, index) in allTopicStats" :key="stat.title"
            class="flex-shrink-0 w-[15.5rem] h-[15.5rem] rounded-xl p-6 text-white transition-transform duration-300 hover:scale-[1.02] flex flex-col justify-center items-center text-center snap-center"
            :class="getCardBackground(index)">

            <div class="absolute top-4 left-4 right-4 flex justify-between items-start">
              <p class="text-base font-semibold opacity-90 flex items-center gap-2">
                <span
                  class="w-6 h-6 rounded-full bg-white bg-opacity-30 flex items-center justify-center font-extrabold text-sm">
                  {{ index + 1 }}
                </span>
              </p>
            </div>

            <div class="flex flex-col items-center justify-center mt-auto mb-auto">
              <span class="text-xl font-extrabold tracking-tight leading-snug line-clamp-2" :title="stat.title">{{
                stat.title }}</span>

              <span class="text-6xl font-extrabold tracking-tight leading-none mt-3">{{ stat.value }}</span>
              <span class="text-lg font-light uppercase tracking-wider opacity-80 mt-2">Total Posts</span>
            </div>

          </div>

          <div v-if="allTopicStats.length === 0"
            class="flex-shrink-0 w-64 h-64 rounded-xl p-4 shadow-xl text-gray-500 bg-white border border-dashed border-gray-300 flex items-center justify-center snap-center">
            <p class="text-sm">Tidak Ada Data Topik Tersedia</p>
          </div>
        </div>

      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-[#03255C]">Detail per Topik</h2>
      <p class="text-sm text-gray-500">
        Breakdown postingan teratas untuk setiap topik yang terdeteksi. Geser ke samping untuk melihat lebih banyak.
      </p>
    </div>

    <div class="flex space-x-6 overflow-x-auto p-2 carousel-container custom-scrollbar snap-x snap-mandatory">

      <div v-for="(topic, index) in allTopicsDetailsData" :key="index"
        class="flex-shrink-0 w-80 bg-white rounded-xl border border-gray-200 shadow-lg flex flex-col snap-center">

        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-[#03255C] line-clamp-1">
            Topik {{ index + 1 }}: {{ topic.title }}
          </h3>
        </div>

        <!-- Gauge -->
        <div class="relative p-4 flex flex-col items-center bg-gray-50/50 cursor-help"
          @mouseenter="hoveredStatusRef = { topic: topic.title, status: topic.status }"
          @mouseleave="hoveredStatusRef = { topic: null, status: null }">
          <div class="gauge-container">
            <div class="gauge-semi-circle" :style="getGaugeStyle(topic.status)">
              <div class="gauge-needle"></div>
            </div>

            <div class="gauge-inner-circle">
              <div class="gauge-label">STATUS</div>
              <div class="gauge-value" :class="getStatusClass(topic.status).text">
                {{ topic.status }}
              </div>
            </div>
          </div>
        </div>

        <!-- Posts List -->
        <div class="p-4 flex-grow h-96 overflow-y-auto custom-scrollbar">

          <h4 class="text-base font-bold text-[#03255C] mb-3">
            Postingan Teratas Topik Ini
          </h4>

          <div class="space-y-3">

            <div v-if="topic.allPosts.length === 0" class="text-center text-sm text-gray-500 py-10">
              Tidak ada postingan untuk topik ini.
            </div>

            <div v-for="post in topic.allPosts" :key="post.id"
              class="bg-white border border-gray-200 rounded-lg p-3 group transition-shadow hover:shadow-md hover:border-blue-300">

              <!-- Header -->
              <div class="flex items-start mb-2.5">
                <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">

                <div class="flex-grow min-w-0">

                  <div class="flex justify-between items-start mb-1">

                    <div class="flex items-center gap-2 max-w-[calc(100%-4rem)]">
                      <FontAwesomeIcon :icon="post.socialIcon" :class="getSocialIconColor(post.socialIcon)"
                        class="h-4 w-4" />

                      <span
                        class="font-bold text-sm text-gray-800 block truncate group-hover:text-blue-600 transition-colors">
                        {{ post.author }}
                      </span>
                    </div>

                    <FontAwesomeIcon :icon="faBookmark" @click="toggleBookmark(post)" :class="[
                      'h-4 w-4 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125',
                      post.isBookmarked ? 'text-yellow-500' : 'text-gray-300 group-hover:text-yellow-400'
                    ]" />
                  </div>

                  <p class="text-xs text-gray-500 flex items-center gap-1.5">
                    <FontAwesomeIcon :icon="faCalendarDays" class="h-3 w-3" />
                    <span>{{ post.date }}</span>
                  </p>
                </div>
              </div>

              <!-- Content -->
              <p class="text-sm text-gray-700 mb-3 line-clamp-2">
                {{ post.content }}
              </p>

              <!-- Stats -->
              <div class="flex items-center justify-between text-xs text-gray-500 mb-3 border-t border-gray-100 pt-3">
                <div class="flex items-center gap-3">

                  <span class="flex items-center gap-1" title="Likes">
                    <FontAwesomeIcon :icon="faHeart" class="text-red-500" />
                    {{ post.likes }}
                  </span>

                  <span class="flex items-center gap-1" title="Comments">
                    <FontAwesomeIcon :icon="faCommentDots" />
                    {{ post.comments }}
                  </span>

                  <span v-if="post.views > 0 && (post.platform === 'twitter')" class="flex items-center gap-1"
                    title="Reposts">
                    <FontAwesomeIcon :icon="faArrowsRotate" class="text-blue-500" />
                    {{ post.repost }}
                  </span>

                  <span v-if="post.shares > 0 && (post.platform === 'instagram' || post.platform === 'tiktok')"
                    class="flex items-center gap-1" title="Shares">
                    <FontAwesomeIcon :icon="faShareNodes" class="text-green-500" />
                    {{ post.shares }}
                  </span>

                  <span v-if="post.views > 0 && (post.platform === 'twitter' || post.platform === 'tiktok')"
                    class="flex items-center gap-1" title="Views">
                    <FontAwesomeIcon :icon="faEye" />
                    {{ post.views }}
                  </span>

                </div>

                <span :class="[getStatusClass(post.postStatus).badge, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                  {{ post.postStatus }}
                </span>
              </div>

              <!-- Buttons -->
              <div class="flex items-center gap-2">
                <button @click="openLinkInNewTab(post)"
                  class="w-full text-xs font-semibold bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-1.5">
                  <FontAwesomeIcon :icon="faUpRightFromSquare" /> Kunjungi
                </button>

                <button @click="openDetailModal(post)"
                  class="w-full text-xs font-semibold bg-[#03255C] text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 transition flex items-center justify-center gap-1.5">
                  <FontAwesomeIcon :icon="faEye" /> Detail
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>


    <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <h3 class="text-xl font-bold text-[#03255C] mb-4">Matriks Status Platform</h3>
      <div class="overflow-x-auto">
        <table class="platform-table w-full text-sm text-left">
          <thead class="text-xs text-[#03255C] uppercase bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 rounded-l-lg">Topik</th>
              <th v-for="platform in platforms" :key="platform.name" scope="col" class="px-6 py-3 text-center">
                <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-5 w-5']" :title="platform.name" />
              </th>
              <th scope="col" class="rounded-r-lg"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in allPlatformStatuses" :key="item.topic" class="bg-white border-b border-gray-100">
              <th scope="row" class="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">{{ item.topic }}</th>

              <td v-for="(status, statusIndex) in item.statuses" :key="`${item.topic}-${statusIndex}`"
                class="px-6 py-4 text-center">
                <div v-if="status" class="relative inline-block"
                  @mouseenter="hoveredStatusRef = { topic: item.topic, status: status }"
                  @mouseleave="hoveredStatusRef = { topic: null, status: null }">
                  <span :class="getStatusClass(status).badge"
                    class="px-2.5 py-1 text-xs font-bold rounded-full cursor-help">
                    {{ status }}
                  </span>


                </div>
                <span v-else class="text-gray-400">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isDetailModalOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fade-in"
        @click.self="closeDetailModal">

        <div v-if="selectedPost"
          class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

          <div class="flex justify-between items-center p-4 border-b border-gray-200">
            <div class="flex items-center min-w-0">
              <img :src="selectedPost.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3 flex-shrink-0">
              <div class="min-w-0">
                <h3 class="font-bold text-lg text-gray-800 truncate">{{ selectedPost.author }}</h3>
                <p class="text-xs text-gray-500">{{ selectedPost.date }}</p>
              </div>
            </div>
            <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0">
              <FontAwesomeIcon :icon="faXmark" class="h-6 w-6" />
            </button>
          </div>

          <div class="p-5 overflow-y-auto">
            <p class="text-base text-gray-700 whitespace-pre-wrap">{{ selectedPost.content }}</p>

            <div class="mt-4 pt-4 border-t border-gray-100">
              <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Topik: {{ selectedPost.topicTag }}
              </span>
            </div>
          </div>

          <div class="flex flex-wrap justify-around items-center p-4 border-t border-gray-200 bg-gray-50">
            <div class="text-center p-2">
              <span class="text-sm text-gray-500">Status</span>
              <span
                :class="[getStatusClass(selectedPost.postStatus).badge, 'text-sm font-bold px-3 py-1 rounded-full block mt-1']">
                {{ selectedPost.postStatus }}
              </span>
            </div>
            <div class="text-center p-2">
              <span class="text-sm text-gray-500">Likes</span>
              <span class="text-lg font-bold text-gray-800 block">{{ selectedPost.likes }}</span>
            </div>
            <div class="text-center p-2">
              <span class="text-sm text-gray-500">Comments</span>
              <span class="text-lg font-bold text-gray-800 block">{{ selectedPost.comments }}</span>
            </div>
            <div class="text-center p-2">
              <span class="text-sm text-gray-500">Shares</span>
              <span class="text-lg font-bold text-gray-800 block">{{ selectedPost.shares }}</span>
            </div>
          </div>

          <div class="p-4 bg-gray-100 border-t border-gray-200">
            <button @click="openLinkInNewTab(selectedPost)"
              class="w-full text-sm font-semibold bg-[#03255C] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition flex items-center justify-center gap-2">
              <FontAwesomeIcon :icon="faUpRightFromSquare" /> Kunjungi Postingan Asli
            </button>
          </div>
        </div>
      </div>

    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch, reactive } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTiktok, faInstagram, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import {
  faBookmark, faEye, faHeart, faCommentDots, faShareNodes, faArrowsRotate,
  faCalendarDays, faUpRightFromSquare, faXmark, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

import { filters } from '@/stores/filterStore.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// Plugin Pie Chart (Tidak Berubah)
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

// --- STATE ---
const API_URL = 'http://154.26.134.72:8438/top-topics';
const BOOKMARK_STORAGE_KEY = 'vue-bookmarked-posts';

const isLoading = ref(true);
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);

// State baru untuk menyimpan SEMUA topik yang diolah
const allTopicsDetailsData = ref([]);
// State baru untuk statistik SEMUA topik
const allTopicStats = ref([]);

// Tetap gunakan ini untuk Kompas/Jarum (Top 3)
const topTopics = ref([]);

const pieStatus = ref('EMERGING');
const pieStatus2 = ref('CURRENT');
const pieStatus3 = ref('NORMAL');
const bookmarkedPosts = ref([]);
const pieChartData = ref({ labels: [], datasets: [] });

const platformStatuses = ref([]);
const allPlatformStatuses = ref([]); // State baru untuk tabel (Semua Topik)

// State untuk feed postingan baru
const allViralPosts = ref([]);
const selectedTopic = ref('All');

// State untuk tooltip hover (gauge & tabel)
const hoveredStatusRef = ref({ topic: null, status: null });

// [REVISI BARU] State untuk tooltip Pie Chart
const pieTooltip = reactive({
  show: false,
  style: { top: '0px', left: '0px' },
  status: '',
  posts: []
});

const getCardBackground = (index) => {
  const gradients = [
    'bg-gradient-to-br from-indigo-500 to-purple-600', // Ungu
    'bg-gradient-to-br from-teal-500 to-emerald-600',  // Hijau
    'bg-gradient-to-br from-pink-500 to-red-600',     // Merah/Pink
    'bg-gradient-to-br from-amber-500 to-yellow-600', // Kuning/Jingga
    // Tambahkan lebih banyak jika perlu, atau akan berulang dari awal
  ];
  return gradients[index % gradients.length];
};


const getShareIcon = (platform) => {
  const platformLower = platform ? platform.toLowerCase() : '';

  // Twitter dan Instagram (khusus Repost) menggunakan ikon 'Repeat' (faArrowsRotate)
  if (platformLower === 'twitter' || platformLower === 'instagram') {
    // Catatan: Untuk data Instagram, kita asumsikan 'post.shares' berisi data 'repost'
    return {
      icon: faArrowsRotate,
      title: platformLower === 'twitter' ? 'Retweets' : 'Reposts'
    };
  }
  // TikTok (dan Instagram/Lainnya yang dianggap Share) menggunakan ikon 'Share' (faShareNodes)
  return {
    icon: faShareNodes,
    title: 'Shares'
  };
};

// Ambil semua topik unik dari post
const availableTopics = computed(() => {
  // Ambil 3 topik teratas berdasarkan urutan dari API (yang sudah diurutkan)
  const top3Topics = allTopicStats.value.slice(0, 3).map(stat => stat.title);
  return top3Topics;
});

// Agregat semua post
const pagination = reactive({
  currentPage: 1,
  perPage: 5, // Tampilkan 5 post per halaman
  total: 0
});

const platforms = ref([
  { name: 'X / Twitter', icon: faXTwitter, color: 'text-gray-800' },
  { name: 'TikTok', icon: faTiktok, color: 'text-black' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' },
]);

const needleColors = { primary: '#D97706', secondary: '#059669', tertiary: '#2563EB' };

// --- COMPUTED PROPERTIES ---
const topTopicsForLegend = computed(() => {
  const topics = topTopics.value.slice(0, 3);
  const colors = [needleColors.primary, needleColors.secondary, needleColors.tertiary];
  while (topics.length < 3) {
    topics.push({ title: 'NORMAL' });
  }
  return topics.map((topic, index) => ({
    title: topic.title,
    color: colors[index]
  }));
});

// Computed untuk paginasi feed
const filteredPosts = computed(() => {
  if (selectedTopic.value === 'All') {
    return allViralPosts.value;
  }
  return allViralPosts.value.filter(post => post.topicTag === selectedTopic.value);
});

const totalFeedPages = computed(() => Math.ceil(pagination.total / pagination.perPage));
const paginatedFeedPosts = computed(() => {
  pagination.total = filteredPosts.value.length; // update total agar pagination sinkron
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const end = start + pagination.perPage;
  if (start >= pagination.total && pagination.currentPage > 1) {
    pagination.currentPage = 1;
    return filteredPosts.value.slice(0, pagination.perPage);
  }
  return filteredPosts.value.slice(start, end);
});

// Computed untuk tooltip hover (gauge & tabel)
const postsInHoveredStatus = computed(() => {
  if (!hoveredStatusRef.value.topic || !hoveredStatusRef.value.status) {
    return [];
  }
  return allViralPosts.value.filter(p =>
    p.topicTag === hoveredStatusRef.value.topic &&
    (p.postStatus || 'NORMAL').toUpperCase() === hoveredStatusRef.value.status.toUpperCase()
  );
});

// --- FUNGSI & OPSI CHART (Tidak Berubah) ---

const handlePieHover = (event, activeElements, chart) => {
  if (activeElements.length > 0) {
    const firstElement = activeElements[0];
    const label = chart.data.labels[firstElement.index];
    pieTooltip.show = true;
    pieTooltip.status = label;
    pieTooltip.posts = allViralPosts.value.filter(p => (p.postStatus || 'NORMAL').toUpperCase() === label.toUpperCase());

    const nativeEvent = event.native;
    if (nativeEvent) {
      pieTooltip.style = {
        top: `${nativeEvent.clientY + 10}px`,
        left: `${nativeEvent.clientX + 10}px`,
        right: 'auto',
        bottom: 'auto'
      };

      if (nativeEvent.clientX + 300 > window.innerWidth) {
        pieTooltip.style.left = 'auto';
        pieTooltip.style.right = `${window.innerWidth - nativeEvent.clientX + 10}px`;
      }
      if (nativeEvent.clientY + 270 > window.innerHeight) {
        pieTooltip.style.top = 'auto';
        pieTooltip.style.bottom = `${window.innerHeight - nativeEvent.clientY + 10}px`;
      }
    }
  } else {
    pieTooltip.show = false;
  }
};

const hidePieTooltip = () => {
  pieTooltip.show = false;
};

const pieChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    pieChartText: true
  },
  events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
  onHover: handlePieHover,
};

// --- METODE & FUNGSI (Lainnya) ---
const getSocialIconColor = (icon) => ({ [faXTwitter.iconName]: 'text-gray-700' }[icon.iconName] || 'text-gray-700');

const getStatusClass = (status) => {
  const upperStatus = (status || 'NORMAL').toUpperCase();
  const statusMap = {
    'NORMAL': { text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800', border: 'border-blue-500' },
    'EARLY': { text: 'text-green-600', badge: 'bg-green-100 text-green-800', border: 'border-green-500' },
    'EMERGING': { text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500' },
    'CURRENT': { text: 'text-orange-600', badge: 'bg-orange-100 text-orange-800', border: 'border-orange-500' },
    'CRISIS': { text: 'text-red-600', badge: 'bg-red-100 text-red-800', border: 'border-red-500' },
  };
  return statusMap[upperStatus] || statusMap['NORMAL'];
};

const getGaugeStyle = (status) => {
  const upperStatus = (status || 'NORMAL').toUpperCase();
  const normalizedStatus = upperStatus === 'NORMAL' ? 'NORMAL' : upperStatus;

  // PASTIKAN INI TIDAK BERUBAH DAN BERADA DI VUE.JS
  const angleMap = {
    NORMAL: 18, // Paling Kiri
    EARLY: 54,
    EMERGING: 90, // Tengah
    CURRENT: 126,
    CRISIS: 162 // Paling Kanan
  };
  const angle = angleMap[normalizedStatus] || 162;
  return { '--gauge-angle': `${angle}deg` };
};

const getHighestPriorityStatus = (posts) => {
  if (!posts || posts.length === 0) return 'NORMAL';
  const priority = ['CRISIS', 'CURRENT', 'EMERGING', 'EARLY', 'NORMAL'];
  for (const status of priority) {
    if (posts.some(p => (p.postStatus || 'NORMAL').toUpperCase() === status)) {
      return status;
    }
  }
  return 'NORMAL';
};

const changeFeedPage = (page) => {
  if (page >= 1 && page <= totalFeedPages.value) {
    pagination.currentPage = page;
  }
};

watch(selectedTopic, () => {
  pagination.currentPage = 1;
});

// Logika Bookmark
const saveBookmarks = () => localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(bookmarkedPosts.value));
const loadBookmarks = () => {
  const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  if (saved) {
    try {
      bookmarkedPosts.value = JSON.parse(saved);
    } catch (e) {
      console.error('Gagal memuat bookmark', e);
      bookmarkedPosts.value = [];
    }
  }
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
  const postInFeed = allViralPosts.value.find(p => p.id === post.id);
  if (postInFeed) {
    postInFeed.isBookmarked = isNowBookmarked;
  }

  // UBAH: Menggunakan allTopicsDetailsData
  for (const topic of allTopicsDetailsData.value) {
    const originalPost = topic.allPosts.find(p => p.id === post.id);
    if (originalPost) {
      originalPost.isBookmarked = isNowBookmarked;
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

// Fungsi Fetch Utama
const fetchAllDashboardData = async (startDate, endDate) => {
  isLoading.value = true;
  try {
    const API_URL_DATED = `${API_URL}?start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(API_URL_DATED);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();

    // Mengambil data dari key 'all_topics_with_top_posts'
    const allTopicsApiData = data.all_topics_with_top_posts || [];

    const enrichedTopicsData = allTopicsApiData.map(topicItem => {
      const topicPosts = (topicItem.top_10_posts || []).map(post => ({
        id: post.post_id || post.tweet_id || post.id_video,
        url: post.url,

        content: post.text_content, // GUNAKAN FIELD 'text_content' KANONIK
        postStatus: (post.latest_status || 'NORMAL').toUpperCase(),

        author: post.user.name || post.user.screen_name,
        avatar: post.user.profile_image_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',

        platform: post.platform, // Ambil platform
        socialIcon: post.platform === 'instagram' ? faInstagram
          : post.platform === 'tiktok' ? faTiktok
            : faXTwitter,

        dateRaw: post.created_at,
        date: new Date(post.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        postStatus: (post.latest_status || 'NORMAL').toUpperCase(),

        followers: post.user.followers_count,
        following: post.user.following_count,

        engagementScore: (post.engagement || 0).toFixed(2),
        views: String(post.views || 0),
        likes: String(post.metrics_detail[post.platform]?.likes || post.metrics_detail.twitter?.favorites || 0),
        comments: String(post.metrics_detail[post.platform]?.comments || post.metrics_detail.twitter?.replies || 0),
        repost: String(post.metrics_detail[post.platform]?.repost || post.metrics_detail.twitter?.retweets || 0),
        shares: String(post.metrics_detail[post.platform]?.shares || post.metrics_detail.tiktok?.shares || 0),
        dateRaw: post.created_at,
        date: new Date(post.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        topicTag: topicItem.topic,
        isBookmarked: false,
        content: post.text_content
      }));

      const calculated_status = getHighestPriorityStatus(topicPosts);

      return {
        ...topicItem,
        calculated_status: calculated_status,
        mapped_posts: topicPosts
      };
    });

    // 1. Set status jarum (Top 3)
    const top3Topics = enrichedTopicsData.slice(0, 3);

    pieStatus.value = top3Topics.length > 0 ? top3Topics[0].calculated_status.toUpperCase() : 'NORMAL';
    pieStatus2.value = top3Topics.length > 1 ? top3Topics[1].calculated_status.toUpperCase() : 'NORMAL';
    pieStatus3.value = top3Topics.length > 2 ? top3Topics[2].calculated_status.toUpperCase() : 'NORMAL';

    // 2. Mengisi topTopics (Hanya untuk Legend Kompas)
    topTopics.value = top3Topics.map((item) => ({
      title: item.topic,
      value: String(item.total_unique_posts).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      status: item.calculated_status || 'NORMAL'
    }));

    // 3. Mengisi allTopicStats (SEMUA Topik untuk Kartu Statistik)
    allTopicStats.value = enrichedTopicsData.map((item) => ({
      title: item.topic,
      value: String(item.total_unique_posts).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      status: item.calculated_status || 'NORMAL'
    }));

    // 4. Mengisi data Pie Chart Kompas (Tidak berubah)
    pieChartData.value = {
      labels: ['CRISIS', 'NORMAL', 'EARLY', 'EMERGING', 'CURRENT'],
      datasets: [{
        backgroundColor: ['#E60000', '#2092EC', '#28C76F', '#AAD816', '#FF9900'],
        data: [20, 20, 20, 20, 20],
        borderWidth: 2,
        borderColor: '#ffffff',
      }],
    };

    // 5. Mengisi allTopicsDetailsData (SEMUA Topik untuk Detail)
    const bookmarkedIds = new Set(bookmarkedPosts.value.map(p => p.id));

    allTopicsDetailsData.value = enrichedTopicsData.map((topicItem) => {
      const topicPostsWithBookmark = topicItem.mapped_posts.map(post => ({
        ...post,
        isBookmarked: bookmarkedIds.has(post.id)
      }));
      return {
        title: topicItem.topic,
        status: (topicItem.calculated_status || 'NORMAL').toUpperCase(),
        allPosts: topicPostsWithBookmark,
      };
    });

    // 6. Mengisi allPlatformStatuses (SEMUA Topik untuk Tabel Matriks)
    const top3TopicsDetails = allTopicsDetailsData.value.slice(0, 3);

    allPlatformStatuses.value = top3TopicsDetails.map(topic => {
      const statusArray = Array(platforms.value.length).fill('');

      const allPosts = topic.allPosts;

      platforms.value.forEach((platform, index) => {
        const platformName = platform.name.toLowerCase().includes('twitter') ? 'twitter'
          : platform.name.toLowerCase().includes('tiktok') ? 'tiktok'
            : platform.name.toLowerCase().includes('instagram') ? 'instagram'
              : 'unknown';

        const platformPosts = allPosts.filter(p => p.platform.toLowerCase() === platformName);

        const platformStatus = getHighestPriorityStatus(platformPosts);

        statusArray[index] = platformStatus;
      });

      return { topic: topic.title, statuses: statusArray };
    });

    // 7. Selesaikan Feed Agregat
    let allPostsFromAllTopics = [];
    enrichedTopicsData.forEach(topicItem => {
      const topicPostsWithBookmark = topicItem.mapped_posts.map(post => ({
        ...post,
        isBookmarked: bookmarkedIds.has(post.id)
      }));
      allPostsFromAllTopics.push(...topicPostsWithBookmark);
    });

    const uniquePosts = Array.from(new Map(allPostsFromAllTopics.map(p => [p.id, p])).values());
    uniquePosts.sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));

    allViralPosts.value = uniquePosts;
    pagination.total = uniquePosts.length;
    pagination.currentPage = 1;

  } catch (error) {
    console.error("Gagal mengambil data dari API:", error);
  } finally {
    isLoading.value = false;
  }
};
// Akhir Fungsi Fetch

function loadAllData() {
  fetchAllDashboardData(filters.startDate, filters.endDate);
}

watch(filters, () => { loadAllData(); });

// --- LIFECYCLE HOOKS ---
onMounted(() => {
  loadBookmarks();
  updateTime();
  timerInterval = setInterval(updateTime, 1000);
  loadAllData();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
/* ... CSS Lainnya ... */

/* CSS untuk menyembunyikan scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  display: none;
}

.custom-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

/* Tambahkan styling opsional untuk carousel container */
.carousel-container {
  /* Memberi sedikit padding horizontal agar kartu tidak menempel */
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: -0.5rem;
  /* Kompensasi untuk p-2 di div induk */
  margin-right: -0.5rem;
}

/* ... CSS Lainnya ... */

/* CSS untuk Gauge Meter Modern */
.gauge-container {
  position: relative;
  width: 200px;
  height: 100px;
  overflow: hidden;
  margin-bottom: 1rem;
}

/* GANTI SEPENUHNYA DEFINISI INI DI BAGIAN <style scoped> */
.gauge-semi-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;

  /* 
    DEFINISI CONIC GRADIENT YANG DIPERBAIKI:
    Biru (NORMAL) di kiri (180deg) → Merah (CRISIS) di kanan (0deg)
  */
  background: conic-gradient(from 180deg,
      /* NORMAL (Blue 500) */
      #3B82F6 100deg 130deg,

      /* EARLY (Green 500) */
      #22C55E 130deg 160deg,

      /* EMERGING (Yellow 500) */
      #EAB308 160deg 200deg,

      /* CURRENT (Orange 500) */
      #F97316 200deg 230deg,

      /* CRISIS (Red 600) */
      #DC2626 230deg 260deg);



}


.gauge-needle {
  content: '';
  position: absolute;
  width: 95px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  top: 100px;
  left: 5px;
  transform-origin: 95px 3px;
  transform: rotate(var(--gauge-angle, 162deg));
  transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.gauge-inner-circle {
  width: 160px;
  height: 160px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 40px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 1rem;
  z-index: 5;
}

.gauge-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gauge-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

/* CSS untuk Kompas */
.pie-chart-wrapper :deep(canvas) {
  filter: drop-shadow(8px 8px 12px rgba(0, 0, 0, 0.15));
}

.pie-needle-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  transform: rotate(0deg);
  transition: transform 2s cubic-bezier(0.19, 1, 0.22, 1);
}

.pie-center-dot {
  content: '';
  width: 20px;
  height: 20px;
  background: #1f2937;
  border: 4px solid #fff;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 13;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.pie-needle-wrapper .needle {
  border-radius: 4px;
  position: absolute;
  top: -7px;
  left: 0;
  transform-origin: 0% 50%;
  display: block;
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.2);
  height: 8px;
}

.pie-needle-wrapper.primary .needle {
  width: 170px;
  background: #D97706;
  z-index: 12;
  top: -4px;
}

.pie-needle-wrapper.secondary .needle {
  width: 170px;
  background: #059669;
  z-index: 11;
}

.pie-needle-wrapper.tertiary .needle {
  width: 170px;
  background: #2563EB;
  z-index: 10;
}

/* Animasi untuk kelas status jarum */
.pie-needle-wrapper.normal {
  transform: rotate(0deg);
}

.pie-needle-wrapper.early {
  transform: rotate(255deg);
}

.pie-needle-wrapper.emerging {
  transform: rotate(135deg);
}

.pie-needle-wrapper.current {
  transform: rotate(45deg);
}

.pie-needle-wrapper.crisis {
  transform: rotate(-27deg);
}

/* Loader & Animasi Fade */
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

/* [REVISI BARU] Animasi untuk tooltip kompas */
.animate-fade-in-fast {
  animation: fadeInFast 0.1s ease-out forwards;
}

@keyframes fadeInFast {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}


/* Utility Class */
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Style untuk Paginasi & Tabel */
.pagination-arrow-btn {
  @apply p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent;
}

.platform-table th,
.platform-table td {
  @apply px-6 py-4;
}

.platform-table tbody tr:last-child {
  @apply border-b-0;
}
</style>