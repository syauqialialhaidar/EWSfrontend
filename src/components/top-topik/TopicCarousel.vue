<template>
  <div class="relative">
    <button v-if="currentPage > 0" @click="prevPage"
      class="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 hover:bg-gray-50">
      <FontAwesomeIcon :icon="faChevronLeft" class="w-5 h-5" />
    </button>

    <button v-if="hasNextPage" @click="nextPage"
      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-gray-700 hover:bg-gray-50">
      <FontAwesomeIcon :icon="faChevronRight" class="w-5 h-5" />
    </button>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(topic, index) in currentPageTopics" :key="topic.title" :class="[
        getTopicCardGradient(currentPage * itemsPerPage + index),
        'p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 relative overflow-hidden cursor-pointer'
      ]" @click="handleTopicClick(topic)">
        <div class="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
        <div class="absolute -left-4 -bottom-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>

        <div
          class="absolute top-4 right-4 w-10 h-10 bg-white bg-opacity-30 backdrop-blur-sm rounded-full flex items-center justify-center">
          <span class="text-white font-bold text-lg">
            {{ currentPage * itemsPerPage + index + 1 }}
          </span>
        </div>

        <div class="relative z-10">
          <p class="text-xl font-bold text-white mb-4 line-clamp-2 min-h-[3.5rem]">
            {{ topic.title }}
          </p>
          <p class="text-6xl font-bold text-white mb-2">{{ topic.value }}</p>
          <p class="text-lg font-medium text-white text-opacity-90 uppercase tracking-wide">Total Posts</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center gap-2 mt-6">
      <button v-for="pageNum in totalPages" :key="pageNum" @click="goToPage(pageNum - 1)" :class="[
        currentPage === pageNum - 1 ? 'bg-blue-600 w-8' : 'bg-gray-300 w-2',
        'h-2 rounded-full transition-all duration-300 hover:bg-blue-400'
      ]">
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { getTopicCardGradient } from '@/utils/status-helpers'

const props = defineProps({
  topics: {
    type: Array,
    required: true
  },
  itemsPerPage: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['topic-selected'])
const currentPage = ref(0)
const totalPages = computed(() => {
  return Math.ceil(props.topics.length / props.itemsPerPage)
})

const currentPageTopics = computed(() => {
  const start = currentPage.value * props.itemsPerPage
  return props.topics.slice(start, start + props.itemsPerPage)
})

const hasNextPage = computed(() => {
  return (currentPage.value + 1) * props.itemsPerPage < props.topics.length
})

watch(() => props.topics, () => {
  if (currentPage.value >= totalPages.value && totalPages.value > 0) {
    currentPage.value = 0
  }
})

const nextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++
  }
}

const prevPage = () => {
  if (currentPage.value > 0) {
    currentPage.value--
  }
}

const goToPage = (page) => {
  if (page >= 0 && page < totalPages.value) {
    currentPage.value = page
  }
}

const handleTopicClick = (topic) => {
  emit('topic-selected', topic)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
