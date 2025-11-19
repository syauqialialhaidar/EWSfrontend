import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref(loadThemeFromStorage())

  // Getters
  const isDark = computed(() => {
    if (currentTheme.value === 'dark') return true
    if (currentTheme.value === 'light') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const themeIcon = computed(() => {
    return currentTheme.value === 'dark' ? 'sun' : 'moon'
  })

  // Actions
  function setTheme(theme) {
    if (!['light', 'dark', 'system'].includes(theme)) {
      console.error('Invalid theme:', theme)
      return
    }
    currentTheme.value = theme
  }

  function toggleTheme() {
    currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
  }

  function setLightTheme() {
    currentTheme.value = 'light'
  }

  function setDarkTheme() {
    currentTheme.value = 'dark'
  }

  function setSystemTheme() {
    currentTheme.value = 'system'
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

  function applyTheme() {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  watch(currentTheme, () => {
    applyTheme()
    saveThemeToStorage()
  }, { immediate: true })

  return {
    // State
    currentTheme,
    // Getters
    isDark,
    themeIcon,
    // Actions
    setTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    initTheme
  }
})

// Helper functions
function loadThemeFromStorage() {
  try {
    const stored = localStorage.getItem('ews-theme')
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored
    }
  } catch (error) {
    console.error('Failed to load theme from localStorage:', error)
  }
  return 'system' 
}

function saveThemeToStorage() {
  try {
    const store = useThemeStore()
    localStorage.setItem('ews-theme', store.currentTheme)
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error)
  }
}
