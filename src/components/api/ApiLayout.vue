<template>
  <div class="w-full">
    <!-- Extra Large Screens: 3 Equal Columns -->
    <div class="hidden xl:block">
      <div class="space-y-6">
        <!-- Main 3-column layout -->
        <div class="grid grid-cols-3 gap-6 min-h-[600px]">
          <!-- Left: Query Mode -->
          <div class="flex flex-col">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl flex-1"
            >
              <QueryMode
                :model-value="queryMode"
                @update:model-value="$emit('update:queryMode', $event)"
                @insert="$emit('insert-query', $event)"
                @select-example="$emit('example-select', $event)"
                :theme="theme"
                :categories="categories"
                :freestyle-info="freestyleInfo"
              />
            </div>
          </div>

          <!-- Center: Editor + Analytics -->
          <div class="flex flex-col space-y-6">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl flex-1"
            >
              <div class="h-full min-h-[450px] flex flex-col">
                <Editor
                  :model-value="currentQuery"
                  @update:model-value="$emit('update-query', $event)"
                  :mode="queryMode"
                  :theme="theme"
                  @execute="$emit('execute-query')"
                  class="w-full h-full flex-1"
                />
              </div>
            </div>
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
            >
              <Analytics :stats="stats" :theme="theme" :achievements="achievements" />
            </div>
          </div>

          <!-- Right: Documentation -->
          <div class="flex flex-col">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl flex-1"
            >
              <Docs
                :mode="queryMode"
                :theme="theme"
                @insert-query="$emit('insert-query', $event)"
                @field-selection-change="$emit('field-selection-change', $event)"
                :categories="categories"
                :freestyle-info="freestyleInfo"
                :selected-fields="selectedFields"
                :hidden-fields="hiddenFields"
                class="h-full overflow-y-auto"
              />
            </div>
          </div>
        </div>

        <!-- Response & History Row -->
        <div class="grid grid-cols-5 gap-6 min-h-[400px]">
          <!-- Response - Takes 3 columns -->
          <div class="col-span-3">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl h-full"
            >
              <div class="min-h-[400px] max-h-[500px] overflow-y-auto h-full">
                <ApiResponse
                  :response="response"
                  :loading="loading"
                  :error="error"
                  :theme="theme"
                  @download="$emit('download-response')"
                />
              </div>
            </div>
          </div>

          <!-- History - Takes 2 columns -->
          <div class="col-span-2">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl h-full"
            >
              <div class="min-h-[400px] max-h-[500px] overflow-y-auto h-full">
                <History
                  :history="queryHistory"
                  :theme="theme"
                  @select="$emit('load-history', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Large Screens: 2 on top, Editor below -->
    <div class="hidden lg:block xl:hidden">
      <div class="space-y-6">
        <!-- Top Row: Query Mode + Documentation -->
        <div class="grid grid-cols-2 gap-6 min-h-[300px]">
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <QueryMode
              :model-value="queryMode"
              @update:model-value="$emit('update:queryMode', $event)"
              @insert="$emit('insert-query', $event)"
              @select-example="$emit('example-select', $event)"
              :theme="theme"
              :categories="categories"
              :freestyle-info="freestyleInfo"
            />
          </div>
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <div class="h-full overflow-y-auto">
              <Docs
                :mode="queryMode"
                :theme="theme"
                @insert-query="$emit('insert-query', $event)"
                @field-selection-change="$emit('field-selection-change', $event)"
                :categories="categories"
                :freestyle-info="freestyleInfo"
                :selected-fields="selectedFields"
                :hidden-fields="hiddenFields"
              />
            </div>
          </div>
        </div>

        <!-- Bottom: Editor + Analytics -->
        <div class="grid grid-cols-2 gap-6 min-h-[400px]">
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <div class="h-full min-h-[400px] flex flex-col">
              <Editor
                :model-value="currentQuery"
                @update:model-value="$emit('update-query', $event)"
                :mode="queryMode"
                :theme="theme"
                @execute="$emit('execute-query')"
                class="w-full h-full flex-1"
              />
            </div>
          </div>
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <Analytics :stats="stats" :theme="theme" :achievements="achievements" />
          </div>
        </div>

        <!-- Response & History Row -->
        <div class="grid grid-cols-5 gap-6 min-h-[400px]">
          <div class="col-span-3">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl h-full"
            >
              <div class="min-h-[400px] max-h-[500px] overflow-y-auto h-full">
                <ApiResponse
                  :response="response"
                  :loading="loading"
                  :error="error"
                  :theme="theme"
                  @download="$emit('download-response')"
                />
              </div>
            </div>
          </div>
          <div class="col-span-2">
            <div
              class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl h-full"
            >
              <div class="min-h-[400px] max-h-[500px] overflow-y-auto h-full">
                <History
                  :history="queryHistory"
                  :theme="theme"
                  @select="$emit('load-history', $event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Medium Screens (Tablets/iPads): Improved layout -->
    <div class="hidden md:block lg:hidden">
      <div class="space-y-6">
        <!-- Row 1: Query Mode + Documentation -->
        <div class="grid grid-cols-2 gap-6 items-stretch min-h-[300px]">
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <QueryMode
              :model-value="queryMode"
              @update:model-value="$emit('update:queryMode', $event)"
              @insert="$emit('insert-query', $event)"
              @select-example="$emit('example-select', $event)"
              :theme="theme"
              :categories="categories"
              :freestyle-info="freestyleInfo"
            />
          </div>
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <div class="h-full overflow-y-auto">
              <Docs
                :mode="queryMode"
                :theme="theme"
                @insert-query="$emit('insert-query', $event)"
                @field-selection-change="$emit('field-selection-change', $event)"
                :categories="categories"
                :freestyle-info="freestyleInfo"
                :selected-fields="selectedFields"
                :hidden-fields="hiddenFields"
                class="h-full"
              />
            </div>
          </div>
        </div>

        <!-- Row 2: Editor -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div class="h-full min-h-[400px] flex flex-col">
            <Editor
              :model-value="currentQuery"
              @update:model-value="$emit('update-query', $event)"
              :mode="queryMode"
              :theme="theme"
              @execute="$emit('execute-query')"
              class="w-full h-full flex-1"
            />
          </div>
        </div>

        <!-- Row 3: Response -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div class="min-h-[320px] max-h-96 overflow-y-auto">
            <ApiResponse
              :response="response"
              :loading="loading"
              :error="error"
              :theme="theme"
              @download="$emit('download-response')"
            />
          </div>
        </div>

        <!-- Row 4: History + Analytics -->
        <div class="grid grid-cols-2 gap-6 min-h-[280px]">
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <div class="min-h-64 max-h-80 overflow-y-auto h-full">
              <History
                :history="queryHistory"
                :theme="theme"
                @select="$emit('load-history', $event)"
              />
            </div>
          </div>
          <div
            class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
          >
            <Analytics :stats="stats" :theme="theme" :achievements="achievements" />
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile/Small Screens: Single Column -->
    <div class="block md:hidden">
      <div class="space-y-6 w-full">
        <!-- Query Mode -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <QueryMode
            :model-value="queryMode"
            @update:model-value="$emit('update:queryMode', $event)"
            @insert="$emit('insert-query', $event)"
            @select-example="$emit('example-select', $event)"
            :theme="theme"
            :categories="categories"
            :freestyle-info="freestyleInfo"
          />
        </div>

        <!-- Documentation -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div class="max-h-80 overflow-y-auto">
            <Docs
              :mode="queryMode"
              :theme="theme"
              @insert-query="$emit('insert-query', $event)"
              @field-selection-change="$emit('field-selection-change', $event)"
              :categories="categories"
              :freestyle-info="freestyleInfo"
              :selected-fields="selectedFields"
              :hidden-fields="hiddenFields"
            />
          </div>
        </div>

        <!-- Editor -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div class="h-full min-h-[350px] flex flex-col">
            <Editor
              :model-value="currentQuery"
              @update:model-value="$emit('update-query', $event)"
              :mode="queryMode"
              :theme="theme"
              @execute="$emit('execute-query')"
              class="w-full h-full flex-1"
            />
          </div>
        </div>

        <!-- Response -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div class="max-h-80 overflow-y-auto">
            <ApiResponse
              :response="response"
              :loading="loading"
              :error="error"
              :theme="theme"
              @download="$emit('download-response')"
            />
          </div>
        </div>

        <!-- History -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <div class="max-h-64 overflow-y-auto">
            <History
              :history="queryHistory"
              :theme="theme"
              @select="$emit('load-history', $event)"
            />
          </div>
        </div>

        <!-- Analytics -->
        <div
          class="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden shadow-xl"
        >
          <Analytics :stats="stats" :theme="theme" :achievements="achievements" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QueryMode from '@/components/api/QueryMode.vue'
import Editor from '@/components/api/Editor.vue'
import Analytics from '@/components/api/Analytics.vue'
import Docs from '@/components/api/Docs.vue'
import ApiResponse from '@/components/api/ApiResponse.vue'
import History from '@/components/api/History.vue'

interface Props {
  queryMode: string
  currentQuery: string
  theme: any
  categories: any[]
  freestyleInfo: any
  stats: any
  achievements: any
  selectedFields: string[]
  hiddenFields: any[]
  response: string
  loading: boolean
  error: string
  queryHistory: any[]
}

defineProps<Props>()
defineEmits([
  'update:queryMode',
  'insert-query',
  'example-select',
  'update-query',
  'execute-query',
  'field-selection-change',
  'download-response',
  'load-history',
])
</script>

<style scoped>
/* Ensure consistent mobile padding and prevent overflow */
.block.md\:hidden {
  width: 100%;
  overflow-x: hidden;
}

.block.md\:hidden > div {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
}

/* Prevent components from breaking out of container */
.block.md\:hidden .bg-white\/5 {
  max-width: 100%;
  overflow-x: hidden;
}

/* Glass morphism enhancement */
.backdrop-blur-md {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* Enhanced shadows */
.shadow-xl {
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04),
    inset 0 1px 1px rgba(255, 255, 255, 0.06);
}

/* Mobile-specific styles */
@media (max-width: 767px) {
  .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
  }

  /* Ensure no component exceeds viewport */
  * {
    max-width: 100vw;
    box-sizing: border-box;
  }
}

/* Ensure proper height inheritance */
.flex-1 {
  flex: 1 1 0%;
  min-height: 0;
}

/* Force vertical spacing */
.space-y-6 > * + * {
  margin-top: 1.5rem !important;
}
</style>
