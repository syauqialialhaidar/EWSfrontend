import { ref, computed } from 'vue'

/**
 * @param {Array} initialItems 
 * @param {number} itemsPerPage -
 * @returns {Object} 
 */
export function usePagination(initialItems = [], itemsPerPage = 5) {
  const currentPage = ref(1)
  const perPage = ref(itemsPerPage)
  const items = ref(initialItems)
  const total = computed(() => items.value.length)
  const totalPages = computed(() => {
    return Math.ceil(total.value / perPage.value)
  })

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value

    if (start >= total.value && currentPage.value > 1) {
      currentPage.value = 1
      return items.value.slice(0, perPage.value)
    }

    return items.value.slice(start, end)
  })

  const hasNext = computed(() => {
    return currentPage.value < totalPages.value
  })

  const hasPrev = computed(() => {
    return currentPage.value > 1
  })

  const startIndex = computed(() => {
    return (currentPage.value - 1) * perPage.value + 1
  })

  const endIndex = computed(() => {
    return Math.min(currentPage.value * perPage.value, total.value)
  })

  // Methods
  const nextPage = () => {
    if (hasNext.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrev.value) {
      currentPage.value--
    }
  }

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const setItems = (newItems) => {
    items.value = newItems
    // Reset to page 1 when items change
    currentPage.value = 1
  }

  const setPerPage = (newPerPage) => {
    perPage.value = newPerPage
    currentPage.value = 1
  }

  const reset = () => {
    currentPage.value = 1
    items.value = []
  }

  return {
    // State
    currentPage,
    perPage,
    items,

    // Computed
    total,
    totalPages,
    paginatedItems,
    hasNext,
    hasPrev,
    startIndex,
    endIndex,

    // Methods
    nextPage,
    prevPage,
    goToPage,
    setItems,
    setPerPage,
    reset
  }
}
