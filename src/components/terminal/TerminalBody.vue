<!-- src/components/terminal/TerminalBody.vue -->
<template>
  <div
    ref="terminalBody"
    @click="focusInput"
    class="terminal-body"
    :class="{ compact: compactMode }"
  >
    <!-- Background Pattern -->
    <div class="terminal-bg-pattern"></div>

    <!-- Content Wrapper -->
    <div class="terminal-content">
      <!-- Welcome Message - Centered -->
      <div v-if="showWelcome && !compactMode" class="welcome-section">
        <pre class="ascii-art">
  █▀▀ ▄▀█ █░█ ▄▀█ █▀▄ ▀ █▀   █▀█ █▀█ █▀█ ▀█▀ █▀▀ █▀█ █░░ █ █▀█
  █▀░ █▀█ █▀█ █▀█ █▄▀ ░ ▄█   █▀▀ █▄█ █▀▄ ░█░ █▀░ █▄█ █▄▄ █ █▄█
  </pre
        >
        <p class="welcome-text">Type 'help' for available commands</p>
      </div>

      <!-- Command History -->
      <div v-for="(entry, index) in displayedHistory" :key="index" class="command-entry">
        <!-- Command Line -->
        <div class="command-line">
          <span class="prompt">{{ prompt.user }}@{{ prompt.host }}</span>
          <span class="separator">:</span>
          <span class="path">{{ prompt.path }}</span>
          <span class="separator">$</span>
          <span class="command">{{ entry.command }}</span>
        </div>

        <!-- Output -->
        <div
          v-if="entry.output && !compactMode"
          class="command-output"
          :class="{ error: entry.isError }"
          v-html="formatOutput(entry.output)"
        ></div>
      </div>

      <!-- Current Input - Always at cursor position -->
      <div class="command-line current" v-if="!isProcessing">
        <span class="prompt">fahad@portfolio</span>
        <span class="separator">:</span>
        <span class="path">~</span>
        <span class="separator">$</span>
        <input
          ref="commandInput"
          :value="currentCommand"
          @input="updateCommand"
          @keyup.enter="$emit('execute')"
          @keyup.up="$emit('navigate-history', -1)"
          @keyup.down="$emit('navigate-history', 1)"
          @keydown.tab.prevent="$emit('tab-complete')"
          type="text"
          class="command-input"
          spellcheck="false"
          autocomplete="off"
        />
      </div>

      <!-- Processing -->
      <div v-if="isProcessing" class="processing">
        <div class="command-line">
          <span class="prompt">{{ prompt.user }}@{{ prompt.host }}</span>
          <span class="separator">:</span>
          <span class="path">{{ prompt.path }}</span>
          <span class="separator">$</span>
          <span class="command">{{ commandHistory[commandHistory.length - 1]?.command }}</span>
        </div>
        <div class="processing-indicator" v-if="!compactMode">
          <div class="dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span>Processing...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import type { Theme } from '@/terminal/config'

interface CommandOutput {
  message: string
  metadata?: {
    totalFields?: number
    validFields?: number
    hiddenFields?: number
    invalidFields?: number
  }
}

interface CommandEntry {
  command: string
  output: string | CommandOutput
  timestamp: Date
  isError?: boolean
}

const props = defineProps<{
  showWelcome: boolean
  commandHistory: CommandEntry[]
  currentCommand: string
  isProcessing: boolean
  compactMode: boolean
  theme?: Theme
}>()

const prompt = {
  user: 'fahad',
  host: 'portfolio',
  path: '~'
}

const emit = defineEmits<{
  'update:command': [value: string]
  execute: []
  'navigate-history': [direction: number]
  'tab-complete': []
}>()

const terminalBody = ref<HTMLElement>()
const commandInput = ref<HTMLInputElement>()

// Show only last 5 commands in compact mode
const displayedHistory = computed(() => {
  if (props.compactMode) {
    return props.commandHistory.slice(-5)
  }
  return props.commandHistory
})

const updateCommand = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:command', target.value)
}

const focusInput = () => {
  if (!props.isProcessing) {
    commandInput.value?.focus()
  }
}

const formatOutput = (output: string | { message: string }): string => {
  // If output is an object with a message property, use that
  if (typeof output === 'object' && output !== null && 'message' in output) {
    return formatOutput(output.message)
  }
  
  // Otherwise, treat it as a string
  const text = String(output || '')
  
  // Replace special characters and format the output
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>')
    .replace(/  /g, ' &nbsp;')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
    // Add syntax highlighting for command output
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/^#\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^##\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^###\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^- (.+)$/gm, '• $1<br>')
    .replace(/^\d+\.\s+(.+)$/gm, '$1<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>')
}

// Auto-focus after processing completes
watch(
  () => props.isProcessing,
  async (newVal, oldVal) => {
    if (oldVal === true && newVal === false) {
      await nextTick()
      focusInput()
    }
  },
)

// Auto-scroll on new commands - FULL TERMINAL SCROLL
watch(
  () => props.commandHistory.length,
  async () => {
    await nextTick()
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  },
)

// Auto-scroll when processing changes
watch(
  () => props.isProcessing,
  async () => {
    await nextTick()
    if (terminalBody.value) {
      terminalBody.value.scrollTop = terminalBody.value.scrollHeight
    }
  },
)

// Debug: Log props on mount and update
onMounted(() => {
  console.log('[TerminalBody] Component mounted with props:', {
    showWelcome: props.showWelcome,
    commandHistoryLength: props.commandHistory.length,
    currentCommand: props.currentCommand,
    isProcessing: props.isProcessing,
    compactMode: props.compactMode
  })
  focusInput()
})

// Debug: Log prop changes
watch(() => props, (newProps) => {
  console.log('[TerminalBody] Props updated:', {
    showWelcome: newProps.showWelcome,
    commandHistoryLength: newProps.commandHistory.length,
    currentCommand: newProps.currentCommand,
    isProcessing: newProps.isProcessing
  })
}, { deep: true })
</script>

<style scoped>
/* ORIGINAL DESIGN - Flex-based scrollable body */
.terminal-body {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--bg-primary);
  cursor: text;
  min-height: 0;
  max-height: 100%;
  position: relative;
}

/* Background pattern design - more visible */
.terminal-bg-pattern {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0.05; /* More visible */
  background-image:
    /* Grid pattern */
    linear-gradient(var(--accent) 1px, transparent 1px),
    linear-gradient(90deg, var(--accent) 1px, transparent 1px),
    /* Dots */ radial-gradient(circle at 25% 25%, var(--accent) 1%, transparent 1%),
    radial-gradient(circle at 75% 75%, var(--accent) 1%, transparent 1%);
  background-size:
    100px 100px,
    100px 100px,
    50px 50px,
    50px 50px;
  background-position:
    0 0,
    0 0,
    0 0,
    25px 25px;
}

/* Scan line effect */
.terminal-bg-pattern::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%);
  opacity: 0.3;
  animation: scan-line 8s linear infinite;
}

@keyframes scan-line {
  0% {
    transform: translateY(-100px);
  }
  100% {
    transform: translateY(calc(100vh + 100px));
  }
}

/* Content wrapper - remove spacer logic */
.terminal-content {
  position: relative;
  z-index: 1;
  padding: 1.5rem;
  min-height: 100%;
}

.terminal-body.compact .terminal-content {
  padding: 1rem;
}

.command-entry {
  margin-bottom: 1rem;
}

.command-line {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.prompt {
  color: var(--text-secondary);
  flex-shrink: 0;
}

.separator {
  color: var(--text-dim);
  flex-shrink: 0;
}

.path {
  color: var(--accent);
  flex-shrink: 0;
}

.command {
  color: var(--text-primary);
  margin-left: 0.5rem;
}

.command-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
  font-family: inherit;
  font-size: inherit;
  margin-left: 0.5rem;
  caret-color: var(--accent);
}

.command-output {
  margin-top: 0.5rem;
  color: var(--text-primary);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.command-output.error {
  color: #ff6b6b;
}

.command-output code {
  background: rgba(255, 255, 255, 0.1);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}

.processing-indicator {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: var(--text-dim);
}

.dots {
  display: flex;
  gap: 0.25rem;
}

.dots span {
  width: 6px;
  height: 6px;
  background: var(--accent);
  border-radius: 50%;
  animation: pulse 1.4s infinite;
}

.dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%,
  60%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  30% {
    transform: scale(1.2);
    opacity: 1;
  }
}

/* Custom Scrollbar */
.terminal-body::-webkit-scrollbar {
  width: 8px;
}

.terminal-body::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

.terminal-body::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

.terminal-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-dim);
}

.welcome-section {
  /* margin-bottom: 1rem; */
  text-align: center;
  padding: 1rem 0;
}

.ascii-art {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0 auto;
  display: inline-block;
  line-height: 1.2;
  white-space: pre;
  letter-spacing: 1px; /* Better spacing for ASCII art */
}

.welcome-text {
  color: var(--text-dim);
  font-size: 0.875rem;
  /* margin-top: 0.5rem; */
}

/* Mobile */
@media (max-width: 768px) {
  .ascii-art {
    font-size: 0.7rem;
    letter-spacing: 0;
  }
}

@media (max-width: 480px) {
  .ascii-art {
    font-size: 0.6rem;
  }
}
</style>
