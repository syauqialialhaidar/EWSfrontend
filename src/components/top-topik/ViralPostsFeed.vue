<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col h-[700px]">
    <div class="p-4 border-b border-gray-100">
      <h3 class="text-lg font-bold text-[#03255C]">Postingan Viral Terbaru</h3>
      <p class="text-sm text-gray-500">Semua postingan viral teratas, diurutkan.</p>
    </div>

    <div class="p-4 space-y-3 flex-grow overflow-y-auto">
      <div class="flex flex-wrap gap-2 mb-4">
        <button v-for="topic in availableTopics" :key="topic" @click="selectTopic(topic)" :class="[
          'px-3 py-1.5 text-xs font-semibold rounded-full border transition',
          selectedTopic === topic
            ? 'bg-[#03255C] text-white border-[#03255C]'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        ]">
          {{ topic }}
        </button>
        <button @click="selectTopic('All')" :class="[
          'px-3 py-1.5 text-xs font-semibold rounded-full border transition',
          selectedTopic === 'All'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        ]">
          Semua
        </button>
      </div>

      <div v-if="paginatedPosts.length === 0" class="text-center text-sm text-gray-500 pt-10">
        Tidak ada postingan viral{{ selectedTopic === 'All' ? '' : ' untuk topik ini' }}.
      </div>

      <div v-for="post in paginatedPosts" :key="post.id"
        class="bg-gray-50 border border-gray-200 rounded-lg p-3 transition-shadow hover:shadow-md hover:border-blue-300">
        <div class="flex items-start">
          <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
          <div class="flex-grow min-w-0">
            <div class="flex justify-between items-center">
              <span class="font-bold text-sm text-gray-800 truncate">{{ post.author }}</span>
              <span :class="[getStatusClass(post.postStatus).badge, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                {{ post.postStatus }}
              </span>
            </div>
            <p class="text-xs text-gray-500">{{ post.date }}</p>

            <div class="mt-1">
              <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded" :title="post.topicTag">
                {{ post.topicTag }}
              </span>
            </div>

            <p class="text-sm text-gray-700 mt-1.5 line-clamp-2">{{ post.content }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
          <button @click="handleVisit(post)"
            class="w-full text-xs font-semibold bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-100 transition flex items-center justify-center gap-1.5">
            <FontAwesomeIcon :icon="faUpRightFromSquare" /> Kunjungi
          </button>
          <button @click="handleDetail(post)"
            class="w-full text-xs font-semibold bg-[#03255C] text-white px-3 py-1.5 rounded-md hover:bg-opacity-90 transition flex items-center justify-center gap-1.5">
            <FontAwesomeIcon :icon="faEye" /> Detail
          </button>
        </div>
      </div>
    </div>

    <div v-if="totalPages > 1" class="p-4 border-t border-gray-200 mt-auto">
      <div class="flex justify-between items-center text-xs text-gray-600">
        <span>
          {{ startIndex }} - {{ endIndex }} dari {{ total }}
        </span>
        <div class="flex items-center space-x-1">
          <button @click="prevPage" :disabled="!hasPrev" class="pagination-arrow-btn">
            <FontAwesomeIcon :icon="faChevronLeft" class="h-3 w-3" />
          </button>
          <button @click="nextPage" :disabled="!hasNext" class="pagination-arrow-btn">
            <FontAwesomeIcon :icon="faChevronRight" class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faUpRightFromSquare, faEye, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { getStatusClass } from '@/utils/status-helpers'
import { usePagination } from '@/composables/usePagination'

const props = defineProps({
  posts: {
    type: Array,
    required: true
  },
  availableTopics: {
    type: Array,
    required: true
  },
  perPage: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['open-detail', 'open-link'])
const selectedTopic = ref('All')

const filteredPosts = computed(() => {
  if (selectedTopic.value === 'All') {
    return props.posts
  }
  return props.posts.filter(post => post.topicTag === selectedTopic.value)
})

const {
  paginatedItems: paginatedPosts,
  currentPage,
  totalPages,
  total,
  hasNext,
  hasPrev,
  startIndex,
  endIndex,
  nextPage,
  prevPage,
  setItems
} = usePagination(filteredPosts.value, props.perPage)

watch(filteredPosts, (newPosts) => {
  setItems(newPosts)
})

watch(selectedTopic, () => {
  currentPage.value = 1
})

const selectTopic = (topic) => {
  selectedTopic.value = topic
}

const handleDetail = (post) => {
  emit('open-detail', post)
}

const handleVisit = (post) => {
  emit('open-link', post)
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

.pagination-arrow-btn {
  @apply p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent;
}
</style>
