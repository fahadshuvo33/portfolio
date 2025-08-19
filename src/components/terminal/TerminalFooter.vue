<!-- src/components/terminal/TerminalFooter.vue -->
<template>
  <div class="terminal-footer">
    <div class="footer-left">
      <button @click="$emit('clear')" class="footer-btn">
        <span class="icon">🗑️</span>
        <span>Clear</span>
      </button>
      <button @click="$emit('help')" class="footer-btn">
        <span class="icon">❓</span>
        <span>Help</span>
      </button>
    </div>

    <div class="footer-right">
      <span>Commands: {{ totalCommands }}</span>
      <span class="separator">•</span>
      <span>Session: {{ sessionTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  totalCommands: number
  sessionTime: string
}>()

defineEmits<{
  clear: []
  help: []
}>()
</script>

<style scoped>
.terminal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border);
  font-size: 0.75rem;

  /* ABSOLUTELY FIXED HEIGHT */
  height: 40px;
  min-height: 40px;
  max-height: 40px;
  box-sizing: border-box;

  /* Prevent any content from affecting size */
  overflow: hidden;
}

.footer-left {
  display: flex;
  gap: 0.5rem;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background: transparent;
  color: var(--text-dim);
  border: none;
  cursor: pointer;
  transition: color 0.2s;
  font-family: inherit;
  font-size: inherit;
}

.footer-btn:hover {
  color: var(--text-primary);
}

.icon {
  font-size: 0.875rem;
}

.footer-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dim);
}

.separator {
  color: var(--text-dim);
}
</style>
