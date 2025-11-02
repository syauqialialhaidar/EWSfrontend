<template>
    <div class="bg-white rounded-2xl p-12 shadow-lg max-full mx-auto">

        <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-bold text-black">Atur Rules</h3>
        </div>

        <div class="">

            <div class="flex items-center space-x-4 mb-6">

                <div class="w-80">
                    <div class="relative" ref="projectInputRef">
                        <div class="relative">
                            <div
                                class="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-opacity-75 sm:text-sm shadow-md hover:shadow-lg transition-all duration-200">
                                <input
                                    class="w-full border-none py-2.5 pl-10 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                                    v-model="selectedProject" @input="searchProject" @focus="showDropdown = true"
                                    placeholder="Cari atau masukkan ID Project..." />

                                <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </span>
                            </div>

                            <div v-if="showDropdown && filteredProjects.length > 0"
                                class="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 overflow-auto">
                                <ul class="py-1 text-base">
                                    <li v-for="(project, index) in filteredProjects" :key="index"
                                        @click="selectProject(project)"
                                        class="cursor-default select-none relative py-2 pl-10 pr-4 hover:bg-blue-100 hover:text-blue-900">

                                        <div class="text-sm font-medium text-gray-900 truncate">
                                            {{ project.id_project }}
                                        </div>
                                        <div class="text-xs text-gray-500 truncate">
                                            Topik: {{ project.topik }}
                                        </div>

                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>

                <button @click="openFaqModal"
                    class="px-5 bg-gray-300 text-gray-800 font-semibold rounded-lg text-sm hover:bg-gray-400 transition-colors focus:outline-none h-11">
                    FAQ
                </button>

            </div>

            <div>
                <div class="grid grid-cols-5 gap-2 mb-2">
                    <div v-for="def in thresholdDefinitions" :key="def.label" class="text-center">
                        <span :class="[def.color, def.textColor]"
                            class="inline-block text-lg text-center w-full h-10 font-bold px-4 py-1.5 rounded-md w-full">
                            {{ def.label }}
                        </span>
                    </div>
                </div>
                <div class="grid grid-cols-5 gap-4">
                    <div v-for="(cell, index) in thresholdGrid" :key="index" class="text-center">
                        <input type="number" v-model="cell.value"
                            class="w-full bg-gray-200 border-none font-bold text-gray-600 rounded-lg h-10 text-center focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center space-x-4 mt-10">
            <button @click="cancelChanges"
                class="px-10 py-2.5 text-sm font-bold text-gray-800 bg-gray-300 hover:bg-gray-400 rounded-lg focus:outline-none transition-colors">
                Batal
            </button>
            <button @click="saveRules"
                class="px-8 py-2.5 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg focus:outline-none transition-colors">
                Simpan
            </button>
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
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue'; // Tambahkan onBeforeUnmount
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