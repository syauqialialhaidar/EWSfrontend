import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

let notificationId = 0

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref([])
  const maxNotifications = ref(5)
  const activeNotifications = computed(() => notifications.value)
  const hasNotifications = computed(() => notifications.value.length > 0)

  /**
   * Add a notification
   * @param {string} type 
   * @param {string} message 
   * @param {number} duration 
   */
  function addNotification(type, message, duration = 5000) {
    const notification = {
      id: ++notificationId,
      type,
      message,
      timestamp: new Date(),
      duration
    }

    notifications.value.push(notification)

    if (notifications.value.length > maxNotifications.value) {
      notifications.value.shift()
    }

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id)
      }, duration)
    }

    return notification.id
  }

  function removeNotification(id) {
    const index = notifications.value.findIndex(n => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }

  function clearAll() {
    notifications.value = []
  }

  function success(message, duration = 5000) {
    return addNotification('success', message, duration)
  }

  function error(message, duration = 7000) {
    return addNotification('error', message, duration)
  }

  function warning(message, duration = 6000) {
    return addNotification('warning', message, duration)
  }

  function info(message, duration = 5000) {
    return addNotification('info', message, duration)
  }

  return {
    // State
    notifications,
    // Getters
    activeNotifications,
    hasNotifications,
    // Actions
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }
})
