<template>
  <section :class="sectionClass" class="relative z-10" :style="{ height: height }">
    <Navbar />
    <div class="flex items-center justify-center pt-20 pb-0 px-4 sm:px-6 md:px-8 lg:px-12 w-full h-full">
      <div class="w-full max-w-7xl" style="height: calc(100% - 5rem);">
        <NeumorphicCarousel
          :slides="slides"
          :autoplay="autoplay"
          :autoplay-interval="autoplayInterval"
          :show-arrows="showArrows"
          :show-indicators="showIndicators"
          class="w-full h-full"
        >
          <template #slide="{ slide, index }">
            <div v-if="slide.image" class="w-full h-full relative overflow-hidden rounded-[20px]">
              <img
                :src="slide.image"
                :alt="slide.title || 'Carousel image'"
                class="w-full h-full object-contain object-center"
                :loading="index === 0 ? 'eager' : 'lazy'"
                :fetchpriority="index === 0 ? 'high' : 'auto'"
              />
            </div>
          </template>
        </NeumorphicCarousel>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Navbar from '../layout/Navbar.vue'
import NeumorphicCarousel from './Neumorphic/NeumorphicCarousel.vue'

interface Slide {
  image: string
  title?: string
  content?: string
  [key: string]: any
}

interface Props {
  slides: Slide[]
  height?: string
  sectionClass?: string
  autoplay?: boolean
  autoplayInterval?: number
  showArrows?: boolean
  showIndicators?: boolean
}

withDefaults(defineProps<Props>(), {
  height: '45vh',
  sectionClass: '',
  autoplay: true,
  autoplayInterval: 5000,
  showArrows: true,
  showIndicators: true,
})
</script>

