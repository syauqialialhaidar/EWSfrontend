<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-[#03255C]">Akun yang Ditandai</h2>
      <p class="text-sm text-gray-500">Akun yang sering muncul dalam postingan berstatus tinggi.</p>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center min-h-[20rem]">
      <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-10 w-10"></div>
      <p class="text-md font-semibold text-gray-600 ml-4">Memuat akun...</p>
    </div>

    <div v-else class="animate-fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch">

        <div v-for="column in flaggedData" :key="column.status"
          :class="[column.bgColor, 'rounded-xl flex flex-col']">

          <div :class="[column.textColor, 'font-bold py-3 px-4 text-center text-sm border-b', column.borderColor]">
            {{ column.status }}
          </div>

          <div class="p-3 flex-grow flex flex-col justify-between">
            <div class="space-y-3">
              <div v-for="account in paginatedAccounts(column)" :key="account.id"
                class="bg-white rounded-lg p-3 border border-gray-200 shadow-sm transition-all hover:shadow-lg hover:border-blue-400">
                <div class="flex items-center mb-3">
                  <img :src="account.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3 border-2 border-white">
                  <div>
                    <p class="font-bold text-sm text-[#03255C]">{{ account.author }}</p>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500">
                      <FontAwesomeIcon :icon="account.socialIcon" :class="[account.iconColor, 'h-3 w-3']" />
                      <span>{{ account.platform }}</span>
                    </div>
                  </div>
                </div>
                <div class="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 mb-3">
                  <div>
                    <p class="font-bold text-sm text-[#03255C]">{{ account.stats.followers }}</p>
                    <p class="text-gray-400">Posts</p>
                  </div>
                  <div>
                    <p class="font-bold text-sm text-[#03255C]">{{ account.stats.comments }}</p>
                    <p class="text-gray-400">Followers</p>
                  </div>
                  <div>
                    <p class="font-bold text-sm text-[#03255C]">{{ account.stats.bookmarks }}</p>
                    <p class="text-gray-400">Following</p>
                  </div>
                </div>
                <button
                  class="w-full text-xs font-semibold bg-gray-100 text-[#03255C] border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-200 transition">
                  Lihat Profil
                </button>
              </div>
            </div>
            <div v-if="column.accounts.length > ACCOUNTS_PER_PAGE" class="mt-4 pt-3 flex justify-between items-center text-xs text-gray-600">
              <button @click="changePage(column, column.currentPage - 1)" :disabled="column.currentPage === 1" class="pagination-arrow-btn">
                 <FontAwesomeIcon :icon="faChevronLeft" />
              </button>
              <span class="font-semibold">Hal {{ column.currentPage }} dari {{ totalPages(column) }}</span>
              <button @click="changePage(column, column.currentPage + 1)" :disabled="column.currentPage === totalPages(column)" class="pagination-arrow-btn">
                <FontAwesomeIcon :icon="faChevronRight" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faYoutube, faInstagram, faTiktok } from '@fortawesome/free-brands-svg-icons';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';


const isLoading = ref(true);
const flaggedData = ref([]);
const ACCOUNTS_PER_PAGE = 3;

const ICONS = {
  youtube: { icon: faYoutube, color: 'text-red-500' },
  instagram: { icon: faInstagram, color: 'text-pink-600' },
  tiktok: { icon: faTiktok, color: 'text-black' },
};

// PERUBAHAN: Menambahkan state paginasi ke setiap kolom
const createDummyAccount = (id, platform) => ({
  id,
  author: 'fachryAlamsyah',
  platform: platform.charAt(0).toUpperCase() + platform.slice(1),
  socialIcon: ICONS[platform].icon,
  iconColor: ICONS[platform].color,
  avatar: `https://i.pravatar.cc/40?u=${id}`,
  stats: { followers: '1.2K', comments: '5.5M', bookmarks: '300K' },
  date: '02 Juni 2024 12:00:15',
});

const totalPages = (column) => Math.ceil(column.accounts.length / ACCOUNTS_PER_PAGE);

const paginatedAccounts = computed(() => (column) => {
  const start = (column.currentPage - 1) * ACCOUNTS_PER_PAGE;
  const end = start + ACCOUNTS_PER_PAGE;
  return column.accounts.slice(start, end);
});

const changePage = (column, newPage) => {
  if (newPage > 0 && newPage <= totalPages(column)) {
    column.currentPage = newPage;
  }
};


const fetchFlaggedData = () => {
  setTimeout(() => {
    flaggedData.value = [
      {
        status: 'Normal',
        bgColor: 'bg-blue-50', textColor: 'text-blue-800', borderColor: 'border-blue-200',
        accounts: Array.from({ length: 5 }, (_, i) => createDummyAccount(i + 1, 'youtube')), currentPage: 1,
      },
      {
        status: 'Early',
        bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200',
        accounts: Array.from({ length: 7 }, (_, i) => createDummyAccount(i + 6, 'instagram')), currentPage: 1,
      },
      {
        status: 'Emerging',
        bgColor: 'bg-lime-50', textColor: 'text-lime-800', borderColor: 'border-lime-200',
        accounts: Array.from({ length: 4 }, (_, i) => createDummyAccount(i + 13, 'tiktok')), currentPage: 1,
      },
      {
        status: 'Current',
        bgColor: 'bg-orange-50', textColor: 'text-orange-800', borderColor: 'border-orange-200',
        accounts: Array.from({ length: 8 }, (_, i) => createDummyAccount(i + 17, 'youtube')), currentPage: 1,
      },
      {
        status: 'Crisis',
        bgColor: 'bg-red-50', textColor: 'text-red-800', borderColor: 'border-red-200',
        accounts: Array.from({ length: 2 }, (_, i) => createDummyAccount(i + 25, 'instagram')), currentPage: 1,
      },
    ];
    isLoading.value = false;
  }, 1500);
};

onMounted(fetchFlaggedData);
</script>

<style scoped>
/* (Style untuk loader & fade-in tetap sama) */
.loader { border-top-color: #3b82f6; animation: spinner 1.5s linear infinite; }
@keyframes spinner { 100% { transform: rotate(360deg); } }
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

.pagination-arrow-btn {
  @apply p-2 rounded-md text-gray-500 hover:bg-gray-200 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent;
}
</style>