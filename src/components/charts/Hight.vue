<template>
  <div v-if="isLoading"
    class="flex justify-center items-center p-6 bg-white rounded-xl border border-gray-200 shadow-sm min-h-[40rem]">
    <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
    <p class="text-lg font-semibold text-gray-600 ml-4">Memuat postingan...</p>
  </div>

  <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
    <div v-for="(column, index) in columnsData" :key="index"
      class="bg-white rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(3,37,92,0.3)] flex flex-col p-4">
      <h3 class="text-lg font-bold text-[#03255C] mb-3">{{ column.title }}</h3>

      <div class="relative mb-4">
        <input type="text" placeholder="Cari Akun"
          class="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
          width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </div>

      <div class="space-y-4 flex-grow">
        <div v-for="post in column.posts" :key="post.id"
          class="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
          <div class="flex items-start mb-2">
            <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
            <div class="flex-grow">
              <div class="flex justify-between items-center">
                <div class="flex items-center gap-2">
                  <i :class="[post.socialIcon, 'h-4 w-4 text-sm flex items-center justify-center flex-shrink-0']"></i>
                  <span class="font-bold text-sm text-[#03255C]">{{ post.author }}</span>
                </div>
                <span :class="[post.statusColor, 'text-xs font-bold px-2 py-0.5 rounded-full']">{{ post.postStatus
                }}</span>
              </div>
              <div class="flex items-center gap-4 text-xs text-gray-500 mt-1">
                <span>{{ post.stats.followers }}</span>
                <span class="flex items-center"><svg class="h-3 w-3 mr-1 text-yellow-500" fill="currentColor"
                    viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z">
                    </path>
                  </svg>{{ post.stats.rating }}</span>
                <span class="flex items-center"><svg class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>{{ post.stats.verified }}</span>
              </div>
              <p class="text-xs text-gray-500 mt-1">{{ post.date }}</p>
            </div>
          </div>
          <p class="text-sm text-gray-600 mb-3">{{ post.content }}</p>
          <div class="flex items-center justify-between">
            <span class="text-xs bg-gray-100 px-2 py-0.5 rounded">Topik: {{ post.topicTag }}</span>
            <div class="flex items-center gap-2">
              <button
                class="text-xs font-semibold bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md hover:bg-gray-200 transition">Kunjungi</button>
              <button @click="openDetailModal(post)"
                class="text-xs font-semibold bg-blue-500 text-white px-3 py-1.5 rounded-md hover:bg-blue-600 transition">Lihat
                Detail</button>
            </div>
          </div>
        </div>
      </div>

      <div class="p-2 border-t border-gray-200 mt-auto">
        <div class="flex justify-between items-center text-xs text-gray-600">
          <span>Menampilkan 1 - 3 dari {{ column.pagination.total }} Data</span>
          <div class="flex items-center">
            <button class="p-1 rounded-md hover:bg-gray-100">&lt;</button>
            <span class="px-2 py-1 bg-blue-100 text-blue-600 font-bold rounded-md mx-1">1</span>
            <span class="px-2 py-1 rounded-md hover:bg-gray-100">2</span>
            <span class="px-2 py-1 rounded-md hover:bg-gray-100">3</span>
            <button class="p-1 rounded-md hover:bg-gray-100">&gt;</button>
          </div>
        </div>
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
          <h3 class="text-xl font-bold text-[#03255C]">Detail Postingan</h3>
          <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div v-if="selectedPost" class="space-y-4">
          <div class="flex items-center">
            <img :src="selectedPost.avatar" alt="Avatar" class="w-12 h-12 rounded-full mr-4">
            <div>
              <p class="font-bold text-lg text-[#03255C] flex items-center gap-2">
                <i :class="[selectedPost.socialIcon, 'h-4 w-4 text-sm flex items-center justify-center']"></i>
                {{ selectedPost.author }}
              </p>
              <p class="text-sm text-gray-500 mt-1">
                Diposting pada: {{ selectedPost.date }}
              </p>
            </div>
          </div>

          <p class="text-gray-700 text-base border-t pt-4">{{ selectedPost.content }}</p>

          <div class="grid grid-cols-2 gap-y-2 gap-x-4 text-sm p-3 bg-gray-50 rounded-lg">
            <p><strong>Status:</strong> <span :class="[selectedPost.statusColor, 'font-bold px-2 py-0.5 rounded']">{{
              selectedPost.postStatus
                }}</span></p>
            <p><strong>Topik:</strong> <span class="font-semibold text-blue-600">{{ selectedPost.topicTag
                }}</span></p>
            <p><strong>Followers:</strong> {{ selectedPost.stats.followers }}</p>
            <p><strong>Rating:</strong> {{ selectedPost.stats.rating }} / 5</p>
            <p><strong>Verified:</strong> {{ selectedPost.stats.verified }}</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="closeDetailModal"
            class="text-sm font-semibold bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition">Tutup</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const columnsData = ref([]);

// --- Tambahan State untuk Modal ---
const isDetailModalOpen = ref(false);
const selectedPost = ref(null);

// SVG Icons diganti dengan Font Awesome Classes (fab = Font Awesome Brands)
// PERUBAHAN: text-gray-800 dan text-black diganti dengan text-[#03255C]
const ICONS = {
  // Catatan: Pastikan library Font Awesome Brands telah diimpor (fa-x-twitter dan fa-tiktok)
  x: 'fab fa-x-twitter text-[#03255C]',
  facebook: 'fab fa-facebook-f text-blue-600',
  tiktok: 'fab fa-tiktok text-[#03255C]',
};

// --- Tambahan Methods untuk Modal ---
const openDetailModal = (post) => {
  selectedPost.value = post;
  isDetailModalOpen.value = true;
};

const closeDetailModal = () => {
  isDetailModalOpen.value = false;
  selectedPost.value = null;
};

const createDummyPost = (id, social) => ({
  id,
  author: 'fachryAlamsyah',
  avatar: 'https://placehold.co/40x40/E2E8F0/4A5568?text=FA',
  socialIcon: ICONS[social],
  stats: { followers: '15.5K', rating: 5, verified: 300 },
  date: '02 Juni 2024 12:00:15',
  postStatus: id % 2 === 0 ? 'Emerging' : 'Early',
  statusColor: id % 2 === 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et...',
  topicTag: 'Kereta',
});

const fetchPostsData = () => {
  setTimeout(() => {
    columnsData.value = [
      {
        title: 'Posts From Highest Engagement',
        posts: [createDummyPost(1, 'x'), createDummyPost(2, 'facebook'), createDummyPost(3, 'tiktok')],
        pagination: { total: 8 }
      },
      {
        title: 'Posts From Highest Followers',
        posts: [createDummyPost(4, 'facebook'), createDummyPost(5, 'x'), createDummyPost(6, 'tiktok')],
        pagination: { total: 8 }
      },
      {
        title: 'Posts From 5 Marked Accounts',
        posts: [createDummyPost(7, 'tiktok'), createDummyPost(8, 'facebook'), createDummyPost(9, 'x')],
        pagination: { total: 8 }
      }
    ];
    isLoading.value = false;
  }, 1800);
};

onMounted(fetchPostsData);
</script>

<style scoped>
/* Loader and fade-in animations */
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
</style>