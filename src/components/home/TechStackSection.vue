<template>
  <section class="relative pt-8">
    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center justify-center gap-y-8">
        <!-- Section Title -->
        <div class="text-center w-full">
          <h2
            class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white leading-tight mb-4"
          >
            Tech Stack &
            <span
              class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            >
              Expertise
            </span>
          </h2>
          <p
            class="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed font-light"
          >
            Technologies I work with to build amazing solutions
          </p>
        </div>

        <!-- Tech Grid -->
        <div class="w-full max-w-5xl mx-auto">
          <div
            class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
          >
            <div v-for="tech in techStack" :key="tech.name" class="group cursor-pointer">
              <div class="relative">
                <!-- Glass card with glassmorphism effect -->
                <div
                  class="relative bg-white/5 backdrop-blur-md rounded-xl p-3 sm:p-4 lg:p-6 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group-hover:shadow-cyan-500/20"
                >
                  <div class="text-center">
                    <div
                      class="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300"
                    >
                      {{ tech.icon }}
                    </div>
                    <div
                      class="font-black text-white text-xs sm:text-sm mb-1 group-hover:scale-105 transition-transform duration-300"
                    >
                      {{ tech.name }}
                    </div>
                    <div class="text-gray-400 font-medium text-xs">{{ tech.category }}</div>
                  </div>

                  <!-- Subtle glow effect on hover -->
                  <div
                    class="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-400/0 via-purple-400/0 to-pink-400/0 group-hover:from-cyan-400/5 group-hover:via-purple-400/5 group-hover:to-pink-400/5 transition-all duration-300"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const techStack = ref([
  { name: 'Python', icon: '🐍', category: 'Language' },
  { name: 'Django', icon: '🎯', category: 'Framework' },
  { name: 'FastAPI', icon: '⚡', category: 'Framework' },
  { name: 'PostgreSQL', icon: '🐘', category: 'Database' },
  { name: 'Docker', icon: '🐳', category: 'DevOps' },
  { name: 'Vue.js', icon: '💚', category: 'Frontend' },
  { name: 'Redis', icon: '🔴', category: 'Cache' },
  { name: 'Git', icon: '📝', category: 'Version Control' },
  { name: 'Linux', icon: '🐧', category: 'OS' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'REST API', icon: '🔗', category: 'API' },
  { name: 'GraphQL', icon: '📊', category: 'API' },
])
</script>
