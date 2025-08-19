import { createRouter, createWebHistory } from 'vue-router'
import { defineAsyncComponent, h } from 'vue'
import type { Component } from 'vue'

// Error component for failed loads
const ErrorComponent = {
  setup() {
    return () =>
      h(
        'div',
        {
          class: 'flex flex-col items-center justify-center min-h-screen p-4',
        },
        [
          h('div', { class: 'text-red-500 text-xl mb-4' }, '⚠️ Failed to load page'),
          h(
            'button',
            {
              class: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600',
              onClick: () => window.location.reload(),
            },
            'Reload Page',
          ),
        ],
      )
  },
}

// Simple component loader with error handling
const loadComponent = (name: string, importFn: () => Promise<{ default: Component }>) => {
  return defineAsyncComponent({
    loader: async () => {
      try {
        console.log(`[Router] Loading ${name}...`)
        const component = await importFn()
        console.log(`[Router] ✓ Loaded ${name}`)
        return component
      } catch (error) {
        console.error(`[Router] Failed to load ${name}:`, error)
        return ErrorComponent
      }
    },
    loadingComponent: {
      render() {
        return h('div', { class: 'flex items-center justify-center min-h-screen' }, [
          h('div', { class: 'text-center' }, [
            h('div', { 
              class: 'spinner mx-auto mb-2.5',
              style: {
                width: '40px',
                height: '40px',
                border: '4px solid rgba(0, 0, 0, 0.1)',
                borderRadius: '50%',
                borderTopColor: '#3498db',
                animation: 'spin 1s ease-in-out infinite'
              }
            }),
            h('p', 'Loading...')
          ])
        ])
      }
    },
    delay: 0,
    timeout: 10000,
    errorComponent: ErrorComponent,
  })
}

// Route meta type for TypeScript
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    requiresAuth?: boolean
    loadingText?: string
  }
}

// Get base URL from environment or use '/portfolio/' for GitHub Pages
const base = import.meta.env.BASE_URL || '/portfolio/'

const router = createRouter({
  history: createWebHistory(base),
  routes: [
    {
      path: '/v2/graphql',
      name: 'GraphQLv2',
      component: () => import('@/views/ApiView.vue'),
      meta: {
        title: 'GraphQL Explorer v2',
        requiresAuth: false,
      },
    },
    {
      path: '/',
      name: 'home',
      component: loadComponent('HomeView', () => import('../views/HomeView.vue')),
      meta: {
        title: 'Home',
        loadingText: 'Loading home page...',
      },
    },
    {
      path: '/terminal',
      name: 'terminal',
      component: loadComponent('TerminalView', () => import('../views/TerminalView.vue')),
      meta: {
        title: 'Terminal',
        loadingText: 'Initializing terminal...',
      },
    },
    {
      path: '/api',
      name: 'api',
      component: loadComponent('ApiView', () => import('../views/ApiView.vue')),
      meta: {
        title: 'API Explorer',
        loadingText: 'Loading API explorer...',
      },
    },
    {
      path: '/test',
      name: 'test',
      component: loadComponent('TestView', () => import('../views/TestView.vue')),
      meta: {
        title: 'Test Page',
        loadingText: 'Loading test environment...',
      },
    },
    // Catch-all 404 route
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue'),
      meta: {
        title: '404 - Page Not Found',
      },
    },
  ],

  // Scroll behavior
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0 }
    }
  },
})

// Navigation guards
router.beforeEach((to, from, next) => {
  console.log(`[Router] Navigating: ${from.path} → ${to.path}`)

  // Update document title
  if (to.meta.title) {
    document.title = `${to.meta.title} | Your App Name`
  }

  next()
})

router.afterEach((to, from) => {
  console.log(`[Router] Navigation complete: ${to.path}`)
})

// Error handling
router.onError((error) => {
  console.error('[Router] Navigation error:', error)
})

export default router
