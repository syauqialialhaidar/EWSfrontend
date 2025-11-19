import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import VueApexCharts from 'vue3-apexcharts'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import { useThemeStore } from './stores/useThemeStore'
import { useAppStore } from './stores/useAppStore'
import { useBookmarkStore } from './stores/useBookmarkStore'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(VueApexCharts)
library.add() 
app.component('FontAwesomeIcon', FontAwesomeIcon)
const themeStore = useThemeStore()
const appStore = useAppStore()
const bookmarkStore = useBookmarkStore()
themeStore.initTheme()
appStore.initApp()
bookmarkStore.loadFromStorage()
app.mount('#app')
