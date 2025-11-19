import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', () => {
  // State
  const apiBaseUrl = ref(import.meta.env.VITE_API_URL || 'http://154.26.134.72:8438')
  const isOnline = ref(navigator.onLine)
  const appVersion = ref('1.0.0')
  const notifications = ref([])

  // Getters
  const hasNotifications = computed(() => notifications.value.length > 0)
  const unreadNotificationCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })

  // Actions
  function setApiBaseUrl(url) {
    apiBaseUrl.value = url
  }

  function updateOnlineStatus() {
    isOnline.value = navigator.onLine
  }

  function addNotification(notification) {
    const newNotification = {
      id: Date.now(),
      timestamp: new Date(),
      read: false,
      ...notification
    }
    notifications.value.unshift(newNotification)

    if (notification.autoRemove) {
      setTimeout(() => {
        removeNotification(newNotification.id)
      }, 5000)
    }
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function markNotificationAsRead(id) {
    const notification = notifications.value.find(n => n.id === id)
    if (notification) {
      notification.read = true
    }
  }

  function clearAllNotifications() {
    notifications.value = []
  }

  function initApp() {
    window.addEventListener('online', updateOnlineStatus)
    window.addEventListener('offline', updateOnlineStatus)

    console.log('App initialized')
    console.log('API Base URL:', apiBaseUrl.value)
    console.log('Online status:', isOnline.value)
  }

  return {
    // State
    apiBaseUrl,
    isOnline,
    appVersion,
    notifications,
    // Getters
    hasNotifications,
    unreadNotificationCount,
    // Actions
    setApiBaseUrl,
    updateOnlineStatus,
    addNotification,
    removeNotification,
    markNotificationAsRead,
    clearAllNotifications,
    initApp
  }
})
