/**
 * Logger Utility
 * Provides consistent logging across the application with environment awareness
 */

import { API_CONFIG } from '@/config/api.config'

const isDev = API_CONFIG.isDevelopment

/**
 * Log levels
 */
const LOG_LEVELS = {
  DEBUG: 'DEBUG',
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR'
}

/**
 * Format log message with timestamp and context
 */
function formatMessage(level, context, ...args) {
  const timestamp = new Date().toISOString()
  const prefix = `[${timestamp}] [${level}]${context ? ` [${context}]` : ''}`
  return [prefix, ...args]
}

/**
 * Logger class
 */
class Logger {
  /**
   * Debug level logging (only in development)
   */
  debug(context, ...args) {
    if (isDev) {
      console.debug(...formatMessage(LOG_LEVELS.DEBUG, context, ...args))
    }
  }

  /**
   * Info level logging (only in development)
   */
  info(context, ...args) {
    if (isDev) {
      console.info(...formatMessage(LOG_LEVELS.INFO, context, ...args))
    }
  }

  /**
   * Log level logging (only in development)
   */
  log(context, ...args) {
    if (isDev) {
      console.log(...formatMessage(LOG_LEVELS.INFO, context, ...args))
    }
  }

  /**
   * Warning level logging (shown in all environments)
   */
  warn(context, ...args) {
    console.warn(...formatMessage(LOG_LEVELS.WARN, context, ...args))
  }

  /**
   * Error level logging (shown in all environments)
   */
  error(context, ...args) {
    console.error(...formatMessage(LOG_LEVELS.ERROR, context, ...args))
  }

  /**
   * Group logging (only in development)
   */
  group(label, collapsed = false) {
    if (isDev) {
      if (collapsed) {
        console.groupCollapsed(label)
      } else {
        console.group(label)
      }
    }
  }

  /**
   * End group
   */
  groupEnd() {
    if (isDev) {
      console.groupEnd()
    }
  }

  /**
   * Table logging (only in development)
   */
  table(data) {
    if (isDev) {
      console.table(data)
    }
  }

  /**
   * Time tracking
   */
  time(label) {
    if (isDev) {
      console.time(label)
    }
  }

  /**
   * End time tracking
   */
  timeEnd(label) {
    if (isDev) {
      console.timeEnd(label)
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export LOG_LEVELS for external use
export { LOG_LEVELS }
