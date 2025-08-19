<!-- src/components/terminal/MatrixRain.vue -->
<template>
  <div class="matrix-rain">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let animationId: number
let ctx: CanvasRenderingContext2D | null

// Watch for theme changes
const checkTheme = () => {
  const root = document.documentElement
  const themeClass = Array.from(root.classList).find((c) => c.startsWith('theme-'))
  return themeClass || 'theme-matrix'
}

onMounted(() => {
  if (!canvas.value) return

  ctx = canvas.value.getContext('2d')
  if (!ctx) return

  // Set canvas size
  const resizeCanvas = () => {
    if (!canvas.value) return
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)

  // Matrix rain effect
  const fontSize = 16
  const columns = Math.floor(canvas.value.width / fontSize)
  const drops: number[] = []

  // Initialize drops
  for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * -100
  }

  // Characters to use
  const chars =
    '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン<>{}[]()=+-*/#&@'

  const draw = () => {
    if (!ctx || !canvas.value) return

    // Semi-transparent black for fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
    ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)

    // Get current theme
    const theme = checkTheme()

    // Theme-specific colors
    const themeColors: Record<string, { primary: string; bright: string }> = {
      'theme-matrix': { primary: '#00ff00', bright: '#00ff00' },
      'theme-dracula': { primary: '#bd93f9', bright: '#ff79c6' },
      'theme-monokai': { primary: '#a6e22e', bright: '#f92672' },
      'theme-cyberpunk': { primary: '#00d9ff', bright: '#ffea00' },
      'theme-minimal': { primary: '#888888', bright: '#ffffff' },
    }

    const colors = themeColors[theme] || themeColors['theme-matrix']

    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      // Random character
      const char = chars[Math.floor(Math.random() * chars.length)]

      // Brighter color for newest characters
      const age = drops[i]
      if (age < 1) {
        ctx.fillStyle = colors.bright
        ctx.shadowBlur = 8
        ctx.shadowColor = colors.bright
      } else if (age < 5) {
        ctx.fillStyle = colors.primary
        ctx.shadowBlur = 4
        ctx.shadowColor = colors.primary
      } else {
        ctx.fillStyle = colors.primary + '88' // 50% opacity
        ctx.shadowBlur = 0
      }

      // Draw character
      ctx.fillText(char, i * fontSize, drops[i] * fontSize)

      // Reset drop when it reaches bottom
      if (drops[i] * fontSize > canvas.value.height && Math.random() > 0.98) {
        drops[i] = 0
      }

      drops[i]++
    }

    animationId = requestAnimationFrame(draw)
  }

  // Start animation
  draw()

  // Watch for theme changes
  const observer = new MutationObserver(() => {
    // Theme changed, canvas will update on next frame
  })

  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  onUnmounted(() => {
    observer.disconnect()
  })
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.matrix-rain {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 0;
  opacity: 0.3; /* More visible */
}

canvas {
  display: block;
  width: 100%;
  height: 100%;
}

/* Theme-specific opacity adjustments */
.theme-matrix .matrix-rain {
  opacity: 0.3;
}

.theme-dracula .matrix-rain {
  opacity: 0.25;
}

.theme-monokai .matrix-rain {
  opacity: 0.25;
}

.theme-cyberpunk .matrix-rain {
  opacity: 0.35;
}

.theme-minimal .matrix-rain {
  opacity: 0.15;
}
</style>
