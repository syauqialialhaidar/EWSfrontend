<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)] p-6">
    <h2 class="text-lg font-bold text-[#03255C] mb-6">Flagged Account from Post</h2>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[20rem]">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
      <p class="text-md font-semibold text-gray-600 ml-4">Memuat akun yang ditandai...</p>
    </div>

    <div v-else class="animate-fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <div v-for="column in flaggedData" :key="column.status" class="flex flex-col">
          <div :class="[column.color, 'text-white font-bold py-2 px-4 rounded-t-lg text-center text-sm']">
            {{ column.status }}
          </div>

          <div
            class="bg-white border-x border-b border-gray-200 rounded-b-lg p-3 flex-grow flex flex-col justify-between">
            <div class="space-y-3">
              <div v-for="account in column.accounts" :key="account.id"
                class="bg-[#F8F7FA] rounded-lg p-4 border border-gray-200 shadow-sm">
                <div class="flex items-center mb-2">
                  <div
                    class="w-8 h-8 rounded-full mr-3 bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    <i :class="[account.socialIcon, 'text-base']"></i>
                  </div>
                  <div>
                    <p class="font-bold text-sm text-[#03255C]">{{ account.author }}</p>
                    <div class="flex items-center gap-1 text-xs text-gray-600">
                      <span>{{ account.platform }}</span>
                    </div>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs text-gray-500 mb-2 px-1">
                  <span class="flex items-center gap-1">
                    <i class="fa-solid fa-heart text-red-500 text-sm"></i>
                    {{ account.stats.followers }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fa-solid fa-comment text-gray-400 text-sm"></i>
                    {{ account.stats.comments }}
                  </span>
                  <span class="flex items-center gap-1">
                    <i class="fa-solid fa-bookmark text-blue-500 text-sm"></i>
                    {{ account.stats.bookmarks }}
                  </span>
                </div>
                <div class="flex items-center text-xs text-gray-500">
                  <svg class="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <span>{{ account.date }}</span>
                </div>
              </div>
            </div>
            <div class="mt-4 pt-3 flex justify-center items-center text-xs text-gray-600 space-x-1">
              <button class="pagination-arrow-btn disabled:opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <span class="pagination-number active">1</span>
              <span class="pagination-number">2</span>
              <span class="pagination-number">8</span>
              <button class="pagination-arrow-btn">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isLoading = ref(true);
const flaggedData = ref([]);

// ICONS sekarang menggunakan kelas Font Awesome
const ICONS = {
  youtube: 'fab fa-youtube text-red-500',
  instagram: 'fab fa-instagram text-pink-600',
  tiktok: 'fab fa-tiktok text-blue-500',
};

const createDummyAccount = (id, platform) => ({
  id,
  author: 'fachryAlamsyah',
  platform: platform.charAt(0).toUpperCase() + platform.slice(1),
  socialIcon: ICONS[platform],
  stats: { followers: '15,5K', comments: 5, bookmarks: 300 },
  date: '02 Juni 2024 12:00:15',
});

const fetchFlaggedData = () => {
  setTimeout(() => {
    flaggedData.value = [
      {
        status: 'Normal (Akun Ditandai)',
        color: 'bg-blue-500',
        accounts: [createDummyAccount(1, 'youtube'), createDummyAccount(2, 'instagram'), createDummyAccount(3, 'tiktok')],
      },
      {
        status: 'Early',
        color: 'bg-green-500',
        accounts: [createDummyAccount(4, 'youtube'), createDummyAccount(5, 'instagram'), createDummyAccount(6, 'tiktok')],
      },
      {
        status: 'Emerging',
        color: 'bg-lime-500',
        accounts: [createDummyAccount(7, 'youtube'), createDummyAccount(8, 'instagram'), createDummyAccount(9, 'tiktok')],
      },
      {
        status: 'Current',
        color: 'bg-orange-500',
        accounts: [createDummyAccount(10, 'youtube'), createDummyAccount(11, 'instagram'), createDummyAccount(12, 'tiktok')],
      },
      {
        status: 'Crisis',
        color: 'bg-red-500',
        accounts: [createDummyAccount(13, 'youtube'), createDummyAccount(14, 'instagram'), createDummyAccount(15, 'tiktok')],
      },
    ];
    isLoading.value = false;
  }, 1500);
};

onMounted(fetchFlaggedData);
</script>

<style scoped>
.loader {
  border-top-color: #3b82f6;
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

/* Style untuk Pagination */
.pagination-number {
  @apply px-2 py-1 rounded-md text-gray-600 font-bold cursor-pointer hover:bg-gray-100;
}

.pagination-number.active {
  @apply bg-blue-600 text-white hover:bg-blue-600;
}

.pagination-arrow-btn {
  @apply p-1.5 rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed;
}
</style>