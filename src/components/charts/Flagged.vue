<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
    <div class="mb-6">
      <h2 class="text-xl font-bold text-[#03255C] dark:text-blue-400">Akun yang Ditandai</h2>
      <p class="text-sm text-gray-500 dark:text-gray-400">Akun dari postingan yang telah Anda bookmark, dikelompokkan berdasarkan status.</p>
    </div>

    <div v-if="!isLoading && totalBookmarks === 0" class="flex flex-col justify-center items-center min-h-[10rem] text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
      <p class="font-semibold">Belum ada akun yang ditandai.</p>
      <p class="text-xs">Bookmark postingan di dashboard utama untuk melihatnya di sini.</p>
    </div>

    <div v-else class="animate-fade-in">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-stretch">

        <div v-for="column in flaggedData" :key="column.status"
          :class="[column.bgColor, 'rounded-xl flex flex-col border dark:border-opacity-10']">

          <div :class="[column.textColor, 'font-bold py-3 px-4 text-center text-sm border-b border-gray-200 dark:border-gray-700/50']">
            {{ column.status }}
            <span class="ml-1 text-xs opacity-70">({{ column.accounts.length }})</span>
          </div>

          <div class="p-3 flex-grow flex flex-col justify-between">
            <div class="space-y-3">
              
              <div v-if="column.accounts.length === 0" class="text-center py-8 text-xs text-gray-400 italic">
                Kosong
              </div>

              <div v-for="account in paginatedAccounts(column)" :key="account.id"
                class="bg-white dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600 shadow-sm transition-all hover:shadow-lg hover:border-blue-400 group">
                
                <div class="flex items-center mb-3">
                  <img :src="account.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3 border-2 border-white dark:border-gray-600 object-cover">
                  <div class="min-w-0"> <p class="font-bold text-sm text-[#03255C] dark:text-blue-300 truncate block">{{ account.author }}</p>
                    <div class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <i :class="[account.socialIcon, 'text-xs']"></i>
                      <span class="capitalize">{{ account.platform }}</span>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center text-xs text-gray-600 dark:text-gray-300 mb-3">
                  <div>
                    <p class="font-bold text-[#03255C] dark:text-blue-300">{{ account.stats.followers }}</p>
                    <p class="text-[10px] text-gray-400 uppercase">Foll</p>
                  </div>
                  <div>
                    <p class="font-bold text-[#03255C] dark:text-blue-300">{{ account.stats.comments }}</p>
                    <p class="text-[10px] text-gray-400 uppercase">Rep</p>
                  </div>
                  <div>
                    <p class="font-bold text-[#03255C] dark:text-blue-300">{{ account.stats.bookmarks }}</p>
                    <p class="text-[10px] text-gray-400 uppercase">Fav</p>
                  </div>
                </div>

                <button @click="openLink(account.url)"
                  class="w-full text-xs font-semibold bg-gray-50 dark:bg-gray-600 text-[#03255C] dark:text-gray-200 border border-gray-200 dark:border-gray-500 px-3 py-1.5 rounded-md hover:bg-[#03255C] hover:text-white transition">
                  Lihat Post
                </button>
              </div>
            </div>

            <div v-if="column.accounts.length > ACCOUNTS_PER_PAGE" class="mt-4 pt-3 flex justify-between items-center text-xs text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-600">
              <button @click="changePage(column, column.currentPage - 1)" :disabled="column.currentPage === 1" class="pagination-arrow-btn">
                 <FontAwesomeIcon :icon="faChevronLeft" />
              </button>
              <span class="font-semibold">{{ column.currentPage }} / {{ totalPages(column) }}</span>
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
import { ref, onMounted, computed, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// --- Integrasi Pinia ---
import { useBookmarkStore } from '@/stores/useBookmarkStore';
import { storeToRefs } from 'pinia';

const bookmarkStore = useBookmarkStore();
const { bookmarkedPosts } = storeToRefs(bookmarkStore);

const isLoading = ref(false); 
const flaggedData = ref([]);
const ACCOUNTS_PER_PAGE = 3;

// Helper untuk menentukan Platform dari string icon (karena Hight.vue menyimpan class string)
const getPlatformName = (iconClass) => {
  if (!iconClass) return 'Social';
  if (iconClass.includes('tiktok')) return 'TikTok';
  if (iconClass.includes('instagram')) return 'Instagram';
  if (iconClass.includes('twitter') || iconClass.includes('x-twitter')) return 'Twitter';
  if (iconClass.includes('facebook')) return 'Facebook';
  if (iconClass.includes('youtube')) return 'Youtube';
  return 'Social';
};

const openLink = (url) => {
  if (url) window.open(url, '_blank');
};

// Fungsi Utama: Mapping Data Store ke Struktur Kolom
const processBookmarkedData = () => {
  // 1. Template Struktur 5 Kolom
  const columnsSkeleton = [
    { status: 'Normal',   key: 'Normal',   bgColor: 'bg-blue-50 dark:bg-blue-900/20',   textColor: 'text-blue-800 dark:text-blue-300' },
    { status: 'Early',    key: 'Early',    bgColor: 'bg-green-50 dark:bg-green-900/20',  textColor: 'text-green-800 dark:text-green-300' },
    { status: 'Emerging', key: 'Emerging', bgColor: 'bg-lime-50 dark:bg-lime-900/20',   textColor: 'text-lime-800 dark:text-lime-300' },
    { status: 'Current',  key: 'Current',  bgColor: 'bg-orange-50 dark:bg-orange-900/20', textColor: 'text-orange-800 dark:text-orange-300' },
    { status: 'Crisis',   key: 'Crisis',   bgColor: 'bg-red-50 dark:bg-red-900/20',      textColor: 'text-red-800 dark:text-red-300' },
  ];

  // 2. Reset data dan inisialisasi array akun kosong
  const processedColumns = columnsSkeleton.map(col => ({
    ...col,
    accounts: [],
    currentPage: 1
  }));

  // 3. Loop setiap postingan yang dibookmark
  bookmarkedPosts.value.forEach(post => {
    const targetColumn = processedColumns.find(c => c.key === post.postStatus) || processedColumns[0];

    const accountData = {
      id: post.id, // Menggunakan ID Post untuk unik key
      author: post.author,
      avatar: post.avatar,
      socialIcon: post.socialIcon, // Class string dari Hight.vue (contoh: 'fab fa-tiktok...')
      platform: getPlatformName(post.socialIcon),
      url: post.url,
      stats: {
        followers: post.stats.followers || '-',
        comments: post.stats.replies || '-',    // Mapping Replies -> Comments label
        bookmarks: post.stats.favorites || '-'  // Mapping Favorites -> Bookmarks/Likes label
      }
    };

    targetColumn.accounts.push(accountData);
  });

  flaggedData.value = processedColumns;
};

const totalBookmarks = computed(() => bookmarkedPosts.value.length);
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

// Watcher: Update data setiap kali bookmark berubah di store
watch(bookmarkedPosts, () => {
  processBookmarkedData();
}, { deep: true });

onMounted(() => {
  processBookmarkedData();
});
</script>

<style scoped>
@keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fade-in 0.5s ease-out forwards; }

.pagination-arrow-btn {
  @apply p-1.5 rounded-md text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors;
}
</style>