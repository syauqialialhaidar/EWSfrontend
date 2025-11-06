import { ref, watchEffect } from 'vue';

// State: 'light', 'dark', or 'system'
export const theme = ref(localStorage.getItem('theme') || 'system');

export function toggleTheme() {
  // Simple toggle for this implementation: light -> dark -> light
  const newTheme = theme.value === 'light' ? 'dark' : 'light';
  theme.value = newTheme;
}

// Watch for changes in the theme and apply/remove the 'dark' class to the <html> element
watchEffect(() => {
  const isDark =
    theme.value === 'dark' ||
    (theme.value === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);
  console.log('Dark mode toggled:', isDark);

  // Save preference to localStorage
  localStorage.setItem('theme', theme.value);
});