<!-- src/components/api/Editor.vue -->
<template>
  <div :class="[theme.bg.secondary, 'rounded-lg h-full flex flex-col overflow-hidden']">
    <!-- Compact Header -->
    <div class="px-3 py-2 border-b border-white/5 flex items-center justify-between flex-shrink-0">
      <div class="flex items-center gap-2">
        <span class="text-base">📝</span>
        <h3 :class="[theme.text.primary, 'text-xs font-medium']">Query Editor</h3>
      </div>

      <!-- Compact Action Buttons -->
      <div class="flex items-center gap-1">
        <button
          @click="formatQuery"
          :class="[
            'action-btn p-1.5 rounded transition-all duration-200',
            'hover:bg-white/10 relative overflow-hidden',
          ]"
          title="Format GraphQL (Ctrl+Shift+F)"
        >
          <svg
            :class="[
              'w-3.5 h-3.5 transition-all duration-300',
              formatClicked
                ? 'text-blue-400 scale-125 rotate-180'
                : 'text-gray-400 hover:text-white',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
          <!-- Format ripple animation -->
          <div v-if="formatClicked" class="format-ripple"></div>
          <div v-if="formatClicked" class="format-pulse"></div>
        </button>

        <button
          @click="copyQuery"
          :class="[
            'action-btn p-1.5 rounded transition-all duration-200',
            'hover:bg-white/10 relative overflow-hidden',
          ]"
          title="Copy"
        >
          <svg
            v-if="copyClicked"
            :class="[
              'w-3.5 h-3.5 text-green-400 transition-all duration-500',
              'animate-bounce scale-110',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <svg
            v-else
            :class="[
              'w-3.5 h-3.5 transition-all duration-300',
              'text-gray-400 hover:text-white hover:scale-110',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <!-- Copy success animation -->
          <div v-if="copyClicked" class="copy-success-ring"></div>
          <div v-if="copyClicked" class="copy-sparkle"></div>
        </button>

        <button
          @click="handleExecuteClick"
          :class="[
            'execute-btn',
            'ml-2 px-3 py-1 rounded text-xs font-medium',
            'bg-green-500 text-white hover:bg-green-600',
            'transition-all duration-200 flex items-center gap-1.5',
            'relative overflow-hidden',
            { 'is-executing': executeClicked },
          ]"
        >
          <svg
            :class="[
              'w-3 h-3 execute-icon transition-all duration-400',
              executeClicked ? 'animate-spin scale-125 text-yellow-300' : '',
            ]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            :class="[
              'execute-text transition-all duration-300',
              executeClicked ? 'animate-pulse scale-105' : '',
            ]"
          >
            Execute
          </span>
          <!-- Execute animation layers -->
          <div v-if="executeClicked" class="execute-energy-wave"></div>
          <div v-if="executeClicked" class="execute-power-surge"></div>
          <div v-if="executeClicked" class="execute-glow"></div>
        </button>
      </div>
    </div>

    <!-- Editor Area -->
    <div class="flex-1 flex min-h-0">
      <!-- Line Numbers -->
      <div
        class="w-10 flex-shrink-0 bg-black/20 border-r border-white/5 overflow-y-auto overflow-x-hidden"
      >
        <div :class="[theme.text.muted, 'text-right pr-2 py-3 text-[11px] select-none']">
          <div v-for="i in lineCount" :key="i" class="leading-[1.375rem]">{{ i }}</div>
        </div>
      </div>
      <!-- Text Area Container -->
      <div class="flex-1 relative">
        <textarea
          ref="editor"
          @input="handleInput"
          @keydown="handleKeydown"
          @focus="handleFocus"
          @blur="handleBlur"
          @click="updateCursorPosition"
          @keyup="updateCursorPosition"
          :class="[
            'absolute inset-0 w-full h-full px-3 py-3',
            'bg-transparent',
            theme.text.primary,
            'font-mono text-xs leading-[1.375rem]',
            'focus:outline-none resize-none',
            'placeholder-gray-500 whitespace-pre-wrap',
            'text-left',
          ]"
          :placeholder="getPlaceholder()"
          spellcheck="false"
        />
      </div>
    </div>

    <!-- Status Bar -->
    <div
      class="border-t border-white/5 bg-black/10 px-3 py-1 flex items-center justify-between flex-shrink-0"
    >
      <div class="flex items-center gap-3 text-[10px]">
        <span :class="[theme.text.muted, 'flex items-center gap-1']">
          <kbd class="px-1 py-0.5 bg-white/10 rounded text-[9px]">Ctrl</kbd>+<kbd
            class="px-1 py-0.5 bg-white/10 rounded text-[9px]"
            >↵</kbd
          >
        </span>
        <span :class="[theme.text.muted]">Ln {{ currentLine }}, Col {{ currentCol }}</span>
      </div>
      <div :class="[theme.text.muted, 'text-[10px] flex items-center gap-1']">
        <span
          v-if="isUserEditing"
          class="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse"
        ></span>
        GraphQL
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick, watch, onMounted } from 'vue'
import prettier from 'prettier/standalone'
import graphqlParser from 'prettier/plugins/graphql'

interface Props {
  modelValue: string
  mode: string
  theme: any
  error?: string | null
}
const props = withDefaults(defineProps<Props>(), { error: null })
const emit = defineEmits(['update:modelValue', 'execute', 'update:error'])

const editor = ref<HTMLTextAreaElement>()
const formatClicked = ref(false)
const copyClicked = ref(false)
const executeClicked = ref(false)
const currentLine = ref(1)
const currentCol = ref(1)

// Editing state management
const isUserEditing = ref(false)
const userEditTimeout = ref<number | null>(null)
const lastKnownValue = ref('')

// Initialize editor value on mount
onMounted(() => {
  if (editor.value) {
    editor.value.value = props.modelValue
    lastKnownValue.value = props.modelValue
  }
})

// Watch for external changes - only sync when user is NOT actively editing
watch(
  () => props.modelValue,
  async (newVal) => {
    if (isUserEditing.value) return
    if (newVal === lastKnownValue.value) return

    if (editor.value && newVal !== editor.value.value) {
      const shouldFormat = isValidGraphQL(newVal) && newVal.trim().length > 0
      let valueToSet = newVal

      if (shouldFormat) {
        try {
          valueToSet = await formatGraphQL(newVal)
        } catch (error) {
          valueToSet = newVal
        }
      }

      const wasAtEnd = editor.value.selectionStart >= editor.value.value.length
      const cursorPos = editor.value.selectionStart

      editor.value.value = valueToSet
      lastKnownValue.value = valueToSet

      nextTick(() => {
        if (editor.value) {
          const newPos = wasAtEnd ? valueToSet.length : Math.min(cursorPos, valueToSet.length)
          editor.value.selectionStart = editor.value.selectionEnd = newPos
          updateCursorPosition()
        }
      })
    }
  },
)

const lineCount = computed(() => {
  const text = editor.value?.value || props.modelValue
  return text.split('\n').length || 1
})

const getPlaceholder = () =>
  props.mode === 'freestyle'
    ? `query {\n  # Try any field like:\n  # name, joke, coffee\n}`
    : `query {\n  ${props.mode} {\n    # Start typing...\n  }\n}`

const formatGraphQL = async (code: string): Promise<string> => {
  try {
    if (!code.trim()) return code
    const formatted = await prettier.format(code, {
      parser: 'graphql',
      plugins: [graphqlParser],
      printWidth: 80,
      tabWidth: 2,
      useTabs: false,
      semi: false,
      singleQuote: true,
    })
    return formatted.trim()
  } catch (error) {
    console.error('GraphQL formatting error:', error)
    throw error
  }
}

const isValidGraphQL = (code: string): boolean => {
  if (!code.trim()) return false
  const graphqlKeywords =
    /\b(query|mutation|subscription|fragment|schema|type|interface|union|enum|input|directive|scalar)\b/i
  const hasGraphQLStructure = /[{}]/.test(code) || graphqlKeywords.test(code)
  return hasGraphQLStructure
}

const handleFocus = () => {
  isUserEditing.value = true
}

const handleInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement
  const newValue = target.value

  isUserEditing.value = true

  if (userEditTimeout.value) {
    clearTimeout(userEditTimeout.value)
  }

  userEditTimeout.value = setTimeout(() => {
    isUserEditing.value = false
    lastKnownValue.value = newValue
  }, 1000) as unknown as number

  emit('update:modelValue', newValue)
  emit('update:error', null)
  updateCursorPosition()
}

const handleBlur = () => {
  setTimeout(() => {
    isUserEditing.value = false
    if (editor.value) {
      lastKnownValue.value = editor.value.value
    }
  }, 100)
}

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    e.preventDefault()
    handleExecuteClick()
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
    e.preventDefault()
    formatQuery()
  }
}

const handleExecuteClick = () => {
  executeClicked.value = true
  setTimeout(() => {
    executeClicked.value = false
  }, 800)
  emit('execute')
}

const updateCursorPosition = () => {
  if (!editor.value) return
  const text = editor.value.value.substring(0, editor.value.selectionStart)
  const lines = text.split('\n')
  currentLine.value = lines.length
  currentCol.value = lines[lines.length - 1].length + 1
}

const formatQuery = async () => {
  if (formatClicked.value) return
  formatClicked.value = true
  setTimeout(() => {
    formatClicked.value = false
  }, 1000)

  const currentValue = editor.value?.value || props.modelValue
  if (!currentValue.trim()) return

  try {
    const cursorPos = editor.value?.selectionStart || 0
    const formatted = await formatGraphQL(currentValue)

    if (editor.value) {
      editor.value.value = formatted
      lastKnownValue.value = formatted
      emit('update:modelValue', formatted)

      nextTick(() => {
        if (editor.value) {
          const newPos = Math.min(cursorPos, formatted.length)
          editor.value.selectionStart = editor.value.selectionEnd = newPos
          editor.value.focus()
          updateCursorPosition()
        }
      })
    }
  } catch (error) {
    console.error('Formatting error:', error)
  }
}

const copyQuery = async () => {
  if (copyClicked.value) return
  copyClicked.value = true
  setTimeout(() => {
    copyClicked.value = false
  }, 1500)

  try {
    const textToCopy = editor.value?.value || props.modelValue
    await navigator.clipboard.writeText(textToCopy)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}
</script>

<style scoped>
/* Scrollbar */
textarea::-webkit-scrollbar {
  width: 6px;
}
textarea::-webkit-scrollbar-track {
  background: transparent;
}
textarea::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}
textarea::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

textarea {
  caret-color: #10b981;
}

/* Format Button Animations */
.format-ripple {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: format-ripple-expand 1s ease-out;
}

.format-pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 2px solid rgba(59, 130, 246, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: format-pulse-ring 1s ease-out;
}

@keyframes format-ripple-expand {
  0% {
    width: 8px;
    height: 8px;
    opacity: 1;
  }
  100% {
    width: 50px;
    height: 50px;
    opacity: 0;
  }
}

@keyframes format-pulse-ring {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
}

/* Copy Button Animations */
.copy-success-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border: 3px solid rgba(34, 197, 94, 0.6);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: copy-success-expand 1.5s ease-out;
}

.copy-sparkle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #10b981;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: copy-sparkle-burst 1.5s ease-out;
}

.copy-sparkle::before,
.copy-sparkle::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  background: #10b981;
  border-radius: 50%;
}

.copy-sparkle::before {
  top: -8px;
  left: 0;
  animation: copy-sparkle-1 1.5s ease-out;
}

.copy-sparkle::after {
  top: 0;
  left: 8px;
  animation: copy-sparkle-2 1.5s ease-out;
}

@keyframes copy-success-expand {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}

@keyframes copy-sparkle-burst {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0.7;
  }
}

@keyframes copy-sparkle-1 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-15px, -15px) scale(0);
    opacity: 0;
  }
}

@keyframes copy-sparkle-2 {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(15px, -10px) scale(0);
    opacity: 0;
  }
}

/* Execute Button Animations */
.execute-btn.is-executing {
  animation: execute-button-press 0.8s ease-out;
  box-shadow: 0 0 25px rgba(34, 197, 94, 0.4);
}

.execute-energy-wave {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  animation: execute-energy-sweep 0.8s ease-out;
}

.execute-power-surge {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border: 2px solid rgba(34, 197, 94, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: execute-power-expand 0.8s ease-out;
}

.execute-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(34, 197, 94, 0.1);
  border-radius: inherit;
  animation: execute-glow-pulse 0.8s ease-out;
}

@keyframes execute-button-press {
  0%,
  100% {
    transform: scale(1) rotateY(0deg);
  }
  25% {
    transform: scale(0.95) rotateY(-5deg);
  }
  50% {
    transform: scale(1.05) rotateY(5deg);
  }
  75% {
    transform: scale(0.98) rotateY(-2deg);
  }
}

@keyframes execute-energy-sweep {
  0% {
    left: -100%;
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    left: 100%;
    opacity: 0;
  }
}

@keyframes execute-power-expand {
  0% {
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    width: 80px;
    height: 80px;
    opacity: 0;
  }
}

@keyframes execute-glow-pulse {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* Button Hover Effects */
.action-btn:hover {
  transform: translateY(-1px);
  background-color: rgba(255, 255, 255, 0.15);
}

.action-btn:active {
  transform: translateY(0) scale(0.95);
}

.execute-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.3);
}

.execute-btn:active {
  transform: translateY(0);
}
</style>
