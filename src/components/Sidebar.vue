<template>
  <div>

    <aside
      :class="[
        'bg-white shadow-md h-screen fixed top-0 flex flex-col transition-all duration-300 z-40 border-r border-gray-200',
        isOpen ? 'w-64' : 'w-20',
        isMobile ? (isOpen ? 'left-0' : '-left-64') : 'left-0'
      ]"
    >
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h1 
          v-if="isOpen" 
          class="font-bold text-lg text-blue-600 whitespace-nowrap transition-all"
        >
          MEDMON APPS
        </h1>
        <button 
          @click="$emit('toggleSidebar')" 
          class="hidden md:flex items-center justify-center text-gray-500 hover:text-blue-600 transition"
        >
          <component :is="isOpen ? ChevronLeft : ChevronRight" class="w-5 h-5" />
        </button>
        <button 
          @click="$emit('toggleSidebar')"
          class="md:hidden text-gray-500 hover:text-blue-600"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto mt-4">
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name">
            <router-link
              :to="item.route"
              class="flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition rounded-lg"
              :class="{ 'bg-blue-50 text-blue-600 font-semibold': isActive(item.route) }"
              @click="isMobile ? $emit('toggleSidebar') : null"
            >
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span v-if="isOpen" class="whitespace-nowrap">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>

    <div 
      v-if="isMobile && isOpen" 
      class="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
      @click="$emit('toggleSidebar')"
    ></div>
  </div>
</template>

<script setup>
// Hapus semua state management (ref, onMounted, onUnmounted) dari sini
import { useRoute } from 'vue-router'
import { 
  Home, FileText, User, Search, Database, BarChart2, TrendingUp, Mic, Download, Trash2, Settings,
  Menu, X, ChevronLeft, ChevronRight
} from 'lucide-vue-next'

// 1. Definisikan props untuk menerima state dari App.vue
defineProps({
  isOpen: Boolean,
  isMobile: Boolean,
})


const route = useRoute()
const isActive = (path) => route.path === path

const menuItems = [
  // (isi menuItems tetap sama)
  { name: 'Dasbor', icon: Home},
  { name: 'Berita & Postingan', icon: FileText },
  { name: 'Akun & Media', icon: User},
  { name: 'Pencarian', icon: Search},
  { name: 'Pembersihan Data', icon: Database},
  { name: 'Analitik', icon: BarChart2},
  { name: 'Tren', icon: TrendingUp},
  { name: 'Siaran Pers', icon: Mic},
  { name: 'Ekspor Data', icon: Download},
  { name: 'Data Terhapus', icon: Trash2},
  { name: 'Pengaturan', icon: Settings },
]
</script>

<style scoped>
aside {
  font-family: 'Inter', sans-serif;
}
</style>