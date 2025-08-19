<template>
  <section class="relative mx-auto flex items-center justify-center overflow-hidden mb-0 pb-0">
    <!-- Main Content -->
    <div class="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:pt-8 lg:pt-10">
      <div class="flex flex-col items-center justify-center gap-y-3">
        <!-- ASCII Name -->
        <div class="w-full flex justify-center overflow-hidden">
          <div class="transform scale-75 sm:scale-85 md:scale-95 lg:scale-100 origin-center">
            <DynamicAsciiName
              start-animation="dissolve"
              :start-speed="150"
              outline-color="#0F0F0F"
            />
          </div>
        </div>

        <!-- Role Title -->
        <div class="text-center w-full">
          <div class="h-10 sm:h-12 md:h-14 lg:h-16 xl:h-20 flex items-center justify-center">
            <transition name="fade" mode="out-in">
              <h1
                :key="'role-' + currentRoleIndex"
                class="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-black leading-tight"
              >
                <span
                  class="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent min-w-0 inline-block"
                >
                  {{ roles[currentRoleIndex] }}
                </span>
              </h1>
            </transition>
          </div>
        </div>

        <!-- Status Row -->
        <div
          class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 w-full"
        >
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"
            ></div>
            <div
              class="relative flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/80 rounded-full border border-green-500/30"
            >
              <div class="relative">
                <div
                  class="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"
                ></div>
                <div
                  class="absolute inset-0 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-ping"
                ></div>
              </div>
              <span class="text-green-300 font-medium text-xs">Available for hire</span>
            </div>
          </div>

          <div
            class="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-900/40 backdrop-blur-sm rounded-full border border-white/10"
          >
            <div class="w-3 h-3 text-purple-400">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                />
              </svg>
            </div>
            <span class="text-gray-300 font-medium text-xs">Dhaka, Bangladesh</span>
          </div>
        </div>

        <!-- Bio -->
        <div class="w-full text-center">
          <p
            class="text-xs sm:text-sm md:text-base text-gray-300 max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl mx-auto leading-relaxed font-light text-center"
          >
            {{ bioText }}
          </p>
        </div>

        <!-- Stats -->
        <div class="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <div class="text-center group cursor-pointer">
              <div class="relative">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-30 transition duration-300"
                ></div>
                <div
                  class="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/5 group-hover:border-green-400/30 transition-all duration-300"
                >
                  <div
                    class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300"
                  >
                    5+
                  </div>
                  <div class="text-gray-400 font-medium text-xs sm:text-sm">Years Experience</div>
                </div>
              </div>
            </div>

            <div class="text-center group cursor-pointer">
              <div class="relative">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl opacity-0 group-hover:opacity-30 transition duration-300"
                ></div>
                <div
                  class="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/5 group-hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div
                    class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300"
                  >
                    50+
                  </div>
                  <div class="text-gray-400 font-medium text-xs sm:text-sm">Projects Completed</div>
                </div>
              </div>
            </div>

            <div class="text-center group cursor-pointer sm:col-span-2 lg:col-span-1">
              <div class="relative">
                <div
                  class="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl opacity-0 group-hover:opacity-30 transition duration-300"
                ></div>
                <div
                  class="relative bg-slate-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 lg:p-6 border border-white/5 group-hover:border-amber-400/30 transition-all duration-300"
                >
                  <div
                    class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent mb-1 sm:mb-2 group-hover:scale-110 transition-transform duration-300 flex items-center justify-center gap-2"
                  >
                    <span>∞</span>
                    <span class="text-base sm:text-lg md:text-xl lg:text-2xl">☕</span>
                  </div>
                  <div class="text-gray-400 font-medium text-xs sm:text-sm">Coffee Consumed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Buttons -->
        <div
          class="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 w-full"
        >
          <!-- Download Resume Button -->
          <a
            @click="downloadCV"
            href="#"
            class="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-[1px] hover:from-green-400 hover:to-emerald-500 transition-all duration-300"
          >
            <div
              class="relative flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-slate-900 rounded-[11px] group-hover:bg-transparent transition-all duration-300"
            >
              <div
                class="w-3 h-3 sm:w-4 sm:h-4 text-green-400 group-hover:text-white transition-colors duration-300"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <span
                class="text-green-400 group-hover:text-white font-semibold text-xs sm:text-sm transition-colors duration-300"
                >Download Resume</span
              >
            </div>
          </a>

          <!-- GitHub Button -->
          <a
            href="https://github.com/fahadhossain"
            target="_blank"
            class="group relative overflow-hidden bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-[1px] hover:from-gray-400 hover:to-gray-500 transition-all duration-300"
          >
            <div
              class="relative flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-slate-900 rounded-[11px] group-hover:bg-transparent transition-all duration-300"
            >
              <div
                class="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-white transition-colors duration-300"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                  />
                </svg>
              </div>
              <span
                class="text-gray-400 group-hover:text-white font-semibold text-xs sm:text-sm transition-colors duration-300"
                >GitHub</span
              >
            </div>
          </a>

          <!-- LinkedIn Button -->
          <a
            href="https://linkedin.com/in/fahadhossain"
            target="_blank"
            class="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-[1px] hover:from-blue-400 hover:to-blue-500 transition-all duration-300"
          >
            <div
              class="relative flex items-center justify-center gap-2 px-4 sm:px-5 lg:px-6 py-2 sm:py-2.5 bg-slate-900 rounded-[11px] group-hover:bg-transparent transition-all duration-300"
            >
              <div
                class="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 group-hover:text-white transition-colors duration-300"
              >
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
                  />
                </svg>
              </div>
              <span
                class="text-blue-400 group-hover:text-white font-semibold text-xs sm:text-sm transition-colors duration-300"
                >LinkedIn</span
              >
            </div>
          </a>
        </div>

        <!-- Contact Info -->
        <div class="text-center w-full">
          <div
            class="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-4 lg:gap-6 text-gray-300"
          >
            <div
              class="flex items-center gap-2 group hover:text-cyan-300 transition-colors duration-300"
            >
              <div
                class="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-medium">fahad@example.com</span>
            </div>
            <div
              class="flex items-center gap-2 group hover:text-green-300 transition-colors duration-300"
            >
              <div
                class="w-3 h-3 sm:w-4 sm:h-4 text-green-400 group-hover:scale-110 transition-transform duration-300"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <span class="text-xs sm:text-sm font-medium">+1 (555) 123-4567</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import DynamicAsciiName from '@/components/AsciiName.vue'

const roles = ['Python Developer', 'Django Developer', 'API Developer']
const currentRoleIndex = ref(0)

let intervalId: number | undefined = undefined

onMounted(() => {
  // Change role every 3 seconds with smooth fade transition
  intervalId = window.setInterval(() => {
    currentRoleIndex.value = (currentRoleIndex.value + 1) % roles.length
  }, 3000)
})

onBeforeUnmount(() => {
  if (intervalId !== undefined) {
    clearInterval(intervalId)
  }
})

const bioText = ref(
  'Passionate about crafting elegant digital solutions that make a difference. I transform ideas into scalable, user-friendly applications using modern web technologies. With expertise in Python, Django, and API development, I create robust backend systems that power amazing user experiences.',
)

const downloadCV = (event: Event) => {
  event.preventDefault()
  const link = document.createElement('a')
  link.href = '/fahad-hossain-resume.pdf'
  link.download = 'Fahad_Hossain_Resume.pdf'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
/* Fade transition for role text */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* Existing animations */
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes gradient-fast {
  0%,
  100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient-fast {
  animation: gradient-fast 4s ease infinite;
}
</style>
