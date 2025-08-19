<template>
  <div class="fixed inset-0 -z-10">
    <!-- Gradient Mesh -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
    ></div>

    <!-- Animated Orbs -->
    <div
      class="absolute top-0 left-0 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-float-slow"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-[800px] h-[800px] bg-pink-500/20 rounded-full blur-3xl animate-float-slow animation-delay-2000"
    ></div>
    <div
      class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl animate-pulse-slow"
    ></div>

    <!-- Grid Overlay -->
    <div
      class="absolute inset-0 opacity-[0.03]"
      style="
        background-image:
          linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
        background-size: 100px 100px;
      "
    ></div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 overflow-hidden">
      <div
        v-for="i in 20"
        :key="i"
        class="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
        :style="{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 10}s`,
          animationDuration: `${15 + Math.random() * 10}s`,
        }"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No dependencies for now
</script>

<style scoped>
@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) translateX(0);
  }
  100% {
    transform: translateY(-100px) translateX(100px);
  }
}

.animate-float-slow {
  animation: float-slow 20s ease-in-out infinite;
}

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}

.animate-float-particle {
  animation: float-particle 20s linear infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}
</style>
