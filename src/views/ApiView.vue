<template>
  <div>
    <!-- Loading State -->
    <div v-show="isInitialized && !initializationError">
      <div class="w-full">
        <!-- Desktop container -->
        <div class="hidden md:block max-w-[1400px] mx-auto px-6 py-6">
          <!-- Header -->
          <ApiHeader
            :stats="stats"
            :current-theme="currentTheme"
            @toggle-theme="toggleTheme"
            @show-help="showHelp = true"
          />

          <!-- Responsive Layout -->
          <ApiLayout
            v-model:query-mode="queryMode"
            :current-query="currentQuery"
            :theme="theme"
            :categories="categories"
            :freestyle-info="freestyleInfo"
            :stats="stats"
            :achievements="achievements"
            :selected-fields="selectedFields"
            :hidden-fields="hiddenFieldTips"
            :response="response"
            :loading="loading"
            :error="error"
            :query-history="queryHistory"
            @insert-query="insertQuery"
            @example-select="handleExampleSelect"
            @update-query="(query) => (currentQuery = query)"
            @execute-query="executeQuery"
            @field-selection-change="handleFieldSelectionChange"
            @download-response="downloadResponse"
            @load-history="loadHistoryQuery"
          />
        </div>

        <!-- Mobile container with consistent padding -->
        <div class="block md:hidden w-full px-4 py-4">
          <!-- Header -->
          <div class="mb-6">
            <ApiHeader
              :stats="stats"
              :current-theme="currentTheme"
              @toggle-theme="toggleTheme"
              @show-help="showHelp = true"
            />
          </div>

          <!-- Responsive Layout -->
          <ApiLayout
            v-model:query-mode="queryMode"
            :current-query="currentQuery"
            :theme="theme"
            :categories="categories"
            :freestyle-info="freestyleInfo"
            :stats="stats"
            :achievements="achievements"
            :selected-fields="selectedFields"
            :hidden-fields="hiddenFieldTips"
            :response="response"
            :loading="loading"
            :error="error"
            :query-history="queryHistory"
            @insert-query="insertQuery"
            @example-select="handleExampleSelect"
            @update-query="(query) => (currentQuery = query)"
            @execute-query="executeQuery"
            @field-selection-change="handleFieldSelectionChange"
            @download-response="downloadResponse"
            @load-history="loadHistoryQuery"
          />
        </div>
      </div>

      <!-- Help Modal -->
      <HelpModal
        v-if="showHelp"
        :theme="theme"
        @close="showHelp = false"
        @select="handleExampleSelect"
        :categories="categories"
        :freestyle-info="freestyleInfo"
      />
    </div>

    <!-- Notifications Container -->
    <div class="fixed bottom-4 right-4 z-50 flex flex-col space-y-2">
      <AppNotification
        v-for="notification in notifications"
        :key="notification.id"
        :message="notification.message"
        :type="notification.type"
        @close="removeNotification(notification.id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, provide } from 'vue'
import type { GraphQLResponse } from '@/composables/useGraphqlStats'
import { useTheme } from '@/composables/useTheme'
import { usePortfolioApi } from '@/composables/useCategoryInfo'
import { useGraphQLStats } from '@/composables/useGraphqlStats'
import { executeQuery as executeGraphQLQuery } from '@/api/executor'

// Component imports
import AppNotification from '@/components/Notification.vue'
import ApiHeader from '@/components/api/ApiHeader.vue'
import ApiLayout from '@/components/api/ApiLayout.vue'
import HelpModal from '@/components/api/HelpModal.vue'

// Types
interface QueryHistoryItem {
  id: string
  query: string
  mode: string
  timestamp: Date
  success: boolean
  duration: number
}

interface ExampleQuery {
  query: string
  mode: string
  fields?: string[]
}

// Use composables
const { theme, currentTheme, toggleTheme } = useTheme()
const { categories, freestyleInfo } = usePortfolioApi()
const { trackGraphQLQuery, stats, achievements } = useGraphQLStats()

// State
const queryMode = ref('about')
const currentQuery = ref('')
const showHelp = ref(false)
const isInitialized = ref(false)
const initializationError = ref<string | null>(null)
const selectedFields = ref<string[]>([])
const queryHistory = ref<QueryHistoryItem[]>([])
const loading = ref(false)
const error = ref('')
const response = ref<{ data: any; metadata: any } | null>(null)

// Notifications
const notifications = ref<Array<{ id: number; message: string; type: string }>>([])

// Hidden field tips for freestyle mode
const hiddenFieldTips = ref([
  { field: 'joke', hint: 'Get a random programming joke' },
  { field: 'coffee', hint: 'Check my coffee addiction level' },
  { field: 'matrix', hint: 'Are you ready for the matrix?' },
  { field: 'hackerman', hint: 'Ultimate hacker status' },
  { field: 'salary', hint: 'My dream salary expectations' },
])

// Notification functions
const showNotification = (message: string, type = 'info') => {
  const id = Date.now()
  notifications.value.push({ id, message, type })

  setTimeout(() => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  }, 5000)
}

const removeNotification = (id: number) => {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index !== -1) {
    notifications.value.splice(index, 1)
  }
}

// Handle field selection change from Docs component
const handleFieldSelectionChange = (event: {
  mode: string
  selectedFields: string[]
  field: string
  action: 'add' | 'remove' | 'replace'
  query?: string
}) => {
  const { mode, field, action, selectedFields: newFields, query } = event

  if (mode === 'freestyle') {
    let updatedFields: string[]

    // Handle field addition/removal
    if (action === 'add') {
      if (!selectedFields.value.includes(field)) {
        updatedFields = [...selectedFields.value, field]
      } else {
        updatedFields = [...selectedFields.value]
      }
    } else if (action === 'remove') {
      updatedFields = selectedFields.value.filter((f) => f !== field)
    } else {
      // For replace action, use the provided selectedFields array
      updatedFields = [...newFields]
    }

    // Update the selected fields
    selectedFields.value = updatedFields

    // Generate freestyle query with all selected fields
    if (updatedFields.length > 0) {
      currentQuery.value = `{\n  ${updatedFields.join('\n  ')}\n}`
    } else {
      currentQuery.value = '{\n  # Select fields from the documentation panel\n}'
    }
  } else {
    // For other modes, use the provided query or generate one
    selectedFields.value = [...newFields]
    if (query) {
      currentQuery.value = query
    }
  }
}

// Methods
const insertQuery = (query: string) => {
  currentQuery.value = query
}

const executeQuery = async () => {
  const query = currentQuery.value.trim()
  if (!query) return

  loading.value = true
  error.value = ''
  const startTime = performance.now()

  try {
    const result: GraphQLResponse | { __error: { message: string; type: string } } =
      await executeGraphQLQuery(query)
    const duration = Math.round(performance.now() - startTime)

    if (result && result.__error) {
      // Handle error response
      error.value = result.__error.message
      response.value = { data: null, metadata: null }
      showNotification(`Error: ${result.__error.message}`, 'error')
      trackGraphQLQuery(query, {
        data: null,
        errors: [{ message: result.__error.message }],
        metadata: result.__metadata || {
          fieldTypes: {},
          hiddenFields: 0,
          invalidFields: 0,
          totalFields: 0,
          validFields: 0,
        },
      })
    } else {
      // Extract metadata and clean data
      const { __metadata, ...cleanResult } = result

      // Set the response as an object with both data and metadata
      response.value = {
        data: cleanResult,
        metadata: __metadata || {
          fieldTypes: {},
          hiddenFields: 0,
          invalidFields: 0,
          totalFields: 0,
          validFields: 0,
        },
      }
      error.value = ''
      showNotification('Query executed successfully', 'success')

      // Track the query with metadata
      trackGraphQLQuery(query, {
        data: cleanResult,
        errors: [],
        metadata: __metadata || {
          fieldTypes: {},
          hiddenFields: 0,
          invalidFields: 0,
          totalFields: 0,
          validFields: 0,
        },
      })
    }

    // Add to query history
    const success = !result?.__error
    queryHistory.value.unshift({
      id: Date.now().toString(),
      query: currentQuery.value,
      mode: queryMode.value,
      timestamp: new Date(),
      success,
      duration,
    })

    if (queryHistory.value.length > 20) {
      queryHistory.value = queryHistory.value.slice(0, 20)
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Query execution failed'
    error.value = errorMessage
    response.value = { data: null, metadata: null }
    showNotification(errorMessage, 'error')

    trackGraphQLQuery(currentQuery.value, {
      data: null,
      errors: [{ message: errorMessage }],
      metadata: {
        fieldTypes: {},
        hiddenFields: 0,
        invalidFields: 0,
        totalFields: 0,
        validFields: 0,
      },
    })
  } finally {
    loading.value = false
  }
}

const loadHistoryQuery = (item: QueryHistoryItem) => {
  currentQuery.value = item.query
  queryMode.value = item.mode
}

const handleExampleSelect = (example: { query: string; fields?: string[] } | ExampleQuery) => {
  if ('mode' in example) {
    currentQuery.value = example.query
    queryMode.value = example.mode
    showHelp.value = false
  } else {
    currentQuery.value = example.query
    if (example.fields) {
      selectedFields.value = [...example.fields]
    }
  }
}

const downloadResponse = () => {
  if (!response.value) return

  const dataStr = response.value
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `graphql-response-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)

  showNotification('Response downloaded successfully', 'success')
}

// Initialize component
const initialize = async () => {
  try {
    console.log('Initializing API explorer...')
    console.log('Categories:', categories.value)
    console.log('FreestyleInfo:', freestyleInfo.value)

    if (!currentQuery.value) {
      console.log('Setting default query...')
      if (categories.value && categories.value.length > 0) {
        const firstCategory = categories.value[0]
        currentQuery.value = firstCategory.exampleQuery
        queryMode.value = firstCategory.name
        selectedFields.value = [...firstCategory.defaultFields]
      } else {
        console.log('No categories available!')
        // Set a default query when no categories
        currentQuery.value = '{\n  about {\n    name\n    email\n  }\n}'
      }
    }

    const urlParams = new URLSearchParams(window.location.search)
    const urlQuery = urlParams.get('query')
    if (urlQuery) {
      console.log('Loading query from URL...')
      currentQuery.value = urlQuery
    }

    console.log('API Explorer initialized successfully')
    showNotification('API Explorer initialized successfully', 'success')
    isInitialized.value = true
  } catch (error: any) {
    console.error('Failed to initialize API view:', error)
    initializationError.value = 'Failed to initialize the API explorer. Please try again.'
  }
}

// Watch for query mode changes
watch(queryMode, (newMode, oldMode) => {
  if (newMode === oldMode) return

  const category = categories.value?.find((c) => c.name === newMode)
  if (category) {
    currentQuery.value = category.exampleQuery
    selectedFields.value = [...category.defaultFields]
  } else if (newMode === 'freestyle') {
    // Set default fields for freestyle mode
    const defaultFreestyleFields = freestyleInfo.value?.defaultFields || []
    selectedFields.value = [...defaultFreestyleFields]

    // Generate the initial query with default fields and include 'query' keyword
    if (defaultFreestyleFields.length > 0) {
      currentQuery.value = `query {\n  ${defaultFreestyleFields.join('\n  ')}\n}`
    } else {
      currentQuery.value = 'query {\n  # Select fields from the documentation panel\n}'
    }
  }
})

// Initialize on mount
onMounted(async () => {
  console.log('Component mounted')
  console.log('Categories on mount:', categories.value)
  console.log('FreestyleInfo on mount:', freestyleInfo.value)
  await initialize()
})

// Provide theme to children
provide('apiTheme', theme)
</script>

<style scoped>
/* Force consistent mobile layout */
@media (max-width: 767px) {
  .block.md\:hidden {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
    padding-top: 1rem !important;
    padding-bottom: 1rem !important;
    width: 100vw !important;
    max-width: 100vw !important;
    box-sizing: border-box !important;
    position: relative !important;
  }

  /* Prevent any child from overriding container */
  .block.md\:hidden > * {
    max-width: calc(100vw - 2rem) !important;
    box-sizing: border-box !important;
  }

  /* Ensure notifications don't affect layout */
  .fixed.bottom-4.right-4 {
    right: 1rem !important;
  }
}

/* Custom scrollbar */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
