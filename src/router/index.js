// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CrisisCompass from '../views/CrisisCompass.vue';
import Pengaturan from '@/views/pengaturan.vue';
import CrisisRules from '../views/Rules.vue' 

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
    path: '/pengaturan',
    name: 'pengaturan',
    component: Pengaturan
  },
  {
    path: '/rules',
    name: 'Rules',
    component: CrisisRules,
    meta: { hideFilterBar: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;