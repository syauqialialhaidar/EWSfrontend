<template>
  <div class="p-6 md:p-10 bg-gray-50 min-h-screen">
    <div v-if="topicName" class="max-w-5xl mx-auto">
      
      <div class="mb-6">
        <button 
          @click="$router.go(-1)" 
          class="text-sm font-semibold text-blue-600 hover:text-blue-800 transition mb-2 flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Dashboard
        </button>
        <h1 class="text-3xl font-bold text-[#03255C]">Analisis Detail Topik</h1>
        <p class="text-xl text-gray-700 mt-1">{{ topicName }}</p>
      </div>

      <div class="space-y-6">
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 class="text-xl font-bold text-[#03255C] mb-4">Analisis Konten (Placeholder)</h2>
          <p class="text-gray-600">
            Area ini untuk konten analisis yang Anda sebutkan akan dipindahkan dari halaman utama.
          </p>
          <p class="text-gray-600 mt-2">
            Anda bisa mem-fetch data khusus untuk topik <strong>{{ topicName }}</strong> dan menampilkannya di sini.
          </p>
          
          <div class="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 class="font-semibold text-gray-700">Data untuk Developer</h3>
            <p class="text-sm text-gray-500">Parameter topik yang diterima dari URL:</p>
            <code class="block bg-gray-200 text-gray-800 p-2 rounded mt-2 text-sm">{{ $route.params.topicName }}</code>
          </div>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
            <h3 class="text-lg font-bold text-[#03255C] mb-3">Chart Detail (Placeholder)</h3>
            <p class="text-gray-500 text-sm">Tempat untuk chart analisis sentimen atau tren...</p>
          </div>
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[300px]">
            <h3 class="text-lg font-bold text-[#03255C] mb-3">Postingan Kunci (Placeholder)</h3>
            <p class="text-gray-500 text-sm">Tempat untuk daftar postingan yang lebih mendalam...</p>
          </div>
        </div>
        
      </div>

    </div>
    
    <div v-else class="text-center p-20">
      <p class="text-gray-500">Memuat data topik...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const topicName = ref('');

onMounted(() => {
  // Ambil nama topik dari parameter URL
  topicName.value = route.params.topicName;
  
  // Panggil API Anda di sini untuk mendapatkan data detail
  // hanya untuk topik spesifik ini.
  if (topicName.value) {
    fetchTopicDetails(topicName.value);
  }
});

const fetchTopicDetails = async (name) => {
  console.log(`Fetching details for ${name}...`);
  // const response = await fetch(`.../api/topic-detail?topic=${encodeURIComponent(name)}`);
  // const data = await response.json();
  // ... proses data detail Anda ...
}
</script>

<style scoped>
/* Style khusus untuk halaman ini */
</style>