<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar :is-open="isOpen" :is-mobile="isMobile" @toggle-sidebar="toggleSidebar" />

    <main class="flex-1 p-6 transition-all duration-300" :class="mainContentClass">
      <div class="max-w-7xl mx-auto space-y-5">
        <AppHeader />
        <FilterBar />
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import AppHeader from './components/AppHeader.vue'
import FilterBar from './components/FilterBar.vue'

const isOpen = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isOpen.value = false; // Di mobile, sidebar defaultnya tertutup
  } else {
    isOpen.value = true; // Di desktop, sidebar defaultnya terbuka
  }
}

// Cek ukuran layar saat komponen dimuat dan saat di-resize
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

// Fungsi untuk menangani event dari Sidebar
const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

// --- Computed property untuk kelas dinamis ---
const mainContentClass = computed(() => {
  if (isMobile.value) {
    return 'ml-0'; // Di mobile, tidak ada margin
  }
  return isOpen.value ? 'ml-64' : 'ml-20'; // Di desktop, margin berubah
})
</script>