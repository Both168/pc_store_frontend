<template>
  <div class="pt-20 pb-6 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col gap-4">
        <!-- Main Image -->
        <div v-if="images && images.length > 0" class="neumorphic-card main-image-container w-full">
          <img
            :src="currentImage || images[0]"
            :alt="productName"
            class="main-image"
            loading="lazy"
          />
        </div>
        
        <!-- Thumbnail Images - Horizontal Scroll -->
        <div v-if="images && images.length > 1" class="thumbnail-outer-container w-full">
          <div class="flex flex-row gap-3 thumbnail-list">
            <div
              v-for="(image, index) in images"
              :key="index"
              @click="$emit('update:currentImage', image)"
              :class="['thumbnail-card', { 'thumbnail-active': (currentImage || images[0]) === image }]"
            >
              <div class="thumbnail-item">
                <img
                  :src="image"
                  :alt="`${productName} - Image ${index + 1}`"
                  class="thumbnail-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Content Section -->
        <div class="w-full">
          <div class="neumorphic-card content-container space-y-3 px-4 py-4">
            <!-- Title and Brand -->
            <div class="relative">
              <div class="flex items-center gap-2 pr-16">
                <h1 class="text-lg font-bold text-[#5a6c7d] flex-1 truncate leading-tight">{{ cleanName }}</h1>
                <button
                  @click="$emit('copy-name')"
                  class="neumorphic-card p-2 copy-button"
                  :title="copySuccess ? 'Copied!' : 'Copy name'"
                >
                  <svg v-if="!copySuccess" class="w-4 h-4 text-[#5a6c7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <svg v-else class="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
              <slot name="brand-badge"></slot>
            </div>

            <!-- Price Section -->
            <div class="neumorphic-card p-4">
              <div class="flex items-baseline gap-2">
                <span v-if="hasDiscount" class="text-base text-[#8a9ba8] line-through">
                  ${{ price }}
                </span>
                <span class="text-xl font-bold text-[#5a6c7d]">
                  ${{ displayPrice }}
                </span>
              </div>
              <slot name="stock-status"></slot>
            </div>

            <!-- Specifications -->
            <div class="neumorphic-card p-4">
              <h2 class="text-base font-bold text-[#5a6c7d] mb-3">Specifications</h2>
              <slot name="specifications"></slot>
            </div>

            <!-- Description -->
            <div v-if="description">
              <h2 class="text-base font-bold text-[#5a6c7d] mb-3">Description</h2>
              <div class="text-[#5a6c7d] product-description" v-html="description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  images: string[]
  productName: string
  price: string
  discountPrice?: string | null
  description?: string | null
  currentImage: string
  cleanName: string
  copySuccess: boolean
}

const props = withDefaults(defineProps<Props>(), {
  discountPrice: null,
  description: null,
})

defineEmits<{
  (e: 'update:currentImage', image: string): void
  (e: 'copy-name'): void
}>()

const hasDiscount = computed(() => {
  if (!props.discountPrice) return false
  if (props.discountPrice === '' || props.discountPrice === '0') return false
  const discountNum = parseFloat(props.discountPrice)
  return !isNaN(discountNum) && discountNum > 0
})

const displayPrice = computed(() => {
  return hasDiscount.value ? props.discountPrice! : props.price
})
</script>

<style scoped>
:deep(.neumorphic-card) {
  border-radius: 0.5rem !important;
}

.thumbnail-outer-container {
  background: #e0e5ec;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 0.5rem;
  width: 100%;
}

.thumbnail-list {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  overflow-y: hidden;
  gap: 0.5rem;
  padding: 0.25rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(90, 108, 125, 0.3) transparent;
}

.thumbnail-list::-webkit-scrollbar {
  height: 4px;
}

.thumbnail-list::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnail-list::-webkit-scrollbar-thumb {
  background-color: rgba(90, 108, 125, 0.3);
  border-radius: 2px;
}

.thumbnail-card {
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail-item {
  width: 60px;
  height: 60px;
  min-width: 60px;
  background: #e0e5ec;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.5rem;
}

.thumbnail-card:hover .thumbnail-item {
  transform: translateY(-2px);
}

.thumbnail-card.thumbnail-active .thumbnail-item {
  transform: scale(0.95);
  box-shadow: 
    inset 4px 4px 5px rgba(207, 212, 219, 0.329),
    inset -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
}

.main-image-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow: hidden;
  min-height: 280px;
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 350px;
  object-fit: contain;
  border-radius: 0.5rem;
}

.content-container {
  width: 100%;
  padding-bottom: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
}

.copy-button {
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.copy-button:hover {
  transform: translateY(-2px);
}

.copy-button:active {
  transform: scale(0.95);
}

.product-description {
  line-height: 1.6;
  font-size: 14px;
}

.product-description :deep(h1),
.product-description :deep(h2),
.product-description :deep(h3),
.product-description :deep(h4),
.product-description :deep(h5),
.product-description :deep(h6) {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #5a6c7d;
}

.product-description :deep(p) {
  margin-bottom: 0.75rem;
}

.product-description :deep(ul),
.product-description :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.product-description :deep(li) {
  margin-bottom: 0.25rem;
}

.product-description :deep(strong) {
  font-weight: 600;
  color: #5a6c7d;
}

/* Specifications styling for mobile */
:deep(.specifications-scrollable) {
  font-size: 14px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(90, 108, 125, 0.3) transparent;
}

:deep(.specifications-scrollable)::-webkit-scrollbar {
  width: 6px;
}

:deep(.specifications-scrollable)::-webkit-scrollbar-track {
  background: transparent;
}

:deep(.specifications-scrollable)::-webkit-scrollbar-thumb {
  background: rgba(90, 108, 125, 0.3);
  border-radius: 3px;
}

:deep(.specifications-scrollable > div) {
  font-size: 14px;
}

:deep(.specifications-scrollable .text-sm) {
  font-size: 12px;
}

:deep(.specifications-scrollable .font-semibold) {
  font-size: 14px;
}
</style>

