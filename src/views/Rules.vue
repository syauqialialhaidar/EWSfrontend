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

            <div class="relative">
                <!-- Loading Overlay -->
                <div v-if="isLoadingThreshold"
                    class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
                    <div class="text-center">
                        <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
                        <p class="text-sm font-semibold text-gray-600">Memuat data threshold...</p>
                    </div>
                </div>

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
                        <input type="number" v-model="cell.value" :disabled="isLoadingThreshold"
                            class="w-full bg-gray-200 border-none font-bold text-gray-600 rounded-lg h-10 text-center focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex justify-end items-center space-x-4 mt-10">
            <button @click="cancelChanges" :disabled="isSaving"
                class="px-10 py-2.5 text-sm font-bold text-gray-800 bg-gray-300 hover:bg-gray-400 rounded-lg focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                Batal
            </button>
            <button @click="saveRules" :disabled="isSaving || isLoadingThreshold"
                class="px-8 py-2.5 text-sm font-bold text-white bg-green-500 hover:bg-green-600 rounded-lg focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                <span v-if="isSaving" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
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

// ===================================
// COMPOSABLES & API
// ===================================
import { useApi } from '@/composables/useApi'
import { ewsApi } from '@/api/ews.api'
import { logger } from '@/utils/logger'

const {
  loading: isLoadingProjects,
  error: projectsError,
  execute: executeProjectsApi
} = useApi()

const {
  loading: isLoadingThreshold,
  error: thresholdError,
  execute: executeThresholdApi
} = useApi()

const {
  loading: isSaving,
  error: saveError,
  execute: executeSaveApi
} = useApi()

// ===================================
// STATE MANAGEMENT
// ===================================
// Modal FAQ
const isFaqModalOpen = ref(false);

// Project Search
const selectedProject = ref('');
const availableProjects = ref([]);
const filteredProjects = ref([]);
const showDropdown = ref(false);
const projectInputRef = ref(null);

// Threshold Grid
const thresholdDefinitions = ref([
    { label: 'NORMAL', color: 'bg-[#2092EC]', textColor: 'text-white' },
    { label: 'EARLY', color: 'bg-[#28C76F]', textColor: 'text-white' },
    { label: 'EMERGING', color: 'bg-[#AAD816]', textColor: 'text-white' },
    { label: 'CURRENT', color: 'bg-[#FF9900]', textColor: 'text-white' },
    { label: 'CRISIS', color: 'bg-[#E60000]', textColor: 'text-white' }
]);
const thresholdGrid = ref([]);

// ===================================
// UTILITY FUNCTIONS
// ===================================
const initializeGrid = () => {
    const newGrid = [];
    for (let i = 0; i < 50; i++) {
        newGrid.push({ value: '' });
    }
    thresholdGrid.value = newGrid;
};

// ===================================
// API FUNCTIONS (WITH ERROR HANDLING!)
// ===================================
const fetchUniqueTopics = async () => {
    await executeProjectsApi(
        async () => {
            const data = await ewsApi.topics.getAllUniqueTopics()
            availableProjects.value = data.topics || []
            filteredProjects.value = availableProjects.value
            logger.info('Rules', 'Loaded unique topics:', data.topics?.length || 0)
        },
        {
            showErrorNotification: true,
            onError: () => {
                availableProjects.value = []
                filteredProjects.value = []
            }
        }
    )
}

const fetchThresholdData = async (projectId) => {
    await executeThresholdApi(
        async () => {
            const data = await ewsApi.topics.getThreshold(projectId)
            const thresholds = data.threshold || []
            const newGrid = []

            thresholds.forEach((item, index) => {
                if (index === 0 && item.before === null) {
                    newGrid.push({ value: 0 })
                    newGrid.push({ value: item.early })
                    newGrid.push({ value: item.emerging })
                    newGrid.push({ value: item.current })
                    newGrid.push({ value: item.crisis })
                } else if (item.before !== undefined) {
                    newGrid.push({ value: item.before })
                    newGrid.push({ value: item.early })
                    newGrid.push({ value: item.emerging })
                    newGrid.push({ value: item.current })
                    newGrid.push({ value: item.crisis })
                }
            })

            while (newGrid.length < 50) {
                newGrid.push({ value: '' })
            }

            thresholdGrid.value = newGrid.slice(0, 50)
            logger.info('Rules', `Loaded threshold for project: ${projectId}`)
        },
        {
            showErrorNotification: true,
            onError: () => {
                initializeGrid()
            }
        }
    )
}

const saveRulesToBackend = async () => {
    // Validations
    if (!selectedProject.value) {
        logger.warn('Rules', 'No project selected')
        return
    }

    const hasData = thresholdGrid.value.some(cell => cell.value !== '' && cell.value !== null)
    if (!hasData) {
        logger.warn('Rules', 'No threshold data filled')
        return
    }

    await executeSaveApi(
        async () => {
            // Transform grid data
            const thresholdRows = []
            for (let i = 0; i < 50; i += 5) {
                const row = thresholdGrid.value.slice(i, i + 5)
                if (row.some(cell => cell.value !== '' && cell.value !== null)) {
                    thresholdRows.push({
                        before: row[0].value === '' ? null : Number(row[0].value),
                        early: row[1].value === '' ? null : Number(row[1].value),
                        emerging: row[2].value === '' ? null : Number(row[2].value),
                        current: row[3].value === '' ? null : Number(row[3].value),
                        crisis: row[4].value === '' ? null : Number(row[4].value)
                    })
                }
            }

            const payload = {
                id_project: selectedProject.value,
                threshold: thresholdRows
            }

            logger.debug('Rules', 'Saving threshold:', payload)

            const result = await ewsApi.topics.saveThreshold(payload)

            logger.info('Rules', 'Threshold saved successfully')
            return result
        },
        {
            showErrorNotification: true,
            showSuccessNotification: true,
            successMessage: 'Rules berhasil disimpan!'
        }
    )
}

// ===================================
// EVENT HANDLERS
// ===================================
const searchProject = () => {
    const query = selectedProject.value.toLowerCase();
    showDropdown.value = true;

    if (!query) {
        filteredProjects.value = availableProjects.value;
        return;
    }

    filteredProjects.value = availableProjects.value.filter(project => {
        const idMatch = project.id_project && project.id_project.toLowerCase().includes(query);
        const topicMatch = project.topik && project.topik.toLowerCase().includes(query);
        return idMatch || topicMatch;
    });
};

const selectProject = (project) => {
    selectedProject.value = project.id_project;
    showDropdown.value = false;
    console.log(`Project dipilih: ID=${project.id_project}, Topik=${project.topik}`);
    fetchThresholdData(project.id_project);
};

const handleClickOutside = (event) => {
    if (projectInputRef.value && !projectInputRef.value.contains(event.target)) {
        showDropdown.value = false;
    }
};

const cancelChanges = () => {
    if (confirm('Anda yakin ingin membatalkan perubahan?')) {
        selectedProject.value = '';
        showDropdown.value = false;
        initializeGrid();
    }
};

const saveRules = () => {
    saveRulesToBackend();
};

const closeFaqModal = () => {
    isFaqModalOpen.value = false;
};

const openFaqModal = () => {
    isFaqModalOpen.value = true;
};

// ===================================
// WATCHERS
// ===================================
watch(selectedProject, (newProjectId) => {
    if (!newProjectId) {
        initializeGrid();
    }
});

// ===================================
// LIFECYCLE HOOKS
// ===================================
onMounted(() => {
    initializeGrid();
    fetchUniqueTopics();
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
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

/* Loader Animation */
.loader {
    border-top-color: #3B82F6;
    animation: spinner 1.5s linear infinite;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>