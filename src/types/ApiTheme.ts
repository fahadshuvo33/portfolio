// src/composables/useTheme.ts
import { ref, computed } from 'vue'

export type ThemeName = 'dark' | 'light' | 'midnight'

const themes = {
  dark: {
    bg: 'bg-gray-900',
    bgSecondary: 'bg-gray-800',
    bgTertiary: 'bg-gray-700',
    text: 'text-gray-100',
    textSecondary: 'text-gray-300',
    textMuted: 'text-gray-500',
    border: 'border-gray-700',
    ring: 'ring-gray-600',
    hover: 'hover:bg-gray-600',
  },
  light: {
    bg: 'bg-gray-50',
    bgSecondary: 'bg-white',
    bgTertiary: 'bg-gray-100',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
    textMuted: 'text-gray-500',
    border: 'border-gray-200',
    ring: 'ring-gray-300',
    hover: 'hover:bg-gray-200',
  },
  midnight: {
    bg: 'bg-slate-950',
    bgSecondary: 'bg-slate-900',
    bgTertiary: 'bg-slate-800',
    text: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    border: 'border-slate-700',
    ring: 'ring-slate-600',
    hover: 'hover:bg-slate-700',
  },
}

const currentTheme = ref<ThemeName>('dark')

export function useTheme() {
  const theme = computed(() => themes[currentTheme.value])

  const toggleTheme = () => {
    const themeOrder: ThemeName[] = ['dark', 'light', 'midnight']
    const currentIndex = themeOrder.indexOf(currentTheme.value)
    currentTheme.value = themeOrder[(currentIndex + 1) % themeOrder.length]
    localStorage.setItem('api-theme', currentTheme.value)
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('api-theme') as ThemeName
  if (savedTheme && themes[savedTheme]) {
    currentTheme.value = savedTheme
  }

  return {
    theme,
    currentTheme,
    toggleTheme,
  }
}
