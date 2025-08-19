import { ref, onMounted, onUnmounted } from 'vue'

// Typewriter effect hook
export function useTypewriter(text: string, speed = 50) {
  const displayedText = ref('')
  const isTyping = ref(true)
  let timeoutId: NodeJS.Timeout

  const startTyping = () => {
    let index = 0
    isTyping.value = true
    displayedText.value = ''

    const type = () => {
      if (index < text.length) {
        displayedText.value += text[index]
        index++
        timeoutId = setTimeout(type, speed)
      } else {
        isTyping.value = false
      }
    }

    type()
  }

  onMounted(() => {
    startTyping()
  })

  onUnmounted(() => {
    clearTimeout(timeoutId)
  })

  return {
    displayedText,
    isTyping,
    restart: startTyping,
  }
}

// Floating animation hook
export function useFloatingAnimation(duration = 20) {
  const elements = ref<HTMLElement[]>([])
  let animationFrameId: number

  const animate = () => {
    elements.value.forEach((el, index) => {
      if (!el) return

      const time = Date.now() / 1000
      const offset = index * 2 // Different phase for each element

      // Calculate floating position
      const x = Math.sin(time / duration + offset) * 20
      const y = Math.cos((time / duration) * 2 + offset) * 10
      const rotate = Math.sin((time / duration) * 0.5 + offset) * 5

      el.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`
    })

    animationFrameId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    animate()
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId)
  })

  return {
    elements,
    addElement: (el: HTMLElement) => {
      elements.value.push(el)
    },
  }
}

// Particle system for background
export function useParticles(count = 50) {
  const particles = ref<
    Array<{
      id: number
      x: number
      y: number
      size: number
      speed: number
      opacity: number
    }>
  >([])

  const createParticles = () => {
    particles.value = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 0.5 + 0.1,
      opacity: Math.random() * 0.5 + 0.3,
    }))
  }

  onMounted(() => {
    createParticles()
  })

  return { particles }
}
