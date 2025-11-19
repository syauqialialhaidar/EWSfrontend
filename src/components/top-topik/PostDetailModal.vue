<template>
  <Teleport to="body">
    <div v-if="isOpen && post" @click.self="handleClose"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4 animate-fade-in">

      <div class="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">

        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <div class="flex items-center min-w-0">
            <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3 flex-shrink-0">
            <div class="min-w-0">
              <h3 class="font-bold text-lg text-gray-800 truncate">{{ post.author }}</h3>
              <p class="text-xs text-gray-500">{{ post.date }}</p>
            </div>
          </div>
          <button @click="handleClose" class="text-gray-400 hover:text-gray-600 ml-4 flex-shrink-0">
            <FontAwesomeIcon :icon="faXmark" class="h-6 w-6" />
          </button>
        </div>

        <div class="p-5 overflow-y-auto">
          <p class="text-base text-gray-700 whitespace-pre-wrap">{{ post.content }}</p>

          <div class="mt-4 pt-4 border-t border-gray-100">
            <span class="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
              Topik: {{ post.topicTag }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap justify-around items-center p-4 border-t border-gray-200 bg-gray-50">
          <div class="text-center p-2">
            <span class="text-sm text-gray-500">Status</span>
            <span :class="[getStatusClass(post.postStatus).badge, 'text-sm font-bold px-3 py-1 rounded-full block mt-1']">
              {{ post.postStatus }}
            </span>
          </div>
          <div class="text-center p-2">
            <span class="text-sm text-gray-500">Likes</span>
            <span class="text-lg font-bold text-gray-800 block">{{ post.likes }}</span>
          </div>
          <div class="text-center p-2">
            <span class="text-sm text-gray-500">Comments</span>
            <span class="text-lg font-bold text-gray-800 block">{{ post.comments }}</span>
          </div>
          <div class="text-center p-2">
            <span class="text-sm text-gray-500">Shares</span>
            <span class="text-lg font-bold text-gray-800 block">{{ post.shares }}</span>
          </div>
        </div>

        <div class="p-4 bg-gray-100 border-t border-gray-200">
          <button @click="handleVisit"
            class="w-full text-sm font-semibold bg-[#03255C] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition flex items-center justify-center gap-2">
            <FontAwesomeIcon :icon="faUpRightFromSquare" /> Kunjungi Postingan Asli
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark, faUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { getStatusClass } from '@/utils/status-helpers'

const props = defineProps({
  post: {
    type: Object,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'open-link'])

const handleClose = () => {
  emit('close')
}

const handleVisit = () => {
  if (props.post) {
    emit('open-link', props.post)
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
