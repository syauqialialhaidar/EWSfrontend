<template>
  <div>
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#03255C]">Detail per Topik</h2>
      <p class="text-sm text-gray-500">Breakdown postingan teratas untuk 3 topik utama.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="(topic, index) in topicsDetails" :key="index"
        class="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">

        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-bold text-[#03255C] line-clamp-1">
            Topik {{ index + 1 }}: {{ topic.title }}
          </h3>
        </div>

        <div class="relative p-4 flex flex-col items-center bg-gray-50/50 cursor-help"
          @mouseenter="handleGaugeMouseEnter(topic)" @mouseleave="handleGaugeMouseLeave">
          <div class="gauge-container">
            <div class="gauge-semi-circle" :style="getGaugeStyle(topic.status)">
              <div class="gauge-needle"></div>
            </div>
            <div class="gauge-inner-circle">
              <div class="gauge-label">STATUS</div>
              <div class="gauge-value" :class="getStatusClass(topic.status).text">{{ topic.status }}</div>
            </div>
          </div>

          <div v-if="hoveredGauge.topic === topic.title && hoveredGauge.status === topic.status"
            class="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-3 z-20 max-h-64 overflow-y-auto">
            <h5 class="text-sm font-bold text-gray-900 mb-2">
              Postingan dengan status "{{ topic.status }}"
            </h5>

            <div v-if="gaugeTooltipPosts.length > 0" class="space-y-2">
              <div v-for="p in gaugeTooltipPosts" :key="p.id"
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

        <div class="p-4 flex-grow h-96 overflow-y-auto">
          <h4 class="text-base font-bold text-[#03255C] mb-3">Postingan Teratas Topik Ini</h4>
          <div v-if="topic.allPosts.length === 0" class="text-center text-sm text-gray-500 py-10">
            Tidak ada postingan untuk topik ini.
          </div>

          <div class="space-y-3">
            <div v-for="post in topic.allPosts" :key="post.id"
              class="bg-white border border-gray-200 rounded-lg p-3 group transition-shadow hover:shadow-md hover:border-blue-300">
              <div class="flex items-start mb-2.5">
                <img :src="post.avatar" alt="Avatar" class="w-10 h-10 rounded-full mr-3">
                <div class="flex-grow min-w-0">
                  <div class="flex justify-between items-start mb-1">
                    <div class="flex items-center gap-2 max-w-[calc(100%-4rem)]">
                      <FontAwesomeIcon :icon="post.socialIcon" :class="getSocialIconColor(post.socialIcon)"
                        class="h-4 w-4" />
                      <span
                        class="font-bold text-sm text-gray-800 block truncate group-hover:text-blue-600 transition-colors">
                        {{ post.author }}
                      </span>
                    </div>

                    <FontAwesomeIcon :icon="faBookmark" @click="handleBookmarkToggle(post)" :class="[
                      'h-4 w-4 cursor-pointer transition-transform duration-200 ease-in-out hover:scale-125',
                      post.isBookmarked ? 'text-yellow-500' : 'text-gray-300 group-hover:text-yellow-400'
                    ]" />
                  </div>

                  <p class="text-xs text-gray-500 flex items-center gap-1.5">
                    <FontAwesomeIcon :icon="faCalendarDays" class="h-3 w-3" />
                    <span>{{ post.date }}</span>
                  </p>
                </div>
              </div>

              <p class="text-sm text-gray-700 mb-3 line-clamp-2">{{ post.content }}</p>

              <div class="flex items-center justify-between text-xs text-gray-500 mb-3 border-t border-gray-100 pt-3">
                <div class="flex items-center gap-3">
                  <span class="flex items-center gap-1" title="Likes">
                    <FontAwesomeIcon :icon="faHeart" /> {{ post.likes }}
                  </span>
                  <span class="flex items-center gap-1" title="Comments">
                    <FontAwesomeIcon :icon="faCommentDots" /> {{ post.comments }}
                  </span>
                  <span class="flex items-center gap-1" title="Shares">
                    <FontAwesomeIcon :icon="faShareNodes" /> {{ post.shares }}
                  </span>
                </div>
                <span :class="[getStatusClass(post.postStatus).badge, 'text-xs font-bold px-2 py-0.5 rounded-full']">
                  {{ post.postStatus }}
                </span>
              </div>

              <div class="flex items-center gap-2">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faBookmark, faEye, faHeart, faCommentDots, faShareNodes,
  faCalendarDays, faUpRightFromSquare
} from '@fortawesome/free-solid-svg-icons'
import { getStatusClass, getGaugeStyle, getSocialIconColor } from '@/utils/status-helpers'
import { useBookmarkStore } from '@/stores'

const props = defineProps({
  topicsDetails: {
    type: Array,
    required: true
  },
  allPosts: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['bookmark-toggle', 'open-detail', 'open-link'])
const bookmarkStore = useBookmarkStore()
const hoveredGauge = ref({ topic: null, status: null })

const gaugeTooltipPosts = computed(() => {
  if (!hoveredGauge.value.topic || !hoveredGauge.value.status) {
    return []
  }

  return props.allPosts.filter(p =>
    p.topicTag === hoveredGauge.value.topic &&
    (p.postStatus || 'N/A').toUpperCase() === hoveredGauge.value.status.toUpperCase()
  )
})

const handleGaugeMouseEnter = (topic) => {
  hoveredGauge.value = { topic: topic.title, status: topic.status }
}

const handleGaugeMouseLeave = () => {
  hoveredGauge.value = { topic: null, status: null }
}

const handleBookmarkToggle = (post) => {
  bookmarkStore.toggleBookmark(post)
  emit('bookmark-toggle', post)
}

const handleDetail = (post) => {
  emit('open-detail', post)
}

const handleVisit = (post) => {
  emit('open-link', post)
}
</script>

<style scoped>
.gauge-container {
  position: relative;
  width: 200px;
  height: 100px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.gauge-semi-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  background: conic-gradient(from 180deg,
      #E60000 0deg 36deg,
      #FF9900 36deg 72deg,
      #AAD816 72deg 108deg,
      #28C76F 108deg 144deg,
      #2092EC 144deg 180deg,
      #f0f0f0 180deg 360deg);
}

.gauge-needle {
  content: '';
  position: absolute;
  width: 95px;
  height: 6px;
  background: #333;
  border-radius: 3px;
  top: 100px;
  left: 5px;
  transform-origin: 95px 3px;
  transform: rotate(var(--gauge-angle, 162deg));
  transition: transform 1.5s cubic-bezier(0.19, 1, 0.22, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.gauge-inner-circle {
  width: 160px;
  height: 160px;
  background: white;
  border-radius: 50%;
  position: absolute;
  top: 40px;
  left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 1rem;
  z-index: 5;
}

.gauge-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.gauge-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
