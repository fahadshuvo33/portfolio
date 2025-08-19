<template>
  <div class="w-full text-center" ref="containerRef">
    <pre
      ref="asciiRef"
      :class="textClass"
      class="font-mono inline-block whitespace-pre overflow-hidden select-none"
      :style="dynamicStyles"
    ><span
      v-for="(char, index) in textArray"
      :key="index"
      :class="getCharClass(index)"
      :style="getCharStyle(index)"
    >{{ char }}</span></pre>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

type StartAnimationType = 'dissolve' | 'typewriter'
type ContinuousAnimationType = 'wave-light'

interface Props {
  asciiText?: string
  textClass?: string
  minFontSize?: number
  maxFontSize?: number
  padding?: number
  startAnimation?: StartAnimationType
  continuousAnimation?: ContinuousAnimationType
  startSpeed?: number
  continuousSpeed?: number
  outlineColor?: string // NEW: Customizable outline color
}

const props = withDefaults(defineProps<Props>(), {
  asciiText: `
███████╗ █████╗ ██╗  ██╗ █████╗ ██████╗     ██╗  ██╗ ██████╗ ███████╗███████╗ █████╗ ██╗███╗   ██╗
██╔════╝██╔══██╗██║  ██║██╔══██╗██╔══██╗    ██║  ██║██╔═══██╗██╔════╝██╔════╝██╔══██╗██║████╗  ██║
█████╗  ███████║███████║███████║██║  ██║    ███████║██║   ██║███████╗███████╗███████║██║██╔██╗ ██║
██╔══╝  ██╔══██║██╔══██║██╔══██║██║  ██║    ██╔══██║██║   ██║╚════██║╚════██║██╔══██║██║██║╚██╗██║
██║     ██║  ██║██║  ██║██║  ██║██████╔╝    ██║  ██║╚██████╔╝███████║███████║██║  ██║██║██║ ╚████║
╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝     ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝`,
  textClass: 'text-green-400',
  minFontSize: 4,
  maxFontSize: 24,
  padding: 40,
  startAnimation: 'dissolve',
  continuousAnimation: 'wave-light',
  startSpeed: 150, // Much faster dissolve (was 400)
  continuousSpeed: 8000,
  outlineColor: 'white', // Default white, but customizable
})

const containerRef = ref<HTMLDivElement>()
const asciiRef = ref<HTMLPreElement>()
const currentFontSize = ref(16)
const revealedChars = ref<Set<number>>(new Set())
const typedLength = ref(0)
const isStartComplete = ref(false)
const currentWaveIndex = ref(0)

let continuousInterval: NodeJS.Timeout | null = null

const cleanAsciiText = computed(() => props.asciiText.trim())
const textArray = computed(() => cleanAsciiText.value.split(''))

// Convert color name/hex to RGB values for rgba usage
const getColorRGB = computed(() => {
  const colorMap: Record<string, string> = {
    white: '255, 255, 255',
    red: '255, 0, 0',
    green: '0, 255, 0',
    blue: '0, 0, 255',
    yellow: '255, 255, 0',
    cyan: '0, 255, 255',
    magenta: '255, 0, 255',
    orange: '255, 165, 0',
    purple: '128, 0, 128',
    pink: '255, 192, 203',
  }

  // If it's a predefined color name
  if (colorMap[props.outlineColor.toLowerCase()]) {
    return colorMap[props.outlineColor.toLowerCase()]
  }

  // If it's hex color like #ff0000
  if (props.outlineColor.startsWith('#')) {
    const hex = props.outlineColor.slice(1)
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return `${r}, ${g}, ${b}`
  }

  // Default to white if color format not recognized
  return '255, 255, 255'
})

const letterRanges = computed(() => {
  const letterColumns = [
    { start: 0, end: 8, name: 'F' },
    { start: 9, end: 17, name: 'A' },
    { start: 18, end: 26, name: 'H' },
    { start: 27, end: 35, name: 'A' },
    { start: 36, end: 44, name: 'D' },
    { start: 45, end: 50, name: ' ' },
    { start: 51, end: 59, name: 'H' },
    { start: 60, end: 68, name: 'O' },
    { start: 69, end: 77, name: 'S' },
    { start: 78, end: 86, name: 'S' },
    { start: 87, end: 95, name: 'A' },
    { start: 96, end: 104, name: 'I' },
    { start: 105, end: 113, name: 'N' },
  ]

  const ranges: Array<{ indices: number[]; name: string }> = []
  const lines = cleanAsciiText.value.split('\n')

  letterColumns.forEach((col) => {
    const indices: number[] = []
    let charIndex = 0

    lines.forEach((line, lineIndex) => {
      if (lineIndex > 0) charIndex++

      for (let colIndex = 0; colIndex < line.length; colIndex++) {
        if (colIndex >= col.start && colIndex <= col.end) {
          indices.push(charIndex)
        }
        charIndex++
      }
    })

    if (indices.length > 0) {
      ranges.push({ indices, name: col.name })
    }
  })

  return ranges
})

const dynamicStyles = computed(() => ({
  fontSize: currentFontSize.value + 'px',
  lineHeight: '1.1',
  letterSpacing: currentFontSize.value < 12 ? '-0.5px' : '0px',
  fontFamily: '"Courier New", "Monaco", "Menlo", monospace',
  whiteSpace: 'pre',
}))

const getCharClass = (index: number) => {
  if (!isStartComplete.value) {
    if (props.startAnimation === 'dissolve') {
      return revealedChars.value.has(index)
        ? 'opacity-100 transition-opacity duration-100'
        : 'opacity-0'
    } else if (props.startAnimation === 'typewriter') {
      return index < typedLength.value ? 'opacity-100 transition-opacity duration-75' : 'opacity-0'
    }
  }
  return 'opacity-100'
}

// REDUCED active area - only 2 letters instead of 4
const getWaveIntensity = (index: number): number => {
  if (!isStartComplete.value || letterRanges.value.length === 0) return 0

  let charLetterIndex = -1

  for (let i = 0; i < letterRanges.value.length; i++) {
    if (letterRanges.value[i].indices.includes(index)) {
      charLetterIndex = i
      break
    }
  }

  if (charLetterIndex === -1) return 0

  const distance = Math.abs(charLetterIndex - currentWaveIndex.value)

  // SMALLER active area - only 2 letters affected
  if (distance === 0) return 1.0 // Brightest at center
  if (distance === 1) return 0.6 // Medium adjacent glow

  return 0 // No effect beyond 1 letter away
}

const getCharStyle = (index: number) => {
  const char = textArray.value[index]

  if (char === '\n') {
    return {}
  }

  const intensity = getWaveIntensity(index)

  if (intensity === 0) {
    return {
      transition: 'all 0.8s ease-out',
      display: 'inline-block',
    }
  }

  // Customizable color light wave effect
  const rgb = getColorRGB.value
  const lightIntensity = intensity
  const glowRadius = lightIntensity * 20 // Reduced glow size
  const outerGlowRadius = lightIntensity * 30 // Reduced outer glow
  const backgroundGlow = lightIntensity * 40 // Reduced background glow

  return {
    // Multi-layer colored glow
    textShadow: `
      0 0 ${glowRadius * 0.3}px rgba(${rgb}, ${lightIntensity * 0.9}),
      0 0 ${glowRadius * 0.6}px rgba(${rgb}, ${lightIntensity * 0.7}),
      0 0 ${glowRadius}px rgba(${rgb}, ${lightIntensity * 0.5}),
      0 0 ${outerGlowRadius}px rgba(${rgb}, ${lightIntensity * 0.3})
    `,
    // Background glow effect with custom color
    boxShadow: `
      0 0 ${backgroundGlow * 0.5}px rgba(${rgb}, ${lightIntensity * 0.08}),
      inset 0 0 ${glowRadius}px rgba(${rgb}, ${lightIntensity * 0.04})
    `,
    // Brighten the text
    filter: `brightness(${1 + lightIntensity * 0.25})`,
    // Minimal scale for emphasis
    transform: `scale(${1 + lightIntensity * 0.08})`,
    // Colored background tint
    background: `radial-gradient(circle, rgba(${rgb}, ${lightIntensity * 0.06}) 0%, transparent 70%)`,
    borderRadius: '3px',
    transition: 'all 0.8s ease-out',
    display: 'inline-block',
    position: 'relative',
    zIndex: Math.floor(lightIntensity * 10).toString(),
  }
}

// MUCH faster dissolve
const startDissolve = () => {
  const nonNewlineIndices = textArray.value
    .map((char, index) => (char !== '\n' ? index : -1))
    .filter((index) => index !== -1)
    .sort(() => Math.random() - 0.5)

  let revealed = 0
  const dissolveInterval = setInterval(
    () => {
      if (revealed >= nonNewlineIndices.length) {
        clearInterval(dissolveInterval)
        isStartComplete.value = true
        setTimeout(() => {
          startContinuousAnimation()
        }, 100) // Very short delay
        return
      }

      // Reveal multiple characters at once for faster effect
      const batchSize = Math.max(1, Math.floor(nonNewlineIndices.length / 20)) // Reveal in batches
      for (let i = 0; i < batchSize && revealed < nonNewlineIndices.length; i++) {
        revealedChars.value.add(nonNewlineIndices[revealed])
        revealed++
      }
    },
    Math.max(10, props.startSpeed / 20),
  ) // Much faster interval
}

const startTypewriter = () => {
  const textLength = textArray.value.length
  let currentIndex = 0

  const typeInterval = setInterval(
    () => {
      if (currentIndex >= textLength) {
        clearInterval(typeInterval)
        isStartComplete.value = true
        setTimeout(() => {
          startContinuousAnimation()
        }, 100)
        return
      }
      typedLength.value = currentIndex + 1
      currentIndex++
    },
    Math.max(3, props.startSpeed / textLength),
  ) // Much faster typewriter
}

const startContinuousAnimation = () => {
  if (letterRanges.value.length === 0) return

  currentWaveIndex.value = 0

  if (continuousInterval) {
    clearInterval(continuousInterval)
  }

  const timePerLetter = props.continuousSpeed / letterRanges.value.length

  continuousInterval = setInterval(() => {
    currentWaveIndex.value++

    if (currentWaveIndex.value >= letterRanges.value.length) {
      currentWaveIndex.value = 0
    }
  }, timePerLetter)
}

const calculateFontSize = () => {
  if (!containerRef.value) return

  const container = containerRef.value
  const availableWidth = container.clientWidth - props.padding

  const tempElement = document.createElement('pre')
  tempElement.style.position = 'absolute'
  tempElement.style.visibility = 'hidden'
  tempElement.style.whiteSpace = 'pre'
  tempElement.style.fontFamily = '"Courier New", "Monaco", "Menlo", monospace'
  tempElement.textContent = cleanAsciiText.value.split('\n')[0]
  document.body.appendChild(tempElement)

  let bestSize = props.minFontSize
  for (let size = props.maxFontSize; size >= props.minFontSize; size--) {
    tempElement.style.fontSize = size + 'px'
    tempElement.style.letterSpacing = size < 12 ? '-0.5px' : '0px'
    if (tempElement.offsetWidth <= availableWidth) {
      bestSize = size
      break
    }
  }

  document.body.removeChild(tempElement)
  currentFontSize.value = bestSize
}

let resizeTimeout: number
const handleResize = () => {
  clearTimeout(resizeTimeout)
  resizeTimeout = setTimeout(calculateFontSize, 100)
}

const initializeAnimation = () => {
  textArray.value.forEach((char, index) => {
    if (char === '\n') revealedChars.value.add(index)
  })

  if (props.startAnimation === 'typewriter') {
    startTypewriter()
  } else {
    startDissolve()
  }
}

onMounted(() => {
  setTimeout(() => {
    calculateFontSize()
    initializeAnimation()
  }, 300)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  clearTimeout(resizeTimeout)
  if (continuousInterval) {
    clearInterval(continuousInterval)
  }
})
</script>

<style scoped>
pre {
  font-feature-settings: 'liga' 0;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
