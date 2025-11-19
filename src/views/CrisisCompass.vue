<template>
    <div class="space-y-6">
        <div>
            <PostCard />
        </div>
        <div>
            <TopTopik />
        </div>
        <div>
            <Hight />
        </div>
        <div>
            <Analisis />
        </div>
        <div>
            <Flagged />
        </div>
    </div>
</template>

<script setup>
import PostCard from '@/components/charts/Post.vue'
import TopTopik from '@/components/charts/TopTopik.vue'
import Hight from '@/components/charts/Hight.vue'
import Analisis from '@/components/charts/Analisis.vue'
import Flagged from '@/components/charts/Flagged.vue'
</script>

<style scoped></style>