import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useFilterStore = defineStore('filter', () => {
  // State
  const startDate = ref(getDefaultStartDate())
  const endDate = ref(getDefaultEndDate())

  // Getters
  const dateRange = computed(() => ({
    start: startDate.value,
    end: endDate.value
  }))

  const formattedDateRange = computed(() => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' }
    const start = new Date(startDate.value).toLocaleDateString('id-ID', options)
    const end = new Date(endDate.value).toLocaleDateString('id-ID', options)
    return `${start} - ${end}`
  })

  // Actions
  function setDateRange(start, end) {
    if (!start || !end) {
      console.error('Invalid date range provided')
      return
    }

    const startDateObj = start instanceof Date ? start : new Date(start)
    const endDateObj = end instanceof Date ? end : new Date(end)

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      console.error('Invalid date objects')
      return
    }

    startDate.value = startDateObj.toISOString().split('T')[0]
    endDate.value = endDateObj.toISOString().split('T')[0]
  }

  function setToday() {
    const now = new Date()
    setDateRange(now, now)
  }

  function setLast7Days() {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 6)
    setDateRange(start, end)
  }

  function setLast30Days() {
    const end = new Date()
    const start = new Date()
    start.setDate(end.getDate() - 29)
    setDateRange(start, end)
  }

  function setThisMonth() {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    setDateRange(start, end)
  }

  function resetToDefault() {
    setLast7Days()
  }

  return {
    // State
    startDate,
    endDate,
    // Getters
    dateRange,
    formattedDateRange,
    // Actions
    setDateRange,
    setToday,
    setLast7Days,
    setLast30Days,
    setThisMonth,
    resetToDefault
  }
})

function getDefaultStartDate() {
  const date = new Date()
  date.setDate(date.getDate() - 6) 
  return date.toISOString().split('T')[0]
}

function getDefaultEndDate() {
  return new Date().toISOString().split('T')[0]
}
