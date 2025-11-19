<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[9999] space-y-2 max-w-md">
      <TransitionGroup name="notification">
        <div
          v-for="notification in notificationStore.activeNotifications"
          :key="notification.id"
          :class="[
            'flex items-start gap-3 p-4 rounded-lg shadow-lg border backdrop-blur-sm',
            'animate-slide-in-right',
            notificationClasses[notification.type]
          ]"
        >
          <component
            :is="notificationIcons[notification.type]"
            :class="[
              'w-5 h-5 flex-shrink-0 mt-0.5',
              notificationIconColors[notification.type]
            ]"
          />

          <div class="flex-1 min-w-0">
            <p :class="['text-sm font-medium', notificationTextColors[notification.type]]">
              {{ notification.message }}
            </p>
          </div>

          <button
            @click="notificationStore.removeNotification(notification.id)"
            :class="[
              'flex-shrink-0 rounded-md p-1 hover:bg-white/20 transition-colors',
              notificationTextColors[notification.type]
            ]"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useNotificationStore } from '@/stores/useNotificationStore'

const notificationStore = useNotificationStore()

const notificationIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info
}

const notificationClasses = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200'
}

const notificationTextColors = {
  success: 'text-green-800',
  error: 'text-red-800',
  warning: 'text-yellow-800',
  info: 'text-blue-800'
}

const notificationIconColors = {
  success: 'text-green-600',
  error: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600'
}
</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>
