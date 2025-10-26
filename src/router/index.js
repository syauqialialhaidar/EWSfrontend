// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CrisisCompass from '../views/CrisisCompass.vue';

const routes = [
  {
    path: '/',
    redirect: '/crisis-compass' 
  },
  {
    path: '/crisis-compass',
    name: 'CrisisCompass',
    component: CrisisCompass
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;