// src/store/filterStore.js

import { reactive, computed } from 'vue';

// Inisialisasi tanggal default: 7 hari terakhir
const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);

// State yang akan dibagikan ke semua komponen
export const filters = reactive({
  // Gunakan format YYYY-MM-DD agar mudah dikirim ke API
  startDate: sevenDaysAgo.toISOString().split('T')[0],
  endDate: today.toISOString().split('T')[0],
});

// Fungsi untuk mengubah tanggal
export function setDateRange(start, end) {
  if (start && end) {
    filters.startDate = start.toISOString().split('T')[0];
    filters.endDate = end.toISOString().split('T')[0];
  }
}