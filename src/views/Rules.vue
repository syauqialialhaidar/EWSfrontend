<template>
    <div class="bg-white rounded-2xl p-8 shadow-lg max-w-6xl mx-auto">

        <div class="flex items-center justify-between mb-8">
            <div>
                <h3 class="text-3xl font-bold text-[#03255C]">Konfigurasi Rules Threshold</h3>
                <p class="text-sm text-gray-500 mt-1">Atur threshold untuk setiap status berdasarkan project</p>
            </div>
            <button @click="openFaqModal"
                class="px-6 py-2.5 bg-blue-100 text-blue-700 font-semibold rounded-lg text-sm hover:bg-blue-200 transition-colors focus:outline-none flex items-center gap-2">
                <span class="text-lg">?</span> FAQ
            </button>
        </div>

        <div class="mb-8">
            <label class="block text-sm font-semibold text-gray-700 mb-2">Pilih Project</label>
            <div class="relative max-w-md" ref="projectInputRef">
                <div class="relative">
                    <div
                        class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border-2 border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
                        <input
                            class="w-full border-none py-3 pl-11 pr-4 text-sm text-gray-900 focus:ring-0 focus:outline-none"
                            v-model="selectedProject" @input="searchProject" @focus="showDropdown = true"
                            placeholder="Ketik untuk mencari ID Project atau Topik..." />

                        <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </span>
                    </div>

                    <div v-if="showDropdown && filteredProjects.length > 0"
                        class="absolute z-10 mt-2 w-full rounded-lg bg-white shadow-xl max-h-64 ring-1 ring-gray-200 overflow-auto">
                        <ul class="py-2">
                            <li v-for="(project, index) in filteredProjects" :key="index"
                                @click="selectProject(project)"
                                class="cursor-pointer select-none px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0">

                                <div class="text-sm font-semibold text-gray-900">
                                    {{ project.id_project }}
                                </div>
                                <div class="text-xs text-gray-500 mt-0.5">
                                    Topik: {{ project.topik }}
                                </div>

                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
            <h4 class="text-lg font-bold text-[#03255C] mb-4">Threshold Values</h4>

            <div class="bg-white rounded-lg p-4 shadow-sm">
                <div class="grid grid-cols-5 gap-3 mb-3">
                    <div v-for="def in thresholdDefinitions" :key="def.label" class="text-center">
                        <div :class="[def.color, def.textColor]"
                            class="inline-flex items-center justify-center text-sm font-bold px-4 py-2.5 rounded-lg w-full shadow-sm">
                            {{ def.label }}
                        </div>
                    </div>
                </div>

                <div class="space-y-2">
                    <div v-for="row in 10" :key="row" class="grid grid-cols-5 gap-3">
                        <div v-for="col in 5" :key="col" class="text-center">
                            <input type="number" v-model="thresholdGrid[(row - 1) * 5 + (col - 1)].value"
                                class="w-full bg-gray-50 border-2 border-gray-200 font-semibold text-gray-700 rounded-lg h-11 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all hover:bg-gray-100"
                                :placeholder="`R${row}C${col}`" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <div class="text-sm text-gray-500">
                <span class="font-semibold">Project:</span> {{ selectedProject || 'Belum dipilih' }}
            </div>
            <div class="flex items-center gap-3">
                <button @click="cancelChanges"
                    class="px-8 py-3 text-sm font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all">
                    Batal
                </button>
                <button @click="saveRules"
                    class="px-8 py-3 text-sm font-bold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition-all shadow-md">
                    Simpan Rules
                </button>
            </div>
        </div>

        <TransitionRoot appear :show="isFaqModalOpen" as="template">
            <Dialog as="div" @close="closeFaqModal" class="relative z-50">

                <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0"
                    enter-to="opacity-100" leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
                    <div class="fixed inset-0 bg-black bg-opacity-50" />
                </TransitionChild>

                <div class="fixed inset-0 overflow-y-auto">
                    <div class="flex min-h-full items-center justify-center p-4 text-center">
                        <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
                            enter-to="opacity-100 scale-100" leave="duration-200 ease-in"
                            leave-from="opacity-100 scale-100" leave-to="opacity-0 scale-95">
                            <DialogPanel
                                class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">

                                <div class="flex items-center justify-between">
                                    <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                                        Frequently Asked Questions (FAQ)
                                    </DialogTitle>
                                    <button @click="closeFaqModal"
                                        class="text-gray-400 hover:text-gray-600 focus:outline-none">
                                        <span class="sr-only">Tutup</span>
                                        <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                <div class="mt-4">
                                    <p class="text-sm text-gray-600">
                                        Ini adalah tempat untuk konten FAQ Anda.
                                        <br /><br />
                                        <strong>Q: Apa fungsi halaman ini?</strong><br />
                                        A: Halaman ini berfungsi untuk mengatur nilai threshold untuk setiap project
                                        yang dipilih.
                                        <br /><br />
                                        <strong>Q: Bagaimana cara menyimpan?</strong><br />
                                        A: Cari atau masukkan **ID Project** pada kolom pencarian, isi nilai-nilai pada
                                        grid, lalu klik tombol "Simpan".
                                    </p>
                                </div>

                                <div class="mt-6 flex justify-end">
                                    <button type="button"
                                        class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                                        @click="closeFaqModal">
                                        Mengerti
                                    </button>
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </TransitionRoot>

    </div>
</template>


<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    TransitionRoot,
    TransitionChild,
} from '@headlessui/vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/24/outline'

// --- State untuk Modal FAQ ---
const isFaqModalOpen = ref(false)
// ... (closeFaqModal, openFaqModal) ...
function closeFaqModal() {
    isFaqModalOpen.value = false
}
function openFaqModal() {
    isFaqModalOpen.value = true
}

// --- State Pencarian Proyek ---
const selectedProject = ref('');
const availableProjects = ref([]);
const filteredProjects = ref([]);
const showDropdown = ref(false);

// Tambahkan ref untuk elemen DOM input/dropdown
const projectInputRef = ref(null);


// Fungsi untuk memuat data unik topik + ID Project dari API
const fetchUniqueTopics = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/all-unique-topics');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        availableProjects.value = data.topics || [];
        filteredProjects.value = availableProjects.value;
    } catch (error) {
        console.error("Gagal memuat topik unik:", error);
    }
};


// Fungsi pencarian yang dipanggil saat input berubah
const searchProject = () => {
    const query = selectedProject.value.toLowerCase();
    showDropdown.value = true; // Selalu tampilkan dropdown saat mengetik

    if (!query) {
        filteredProjects.value = availableProjects.value;
        return;
    }

    // Filter berdasarkan id_project ATAU topik
    filteredProjects.value = availableProjects.value.filter(project => {
        const idMatch = project.id_project && project.id_project.toLowerCase().includes(query);
        const topicMatch = project.topik && project.topik.toLowerCase().includes(query);
        return idMatch || topicMatch;
    });
};

// Fungsi yang dipanggil saat user memilih dari dropdown
// --- Fungsi baru untuk memuat threshold ---
const fetchThresholdData = async (projectId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/threshold/${projectId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Ambil array threshold. Ini mungkin array kosong jika tidak ada data.
        const thresholds = data.threshold || [];
        
        const newGrid = [];
        
        // Asumsi: Kita hanya menampilkan nilai persentase (early, emerging, current, crisis)
        // dan mengabaikan threshold awal (yg before: null) dan nilai before-nya sendiri
        
        // Urutan kolom: NORMAL, EARLY, EMERGING, CURRENT, CRISIS
        const keys = ['before', 'early', 'emerging', 'current', 'crisis']; // Gunakan 'before' untuk kolom pertama (NORMAL)

        // Kita akan loop melalui threshold yang ada
        thresholds.forEach((item, index) => {
            // Kita hanya mengisi 5 kolom (NORMAL, EARLY, EMERGING, CURRENT, CRISIS)
            // Normal (index 0) adalah batas bawah (sebelum EARLY)
            // Jika item pertama (index 0) adalah threshold awal (before: null)
            if (index === 0 && item.before === null) {
                // Baris pertama (Threshold Awal - Engagement Absolut)
                newGrid.push({ value: 0 }); // NORMAL dimulai dari 0
                newGrid.push({ value: item.early });
                newGrid.push({ value: item.emerging });
                newGrid.push({ value: item.current });
                newGrid.push({ value: item.crisis });
            } 
            // Threshold Persentase
            else if (item.before !== undefined) { 
                // NORMAL di baris ini adalah nilai 'before' dari threshold
                newGrid.push({ value: item.before }); // Threshold batas Bawah Engagement
                newGrid.push({ value: item.early });  // Persentase EARLY
                newGrid.push({ value: item.emerging }); // Persentase EMERGING
                newGrid.push({ value: item.current });  // Persentase CURRENT
                newGrid.push({ value: item.crisis });   // Persentase CRISIS
            }
            // Lanjutkan hingga grid terisi (jika data threshold < 10 baris)
        });


        // Isi sisa grid dengan nilai kosong (jika threshold yang ditemukan kurang dari 10 baris * 5 kolom)
        while (newGrid.length < 50) {
            newGrid.push({ value: '' });
        }
        
        // Ambil hanya 50 sel pertama jika terlalu banyak
        thresholdGrid.value = newGrid.slice(0, 50);

    } catch (error) {
        console.error("Gagal memuat data threshold:", error);
        alert("Gagal memuat data threshold. Grid diinisialisasi kosong.");
        initializeGrid();
    }
}


const selectProject = (project) => {
    // 1. Menetapkan ID Project yang dipilih ke input
    selectedProject.value = project.id_project;
    showDropdown.value = false; // Sembunyikan dropdown setelah memilih

    console.log(`Project dipilih: ID=${project.id_project}, Topik=${project.topik}`);
    
    // 2. Panggil fungsi untuk memuat data threshold
    fetchThresholdData(project.id_project);
};

// Pastikan Anda juga memodifikasi Watcher (jika Anda ingin memuat data saat mengetik ID)
watch(selectedProject, (newProjectId) => {
    if (!newProjectId) {
        initializeGrid();
    } else {
        // Jika ID Project diketik dan sudah lengkap (misalnya 5 karakter), 
        // Anda bisa memicu pemuatan data di sini juga
        // fetchThresholdData(newProjectId); // Optional: Aktifkan jika ingin auto-load saat mengetik
    }
    console.log(`Input Project ID berubah: ${newProjectId}`);
});

// =======================================================
// LOGIKA AUTO-HIDE DROPDOWN
// =======================================================

// Handler untuk mendeteksi klik di luar area input/dropdown
const handleClickOutside = (event) => {
    // Cek apakah elemen yang diklik BUKAN merupakan bagian dari div input/dropdown
    if (projectInputRef.value && !projectInputRef.value.contains(event.target)) {
        showDropdown.value = false;
    }
};

onMounted(() => {
    fetchUniqueTopics();
    // Tambahkan event listener saat komponen dimuat
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    // Hapus event listener saat komponen dihancurkan
    document.removeEventListener('click', handleClickOutside);
});
// =======================================================

// --- State Grid Thresholds ---
const thresholdDefinitions = ref([
    { label: 'NORMAL', color: 'bg-[#2092EC]', textColor: 'text-white' },
    { label: 'EARLY', color: 'bg-[#28C76F]', textColor: 'text-white' },
    { label: 'EMERGING', color: 'bg-[#AAD816]', textColor: 'text-white' },
    { label: 'CURRENT', color: 'bg-[#FF9900]', textColor: 'text-white' },
    { label: 'CRISIS', color: 'bg-[#E60000]', textColor: 'text-white' }
]);

const thresholdGrid = ref([]);

// Fungsi untuk inisialisasi grid (mengisi 50 sel kosong)
const initializeGrid = () => {
    const newGrid = [];
    for (let i = 0; i < 50; i++) {
        newGrid.push({ value: '' });
    }
    thresholdGrid.value = newGrid;
};

initializeGrid();

// Watcher untuk membersihkan grid jika input project dikosongkan
watch(selectedProject, (newProjectId) => {
    if (!newProjectId) {
        initializeGrid();
    }
    console.log(`Input Project ID berubah: ${newProjectId}`);
});

// Fungsi untuk tombol "Batal"
const cancelChanges = () => {
    selectedProject.value = '';
    showDropdown.value = false;
    console.log('Perubahan dibatalkan');
};

// Fungsi untuk tombol "Simpan"
const saveRules = () => {
    if (!selectedProject.value) {
        alert('Harap masukkan atau cari Project ID terlebih dahulu.');
        return;
    }
    const ruleData = {
        projectId: selectedProject.value,
        thresholdValues: thresholdGrid.value.map(cell => cell.value)
    };
    console.log('Data yang akan disimpan:', ruleData);
    alert('Rules berhasil disimpan!');
};




</script>

<style scoped>
/* Sembunyikan panah di Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Sembunyikan panah di Firefox */
input[type=number] {
    -moz-appearance: textfield;
}
</style>


<style scoped>
/* Sembunyikan panah di Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Sembunyikan panah di Firefox */
input[type=number] {
    -moz-appearance: textfield;
}
</style>