<!-- src/views/TerminalView.vue -->
<template>
  <div class="terminal-page" :class="`theme-${currentTheme}`">
    <!-- Floating Background Animation -->
    <BackgroundAnimation />

    <!-- Main Container -->
    <div class="main-container">
      <!-- Terminal Wrapper -->
      <div class="terminal-wrapper">
        <div
          class="terminal-window"
          :class="{
            maximized: windowState === 'maximized',
          }"
        >
          <TerminalHeader
            :theme="currentTheme"
            :current-time="currentTime"
            :window-state="windowState"
            :compact-mode="compactMode"
            @close="closeTerminal"
            @minimize="toggleCompactMode"
            @maximize="maximizeTerminal"
            @cycle-theme="cycleTheme"
          />

          <TerminalBody
            :show-welcome="showWelcome"
            :command-history="commandHistory"
            :current-command="currentCommand"
            :is-processing="isProcessing"
            :compact-mode="compactMode"
            :theme="currentTheme"
            @update:command="currentCommand = $event"
            @execute="executeCommand"
            @navigate-history="navigateHistory"
            @tab-complete="handleTab"
          />

          <TerminalFooter
            v-show="!compactMode"
            :total-commands="totalCommands"
            :session-time="sessionTime"
            @clear="clearTerminal"
            @help="showHelp"
          />
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions-section">
        <p class="hint-text">Quick commands:</p>
        <QuickActions :actions="quickActions" @execute="runCommand" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import TerminalHeader from '@/components/terminal/TerminalHeader.vue'
import TerminalBody from '@/components/terminal/TerminalBody.vue'
import TerminalFooter from '@/components/terminal/TerminalFooter.vue'
import QuickActions from '@/components/terminal/QuickActions.vue'
import BackgroundAnimation from '@/components/terminal/BackgroundAnimation.vue'
import { executeTerminalQuery as runCommandLogic } from '@/terminal/executor'

// Types
interface CommandEntry {
  command: string
  output: string
  timestamp: Date
  isError?: boolean
}

interface QuickAction {
  label: string
  cmd: string
  icon: string
}

import { Theme, AVAILABLE_THEMES } from '@/terminal/config'

type WindowState = 'normal' | 'maximized'

// State
const themes = ref<Theme[]>(AVAILABLE_THEMES)
const currentTheme = ref<Theme>('matrix')
const windowState = ref<WindowState>('normal')
const compactMode = ref(false)
const showWelcome = ref(true)
const isProcessing = ref(false)
const currentCommand = ref('')
const commandHistory = ref<CommandEntry[]>([])
const historyIndex = ref(-1)
const commandStack = ref<string[]>([])
const totalCommands = ref(0)
const currentTimeout = ref<number | null>(null)
const sessionTimer = ref(0)
let sessionInterval: number | null = null

const quickActions = ref<QuickAction[]>([
  { label: 'About', cmd: 'about', icon: '👤' },
  { label: 'Skills', cmd: 'skills', icon: '💻' },
  { label: 'Projects', cmd: 'projects', icon: '📁' },
  { label: 'Contact', cmd: 'contact', icon: '📧' },
])

// Computed
const currentTime = computed(() =>
  new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }),
)

const sessionTime = computed(() => {
  const minutes = Math.floor(sessionTimer.value / 60)
  const seconds = sessionTimer.value % 60
  return `${minutes}m ${seconds}s`
})

// Methods
const cycleTheme = () => {
  const currentIndex = themes.value.indexOf(currentTheme.value)
  currentTheme.value = themes.value[(currentIndex + 1) % themes.value.length]
  localStorage.setItem('terminal-theme', currentTheme.value)
}

const executeCommand = async () => {
  if (!currentCommand.value.trim()) return

  const cmd = currentCommand.value.trim()

  // Handle clear command immediately
  if (cmd.toLowerCase() === 'clear') {
    clearTerminal()
    currentCommand.value = ''
    await nextTick()
    focusCommandInput()
    return
  }

  isProcessing.value = true

  // Add command to history
  commandHistory.value.push({
    command: cmd,
    output: '',
    timestamp: new Date(),
  })

  // Clear input and update history index
  currentCommand.value = ''
  historyIndex.value = -1
  totalCommands.value++

  try {
    // Execute command and get output
    const result = await runCommandLogic(cmd)
    
    // Handle the command result
    if (result.data && typeof result.data === 'object' && 'action' in result.data) {
      // Handle action-based responses
      const { action, ...data } = result.data
      
      // Update the last history entry with output
      if (commandHistory.value.length > 0) {
        const lastEntry = commandHistory.value[commandHistory.value.length - 1]
        lastEntry.output = data.message || ''
        lastEntry.isError = false
      }
      
      // Handle different actions
      switch (action) {
        case 'clear':
          clearTerminal()
          break
          
        case 'theme':
          if (data.theme) {
            currentTheme.value = data.theme as Theme
            localStorage.setItem('terminal-theme', data.theme)
          }
          break
          
        case 'help':
          // The message is already set in the history entry
          break
          
        case 'show-fields-modal':
          // TODO: Implement fields modal if needed
          break
      }
    } else {
      // Handle legacy string-based responses
      const output = typeof result.data === 'string' 
        ? result.data 
        : result.data?.message || JSON.stringify(result.data, null, 2)
      
      // Update the last history entry with output
      if (commandHistory.value.length > 0) {
        const lastEntry = commandHistory.value[commandHistory.value.length - 1]
        lastEntry.output = output
        lastEntry.isError = output.startsWith('❌') || output.startsWith('Error')
      }
      
      // Handle legacy special commands
      if (output === 'CLEAR_TERMINAL') {
        clearTerminal()
      } else if (output.startsWith('CHANGE_THEME:')) {
        const newTheme = output.split(':')[1] as Theme
        if (newTheme) {
          currentTheme.value = newTheme
          localStorage.setItem('terminal-theme', newTheme)
        }
      }
    }
  } catch (error) {
    console.error('Command execution error:', error)
    if (commandHistory.value.length > 0) {
      const lastEntry = commandHistory.value[commandHistory.value.length - 1]
      lastEntry.output = `❌ Error executing command: ${error instanceof Error ? error.message : String(error)}`
      lastEntry.isError = true
    }
  } finally {
    isProcessing.value = false
    currentCommand.value = ''
    await nextTick()
    focusCommandInput()
  }
}

// Focus helper
const focusCommandInput = () => {
  const input = document.querySelector('.command-input') as HTMLInputElement
  if (input) {
    input.focus()
  }
}

const runCommand = (cmd: string) => {
  if (isProcessing.value) return
  currentCommand.value = cmd
  executeCommand()
}

const navigateHistory = (direction: number) => {
  if (commandStack.value.length === 0) return

  if (direction === -1) {
    if (historyIndex.value > 0) {
      historyIndex.value--
      currentCommand.value = commandStack.value[historyIndex.value]
    }
  } else {
    if (historyIndex.value < commandStack.value.length - 1) {
      historyIndex.value++
      currentCommand.value = commandStack.value[historyIndex.value]
    } else {
      historyIndex.value = commandStack.value.length
      currentCommand.value = ''
    }
  }
}

const handleTab = () => {
  if (!currentCommand.value) return

  const commands = [
    'about',
    'skills',
    'projects',
    'contact',
    'help',
    'clear',
    'theme',
    'name',
    'email',
    'location',
    'experience',
    'education',
    'languages',
    'tools',
    'social',
  ]

  const matches = commands.filter((cmd) => cmd.startsWith(currentCommand.value.toLowerCase()))

  if (matches.length === 1) {
    currentCommand.value = matches[0]
  }
}

const clearTerminal = () => {
  // Cancel running command
  if (currentTimeout.value) {
    clearTimeout(currentTimeout.value)
    currentTimeout.value = null
  }
  isProcessing.value = false

  commandHistory.value = []
  showWelcome.value = false
  focusCommandInput()
}

const showHelp = () => runCommand('help')

// Window controls
const toggleCompactMode = () => {
  compactMode.value = !compactMode.value
}

const maximizeTerminal = () => {
  windowState.value = windowState.value === 'maximized' ? 'normal' : 'maximized'
}

const closeTerminal = () => {
  const terminal = document.querySelector('.terminal-window')
  terminal?.classList.add('closing')
  setTimeout(() => {
    window.location.href = '/'
  }, 300)
}

// Lifecycle
onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem('terminal-theme') as Theme
  if (savedTheme && themes.value.indexOf(savedTheme) !== -1) {
    currentTheme.value = savedTheme
  }

  // Start session timer
  sessionInterval = window.setInterval(() => {
    sessionTimer.value++
  }, 1000)

  // Initial focus
  focusCommandInput()
})

onUnmounted(() => {
  if (sessionInterval) {
    clearInterval(sessionInterval)
  }
  if (currentTimeout.value) {
    clearTimeout(currentTimeout.value)
  }
})
</script>

<style>
@import '@/assets/terminal-themes.css';

.terminal-page {
  min-height: 100vh;
  width: 100%;
  margin: 0;
  padding: 0;
  position: relative;
  overflow: hidden;
  /* No background - transparent */
  background: transparent;
}

/* Main container */
.main-container {
  width: 100%;
  max-width: 1200px; /* Reduced from 1600px */
  margin: 0 auto;
  padding: 80px 1rem 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 1;
}

/* Terminal wrapper - smaller size */
.terminal-wrapper {
  width: 100%;
  height: 650px; /* Reduced from 700px */
  position: relative;
}

/* Terminal window */
.terminal-window {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* Solid background with theme colors */
  background-color: var(--terminal-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;

  /* Shadow for depth */
  box-shadow:
    0 0 60px rgba(var(--glow-rgb), 0.3),
    0 0 120px rgba(var(--glow-rgb), 0.1),
    0 30px 60px rgba(0, 0, 0, 0.8);

  display: flex;
  flex-direction: column;
}

/* Theme-specific solid backgrounds */
.theme-matrix {
  --terminal-bg: #0a0a0a;
  --float-color-1: 0, 255, 0;
  --float-color-2: 0, 200, 0;
}

.theme-dracula {
  --terminal-bg: #1e1f29;
  --float-color-1: 189, 147, 249;
  --float-color-2: 255, 121, 198;
}

.theme-monokai {
  --terminal-bg: #1e1f1c;
  --float-color-1: 166, 226, 46;
  --float-color-2: 249, 38, 114;
}

.theme-cyberpunk {
  --terminal-bg: #0a0a1a;
  --float-color-1: 0, 217, 255;
  --float-color-2: 255, 0, 128;
}

.theme-minimal {
  --terminal-bg: #141414;
  --float-color-1: 255, 255, 255;
  --float-color-2: 200, 200, 200;
}

/* Maximized state */
.terminal-window.maximized {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  border-radius: 0 !important;
  z-index: 9999;
}

.quick-actions-section {
  text-align: center;
  position: relative;
  z-index: 1;
  margin-top: 1rem; /* Reduced from 1.5rem */
  padding-top: 1rem; /* Reduced from 1.5rem */
  border-top: 1px dashed var(--border); /* Changed to dashed */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hint-text {
  color: var(--text-dim);
  font-size: 0.7rem; /* Smaller */
  margin-bottom: 0.5rem; /* Reduced */
  font-family: inherit;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.6;
}

/* Optional: Add a subtle animation to hint text */
.hint-text::before {
  content: '> ';
  color: var(--accent);
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 1200px) {
  .main-container {
    max-width: 1000px;
  }

  .terminal-wrapper {
    height: 600px;
  }
}

@media (max-width: 768px) {
  .main-container {
    padding-top: 60px;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .terminal-wrapper {
    height: 500px;
  }
}

@media (max-width: 480px) {
  .main-container {
    padding-top: 40px;
  }

  .terminal-wrapper {
    height: 450px;
  }

  .terminal-window {
    border-radius: 8px;
  }
}
</style>
