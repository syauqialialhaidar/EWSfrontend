<template>
  <div class="flex bg-gray-100 min-h-screen">
    <Sidebar :is-open="isOpen" :is-mobile="isMobile" @toggle-sidebar="toggleSidebar" />

    <main class="flex-1 p-6 transition-all duration-300" :class="mainContentClass">
      <div class="max-w-7xl mx-auto space-y-5">
        <AppHeader />

        <FilterBar v-if="!$route.meta.hideFilterBar" />

        <router-view />
      </div>
    </main>

    <!-- Global Notifications -->
    <AppNotifications />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import AppHeader from './components/AppHeader.vue'
import FilterBar from './components/FilterBar.vue'
import AppNotifications from './components/AppNotifications.vue'
import { useThemeStore } from '@/stores'

// ===================================
// STORE INITIALIZATION
// ===================================
const themeStore = useThemeStore()

// ===================================
// SIDEBAR STATE
// ===================================
const isOpen = ref(true)
const isMobile = ref(false)

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
  if (isMobile.value) {
    isOpen.value = false;
  } else {
    isOpen.value = true;
  }
}

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const mainContentClass = computed(() => {
  if (isMobile.value) {
    return 'ml-0';
  }
  return isOpen.value ? 'ml-64' : 'ml-20';
})

// ===================================
// LIFECYCLE HOOKS
// ===================================
onMounted(() => {
  // Initialize theme
  themeStore.initTheme()

  // Check mobile
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>