import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  const today = new Date()
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(today.getDate() - 7)
  const startDate = ref(sevenDaysAgo.toISOString().split('T')[0])
  const endDate = ref(today.toISOString().split('T')[0])
  const dateRange = computed(() => ({
    start: startDate.value,
    end: endDate.value
  }))

  const formattedDateRange = computed(() => {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    return {
      start: start.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      end: end.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  })

  const daysCount = computed(() => {
    const start = new Date(startDate.value)
    const end = new Date(endDate.value)
    const diffTime = Math.abs(end - start)
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
  })

  function setDateRange(start, end) {
    if (start && end) {
      startDate.value = typeof start === 'string'
        ? start
        : start.toISOString().split('T')[0]
      endDate.value = typeof end === 'string'
        ? end
        : end.toISOString().split('T')[0]
    }
  }

  function setStartDate(date) {
    startDate.value = typeof date === 'string'
      ? date
      : date.toISOString().split('T')[0]
  }

  function setEndDate(date) {
    endDate.value = typeof date === 'string'
      ? date
      : date.toISOString().split('T')[0]
  }

  function resetToLast7Days() {
    const today = new Date()
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(today.getDate() - 7)

    startDate.value = sevenDaysAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  }

  function setLast30Days() {
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    startDate.value = thirtyDaysAgo.toISOString().split('T')[0]
    endDate.value = today.toISOString().split('T')[0]
  }

  return {
    // State
    startDate,
    endDate,
    // Getters
    dateRange,
    formattedDateRange,
    daysCount,
    // Actions
    setDateRange,
    setStartDate,
    setEndDate,
    resetToLast7Days,
    setLast30Days
  }
})
