<template>
  <div class="quick-actions">
    <button
      v-for="action in quickActions"
      :key="action.cmd"
      @click="$emit('execute', action.cmd)"
      class="quick-btn"
    >
      <span class="icon">{{ action.icon }}</span>
      <span class="label">{{ action.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface QuickAction {
  label: string
  cmd: string
  icon: string
}

const quickActions = ref<QuickAction[]>([
  { label: 'About', cmd: 'about[]', icon: '👤' },
  { label: 'Skills', cmd: 'skills[]', icon: '💻' },
  { label: 'Projects', cmd: 'projects[]', icon: '📁' },
  { label: 'Experience', cmd: 'experience[]', icon: '💼' },
  { label: 'Education', cmd: 'education[]', icon: '🎓' },
])

defineEmits<{
  execute: [cmd: string]
}>()
</script>

<style scoped>
.quick-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;

  background: transparent;
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 12px;

  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.quick-btn:hover {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

.icon {
  font-size: 1rem;
}
</style>
