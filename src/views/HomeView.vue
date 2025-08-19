<template>
  <div class="relative w-full min-h-screen overflow-hidden">
    <!-- Content Sections -->
    <div class="relative z-10 space-y-2">
      <!-- Hero Section -->
      <HeroSection @navigate="$emit('navigate', $event)" />

      <!-- About Section -->
      <AdventureSection />

      <!-- Skills Section -->
      <TechSection />
    </div>
  </div>
</template>

<script setup lang="ts">
// import AnimatedBackground from '@/components/AnimatedBackground.vue'
import HeroSection from '@/components/home/HeroSection.vue'
import AdventureSection from '@/components/home/AdventureSection.vue'
import TechSection from '@/components/home/TechStackSection.vue'

defineEmits<{
  navigate: [view: 'home' | 'terminal' | 'api']
}>()
</script>
