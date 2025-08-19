<!-- src/components/terminal/QuickActions.vue -->
<template>
  <div class="quick-actions">
    <button
      v-for="action in actions"
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
interface QuickAction {
  label: string
  cmd: string
  icon: string
}

defineProps<{
  actions: QuickAction[]
}>()

defineEmits<{
  execute: [cmd: string]
}>()
</script>

<style scoped>
.quick-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-width: 600px;
  margin: 0 auto;
}

.quick-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 1rem; /* Reduced vertical padding */

  /* Terminal theme styling */
  background: var(--bg-primary);
  color: var(--text-dim);
  border: 1px solid var(--border);
  border-radius: 0.25rem;

  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  font-size: 0.813rem; /* Slightly smaller */

  /* Subtle shadow */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.quick-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border-color: var(--accent);
  transform: translateY(-1px);
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.3),
    0 0 8px rgba(var(--glow-rgb), 0.2);
}

.quick-btn:active {
  transform: translateY(0);
}

.icon {
  font-size: 1rem; /* Smaller icon */
}

.label {
  font-size: 0.813rem;
  text-transform: capitalize;
}

/* Terminal-style hover effect */
.quick-btn::before {
  content: '> ';
  opacity: 0;
  transition: opacity 0.2s;
  color: var(--accent);
}

.quick-btn:hover::before {
  opacity: 1;
}

/* Responsive */
@media (max-width: 480px) {
  .quick-actions {
    gap: 0.375rem;
  }

  .quick-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .icon {
    font-size: 0.875rem;
  }
}
</style>
