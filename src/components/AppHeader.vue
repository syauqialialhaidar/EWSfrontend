<template>
  <header class="bg-white p-4 rounded-xl shadow-md flex items-center justify-between">
    <div class="flex items-center space-x-4">
      <img :src="logo" alt="Logo" class="h-10 w-10 object-contain" />
      <div>
        <h1 class="font-bold text-[#03255C] text-base tracking-wider">VIRALITY SYSTEM</h1>
        <p class="text-xs text-gray-500">The most important info highlights</p>
      </div>
    </div>

    <div class="flex items-center space-x-5">
      <span class="font-semibold text-sm">ID</span>
      <button class="text-gray-500 hover:text-[#03255C] transition-colors">
        <Moon class="w-6 h-6" />
      </button>
      <button class="relative text-gray-500 hover:text-[#03255C] transition-colors">
        <Bell class="w-6 h-6" />
        <span
          class="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 bg-orange-500 text-white text-xs font-bold rounded-full">7</span>
      </button>
      <div class="relative">
        <button class="w-10 h-10 rounded-full bg-sky-500 text-white flex items-center justify-center">
          <User class="w-6 h-6" />
        </button>
        <span class="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 border-2 border-white"></span>
      </div>
    </div>
  </header>
</template>

<script setup>
import logo from '../assets/image/logo-min.png';
import { Moon, Bell, User } from 'lucide-vue-next';
</script>