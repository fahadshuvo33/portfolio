<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      @click.self="$emit('close')"
    >
      <div
        class="bg-gray-900 border border-gray-700/50 rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl animate-slide-up"
      >
        <!-- Header -->
        <div
          class="bg-gray-800/80 px-6 py-4 flex items-center justify-between border-b border-gray-700/50"
        >
          <div class="flex items-center gap-3">
            <div
              class="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0"
            >
              <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-white text-lg font-semibold leading-tight">API Explorer Guide</h3>
              <p class="text-gray-400 text-sm mt-1">
                Learn how to query portfolio data effectively
              </p>
            </div>
          </div>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-700/50 transition-colors duration-200 flex-shrink-0"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="overflow-y-auto max-h-[calc(90vh-140px)] custom-scrollbar">
          <div class="p-6 space-y-8">
            <!-- Quick Start Section -->
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-green-400"
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
                </div>
                <h4 class="text-white font-semibold text-lg">Quick Start</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  class="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 flex flex-col"
                >
                  <!-- Fixed alignment for number and title -->
                  <div class="flex items-start gap-4 mb-4">
                    <div
                      class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-blue-400 font-bold text-sm">1</span>
                    </div>
                    <h5 class="text-white font-medium leading-8">Select Query Mode</h5>
                  </div>
                  <p class="text-gray-400 text-sm leading-relaxed flex-grow">
                    Choose from predefined categories (about, skills, projects) or use freestyle
                    mode for custom queries.
                  </p>
                </div>

                <div
                  class="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 flex flex-col"
                >
                  <!-- Fixed alignment for number and title -->
                  <div class="flex items-start gap-4 mb-4">
                    <div
                      class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-purple-400 font-bold text-sm">2</span>
                    </div>
                    <h5 class="text-white font-medium leading-8">Build Your Query</h5>
                  </div>
                  <p class="text-gray-400 text-sm leading-relaxed flex-grow">
                    Type field names directly or click fields in the documentation panel to build
                    your query automatically.
                  </p>
                </div>

                <div
                  class="bg-gray-800/50 p-5 rounded-xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 flex flex-col"
                >
                  <!-- Fixed alignment for number and title -->
                  <div class="flex items-start gap-4 mb-4">
                    <div
                      class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <span class="text-green-400 font-bold text-sm">3</span>
                    </div>
                    <h5 class="text-white font-medium leading-8">Execute & Explore</h5>
                  </div>
                  <p class="text-gray-400 text-sm leading-relaxed flex-grow mb-2">
                    Press
                    <kbd class="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300 mx-1"
                      >Ctrl+Enter</kbd
                    >
                    or click Execute to run your query and explore the results.
                  </p>
                </div>
              </div>
            </div>

            <!-- Key Features -->
            <div class="space-y-6">
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <h4 class="text-white font-semibold text-lg">Key Features</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Query Modes -->
                <div
                  class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 p-5 rounded-xl border border-blue-500/20 hover:border-blue-500/40 transition-all duration-300 flex flex-col"
                >
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-blue-400"
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
                    </div>
                    <h5 class="text-blue-300 font-medium leading-8">Query Modes</h5>
                  </div>
                  <div class="flex-grow">
                    <ul class="space-y-3 text-sm text-gray-300">
                      <li class="flex items-start gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"
                        ></span>
                        <span
                          ><span class="text-white font-medium">Category modes:</span> Quick access
                          to about, skills, projects, etc.</span
                        >
                      </li>
                      <li class="flex items-start gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"
                        ></span>
                        <span
                          ><span class="text-white font-medium">Freestyle mode:</span> Build any
                          custom query</span
                        >
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Data Security -->
                <div
                  class="bg-gradient-to-br from-purple-500/10 to-purple-600/5 p-5 rounded-xl border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 flex flex-col"
                >
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <h5 class="text-purple-300 font-medium leading-8">Data Security</h5>
                  </div>
                  <div class="flex-grow">
                    <ul class="space-y-3 text-sm text-gray-300">
                      <li class="flex items-start gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"
                        ></span>
                        <span>Hidden fields require discovery</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"
                        ></span>
                        <span>Read-only access - safe exploration</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Response Features -->
                <div
                  class="bg-gradient-to-br from-green-500/10 to-green-600/5 p-5 rounded-xl border border-green-500/20 hover:border-green-500/40 transition-all duration-300 flex flex-col"
                >
                  <div class="flex items-start gap-3 mb-4">
                    <div
                      class="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                    >
                      <svg
                        class="w-4 h-4 text-green-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h5 class="text-green-300 font-medium leading-8">Response Tools</h5>
                  </div>
                  <div class="flex-grow">
                    <ul class="space-y-3 text-sm text-gray-300">
                      <li class="flex items-start gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"
                        ></span>
                        <span>Pretty-printed JSON by default</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <span
                          class="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 flex-shrink-0"
                        ></span>
                        <span>Search & download responses</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Keyboard Shortcuts -->
            <div class="bg-gray-800/30 p-5 rounded-xl border border-gray-700/50 space-y-5">
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V4a1 1 0 011-1h3a1 1 0 011 1v1a2 2 0 104 0V4z"
                    />
                  </svg>
                </div>
                <h4 class="text-white font-semibold">Keyboard Shortcuts</h4>
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div class="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <kbd class="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-mono"
                    >Ctrl+Enter</kbd
                  >
                  <span class="text-gray-400 text-xs text-center">Execute query</span>
                </div>
                <div class="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <kbd class="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-mono"
                    >Ctrl+/</kbd
                  >
                  <span class="text-gray-400 text-xs text-center">Toggle comment</span>
                </div>
                <div class="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <kbd class="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-mono"
                    >Ctrl+F</kbd
                  >
                  <span class="text-gray-400 text-xs text-center">Find in editor</span>
                </div>
                <div class="flex flex-col items-center gap-3 p-4 bg-gray-800/50 rounded-lg">
                  <kbd class="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm font-mono"
                    >Esc</kbd
                  >
                  <span class="text-gray-400 text-xs text-center">Close modals</span>
                </div>
              </div>
            </div>

            <!-- Pro Tips -->
            <div
              class="bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-5 rounded-xl border border-blue-500/10 space-y-5"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-6 h-6 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0"
                >
                  <svg
                    class="w-4 h-4 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h4 class="text-white font-semibold">Pro Tips</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <h5 class="text-gray-300 font-medium flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-blue-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2v2M7 7h10"
                      />
                    </svg>
                    Query Building
                  </h5>
                  <ul class="space-y-3 text-sm text-gray-400">
                    <li class="flex items-start gap-2">
                      <span class="w-1 h-1 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Field names are case-insensitive</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="w-1 h-1 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Use the docs panel for field discovery</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="w-1 h-1 bg-blue-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Start broad, then refine your queries</span>
                    </li>
                  </ul>
                </div>
                <div class="space-y-4">
                  <h5 class="text-gray-300 font-medium flex items-center gap-2">
                    <svg
                      class="w-4 h-4 text-green-400"
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
                    Performance
                  </h5>
                  <ul class="space-y-3 text-sm text-gray-400">
                    <li class="flex items-start gap-2">
                      <span class="w-1 h-1 bg-green-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Request only the fields you need</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="w-1 h-1 bg-green-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Complex queries may take longer</span>
                    </li>
                    <li class="flex items-start gap-2">
                      <span class="w-1 h-1 bg-green-400 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span>Use response caching when available</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="bg-gray-800/50 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-gray-700/50"
        >
          <div class="flex items-center gap-2 text-gray-400 text-sm">
            <svg
              class="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Explore the documentation panel for detailed field references</span>
          </div>
          <button
            @click="$emit('close')"
            class="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all duration-200 shadow-lg flex-shrink-0"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
interface Props {
  theme: any
}

defineProps<Props>()
defineEmits(['close'])
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

/* Enhanced kbd styling */
kbd {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
  font-weight: 500;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Enhanced backdrop blur effect */
.backdrop-blur-sm {
  backdrop-filter: blur(8px) saturate(150%);
  -webkit-backdrop-filter: blur(8px) saturate(150%);
}

/* Improved hover effects */
.hover\:border-blue-500\/30:hover {
  border-color: rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.hover\:border-blue-500\/40:hover,
.hover\:border-purple-500\/40:hover,
.hover\:border-green-500\/40:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Better focus states for accessibility */
button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

kbd:focus {
  outline: 1px solid #3b82f6;
  outline-offset: 1px;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Button hover effects */
.bg-gradient-to-r:hover {
  box-shadow: 0 4px 14px 0 rgba(59, 130, 246, 0.3);
  transform: translateY(-1px);
}

/* Force spacing between sections */
.space-y-8 > * + * {
  margin-top: 2rem !important;
}

.space-y-6 > * + * {
  margin-top: 1.5rem !important;
}

.space-y-5 > * + * {
  margin-top: 1.25rem !important;
}

.space-y-4 > * + * {
  margin-top: 1rem !important;
}

.space-y-3 > * + * {
  margin-top: 0.75rem !important;
}

/* Better responsive spacing */
@media (max-width: 768px) {
  .grid-cols-1.md\:grid-cols-3,
  .grid-cols-1.md\:grid-cols-2 {
    gap: 1rem;
  }

  .grid-cols-2.sm\:grid-cols-4 {
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .space-y-8 > * + * {
    margin-top: 1.5rem !important;
  }
}

@media (max-width: 640px) {
  .grid-cols-2.sm\:grid-cols-4 {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .space-y-8 > * + * {
    margin-top: 1rem !important;
  }
}

/* Ensure proper flex behavior */
.flex-shrink-0 {
  flex-shrink: 0;
}

.flex-grow {
  flex-grow: 1;
}

/* Card hover effects */
.bg-gray-800\/50:hover {
  background-color: rgba(31, 41, 55, 0.6);
}

/* Better visual separation */
.rounded-xl {
  border-radius: 0.75rem;
}

/* Enhanced text contrast */
.text-gray-300 {
  color: rgb(209 213 219);
}

.text-gray-400 {
  color: rgb(156 163 175);
}
</style>
