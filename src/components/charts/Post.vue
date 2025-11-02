<template>
    <div class="space-y-6">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="card in summaryStatistics" :key="card.key"
                class="bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="border border-gray-400 rounded-lg p-4 flex items-center justify-center h-full">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                                <path d="M2 22 H 22" stroke="#B3BECE" stroke-width="3" stroke-linecap="round" />
                                <rect x="4" y="12" width="4" height="7" rx="1" fill="#B3BECE" />
                                <rect x="10" y="8" width="4" height="11" rx="1" fill="#B3BECE" />
                                <rect x="16" y="4" width="4" height="15" rx="1" fill="#03255C" />
                            </svg>
                            <div>
                                <div v-if="isLoading[card.key]" class="text-gray-500">Memuat...</div>
                                <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal</div>
                                <div v-else-if="card.apiData" class="flex items-center gap-2">
                                    <span class="text-3xl font-bold text-[#03255C]">
                                        {{ card.apiData.total }}
                                    </span>
                                </div>
                                <p class="font-poppins text-sm text-[#03255C] font-bold mt-1">
                                    {{ card.totalTitle }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="border border-gray-400 rounded-lg p-4 flex items-center justify-center h-full">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                                <path d="M2 22 H 22" stroke="#F8B3B3" stroke-width="3" stroke-linecap="round" />
                                <rect x="4" y="12" width="4" height="7" rx="1" fill="#F8B3B3" />
                                <rect x="10" y="8" width="4" height="11" rx="1" fill="#F8B3B3" />
                                <rect x="16" y="4" width="4" height="15" rx="1" fill="#E60000" />
                            </svg>
                            <div>
                                <div v-if="isLoading[card.key]" class="text-gray-500">Memuat...</div>
                                <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal</div>
                                <div v-else-if="card.apiData" class="flex items-center gap-2">
                                    <span class="text-3xl font-bold text-red-600">
                                        {{ card.apiData.negative }}
                                    </span>
                                </div>
                                <p :class="['text-sm font-semibold mt-1', card.negativeTextClass]">
                                    {{ card.negativeTitle }}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="h-48 w-full flex justify-center items-center">
                    <div v-if="isLoading[card.key]" class="text-gray-500">Memuat chart...</div>
                    <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal memuat chart</div>
                    <Pie v-else-if="card.apiData && card.apiData.total > 0" :data="card.chartData"
                        :options="chartOptions" />
                    <div v-else class="text-gray-500">Tidak ada data untuk ditampilkan</div>
                </div>
            </div>
        </div>

        <div>
            <h3 class="text-xl font-bold text-[#03255C]">Recently In & Viral</h3>
            <p class="text-lg font-semibold text-[#03255C]">status, topik, terkini</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-if="isLoading.analysis" class="text-gray-500 col-span-5 text-center">Memuat status posts...</div>
            <div v-else-if="error.analysis" class="text-red-500 col-span-5 text-center">Gagal memuat status posts: {{
                error.analysis }}</div>

            <div v-else v-for="card in analysisCards" :key="card.title" :class="[card.bgColor,
                'p-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 text-white flex flex-col justify-center items-center aspect-square md:aspect-auto md:h-40'
            ]">
                <p class="text-base font-medium text-center">{{ card.title }}</p>
                <span class="text-5xl font-bold">{{ card.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed, watch } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

import { filters } from '@/stores/filterStore.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// State
const totalApiData = ref(null);
const viralApiData = ref(null);
// TAMBAHAN: State untuk data status posts
const statusApiData = ref(null);

const analysisApiData = ref(null);

// Memperbarui reactive state untuk loading dan error
const isLoading = reactive({ total: true, viral: true, status: true, analysis: true });
const error = reactive({ total: null, viral: null, status: null, analysis: null });

// ... Chart data (leftChartData dan rightChartData) TIDAK BERUBAH ...
const leftChartData = ref({
    labels: ['Positif', 'Negatif', 'Netral'], // Diperbarui untuk 3 sentimen
    datasets: [{
        backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'], // Diperbarui untuk 3 sentimen
        data: [],
        borderWidth: 3,
        borderColor: '#ffffff'
    }]
});
const rightChartData = ref({
    labels: ['Post Normal', 'Post Viral', 'Negatif Viral'],
    datasets: [{
        backgroundColor: ['#22c55e', '#ef4444', '#3b82f6'],
        data: [],
        borderWidth: 3,
        borderColor: '#ffffff'
    }]
});

// Computed property summaryStatistics (TIDAK BERUBAH)
const summaryStatistics = computed(() => [
    {
        key: 'total',
        apiData: totalApiData.value,
        chartData: leftChartData.value,
        totalTitle: 'Total Post Keseluruhan',
        totalTitleClass: 'text-[#03255C] text-lg font-bold',
        negativeTitle: 'Total Post Negatif',
        negativeTextClass: 'text-[#E60000] text-lg font-bold'
    },
    {
        key: 'viral',
        apiData: viralApiData.value,
        chartData: rightChartData.value,
        totalTitle: 'Total Post Viral',
        totalTitleClass: 'text-[#03255C] text-lg font-bold',
        negativeTitle: 'Total Post Negatif Viral',
        negativeTextClass: 'text-[#E60000] text-lg font-bold'
    }
]);

// FUNGSI BARU: Memetakan data status API ke format kartu tampilan
const statusCards = computed(() => {
    // Jika data API belum siap, kembalikan array kosong
    if (!statusApiData.value || !statusApiData.value.distribution) return [];

    const colorMap = {
        'normal': 'bg-[#2092EC]',
        'early': 'bg-[#28C76F]',
        'emerging': 'bg-[#AAD816]',
        'current': 'bg-[#FF9900]',
        'crisis': 'bg-[#E60000]',
    };

    const titleMap = {
        'normal': 'Total Normal Posts',
        'early': 'Total Early Posts',
        'emerging': 'Total Emerging Posts',
        'current': 'Total Current Posts',
        'crisis': 'Total Crisis Posts',
    };

    // Ini adalah daftar semua status yang HARUS selalu ditampilkan
    const desiredOrder = ['normal', 'early', 'emerging', 'current', 'crisis'];

    // LOGIKA BARU:
    // Kita akan melakukan map pada `desiredOrder`, bukan pada data API.
    // Ini memastikan kelima kartu selalu dibuat.
    return desiredOrder.map(status => {
        // Cari data untuk status saat ini dari respons API
        const apiItem = statusApiData.value.distribution.find(item => item.status === status);

        // Jika data dari API ditemukan, gunakan 'count'-nya. Jika tidak, nilainya adalah 0.
        const count = apiItem ? apiItem.count : 0;

        // Buat objek kartu
        return {
            title: titleMap[status] || status,
            value: count,
            bgColor: colorMap[status] || 'bg-gray-400',
        };
    });
});


async function fetchTotalData(startDate, endDate) {
    let totalPostsData = null;
    let sentimentData = null;
    try {
        // DIUBAH: Endpoint diubah ke /total-unique-posts
        const totalUrl = `http://127.0.0.1:8000/total-unique-posts?start_date=${startDate}&end_date=${endDate}`;
        const sentimentUrl = `http://127.0.0.1:8000/sentiment-distribution?start_date=${startDate}&end_date=${endDate}`;

        const totalResponse = await fetch(totalUrl);
        // DIUBAH: Pesan error disesuaikan (opsional, tapi praktik yang baik)
        if (!totalResponse.ok) throw new Error(`HTTP error fetching total unique posts! status: ${totalResponse.status}`);
        totalPostsData = await totalResponse.json();

        const sentimentResponse = await fetch(sentimentUrl);
        if (!sentimentResponse.ok) throw new Error(`HTTP error fetching sentiment! status: ${sentimentResponse.status}`);
        sentimentData = await sentimentResponse.json();

        const sentiment = sentimentData.sentiment_distribution;
        totalApiData.value = {
            // DIUBAH: Kunci respons disesuaikan dari total_posts menjadi total_unique_posts
            total: totalPostsData.total_unique_posts,
            negative: sentiment.negative,
            positive: sentiment.positive,
            neutral: sentiment.neutral
        };
        leftChartData.value.datasets[0].data = [sentiment.positive, sentiment.negative, sentiment.neutral];
    } catch (err) {
        console.error("Gagal memuat data total/sentimen:", err);
        error.total = err.message;
    } finally {
        isLoading.total = false;
    }
}

async function fetchViralData(startDate, endDate) {
    try {
        const url = `http://127.0.0.1:8000/viral-posts?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const totalViral = data.total_viral_posts;
        const normalPosts = data.by_status.normal;
        viralApiData.value = {
            total: totalViral,
            negative: 0,
            normal: normalPosts,
            viral: totalViral
        };
        rightChartData.value.datasets[0].data = [normalPosts, totalViral, 0];
    } catch (err) {
        console.error("Gagal memuat data viral:", err);
        error.viral = err.message;
    } finally {
        isLoading.viral = false;
    }
}

async function fetchStatusData(startDate, endDate) {
    try {
        const url = `http://127.0.0.1:8000/status-distribution?start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        statusApiData.value = data;
    } catch (err) {
        console.error("Gagal memuat data status:", err);
        error.status = err.message;
    } finally {
        isLoading.status = false;
    }
}



async function fetchAnalysisData(startDate, endDate) {
    isLoading.analysis = true; // Pastikan 'analysis' ada di state isLoading
    try {
        const url = `http://127.0.0.1:8000/analysis-summary?topic=all&start_date=${startDate}&end_date=${endDate}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        analysisApiData.value = data; // Simpan ke state BARU
    } catch (err) {
        console.error("Gagal memuat data analysis summary:", err);
        error.analysis = err.message; // Pastikan 'analysis' ada di state error
    } finally {
        isLoading.analysis = false;
    }
}

// 3. TAMBAHKAN COMPUTED PROPERTY BARU
const analysisCards = computed(() => {
    // Cek state BARU
    if (!analysisApiData.value) return [];

    const colorMap = {
        'normal': 'bg-blue-500', // Warna dibedakan agar terlihat bedanya
        'early': 'bg-green-500',
        'emerging': 'bg-yellow-500',
        'current': 'bg-orange-500',
        'crisis': 'bg-red-600',
    };

    const titleMap = {
        'normal': 'Analysis Normal', // Judul dibedakan
        'early': 'Analysis Early',
        'emerging': 'Analysis Emerging',
        'current': 'Analysis Current',
        'crisis': 'Analysis Crisis',
    };

    const desiredOrder = ['normal', 'early', 'emerging', 'current', 'crisis'];

    return desiredOrder.map(status => {
        // Ambil data 'count' langsung dari objek
        const count = analysisApiData.value[status] || 0;

        return {
            title: titleMap[status] || status,
            value: count,
            bgColor: colorMap[status] || 'bg-gray-400',
        };
    });
});



// 4. BUAT FUNGSI BARU untuk memuat semua data sekaligus
function loadAllData() {
    // Set status loading sebelum fetch
    isLoading.total = true;
    isLoading.viral = true;
    isLoading.status = true;
    isLoading.analysis = true;

    // Panggil semua fungsi fetch dengan tanggal dari store
    fetchTotalData(filters.startDate, filters.endDate);
    fetchViralData(filters.startDate, filters.endDate);
    fetchStatusData(filters.startDate, filters.endDate);
    fetchAnalysisData(filters.startDate, filters.endDate);
}

// 5. GUNAKAN 'watch' untuk memanggil loadAllData setiap kali tanggal di store berubah
watch(filters, (newFilters) => {
    console.log(`Filter tanggal berubah ke: ${newFilters.startDate} - ${newFilters.endDate}. Memuat ulang data Post.vue...`);
    loadAllData();
});

// 6. onMounted sekarang hanya memanggil loadAllData untuk pemuatan awal
onMounted(() => {
    console.log('Komponen Post.vue dimuat, mengambil data awal...');
    loadAllData();
});

// ... chartOptions (TIDAK BERUBAH) ...
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        tooltip: {
            callbacks: {
                label: function (context) {
                    let label = context.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed !== null) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.parsed;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                        label += `${value} (${percentage})`;
                    }
                    return label;
                }
            }
        },
        legend: {
            position: 'bottom',
            labels: { usePointStyle: true, boxWidth: 8, padding: 20 }
        }
    }
};

// MENGHAPUS array summaryCards yang statis dan menggantinya dengan computed property statusCards di atas.
</script>

<style scoped>
.loader {
    border-top-color: #3498db;
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

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
}
</style>