<template>
  <div class="neumorphic-card relative overflow-hidden p-0 w-full h-full">
    <!-- Carousel Container -->
    <div class="relative h-full w-full">
      <!-- Slides -->
      <div
        class="flex transition-transform duration-500 ease-in-out h-full"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(slide, index) in slides"
          :key="index"
          class="min-w-full flex-shrink-0 h-full w-full"
        >
          <slot name="slide" :slide="slide" :index="index">
            <div class="p-8 text-center">
              <h3 class="text-2xl font-bold text-[#5a6c7d] mb-4">{{ slide.title }}</h3>
              <p class="text-[#5a6c7d]">{{ slide.content }}</p>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <NeumorphicButton
      v-if="showArrows"
      @click="previousSlide"
      variant="circle"
      class="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10"
      :aria-label="'Previous slide'"
    >
      <svg
        class="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </NeumorphicButton>
    <NeumorphicButton
      v-if="showArrows"
      @click="nextSlide"
      variant="circle"
      class="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10"
      :aria-label="'Next slide'"
    >
      <svg
        class="w-4 h-4 sm:w-5 sm:h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5l7 7-7 7"
        />
      </svg>
    </NeumorphicButton>

    <!-- Indicators -->
    <div v-if="showIndicators" class="flex justify-end gap-2 absolute bottom-2 sm:bottom-4 right-2 sm:right-4 z-10">
      <NeumorphicButton
        v-for="(_, index) in slides"
        :key="index"
        @click="goToSlide(index)"
        variant="circle"
        :class="{ 'opacity-50': currentIndex !== index }"
        :aria-label="`Go to slide ${index + 1}`"
      >
        <span class="text-[#5a6c7d] text-[10px] sm:text-xs lg:text-sm font-medium">{{ index + 1 }}</span>
      </NeumorphicButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import NeumorphicButton from './NeumorphicButton.vue'

interface Slide {
  title?: string
  content?: string
  [key: string]: any
}

const props = withDefaults(
  defineProps<{
    slides: Slide[]
    autoplay?: boolean
    autoplayInterval?: number
    showArrows?: boolean
    showIndicators?: boolean
  }>(),
  {
    autoplay: false,
    autoplayInterval: 3000,
    showArrows: true,
    showIndicators: true,
  }
)

const currentIndex = ref(0)
let autoplayTimer: ReturnType<typeof setInterval> | null = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.slides.length
}

const previousSlide = () => {
  currentIndex.value =
    currentIndex.value === 0
      ? props.slides.length - 1
      : currentIndex.value - 1
}

const goToSlide = (index: number) => {
  currentIndex.value = index
}

const startAutoplay = () => {
  if (props.autoplay) {
    autoplayTimer = setInterval(() => {
      nextSlide()
    }, props.autoplayInterval)
  }
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.neumorphic-card {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  color: #5a6c7d;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.neumorphic-card.p-0 {
  padding: 0;
}
</style>

