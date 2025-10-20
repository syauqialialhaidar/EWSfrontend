<template>
    <div class>
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
            <router-link v-for="tab in tabs" :key="tab.name" :to="tab.path" class="tab-link"
                active-class="tab-link-active" inactive-class="tab-link-inactive">
                {{ tab.name }}
            </router-link>

        </nav>
    </div>
</template>

<script setup>
const tabs = [
    { name: 'Crisis Compass', path: '/crisis-compass' }, // Tambahkan path untuk routing
    { name: 'Trendtracker', path: '/trendtracker' },   // Tambahkan path untuk routing
];
</script>

<style scoped>
.tab-link {
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 600; 
    transition: color 0.3s, border-color 0.3s;
}

.tab-link-active {
    color: #1d4ed8;
    font-weight: 500;
    font-weight: 600; 
    border-bottom: 2px solid #1d4ed8;
}

.tab-link-inactive {
    color: #6b7280;
    /* abu */
    border-bottom: 2px solid transparent;
}

.tab-link-inactive:hover {
    color: #111827;
    /* lebih gelap saat hover */
    border-bottom-color: #d1d5db;
    /* abu muda */
}
</style>
