import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'ews-bookmarked-posts'

export const useBookmarkStore = defineStore('bookmark', () => {
  // State
  const bookmarkedPosts = ref([])
  const isLoading = ref(false)

  // Getters
  const bookmarkCount = computed(() => bookmarkedPosts.value.length)

  const bookmarkedIds = computed(() => {
    return new Set(bookmarkedPosts.value.map(post => post.id))
  })

  const hasBookmarks = computed(() => bookmarkedPosts.value.length > 0)

  // Actions
  function isBookmarked(postId) {
    return bookmarkedIds.value.has(postId)
  }

  function addBookmark(post) {
    if (!post || !post.id) {
      console.error('Invalid post object for bookmark')
      return false
    }

    if (isBookmarked(post.id)) {
      console.warn('Post already bookmarked:', post.id)
      return false
    }

    const bookmarkedPost = { ...post, isBookmarked: true }
    bookmarkedPosts.value.unshift(bookmarkedPost) 
    saveToStorage()
    return true
  }

  function removeBookmark(postId) {
    const index = bookmarkedPosts.value.findIndex(p => p.id === postId)
    if (index === -1) {
      console.warn('Post not found in bookmarks:', postId)
      return false
    }

    bookmarkedPosts.value.splice(index, 1)
    saveToStorage()
    return true
  }

  function toggleBookmark(post) {
    if (!post || !post.id) {
      console.error('Invalid post object for toggle bookmark')
      return false
    }

    if (isBookmarked(post.id)) {
      return removeBookmark(post.id)
    } else {
      return addBookmark(post)
    }
  }

  function clearAllBookmarks() {
    if (confirm('Hapus semua bookmark? Tindakan ini tidak dapat dibatalkan.')) {
      bookmarkedPosts.value = []
      saveToStorage()
      return true
    }
    return false
  }

  function getBookmarkedPost(postId) {
    return bookmarkedPosts.value.find(p => p.id === postId)
  }

  function loadFromStorage() {
    isLoading.value = true
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          bookmarkedPosts.value = parsed
          console.log(`Loaded ${parsed.length} bookmarks from storage`)
        } else {
          console.warn('Invalid bookmark data in storage, resetting')
          bookmarkedPosts.value = []
        }
      }
    } catch (error) {
      console.error('Failed to load bookmarks from localStorage:', error)
      bookmarkedPosts.value = []
    } finally {
      isLoading.value = false
    }
  }

  function saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedPosts.value))
    } catch (error) {
      console.error('Failed to save bookmarks to localStorage:', error)
    }
  }

  function syncBookmarkStatus(posts) {
    if (!Array.isArray(posts)) return posts

    return posts.map(post => ({
      ...post,
      isBookmarked: isBookmarked(post.id)
    }))
  }

  return {
    // State
    bookmarkedPosts,
    isLoading,
    // Getters
    bookmarkCount,
    bookmarkedIds,
    hasBookmarks,
    // Actions
    isBookmarked,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAllBookmarks,
    getBookmarkedPost,
    loadFromStorage,
    saveToStorage,
    syncBookmarkStatus
  }
})
