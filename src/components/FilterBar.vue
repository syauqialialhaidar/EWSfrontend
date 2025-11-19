<template>
  <div>
    <div class="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3 dark:text-white">
          <div class="p-1.5 bg-gray-100 dark:bg-gray-700 rounded-md">
            <LayoutGrid class="w-6 h-6 text-[#03255C] dark:text-blue-400" />
          </div>
          <h2 class="text-xl font-bold text-[#03255C] dark:text-gray-100">Filter Periode EWS</h2>
        </div>

        <div class="flex items-center space-x-4">
          <div class="flex items-center space-x-2">
            <div class="relative">
              <input type="text" readonly :value="formattedDate" @click="openPicker"
                class="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2 pl-4 pr-10 text-sm w-72 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200" />
              <CalendarDays
                class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />

              <div v-if="showPicker"
                class="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-20 w-auto">
                <div class="flex">
                  <div class="flex flex-col space-y-2 p-3 border-r border-gray-100 w-48">
                    <button @click="setToday"
                      class="w-full text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-md px-3 py-1.5 transition-colors text-left font-medium">
                      Hari Ini
                    </button>
                    <button @click="setLast7Days"
                      class="w-full text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-md px-3 py-1.5 transition-colors text-left font-medium">
                      7 Hari Terakhir
                    </button>
                    <button @click="setThisMonth"
                      class="w-full text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-md px-3 py-1.5 transition-colors text-left font-medium">
                      Bulan Ini
                    </button>
                    <button @click="setLast30Days"
                      class="w-full text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-700 rounded-md px-3 py-1.5 transition-colors text-left font-medium">
                      30 Hari Terakhir
                    </button>
                  </div>

                  <div class="p-2">
                    <VDatePicker v-model.range="pickerRange" :mode="mode" :rules="rules" color="blue" />
                  </div>
                </div>

                <div class="flex justify-end space-x-2 p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                  <button @click="handleCancel" 
                    class="text-sm text-gray-700 font-semibold bg-white border border-gray-300 hover:bg-gray-50 rounded-lg px-3 py-1.5 transition-colors">
                    Batal
                  </button>
                  <button @click="handleApply"
                    class="text-sm text-white font-semibold bg-[#03255C] hover:bg-opacity-90 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg px-3 py-1.5 transition-colors">
                    Terapkan
                  </button>
                </div>
              </div>

            </div>
            <button @click="applyToday" 
              class="text-sm text-white font-semibold bg-[#03255C] hover:bg-opacity-90 rounded-lg px-3 py-2 transition-colors">
              Hari Ini
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { LayoutGrid, CalendarDays } from 'lucide-vue-next'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/style.css'
import { useFilterStore } from '@/stores/useFilterStore'

const filterStore = useFilterStore()
const showPicker = ref(false)
const mode = ref('date')

const range = ref({
  start: new Date(filterStore.startDate + 'T00:00:00'),
  end: new Date(filterStore.endDate + 'T00:00:00')
})
const pickerRange = ref(null) 

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

const openPicker = () => {
  pickerRange.value = { start: range.value.start, end: range.value.end };
  showPicker.value = true;
};

const handleCancel = () => {
  showPicker.value = false;
  pickerRange.value = null; 
};

const handleApply = () => {
  if (pickerRange.value && pickerRange.value.start && pickerRange.value.end) {
    range.value = { ...pickerRange.value }
    filterStore.setDateRange(range.value.start, range.value.end)
    showPicker.value = false
    pickerRange.value = null
  }
}

const setToday = () => {
  const now = new Date();
  pickerRange.value = { start: now, end: now };
};
const setLast7Days = () => {
  const end = new Date();
  const start = new Date(new Date().setDate(end.getDate() - 6));
  pickerRange.value = { start, end };
};
const setLast30Days = () => {
  const end = new Date();
  const start = new Date(new Date().setDate(end.getDate() - 29));
  pickerRange.value = { start, end };
};
const setThisMonth = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  pickerRange.value = { start, end };
};

const applyToday = () => {
  filterStore.setToday()
  const now = new Date()
  range.value = { start: now, end: now }
}

</script>