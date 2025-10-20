import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import VueApexCharts from 'vue3-apexcharts';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

import App from './App.vue'
import router from './router'

// 1. DEKLARASI APLIKASI UTAMA
const app = createApp(App)

// 2. KONFIGURASI DAN USE (Dibutuhkan 'app' telah dideklarasikan)
app.use(createPinia())
app.use(router)
app.use(VueApexCharts)

// 3. KONFIGURASI KOMPONEN GLOBAL (Dibutuhkan 'app' telah dideklarasikan)
library.add() // kalau perlu tambah manual

// PERBAIKAN: Memanggil app.component setelah 'app' dideklarasikan
app.component('FontAwesomeIcon', FontAwesomeIcon)


// 4. MOUNTING APLIKASI
app.mount('#app')