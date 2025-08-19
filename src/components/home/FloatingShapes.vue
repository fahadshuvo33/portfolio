<template>
  <div class="absolute inset-0 overflow-hidden pointer-events-none">
    <!-- Floating geometric shapes -->
    <div
      v-for="(shape, index) in shapes"
      :key="index"
      :ref="(el) => el && animation.addElement(el as HTMLElement)"
      class="absolute opacity-10"
      :style="{
        left: shape.left + '%',
        top: shape.top + '%',
      }"
    >
      <div
        :class="[
          shape.type === 'circle' && 'rounded-full',
          shape.type === 'square' && 'rounded-lg',
          shape.type === 'triangle' && 'triangle',
        ]"
        :style="{
          width: shape.size + 'px',
          height: shape.size + 'px',
          background: shape.gradient,
        }"
      />
    </div>

    <!-- Particle effects -->
    <div
      v-for="particle in particles"
      :key="particle.id"
      class="absolute rounded-full bg-purple-400"
      :style="{
        left: particle.x + '%',
        top: particle.y + '%',
        width: particle.size + 'px',
        height: particle.size + 'px',
        opacity: particle.opacity,
        animation: `float ${10 / particle.speed}s ease-in-out infinite`,
        animationDelay: `${particle.id * 0.1}s`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import { useFloatingAnimation, useParticles } from '@/composables/animations'

const animation = useFloatingAnimation(25)
const { particles } = useParticles(30)

const shapes = [
  {
    type: 'circle',
    size: 80,
    left: 10,
    top: 20,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  {
    type: 'square',
    size: 60,
    left: 85,
    top: 15,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  {
    type: 'circle',
    size: 100,
    left: 70,
    top: 70,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  },
  {
    type: 'square',
    size: 50,
    left: 20,
    top: 80,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  },
]
</script>

<style scoped>
.triangle {
  width: 0;
  height: 0;
  border-left: 30px solid transparent;
  border-right: 30px solid transparent;
  border-bottom: 52px solid;
  background: none !important;
  border-bottom-color: rgba(139, 92, 246, 0.1);
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-20px) translateX(10px);
  }
  50% {
    transform: translateY(0) translateX(-10px);
  }
  75% {
    transform: translateY(20px) translateX(5px);
  }
}
</style>
