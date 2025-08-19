<!-- src/components/api/QueryMode.vue -->
<template>
  <div :class="[theme.bg.secondary, 'rounded-lg border h-full', theme.border]">
    <!-- Header -->
    <div class="p-4 border-b" :class="theme.border">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
        >
          <span class="text-white text-sm">🔍</span>
        </div>
        <div>
          <h3 :class="[theme.text.primary, 'font-semibold']">Query Explorer</h3>
          <p :class="[theme.text.muted, 'text-sm']">Choose your data scope</p>
        </div>
      </div>
    </div>

    <!-- Mode List -->
    <div class="p-4 flex-1">
      <div class="grid gap-3">
        <!-- Standard Modes -->
        <template v-for="mode in categoryModes" :key="mode.value">
          <div
            @click="selectMode(mode.value)"
            :class="[
              'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200',
              'hover:scale-[1.02] hover:shadow-md',
              modelValue === mode.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600',
            ]"
          >
            <!-- Icon -->
            <div
              :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center text-lg',
                modelValue === mode.value
                  ? 'bg-blue-100 dark:bg-blue-500/20'
                  : 'bg-gray-100 dark:bg-gray-700',
              ]"
            >
              {{ mode.icon }}
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <h4
                :class="[
                  'font-medium text-sm',
                  modelValue === mode.value
                    ? 'text-blue-700 dark:text-blue-300'
                    : theme.text.primary,
                ]"
              >
                {{ mode.label }}
              </h4>
              <p :class="[theme.text.muted, 'text-xs mt-1']">
                {{ mode.description }}
              </p>
            </div>

            <!-- Active Indicator -->
            <div
              v-if="modelValue === mode.value"
              class="w-3 h-3 bg-blue-500 rounded-full animate-pulse"
            ></div>
          </div>
        </template>

        <!-- Separator -->
        <div class="flex items-center my-2">
          <div
            class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          ></div>
          <span :class="[theme.text.muted, 'px-3 text-xs font-medium']">ADVANCED</span>
          <div
            class="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          ></div>
        </div>

        <!-- Freestyle Mode -->
        <div
          @click="selectMode('freestyle')"
          :class="[
            'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200',
            'hover:scale-[1.02] hover:shadow-md',
            'bg-gradient-to-r from-purple-500/5 to-pink-500/5',
            modelValue === 'freestyle'
              ? 'border-purple-500 bg-purple-50 dark:bg-purple-500/10 shadow-lg shadow-purple-500/20'
              : 'border-purple-200 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600',
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'w-10 h-10 rounded-lg flex items-center justify-center text-lg relative overflow-hidden',
              modelValue === 'custom'
                ? 'bg-purple-100 dark:bg-purple-500/20'
                : 'bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-500/20 dark:to-pink-500/20',
            ]"
          >
            <span class="relative z-10">🎯</span>
            <div
              v-if="modelValue === 'custom'"
              class="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-10 animate-pulse"
            ></div>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h4
                :class="[
                  'font-medium text-sm',
                  modelValue === 'custom'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent'
                    : theme.text.primary,
                ]"
              >
                Freestyle Mode
              </h4>
              <span
                class="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
              >
                PRO
              </span>
            </div>
            <p :class="[theme.text.muted, 'text-xs']">
              Unlimited access to all fields and hidden features
            </p>
          </div>

          <!-- Active Indicator -->
          <div
            v-if="modelValue === 'custom'"
            class="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string
  theme: any
  categories: any[]
  freestyleInfo: any
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'insert', 'selectExample'])

const categoryModes = [
  {
    value: 'about',
    label: 'About Me',
    icon: '👤',
    description: 'Personal information and contact details',
  },
  {
    value: 'projects',
    label: 'Projects',
    icon: '🚀',
    description: 'Portfolio projects and repositories',
  },
  {
    value: 'skills',
    label: 'Skills',
    icon: '⚡',
    description: 'Technical skills and expertise',
  },
  {
    value: 'experience',
    label: 'Experience',
    icon: '💼',
    description: 'Professional work experience',
  },
  {
    value: 'education',
    label: 'Education',
    icon: '🎓',
    description: 'Academic background and certifications',
  },
]

const selectMode = (mode: string) => {
  emit('update:modelValue', mode)

  let exampleQuery = ''
  if (mode === 'custom') {
    exampleQuery = props.freestyleInfo?.exampleQuery || ''
  } else {
    const category = props.categories?.find((c) => c.name === mode)
    if (category) {
      const fields = category.defaultFields || []
      exampleQuery = `query {\n  ${category.name} {\n    ${fields.join('\n    ')}\n  }\n}`
    }
  }

  if (exampleQuery) {
    emit('selectExample', {
      query: exampleQuery,
      fields:
        mode === 'custom'
          ? []
          : [...(props.categories?.find((c) => c.name === mode)?.defaultFields || [])],
    })
  }
}
</script>

<style scoped>
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
