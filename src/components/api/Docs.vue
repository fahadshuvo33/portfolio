<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { usePortfolioApi } from '@/composables/useCategoryInfo'

// Define local types
interface DocumentField {
  name: string
  description: string
  category?: string
  isDefault?: boolean
}

interface Document {
  displayName: string
  description: string
  fields: string[]
  defaultFields: string[]
  fieldDescriptions: Record<string, string>
  allAvailableFields?: DocumentField[]
  hints?: string
}

interface HiddenField {
  field: string
  hint: string
}

interface FieldClickEvent {
  field: string
  query: string
  isRemoving: boolean
}

interface Theme {
  bg: {
    primary: string
    secondary: string
    accent: string
  }
  text: {
    primary: string
    secondary: string
    muted: string
    accent: string
  }
  border: string
}

interface FreestyleInfoType {
  displayName: string
  description: string
  defaultFields: string[]
  allAvailableFields: DocumentField[]
  hints?: string
  exampleQuery?: string
}

interface Props {
  mode: string
  theme: Theme
  documentation?: Document
  hiddenFields?: HiddenField[]
  selectedFields?: string[]
  onFieldSelect?: (event: FieldClickEvent) => void
  freestyleInfo?: FreestyleInfoType
}

const props = withDefaults(defineProps<Props>(), {
  documentation: undefined,
  hiddenFields: () => [] as HiddenField[],
  selectedFields: () => [] as string[],
  freestyleInfo: undefined,
})

const emit = defineEmits(['insert-query', 'field-click', 'field-selection-change'])

// Use the composable
const { categories, freestyleInfo: apiFreestyleInfo } = usePortfolioApi()

// Local state
const localSelectedFields = ref<string[]>([])
const insertClicked = ref(false)

const currentDoc = computed<Document>(() => {
  if (props.mode === 'freestyle') {
    const freestyleData = props.freestyleInfo || apiFreestyleInfo.value
    const fields =
      freestyleData?.allAvailableFields?.map((field: DocumentField) => field.name) || []
    const fieldDescriptions = (freestyleData?.allAvailableFields || []).reduce(
      (acc: Record<string, string>, field: DocumentField) => {
        acc[field.name] = field.description
        return acc
      },
      {},
    )
    return {
      displayName: freestyleData?.displayName || 'Freestyle',
      description: freestyleData?.description || 'FreeStyle query mode',
      fields,
      defaultFields: freestyleData?.defaultFields || [],
      fieldDescriptions,
      allAvailableFields: freestyleData?.allAvailableFields || [],
      hints: freestyleData?.hints,
    }
  } else {
    // Find the category that matches the mode
    const category = categories.value.find((cat: any) => cat.name === props.mode)

    if (category) {
      return {
        displayName: category.displayName,
        description: category.description,
        fields: category.allFields || [],
        defaultFields: category.defaultFields || [],
        fieldDescriptions: category.fieldDescriptions || {},
        hints: category.hints,
      }
    }

    // Fallback
    return {
      displayName: props.mode.charAt(0).toUpperCase() + props.mode.slice(1),
      description: '',
      fields: [],
      defaultFields: [],
      fieldDescriptions: {},
      hints: '',
    }
  }
})

// Methods
const getModeIcon = () => {
  const icons: Record<string, string> = {
    about: '👤',
    education: '🎓',
    experience: '💼',
    projects: '🚀',
    skills: '⚡',
    freestyle: '🎯',
  }
  return icons[props.mode] || '📖'
}

const getExampleQuery = (): string => {
  if (props.mode === 'freestyle') {
    const freestyleData = props.freestyleInfo || apiFreestyleInfo.value
    const defaultFields = freestyleData?.defaultFields || []
    if (defaultFields.length > 0) {
      return `query {\n  ${defaultFields.join('\n  ')}\n}`
    }
    return freestyleData?.exampleQuery || '{\n  # No default fields available\n}'
  } else {
    const category = categories.value.find((cat) => cat.name === props.mode)
    if (category) {
      const fields = category.defaultFields || []
      return `query {\n  ${props.mode} {\n    ${fields.join('\n    ')}\n  }\n}`
    }
    return `query {\n  ${props.mode} {\n    # No fields available\n  }\n}`
  }
}

const isFieldSelected = (fieldName: string) => {
  return localSelectedFields.value.includes(fieldName)
}

const handleFieldClick = (fieldName: string) => {
  const index = localSelectedFields.value.indexOf(fieldName)
  const isRemoving = index > -1

  // Create a new array with the updated selection
  const updatedFields = [...localSelectedFields.value]

  if (isRemoving) {
    updatedFields.splice(index, 1)
  } else {
    updatedFields.push(fieldName)
  }

  // Update the local state
  localSelectedFields.value = updatedFields

  // Generate the appropriate query based on the mode
  let query = ''
  if (props.mode === 'freestyle') {
    // For freestyle mode, just list all selected fields at the root level
    query =
      updatedFields.length > 0
        ? `{\n  ${updatedFields.join('\n  ')}\n}`
        : '{\n  # Select fields from the documentation panel\n}'
  } else {
    // For category modes, use the standard query structure
    const category = categories.value.find((cat) => cat.name === props.mode)
    const defaultFields = category?.defaultFields || []
    const fields = updatedFields.length > 0 ? updatedFields : defaultFields
    query = `query {\n  ${props.mode} {\n    ${fields.join('\n    ')}\n  }\n}`
  }

  emit('field-selection-change', {
    mode: props.mode,
    selectedFields: [...localSelectedFields.value],
    field: fieldName,
    action: isRemoving ? 'remove' : 'add',
    query: query,
  })

  emit('field-click', {
    field: fieldName,
    query: query,
    isRemoving: isRemoving,
  })

  if (props.onFieldSelect) {
    props.onFieldSelect({
      field: fieldName,
      query: query,
      isRemoving: isRemoving,
    })
  }
}

const handleInsertExample = () => {
  let exampleQuery = getExampleQuery()
  const freestyleData = props.freestyleInfo || apiFreestyleInfo.value
  const defaultFields = freestyleData?.defaultFields || []

  if (props.mode === 'freestyle') {
    // If no fields are selected, use default fields
    const fieldsToUse =
      localSelectedFields.value.length > 0 ? localSelectedFields.value : defaultFields

    // Update the selected fields to match what we're inserting
    if (fieldsToUse.length > 0) {
      localSelectedFields.value = [...fieldsToUse]
      exampleQuery = `{\n  ${fieldsToUse.join('\n  ')}\n}`
    } else {
      exampleQuery = '{\n  # Select fields from the documentation panel\n}'
    }
  }

  emit('insert-query', exampleQuery)

  // Update the parent component with the current field selection
  if (props.mode === 'freestyle') {
    emit('field-selection-change', {
      mode: 'freestyle',
      selectedFields: [...localSelectedFields.value],
      field: '',
      action: localSelectedFields.value.length > 0 ? 'set' : 'clear',
      query: exampleQuery,
    })
  }

  // Trigger insert animation
  insertClicked.value = true
  setTimeout(() => {
    insertClicked.value = false
  }, 200)
}

// Initialize selected fields when mode changes
watch(
  () => props.mode,
  (newMode) => {
    localSelectedFields.value = []
  },
  { immediate: true },
)

// Watch for changes to selectedFields prop
watch(
  () => props.selectedFields,
  (newVal) => {
    if (newVal) {
      localSelectedFields.value = [...newVal]
    }
  },
  { immediate: true },
)
</script>

<template>
  <div :class="[theme.bg.secondary, 'rounded-lg h-full flex flex-col']">
    <!-- Header -->
    <div
      :class="[
        theme.bg.secondary,
        'px-4 py-3 border-b border-white/5 sticky top-0 z-20',
        'backdrop-blur-md bg-opacity-95',
      ]"
    >
      <div class="flex items-center justify-between">
        <h3 :class="[theme.text.primary, 'text-sm font-medium flex items-center gap-2']">
          <span class="text-lg">{{ getModeIcon() }}</span>
          <span>{{ currentDoc.displayName }} Documentation</span>
        </h3>
        <span :class="[theme.text.muted, 'text-xs']"> {{ currentDoc.fields.length }} fields </span>
      </div>
      <p :class="[theme.text.muted, 'text-[10px] mt-1']">
        {{ currentDoc.description }}
      </p>
    </div>

    <!-- Fields Section -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="px-4 pt-4 pb-2">
        <h4 :class="[theme.text.muted, 'text-xs uppercase tracking-wider']">Available Fields</h4>
      </div>

      <!-- Fields List - Limited height with scroll -->
      <div class="px-4">
        <div class="max-h-80 overflow-y-auto pr-1">
          <!-- Freestyle mode -->
          <div v-if="props.mode === 'freestyle'" class="flex flex-col gap-3">
            <div
              v-for="field in currentDoc.allAvailableFields"
              :key="field.name"
              :class="[
                'group relative overflow-hidden rounded-lg transition-all duration-200 cursor-pointer',
                isFieldSelected(field.name)
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 shadow-md'
                  : 'border border-white/5 bg-white/2 hover:border-white/20 hover:bg-white/5',
              ]"
              @click="handleFieldClick(field.name)"
            >
              <div class="p-3 relative">
                <!-- Selected indicator -->
                <div
                  v-if="isFieldSelected(field.name)"
                  class="absolute top-2 right-2 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center"
                >
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>

                <div class="pr-6">
                  <div class="flex items-center gap-2 mb-1">
                    <code
                      :class="[
                        'text-sm font-mono font-medium',
                        isFieldSelected(field.name) ? 'text-blue-300' : theme.text.accent,
                      ]"
                    >
                      {{ field.name }}
                    </code>
                    <span :class="[theme.text.muted, 'text-xs bg-white/5 px-1.5 py-0.5 rounded']">
                      {{ field.category }}
                    </span>
                  </div>
                  <p :class="[theme.text.muted, 'text-[10px] leading-relaxed']">
                    {{ field.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Regular category fields -->
          <div v-else class="flex flex-col gap-3">
            <div
              v-for="fieldName in currentDoc.fields"
              :key="fieldName"
              :class="[
                'group relative overflow-hidden rounded-lg transition-all duration-200 cursor-pointer',
                isFieldSelected(fieldName)
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/50 shadow-md'
                  : 'border border-white/5 bg-white/2 hover:border-white/20 hover:bg-white/5',
              ]"
              @click="handleFieldClick(fieldName)"
            >
              <div class="p-3 relative">
                <!-- Selected indicator -->
                <div
                  v-if="isFieldSelected(fieldName)"
                  class="absolute top-2 right-2 w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center"
                >
                  <div class="w-2 h-2 bg-white rounded-full"></div>
                </div>

                <div class="pr-6">
                  <code
                    :class="[
                      'text-sm font-mono font-medium block mb-1',
                      isFieldSelected(fieldName) ? 'text-blue-300' : theme.text.accent,
                    ]"
                  >
                    {{ fieldName }}
                  </code>
                  <p :class="[theme.text.muted, 'text-[10px] leading-relaxed']">
                    {{ currentDoc.fieldDescriptions[fieldName] || 'No description available' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Example Query - Fixed at bottom -->
      <div class="px-4 pt-4 pb-4 mt-auto border-t border-white/5">
        <div class="flex items-center justify-between mb-3">
          <h4 :class="[theme.text.muted, 'text-xs uppercase tracking-wider']">Example Query</h4>
          <button
            @click="handleInsertExample"
            :class="[
              'p-1.5 rounded-md transition-all duration-200',
              'hover:bg-white/10 group relative',
              insertClicked ? 'scale-95' : 'scale-100',
            ]"
            title="Insert example into query editor"
          >
            <svg
              class="w-3.5 h-3.5 text-gray-400 group-hover:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 17l-4-4m0 0l4-4m-4 4h8"
              />
            </svg>
            <span
              :class="[
                'absolute -top-8 right-0 px-2 py-1 text-xs rounded',
                'bg-gray-900 text-white whitespace-nowrap',
                'opacity-0 group-hover:opacity-100 transition-opacity',
                'pointer-events-none',
              ]"
            >
              Insert to editor
            </span>
          </button>
        </div>
        <div class="relative group">
          <pre
            :class="[
              'px-3 py-2.5 rounded-md text-xs font-mono',
              'bg-black/30 border border-white/10',
              'hover:border-white/20 transition-all',
              theme.text.secondary,
            ]"
          ><code>{{ getExampleQuery() }}</code></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.field-enter-active,
.field-leave-active {
  transition: all 0.3s ease;
}

.field-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.field-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.field-move {
  transition: transform 0.3s ease;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
