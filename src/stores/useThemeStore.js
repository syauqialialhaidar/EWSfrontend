import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(localStorage.getItem('theme') || 'system')
  const isDarkMode = computed(() => {
    if (currentTheme.value === 'dark') return true
    if (currentTheme.value === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const themeIcon = computed(() => {
    return currentTheme.value === 'dark' ? 'moon' : 'sun'
  })

  function setTheme(theme) {
    if (['light', 'dark', 'system'].includes(theme)) {
      currentTheme.value = theme
      localStorage.setItem('theme', theme)
      applyTheme()
    }
  }

  function toggleTheme() {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  function applyTheme() {
    const isDark = isDarkMode.value
    document.documentElement.classList.toggle('dark', isDark)
  }

  function initTheme() {
    applyTheme()

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (currentTheme.value === 'system') {
        applyTheme()
      }
    })
  }

  watch(currentTheme, () => {
    applyTheme()
  })

  return {
    // State
    currentTheme,
    // Getters
    isDarkMode,
    themeIcon,
    // Actions
    setTheme,
    toggleTheme,
    initTheme
  }
})
