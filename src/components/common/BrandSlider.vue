<template>
  <div class="neumorphic-card relative overflow-hidden p-3 sm:p-4 md:p-5 lg:p-6 w-full">
    <div class="relative overflow-hidden">
      <!-- Brand Logos Container with Infinite Scroll -->
      <div
        class="flex items-center gap-8 md:gap-12 lg:gap-16"
        :style="{ 
          transform: `translateX(-${translateX}px)`,
          transition: isAnimating ? 'none' : 'transform 0s linear'
        }"
      >
        <!-- Duplicate brands for seamless loop -->
        <component
          :is="brand.id ? 'router-link' : 'div'"
          v-for="(brand, index) in duplicatedBrands"
          :key="`brand-${index}`"
          :to="brand.id ? `/brandDetail/${brand.id}` : undefined"
          class="neumorphic p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 cursor-pointer"
          :style="{ 
            width: logoSize, 
            height: logoSize,
            minWidth: logoSize,
            minHeight: logoSize,
            textDecoration: 'none',
            color: 'inherit'
          }"
        >
          <img
            v-if="brand.image"
            :src="brand.image"
            :alt="brand.name || 'Brand logo'"
            class="w-full h-full object-contain"
            loading="lazy"
          />
          <span
            v-else
            class="text-[#5a6c7d] font-semibold text-sm md:text-base"
          >
            {{ brand.name }}
          </span>
        </component>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

export interface Brand {
  id?: number
  name: string
  image?: string
  logo_url?: string
}

interface Props {
  brands: Brand[]
  logoSize?: string
  autoplay?: boolean
  speed?: number // pixels per second
}

const props = withDefaults(defineProps<Props>(), {
  logoSize: '120px',
  autoplay: true,
  speed: 50, // 50 pixels per second
})

const translateX = ref(0)
const isAnimating = ref(false)
let animationFrameId: number | null = null
let lastTimestamp: number | null = null

// Duplicate brands array for seamless infinite scroll
const duplicatedBrands = computed(() => {
  if (props.brands.length === 0) return []
  // Create 3 copies to ensure seamless loop
  return [...props.brands, ...props.brands, ...props.brands]
})

// Calculate total width of one set of brands
// gap-8 = 2rem = 32px (mobile), gap-12 = 3rem = 48px (md), gap-16 = 4rem = 64px (lg)
// We'll use average gap of 40px for calculation (accounting for padding)
const singleSetWidth = computed(() => {
  if (props.brands.length === 0) return 0
  const logoWidth = parseInt(props.logoSize) || 100
  const padding = 24 // p-3 = 0.75rem = 12px on each side = 24px total
  const gap = 40 // Average gap size
  return props.brands.length * (logoWidth + padding + gap) - gap
})

const animate = (timestamp: number) => {
  if (!props.autoplay || props.brands.length === 0 || singleSetWidth.value === 0) {
    animationFrameId = null
    return
  }

  if (lastTimestamp === null) {
    lastTimestamp = timestamp
    animationFrameId = requestAnimationFrame(animate)
    return
  }

  const deltaTime = (timestamp - lastTimestamp) / 1000 // Convert to seconds
  lastTimestamp = timestamp

  // Move from left to right
  translateX.value += props.speed * deltaTime

  // Reset position when we've scrolled one full set
  if (translateX.value >= singleSetWidth.value) {
    isAnimating.value = true
    translateX.value = translateX.value - singleSetWidth.value
    // Use requestAnimationFrame to reset transition
    requestAnimationFrame(() => {
      isAnimating.value = false
    })
  }

  animationFrameId = requestAnimationFrame(animate)
}

const startAnimation = () => {
  if (props.autoplay && props.brands.length > 0 && animationFrameId === null) {
    lastTimestamp = null
    animationFrameId = requestAnimationFrame(animate)
  }
}

const stopAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
    lastTimestamp = null
  }
}

// Watch for brands changes and restart animation
watch(
  () => props.brands.length,
  (newLength) => {
    if (newLength > 0 && props.autoplay) {
      stopAnimation()
      translateX.value = 0
      startAnimation()
    }
  },
  { immediate: true }
)

onMounted(() => {
  // Start animation after a small delay to ensure brands are loaded
  setTimeout(() => {
    if (props.brands.length > 0) {
      startAnimation()
    }
  }, 100)
})

onUnmounted(() => {
  stopAnimation()
})
</script>

<style scoped>
.neumorphic-button-circle {
  background: #e0e5ec;
  border: none;
  border-radius: 50%;
  box-shadow: 9px 9px 16px rgba(214, 219, 226, 0.44), -9px -9px 16px rgba(238, 243, 250, 0.64);
  color: #5a6c7d;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.neumorphic-button-circle:hover {
  box-shadow: 6px 6px 12px rgba(214, 219, 226, 0.5), -6px -6px 12px rgba(238, 243, 250, 0.7);
}

.neumorphic-button-circle:active {
  box-shadow: inset 4px 4px 8px rgba(214, 219, 226, 0.5), inset -4px -4px 8px rgba(238, 243, 250, 0.7);
}
</style>

