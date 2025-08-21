<!-- src/components/terminal/TerminalHeader.vue -->
<template>
  <div class="terminal-header">
    <div class="header-left">
      <!-- Window Controls -->
      <div class="window-controls">
        <button class="control close" @click="$emit('close')" title="Close Terminal"></button>
        <button
          class="control minimize"
          @click="$emit('minimize')"
          :title="compactMode ? 'Expand View' : 'Compact View'"
        ></button>
        <button
          class="control maximize"
          @click="$emit('maximize')"
          :title="windowState === 'maximized' ? 'Restore' : 'Maximize'"
        ></button>
      </div>

      <!-- Terminal Title -->
      <div class="terminal-title">
        <span class="icon">⌨️</span>
        <span>fahad@portfolio:~$</span>
      </div>
    </div>

    <!-- Header Right -->
    <div class="header-right">
      <button @click="showFieldsModal = true" class="fields-button" title="Available Fields">
        <span class="icon">📋</span>
        <span class="button-text">Fields</span>
      </button>
      <button @click="$emit('cycle-theme')" class="theme-button">
        <span class="icon">🎨</span>
        <span class="button-text">{{ theme }}</span>
      </button>
    </div>

    <!-- Fields Modal -->
    <FieldsModal
      :is-visible="showFieldsModal"
      @close="showFieldsModal = false"
      @apply-fields="handleApplyFields"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FieldsModal from '@/components/terminal/fieldsModal.vue'

const props = defineProps<{
  theme: string
  windowState: 'normal' | 'maximized'
  compactMode: boolean
}>()

const emit = defineEmits<{
  close: []
  minimize: []
  maximize: []
  'cycle-theme': []
  'apply-fields': [command: string]
}>()

const showFieldsModal = ref(false)

const handleApplyFields = (command: string) => {
  showFieldsModal.value = false
  emit('apply-fields', command)
}
</script>

<style scoped>
.terminal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  user-select: none;
  flex-shrink: 0;
  position: relative;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.window-controls {
  display: flex;
  gap: 0.5rem;
}

.control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.control:hover {
  opacity: 0.8;
  transform: scale(1.1);
}

.control:active {
  transform: scale(0.95);
}

.control.close {
  background: #ff5f57;
}

.control.close:hover {
  background: #ff3b30;
}

.control.minimize {
  background: #ffbd2e;
}

.control.minimize:hover {
  background: #ffaa00;
}

.control.maximize {
  background: #28ca42;
}

.control.maximize:hover {
  background: #00c925;
}

.terminal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.theme-button,
.fields-button {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.75rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.theme-button:hover,
.fields-button:hover {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

.icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9em;
}

.button-text {
  font-size: 0.8em;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-right {
    gap: 0.5rem;
  }

  .button-text {
    display: none;
  }

  .theme-button,
  .fields-button {
    padding: 0.35rem;
    min-width: 32px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .terminal-header {
    padding: 0.5rem;
  }

  .window-controls {
    gap: 0.3rem;
  }

  .control {
    width: 10px;
    height: 10px;
  }
}
</style>
