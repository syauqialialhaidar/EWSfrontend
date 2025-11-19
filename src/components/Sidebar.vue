<template>
  <div>
    <aside :class="[
      'bg-white shadow-md h-screen fixed top-0 flex flex-col transition-all duration-300 z-40 border-r border-gray-200',
      isOpen ? 'w-64' : 'w-20',
      isMobile ? (isOpen ? 'left-0' : '-left-64') : 'left-0',
    ]">
      <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h1 v-if="isOpen" class="font-bold text-lg text-blue-600 whitespace-nowrap transition-all">
          EWS Dashboard
        </h1>
        <button @click="$emit('toggleSidebar')"
          class="hidden md:flex items-center justify-center text-gray-500 hover:text-blue-600 transition">
          <component :is="isOpen ? ChevronLeft : ChevronRight" class="w-5 h-5" />
        </button>
        <button @click="$emit('toggleSidebar')" class="md:hidden text-gray-500 hover:text-blue-600">
          <X class="w-5 h-5" />
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto mt-4">
        <ul class="space-y-1">
          <li v-for="item in menuItems" :key="item.name" class="px-3">
            <router-link v-if="!item.children" :to="item.route"
              class="flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-100 hover:text-blue-600 transition rounded-lg"
              :class="{
                'bg-blue-50 text-blue-600 font-semibold': isActive(item.route),
              }" @click="isMobile ? $emit('toggleSidebar') : null">
              <component :is="item.icon" class="w-5 h-5 mr-3" />
              <span v-if="isOpen" class="whitespace-nowrap">{{
                item.name
              }}</span>
            </router-link>

            <div v-else>
              <router-link :to="item.route"
                class="flex items-center justify-between w-full px-4 py-2.5 rounded-lg transition" :class="[
                  isParentActive(item)
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-blue-100 hover:text-blue-600',
                ]" @click="
                  openDropdown(item.name);
                isMobile ? $emit('toggleSidebar') : null;
                ">
                <div class="flex items-center">
                  <component :is="item.icon" class="w-5 h-5 mr-3" />
                  <span v-if="isOpen" class="whitespace-nowrap">{{
                    item.name
                  }}</span>
                </div>
                <ChevronDown v-if="isOpen" class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': openDropdowns[item.name] }" />
              </router-link>

              <ul v-if="openDropdowns[item.name] && isOpen" class="mt-1 space-y-1 pl-9 pr-2">
                <li v-for="child in item.children" :key="child.name">
                  <router-link :to="child.route"
                    class="flex items-center w-full px-3 py-2 text-sm text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition rounded-lg"
                    :class="{
                      'bg-blue-50 text-blue-600 font-semibold': isActive(
                        child.route
                      ),
                    }" @click="isMobile ? $emit('toggleSidebar') : null">
                    <span class="whitespace-nowrap">{{ child.name }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </aside>

    <div v-if="isMobile && isOpen" class="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
      @click="$emit('toggleSidebar')"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Home,
  FileText,
  User,
  Search,
  Database,
  BarChart2,
  TrendingUp,
  Mic,
  Download,
  Trash2,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-vue-next'

defineProps({
  isOpen: Boolean,
  isMobile: Boolean,
})

const openDropdowns = ref({})

const openDropdown = (itemName) => {
  openDropdowns.value[itemName] = true
}

const route = useRoute()

const isActive = (path, currentPath = route.path) => {
  return currentPath === path
}

const isParentActive = (item, currentPath = route.path) => {
  if (item.route && isActive(item.route, currentPath)) {
    return true
  }
  if (!item.children) return false
  return item.children.some((child) => isActive(child.route, currentPath))
}

const menuItems = [
  { name: 'Crisis Compass', icon: Home, route: '/crisis-compass' },
  { name: 'Analitik', icon: BarChart2, route: '/analitik' },
  { name: 'Tren', icon: TrendingUp, route: '/tren' },
  { name: 'Rules', icon: Settings, route: '/rules' },
]

watch(
  () => route.path,
  (newPath) => {
    for (const itemName in openDropdowns.value) {
      if (openDropdowns.value[itemName]) {
        const item = menuItems.find((m) => m.name === itemName)
        if (item && !isParentActive(item, newPath)) {
          openDropdowns.value[itemName] = false
        }
      }
    }
  }
)
</script>

<style scoped>
aside {
  font-family: 'Poppins', sans-serif;
}
</style>