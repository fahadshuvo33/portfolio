<!-- src/components/api/History.vue -->
<template>
  <div class="h-full flex flex-col">
    <!-- Header with increased margin -->
    <div
      :class="[
        theme.bg.tertiary,
        theme.text.primary,
        'px-4 py-3 flex items-center gap-2 rounded-lg sticky top-0 z-10',
      ]"
      style="margin-bottom: 1rem"
    >
      <span>🕒</span>
      <h3 :class="[theme.text.secondary, 'text-sm font-medium']">QUERY HISTORY</h3>
    </div>

    <!-- Content -->
    <div class="flex-1">
      <div v-if="history.length > 0" class="flex flex-col gap-3 h-full overflow-y-auto">
        <div
          v-for="item in history"
          :key="item.id"
          @click="openModal(item)"
          :class="[
            theme.bg.tertiary,
            'p-3 rounded-lg cursor-pointer hover:opacity-80 transition-all',
          ]"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3 text-xs">
              <span :class="theme.text.muted">{{ formatTime(item.timestamp) }}</span>
              <span
                :class="[
                  'px-2 py-0.5 rounded',
                  item.success ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400',
                ]"
              >
                {{ item.success ? 'Success' : 'Failed' }}
              </span>
              <span :class="theme.text.muted">{{ item.duration }}ms</span>
            </div>
            <span :class="[theme.text.muted, 'text-xs capitalize']">
              {{ item.mode }}
            </span>
          </div>
          <pre :class="[theme.text.secondary, 'text-xs truncate']">{{
            item.query.replace(/\n/g, ' ')
          }}</pre>
        </div>
      </div>

      <div
        v-else
        :class="[
          theme.text.muted,
          'text-center py-8 text-sm flex-1 flex items-center justify-center',
        ]"
      >
        No queries in history
      </div>
    </div>

    <!-- Modal with PROPER fixed header structure -->
    <Teleport to="body">
      <div
        v-if="selectedItem"
        @click="closeModal"
        class="fixed inset-0 bg-black/10 flex items-center justify-center z-[9999] p-4"
      >
        <div
          @click.stop
          :class="[
            theme.bg.secondary,
            'rounded-lg max-w-2xl w-full h-[70vh] flex flex-col shadow-xl border',
            theme.border,
          ]"
        >
          <!-- FIXED Header - OUTSIDE scrollable area -->
          <div
            :class="[
              theme.bg.tertiary,
              'px-5 py-4 flex items-center justify-between border-b rounded-t-lg flex-shrink-0',
              theme.border,
            ]"
          >
            <div class="flex items-center gap-3">
              <h3 :class="[theme.text.primary, 'text-lg font-semibold']">Query Details</h3>
              <span
                :class="[
                  'px-3 py-1 rounded text-sm',
                  selectedItem.success
                    ? 'bg-green-900/50 text-green-400'
                    : 'bg-red-900/50 text-red-400',
                ]"
              >
                {{ selectedItem.success ? 'Success' : 'Failed' }}
              </span>
            </div>
            <button
              @click="closeModal"
              :class="[theme.text.muted, 'hover:text-red-400 transition-colors']"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- SCROLLABLE Content - SEPARATE from header -->
          <div :class="[theme.bg.primary, 'flex-1 overflow-y-auto']">
            <div class="p-5 space-y-5">
              <!-- Metadata -->
              <div class="grid grid-cols-3 gap-3">
                <div :class="[theme.bg.tertiary, 'p-3 rounded-lg border', theme.border]">
                  <div :class="[theme.text.muted, 'text-xs font-medium mb-1']">Timestamp</div>
                  <div :class="[theme.text.secondary, 'text-sm']">
                    {{ formatFullTime(selectedItem.timestamp) }}
                  </div>
                </div>
                <div :class="[theme.bg.tertiary, 'p-3 rounded-lg border', theme.border]">
                  <div :class="[theme.text.muted, 'text-xs font-medium mb-1']">Mode</div>
                  <div :class="[theme.text.secondary, 'text-sm capitalize']">
                    {{ selectedItem.mode }}
                  </div>
                </div>
                <div :class="[theme.bg.tertiary, 'p-3 rounded-lg border', theme.border]">
                  <div :class="[theme.text.muted, 'text-xs font-medium mb-1']">Duration</div>
                  <div :class="[theme.text.secondary, 'text-sm']">
                    {{ selectedItem.duration }}ms
                  </div>
                </div>
              </div>

              <!-- Query with animated copy button inside -->
              <div>
                <div :class="[theme.text.muted, 'text-sm font-medium mb-3']">Query</div>
                <div :class="[theme.bg.tertiary, 'rounded-lg border relative', theme.border]">
                  <!-- Animated copy button positioned inside the query container -->
                  <button
                    @click="copyToClipboard(selectedItem.query)"
                    :class="[
                      'absolute top-2 right-2 z-10 p-2 rounded-md transition-all duration-200',
                      'bg-black/20 hover:bg-black/40 text-gray-300 hover:text-white',
                      'hover:scale-110 active:scale-95',
                      copySuccess ? 'bg-green-600/80 text-white' : '',
                    ]"
                    title="Copy query"
                  >
                    <!-- Dynamic icon based on copy state -->
                    <svg
                      v-if="!copySuccess"
                      class="w-4 h-4 transition-transform"
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
                    <svg
                      v-else
                      class="w-4 h-4 transition-opacity duration-300 opacity-75"
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
                  </button>

                  <!-- Query text with padding to avoid copy button -->
                  <pre
                    :class="[
                      theme.text.secondary,
                      'text-sm whitespace-pre-wrap font-mono p-4 pr-12',
                    ]"
                    >{{ selectedItem.query }}</pre
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- FIXED Footer - OUTSIDE scrollable area -->
          <div
            :class="[
              theme.bg.tertiary,
              'px-5 py-4 border-t flex justify-between items-center rounded-b-lg flex-shrink-0',
              theme.border,
            ]"
          >
            <button
              @click="closeModal"
              :class="[
                theme.bg.secondary,
                theme.text.secondary,
                'px-4 py-2 rounded-lg hover:opacity-80 transition-colors text-sm font-medium border',
                theme.border,
              ]"
            >
              Cancel
            </button>

            <button
              @click="selectAndClose"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all text-sm font-medium flex items-center gap-2 hover:shadow-lg"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Use Query
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  history: Array<{
    id: string
    query: string
    mode: string
    timestamp: Date
    success: boolean
    duration: number
  }>
  theme: any
}

defineProps<Props>()
const emit = defineEmits(['select'])

const selectedItem = ref(null)
const copySuccess = ref(false)

const openModal = (item: any) => {
  selectedItem.value = item
}

const closeModal = () => {
  selectedItem.value = null
  copySuccess.value = false
}

const selectAndClose = () => {
  if (selectedItem.value) {
    emit('select', selectedItem.value)
    closeModal()
  }
}

const formatTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

const formatFullTime = (date: Date) => {
  return date.toLocaleString()
}

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)

    // Show success animation
    copySuccess.value = true

    // Reset after 2 seconds
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}
</script>
