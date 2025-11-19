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

        <div class="relative">
          <button v-if="topicCarouselPage > 0" @click="topicCarouselPage--"
            class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 hover:bg-gray-50">
            <FontAwesomeIcon :icon="faChevronLeft" class="w-5 h-5" />
          </button>

          <button v-if="(topicCarouselPage + 1) * 3 < allTopicsForCarousel.length" @click="topicCarouselPage++"
            class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 hover:bg-gray-50">
            <FontAwesomeIcon :icon="faChevronRight" class="w-5 h-5" />
          </button>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(stat, index) in topicsOnCurrentPage" :key="stat.title"
              :class="[getTopicCardGradient(topicCarouselPage * 3 + index), 'p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden']">
              <div class="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
              <div class="absolute -left-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
              <div class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center">
                <span class="text-white font-bold text-lg">{{ topicCarouselPage * 3 + index + 1 }}</span>
              </div>

              <div class="relative z-10">
                <p class="text-xl font-bold text-white mb-4 line-clamp-2 min-h-[3.5rem]">{{ stat.title }}</p>
                <p class="text-6xl font-bold text-white mb-2">{{ stat.value }}</p>
                <p class="text-lg font-medium text-white text-opacity-90 uppercase tracking-wide">Total Posts</p>
              </div>
            </div>
          </div>

          <div class="flex justify-center items-center gap-2 mt-6">
            <button v-for="pageNum in totalTopicPages" :key="pageNum" @click="topicCarouselPage = pageNum - 1"
              :class="[topicCarouselPage === pageNum - 1 ? 'bg-blue-600 w-8' : 'bg-gray-300 w-2', 'h-2 rounded-full transition-all duration-300 hover:bg-blue-400']">
            </button>
          </div>
        </div>

      </div>
    </div>

    <div>
      <h2 class="text-2xl font-bold text-[#03255C]">Detail per Topik</h2>
      <p class="text-sm text-gray-500">Breakdown postingan teratas untuk 3 topik utama.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(topic, index) in topicsDetailsData" :key="index"
        class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-[#03255C] line-clamp-1">Topik {{ index + 1 }}: {{ topic.title }}</h3>
        </div>

        <div class="relative p-4 flex flex-col items-center bg-gray-50/50 cursor-help"
          @mouseenter="hoveredStatusRef = { topic: topic.title, status: topic.status }"
          @mouseleave="hoveredStatusRef = { topic: null, status: null }">
          <div class="gauge-container">
            <div class="gauge-semi-circle" :style="getGaugeStyle(topic.status)">
              <div class="gauge-needle"></div>
            </div>
            <div class="gauge-inner-circle">
              <div class="gauge-label">STATUS</div>
              <div class="gauge-value" :class="getStatusClass(topic.status).text">{{ topic.status }}</div>
            </div>
          </div>

          <div v-if="hoveredStatusRef.topic === topic.title && hoveredStatusRef.status === topic.status"
            class="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-20 max-h-64 overflow-y-auto">
            <h5 class="text-sm font-bold text-gray-900 mb-2">Postingan dengan status "{{ topic.status }}"</h5>
            <div v-if="postsInHoveredStatus.length > 0" class="space-y-2">
              <div v-for="p in postsInHoveredStatus" :key="p.id"
                class="text-xs text-gray-700 border-b border-gray-100 last:border-none pb-2 mb-2">
                <span class="font-bold text-gray-800 block truncate">{{ p.author }}</span>
                <p class="text-gray-600 line-clamp-2">{{ p.content }}</p>
              </div>
            </div>
            <div v-else class="text-gray-400 text-xs text-center py-2">
              (Tidak ada postingan di daftar ini)
            </div>
          </div>
        </div>

        <div class="p-4 flex-grow h-96 overflow-y-auto">
          <h4 class="text-base font-bold text-[#03255C] mb-3">Postingan Teratas Topik Ini</h4>
          <div class="space-y-3">
            <div v-if="topic.allPosts.length === 0" class="text-center text-sm text-gray-500 py-10">
              Tidak ada postingan untuk topik ini.
            </div>
            <div v-for="post in topic.allPosts" :key="post.id"
              class="bg-white border border-gray-200 rounded-lg p-3 group transition-shadow hover:shadow-md hover:border-blue-300">
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
                    <FontAwesomeIcon :icon="faBookmark" @click="toggleBookmark(post)" :class="['h-4 w-4 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125',
                      post.isBookmarked ? 'text-yellow-500' : 'text-gray-300 group-hover:text-yellow-400'
                    ]" />
                  </div>
                  <p class="text-xs text-gray-500 flex items-center gap-1.5">
                    <FontAwesomeIcon :icon="faCalendarDays" class="h-3 w-3" />
                    <span>{{ post.date }}</span>
                  </p>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ post.content }}</p>

              <div class="flex items-center justify-between text-xs text-gray-500 mb-3 border-t border-gray-100 pt-3">
                <div class="flex items-center gap-3">
                  <span class="flex items-center gap-1" title="Likes">
                    <FontAwesomeIcon :icon="faHeart" /> {{ post.likes }}
                  </span>
                  <span class="flex items-center gap-1" title="Comments">
                    <FontAwesomeIcon :icon="faCommentDots" /> {{ post.comments }}
                  </span>
                  <span class="flex items-center gap-1" title="Shares">
                    <FontAwesomeIcon :icon="faShareNodes" /> {{ post.shares }}
                  </span>
                </div>
                <span :class="[getStatusClass(post.postStatus).badge, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                  {{ post.postStatus }}
                </span>
              </div>
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
            <tr v-for="item in platformStatuses" :key="item.topic" class="bg-white border-b border-gray-100">
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

                  <div v-if="hoveredStatusRef.topic === item.topic && hoveredStatusRef.status === status"
                    class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-20 max-h-64 overflow-y-auto text-left">
                    <h5 class="text-sm font-bold text-gray-900 mb-2">Postingan dengan status "{{ status }}"</h5>
                    <div v-if="postsInHoveredStatus.length > 0" class="space-y-2">
                      <div v-for="p in postsInHoveredStatus" :key="p.id"
                        class="text-xs text-gray-700 border-b border-gray-100 last:border-none pb-2 mb-2">
                        <span class="font-bold text-gray-800 block truncate">{{ p.author }}</span>
                        <p class="text-gray-600 line-clamp-2">{{ p.content }}</p>
                      </div>
                    </div>
                    <div v-else class="text-gray-400 text-xs text-center py-2">
                      (Tidak ada postingan di daftar ini)
                    </div>
                  </div>
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

      <div v-if="pieTooltip.show" :style="pieTooltip.style"
        class="fixed z-[60] w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-3 max-h-64 overflow-y-auto animate-fade-in-fast">
        <h5 class="text-sm font-bold text-gray-900 mb-2">Postingan dengan status "{{ pieTooltip.status }}"</h5>
        <div v-if="pieTooltip.posts.length > 0" class="space-y-2">
          <div v-for="p in pieTooltip.posts.slice(0, 10)" :key="p.id"
            class="text-xs text-gray-700 border-b border-gray-100 last:border-none pb-2 mb-2">
            <span class="font-bold text-gray-800 block truncate" :title="p.author">{{ p.author }}</span>
            <p class="text-gray-600 line-clamp-2">{{ p.content }}</p>
          </div>
          <div v-if="pieTooltip.posts.length > 10" class="text-xs text-gray-500 italic text-center">
            ...dan {{ pieTooltip.posts.length - 10 }} lainnya.
          </div>
        </div>
        <div v-else class="text-gray-400 text-xs text-center py-2">
          (Tidak ada postingan di daftar ini)
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
  faBookmark, faEye, faHeart, faCommentDots, faShareNodes,
  faCalendarDays, faUpRightFromSquare, faXmark, faChevronLeft, faChevronRight
} from '@fortawesome/free-solid-svg-icons';

import { useFilterStore, useBookmarkStore } from '@/stores'
ChartJS.register(Title, Tooltip, Legend, ArcElement)

const filterStore = useFilterStore()
const bookmarkStore = useBookmarkStore()
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

const API_URL = 'http://154.26.134.72:8438/top-topics';

const isLoading = ref(true);
const currentTime = ref('');
const currentDate = ref('');
let timerInterval = null;
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);
const topTopics = ref([]); 
const allTopicsForCarousel = ref([]); 
const topicCarouselPage = ref(0); 
const pieStatus = ref('EMERGING');
const pieStatus2 = ref('CURRENT');
const pieStatus3 = ref('NORMAL');
const pieChartData = ref({ labels: [], datasets: [] });
const topicsDetailsData = ref([]); 
const platformStatuses = ref([]);
const allViralPosts = ref([]);
const selectedTopic = ref('All');
const hoveredStatusRef = ref({ topic: null, status: null });
const pieTooltip = reactive({
  show: false,
  style: { top: '0px', left: '0px' },
  status: '',
  posts: []
});

const availableTopics = computed(() => {
  const topics = allViralPosts.value.map(p => p.topicTag).filter(Boolean);
  return [...new Set(topics)];
});

const topicsOnCurrentPage = computed(() => {
  const start = topicCarouselPage.value * 3;
  return allTopicsForCarousel.value.slice(start, start + 3);
});

const totalTopicPages = computed(() => {
  return Math.ceil(allTopicsForCarousel.value.length / 3);
});

const pagination = reactive({
  currentPage: 1,
  perPage: 5, 
  total: 0
});

const platforms = ref([
  { name: 'X / Twitter', icon: faXTwitter, color: 'text-gray-800' },
  { name: 'TikTok', icon: faTiktok, color: 'text-black' },
  { name: 'Instagram', icon: faInstagram, color: 'text-pink-500' },
]);

const needleColors = { primary: '#D97706', secondary: '#059669', tertiary: '#2563EB' };

const topTopicsForLegend = computed(() => {
  const topics = topTopics.value.slice(0, 3);
  const colors = [needleColors.primary, needleColors.secondary, needleColors.tertiary];
  while (topics.length < 3) {
    topics.push({ title: 'N/A' });
  }
  return topics.map((topic, index) => ({
    title: topic.title,
    color: colors[index]
  }));
});

const filteredPosts = computed(() => {
  if (selectedTopic.value === 'All') {
    return allViralPosts.value;
  }
  return allViralPosts.value.filter(post => post.topicTag === selectedTopic.value);
});

const totalFeedPages = computed(() => Math.ceil(pagination.total / pagination.perPage));
const paginatedFeedPosts = computed(() => {
  pagination.total = filteredPosts.value.length; 
  const start = (pagination.currentPage - 1) * pagination.perPage;
  const end = start + pagination.perPage;
  if (start >= pagination.total && pagination.currentPage > 1) {
    pagination.currentPage = 1;
    return filteredPosts.value.slice(0, pagination.perPage);
  }
  return filteredPosts.value.slice(start, end);
});

const postsInHoveredStatus = computed(() => {
  if (!hoveredStatusRef.value.topic || !hoveredStatusRef.value.status) {
    return [];
  }
  return allViralPosts.value.filter(p =>
    p.topicTag === hoveredStatusRef.value.topic &&
    (p.postStatus || 'N/A').toUpperCase() === hoveredStatusRef.value.status.toUpperCase()
  );
});

const handlePieHover = (event, activeElements, chart) => {
  if (activeElements.length > 0) {
    const firstElement = activeElements[0];
    const label = chart.data.labels[firstElement.index];
    pieTooltip.show = true;
    pieTooltip.status = label;
    pieTooltip.posts = allViralPosts.value.filter(p => (p.postStatus || 'N/A').toUpperCase() === label.toUpperCase());

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

const getSocialIconColor = (icon) => ({ [faXTwitter.iconName]: 'text-gray-700' }[icon.iconName] || 'text-gray-700');

const getTopicCardGradient = (index) => {
  const gradients = [
    'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700',   
    'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600',    
    'bg-gradient-to-br from-pink-500 via-rose-600 to-red-600',          
    'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600',    
    'bg-gradient-to-br from-blue-500 via-sky-600 to-cyan-600',         
    'bg-gradient-to-br from-violet-500 via-fuchsia-600 to-purple-600',  
    'bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700',     
    'bg-gradient-to-br from-red-500 via-pink-600 to-rose-600',         
    'bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-600',       
    'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600',     
  ];
  return gradients[index % gradients.length];
};

const getStatusClass = (status) => {
  const upperStatus = (status || 'N/A').toUpperCase();
  const statusMap = {
    'NORMAL': { text: 'text-blue-600', badge: 'bg-blue-100 text-blue-800', border: 'border-blue-500' },
    'EARLY': { text: 'text-green-600', badge: 'bg-green-100 text-green-800', border: 'border-green-500' },
    'EMERGING': { text: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-800', border: 'border-yellow-500' },
    'CURRENT': { text: 'text-orange-600', badge: 'bg-orange-100 text-orange-800', border: 'border-orange-500' },
    'CRISIS': { text: 'text-red-600', badge: 'bg-red-100 text-red-800', border: 'border-red-500' },
    'N/A': { text: 'text-gray-500', badge: 'bg-gray-100 text-gray-800', border: 'border-gray-400' }
  };
  return statusMap[upperStatus] || statusMap['N/A'];
};

const getGaugeStyle = (status) => {
  const angleMap = { NORMAL: 162, EARLY: 126, EMERGING: 90, CURRENT: 54, CRISIS: 18 };
  const angle = angleMap[(status || 'N/A').toUpperCase()] || 162;
  return { '--gauge-angle': `${angle}deg` };
};

const getHighestPriorityStatus = (posts) => {
  if (!posts || posts.length === 0) return 'N/A';
  const priority = ['CRISIS', 'CURRENT', 'EMERGING', 'EARLY', 'NORMAL'];
  for (const status of priority) {
    if (posts.some(p => (p.postStatus || 'N/A').toUpperCase() === status)) {
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

const toggleBookmark = (post) => {
  const isNowBookmarked = bookmarkStore.toggleBookmark(post)
  post.isBookmarked = bookmarkStore.isBookmarked(post.id)
  const postInFeed = allViralPosts.value.find(p => p.id === post.id)
  if (postInFeed) {
    postInFeed.isBookmarked = post.isBookmarked
  }

  for (const topic of topicsDetailsData.value) {
    const originalPost = topic.allPosts.find(p => p.id === post.id)
    if (originalPost) {
      originalPost.isBookmarked = post.isBookmarked
    }
  }
}

const openDetailModal = (post) => { selectedPost.value = post; isDetailModalOpen.value = true; };
const closeDetailModal = () => { isDetailModalOpen.value = false; selectedPost.value = null; };
const openLinkInNewTab = (post) => { if (post && post.url) window.open(post.url, '_blank', 'noopener,noreferrer'); };
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  currentDate.value = now.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const fetchAllDashboardData = async (startDate, endDate) => {
  isLoading.value = true;
  try {
    const API_URL_DATED = `${API_URL}?start_date=${startDate}&end_date=${endDate}`;
    const response = await fetch(API_URL_DATED);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    const topTopicsApiData = data.all_topics_with_top_posts || [];

    const enrichedTopicsData = topTopicsApiData.map(topicItem => {
      const topicPosts = (topicItem.top_10_posts || []).map(post => ({
        id: post.post_id,
        url: post.url,
        content: post.text_content,
        postStatus: (post.latest_status || 'N/A').toUpperCase(),

        author: post.user?.name || post.user?.screen_name || 'Unknown',
        avatar: post.user?.profile_image_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png',

        platform: post.platform,
        socialIcon: post.platform === 'instagram' ? faInstagram
          : post.platform === 'tiktok' ? faTiktok
            : faXTwitter,

        dateRaw: post.created_at,
        date: post.created_at ? new Date(post.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A',

        followers: post.user?.followers_count || 0,
        following: post.user?.following_count || 0,

        engagementScore: (post.engagement || 0),
        likes: String(post.metrics_detail?.[post.platform]?.likes || post.metrics_detail?.twitter?.favorites || 0),
        comments: String(post.metrics_detail?.[post.platform]?.comments || post.metrics_detail?.twitter?.replies || 0),
        shares: String(post.metrics_detail?.[post.platform]?.shares || post.metrics_detail?.twitter?.retweets || 0),

        topicTag: topicItem.topic,
        isBookmarked: false
      }));

      const calculated_status = getHighestPriorityStatus(topicPosts);

      return {
        ...topicItem,
        calculated_status: calculated_status,
        mapped_posts: topicPosts
      };
    });
    topTopics.value = enrichedTopicsData.slice(0, 3).map((item) => ({
      title: item.topic,
      value: String(item.total_unique_posts || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      status: item.calculated_status || 'N/A'
    }));

    allTopicsForCarousel.value = enrichedTopicsData.map((item) => ({
      title: item.topic,
      value: String(item.total_unique_posts || 0).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      status: item.calculated_status || 'N/A'
    }));

    pieChartData.value = {
      labels: ['CRISIS', 'NORMAL', 'EARLY', 'EMERGING', 'CURRENT'],
      datasets: [{
        backgroundColor: ['#E60000', '#2092EC', '#28C76F', '#AAD816', '#FF9900'],
        data: [20, 20, 20, 20, 20],
        borderWidth: 2,
        borderColor: '#ffffff',
      }],
    };

    let collectedPosts = [];
    topicsDetailsData.value = enrichedTopicsData.slice(0, 3).map((topicItem) => {
      const topicPostsWithBookmark = topicItem.mapped_posts.map(post => ({
        ...post,
        isBookmarked: bookmarkStore.isBookmarked(post.id)
      }));
      collectedPosts.push(...topicPostsWithBookmark);
      return {
        title: topicItem.topic,
        status: (topicItem.calculated_status || 'N/A').toUpperCase(),
        allPosts: topicPostsWithBookmark,
      };
    });

    platformStatuses.value = topicsDetailsData.value.map(topic => {
      const statusArray = Array(platforms.value.length).fill('');
      const allPosts = topic.allPosts;
      const platformCounts = allPosts.reduce((acc, post) => {
        const platform = post.platform || 'unknown';
        acc[platform] = (acc[platform] || 0) + 1;
        return acc;
      }, {});
      console.log(`Topic "${topic.title}" - Platform distribution:`, platformCounts);

      platforms.value.forEach((platform, index) => {
        const platformPosts = allPosts.filter(p => {
          if (!p.platform) return false;
          const platformName = platform.name.toLowerCase().includes('twitter') ? 'twitter'
            : platform.name.toLowerCase().includes('tiktok') ? 'tiktok'
              : platform.name.toLowerCase().includes('instagram') ? 'instagram'
                : 'unknown';

          const postPlatform = p.platform.toLowerCase();
          if (platformName === 'twitter' && (postPlatform === 'twitter' || postPlatform === 'x')) {
            return true;
          }

          return postPlatform === platformName;
        });

        const platformStatus = getHighestPriorityStatus(platformPosts);
        console.log(`  Platform "${platform.name}": ${platformPosts.length} posts, status: ${platformStatus}`);
        statusArray[index] = platformStatus;
      });

      return { topic: topic.title, statuses: statusArray };
    });

    pieStatus.value = enrichedTopicsData.length > 0 ? enrichedTopicsData[0].calculated_status.toUpperCase() : 'NORMAL';
    pieStatus2.value = enrichedTopicsData.length > 1 ? enrichedTopicsData[1].calculated_status.toUpperCase() : 'NORMAL';
    pieStatus3.value = enrichedTopicsData.length > 2 ? enrichedTopicsData[2].calculated_status.toUpperCase() : 'NORMAL';
    const uniquePosts = Array.from(new Map(collectedPosts.map(p => [p.id, p])).values());
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

function loadAllData() {
  fetchAllDashboardData(filterStore.startDate, filterStore.endDate);
}

watch(() => [filterStore.startDate, filterStore.endDate], () => {
  console.log('Filters changed, reloading data...');
  loadAllData();
});

onMounted(() => {
  updateTime();
  timerInterval = setInterval(updateTime, 1000);
  loadAllData();
});

onUnmounted(() => {
  clearInterval(timerInterval);
});
</script>

<style scoped>
.gauge-container {
  position: relative;
  width: 200px;
  height: 100px;
  overflow: hidden;
  margin-bottom: 1rem;
}
.gauge-semi-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  background: conic-gradient(from 180deg,
      #E60000 0deg 36deg,
      #FF9900 36deg 72deg,
      #AAD816 72deg 108deg,
      #28C76F 108deg 144deg,
      #2092EC 144deg 180deg,
      #f0f0f0 180deg 360deg);
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

.pie-needle-wrapper.normal {
  transform: rotate(-27deg);
}

.pie-needle-wrapper.early {
  transform: rotate(45deg);
}

.pie-needle-wrapper.emerging {
  transform: rotate(135deg);
}

.pie-needle-wrapper.current {
  transform: rotate(225deg);
}

.pie-needle-wrapper.crisis {
  transform: rotate(-72deg);
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