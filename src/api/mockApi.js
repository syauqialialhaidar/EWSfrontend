// src/api/mockApi.js

// Ini adalah data palsu (mock data) yang seolah-olah kita dapatkan dari server.
// Strukturnya dibuat mirip dengan tampilan yang Anda inginkan.
const mockData = [
  {
    id: 'left_card',
    totalPosts: {
      value: 1836,
      change: -2.2,
    },
    negativePosts: {
      value: 142,
      change: -2.2,
    },
    // Data untuk chart, Anda bisa gunakan ini nanti jika memakai library chart
    chartData: {
      labels: ['Post Positif', 'Post Normal', 'Negatif Viral'],
      values: [78.5, 5.9, 15.6] // Total 100%
    }
  },
  {
    id: 'right_card',
    totalPosts: {
      value: 2050,
      change: 3.5,
    },
    negativePosts: {
      value: 180,
      change: 1.5,
    },
    // Data untuk chart
    chartData: {
      labels: ['Post Positif', 'Post Normal', 'Negatif Viral'],
      values: [30.5, 37.5, 32] // Total 100%
    }
  }
];

/**
 * Fungsi ini mensimulasikan panggilan API.
 * Menggunakan Promise dan setTimeout untuk meniru jeda waktu saat mengambil data dari internet.
 */
export const fetchCrisisCompassData = () => {
  console.log("Fetching mock data...");
  return new Promise(resolve => {
    // Simulasi jeda jaringan selama 1 detik (1000 milidetik)
    setTimeout(() => {
      console.log("Mock data fetched successfully!");
      resolve(mockData);
    }, 1000);
  });
};