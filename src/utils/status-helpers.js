/**
 * Status Helpers Utility
 * Centralized utilities for status styling and calculations
 */

/**
 * Get status-specific CSS classes
 * @param {string} status - Status value (NORMAL, EARLY, EMERGING, CURRENT, CRISIS)
 * @returns {Object} Object with text, badge, and border classes
 */
export const getStatusClass = (status) => {
  const upperStatus = (status || 'N/A').toUpperCase()

  const statusMap = {
    'NORMAL': {
      text: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800',
      border: 'border-blue-500'
    },
    'EARLY': {
      text: 'text-green-600',
      badge: 'bg-green-100 text-green-800',
      border: 'border-green-500'
    },
    'EMERGING': {
      text: 'text-yellow-600',
      badge: 'bg-yellow-100 text-yellow-800',
      border: 'border-yellow-500'
    },
    'CURRENT': {
      text: 'text-orange-600',
      badge: 'bg-orange-100 text-orange-800',
      border: 'border-orange-500'
    },
    'CRISIS': {
      text: 'text-red-600',
      badge: 'bg-red-100 text-red-800',
      border: 'border-red-500'
    },
    'N/A': {
      text: 'text-gray-500',
      badge: 'bg-gray-100 text-gray-800',
      border: 'border-gray-400'
    }
  }

  return statusMap[upperStatus] || statusMap['N/A']
}

/**
 * Get gauge style with angle based on status
 * @param {string} status - Status value
 * @returns {Object} Style object with CSS variable for gauge angle
 */
export const getGaugeStyle = (status) => {
  const angleMap = {
    NORMAL: 162,
    EARLY: 126,
    EMERGING: 90,
    CURRENT: 54,
    CRISIS: 18
  }

  const angle = angleMap[(status || 'N/A').toUpperCase()] || 162
  return { '--gauge-angle': `${angle}deg` }
}

/**
 * Get highest priority status from an array of posts
 * @param {Array} posts - Array of posts with postStatus property
 * @returns {string} Highest priority status
 */
export const getHighestPriorityStatus = (posts) => {
  if (!posts || posts.length === 0) return 'N/A'

  const priority = ['CRISIS', 'CURRENT', 'EMERGING', 'EARLY', 'NORMAL']

  for (const status of priority) {
    if (posts.some(p => (p.postStatus || 'N/A').toUpperCase() === status)) {
      return status
    }
  }

  return 'NORMAL'
}

/**
 * Get gradient class for topic cards
 * @param {number} index - Card index
 * @returns {string} Tailwind gradient class
 */
export const getTopicCardGradient = (index) => {
  const gradients = [
    'bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-700',   // Purple
    'bg-gradient-to-br from-teal-500 via-emerald-600 to-green-600',     // Teal/Green
    'bg-gradient-to-br from-pink-500 via-rose-600 to-red-600',          // Pink/Red
    'bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-600',    // Orange/Yellow
    'bg-gradient-to-br from-blue-500 via-sky-600 to-cyan-600',          // Blue/Cyan
    'bg-gradient-to-br from-violet-500 via-fuchsia-600 to-purple-600',  // Violet/Purple
    'bg-gradient-to-br from-lime-500 via-green-600 to-emerald-700',     // Lime/Green
    'bg-gradient-to-br from-red-500 via-pink-600 to-rose-600',          // Red/Pink
    'bg-gradient-to-br from-indigo-500 via-blue-600 to-sky-600',        // Indigo/Blue
    'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600',      // Emerald/Teal
  ]

  return gradients[index % gradients.length]
}

/**
 * Get social icon color class
 * @param {Object} icon - FontAwesome icon object
 * @returns {string} Tailwind color class
 */
export const getSocialIconColor = (icon) => {
  const iconName = icon?.iconName
  const colorMap = {
    'x-twitter': 'text-gray-700',
    'tiktok': 'text-black',
    'instagram': 'text-pink-500'
  }

  return colorMap[iconName] || 'text-gray-700'
}

/**
 * Needle colors for compass chart
 */
export const NEEDLE_COLORS = {
  primary: '#D97706',
  secondary: '#059669',
  tertiary: '#2563EB'
}

/**
 * Platform configurations
 */
export const PLATFORMS = [
  { name: 'X / Twitter', platformKey: 'twitter', color: 'text-gray-800' },
  { name: 'TikTok', platformKey: 'tiktok', color: 'text-black' },
  { name: 'Instagram', platformKey: 'instagram', color: 'text-pink-500' }
]
