// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CrisisCompass from '../views/CrisisCompass.vue'; // Pastikan path import benar
import Trendtracker from '../views/Trendtracker.vue';   // Pastikan path import benar

const routes = [
  {
    path: '/',
    redirect: '/crisis-compass' 
  },
  {
    path: '/crisis-compass',
    name: 'CrisisCompass',
    component: CrisisCompass
  },
  {
    path: '/trendtracker',
    name: 'Trendtracker',
    component: Trendtracker
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;