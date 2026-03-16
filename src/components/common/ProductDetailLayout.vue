<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <Navbar />
    
    <!-- Loading State - Skeleton -->
    <div v-if="loading" class="skeleton-wrapper" :class="screenSize">
      <!-- Desktop Skeleton (>= 1024px) -->
      <div v-if="screenSize === 'desktop'" class="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col md:flex-row gap-8">
            <!-- Left Side - Image Skeleton -->
            <div class="md:w-1/2">
              <div class="flex flex-col md:flex-row gap-4 items-stretch">
                <!-- Main Image Skeleton -->
                <div class="neumorphic-card main-image-container flex-1 order-1 md:order-2">
                  <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
                </div>
                
                <!-- Thumbnail Skeleton -->
                <div class="thumbnail-outer-container order-2 md:order-1">
                  <div class="flex flex-col md:flex-col gap-4">
                    <div v-for="n in 4" :key="n" class="thumbnail-item">
                      <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Description Skeleton (Desktop only) -->
              <div v-if="showDescriptionOnLeft" class="neumorphic-card p-6 mt-6 hidden md:block">
                <Skeleton variant="text" width="30%" height="1.5rem" class="mb-4" />
                <Skeleton variant="text" width="100%" height="1rem" class="mb-2" />
                <Skeleton variant="text" width="90%" height="1rem" class="mb-2" />
                <Skeleton variant="text" width="95%" height="1rem" />
              </div>
            </div>

            <!-- Right Side - Content Skeleton -->
            <div class="md:w-1/2">
              <div class="neumorphic-card content-container space-y-6 px-6 py-6">
                <!-- Title and Brand Skeleton -->
                <div class="relative">
                  <div class="flex items-center gap-2 pr-24">
                    <Skeleton variant="text" width="70%" height="1.5rem" />
                    <Skeleton variant="circular" width="32px" height="32px" />
                  </div>
                  <div class="absolute -top-2 right-0">
                    <Skeleton variant="rectangular" width="80px" height="30px" :border-radius="'0.5rem'" />
                  </div>
                </div>

                <!-- Price Section Skeleton -->
                <div class="neumorphic-card p-6">
                  <Skeleton variant="text" width="40%" height="2rem" />
                </div>

                <!-- Specifications Skeleton -->
                <div class="neumorphic-card p-6">
                  <Skeleton variant="text" width="40%" height="1.5rem" class="mb-4" />
                  <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="n in 8" :key="n">
                      <Skeleton variant="text" width="60%" height="0.875rem" class="mb-2" />
                      <Skeleton variant="text" width="90%" height="1rem" />
                    </div>
                  </div>
                </div>

                <!-- Description Skeleton (Desktop only if not on left) -->
                <div v-if="description && !showDescriptionOnLeft" class="hidden md:block">
                  <Skeleton variant="text" width="40%" height="1.5rem" class="mb-4" />
                  <Skeleton variant="text" width="100%" height="1rem" class="mb-2" />
                  <Skeleton variant="text" width="90%" height="1rem" class="mb-2" />
                  <Skeleton variant="text" width="95%" height="1rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tablet Skeleton (768px - 1023px) -->
      <div v-else-if="screenSize === 'tablet'" class="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col gap-8">
            <!-- Images Section Skeleton -->
            <div class="w-full">
              <div class="flex flex-row gap-4 items-stretch">
                <!-- Thumbnail Skeleton -->
                <div class="thumbnail-outer-container">
                  <div class="flex flex-col gap-4">
                    <div v-for="n in 4" :key="n" class="thumbnail-item">
                      <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
                    </div>
                  </div>
                </div>
                
                <!-- Main Image Skeleton -->
                <div class="neumorphic-card main-image-container flex-1">
                  <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
                </div>
              </div>
            </div>

            <!-- Content Section Skeleton -->
            <div class="w-full">
              <div class="neumorphic-card content-container space-y-6 px-6 py-6">
                <!-- Title and Brand Skeleton -->
                <div class="relative">
                  <div class="flex items-center gap-2 pr-24">
                    <Skeleton variant="text" width="70%" height="1.5rem" />
                    <Skeleton variant="circular" width="32px" height="32px" />
                  </div>
                  <div class="absolute -top-2 right-0">
                    <Skeleton variant="rectangular" width="80px" height="30px" :border-radius="'0.5rem'" />
                  </div>
                </div>

                <!-- Price Section Skeleton -->
                <div class="neumorphic-card p-6">
                  <Skeleton variant="text" width="40%" height="2rem" />
                </div>

                <!-- Specifications Skeleton -->
                <div class="neumorphic-card p-6">
                  <Skeleton variant="text" width="40%" height="1.5rem" class="mb-4" />
                  <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div v-for="n in 8" :key="n">
                      <Skeleton variant="text" width="60%" height="0.875rem" class="mb-2" />
                      <Skeleton variant="text" width="90%" height="1rem" />
                    </div>
                  </div>
                </div>

                <!-- Description Skeleton -->
                <div>
                  <Skeleton variant="text" width="40%" height="1.5rem" class="mb-4" />
                  <Skeleton variant="text" width="100%" height="1rem" class="mb-2" />
                  <Skeleton variant="text" width="90%" height="1rem" class="mb-2" />
                  <Skeleton variant="text" width="95%" height="1rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Mobile Skeleton (< 768px) -->
      <div v-else class="pt-20 pb-6 px-4">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col gap-4">
            <!-- Main Image Skeleton -->
            <div class="neumorphic-card main-image-container w-full">
              <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
            </div>
            
            <!-- Thumbnail Skeleton - Horizontal -->
            <div class="thumbnail-outer-container w-full">
              <div class="flex flex-row gap-3">
                <div v-for="n in 4" :key="n" class="thumbnail-item">
                  <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
                </div>
              </div>
            </div>

            <!-- Content Section Skeleton -->
            <div class="w-full">
              <div class="neumorphic-card content-container space-y-3 px-4 py-4">
                <!-- Title and Brand Skeleton -->
                <div class="relative">
                  <div class="flex items-center gap-2 pr-16">
                    <Skeleton variant="text" width="70%" height="1.125rem" />
                    <Skeleton variant="circular" width="28px" height="28px" />
                  </div>
                  <div class="absolute -top-2 right-0">
                    <Skeleton variant="rectangular" width="70px" height="26px" :border-radius="'0.5rem'" />
                  </div>
                </div>

                <!-- Price Section Skeleton -->
                <div class="neumorphic-card p-4">
                  <Skeleton variant="text" width="35%" height="1.5rem" />
                </div>

                <!-- Specifications Skeleton -->
                <div class="neumorphic-card p-4">
                  <Skeleton variant="text" width="40%" height="1rem" class="mb-3" />
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div v-for="n in 8" :key="n">
                      <Skeleton variant="text" width="60%" height="0.75rem" class="mb-2" />
                      <Skeleton variant="text" width="90%" height="0.875rem" />
                    </div>
                  </div>
                </div>

                <!-- Description Skeleton -->
                <div>
                  <Skeleton variant="text" width="40%" height="1rem" class="mb-3" />
                  <Skeleton variant="text" width="100%" height="0.875rem" class="mb-2" />
                  <Skeleton variant="text" width="90%" height="0.875rem" class="mb-2" />
                  <Skeleton variant="text" width="95%" height="0.875rem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <div class="text-red-500 text-lg mb-4">{{ error }}</div>
        <NeumorphicButton @click="$emit('retry')">
          Retry
        </NeumorphicButton>
      </div>
    </div>

    <!-- Product Detail Content - Desktop (>= 1024px) -->
    <ProductDetailDesktop
      v-else-if="product && screenSize === 'desktop'"
      :images="images"
      :product-name="productName"
      :price="price"
      :discount-price="discountPrice"
      :description="description"
      :show-description-on-left="showDescriptionOnLeft"
      :current-image="currentImage"
      :clean-name="cleanName"
      :copy-success="copySuccess"
      @update:current-image="currentImage = $event"
      @copy-name="copyName"
    >
      <template #brand-badge>
        <slot name="brand-badge"></slot>
      </template>
      <template #stock-status>
        <slot name="stock-status"></slot>
      </template>
      <template #specifications>
        <slot name="specifications"></slot>
      </template>
    </ProductDetailDesktop>

    <!-- Product Detail Content - Tablet (768px - 1023px) -->
    <ProductDetailTablet
      v-else-if="product && screenSize === 'tablet'"
      :images="images"
      :product-name="productName"
      :price="price"
      :discount-price="discountPrice"
      :description="description"
      :current-image="currentImage"
      :clean-name="cleanName"
      :copy-success="copySuccess"
      @update:current-image="currentImage = $event"
      @copy-name="copyName"
    >
      <template #brand-badge>
        <slot name="brand-badge"></slot>
      </template>
      <template #stock-status>
        <slot name="stock-status"></slot>
      </template>
      <template #specifications>
        <slot name="specifications"></slot>
      </template>
    </ProductDetailTablet>

    <!-- Product Detail Content - Mobile (< 768px) -->
    <ProductDetailMobile
      v-else-if="product && screenSize === 'mobile'"
      :images="images"
      :product-name="productName"
      :price="price"
      :discount-price="discountPrice"
      :description="description"
      :current-image="currentImage"
      :clean-name="cleanName"
      :copy-success="copySuccess"
      @update:current-image="currentImage = $event"
      @copy-name="copyName"
    >
      <template #brand-badge>
        <slot name="brand-badge"></slot>
      </template>
      <template #stock-status>
        <slot name="stock-status"></slot>
      </template>
      <template #specifications>
        <slot name="specifications"></slot>
      </template>
    </ProductDetailMobile>

    <!-- Suggestions Section (Optional) -->
    <slot name="suggestions"></slot>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, defineAsyncComponent } from 'vue'
import Navbar from '../layout/Navbar.vue'
import Footer from '../layout/Footer.vue'
import NeumorphicButton from './Neumorphic/NeumorphicButton.vue'
import Skeleton from './Skeleton.vue'

const ProductDetailDesktop = defineAsyncComponent(() => import('./ProductDetailLayout/ProductDetailDesktop.vue'))
const ProductDetailTablet = defineAsyncComponent(() => import('./ProductDetailLayout/ProductDetailTablet.vue'))
const ProductDetailMobile = defineAsyncComponent(() => import('./ProductDetailLayout/ProductDetailMobile.vue'))

interface Props {
  loading: boolean
  error: string | null
  product: any | null
  images?: string[]
  productName: string
  price: string
  discountPrice?: string | null
  description?: string | null
  showDescriptionOnLeft?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  images: () => [],
  discountPrice: null,
  description: null,
  showDescriptionOnLeft: true,
})

const emit = defineEmits<{
  (e: 'retry'): void
}>()

const currentImage = ref<string>('')
const copySuccess = ref(false)
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const screenSize = computed(() => {
  if (windowWidth.value < 768) {
    return 'mobile'
  } else if (windowWidth.value < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
})

const cleanName = computed(() => {
  const name = props.productName
  const parenIndex = name.indexOf('(')
  return parenIndex > -1 ? name.substring(0, parenIndex).trim() : name
})

const copyName = async () => {
  try {
    await navigator.clipboard.writeText(cleanName.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

watch(() => props.images, (newImages) => {
  if (newImages && newImages.length > 0 && newImages[0]) {
    currentImage.value = newImages[0]
  } else {
    currentImage.value = ''
  }
}, { immediate: true })

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
.skeleton-wrapper :deep(.neumorphic-card) {
  border-radius: 0.5rem !important;
}

.thumbnail-outer-container {
  flex-shrink: 0;
  background: #e0e5ec;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-self: stretch;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  background: #e0e5ec;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.main-image-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  overflow: hidden;
  min-height: 400px;
}

.content-container {
  width: 100%;
  padding-bottom: 2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

.specifications-scrollable {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(90, 108, 125, 0.3) transparent;
}

.specifications-scrollable::-webkit-scrollbar {
  width: 6px;
}

.specifications-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.specifications-scrollable::-webkit-scrollbar-thumb {
  background: rgba(90, 108, 125, 0.3);
  border-radius: 3px;
}
</style>
