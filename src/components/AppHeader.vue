<template>
  <header class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <img :src="logo" alt="Logo" class="h-10 w-10 object-contain" />
      <div>
        <h1 class="font-bold text-[#03255C] dark:text-gray-100 text-base tracking-wider">VIRALITY SYSTEM - EARLY WARNING SYSTEM</h1>
        <p class="text-xs text-gray-500 dark:text-gray-400">Early Warning System Konten Media Sosial</p>
      </div>
    </div>

    <div class="flex items-center space-x-5">
      <button class="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-[#03255C] dark:hover:text-white transition-colors">
        <span class="font-semibold text-sm">ID</span>
        <ChevronDown class="w-4 h-4" />
      </button>

      <button
        @click="toggleTheme"
        class="text-gray-500 dark:text-gray-400 hover:text-[#03255C] dark:hover:text-white transition-colors p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <Sun v-if="theme === 'dark'" class="w-6 h-6" />
        <Moon v-else class="w-6 h-6" />
      </button>

      <button
        class="relative text-gray-500 dark:text-gray-400 hover:text-[#03255C] dark:hover:text-white transition-colors p-1 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
        <Bell class="w-6 h-6" />
        <span
          class="absolute -top-0 -right-0 flex items-center justify-center h-4.5 w-4.5 bg-orange-500 text-white text-[10px] font-bold rounded-full">7</span>
      </button>
      <div class="relative">
        <button
          class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 transition-all focus:outline-none">
          <User class="w-6 h-6" />
        </button>
        <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import logo from '../assets/image/logo-min.png'
import { Moon, Bell, User, ChevronDown, Sun } from 'lucide-vue-next'
import { useThemeStore } from '@/stores'

const themeStore = useThemeStore()
const theme = computed(() => themeStore.currentTheme)
const toggleTheme = () => {
  themeStore.toggleTheme()
}
</script>