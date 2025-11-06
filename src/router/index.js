// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import CrisisCompass from '../views/CrisisCompass.vue';
import Pengaturan from '@/views/pengaturan.vue';
import CrisisRules from '../views/Rules.vue' ;

// VVV TAMBAHKAN IMPOR INI VVV
import TopicDetail from '../views/TopicDetails.vue';



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

    // VVV TAMBAHKAN BLOK ROUTE BARU INI VVV
    {
      path: '/topik/:topicName', // :topicName adalah parameter dinamis
      name: 'TopicDetail',     // Nama ini HARUS SAMA dengan di fungsi goToTopicPage
      component: TopicDetail   // Komponen yang baru Anda buat
    },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;