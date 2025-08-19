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
      <button @click="showFields = true" class="fields-button" title="Available Fields">
        <span class="icon">📋</span>
        <span class="button-text">Fields</span>
      </button>
      <span class="terminal-time">{{ currentTime }}</span>
      <button @click="$emit('cycle-theme')" class="theme-button">
        <span class="icon">🎨</span>
        <span class="button-text">{{ theme }}</span>
      </button>
    </div>

    <!-- Fields Modal -->
    <div v-if="showFields" class="fields-modal" @click.self="showFields = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Available Fields</h3>
          <button class="close-modal" @click="showFields = false">&times;</button>
        </div>
        <div class="fields-container">
          <div v-if="fields.length === 0" class="no-fields">
            No fields available. Try running a command first.
          </div>
          <div v-else class="fields-grid">
            <div v-for="field in fields" :key="field" class="field-item" @click="copyToClipboard(field)">
              <span class="field-name">{{ field }}</span>
              <span class="copy-hint">Click to copy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { terminal } from '@/terminal/executor'

const props = defineProps<{
  theme: string
  currentTime: string
  windowState: 'normal' | 'maximized'
  compactMode: boolean
}>()

const emit = defineEmits<{
  close: []
  minimize: []
  maximize: []
  'cycle-theme': []
}>()

const showFields = ref(false)
const fields = ref<string[]>([])

// Get fields from terminal service
const updateFields = () => {
  fields.value = terminal.getFields()
}

// Copy field to clipboard
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // Optional: Show a small notification that it was copied
    const notification = document.createElement('div')
    notification.className = 'copy-notification'
    notification.textContent = 'Copied!'
    document.body.appendChild(notification)
    setTimeout(() => {
      notification.remove()
    }, 1500)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

// Close modal on Escape key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    showFields.value = false
  }
}

// Update fields when modal is opened
const handleModalOpen = () => {
  updateFields()
  document.addEventListener('keydown', handleKeydown)
}

// Cleanup event listener
const handleModalClose = () => {
  document.removeEventListener('keydown', handleKeydown)
}

// Watch for modal state changes
watch(showFields, (newVal: boolean) => {
  if (newVal) {
    handleModalOpen()
  } else {
    handleModalClose()
  }
})

// Initial fields load
onMounted(() => {
  updateFields()
})

// Cleanup
onUnmounted(() => {
  handleModalClose()
})
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

.terminal-time {
  color: var(--text-dim);
  font-size: 0.75rem;
  white-space: nowrap;
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

/* Fields Modal */
.fields-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: var(--terminal-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-secondary);
}

.modal-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.close-modal {
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 0.5rem;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.close-modal:hover {
  opacity: 1;
  color: var(--accent);
}

.fields-container {
  padding: 1rem;
  overflow-y: auto;
  flex: 1;
}

.no-fields {
  color: var(--text-dim);
  text-align: center;
  padding: 2rem 1rem;
  font-style: italic;
}

.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
  padding: 0.25rem;
}

.field-item {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.6rem 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}

.field-item:hover {
  background: var(--accent);
  color: var(--bg-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.field-name {
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  font-weight: 500;
  display: block;
  margin-bottom: 0.2rem;
}

.copy-hint {
  font-size: 0.65rem;
  opacity: 0;
  transition: opacity 0.2s;
  display: block;
  color: currentColor;
  font-style: italic;
}

.field-item:hover .copy-hint {
  opacity: 0.8;
}

/* Copy notification */
.copy-notification {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--accent);
  color: var(--bg-primary);
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-size: 0.85rem;
  z-index: 2000;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .fields-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  }
  
  .field-item {
    padding: 0.5rem 0.7rem;
  }
  
  .field-name {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .fields-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-content {
    width: 95%;
  }
}
</style>
