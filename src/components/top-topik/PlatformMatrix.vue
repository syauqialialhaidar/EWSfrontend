<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h3 class="text-xl font-bold text-[#03255C] mb-4">Matriks Status Platform</h3>

    <div class="overflow-x-auto">
      <table class="platform-table w-full text-sm text-left">
        <thead class="text-xs text-[#03255C] uppercase bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3 rounded-l-lg">Topik</th>
            <th v-for="platform in platforms" :key="platform.name" scope="col" class="px-6 py-3 text-center">
              <FontAwesomeIcon :icon="platform.icon" :class="[platform.color, 'h-5 w-5']" :title="platform.name" />
            </th>
            <th scope="col" class="rounded-r-lg"></th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in platformStatuses" :key="item.topic" class="bg-white border-b border-gray-100">
            <th scope="row" class="px-6 py-4 font-bold text-gray-800 whitespace-nowrap">
              {{ item.topic }}
            </th>

            <td v-for="(status, statusIndex) in item.statuses" :key="`${item.topic}-${statusIndex}`"
              class="px-6 py-4 text-center">
              <div v-if="status" class="relative inline-block"
                @mouseenter="handleMouseEnter(item.topic, status)"
                @mouseleave="handleMouseLeave">
                <span :class="getStatusClass(status).badge"
                  class="px-2.5 py-1 text-xs font-bold rounded-full cursor-help">
                  {{ status }}
                </span>

                <div v-if="hoveredStatus.topic === item.topic && hoveredStatus.status === status"
                  class="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-20 max-h-64 overflow-y-auto text-left">
                  <h5 class="text-sm font-bold text-gray-900 mb-2">
                    Postingan dengan status "{{ status }}"
                  </h5>

                  <div v-if="tooltipPosts.length > 0" class="space-y-2">
                    <div v-for="p in tooltipPosts" :key="p.id"
                      class="text-xs text-gray-700 border-b border-gray-100 last:border-none pb-2 mb-2">
                      <span class="font-bold text-gray-800 block truncate">{{ p.author }}</span>
                      <p class="text-gray-600 line-clamp-2">{{ p.content }}</p>
                    </div>
                  </div>

                  <div v-else class="text-gray-400 text-xs text-center py-2">
                    (Tidak ada postingan di daftar ini)
                  </div>
                </div>
              </div>

              <span v-else class="text-gray-400">-</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { getStatusClass } from '@/utils/status-helpers'

const props = defineProps({
  platformStatuses: {
    type: Array,
    required: true
  },
  platforms: {
    type: Array,
    required: true
  },
  allPosts: {
    type: Array,
    required: true
  }
})

const hoveredStatus = ref({ topic: null, status: null })
const tooltipPosts = computed(() => {
  if (!hoveredStatus.value.topic || !hoveredStatus.value.status) {
    return []
  }

  return props.allPosts.filter(p =>
    p.topicTag === hoveredStatus.value.topic &&
    (p.postStatus || 'N/A').toUpperCase() === hoveredStatus.value.status.toUpperCase()
  )
})

const handleMouseEnter = (topic, status) => {
  hoveredStatus.value = { topic, status }
}

const handleMouseLeave = () => {
  hoveredStatus.value = { topic: null, status: null }
}
</script>

<style scoped>
.platform-table th,
.platform-table td {
  @apply px-6 py-4;
}

.platform-table tbody tr:last-child {
  @apply border-b-0;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
