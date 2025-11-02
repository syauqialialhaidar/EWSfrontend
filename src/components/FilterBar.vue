<template>
  <div>
    <div class="bg-white p-4 rounded-xl shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="p-1.5 bg-gray-100 rounded-md">
            <LayoutGrid class="w-6 h-6 text-[#03255C]" />
          </div>
          <h2 class="text-xl font-bold text-[#03255C]">Virality</h2>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input type="text" readonly :value="formattedDate" @click="showPicker = !showPicker"
                class="border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-sm w-72 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <CalendarDays
                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />

              <div v-if="showPicker"
                class="absolute top-full right-0 mt-2 bg-white border rounded-lg shadow-lg z-20 p-4 w-auto">
                <div class="flex space-x-2 mb-3">
                  <button @click="setLast7Days"
                    class="w-full text-sm bg-gray-100 hover:bg-gray-200 rounded px-2 py-1 transition-colors">7 Hari
                    Terakhir</button>
                </div>
                <VDatePicker v-model.range="range" :mode="mode" :rules="rules" />
              </div>
            </div>
            <button @click="setToday"
              class="text-sm text-white font-bold bg-green-500 hover:bg-green-400 rounded-lg px-3 py-2 transition-colors">
              Hari Ini
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { LayoutGrid, CalendarDays } from 'lucide-vue-next';
import { DatePicker as VDatePicker } from 'v-calendar';
import 'v-calendar/style.css';
// Impor yang terkait modal (Headless UI, Heroicons) telah dihapus

// ==========================================================
// PERUBAHAN UTAMA: MENGGUNAKAN SHARED STATE (STORE)
// ==========================================================
// 1. Impor state reaktif 'filters' dan fungsi 'setDateRange' dari store.
//    Pastikan path ini benar sesuai struktur proyek Anda.
import { filters, setDateRange } from '@/stores/filterStore.js';


// --- State untuk Modal (Telah Dihapus) ---
// Semua state terkait modal (isShowModal, projects, threshold, dll.) telah dihapus.


// --- State untuk Kalender (Dimodifikasi) ---
const showPicker = ref(false);
const mode = ref('date');

// 2. Buat state LOKAL 'range' untuk diikat (v-model) ke komponen kalender.
//    Inisialisasi nilainya dari shared state 'filters' agar tetap sinkron saat halaman dimuat.
const range = ref({
  start: new Date(filters.startDate + 'T00:00:00'), // Tambahkan T00:00:00 untuk menghindari masalah timezone
  end: new Date(filters.endDate + 'T00:00:00')
});

// 3. Gunakan 'watch' untuk "mendengarkan" perubahan pada state LOKAL 'range'.
//    Setiap kali pengguna memilih tanggal baru di kalender, watcher ini akan terpicu.
watch(range, (newRange) => {
  if (newRange && newRange.start && newRange.end) {
    // Panggil fungsi 'setDateRange' dari store untuk memperbarui shared state.
    // Ini akan memberitahu semua komponen lain bahwa tanggal telah berubah.
    setDateRange(newRange.start, newRange.end);

    // Tutup picker secara otomatis setelah tanggal dipilih.
    setTimeout(() => {
      showPicker.value = false;
    }, 100);
  }
});


// --- Fungsi dan Computed Properties untuk Kalender (Tidak Berubah) ---
const formattedDate = computed(() => {
  if (!range.value || !range.value.start || !range.value.end) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const startDate = range.value.start.toLocaleString('id-ID', options);
  const endDate = range.value.end.toLocaleString('id-ID', options);
  return `${startDate} - ${endDate}`;
});
const rules = ref([
  { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 },
  { hours: 23, minutes: 59, seconds: 59, milliseconds: 999 },
]);

// --- Fungsi Tombol Tanggal (Dimodifikasi) ---
// Sekarang, fungsi ini hanya perlu mengubah state LOKAL 'range'.
// Perubahan pada shared state akan ditangani secara otomatis oleh 'watch' di atas.
const setToday = () => {
  const now = new Date();
  range.value = { start: now, end: now };
};
const setLast7Days = () => {
  const end = new Date();
  const start = new Date(new Date().setDate(end.getDate() - 6));
  range.value = { start, end };
};
</script>