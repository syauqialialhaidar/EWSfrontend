<template>
  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h3 class="text-xl font-bold text-[#03255C] mb-2">Kompas Status Terkini</h3>
    <p class="text-sm text-gray-500 mb-4">Posisi 3 topik teratas berdasarkan status.</p>
    <div class="relative w-full h-80 md:h-96 flex justify-center items-center pie-chart-wrapper"
      @mouseleave="hidePieTooltip">
      <div class="absolute w-full h-full">
        <Pie :data="chartData" :options="chartOptions" :plugins="[pieChartTextPlugin]" />
      </div>
      <div class="pie-needle-wrapper primary" :class="primaryStatus.toLowerCase()">
        <div class="needle"></div>
        <div class="pie-center-dot"></div>
      </div>
      <div class="pie-needle-wrapper secondary" :class="secondaryStatus.toLowerCase()">
        <div class="needle"></div>
      </div>
      <div class="pie-needle-wrapper tertiary" :class="tertiaryStatus.toLowerCase()">
        <div class="needle"></div>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-4 mt-4 text-center">
      <div v-for="(topic, index) in legendTopics" :key="topic.title">
        <div class="flex items-center justify-center gap-2">
          <span class="w-4 h-1.5 rounded-full" :style="{ backgroundColor: topic.color }"></span>
          <span class="text-sm font-semibold text-gray-600">Jarum {{ index + 1 }}</span>
        </div>
        <p class="text-sm font-bold text-[#03255C] mt-1 line-clamp-1" :title="topic.title">
          {{ topic.title }}
        </p>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="tooltip.show" :style="tooltip.style"
        class="fixed z-[60] w-72 bg-white border border-gray-300 rounded-lg shadow-xl p-3 max-h-64 overflow-y-auto animate-fade-in-fast">
        <h5 class="text-sm font-bold text-gray-900 mb-2">
          Postingan dengan status "{{ tooltip.status }}"
        </h5>

        <div v-if="tooltip.posts.length > 0" class="space-y-2">
          <div v-for="p in tooltip.posts.slice(0, 10)" :key="p.id"
            class="text-xs text-gray-700 border-b border-gray-100 last:border-none pb-2 mb-2">
            <span class="font-bold text-gray-800 block truncate" :title="p.author">{{ p.author }}</span>
            <p class="text-gray-600 line-clamp-2">{{ p.content }}</p>
          </div>

          <div v-if="tooltip.posts.length > 10" class="text-xs text-gray-500 italic text-center">
            ...dan {{ tooltip.posts.length - 10 }} lainnya.
          </div>
        </div>

        <div v-else class="text-gray-400 text-xs text-center py-2">
          (Tidak ada postingan di daftar ini)
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { NEEDLE_COLORS } from '@/utils/status-helpers'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const props = defineProps({
  topTopics: {
    type: Array,
    required: true
  },
  pieChartData: {
    type: Object,
    required: true
  },
  primaryStatus: {
    type: String,
    default: 'EMERGING'
  },
  secondaryStatus: {
    type: String,
    default: 'CURRENT'
  },
  tertiaryStatus: {
    type: String,
    default: 'NORMAL'
  },
  allPosts: {
    type: Array,
    required: true
  }
})

const pieChartTextPlugin = {
  id: 'pieChartText',
  afterDraw(chart) {
    const { ctx, data } = chart
    ctx.save()

    const centerX = chart.getDatasetMeta(0).data[0].x
    const centerY = chart.getDatasetMeta(0).data[0].y

    ctx.font = 'bold 18px Poppins, sans-serif'
    ctx.fillStyle = 'white'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const radius = chart.getDatasetMeta(0).data[0].outerRadius * 0.65

    data.labels.forEach((label, i) => {
      const meta = chart.getDatasetMeta(0)
      const arc = meta.data[i]
      const midAngle = arc.startAngle + (arc.endAngle - arc.startAngle) / 2
      const x = centerX + Math.cos(midAngle) * radius
      const y = centerY + Math.sin(midAngle) * radius
      ctx.fillText(label, x, y)
    })

    ctx.restore()
  }
}

const tooltip = reactive({
  show: false,
  style: { top: '0px', left: '0px' },
  status: '',
  posts: []
})

const handlePieHover = (event, activeElements, chart) => {
  if (activeElements.length > 0) {
    const firstElement = activeElements[0]
    const label = chart.data.labels[firstElement.index]

    tooltip.show = true
    tooltip.status = label
    tooltip.posts = props.allPosts.filter(p =>
      (p.postStatus || 'N/A').toUpperCase() === label.toUpperCase()
    )

    const nativeEvent = event.native
    if (nativeEvent) {
      tooltip.style = {
        top: `${nativeEvent.clientY + 10}px`,
        left: `${nativeEvent.clientX + 10}px`,
        right: 'auto',
        bottom: 'auto'
      }

      if (nativeEvent.clientX + 300 > window.innerWidth) {
        tooltip.style.left = 'auto'
        tooltip.style.right = `${window.innerWidth - nativeEvent.clientX + 10}px`
      }

      if (nativeEvent.clientY + 270 > window.innerHeight) {
        tooltip.style.top = 'auto'
        tooltip.style.bottom = `${window.innerHeight - nativeEvent.clientY + 10}px`
      }
    }
  } else {
    tooltip.show = false
  }
}

const hidePieTooltip = () => {
  tooltip.show = false
}

const chartData = computed(() => props.pieChartData)
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: false },
    pieChartText: true
  },
  events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
  onHover: handlePieHover
}

const legendTopics = computed(() => {
  const topics = props.topTopics.slice(0, 3)
  const colors = [NEEDLE_COLORS.primary, NEEDLE_COLORS.secondary, NEEDLE_COLORS.tertiary]

  while (topics.length < 3) {
    topics.push({ title: 'N/A' })
  }

  return topics.map((topic, index) => ({
    title: topic.title,
    color: colors[index]
  }))
})
</script>

<style scoped>
.pie-chart-wrapper :deep(canvas) {
  filter: drop-shadow(8px 8px 12px rgba(0, 0, 0, 0.15));
}

.pie-needle-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform-origin: 0 0;
  transform: rotate(0deg);
  transition: transform 2s cubic-bezier(0.19, 1, 0.22, 1);
}

.pie-center-dot {
  content: '';
  width: 20px;
  height: 20px;
  background: #1f2937;
  border: 4px solid #fff;
  border-radius: 50%;
  position: absolute;
  top: -10px;
  left: -10px;
  z-index: 13;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.pie-needle-wrapper .needle {
  border-radius: 4px;
  position: absolute;
  top: -7px;
  left: 0;
  transform-origin: 0% 50%;
  display: block;
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.2);
  height: 8px;
}

.pie-needle-wrapper.primary .needle {
  width: 170px;
  background: #D97706;
  z-index: 12;
  top: -4px;
}

.pie-needle-wrapper.secondary .needle {
  width: 170px;
  background: #059669;
  z-index: 11;
}

.pie-needle-wrapper.tertiary .needle {
  width: 170px;
  background: #2563EB;
  z-index: 10;
}

.pie-needle-wrapper.normal {
  transform: rotate(-27deg);
}

.pie-needle-wrapper.early {
  transform: rotate(45deg);
}

.pie-needle-wrapper.emerging {
  transform: rotate(135deg);
}

.pie-needle-wrapper.current {
  transform: rotate(225deg);
}

.pie-needle-wrapper.crisis {
  transform: rotate(-72deg);
}

.animate-fade-in-fast {
  animation: fadeInFast 0.1s ease-out forwards;
}

@keyframes fadeInFast {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
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
