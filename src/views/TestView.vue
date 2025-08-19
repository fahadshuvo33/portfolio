<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-4">Test View</h1>
    <div class="space-y-4">
      <p>This is a test view to diagnose routing issues.</p>
      <div class="space-x-4">
        <button
          v-for="route in routes"
          :key="route.path"
          @click="$router.push(route.path)"
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Go to {{ route.name }}
        </button>
      </div>
      <div class="mt-4">
        <p class="text-gray-600">Component Status: {{ status }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const status = ref('Initializing...')
const routes = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Terminal', path: '/terminal' },
  { name: 'API', path: '/api' },
]

onMounted(() => {
  console.log('Test view mounted')
  status.value = 'Ready'
})
</script>
