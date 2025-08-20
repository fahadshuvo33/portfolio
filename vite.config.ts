import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  const env = loadEnv(mode, process.cwd(), '')

  // For GitHub Pages deployment, always use '/portfolio/' in production mode
  const base = mode === 'production' ? '/portfolio/' : '/'

  return {
    base,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ['vue'],
            'vue-router': ['vue-router'],
          },
        },
      },
    },
    server: {
      historyApiFallback: true,
      // Removed problematic headers that cause MIME type issues
    },
    preview: {
      port: 4173,
      historyApiFallback: true,
      base: '/portfolio/', // Explicitly set base for preview
      // Removed problematic headers that cause MIME type issues
    },
    plugins: [vue(), vueDevTools()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    define: {
      __APP_ENV__: env.APP_ENV,
    },
  }
})
