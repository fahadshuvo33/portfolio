import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

// Create the app instance
const app = createApp(App)

// Register global components
app.component('LoadingSpinner', LoadingSpinner)

// Error handling for development
if (import.meta.env.DEV) {
  app.config.errorHandler = (err, instance, info) => {
    console.error('Global error:', err)
    console.error('Component:', instance)
    console.error('Error info:', info)
  }

  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Warning:', msg)
    console.warn('Component:', instance)
    console.warn('Trace:', trace)
  }

  // Debug route changes
  router.beforeEach((to, from, next) => {
    console.log('Navigating:', from.path, '->', to.path)
    next()
  })
}

// Use router
app.use(router)

// Mount the app with error catching
try {
  router
    .isReady()
    .then(() => {
      app.mount('#app')
      console.log('App mounted successfully')
    })
    .catch((error) => {
      console.error('Router failed to initialize:', error)
    })
} catch (error) {
  console.error('Failed to mount app:', error)
}
