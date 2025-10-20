<template>
    <div class>
        <header>
        </header>

        <div>
            <PostCard />
        </div>
        <div class="mt-10">
            <TopTopik />
        </div>
        <div class="mt-10">
            <Hight />
        </div>
        <div class="mt-10">
            <Analisis />
        </div>
        <div class="mt-10">
            <Flagged />
        </div>


    </div>
</template>

<script setup>
import { ref } from 'vue'
import PostCard from '@/components/charts/Post.vue'
import TopTopik from '@/components/charts/TopTopik.vue'
import Hight from '@/components/charts/Hight.vue'
import Analisis from '@/components/charts/Analisis.vue'
import Flagged from '@/components/charts/Flagged.vue'

const search = ref('')
</script>

<style scoped></style>