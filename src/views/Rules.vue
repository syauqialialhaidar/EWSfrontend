<template>
  <div class="min-h-screen bg-gray-50/50 pt-6 pb-20">
    <div class="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="px-8 py-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 class="text-2xl font-bold text-slate-800">Konfigurasi Rules Threshold</h3>
            <p class="text-sm text-slate-500 mt-1">Atur batas nilai (threshold) untuk setiap status risiko project.</p>
          </div>
          <button @click="openFaqModal"
            class="group flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all text-sm font-semibold">
            <span class="flex items-center justify-center w-5 h-5 rounded-full bg-blue-200 text-blue-700 text-xs font-bold group-hover:bg-blue-300">?</span>
            Bantuan & FAQ
          </button>
        </div>

        <div class="p-8">
          <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div class="w-full max-w-xl relative z-20" ref="projectInputRef">
              <label class="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cari / Pilih Project</label>
              <div class="relative">
                <input
                  type="text"
                  class="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  v-model="selectedProject" 
                  @input="searchProject" 
                  @focus="showDropdown = true"
                  placeholder="Ketik ID Project atau Topik..." 
                />
                <MagnifyingGlassIcon class="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
                
                <div v-if="showDropdown && filteredProjects.length > 0"
                  class="absolute mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 max-h-60 overflow-y-auto custom-scrollbar z-50">
                  <ul>
                    <li v-for="(project, index) in filteredProjects" :key="index" @click="selectProject(project)"
                      class="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors">
                      <div class="font-semibold text-slate-700 text-sm">{{ project.id_project }}</div>
                      <div class="text-xs text-slate-500">Topik: {{ project.topik }}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-end sm:items-center gap-3 w-full lg:w-auto">
              <div class="flex items-center gap-2">
                <span class="text-xs font-semibold text-slate-400 uppercase mr-1">Quick:</span>
                <button v-for="id in quickAccessIds" :key="id" @click="selectQuickProject(id)"
                  :class="selectedProject == id 
                    ? 'bg-emerald-500 text-white shadow-emerald-200 shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600'"
                  class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                  {{ id }}
                </button>
              </div>
              <button @click="openAddModal"
                class="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-emerald-100 ml-auto sm:ml-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>
                Project Baru
              </button>
            </div>
          </div>

          <div class="bg-slate-50 rounded-xl border border-slate-200 p-6">
            
            <div class="grid grid-cols-5 gap-4 mb-4">
              <div v-for="def in thresholdDefinitions" :key="def.label">
                <div :class="[def.color, def.textColor]" class="py-2 px-1 rounded-lg text-center text-xs font-bold shadow-sm tracking-wide">
                  {{ def.label }}
                </div>
              </div>
            </div>

            <div class="space-y-3">
              <div v-if="thresholdGrid.length > 0" v-for="row in 11" :key="row" 
                class="grid grid-cols-5 gap-4 items-center group"> <div v-for="col in 5" :key="col">
                  <input type="number" 
                    v-model="thresholdGrid[(row - 1) * 5 + (col - 1)].value"
                    class="w-full bg-white border border-slate-200 text-slate-700 rounded-lg h-10 text-center font-semibold text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all hover:border-blue-300 placeholder-slate-200"
                    placeholder="0" 
                  />
                </div>
              </div>

              <div v-else class="p-8 text-center text-slate-400 text-sm">
                 Memuat data grid...
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <div class="flex items-center gap-2 text-sm">
              <span class="text-slate-400 font-medium">Project Aktif:</span>
              <span class="px-3 py-1 rounded-md font-bold" 
                :class="selectedProject ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'">
                {{ selectedProject || 'Belum dipilih' }}
              </span>
            </div>
            <div class="flex items-center gap-3">
              <button @click="cancelChanges"
                class="px-6 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 focus:outline-none transition-all">
                Reset
              </button>
              <button @click="saveRules"
                class="px-6 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg shadow-lg shadow-blue-200 focus:ring-4 focus:ring-blue-100 transition-all">
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div class="mb-8 border-b border-gray-100 pb-6">
          <h3 class="text-2xl font-bold text-slate-800">Manajemen Pemetaan Topik</h3>
          <p class="text-sm text-slate-500 mt-1">Seret topik dari panel kiri ke kotak di sebelah kanan keyword yang sesuai.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div class="lg:col-span-4 flex flex-col h-[600px]">
            <div class="bg-slate-100 rounded-t-xl border border-slate-200 border-b-0 p-4 text-center">
              <h4 class="font-extrabold text-slate-600 text-xs uppercase tracking-wider">Master Topik (Sumber)</h4>
            </div>
            <div class="flex-1 bg-slate-50 border border-slate-200 rounded-b-xl p-3 overflow-y-auto custom-scrollbar">
              <div class="space-y-2">
                <div v-for="(topik, idx) in masterTopics" :key="idx" draggable="true" @dragstart="onDragStart(topik)"
                  class="group relative flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:border-blue-400 hover:shadow-md transition-all duration-200 select-none">
                  
                  <div class="mt-1 text-slate-300 group-hover:text-blue-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" /></svg>
                  </div>
                  
                  <span class="text-sm font-medium text-slate-700 group-hover:text-blue-700 leading-snug break-words w-full pr-1">
                    {{ topik }}
                  </span>

                  <div class="absolute inset-y-0 left-0 w-1 bg-blue-500 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-8 flex flex-col h-[600px]">
            <div class="bg-white rounded-t-xl border border-slate-200 border-b-0 p-4 flex justify-between items-end">
              <div>
                <h4 class="font-extrabold text-slate-600 text-xs uppercase tracking-wider">Mapping Area</h4>
                <p class="text-xs text-slate-400 mt-1">Pasangkan keyword dengan topik terkait</p>
              </div>
            </div>
            
            <div class="flex-1 bg-white border border-slate-200 rounded-b-xl p-4 overflow-y-auto custom-scrollbar bg-slate-50/50">
              <div class="space-y-4">
                <div v-for="(item, idx) in keywordMappings" :key="idx"
                  class="flex flex-col sm:flex-row bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                  
                  <div class="w-full sm:w-48 bg-slate-50 p-4 flex flex-col justify-center border-b sm:border-b-0 sm:border-r border-slate-100">
                    <span class="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Keyword</span>
                    <span class="font-bold text-slate-800 text-sm break-words">{{ item.keyword }}</span>
                  </div>

                  <div 
                    @dragover.prevent @drop="onDrop(idx)" 
                    @dragenter="dragOverIndex = idx" 
                    @dragleave="dragOverIndex = null"
                    :class="[
                      dragOverIndex === idx 
                        ? 'bg-blue-50 ring-inset ring-2 ring-blue-400' 
                        : 'bg-white'
                    ]"
                    class="relative flex-1 p-3 min-h-[80px] flex flex-wrap gap-2 items-center transition-all duration-200">
                    
                    <div v-if="item.topics.length === 0 && dragOverIndex !== idx" 
                      class="w-full h-full min-h-[50px] border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                      <span class="text-slate-400 text-xs font-medium flex items-center gap-2">
                        <span class="bg-slate-100 p-1 rounded text-[10px]">＋</span> Drop topik di sini
                      </span>
                    </div>

                    <div v-if="dragOverIndex === idx" class="absolute inset-0 flex items-center justify-center bg-blue-50/90 z-20 pointer-events-none">
                      <span class="text-blue-600 text-xs font-bold animate-pulse">Lepaskan Mouse!</span>
                    </div>

                    <div v-for="(tag, tIdx) in item.topics" :key="tIdx"
                      class="z-10 pl-3 pr-1 py-1.5 bg-white border border-slate-200 text-slate-700 rounded-lg shadow-sm flex items-center gap-2 group/tag hover:border-red-300 hover:shadow-md transition-all">
                      <span class="text-xs font-bold text-slate-600">{{ tag }}</span>
                      <button @click="removeTopicTag(idx, tIdx)" 
                        class="p-1 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <XMarkIcon class="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <TransitionRoot appear :show="isFaqModalOpen" as="template">
      <Dialog as="div" @close="closeFaqModal" class="relative z-50">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-bold text-slate-900">Panduan Penggunaan</DialogTitle>
              <div class="mt-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h5 class="font-bold text-blue-800 text-sm mb-2">💡 Tips Drag & Drop</h5>
                <p class="text-sm text-blue-700 leading-relaxed">
                  Klik dan tahan item <b>Topik</b> di panel kiri, lalu geser kursor ke kotak putus-putus di sebelah kanan <b>Keyword</b> yang diinginkan.
                </p>
              </div>
              <div class="mt-6 flex justify-end">
                <button type="button" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 text-sm" @click="closeFaqModal">Tutup</button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot appear :show="isAddModalOpen" as="template">
      <Dialog as="div" @close="closeAddModal" class="relative z-50">
        <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-2xl transition-all">
              <DialogTitle as="h3" class="text-xl font-bold text-slate-900 mb-1">Buat Project Baru</DialogTitle>
              <p class="text-sm text-slate-500 mb-6">Masukkan ID unik untuk project baru.</p>

              <div class="space-y-4">
                <div>
                  <label class="block text-xs font-bold text-slate-700 uppercase mb-2">ID Project</label>
                  <input type="text" v-model="newProjectId"
                    class="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Contoh: PROJECT-2025-Q1" @keyup.enter="confirmAddProject" />
                </div>
                <div class="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex gap-3">
                  <span class="text-yellow-600">ℹ️</span>
                  <p class="text-xs text-yellow-800">Setelah dibuat, ID akan otomatis terpilih dan Anda harus mengisi nilai threshold lalu menyimpannya.</p>
                </div>
              </div>

              <div class="mt-8 flex justify-end gap-3">
                <button type="button" class="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors" @click="closeAddModal">Batal</button>
                <button type="button" class="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg shadow-emerald-200 transition-all" @click="confirmAddProject">Buat Project</button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// --- CONFIGURATION & CONSTANTS ---
const API_BASE_URL = 'http://154.26.134.72:8438';
const thresholdDefinitions = ref([
  { label: 'BEFORE', color: 'bg-slate-400', textColor: 'text-white' },
  { label: 'EARLY', color: 'bg-emerald-400', textColor: 'text-white' },
  { label: 'EMERGING', color: 'bg-lime-400', textColor: 'text-white' },
  { label: 'CURRENT', color: 'bg-amber-400', textColor: 'text-white' },
  { label: 'CRISIS', color: 'bg-red-500', textColor: 'text-white' }
]);

// --- STATE MANAGEMENT ---
const selectedProject = ref('');
const availableProjects = ref([]);
const filteredProjects = ref([]);
const showDropdown = ref(false);
const projectInputRef = ref(null);
const quickAccessIds = ref(['27', '171', '235']);
const isEditMode = ref(false);

// --- FIX: GRID INITIALIZATION ---
// Fungsi helper untuk membuat array 55 item kosong
const createEmptyGrid = () => {
  const grid = [];
  for (let i = 0; i < 55; i++) grid.push({ value: '' });
  return grid;
};

// Inisialisasi ref LANGSUNG dengan data (Fix error "undefined reading value")
const thresholdGrid = ref(createEmptyGrid());

const initializeGrid = () => {
  thresholdGrid.value = createEmptyGrid();
};
// --------------------------------

// Modal States
const isFaqModalOpen = ref(false);
const isAddModalOpen = ref(false);
const newProjectId = ref('');

// Drag & Drop Data
const masterTopics = ref([
  "Kemdikdasmen", "Kemendikdasmen", "#PendidikanBermutuUntukSemua",
  "Pendidikan Vokasi", "Guru PPPK", "SPMB", "Program Indonesia Pintar",
  "Digitalisasi Pembelajaran", "KAI", "#RekanCommuters", "KAI121",
  "KAI Services", "Stasiun", "lrtjabodebek"
]);
const keywordMappings = ref([
  { keyword: "Abdul Mu'ti", topics: ["Kemdikdasmen", "Kemendikdasmen", "#PendidikanBermutuUntukSemua"] },
  { keyword: "Digitalisasi Pembelajaran", topics: ["Kemdikdasmen", "Digitalisasi Pembelajaran"] },
  { keyword: "Gaji Guru", topics: ["Guru PPPK"] },
  { keyword: "Kai Access", topics: ["KAI", "KAI121"] },
  { keyword: "Tes Drag Drop", topics: [] }
]);

// --- DRAG AND DROP LOGIC ---
const draggedTopic = ref(null);
const dragOverIndex = ref(null);

const onDragStart = (topic) => { draggedTopic.value = topic; };
const onDrop = (keywordIndex) => {
  if (draggedTopic.value) {
    const targetMapping = keywordMappings.value[keywordIndex];
    if (!targetMapping.topics.includes(draggedTopic.value)) {
      targetMapping.topics.push(draggedTopic.value);
    }
  }
  draggedTopic.value = null;
  dragOverIndex.value = null;
};
const removeTopicTag = (mappingIndex, topicIndex) => {
  keywordMappings.value[mappingIndex].topics.splice(topicIndex, 1);
};

// --- PROJECT MANAGEMENT LOGIC ---
const fetchUniqueTopics = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/all-unique-topics`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    availableProjects.value = data.topics || [];
    filteredProjects.value = availableProjects.value;
  } catch (error) { console.error(error); }
};

const searchProject = () => {
  const query = selectedProject.value.toLowerCase();
  showDropdown.value = true;
  if (!query) { filteredProjects.value = availableProjects.value; return; }
  filteredProjects.value = availableProjects.value.filter(p =>
    (p.id_project && p.id_project.toLowerCase().includes(query)) ||
    (p.topik && p.topik.toLowerCase().includes(query))
  );
};

const selectProject = (project) => {
  selectedProject.value = project.id_project;
  showDropdown.value = false;
  fetchThresholdData(project.id_project);
};

const selectQuickProject = (id) => {
  selectedProject.value = String(id);
  fetchThresholdData(id);
  showDropdown.value = false;
};

// --- THRESHOLD LOGIC ---
const fetchThresholdData = async (projectId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/threshold/${projectId}`);
    if (!response.ok) throw new Error('Err');
    const data = await response.json();

    if (!data.threshold || data.threshold.length === 0) {
      initializeGrid();
      isEditMode.value = false;
      return;
    }

    isEditMode.value = true;
    const thresholds = data.threshold;
    // Gunakan temporary array agar reaktivitas di-trigger sekali saja di akhir
    const newGrid = createEmptyGrid();

    for (let i = 0; i < 11; i++) {
      const rowData = thresholds[i] || {};
      // Mapping data ke index grid yang sesuai
      newGrid[i * 5].value = rowData.before ?? '';
      newGrid[i * 5 + 1].value = rowData.early ?? '';
      newGrid[i * 5 + 2].value = rowData.emerging ?? '';
      newGrid[i * 5 + 3].value = rowData.current ?? '';
      newGrid[i * 5 + 4].value = rowData.crisis ?? '';
    }

    thresholdGrid.value = newGrid;

  } catch (e) {
    initializeGrid(); 
    isEditMode.value = false;
  }
}

const saveRules = async () => {
  if (!selectedProject.value) return alert('Harap pilih Project ID terlebih dahulu!');

  const formatValue = (val) => {
    if (val === '' || val === null || val === undefined) return null;
    return Number(val);
  };

  const formattedThresholds = [];
  for (let i = 0; i < 11; i++) {
    const startIndex = i * 5;
    // Pastikan data ada sebelum akses property
    const gridItem = (idx) => thresholdGrid.value[idx] ? thresholdGrid.value[idx].value : '';
    
    const rowObj = {
      before: formatValue(gridItem(startIndex)),
      early: formatValue(gridItem(startIndex + 1)),
      emerging: formatValue(gridItem(startIndex + 2)),
      current: formatValue(gridItem(startIndex + 3)),
      crisis: formatValue(gridItem(startIndex + 4))
    };
    formattedThresholds.push(rowObj);
  }

  const payload = {
    tier: selectedProject.value,
    threshold: formattedThresholds
  };

  try {
    let url = `${API_BASE_URL}/threshold/create`;
    let method = 'POST';
    if (isEditMode.value) {
      url = `${API_BASE_URL}/threshold/update/${selectedProject.value}`;
      method = 'PUT';
    }

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      if (method === 'POST' && response.status === 400) {
        alert("Project ID ini sudah ada. Silakan refresh atau edit.");
      } else {
        throw new Error(result.detail || 'Gagal menyimpan');
      }
    } else {
      alert(`Berhasil ${isEditMode.value ? 'mengupdate' : 'membuat'} threshold!`);
      isEditMode.value = true;
    }
  } catch (error) { alert(`Error: ${error.message}`); }
};

const cancelChanges = () => {
  selectedProject.value = '';
  showDropdown.value = false;
  isEditMode.value = false;
  initializeGrid();
};

// --- MODAL HANDLERS ---
const openFaqModal = () => isFaqModalOpen.value = true;
const closeFaqModal = () => isFaqModalOpen.value = false;
const openAddModal = () => { newProjectId.value = ''; isAddModalOpen.value = true; };
const closeAddModal = () => isAddModalOpen.value = false;

const confirmAddProject = () => {
  if (!newProjectId.value.trim()) { alert("ID Project tidak boleh kosong!"); return; }
  
  const idToCheck = newProjectId.value.trim();
  
  // Cek apakah ID sudah ada di list project backend
  const exists = availableProjects.value.some(p => String(p.id_project).toLowerCase() === idToCheck.toLowerCase());

  if (exists) { alert(`ID Project "${idToCheck}" sudah ada!`); return; }

  // --- LOGIKA TAMBAHAN MULAI ---
  // Masukkan ID baru ke tombol Quick Access (paling depan)
  // Cek dulu biar ga duplikat di tombolnya
  if (!quickAccessIds.value.includes(idToCheck)) {
    quickAccessIds.value.unshift(idToCheck); // .unshift menambah ke urutan pertama
    
    // (Opsional) Batasi max 5 tombol biar UI ga berantakan
    if (quickAccessIds.value.length > 5) {
      quickAccessIds.value.pop(); // Hapus yang paling lama (terakhir)
    }
  }
  // --- LOGIKA TAMBAHAN SELESAI ---

  selectedProject.value = idToCheck;
  isEditMode.value = false;
  initializeGrid();
  closeAddModal();
  showDropdown.value = false;
};

// --- LIFECYCLE & WATCHERS ---
watch(selectedProject, (n) => { if (!n) initializeGrid(); });
const handleClickOutside = (event) => { if (projectInputRef.value && !projectInputRef.value.contains(event.target)) showDropdown.value = false; };

onMounted(() => {
  // initializeGrid(); // TIDAK PERLU LAGI karena sudah di-init saat deklarasi ref
  fetchUniqueTopics();
  document.addEventListener('click', handleClickOutside);
});
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside));
</script>

<style scoped>
/* Hide Number Arrows */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #94a3b8;
}
</style>