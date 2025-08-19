<template>
  <section class="w-full bg-slate-900 py-8 border-t border-slate-700/50">
    <div class="w-full max-w-7xl mx-auto px-8">
      <div class="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
        <!-- Status and Update Info -->
        <div class="flex items-center space-x-6">
          <div class="flex items-center space-x-3">
            <div class="relative">
              <div class="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
              <div
                class="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"
              ></div>
            </div>
            <span class="text-lg font-bold text-green-400">Available for Hire</span>
          </div>
          <div class="hidden lg:block w-px h-6 bg-slate-600"></div>
          <div class="text-slate-400">
            <span class="font-semibold">Last updated:</span>
            <span class="text-slate-300">{{ formattedDate }}</span>
          </div>
        </div>

        <!-- Location and Info -->
        <div class="flex items-center space-x-8 text-slate-400">
          <div class="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <span class="text-xl">📍</span>
            <span class="font-medium">Dhaka, Bangladesh</span>
          </div>
          <div class="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <span class="text-xl">⏰</span>
            <span class="font-medium">GMT+6</span>
          </div>
          <div class="flex items-center space-x-2 hover:text-slate-300 transition-colors">
            <span class="text-xl">☕</span>
            <span class="font-medium">{{ coffeeLevel }}% Coffee Level</span>
          </div>
        </div>
      </div>

      <!-- Bottom Credits -->
      <div
        class="mt-8 pt-8 border-t border-slate-700/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
      >
        <div class="text-slate-500 text-sm">
          <span>© {{ currentYear }} Fahad Hossain. Built with </span>
          <span class="text-red-400">♥</span>
          <span> using Vue.js & Tailwind CSS</span>
        </div>

        <div class="flex items-center space-x-6 text-sm">
          <a
            href="mailto:fahadshuvo33@gmail.com"
            class="text-slate-400 hover:text-blue-400 transition-colors flex items-center space-x-1"
          >
            <span>📧</span>
            <span>Email</span>
          </a>
          <a
            href="https://github.com/yourusername"
            target="_blank"
            class="text-slate-400 hover:text-blue-400 transition-colors flex items-center space-x-1"
          >
            <span>🔗</span>
            <span>GitHub</span>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            class="text-slate-400 hover:text-blue-400 transition-colors flex items-center space-x-1"
          >
            <span>📄</span>
            <span>Resume</span>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const currentYear = new Date().getFullYear()
const coffeeLevel = ref(87)

// Format current date
const formattedDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

// Simulate dynamic coffee level (optional fun feature)
const updateCoffeeLevel = () => {
  // Simulate coffee consumption throughout the day
  const hour = new Date().getHours()
  if (hour >= 6 && hour <= 10) {
    coffeeLevel.value = Math.floor(Math.random() * 20) + 80 // 80-100% morning
  } else if (hour >= 11 && hour <= 16) {
    coffeeLevel.value = Math.floor(Math.random() * 30) + 60 // 60-90% afternoon
  } else {
    coffeeLevel.value = Math.floor(Math.random() * 40) + 20 // 20-60% evening/night
  }
}

onMounted(() => {
  updateCoffeeLevel()
  // Update coffee level every hour (optional)
  // setInterval(updateCoffeeLevel, 3600000)
})
</script>

<style scoped>
/* Custom pulse animation for status indicator */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@keyframes ping {
  75%,
  100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>
