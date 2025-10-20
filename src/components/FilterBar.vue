<template>
  <div class="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="p-1.5 bg-gray-100 rounded-md">
         <LayoutGrid class="w-6 h-6 text-blue-900" />
      </div>
      <h2 class="text-xl font-bold text-gray-800">Virality</h2>
    </div>

    <div class="flex items-center space-x-3">
      <div class="relative">
        <input 
          type="text" 
          readonly
          value="11 Januari 2025 - 18 Januari 2025" 
          class="border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm w-72 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <CalendarDays class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>

      <button class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors">
        Hari Ini
      </button>
    </div>
  </div>
</template>

<script setup>
import { LayoutGrid, CalendarDays } from 'lucide-vue-next';
</script>