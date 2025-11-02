<template>
    <h1>trendtracker</h1>
    <div class="min-h-screen">
        <div class="grid grid-cols-1 grid-cols-2 gap-6">

            <div class="bg-white p-6 rounded-lg shadow-[3px_3px_5px_rgba(3,37,92,0.3)]">
                <div class="flex flex-col sm:flex-row justify-around items-center mb-6 gap-4">

                    <div
                        class="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 text-center w-full sm:w-1/2">
                        <div class="flex items-center justify-center space-x-2">
                            <p class="text-3xl font-bold text-[#03255C]">1,836</p>
                            <span
                                class="text-xs font-semibold text-[#03255C] bg-blue-100 rounded-full px-2 py-0.5">-2.2%</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">Total Post Keseluruhan</p>
                    </div>
                    <div
                        class="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 text-center w-full sm:w-1/2">
                        <div class="flex items-center justify-center space-x-2">
                            <p class="text-3xl font-bold text-red-600">142</p>
                            <span
                                class="text-xs font-semibold text-red-800 bg-red-100 rounded-full px-2 py-0.5">-2.2%</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">Total Post Negatif</p>
                    </div>

                </div>
                <div>
                    <div class="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <p class="text-gray-400">Chart Kiri</p>
                    </div>

                    <div class="flex justify-center items-center space-x-4 sm:space-x-6 text-center">
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: #27AE60;"></span>
                            <span class="text-sm text-gray-600">Post Positif</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: #2D9CDB;"></span>
                            <span class="text-sm text-gray-600">Post Normal</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: #EB5757;"></span>
                            <span class="text-sm text-gray-600">Negatif Viral</span>
                        </div>
                    </div>
                </div>
            </div>


            <div class="bg-white p-6 rounded-lg shadow-[3px_3px_5px_rgba(3,37,92,0.3)]">
                <div class="flex flex-col sm:flex-row justify-around items-center mb-6 gap-4">

                    <div
                        class="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 text-center w-full sm:w-1/2">
                        <div class="flex items-center justify-center space-x-2">
                            <p class="text-3xl font-bold text-[#03255C]">1,836</p>
                            <span
                                class="text-xs font-semibold text-[#03255C] bg-blue-100 rounded-full px-2 py-0.5">-2.2%</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">Total Post Keseluruhan</p>
                    </div>
                    <div
                        class="bg-white border border-gray-200 rounded-lg shadow-sm px-6 py-4 text-center w-full sm:w-1/2">
                        <div class="flex items-center justify-center space-x-2">
                            <p class="text-3xl font-bold text-red-600">142</p>
                            <span
                                class="text-xs font-semibold text-red-800 bg-red-100 rounded-full px-2 py-0.5">-2.2%</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">Total Post Negatif</p>
                    </div>

                </div>
                <div>
                    <div class="w-48 h-48 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <p class="text-gray-400">Chart Kiri</p>
                    </div>

                    <div class="flex justify-center items-center space-x-4 sm:space-x-6 text-center">
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: #27AE60;"></span>
                            <span class="text-sm text-gray-600">Post Positif</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: #2D9CDB;"></span>
                            <span class="text-sm text-gray-600">Post Normal</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="w-3 h-3 rounded-full" style="background-color: #EB5757;"></span>
                            <span class="text-sm text-gray-600">Negatif Viral</span>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<script setup>
// Untuk saat ini, tidak ada logic yang diperlukan.
</script>