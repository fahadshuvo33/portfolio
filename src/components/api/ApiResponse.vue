<template>
  <div :class="[theme.bg.secondary, 'rounded-lg h-full flex flex-col']" data-testid="api-response">
    <!-- Header - Always visible -->
    <div
      :class="[
        theme.bg.tertiary,
        'px-4 py-3 flex items-center justify-between flex-shrink-0 sticky top-0 z-10',
      ]"
    >
      <div class="flex items-center gap-4">
        <h3 :class="[theme.text.secondary, 'text-sm font-medium']">RESPONSE</h3>

        <!-- Status Indicators -->
        <div v-if="response || error" class="flex items-center gap-3 text-xs">
          <span :class="['flex items-center gap-1', error ? 'text-red-400' : 'text-green-400']">
            <span class="w-2 h-2 rounded-full bg-current animate-pulse"></span>
            {{ error ? 'Error' : '200 OK' }}
          </span>
          <span :class="[theme.text.muted, 'flex items-center gap-1']">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {{ executionTime }}ms
          </span>
          <span :class="[theme.text.muted]">
            {{ responseSize }}
          </span>
        </div>
      </div>

      <!-- Actions -->
      <div v-if="response" class="flex items-center gap-2">
        <!-- Format Toggle -->
        <button
          @click="toggleFormat"
          :class="[
            theme.text.muted,
            'p-1.5 hover:' + theme.text.primary,
            'transition-colors',
            isFormatted ? 'text-blue-400' : '',
          ]"
          :title="isFormatted ? 'Show Raw JSON' : 'Format JSON'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <!-- Search -->
        <div class="relative flex items-center gap-1">
          <div class="relative">
            <input
              v-model="searchQuery"
              @input="performSearch"
              @keydown.enter.exact="nextMatch"
              @keydown.shift.enter.exact="prevMatch"
              type="text"
              placeholder="Search..."
              :class="[
                theme.bg.primary,
                theme.text.primary,
                'pl-8 pr-3 py-1 text-xs rounded-lg w-32 focus:w-48 transition-all',
                'focus:outline-none focus:ring-1 focus:ring-green-500',
              ]"
            />
            <svg
              :class="['w-3 h-3 absolute left-2.5 top-1.5', theme.text.muted]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <!-- Search Navigation -->
          <div v-if="searchQuery && totalMatches > 0" class="flex items-center gap-1">
            <span class="text-[10px] text-gray-400 px-2">
              {{ currentMatchIndex }}/{{ totalMatches }}
            </span>
            <button
              @click="prevMatch"
              class="p-1 hover:bg-gray-700 rounded transition-colors"
              :disabled="totalMatches <= 1"
            >
              <svg
                class="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              @click="nextMatch"
              class="p-1 hover:bg-gray-700 rounded transition-colors"
              :disabled="totalMatches <= 1"
            >
              <svg
                class="w-3 h-3 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Download -->
        <button
          @click="$emit('download')"
          :class="[theme.text.muted, 'p-1.5 hover:' + theme.text.primary, 'transition-colors']"
          title="Download JSON"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 flex items-center justify-center" :class="theme.bg.primary">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center">
        <div class="flex items-center gap-3">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-400"></div>
          <span :class="theme.text.muted">Executing query...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4">
        <div class="max-w-lg w-full">
          <div class="flex items-start gap-3 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
            <svg
              class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div class="flex-1">
              <h4 class="text-red-400 font-medium text-sm mb-1">Query Error</h4>
              <p :class="[theme.text.secondary, 'text-sm break-all']">{{ error }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Success State with Formatted JSON -->
      <div v-else-if="response" class="h-full overflow-auto p-4 w-full">
        <div
          ref="responseContainer"
          :class="[
            theme.text.secondary,
            'font-mono text-sm leading-relaxed w-full',
            isFormatted ? 'whitespace-pre-wrap' : 'whitespace-pre-wrap break-all',
          ]"
          v-html="displayResponse"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="text-center">
        <div class="inline-flex items-center justify-center w-12 h-12 rounded-lg mb-3">
          <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <p :class="[theme.text.muted, 'text-xs']">No response yet</p>
        <p :class="[theme.text.muted, 'text-[10px] mt-1 opacity-60']">
          Execute a query to see results
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import type { GraphQLResponseMetadata } from '@/composables/useGraphqlStats'

defineOptions({
  name: 'ApiResponse',
})

interface ThemeColors {
  bg: {
    primary: string
    secondary: string
    tertiary: string
    muted: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
  }
  border: string
  primary: string
  secondary: string
}

interface Props {
  response: unknown
  loading: boolean
  error: string | null
  theme?: ThemeColors
  metadata?: GraphQLResponseMetadata | null
}

const props = withDefaults(defineProps<Props>(), {
  theme: () => ({
    bg: {
      primary: 'bg-gray-900',
      secondary: 'bg-gray-800',
      tertiary: 'bg-gray-700',
      muted: 'bg-gray-700',
    },
    text: {
      primary: 'text-white',
      secondary: 'text-gray-300',
      muted: 'text-gray-400',
    },
    border: 'border-gray-700',
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
  }),
})

const searchQuery = ref('')
const currentMatchIndex = ref(0)
const totalMatches = ref(0)
const responseContainer = ref<HTMLElement>()
const isFormatted = ref(true)
const executionTime = computed(() => Math.floor(Math.random() * 200) + 50)

const responseSize = computed(() => {
  if (!props.response) return '0 B'
  const size = new Blob([JSON.stringify(props.response)]).size
  if (size < 1024) return `${size} B`
  return `${(size / 1024).toFixed(1)} KB`
})

// Toggle between formatted and raw JSON
const toggleFormat = () => {
  isFormatted.value = !isFormatted.value
}

// Get plain text content for searching
const getPlainTextContent = computed(() => {
  if (!props.response) return ''

  try {
    const data = typeof props.response === 'string' ? JSON.parse(props.response) : props.response

    if (isFormatted.value) {
      return JSON.stringify(data, null, 2)
    } else {
      return JSON.stringify(data, null, 0)
    }
  } catch (e) {
    return String(props.response)
  }
})

// COMPACT HIDDEN FIELD - inline badge style
// COMPACT HIDDEN FIELD - with key name and icon only
// COMPACT HIDDEN FIELD - without key name in badge (since it's already shown before colon)
// COMPACT HIDDEN FIELD - border covers key and value
const createHiddenFieldContent = (value: unknown, fieldName: string = '') => {
  const displayValue = typeof value === 'string' ? value : JSON.stringify(value)

  return `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-blue-500/20 text-blue-200 border border-blue-500/30 text-sm">
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
    </svg>
    <span class="font-medium text-blue-300">"${fieldName}"</span>
    <span class="text-blue-200">:</span>
    <span class="font-mono">${typeof displayValue === 'string' ? `"${escapeHtml(displayValue)}"` : escapeHtml(displayValue)}</span>
  </span>`
}

// COMPACT INVALID FIELD - border covers key and value
const createInvalidFieldContent = (fieldName: string = '') => {
  return `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/20 text-red-200 border border-red-500/30 text-sm">
    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
    </svg>
    <span class="font-medium text-red-300">"${fieldName}"</span>
    <span class="text-red-200">:</span>
    <span class="font-mono line-through decoration-red-400">null</span>
  </span>`
}

// Main display response computed property
const displayResponse = computed(() => {
  if (!props.response) return ''

  try {
    let data, metadata

    // Check if response contains both data and metadata
    if (typeof props.response === 'object' && props.response !== null && 'data' in props.response) {
      data = props.response.data
      metadata = props.response.metadata
    } else if (
      typeof props.response === 'object' &&
      props.response !== null &&
      'metadata' in props.response
    ) {
      // If metadata is at the same level as the data
      const { metadata: responseMeta, ...responseData } = props.response
      data = responseData
      metadata = responseMeta
    } else {
      // Fallback: use the response as-is and try to find metadata within it
      data = props.response
      metadata = props.response.metadata || null
    }

    console.log('🔍 Extracted data:', data)
    console.log('🔍 Extracted metadata:', metadata)

    if (isFormatted.value) {
      return formatJsonWithSearch(data, 0, '', metadata)
    } else {
      const rawJson = JSON.stringify(data, null, 0)
      return applySearchHighlight(escapeHtml(rawJson))
    }
  } catch (e) {
    const rawContent = escapeHtml(String(props.response))
    return applySearchHighlight(rawContent)
  }
})

const formatJsonWithSearch = (
  obj: unknown,
  indent: number,
  parentKey: string = '',
  metadata: GraphQLResponseMetadata | null = null,
): string => {
  const indentStr = '  '.repeat(indent)
  const nextIndentStr = '  '.repeat(indent + 1)

  // Debug logging
  if (indent === 0) {
    console.log('🔍 formatJsonWithSearch called with metadata:', metadata)
    console.log('🔍 fieldTypes:', metadata?.fieldTypes)
  }

  // Get field type from metadata
  const getFieldType = (key: string): 'normal' | 'hidden' | 'invalid' | null => {
    if (!metadata?.fieldTypes) return null
    const fieldType = metadata.fieldTypes[key] || null
    if (fieldType) {
      console.log(`🔍 Field "${key}" has type:`, fieldType)
    }
    return fieldType
  }

  // Handle error objects
  if (obj && typeof obj === 'object' && obj !== null && '__error' in obj) {
    const errorObj = obj as { __error: { message: string } }
    const errorContent = `<span class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-red-500/10 text-red-400 border-l-2 border-red-500">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span class="line-through">"${escapeHtml(errorObj.__error.message)}"</span>
      <span class="text-xs text-red-300 opacity-75">ERROR</span>
    </span>`
    return highlightInContent(errorContent, `"${errorObj.__error.message}"`)
  }

  if (obj === null) {
    return highlightInContent(
      `<span class="px-1.5 py-0.5 rounded text-xs bg-gray-600/20 text-gray-400 font-mono">null</span>`,
      'null',
    )
  }

  if (typeof obj === 'boolean') {
    const boolClass = obj ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'
    return highlightInContent(
      `<span class="px-1.5 py-0.5 rounded text-xs font-semibold ${boolClass}">${obj}</span>`,
      String(obj),
    )
  }

  if (typeof obj === 'number') {
    return highlightInContent(
      `<span class="px-1.5 py-0.5 rounded text-xs bg-blue-500/15 text-blue-400 font-mono">${obj}</span>`,
      String(obj),
    )
  }

  if (typeof obj === 'string') {
    const escapedString = escapeHtml(obj)
    // REMOVED URL/EMAIL STYLING - treat all strings the same
    const formattedString = `<span class="text-green-300">"${escapedString}"</span>`
    return highlightInContent(formattedString, `"${obj}"`)
  }

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]'

    const items = obj
      .map((item, index) => {
        const itemStr = formatJsonWithSearch(item, indent + 1, parentKey, metadata)
        return `${nextIndentStr}${itemStr}${index < obj.length - 1 ? ',' : ''}`
      })
      .join('\n')

    return `[\n${items}\n${indentStr}]`
  }

  if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj)
    if (entries.length === 0) return '{}'

    const formattedEntries = entries
      .map(([key, value]) => {
        // Skip metadata fields that start with __
        if (key.startsWith('__') && key !== '__error') {
          return ''
        }

        // Debug logging for each key
        console.log(`🔍 Processing key: "${key}", value:`, value)

        // Check field type FIRST
        const fieldType = getFieldType(key)
        console.log(`🔍 Field "${key}" resolved to type:`, fieldType)

        // Handle different field types
        if (fieldType === 'hidden') {
          console.log(`🔍 Creating hidden field content for "${key}"`)
          return `${nextIndentStr}${createHiddenFieldContent(value, key)}`
        }

        if (fieldType === 'invalid') {
          console.log(`🔍 Creating invalid field content for "${key}"`)
          return `${nextIndentStr}${createInvalidFieldContent(key)}`
        }

        // For normal fields, format normally
        console.log(`🔍 Formatting "${key}" as normal field`)
        const formattedValue = formatJsonWithSearch(value, indent + 1, key, metadata)
        const formattedKey = `"${key}"`
        return `${nextIndentStr}${formattedKey}: ${formattedValue}`
      })
      .filter(Boolean)
      .join(',\n')

    return `{\n${formattedEntries}\n${indentStr}}`
  }

  const stringValue = String(obj)
  return highlightInContent(escapeHtml(stringValue), stringValue)
}

const highlightInContent = (htmlContent: string, plainTextContent: string): string => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    return htmlContent
  }

  const searchTerm = searchQuery.value.trim()
  if (!plainTextContent.toLowerCase().includes(searchTerm.toLowerCase())) {
    return htmlContent
  }

  // For simple cases, we can safely highlight
  const searchRegex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi')

  // Only apply highlighting to visible text content, not HTML tags
  return htmlContent.replace(/>[^<]*</g, (match) => {
    const textContent = match.slice(1, -1) // Remove > and <
    if (textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      const highlighted = textContent.replace(searchRegex, (matchedText) => {
        const matchNumber = getMatchNumber(matchedText)
        const isCurrentMatch = matchNumber === currentMatchIndex.value
        return `<span class="${isCurrentMatch ? 'bg-yellow-400 text-black' : 'bg-yellow-500/20 text-yellow-300'} px-1 rounded-sm" data-match="${matchNumber}">${matchedText}</span>`
      })
      return `>${highlighted}<`
    }
    return match
  })
}

let matchCounter = 0
const getMatchNumber = (match: string): number => {
  return ++matchCounter
}

const applySearchHighlight = (text: string): string => {
  if (!searchQuery.value || !searchQuery.value.trim()) {
    totalMatches.value = 0
    currentMatchIndex.value = 0
    return text
  }

  matchCounter = 0 // Reset counter
  const searchTerm = escapeRegExp(searchQuery.value.trim())
  const regex = new RegExp(`(${searchTerm})`, 'gi')
  const matches = text.match(regex)
  totalMatches.value = matches ? matches.length : 0

  if (totalMatches.value > 0) {
    return text.replace(regex, (match) => {
      const matchNumber = getMatchNumber(match)
      const isCurrentMatch = matchNumber === currentMatchIndex.value
      return `<span class="${isCurrentMatch ? 'bg-yellow-400 text-black' : 'bg-yellow-500/20 text-yellow-300'} px-1 rounded-sm" data-match="${matchNumber}">${match}</span>`
    })
  }

  return text
}

const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

const performSearch = () => {
  matchCounter = 0 // Reset match counter
  if (searchQuery.value && searchQuery.value.trim()) {
    // Count matches in plain text
    const plainText = getPlainTextContent.value
    const searchTerm = escapeRegExp(searchQuery.value.trim())
    const regex = new RegExp(searchTerm, 'gi')
    const matches = plainText.match(regex)
    totalMatches.value = matches ? matches.length : 0
    currentMatchIndex.value = totalMatches.value > 0 ? 1 : 0
  } else {
    currentMatchIndex.value = 0
    totalMatches.value = 0
  }
}

const nextMatch = () => {
  if (totalMatches.value > 0) {
    currentMatchIndex.value =
      currentMatchIndex.value >= totalMatches.value ? 1 : currentMatchIndex.value + 1
    scrollToCurrentMatch()
  }
}

const prevMatch = () => {
  if (totalMatches.value > 0) {
    currentMatchIndex.value =
      currentMatchIndex.value <= 1 ? totalMatches.value : currentMatchIndex.value - 1
    scrollToCurrentMatch()
  }
}

const scrollToCurrentMatch = () => {
  nextTick(() => {
    if (responseContainer.value && currentMatchIndex.value > 0) {
      const currentMatch = responseContainer.value.querySelector(
        `[data-match="${currentMatchIndex.value}"]`,
      )
      if (currentMatch) {
        currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  })
}

// Reset search when response changes
watch(
  () => props.response,
  () => {
    searchQuery.value = ''
    currentMatchIndex.value = 0
    totalMatches.value = 0
  },
)

// Update search when searchQuery changes
watch(searchQuery, () => {
  performSearch()
})
</script>

<style scoped>
/* Remove the old large block styling for hidden and invalid fields */
:deep(.hidden-field-container),
:deep(.invalid-field-container) {
  display: inline;
  margin: 0;
  padding: 0;
}

:deep(.hidden-field-content),
:deep(.invalid-field-content) {
  display: inline-flex;
  padding: 0;
  margin: 0;
  background: none;
  border: none;
  box-shadow: none;
  animation: none;
}

/* New compact badge styles for hidden and invalid fields */
:deep(.bg-blue-500\/20) {
  background-color: rgba(59, 130, 246, 0.2);
}

:deep(.bg-red-500\/20) {
  background-color: rgba(239, 68, 68, 0.2);
}

:deep(.border-blue-500\/30) {
  border-color: rgba(59, 130, 246, 0.3);
}

:deep(.border-red-500\/30) {
  border-color: rgba(239, 68, 68, 0.3);
}

:deep(.bg-blue-600\/50) {
  background-color: rgba(37, 99, 235, 0.5);
}

:deep(.bg-red-600\/50) {
  background-color: rgba(220, 38, 38, 0.5);
}

/* Hover effects for compact badges */
:deep(.inline-flex:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

/* Animation for scrollbar */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Scrollbar styling */
.overflow-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-auto::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.overflow-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Clean syntax highlighting colors */
:deep(.text-green-300) {
  color: #86efac;
}

:deep(.text-green-400) {
  color: #4ade80;
}

:deep(.text-blue-300) {
  color: #93c5fd;
}

:deep(.text-blue-400) {
  color: #60a5fa;
}

:deep(.text-blue-200) {
  color: #bfdbfe;
}

:deep(.text-red-200) {
  color: #fecaca;
}

:deep(.text-red-400) {
  color: #f87171;
}

:deep(.text-gray-400) {
  color: #9ca3af;
}

:deep(.text-gray-500) {
  color: #6b7280;
}

/* Typography */
:deep(.font-semibold) {
  font-weight: 600;
}

:deep(.font-medium) {
  font-weight: 500;
}

:deep(.font-mono) {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

/* Line through styling for invalid fields */
:deep(.line-through) {
  text-decoration-line: line-through;
  text-decoration-thickness: 1.5px;
}

:deep(.decoration-red-400) {
  text-decoration-color: rgba(248, 113, 113, 1);
}

/* Background colors for other field types */
:deep(.bg-green-500\/15) {
  background-color: rgba(34, 197, 94, 0.15);
}

:deep(.bg-red-500\/15) {
  background-color: rgba(239, 68, 68, 0.15);
}

:deep(.bg-blue-500\/15) {
  background-color: rgba(59, 130, 246, 0.15);
}

:deep(.bg-gray-600\/20) {
  background-color: rgba(75, 85, 99, 0.2);
}

/* Remove all the old large block animations and styling */
:deep(.hidden-field-content::before) {
  display: none;
}

:deep(.hidden-field-content:hover) {
  transform: none;
  box-shadow: none;
  border-color: inherit;
  background: inherit;
  animation: none;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(59, 130, 246, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
  }
}

/* Remove pulse animation */
:deep(.hidden-field-content) {
  animation: none;
}

/* Clean icon styling */
:deep(.inline-flex svg) {
  opacity: 0.9;
  transition: opacity 0.2s ease;
}

:deep(.inline-flex:hover svg) {
  opacity: 1;
}

/* Search highlight styling */
:deep(.bg-yellow-400) {
  background-color: #facc15;
}

:deep(.bg-yellow-500\/20) {
  background-color: rgba(234, 179, 8, 0.2);
}

:deep(.text-yellow-300) {
  color: #fde047;
}
/* Key name styling in badges */
:deep(.text-blue-300) {
  color: #93c5fd;
}

:deep(.text-red-300) {
  color: #fca5a5;
}

/* Make key names slightly bolder */
:deep(.font-medium) {
  font-weight: 500;
}

/* Adjust spacing in compact badges */
:deep(.gap-1\.5) {
  gap: 0.375rem;
}
</style>
