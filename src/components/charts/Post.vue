<template>
    <div class="space-y-6">

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div v-for="card in summaryStatistics" :key="card.key"
                class="bg-white p-6 rounded-xl border border-gray-200 shadow-[4px_4px_6px_rgba(128,128,128,0.3)]">
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="border border-gray-400 rounded-lg p-4 flex items-center justify-center h-full">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-10 h-10 text-gray-400">
                                <line x1="12" y1="20" x2="12" y2="10"></line>
                                <line x1="18" y1="20" x2="18" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="16"></line>
                            </svg>
                            <div>
                                <div v-if="isLoading[card.key]" class="text-gray-500">Memuat...</div>
                                <div v-else-if="error[card.key]" class="text-red-500 text-sm">Gagal</div>
                                <div v-else-if="card.apiData" class="flex items-center gap-2">
                                    <span class="text-3xl font-bold text-[#03255C]">
                                        {{ card.apiData.total }}
                                    </span>
                                </div>
                                <p class="text-sm text-blue-900 font-semibold mt-1">
                                    {{ card.totalTitle }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="border border-gray-400 rounded-lg p-4 flex items-center justify-center h-full">
                        <div class="flex items-center gap-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="w-10 h-10 text-red-500">
                                <line x1="12" y1="20" x2="12" y2="10"></line>
                                <line x1="18" y1="20" x2="18" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="16"></line>
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
            <h3 class="text-lg font-semibold text-[#03255C]">Recently In & Viral</h3>
            <p class="text-sm text-gray-500">status, topik, terkini</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            <div v-if="isLoading.status" class="text-gray-500 col-span-5 text-center">Memuat status posts...</div>
            <div v-else-if="error.status" class="text-red-500 col-span-5 text-center">Gagal memuat status posts: {{
                error.status }}</div>

            <div v-else v-for="card in statusCards" :key="card.title" :class="[card.bgColor,
                'p-4 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 text-white flex flex-col justify-center items-center aspect-square md:aspect-auto md:h-40'
            ]">
                <p class="text-base font-medium text-center">{{ card.title }}</p>
                <span class="text-5xl font-bold">{{ card.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

// State
const totalApiData = ref(null);
const viralApiData = ref(null);
// TAMBAHAN: State untuk data status posts
const statusApiData = ref(null);

// Memperbarui reactive state untuk loading dan error
const isLoading = reactive({ total: true, viral: true, status: true });
const error = reactive({ total: null, viral: null, status: null });

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
        negativeTitle: 'Total Post Negatif',
        negativeTextClass: 'text-red-600'
    },
    {
        key: 'viral',
        apiData: viralApiData.value,
        chartData: rightChartData.value,
        totalTitle: 'Total Post Viral',
        negativeTitle: 'Total Post Negatif Viral',
        negativeTextClass: 'text-red-600'
    }
]);

// FUNGSI BARU: Memetakan data status API ke format kartu tampilan
const statusCards = computed(() => {
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

    // Urutan yang diinginkan: Normal, Early, Emerging, Current, Crisis
    const desiredOrder = ['normal', 'early', 'emerging', 'current', 'crisis'];

    // Map data API
    const mappedData = statusApiData.value.distribution.map(item => ({
        title: titleMap[item.status] || item.status,
        value: item.count,
        bgColor: colorMap[item.status] || 'bg-gray-400',
        order: desiredOrder.indexOf(item.status) // Tambahkan indeks untuk sorting
    }));

    // Urutkan data
    return mappedData.sort((a, b) => a.order - b.order);
});


// Fungsi untuk mengambil data total (DISESUAIKAN UNTUK MENGAMBIL SENTIMEN DARI API)
async function fetchTotalData() {
    let totalPostsData = null;
    let sentimentData = null;

    try {
        // Panggilan API 1: Total Posts
        const totalResponse = await fetch('http://127.0.0.1:8000/total-posts');
        if (!totalResponse.ok) throw new Error(`HTTP error fetching total posts! status: ${totalResponse.status}`);
        totalPostsData = await totalResponse.json();

        // Panggilan API 2: Distribusi Sentimen
        const sentimentResponse = await fetch('http://127.0.0.1:8000/sentiment-distribution');
        if (!sentimentResponse.ok) throw new Error(`HTTP error fetching sentiment! status: ${sentimentResponse.status}`);
        sentimentData = await sentimentResponse.json();

        const sentiment = sentimentData.sentiment_distribution;

        // Memetakan data gabungan
        totalApiData.value = {
            total: totalPostsData.total_posts,
            negative: sentiment.negative,
            positive: sentiment.positive,
            neutral: sentiment.neutral
        };

        // Mengisi chart data dengan sentimen
        leftChartData.value.labels = ['Positif', 'Negatif', 'Netral'];
        leftChartData.value.datasets[0].data = [
            sentiment.positive,
            sentiment.negative,
            sentiment.neutral
        ];
        leftChartData.value.datasets[0].backgroundColor = ['#22c55e', '#ef4444', '#3b82f6'];


    } catch (err) {
        console.error("Gagal memuat data total/sentimen:", err);
        error.total = err.message;
    } finally {
        isLoading.total = false;
    }
}

// Fetch viral data (TIDAK BERUBAH)
// ... kode di atas ...

// Fetch viral data (DIUBAH)
async function fetchViralData() {
    try {
        // 1. Ganti URL API
        const response = await fetch('http://127.0.0.1:8000/viral-posts');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();

        // Data dari API baru
        const totalViral = data.total_viral_posts;
        const normalPosts = data.by_status.normal; // Mengambil nilai dari 'normal'

        // 2. Memetakan data (sesuai permintaan user)
        viralApiData.value = {
            total: totalViral,
            negative: 0, // DITETAPKAN KE 0 (Total Post Negatif Viral)
            // Tambahkan properti lain yang mungkin dibutuhkan, misalnya untuk chart:
            normal: normalPosts,
            viral: totalViral
        };

        // 3. Mengisi chart data (sesuai permintaan user)
        // Post Normal > "by_status": di "normal"
        // Post Viral > total_viral_posts
        // Negatif Viral > di 0 kan dlu
        rightChartData.value.labels = ['Post Normal', 'Post Viral', 'Negatif Viral'];
        rightChartData.value.datasets[0].data = [
            normalPosts, // Post Normal
            totalViral,  // Post Viral
            0            // Negatif Viral (ditetapkan ke 0)
        ];
        // Atur ulang warna latar belakang (jika perlu disesuaikan dengan 3 label baru)
        rightChartData.value.datasets[0].backgroundColor = ['#22c55e', '#ef4444', '#3b82f6'];

    } catch (err) {
        console.error("Gagal memuat data viral:", err);
        error.viral = err.message;
    } finally {
        isLoading.viral = false;
    }
}

// ... kode di bawah ...

// FUNGSI BARU: Ambil data untuk kartu Status
async function fetchStatusData() {
    try {
        // URL API status-distribution
        const response = await fetch('http://127.0.0.1:8000/status-distribution');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        statusApiData.value = data; // Menyimpan respons penuh

    } catch (err) {
        console.error("Gagal memuat data status:", err);
        error.status = err.message;
    } finally {
        isLoading.status = false;
    }
}


// Mount
onMounted(() => {
    console.log('Komponen dimuat sekali ✅');
    fetchTotalData();
    fetchViralData();
    fetchStatusData(); // Panggil fungsi baru
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