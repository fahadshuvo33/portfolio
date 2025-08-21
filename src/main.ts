import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

// Create the app instance
const app = createApp(App)

// Register global components
app.component('LoadingSpinner', LoadingSpinner)

console.log('Vue app main.ts initialized and attempting to mount.')

// Error handling for development
// Always enable error and warning handlers for better debugging across environments
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

if (import.meta.env.DEV) {
  // Debug route changes
  router.beforeEach((to, from, next) => {
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

      // Handle GitHub Pages redirect
      const redirectPath = sessionStorage.redirect
      if (redirectPath) {
        const path = new URL(redirectPath).pathname
        const base = import.meta.env.BASE_URL || '/portfolio/'
        const cleanedPath = path.startsWith(base) ? path.substring(base.length) : path

        // Ensure path starts with / for router.replace
        const finalPath = cleanedPath.startsWith('/') ? cleanedPath : '/' + cleanedPath

        if (router.currentRoute.value.path !== finalPath) {
          router.replace(finalPath).catch((err) => {
            console.error('Failed to redirect to original path:', err)
          })
        }
        sessionStorage.removeItem('redirect')
      }
    })
    .catch((error) => {
      console.error('Router failed to initialize:', error)
    })
} catch (error) {
  console.error('Failed to mount app:', error)
}
