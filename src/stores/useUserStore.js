import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ews-user-data'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isAuthenticated = ref(false)
  const preferences = ref({
    language: 'id',
    notifications: true,
    autoRefresh: false,
    refreshInterval: 30000, 
  })

  const userName = computed(() => user.value?.name || 'Guest')
  const userEmail = computed(() => user.value?.email || '')
  const userRole = computed(() => user.value?.role || 'viewer')

  const hasPermission = computed(() => (permission) => {
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage'],
      editor: ['read', 'write'],
      viewer: ['read']
    }
    return rolePermissions[userRole.value]?.includes(permission) || false
  })

  function loadUserData() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const data = JSON.parse(saved)
        user.value = data.user
        isAuthenticated.value = data.isAuthenticated
        preferences.value = { ...preferences.value, ...data.preferences }
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    }
  }

  function saveUserData() {
    try {
      const data = {
        user: user.value,
        isAuthenticated: isAuthenticated.value,
        preferences: preferences.value
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Failed to save user data:', error)
    }
  }

  function login(userData) {
    user.value = userData
    isAuthenticated.value = true
    saveUserData()
  }

  function logout() {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem(STORAGE_KEY)
  }

  function updateUser(userData) {
    user.value = { ...user.value, ...userData }
    saveUserData()
  }

  function updatePreferences(newPreferences) {
    preferences.value = { ...preferences.value, ...newPreferences }
    saveUserData()
  }

  function setLanguage(lang) {
    preferences.value.language = lang
    saveUserData()
  }

  function toggleNotifications() {
    preferences.value.notifications = !preferences.value.notifications
    saveUserData()
  }

  function setAutoRefresh(enabled, interval) {
    preferences.value.autoRefresh = enabled
    if (interval) {
      preferences.value.refreshInterval = interval
    }
    saveUserData()
  }

  // ===================================
  // INITIALIZATION
  // ===================================
  loadUserData()

  return {
    // State
    user,
    isAuthenticated,
    preferences,
    // Getters
    userName,
    userEmail,
    userRole,
    hasPermission,
    // Actions
    login,
    logout,
    updateUser,
    updatePreferences,
    setLanguage,
    toggleNotifications,
    setAutoRefresh
  }
})
