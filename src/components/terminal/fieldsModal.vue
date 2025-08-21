<template>
  <Transition name="modal">
    <div v-if="isVisible" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <!-- Header -->
        <div class="header">
          <div class="header-info">
            <h2>Available Fields</h2>
            <span class="subtitle">Select fields to include</span>
          </div>
          <span class="selected-badge" :class="{ active: selectedFields.length > 0 }">
            {{ selectedFields.length }}
          </span>
          <button class="close-btn" @click="closeModal">&times;</button>
        </div>

        <!-- Search -->
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search fields..."
            class="search-input"
          />
        </div>

        <!-- Selected Preview -->
        <div v-if="selectedFields.length > 0" class="selected-preview">
          <span
            v-for="field in selectedFields"
            :key="field"
            class="chip"
            @click="toggleField(field)"
          >
            {{ field }} &times;
          </span>
          <button class="clear-btn" @click="selectedFields = []">Clear all</button>
        </div>

        <!-- Fields -->
        <div class="fields-container">
          <div v-if="!hasFields" class="empty-state">No fields available</div>

          <div
            v-for="[category, fields] in Object.entries(filteredFields)"
            v-else
            :key="category"
            class="category"
          >
            <div class="category-header" @click="toggleCategory(category)">
              <span class="category-title">{{ formatCategory(category) }}</span>
              <div class="category-actions">
                <button
                  class="select-all"
                  @click.stop="toggleAllInCategory(category)"
                  :class="{ active: isAllSelected(category) }"
                  title="Select all in category"
                >
                  ✓
                </button>
                <span class="expand-icon" :class="{ expanded: expandedCategories.has(category) }">
                  ▼
                </span>
              </div>
            </div>

            <div v-if="expandedCategories.has(category)" class="fields-grid">
              <div
                v-for="field in fields"
                :key="field"
                class="field-card"
                :class="{ selected: selectedFields.includes(field) }"
                @click="toggleField(field)"
              >
                <span class="field-name">{{ field }}</span>
                <span v-if="selectedFields.includes(field)" class="selected-indicator">✓</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <label class="comma-toggle">
            <input v-model="useCommaFormat" type="checkbox" />
            <span>Comma separated</span>
          </label>
          <div class="actions">
            <button class="btn btn-cancel" @click="closeModal">Cancel</button>
            <button
              class="btn btn-primary"
              :disabled="selectedFields.length === 0"
              @click="applyFields"
            >
              Apply {{ selectedFields.length ? `(${selectedFields.length})` : '' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { terminal } from '@/terminal/executor'

const props = defineProps<{
  isVisible: boolean
}>()

const emit = defineEmits<{
  close: []
  'apply-fields': [command: string]
}>()

// State
const searchQuery = ref('')
const selectedFields = ref<string[]>([])
const expandedCategories = ref(new Set<string>())
const useCommaFormat = ref(false)
const fieldsByCategory = ref<Record<string, string[]>>({})

// Load fields when component mounts or becomes visible
const loadFields = () => {
  try {
    fieldsByCategory.value = terminal.getFieldsByCategory()
    // Auto-expand first 3 categories
    const categories = Object.keys(fieldsByCategory.value)
    expandedCategories.value.clear()
    categories.slice(0, 3).forEach((cat) => expandedCategories.value.add(cat))
  } catch (error) {
    console.error('Error loading fields:', error)
    fieldsByCategory.value = {}
  }
}

// Computed
const filteredFields = computed(() => {
  if (!searchQuery.value) return fieldsByCategory.value

  const query = searchQuery.value.toLowerCase()
  const filtered: Record<string, string[]> = {}

  Object.entries(fieldsByCategory.value).forEach(([category, fields]) => {
    const matching = fields.filter((field) => field.toLowerCase().includes(query))
    if (matching.length > 0) {
      filtered[category] = matching
    }
  })

  return filtered
})

const hasFields = computed(() => Object.keys(filteredFields.value).length > 0)

// Methods
const toggleField = (field: string) => {
  const index = selectedFields.value.indexOf(field)
  if (index === -1) {
    selectedFields.value.push(field)
  } else {
    selectedFields.value.splice(index, 1)
  }
}

const toggleCategory = (category: string) => {
  if (expandedCategories.value.has(category)) {
    expandedCategories.value.delete(category)
  } else {
    expandedCategories.value.add(category)
  }
}

const toggleAllInCategory = (category: string) => {
  const fields = filteredFields.value[category] || []
  const allSelected = fields.every((f) => selectedFields.value.includes(f))

  if (allSelected) {
    selectedFields.value = selectedFields.value.filter((f) => !fields.includes(f))
  } else {
    fields.forEach((f) => {
      if (!selectedFields.value.includes(f)) {
        selectedFields.value.push(f)
      }
    })
  }
}

const isAllSelected = (category: string) => {
  const fields = filteredFields.value[category] || []
  return fields.length > 0 && fields.every((f) => selectedFields.value.includes(f))
}

const formatCategory = (name: string) => {
  return name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')
}

const applyFields = () => {
  if (selectedFields.value.length === 0) return
  const separator = useCommaFormat.value ? ', ' : ' '
  emit('apply-fields', selectedFields.value.join(separator))
  closeModal()
}

const closeModal = () => {
  // Clear selections when closing
  selectedFields.value = []
  searchQuery.value = ''
  emit('close')
}

// Watch for visibility changes
watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      loadFields()
      // Reset state when opening
      selectedFields.value = []
      searchQuery.value = ''
      useCommaFormat.value = false
    }
  },
)

// Load fields on mount
onMounted(() => {
  loadFields()
})
</script>

<style scoped>
/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal,
.modal-leave-to .modal {
  transform: scale(0.9) translateY(20px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  z-index: 9999;
}

.modal {
  background: var(--terminal-bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  width: 100%;
  max-width: 650px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 80px rgba(var(--glow-rgb), 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(var(--glow-rgb), 0.1) 0%,
    rgba(var(--glow-rgb), 0.05) 100%
  );
  border-bottom: 1px solid rgba(var(--glow-rgb), 0.2);
}

.header-info {
  flex: 1;
}

.header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--accent);
  font-weight: 700;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--text-dim);
  opacity: 0.8;
}

.selected-badge {
  padding: 0.375rem 0.75rem;
  background: rgba(var(--glow-rgb), 0.1);
  border: 1px solid rgba(var(--glow-rgb), 0.2);
  border-radius: 12px;
  font-size: 0.875rem;
  color: var(--text-dim);
  font-weight: 600;
  transition: all 0.3s ease;
  min-width: 40px;
  text-align: center;
}

.selected-badge.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--terminal-bg);
  transform: scale(1.05);
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-dim);
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(255, 71, 87, 0.2);
  color: #ff4757;
  transform: rotate(90deg);
}

/* Search */
.search-box {
  padding: 1rem 1.25rem;
  background: rgba(var(--glow-rgb), 0.02);
  border-bottom: 1px solid rgba(var(--glow-rgb), 0.1);
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  background: var(--terminal-bg);
  border: 2px solid var(--border);
  border-radius: 12px;
  color: var(--accent);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 4px rgba(var(--glow-rgb), 0.2);
}

.search-input::placeholder {
  color: var(--text-dim);
  opacity: 0.6;
}

/* Selected Preview */
.selected-preview {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 1rem 1.25rem;
  background: linear-gradient(
    135deg,
    rgba(var(--glow-rgb), 0.08) 0%,
    rgba(var(--glow-rgb), 0.03) 100%
  );
  border-bottom: 1px solid rgba(var(--glow-rgb), 0.15);
  flex-wrap: wrap;
}

.chip {
  padding: 0.375rem 0.75rem;
  background: rgba(var(--glow-rgb), 0.2);
  border: 1px solid rgba(var(--glow-rgb), 0.3);
  border-radius: 20px;
  color: var(--accent);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.chip:hover {
  background: rgba(255, 71, 87, 0.2);
  border-color: #ff4757;
  color: #ff4757;
  transform: translateY(-2px);
}

.clear-btn {
  margin-left: auto;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 71, 87, 0.1);
  border: 1px solid rgba(255, 71, 87, 0.3);
  border-radius: 8px;
  color: #ff4757;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-btn:hover {
  background: rgba(255, 71, 87, 0.2);
  transform: translateY(-2px);
}

/* Fields Container */
.fields-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--text-dim);
  font-size: 1rem;
  opacity: 0.6;
}

/* Category */
.category {
  margin-bottom: 1rem;
  background: rgba(var(--glow-rgb), 0.03);
  border: 1px solid rgba(var(--glow-rgb), 0.1);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.category:hover {
  border-color: rgba(var(--glow-rgb), 0.2);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(var(--glow-rgb), 0.05) 0%, transparent 100%);
}

.category-header:hover {
  background: linear-gradient(
    135deg,
    rgba(var(--glow-rgb), 0.08) 0%,
    rgba(var(--glow-rgb), 0.02) 100%
  );
}

.category-title {
  font-size: 0.95rem;
  color: var(--accent);
  font-weight: 600;
  letter-spacing: 0.025em;
}

.category-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.select-all {
  width: 28px;
  height: 28px;
  border: 2px solid var(--border);
  background: transparent;
  border-radius: 50%;
  color: var(--text-dim);
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.select-all:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: scale(1.1);
}

.select-all.active {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--terminal-bg);
}

.expand-icon {
  color: var(--text-dim);
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Fields Grid */
.fields-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  padding: 1rem 1.25rem 1.25rem;
}

.field-card {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--terminal-bg);
  border: 2px solid var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.field-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(var(--glow-rgb), 0.05) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.field-card:hover {
  border-color: rgba(var(--glow-rgb), 0.4);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.field-card:hover::before {
  opacity: 1;
}

.field-card.selected {
  background: rgba(var(--glow-rgb), 0.1);
  border-color: var(--accent);
  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 0 20px rgba(var(--glow-rgb), 0.3);
}

.field-card.selected::before {
  opacity: 1;
}

.field-name {
  font-size: 0.85rem;
  color: var(--accent);
  font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
  font-weight: 500;
  z-index: 1;
}

.selected-indicator {
  color: var(--accent);
  font-weight: bold;
  font-size: 0.9rem;
  z-index: 1;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-top: 1px solid rgba(var(--glow-rgb), 0.2);
  background: linear-gradient(
    135deg,
    rgba(var(--glow-rgb), 0.05) 0%,
    rgba(var(--glow-rgb), 0.02) 100%
  );
}

.comma-toggle {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.875rem;
  color: var(--text-dim);
  cursor: pointer;
  transition: color 0.3s ease;
}

.comma-toggle:hover {
  color: var(--accent);
}

.comma-toggle input[type='checkbox'] {
  width: 16px;
  height: 16px;
  accent-color: var(--accent);
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn-cancel {
  background: transparent;
  border-color: var(--border);
  color: var(--text-dim);
}

.btn-cancel:hover {
  border-color: var(--accent);
  color: var(--accent);
  transform: translateY(-2px);
}

.btn-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--terminal-bg);
}

.btn-primary:hover:not(:disabled) {
  background: rgba(var(--glow-rgb), 0.9);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(var(--glow-rgb), 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Scrollbar */
.fields-container::-webkit-scrollbar {
  width: 6px;
}

.fields-container::-webkit-scrollbar-track {
  background: rgba(var(--glow-rgb), 0.1);
  border-radius: 3px;
}

.fields-container::-webkit-scrollbar-thumb {
  background: rgba(var(--glow-rgb), 0.3);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.fields-container::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--glow-rgb), 0.5);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .modal {
    max-width: calc(100% - 2rem);
    max-height: 85vh;
    margin: 1rem;
  }

  .header {
    padding: 1rem;
  }

  .header h2 {
    font-size: 1.1rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .search-box {
    padding: 0.75rem 1rem;
  }

  .selected-preview {
    padding: 0.75rem 1rem;
  }

  .fields-container {
    padding: 0.75rem;
  }

  .category-header {
    padding: 0.875rem 1rem;
  }

  .fields-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 0.75rem 1rem 1rem;
  }

  .field-card {
    padding: 0.625rem 0.875rem;
  }

  .field-name {
    font-size: 0.8rem;
  }

  .footer {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }

  .comma-toggle,
  .actions {
    width: 100%;
  }

  .actions {
    justify-content: stretch;
  }

  .btn {
    flex: 1;
    padding: 0.875rem 1rem;
  }
}

@media (max-width: 480px) {
  .modal {
    max-width: calc(100% - 1rem);
    margin: 0.5rem;
  }

  .header h2 {
    font-size: 1rem;
  }

  .subtitle {
    display: none;
  }

  .selected-badge {
    min-width: 32px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .close-btn {
    width: 32px;
    height: 32px;
    font-size: 1.25rem;
  }

  .chip {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }

  .clear-btn {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
}

/* Focus States */
.field-card:focus,
.btn:focus,
.search-input:focus,
.close-btn:focus,
.select-all:focus {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .modal {
    border-width: 2px;
  }

  .field-card {
    border-width: 2px;
  }

  .field-card.selected {
    border-width: 3px;
  }

  .btn {
    border-width: 2px;
  }
}

/* Dark theme adjustments */
@media (prefers-color-scheme: dark) {
  .modal-overlay {
    background: rgba(0, 0, 0, 0.85);
  }

  .search-input::placeholder {
    opacity: 0.5;
  }
}
</style>
