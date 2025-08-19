<!-- src/components/LoadingSpinner.vue -->
<template>
  <div class="spinner-container">
    <div class="circuit-wrapper">
      <div class="circuit-ring" v-for="i in 3" :key="i" :style="{ '--i': i }">
        <span class="circuit-dot" v-for="j in 8" :key="j" :style="{ '--j': j }"></span>
      </div>
      <div class="core-glow"></div>
    </div>
    <p class="spinner-text">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['sm', 'md', 'lg'].includes(value)
    },
    text: {
      type: String,
      default: 'Loading...'
    }
  },
  setup() {
    return {};
  }
});
</script>

<style scoped>
.spinner-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(17, 24, 39, 0.98);
  backdrop-filter: blur(12px);
  z-index: 9999;
}

.circuit-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.circuit-ring {
  position: absolute;
  width: calc(40px + var(--i) * 30px);
  height: calc(40px + var(--i) * 30px);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotate calc(2s + var(--i) * 0.5s) linear infinite;
  animation-direction: alternate;
}

.circuit-dot {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00ffff;
  border-radius: 50%;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  box-shadow:
    0 0 10px #00ffff,
    0 0 20px #00ffff,
    0 0 30px #00ffff;
  animation: pulse-neon 1.5s ease-in-out infinite;
  animation-delay: calc(var(--j) * 0.1s);
  transform-origin: center calc(20px + var(--i) * 15px);
  transform: rotate(calc(var(--j) * 45deg));
}

.core-glow {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, #00ffff 0%, transparent 70%);
  border-radius: 50%;
  animation: core-pulse 2s ease-in-out infinite;
}

@keyframes rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes pulse-neon {
  0%,
  100% {
    opacity: 0.3;
    transform: rotate(calc(var(--j) * 45deg)) scale(1);
  }
  50% {
    opacity: 1;
    transform: rotate(calc(var(--j) * 45deg)) scale(1.5);
  }
}

@keyframes core-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 1;
  }
}

.spinner-text {
  margin-top: 40px;
  color: #00ffff;
  font-size: 18px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-shadow:
    0 0 10px #00ffff,
    0 0 20px #00ffff;
  animation: flicker 2s ease-in-out infinite;
}

@keyframes flicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>
