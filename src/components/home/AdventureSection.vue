<template>
  <section class="relative w-full pt-4 sm:pt-6 lg:pt-8 overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0 z-0 pointer-events-none">
      <div
        class="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-r from-green-600/15 to-emerald-600/15 rounded-full blur-3xl animate-pulse"
      ></div>
      <div
        class="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-r from-blue-600/15 to-purple-600/15 rounded-full blur-3xl animate-pulse animation-delay-1000"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-600/10 to-teal-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000"
      ></div>
    </div>

    <!-- Container with forced margins -->
    <div class="relative z-10 w-full">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Section Header with forced spacing -->
        <div class="text-center" style="margin-bottom: 3rem">
          <div style="margin-bottom: 2rem">
            <h2
              class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white"
              style="margin-bottom: 2rem"
            >
              Choose Your
              <span
                class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
              >
                Adventure
              </span>
            </h2>
          </div>
          <div style="margin-bottom: -10">
            <p
              class="text-sm sm:text-base md:text-lg text-gray-300 mx-auto leading-relaxed font-light max-w-none sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl"
            >
              Explore my portfolio in your preferred style - command-line for the tech-savvy or
              structured docs for the detail-oriented.
            </p>
          </div>
        </div>

        <!-- Cards Grid with forced spacing -->
        <div class="grid grid-cols-1 lg:grid-cols-2" style="gap: 2rem">
          <!-- Terminal Card -->
          <div class="group relative h-full">
  <div
    class="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl opacity-0 group-hover:opacity-25 transition duration-500"
  ></div>
  <div
    class="relative bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-green-400/40 transition-all duration-500 h-full flex flex-col"
    style="padding: 2rem"
  >
    <!-- Terminal Header - Matrix Style -->
    <div class="terminal-preview-window overflow-hidden rounded-xl" style="margin-bottom: 1.5rem">
      <!-- Window Controls -->
      <div
        class="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-green-400/20"
      >
        <div class="flex items-center space-x-3">
          <div class="flex space-x-1.5">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span class="text-green-400 text-sm font-mono">fahad@portfolio:~$</span>
        </div>
        <span class="text-green-400/50 text-xs font-mono">matrix</span>
      </div>

      <!-- Terminal Body -->
      <div class="bg-black p-5 font-mono text-sm space-y-3 relative overflow-hidden rounded-b-xl">
        <!-- Matrix rain effect hint -->
        <div class="absolute inset-0 opacity-5">
          <div class="text-green-400 text-xs leading-none">
            01011010 11001 0101<br />
            10110 01101 11010<br />
            01010 10011 01101
          </div>
        </div>

        <!-- Terminal Content -->
        <div class="relative z-10">
          <!-- ASCII Welcome - Much Smaller and One Line -->
          <div class="text-green-400 text-xs mb-4 text-center">
            <pre class="inline-block leading-tight">
╔══════════════════════════════════════════════════════╗
║    ╔═╗┌─┐┬ ┬┌─┐┌─┬┌─┐  ╔═╗┌─┐┬─┐┌┬┐┌─┐┌─┐┬  ┬┌─┐     ║
║    ╠╣ ├─┤├─┤├─┤│ │└─┐  ╠═╝│ │├┬┘ │ ├┤ │ ││  ││ │     ║
║    ╚  ┴ ┴┴ ┴┴ ┴┴─┴──┘  ╩  └─┘┴└─ ┴ └  └─┘┴─┘┴└─┘     ║
╚══════════════════════════════════════════════════════╝</pre
            >
          </div>

          <div class="space-y-3">
            <div class="flex items-start">
              <span class="text-green-400 mr-3 flex-shrink-0">fahad@portfolio:~$</span>
              <span class="text-green-300">whoami</span>
            </div>
            <div class="text-green-400/80 pl-6 py-1">
              Fahad Hossain - Python Developer | API Developer
            </div>

            <div class="flex items-start pt-2">
              <span class="text-green-400 mr-3 flex-shrink-0">fahad@portfolio:~$</span>
              <span class="text-green-300 animate-pulse">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Title with Icon -->
    <div class="flex items-center" style="margin-bottom: 1.5rem">
      <div
        class="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center flex-shrink-0"
        style="margin-right: 1rem"
      >
        <svg
          class="w-6 h-6 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 9l3 3-3 3m5 0h3"
          />
        </svg>
      </div>
      <h3 class="text-xl sm:text-2xl lg:text-3xl font-black text-green-400 font-mono">
        Terminal Interface
      </h3>
    </div>

    <!-- Description -->
    <div class="flex-grow" style="margin-bottom: 1.5rem">
      <p class="text-gray-300 text-base leading-relaxed font-light">
        Navigate through my portfolio using familiar command-line interface. Perfect for
        developers who love the terminal experience.
      </p>
    </div>

    <!-- Button -->
    <div class="mt-auto">
      <a
        @click="$emit('navigate', 'terminal')"
        href="terminal"
        class="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-[1px] hover:from-green-400 hover:to-emerald-500 transition-all duration-300 block w-full"
      >
        <div
          class="relative flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 rounded-[11px] group-hover/btn:bg-transparent transition-all duration-300"
        >
          <svg
            class="w-4 h-4 text-green-400 group-hover/btn:text-white transition-colors duration-300"
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
          <span
            class="text-green-400 group-hover/btn:text-white font-semibold text-base transition-colors duration-300"
          >
            Launch Terminal
          </span>
        </div>
      </a>
    </div>
  </div>
</div>

          <!-- API Docs Card -->
         <div class="group relative h-full">
  <div
    class="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-25 transition duration-500"
  ></div>
  <div
    class="relative bg-slate-900/60 backdrop-blur-sm rounded-2xl border border-white/10 group-hover:border-blue-400/40 transition-all duration-500 h-full flex flex-col"
    style="padding: 2rem"
  >
    <!-- GraphQL Studio Preview - New Section -->
    <div class="bg-slate-800/90 border border-blue-400/20 rounded-xl overflow-hidden flex-shrink-0" style="margin-bottom: 1.5rem;">
      <!-- Mini Header -->
      <div style="background: rgba(255, 255, 255, 0.04); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 12px 16px;">
        <div style="display: flex; align-items: center; justify-content: between;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="position: relative;">
              <div style="position: absolute; inset: 0; background: linear-gradient(to right, #06b6d4, #3b82f6); border-radius: 8px; filter: blur(6px); opacity: 0.7;"></div>
              <div style="position: relative; width: 32px; height: 32px; background: linear-gradient(to right, #06b6d4, #3b82f6); border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                <svg style="width: 16px; height: 16px; color: white;" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <span style="font-size: 14px; font-weight: bold; color: rgba(255, 255, 255, 0.9);">GraphQL Studio</span>
            <div style="display: flex; align-items: center; gap: 6px; margin-left: auto;">
              <div style="width: 6px; height: 6px; background: #10b981; border-radius: 50%;"></div>
              <span style="font-size: 11px; color: #10b981;">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Mini Editor Area -->
      <div class="flex" style="height: 180px;">
        <!-- Query Editor -->
        <div class="flex-1 bg-slate-900 p-3 font-mono text-xs">
          <div class="text-cyan-400 mb-2">query {</div>
          <div class="text-purple-400 pl-4">developer {</div>
          <div class="text-gray-300 pl-8">name</div>
          <div class="text-gray-300 pl-8">skills</div>
          <div class="text-gray-300 pl-8">projects</div>
          <div class="text-purple-400 pl-4">}</div>
          <div class="text-cyan-400">}</div>
        </div>

        <!-- Response -->
        <div class="flex-1 bg-slate-950 p-3 font-mono text-xs border-l border-slate-700">
          <div class="text-gray-500 mb-2">// Response</div>
          <div class="text-cyan-400">{</div>
          <div class="pl-4">
            <span class="text-green-400">"developer"</span>: {
          </div>
          <div class="pl-8">
            <span class="text-green-400">"name"</span>: <span class="text-yellow-400">"Fahad"</span>,
          </div>
          <div class="pl-8">
            <span class="text-green-400">"skills"</span>: [...]
          </div>
          <div class="pl-4">}</div>
          <div class="text-cyan-400">}</div>
        </div>
      </div>
    </div>

    <!-- Title with Icon -->
    <div class="flex items-center" style="margin-bottom: 1.5rem">
      <div
        class="w-12 h-12 bg-blue-400/20 rounded-xl flex items-center justify-center flex-shrink-0"
        style="margin-right: 1rem"
      >
        <svg
          class="w-6 h-6 text-blue-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0121 9.414V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 class="text-xl sm:text-2xl lg:text-3xl font-black text-blue-400">
        API Documentation
      </h3>
    </div>

    <!-- Description -->
    <div class="flex-grow" style="margin-bottom: 1.5rem">
      <p class="text-gray-300 text-base leading-relaxed font-light">
        Explore my portfolio through an interactive GraphQL interface. Query specific data, test live endpoints, and get structured responses.
      </p>
    </div>

    <!-- Features List - New Section -->
    <div class="grid grid-cols-2 gap-3" style="margin-bottom: 1.5rem;">
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-xs text-gray-400">GraphQL Interface</span>
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-xs text-gray-400">Live Query Editor</span>
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-xs text-gray-400">Schema Explorer</span>
      </div>
      <div class="flex items-center gap-2">
        <svg class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span class="text-xs text-gray-400">Real-time Data</span>
      </div>
    </div>

    <!-- Button -->
    <div class="mt-auto">
      <a
        @click="$emit('navigate', 'docs')"
        href="api"
        class="group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-[1px] hover:from-blue-400 hover:to-purple-500 transition-all duration-300 block w-full"
      >
        <div
          class="relative flex items-center justify-center gap-3 px-6 py-3 bg-slate-900 rounded-[11px] group-hover/btn:bg-transparent transition-all duration-300"
        >
          <svg
            class="w-4 h-4 text-blue-400 group-hover/btn:text-white transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <span
            class="text-blue-400 group-hover/btn:text-white font-semibold text-base transition-colors duration-300"
          >
            Explore GraphQL Studio
          </span>
        </div>
      </a>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineEmits<{
  navigate: [view: 'home' | 'terminal' | 'docs']
}>()
</script>

<style scoped>
.animation-delay-1000 {
  animation-delay: 1s;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
