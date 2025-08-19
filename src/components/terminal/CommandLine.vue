<!-- src/components/terminal/CommandLine.vue -->
<template>
  <div class="command-line">
    <span class="prompt">fahad@portfolio</span>
    <span class="separator">:</span>
    <span class="path">~</span>
    <span class="separator">$</span>
    <span class="command">{{ command }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  command: string
}>()
</script>

<style scoped>
.command-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prompt {
  color: var(--text-secondary);
}
.separator {
  color: var(--text-dim);
}
.path {
  color: var(--accent);
}
.command {
  color: var(--text-primary);
}
</style>
