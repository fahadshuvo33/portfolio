// src/composables/useTheme.ts
import { ref, computed } from 'vue'

export type ThemeName = 'dark' | 'light' | 'midnight' | 'ocean'

export interface Theme {
  name: ThemeName
  bg: {
    primary: string
    secondary: string
    tertiary: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
    accent: string
  }
  border: string
  accent: string
}

const themes: Record<ThemeName, Theme> = {
  dark: {
    name: 'dark',
    bg: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      tertiary: 'bg-gray-700',
    },
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      muted: 'text-gray-500',
      accent: 'text-green-400',
    },
    border: 'border-gray-700',
    accent: 'bg-green-600',
  },
  light: {
    name: 'light',
    bg: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
    },
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      muted: 'text-gray-500',
      accent: 'text-green-600',
    },
    border: 'border-gray-300',
    accent: 'bg-green-600',
  },
  midnight: {
    name: 'midnight',
    bg: {
      primary: 'bg-slate-950',
      secondary: 'bg-slate-900',
      tertiary: 'bg-slate-800',
    },
    text: {
      primary: 'text-slate-100',
      secondary: 'text-slate-300',
      muted: 'text-slate-500',
      accent: 'text-purple-400',
    },
    border: 'border-slate-700',
    accent: 'bg-purple-600',
  },
  ocean: {
    name: 'ocean',
    bg: {
      primary: 'bg-blue-950',
      secondary: 'bg-blue-900',
      tertiary: 'bg-blue-800',
    },
    text: {
      primary: 'text-blue-100',
      secondary: 'text-blue-200',
      muted: 'text-blue-400',
      accent: 'text-cyan-400',
    },
    border: 'border-blue-700',
    accent: 'bg-cyan-600',
  },
}

// Global theme state
const currentTheme = ref<ThemeName>('dark')

export function useTheme() {
  // Computed theme object
  const theme = computed(() => themes[currentTheme.value])

  // Set specific theme
  const setTheme = (name: ThemeName) => {
    // Update state
    currentTheme.value = name

    // Save to localStorage
    localStorage.setItem('portfolio-theme', name)

    // Remove old theme classes
    document.documentElement.classList.remove(
      'theme-dark',
      'theme-light',
      'theme-midnight',
      'theme-ocean',
    )

    // Add new theme class
    document.documentElement.classList.add(`theme-${name}`)

    // Add transition class
    document.documentElement.classList.add('theme-transition')
  }

  // Toggle through themes
  const toggleTheme = () => {
    const themeOrder: ThemeName[] = ['dark', 'light', 'midnight', 'ocean']
    const currentIndex = themeOrder.indexOf(currentTheme.value)
    const nextIndex = (currentIndex + 1) % themeOrder.length
    setTheme(themeOrder[nextIndex])
  }

  // Initialize theme from localStorage
  const initTheme = () => {
    const savedTheme = localStorage.getItem('portfolio-theme') as ThemeName
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Use saved theme, system preference, or default to dark
    const initialTheme =
      savedTheme && themes[savedTheme] ? savedTheme : prefersDark ? 'dark' : 'light'

    setTheme(initialTheme)

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('portfolio-theme')) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  // Call init on composable creation
  initTheme()

  return {
    theme,
    currentTheme,
    themes,
    setTheme,
    toggleTheme,
  }
}
