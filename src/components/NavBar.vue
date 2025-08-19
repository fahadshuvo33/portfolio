<template>
  <div
    :class="[
      'fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500',
      isVisible ? 'translate-y-4' : '-translate-y-20',
    ]"
  >
    <nav class="relative">
      <!-- Subtle shadow/glow -->
      <div
        class="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-md"
      ></div>

      <!-- Glassmorphism Background -->
      <div
        class="absolute inset-0 bg-white/80 dark:bg-black/50 backdrop-blur-xl rounded-full shadow-lg border border-white/20 dark:border-white/10"
      ></div>

      <!-- Navigation Content - Compact -->
      <div class="relative flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2">
        <!-- Coding Icon/Home -->
        <button
          @click="$emit('go-home')"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
          title="Go to home"
        >
          <svg
            class="w-5 h-5 text-purple-600 dark:text-purple-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:inline"
            >Fahad</span
          >
        </button>

        <!-- Divider - Hidden on mobile -->
        <div class="w-px h-6 bg-slate-300/30 dark:bg-slate-700/30 hidden sm:block"></div>

        <!-- GraphQL API Link - Hidden on mobile -->
        <router-link
          to="/graphql"
          class="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200"
          title="GraphQL API Example"
        >
          <svg
            class="w-5 h-5 text-pink-600 dark:text-pink-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          <span class="text-sm font-medium text-slate-700 dark:text-slate-200">API</span>
        </router-link>

        <div class="w-px h-6 bg-slate-300/30 dark:bg-slate-700/30 hidden sm:block"></div>

        <!-- Available Status - Responsive -->
        <div class="flex items-center gap-1.5 px-2 sm:px-3 py-1.5">
          <div class="relative flex h-2 w-2">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"
            ></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span
            class="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline"
            >Open to work</span
          >
          <span class="text-xs font-medium text-slate-600 dark:text-slate-300 sm:hidden">Open</span>
        </div>

        <!-- Divider - Hidden on mobile -->
        <div class="w-px h-6 bg-slate-300/30 dark:bg-slate-700/30 hidden sm:block"></div>

        <!-- Contact Button - Responsive -->
        <button
          @click="openGmail"
          class="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all duration-200 text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <span class="hidden sm:inline">Contact</span>
          <span class="sm:hidden">Email</span>
        </button>

        <!-- Theme Toggle - Fixed -->
        <button
          @click="$emit('toggle-theme')"
          class="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200"
          title="Toggle theme"
        >
          <div class="relative w-4 h-4">
            <!-- Sun Icon -->
            <svg
              :class="[
                'absolute inset-0 transform transition-all duration-300',
                isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
              ]"
              class="text-amber-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clip-rule="evenodd"
              />
            </svg>

            <!-- Moon Icon -->
            <svg
              :class="[
                'absolute inset-0 transform transition-all duration-300',
                isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0',
              ]"
              class="text-slate-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>
        </button>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  currentView: 'home' | 'terminal' | 'docs'
  isDark: boolean
}

defineProps<Props>()
defineEmits<{
  navigate: [view: 'terminal' | 'docs']
  'toggle-theme': []
  'go-home': []
}>()

// Auto-hide functionality
const isVisible = ref(true)
const lastScrollY = ref(0)

const handleScroll = () => {
  const currentScrollY = window.scrollY

  if (currentScrollY <= 10) {
    isVisible.value = true
  } else if (currentScrollY > lastScrollY.value && currentScrollY > 60) {
    isVisible.value = false
  } else if (currentScrollY < lastScrollY.value) {
    isVisible.value = true
  }

  lastScrollY.value = currentScrollY
}

const openGmail = () => {
  // Replace with your actual email
  window.location.href = 'mailto:your.email@gmail.com?subject=Project Inquiry&body=Hi Fahad,'
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
