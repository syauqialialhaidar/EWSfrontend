import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'ews-bookmarked-posts'

export const useBookmarkStore = defineStore('bookmark', () => {
  const bookmarkedPosts = ref([])
  const bookmarksCount = computed(() => bookmarkedPosts.value.length)
  const bookmarkIds = computed(() =>
    new Set(bookmarkedPosts.value.map(post => post.id))
  )

  const isBookmarked = computed(() => (postId) => {
    return bookmarkIds.value.has(postId)
  })

  const bookmarksByTopic = computed(() => {
    const grouped = {}
    bookmarkedPosts.value.forEach(post => {
      const topic = post.topicTag || 'Other'
      if (!grouped[topic]) {
        grouped[topic] = []
      }
      grouped[topic].push(post)
    })
    return grouped
  })

  const recentBookmarks = computed(() => {
    return [...bookmarkedPosts.value]
      .sort((a, b) => {
        const dateA = new Date(a.bookmarkedAt || 0)
        const dateB = new Date(b.bookmarkedAt || 0)
        return dateB - dateA
      })
      .slice(0, 10)
  })

  function loadBookmarks() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        bookmarkedPosts.value = JSON.parse(saved)
      }
    } catch (error) {
      console.error('Failed to load bookmarks:', error)
      bookmarkedPosts.value = []
    }
  }

  function saveBookmarks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarkedPosts.value))
    } catch (error) {
      console.error('Failed to save bookmarks:', error)
    }
  }

  function addBookmark(post) {
    if (!post || !post.id) {
      console.error('Invalid post object')
      return false
    }

    if (isBookmarked.value(post.id)) {
      console.log('Post already bookmarked')
      return false
    }

    const bookmarkedPost = {
      ...post,
      bookmarkedAt: new Date().toISOString(),
      isBookmarked: true
    }

    bookmarkedPosts.value.unshift(bookmarkedPost)
    saveBookmarks()
    return true
  }

  function removeBookmark(postId) {
    const index = bookmarkedPosts.value.findIndex(p => p.id === postId)
    if (index !== -1) {
      bookmarkedPosts.value.splice(index, 1)
      saveBookmarks()
      return true
    }
    return false
  }

  function toggleBookmark(post) {
    if (!post || !post.id) {
      console.error('Invalid post object')
      return false
    }

    if (isBookmarked.value(post.id)) {
      return removeBookmark(post.id)
    } else {
      return addBookmark(post)
    }
  }

  function clearAllBookmarks() {
    bookmarkedPosts.value = []
    saveBookmarks()
  }

  function clearBookmarksByTopic(topic) {
    bookmarkedPosts.value = bookmarkedPosts.value.filter(
      post => post.topicTag !== topic
    )
    saveBookmarks()
  }

  function getBookmark(postId) {
    return bookmarkedPosts.value.find(p => p.id === postId)
  }

  loadBookmarks()

  return {
    // State
    bookmarkedPosts,
    // Getters
    bookmarksCount,
    bookmarkIds,
    isBookmarked,
    bookmarksByTopic,
    recentBookmarks,
    // Actions
    loadBookmarks,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    clearAllBookmarks,
    clearBookmarksByTopic,
    getBookmark
  }
})
