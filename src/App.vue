<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900" role="application">
    <!-- Skip navigation link for accessibility -->
    <a
      href="#main-content"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
    >
      Skip to main content
    </a>

    <!-- Loading overlay -->
    <transition name="fade">
      <div v-if="isLoading" class="loading-overlay">
        <Spinner />
      </div>
    </transition>

    <!-- Main content -->
    <!-- Main content -->
    <main id="main-content" class="relative">
      <LoadingSpinner v-if="isLoading" />
      <router-view v-slot="{ Component }">
        <transition
          name="page"
          mode="out-in"
          @before-leave="startLoading"
          @after-enter="finishLoading"
        >
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onErrorCaptured, nextTick, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Spinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const isLoading = ref(false)
const minimumLoadingTime = 300 // ms

let loadingTimer: ReturnType<typeof setTimeout> | null = null

const startLoading = () => {
  console.log('[App] Starting loading...')
  isLoading.value = true
}

const finishLoading = () => {
  console.log('[App] Finishing loading...')
  // Ensure minimum loading time for smooth UX
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
  loadingTimer = setTimeout(() => {
    isLoading.value = false
  }, minimumLoadingTime)
}

// Transition handlers - removed unused functions as they're not being used

// Router navigation guards
router.beforeEach(async (to, from, next) => {
  console.log(`[App] Navigation started: ${from.path} → ${to.path}`)

  // Only show loading for actual route changes
  if (to.path !== from.path) {
    startLoading()
  }

  // Small delay to ensure loading state is visible
  await nextTick()
  next()
})

router.afterEach(() => {
  console.log('[App] Navigation complete')
  // Don't finish loading here - wait for component to mount
})

// Error handling
onErrorCaptured((err, instance, info) => {
  console.error('[App] Error captured:', err, info)
  finishLoading()
  return false
})

// Cleanup
onUnmounted(() => {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
})
</script>

<style>
/* CSS Variables */
:root {
  --theme-bg-tertiary: #f3f4f6;
  --theme-text-muted: #9ca3af;
  --theme-text-secondary: #6b7280;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    --theme-bg-tertiary: #1f2937;
    --theme-text-muted: #6b7280;
    --theme-text-secondary: #9ca3af;
  }
}

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

@media (prefers-color-scheme: dark) {
  .loading-overlay {
    background: rgba(17, 24, 39, 0.95);
  }
}

/* Fade transition for loading overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Page transition styles */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom themed scrollbar */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--theme-bg-tertiary);
}

::-webkit-scrollbar-thumb {
  background: var(--theme-text-muted);
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--theme-text-secondary);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--theme-text-muted) var(--theme-bg-tertiary);
}

/* Accessibility: Screen reader only content */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.focus\:not-sr-only:focus {
  position: absolute;
  width: auto;
  height: auto;
  padding: 0.5rem 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
</style>
