<!-- src/components/api/Analytics.vue -->
<template>
  <div :class="[theme.bg.secondary, 'rounded-lg p-4 h-full']">
    <h3
      :class="[theme.text.secondary, 'text-sm font-medium mb-4 flex items-center gap-2']"
      style="margin-bottom: 1rem"
    >
      <span>📊</span>
      Query Analytics
    </h3>

    <div class="flex flex-col gap-4">
      <!-- Top Row: Total Queries & Unique Fields -->
      <div class="flex gap-4">
        <div class="bg-white/5 rounded-md p-3 text-center flex-1">
          <p :class="[theme.text.muted, 'text-xs mb-1']">Total Queries</p>
          <p :class="[theme.text.primary, 'text-2xl font-bold']">
            {{ stats.totalQueries || 0 }}
          </p>
        </div>
        <div class="bg-white/5 rounded-md p-3 text-center flex-1">
          <p :class="[theme.text.muted, 'text-xs mb-1']">Unique Fields</p>
          <p :class="[theme.text.primary, 'text-2xl font-bold']">
            {{ stats.uniqueFieldsCount || 0 }}
          </p>
        </div>
      </div>

      <!-- Middle Row: Hidden Fields & Invalid Attempts -->
      <div class="flex gap-4">
        <div class="bg-white/5 rounded-md p-3 text-center flex-1">
          <p :class="[theme.text.muted, 'text-xs mb-1']">Hidden Fields</p>
          <p class="text-2xl font-bold text-purple-400">
            {{ stats.hiddenFieldsFound || 0 }}
          </p>
        </div>
        <div class="bg-white/5 rounded-md p-3 text-center flex-1">
          <p :class="[theme.text.muted, 'text-xs mb-1']">Invalid Attempts</p>
          <p class="text-2xl font-bold text-red-400">
            {{ stats.invalidFieldsAttempted || 0 }}
          </p>
        </div>
      </div>

      <!-- Bottom Row: Session Duration (Full Width) -->
      <div class="bg-white/5 rounded-md p-3 text-center">
        <p :class="[theme.text.muted, 'text-xs mb-1']">Session Duration</p>
        <p :class="[theme.text.primary, 'text-3xl font-bold font-mono tracking-wider']">
          {{ formatSessionTime(sessionSeconds) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Props {
  stats: {
    totalQueries: number
    hiddenFieldsFound: number
    invalidFieldsAttempted: number
    uniqueFieldsCount: number
    sessionMinutes: number
    recentQueries?: Array<{
      query: string
      timestamp: Date
      mode: string
      hiddenFieldsFound: string[]
      invalidFieldsAttempted: string[]
      totalFieldsRequested: number
    }>
  }
  theme: any
  achievements?: any[]
}

defineProps<Props>()

// Session timer
const sessionSeconds = ref(0)
const sessionStart = Date.now()
let timerInterval: number | null = null

// Format session time as MM:SS or HH:MM:SS
const formatSessionTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

// Start session timer
onMounted(() => {
  timerInterval = setInterval(() => {
    sessionSeconds.value = Math.floor((Date.now() - sessionStart) / 1000)
  }, 1000)
})

// Cleanup timer
onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<style scoped>
/* Subtle hover effects for cards */
.bg-white\/5:hover {
  background-color: rgba(255, 255, 255, 0.08);
  transition: all 0.2s ease;
}

/* Timer glow effect */
.font-mono {
  text-shadow: 0 0 8px rgba(147, 197, 253, 0.2);
}

/* Color accents for specific metrics */
.text-purple-400 {
  color: #c084fc;
}

.text-red-400 {
  color: #f87171;
}
</style>
