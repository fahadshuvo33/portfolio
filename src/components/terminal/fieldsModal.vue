<template>
  <div v-if="isVisible" class="fields-modal-overlay" @click="closeModal">
    <div class="fields-modal" @click.stop>
      <!-- Modal Header -->
      <div class="modal-header">
        <h2 class="modal-title">
          <span class="icon">🔍</span>
          Available Fields
        </h2>
        <button class="close-btn" @click="closeModal">
          <span>×</span>
        </button>
      </div>

      <!-- Search Bar -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search fields..."
            class="search-input"
          />
        </div>
        <div class="search-stats">{{ filteredFieldsCount }} fields available</div>
      </div>

      <!-- Selected Fields Display -->
      <div v-if="selectedFields.length > 0" class="selected-section">
        <div class="selected-header">
          <span class="selected-title">Selected Fields ({{ selectedFields.length }})</span>
          <button class="clear-selection-btn" @click="clearSelection">Clear All</button>
        </div>
        <div class="selected-fields">
          <span
            v-for="field in selectedFields"
            :key="field"
            class="selected-field-tag"
            @click="toggleFieldSelection(field)"
          >
            {{ field }} <span class="remove-tag">×</span>
          </span>
        </div>
      </div>

      <!-- Fields by Category -->
      <div class="fields-content">
        <div
          v-for="[category, fields] in Object.entries(filteredFields)"
          :key="category"
          class="category-section"
        >
          <div class="category-header" @click="toggleCategory(category)">
            <span class="category-icon">{{ getCategoryIcon(category) }}</span>
            <span class="category-title">{{ category.toUpperCase() }}</span>
            <span class="category-count">({{ fields.length }})</span>
            <span class="expand-icon" :class="{ expanded: expandedCategories.includes(category) }">
              ▼
            </span>
          </div>

          <div v-show="expandedCategories.includes(category)" class="category-fields">
            <div
              v-for="field in fields"
              :key="`${category}-${field}`"
              class="field-item"
              :class="{ selected: selectedFields.includes(field) }"
              @click="toggleFieldSelection(field)"
            >
              <div class="field-content">
                <span class="field-name">{{ field }}</span>
                <span v-if="getFieldType(category, field)" class="field-type">
                  {{ getFieldType(category, field) }}
                </span>
              </div>
              <div class="field-checkbox">
                <span v-if="selectedFields.includes(field)" class="checkmark">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <div class="format-options">
          <label class="format-label">
            <input v-model="useCommaFormat" type="checkbox" class="format-checkbox" />
            Use comma format (field1,field2,field3)
          </label>
        </div>

        <div class="action-buttons">
          <button class="cancel-btn" @click="closeModal">Cancel</button>
          <button class="apply-btn" :disabled="selectedFields.length === 0" @click="applySelection">
            Apply Selected ({{ selectedFields.length }})
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { terminal } from '@/terminal/executor'
import { CATEGORY_ICONS } from '@/terminal/config'

// Props
interface Props {
  isVisible: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  close: []
  applyFields: [command: string]
}>()

// State
const searchQuery = ref('')
const selectedFields = ref<string[]>([])
const expandedCategories = ref<string[]>([])
const useCommaFormat = ref(false)
const fieldsByCategory = ref<Record<string, string[]>>({})

// Computed
const filteredFields = computed(() => {
  const query = searchQuery.value.toLowerCase()
  const filtered: Record<string, string[]> = {}

  for (const [category, fields] of Object.entries(fieldsByCategory.value)) {
    const matchingFields = fields.filter((field) => field.toLowerCase().includes(query))

    if (matchingFields.length > 0) {
      filtered[category] = matchingFields
    }
  }

  return filtered
})

const filteredFieldsCount = computed(() => {
  return Object.values(filteredFields.value).reduce((count, fields) => count + fields.length, 0)
})

// Methods
const loadFields = () => {
  fieldsByCategory.value = terminal.getFieldsByCategory()
  // Expand all categories by default
  expandedCategories.value = Object.keys(fieldsByCategory.value)
}

const getCategoryIcon = (category: string): string => {
  return CATEGORY_ICONS[category] || '📄'
}

const getFieldType = (category: string, field: string): string => {
  // This could be enhanced to show field types if available
  // For now, we'll keep it simple
  return ''
}

const toggleCategory = (category: string) => {
  const index = expandedCategories.value.indexOf(category)
  if (index > -1) {
    expandedCategories.value.splice(index, 1)
  } else {
    expandedCategories.value.push(category)
  }
}

const toggleFieldSelection = (field: string) => {
  const index = selectedFields.value.indexOf(field)
  if (index > -1) {
    selectedFields.value.splice(index, 1)
  } else {
    selectedFields.value.push(field)
  }
}

const clearSelection = () => {
  selectedFields.value = []
}

const applySelection = () => {
  if (selectedFields.value.length === 0) return

  const separator = useCommaFormat.value ? ',' : ' '
  const command = selectedFields.value.join(separator)

  emit('applyFields', command)
  closeModal()
}

const closeModal = () => {
  emit('close')
}

// Watchers
watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      loadFields()
      selectedFields.value = []
      searchQuery.value = ''
    }
  },
)

// Lifecycle
onMounted(() => {
  loadFields()
})
</script>

<style scoped>
.fields-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fields-modal {
  background: var(--terminal-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 0 60px rgba(var(--glow-rgb), 0.4),
    0 0 120px rgba(var(--glow-rgb), 0.2);
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Modal Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--terminal-bg), rgba(var(--glow-rgb), 0.1));
}

.modal-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--accent);
  margin: 0;
}

.icon {
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  color: var(--text-dim);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(var(--glow-rgb), 0.2);
  color: var(--accent);
}

/* Search Section */
.search-section {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: rgba(var(--glow-rgb), 0.05);
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 0.5rem;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-dim);
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  background: var(--terminal-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--accent);
  font-family: inherit;
  font-size: 0.9rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 2px rgba(var(--glow-rgb), 0.3);
}

.search-stats {
  color: var(--text-dim);
  font-size: 0.8rem;
  text-align: center;
}

/* Selected Fields Section */
.selected-section {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: rgba(var(--glow-rgb), 0.05);
}

.selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.selected-title {
  color: var(--accent);
  font-weight: 600;
  font-size: 0.9rem;
}

.clear-selection-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-dim);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s;
}

.clear-selection-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.selected-fields {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.selected-field-tag {
  background: rgba(var(--glow-rgb), 0.2);
  color: var(--accent);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s;
}

.selected-field-tag:hover {
  background: rgba(var(--glow-rgb), 0.3);
}

.remove-tag {
  opacity: 0.7;
  font-weight: bold;
}

/* Fields Content */
.fields-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem 0;
}

.category-section {
  margin-bottom: 1rem;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  background: rgba(var(--glow-rgb), 0.1);
  border-bottom: 1px solid var(--border);
  transition: all 0.2s;
}

.category-header:hover {
  background: rgba(var(--glow-rgb), 0.15);
}

.category-icon {
  font-size: 1.2rem;
}

.category-title {
  flex: 1;
  font-weight: 600;
  color: var(--accent);
}

.category-count {
  color: var(--text-dim);
  font-size: 0.9rem;
}

.expand-icon {
  color: var(--text-dim);
  transition: transform 0.2s;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

.category-fields {
  background: var(--terminal-bg);
}

.field-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(var(--border), 0.3);
  transition: all 0.2s;
}

.field-item:hover {
  background: rgba(var(--glow-rgb), 0.1);
}

.field-item.selected {
  background: rgba(var(--glow-rgb), 0.2);
  border-left: 3px solid var(--accent);
}

.field-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.field-name {
  color: var(--accent);
  font-family: 'Courier New', monospace;
}

.field-type {
  background: rgba(var(--glow-rgb), 0.2);
  color: var(--text-dim);
  padding: 0.125rem 0.375rem;
  border-radius: 3px;
  font-size: 0.7rem;
  text-transform: uppercase;
}

.field-checkbox {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkmark {
  color: var(--accent);
  font-weight: bold;
}

/* Modal Footer */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  background: rgba(var(--glow-rgb), 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.format-options {
  display: flex;
  align-items: center;
}

.format-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-dim);
  font-size: 0.9rem;
  cursor: pointer;
}

.format-checkbox {
  accent-color: var(--accent);
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.cancel-btn,
.apply-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.cancel-btn {
  background: transparent;
  border-color: var(--border);
  color: var(--text-dim);
}

.cancel-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.apply-btn {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--terminal-bg);
}

.apply-btn:hover:not(:disabled) {
  background: rgba(var(--glow-rgb), 0.9);
  box-shadow: 0 0 20px rgba(var(--glow-rgb), 0.5);
}

.apply-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .fields-modal {
    width: 95%;
    max-height: 85vh;
  }

  .modal-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons {
    justify-content: stretch;
  }

  .action-buttons button {
    flex: 1;
  }
}
</style>
