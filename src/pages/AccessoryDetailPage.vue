<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <Navbar />
    
    <!-- Loading State - Skeleton -->
    <div v-if="loading" class="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Left Side - Image Skeleton -->
          <div class="md:w-1/2">
            <div class="flex flex-col md:flex-row gap-4 items-stretch">
              <!-- Main Image Skeleton -->
              <div class="neumorphic-card main-image-container flex-1 order-1 md:order-2">
                <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'1rem'" />
              </div>
              
              <!-- Thumbnail Skeleton -->
              <div class="thumbnail-outer-container order-2 md:order-1">
                <div class="flex flex-row md:flex-col gap-4 thumbnail-list">
                  <div v-for="n in 4" :key="n" class="thumbnail-item">
                    <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'0.5rem'" />
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Description Skeleton (Desktop only) -->
            <div class="neumorphic-card p-6 mt-6 hidden md:block">
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
                  <div v-for="n in 4" :key="n">
                    <Skeleton variant="text" width="60%" height="0.875rem" class="mb-2" />
                    <Skeleton variant="text" width="90%" height="1rem" />
                  </div>
                </div>
              </div>

              <!-- Description Skeleton (Mobile only) -->
              <div class="md:hidden">
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

    <!-- Error State -->
    <div v-else-if="error" class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <div class="text-red-500 text-lg mb-4">{{ error }}</div>
        <NeumorphicButton @click="loadAccessoryDetail">
          Retry
        </NeumorphicButton>
      </div>
    </div>

    <!-- Accessory Detail Content -->
    <div v-else-if="accessory" class="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row gap-8">
          <!-- Left Side - Thumbnail Images and Main Image (Sticky) -->
          <div class="md:w-1/2 md:sticky md:top-24 md:self-start">
            <div class="flex flex-col md:flex-row gap-4 items-stretch">
              <!-- Main Image -->
              <div v-if="accessory.images && accessory.images.length > 0" class="neumorphic-card main-image-container flex-1 order-1 md:order-2">
                <img
                  :src="currentImage || accessory.images[0]"
                  :alt="accessory.name"
                  class="main-image"
                  loading="lazy"
                />
              </div>
              
              <!-- Thumbnail Images - Vertical on desktop, horizontal on mobile -->
              <div v-if="accessory.images && accessory.images.length > 1" class="thumbnail-outer-container order-2 md:order-1">
                <div class="flex flex-col md:flex-col gap-4 thumbnail-list">
                  <div
                    v-for="(image, index) in accessory.images"
                    :key="index"
                    @click="currentImage = image"
                    :class="['thumbnail-card', { 'thumbnail-active': (currentImage || accessory.images[0]) === image }]"
                  >
                    <div class="thumbnail-item">
                      <img
                        :src="image"
                        :alt="`${accessory.name} - Image ${index + 1}`"
                        class="thumbnail-img"
                        loading="lazy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Description Below Main Image (Desktop only) -->
            <div v-if="accessory.description" class="neumorphic-card p-6 mt-6 hidden md:block">
              <h2 class="text-xl font-bold text-[#5a6c7d] mb-4">Description</h2>
              <div class="text-[#5a6c7d] accessory-description" v-html="accessory.description"></div>
            </div>
          </div>

          <!-- Right Side - Content (Sticky) -->
          <div class="md:w-1/2 md:sticky md:top-24 md:self-start">
            <div class="neumorphic-card content-container space-y-6 px-6 py-6">
              <!-- Title and Brand -->
              <div class="relative">
                <div class="flex items-center gap-2 pr-24">
                  <h1 class="text-sm sm:text-lg md:text-xl font-bold text-[#5a6c7d] flex-1 truncate">{{ cleanName }}</h1>
                  <button
                    @click="copyName"
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
                <router-link
                  v-if="accessory.brand_id"
                  :to="`/brandDetail/${accessory.brand_id}`"
                  class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
                  style="text-decoration: none; color: inherit;"
                >
                  <img v-if="accessory.brand" :src="accessory.brand" :alt="'Brand logo'" class="h-6 w-auto" />
                </router-link>
                <div v-else-if="accessory.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
                  <img v-if="accessory.brand" :src="accessory.brand" :alt="'Brand logo'" class="h-6 w-auto" />
                </div>
              </div>

              <!-- Price Section -->
              <div class="neumorphic-card p-6">
                <div class="flex items-baseline gap-4">
                  <span v-if="hasDiscount" class="text-xl text-[#8a9ba8] line-through">
                    ${{ accessory.price }}
                  </span>
                  <span class="text-3xl font-bold text-[#5a6c7d]">
                    ${{ displayPrice }}
                  </span>
                </div>
                <div v-if="accessory.in_stock === 'unavailable' || accessory.in_stock === 'out of stock' || accessory.in_stock === '0' || accessory.in_stock === 'sold out'" class="mt-4 text-red-500 font-semibold">
                  Out of Stock
                </div>
                <div v-else-if="accessory.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
                  In Stock
                </div>
              </div>

              <!-- Specifications -->
              <div class="neumorphic-card p-6">
                <h2 class="text-xl font-bold text-[#5a6c7d] mb-4">Specifications</h2>
                <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div v-if="accessory.type_accessary">
                    <div class="text-sm text-[#8a9ba8]">Type</div>
                    <div class="text-[#5a6c7d] font-semibold">{{ accessory.type_accessary }}</div>
                  </div>
                  <div v-if="accessory.color">
                    <div class="text-sm text-[#8a9ba8]">Color</div>
                    <div class="text-[#5a6c7d] font-semibold">{{ accessory.color }}</div>
                  </div>
                </div>
              </div>

              <!-- Description Below Specifications (Mobile only) -->
              <div v-if="accessory.description" class="md:hidden">
                <h2 class="text-xl font-bold text-[#5a6c7d] mb-4">Description</h2>
                <div class="text-[#5a6c7d] accessory-description" v-html="accessory.description"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import Skeleton from '../components/common/Skeleton.vue'
import { fetchAccessoryDetail, type AccessoryDetail } from '../services/apiAccessory'

const route = useRoute()

const accessory = ref<AccessoryDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const currentImage = ref<string>('')
const copySuccess = ref(false)

const hasDiscount = computed(() => {
  if (!accessory.value) return false
  const discount = accessory.value.discount_price
  if (discount === null || discount === undefined || discount === '' || discount === '0') {
    return false
  }
  const discountNum = parseFloat(discount)
  return !isNaN(discountNum) && discountNum > 0
})

const displayPrice = computed(() => {
  if (!accessory.value) return '0.00'
  return hasDiscount.value ? accessory.value.discount_price! : accessory.value.price
})

const cleanName = computed(() => {
  if (!accessory.value) return ''
  const name = accessory.value.name
  const parenIndex = name.indexOf('(')
  return parenIndex > -1 ? name.substring(0, parenIndex).trim() : name
})

const copyName = async () => {
  if (!accessory.value) return
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

const loadAccessoryDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Accessory ID')
    }

    const data = await fetchAccessoryDetail(id)
    accessory.value = data
    currentImage.value = data.images && data.images.length > 0 ? (data.images[0] ?? '') : ''
  } catch (err) {
    console.error('Error loading accessory detail:', err)
    error.value = 'Failed to load accessory details'
    accessory.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAccessoryDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadAccessoryDetail()
  }
})
</script>

<style scoped>
.thumbnail-outer-container {
  flex-shrink: 0;
  background: #e0e5ec;
  border-radius: 42px;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-self: stretch;
}

.thumbnail-list {
  flex: 1;
  padding: 0.25rem 0;
  scrollbar-width: thin;
  scrollbar-color: rgba(90, 108, 125, 0.3) transparent;
  overflow-y: auto;
  min-height: 0;
}

.thumbnail-list::-webkit-scrollbar {
  width: 6px;
}

.thumbnail-list::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnail-list::-webkit-scrollbar-thumb {
  background-color: rgba(90, 108, 125, 0.3);
  border-radius: 3px;
}

.thumbnail-card {
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.thumbnail-item {
  width: 80px;
  height: 80px;
  background: #e0e5ec;
  border-radius: 42px;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 0.5rem;
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
  border-radius: 32px;
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
  padding: 2rem;
  overflow: hidden;
  min-height: 400px;
}

.main-image {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
  border-radius: 1rem;
}

.content-container {
  width: 100%;
  padding-bottom: 2rem;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

@media (min-width: 768px) {
  .content-container {
    padding-right: 1rem;
  }
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

.accessory-description {
  line-height: 1.6;
}

.accessory-description :deep(h1),
.accessory-description :deep(h2),
.accessory-description :deep(h3),
.accessory-description :deep(h4),
.accessory-description :deep(h5),
.accessory-description :deep(h6) {
  font-weight: 600;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  color: #5a6c7d;
}

.accessory-description :deep(p) {
  margin-bottom: 0.75rem;
}

.accessory-description :deep(ul),
.accessory-description :deep(ol) {
  margin-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.accessory-description :deep(li) {
  margin-bottom: 0.25rem;
}

.accessory-description :deep(strong) {
  font-weight: 600;
  color: #5a6c7d;
}

@media (min-width: 768px) and (max-width: 1023px) {
  .thumbnail-outer-container {
    padding: 0.75rem;
  }

  .thumbnail-item {
    width: 80px;
    height: 80px;
    padding: 0.5rem;
  }

  .thumbnail-list {
    max-height: calc(80px * 4 + 1rem * 3);
    padding: 0.25rem 0;
  }

  .main-image-container {
    padding: 2rem;
  }

  .main-image {
    max-height: 600px;
  }
}

@media (max-width: 767px) {
  .thumbnail-outer-container {
    padding: 0.75rem;
    width: 100%;
    max-width: 100%;
    margin-bottom: 1rem;
  }

  .thumbnail-item {
    width: 70px;
    height: 70px;
    min-width: 70px;
    padding: 0.375rem;
  }

  .thumbnail-list {
    max-height: none;
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
    gap: 0.75rem;
    padding: 0.5rem 0;
  }

  .main-image-container {
    padding: 1.5rem;
    min-height: 300px;
  }
}
</style>

