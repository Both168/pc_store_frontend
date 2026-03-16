<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <!-- Brand Hero Section -->
    <section v-if="brand" class="brand-hero-section relative z-10">
      <Navbar />
      <div class="brand-hero-content pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <div class="neumorphic-card p-6 sm:p-8 md:p-10">
            <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
              <!-- Brand Logo -->
              <div class="flex-shrink-0">
                <div class="brand-logo-container neumorphic-card p-6 sm:p-8 w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center">
                  <img
                    v-if="brand.image"
                    :src="brand.image"
                    :alt="brand.name"
                    class="brand-logo w-full h-full object-contain"
                    loading="eager"
                  />
                  <div
                    v-else
                    class="brand-name-placeholder text-[#5a6c7d] font-bold text-xl sm:text-2xl text-center"
                  >
                    {{ brand.name }}
                  </div>
                </div>
              </div>

              <!-- Brand Information -->
              <div class="flex-1 text-center md:text-left">
                <h1 class="brand-title text-3xl sm:text-4xl md:text-5xl font-bold text-[#5a6c7d] mb-4">
                  {{ brand.name }}
                </h1>
                <div v-if="brand.country" class="text-lg text-[#5a6c7d] mb-2">
                  <span class="text-[#8a9ba8]">{{ $t('brand.detail.country') }}: </span>{{ brand.country }}
                </div>
                <div v-if="brand.status && brand.status !== 1 && brand.status !== '1'" class="text-lg text-[#5a6c7d]">
                  <span class="text-[#8a9ba8]">{{ $t('brand.detail.status') }}: </span>{{ brand.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Loading State -->
    <div v-if="loading" class="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="neumorphic-card p-8">
          <div class="flex flex-col md:flex-row gap-8">
            <div class="md:w-1/3">
              <div class="neumorphic-card aspect-square flex items-center justify-center">
                <div class="w-32 h-32 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
            <div class="md:w-2/3 space-y-4">
              <div class="h-8 bg-gray-300 rounded animate-pulse w-3/4"></div>
              <div class="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <NeumorphicButton @click="loadBrandDetail">
            {{ $t('brand.detail.retry') }}
          </NeumorphicButton>
        </div>
      </div>
    </div>

    <!-- Brand Detail Content -->
    <div v-else-if="brand" class="pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Category Sections -->
        <div v-if="availableCategories.length > 0" class="space-y-12">
          <div
            v-for="category in availableCategories"
            :key="category.id"
            v-memo="[category.products, category.totalCount]"
            class="category-section neumorphic-card p-4 sm:p-6"
          >
            <!-- Layer 1: Category Title -->
            <h2 class="category-title text-2xl md:text-3xl font-bold text-[#5a6c7d] mb-6">
              {{ category.label }}
            </h2>
            
            <!-- Layer 2: Cards Container -->
            <div class="cards-container neumorphic-card p-4 sm:p-6">
              <!-- Layer 3: Product Cards Grid -->
              <div v-if="category.products && category.products.length > 0" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
                <LaptopCard
                  v-for="(product, index) in category.products"
                  :key="`${category.id}-${product.id}`"
                  :index="index"
                  :laptop="{
                    id: product.id,
                    name: product.name,
                    image: product.image || '',
                    price: product.price,
                    discount_price: product.discount_price,
                    in_stock: product.in_stock ?? 1
                  }"
                  :detail-path="category.detailPath"
                />
              </div>

              <!-- Empty State for Category -->
              <div v-else class="text-center py-12">
                <div class="text-[#5a6c7d] text-lg">No products found in this category</div>
              </div>

              <!-- View More Button -->
              <div v-if="category.products && category.products.length > 0" class="flex justify-center mt-6">
                <router-link :to="category.viewMorePath">
                  <NeumorphicButton class="px-6 py-3">
                    View More
                  </NeumorphicButton>
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="text-[#5a6c7d] text-lg">{{ $t('brand.detail.noProducts') }}</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, defineAsyncComponent } from 'vue'
import { useRoute, type RouteLocationRaw } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import { fetchBrandDetail, type BrandDetail, type ProductCategoryData } from '../services/apiBrand'

const LaptopCard = defineAsyncComponent(() => import('../components/common/LaptopCard.vue'))

const route = useRoute()
const { t } = useI18n()

const brand = ref<BrandDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const tabs = [
  { id: 'laptop', labelKey: 'brand.detail.categories.laptop', key: 'laptop' as keyof BrandDetail },
  { id: 'desktop', labelKey: 'brand.detail.categories.desktop', key: 'desktop' as keyof BrandDetail },
  { id: 'gpu', labelKey: 'brand.detail.categories.gpu', key: 'gpu' as keyof BrandDetail },
  { id: 'motherboard', labelKey: 'brand.detail.categories.motherboard', key: 'motherboard' as keyof BrandDetail },
  { id: 'ram', labelKey: 'brand.detail.categories.ram', key: 'ram' as keyof BrandDetail },
  { id: 'storage', labelKey: 'brand.detail.categories.storage', key: 'storage' as keyof BrandDetail },
  { id: 'case', labelKey: 'brand.detail.categories.case', key: 'case' as keyof BrandDetail },
  { id: 'psu', labelKey: 'brand.detail.categories.psu', key: 'psu' as keyof BrandDetail },
  { id: 'cooler', labelKey: 'brand.detail.categories.cooler', key: 'cooler' as keyof BrandDetail },
  { id: 'fan', labelKey: 'brand.detail.categories.fan', key: 'fan' as keyof BrandDetail },
  { id: 'mouse', labelKey: 'brand.detail.categories.mouse', key: 'mouse' as keyof BrandDetail },
  { id: 'keyboard', labelKey: 'brand.detail.categories.keyboard', key: 'keyboard' as keyof BrandDetail },
  { id: 'headset', labelKey: 'brand.detail.categories.headset', key: 'headset' as keyof BrandDetail },
  { id: 'speaker', labelKey: 'brand.detail.categories.speaker', key: 'speaker' as keyof BrandDetail },
  { id: 'monitor', labelKey: 'brand.detail.categories.monitor', key: 'monitor' as keyof BrandDetail },
  { id: 'mousepad', labelKey: 'brand.detail.categories.mousepad', key: 'mousepad' as keyof BrandDetail },
  { id: 'accessory', labelKey: 'brand.detail.categories.accessory', key: 'accessory' as keyof BrandDetail },
  { id: 'webcam', labelKey: 'brand.detail.categories.webcam', key: 'webcam' as keyof BrandDetail },
  { id: 'microphone', labelKey: 'brand.detail.categories.microphone', key: 'microphone' as keyof BrandDetail },
  { id: 'controller', labelKey: 'brand.detail.categories.controller', key: 'controller' as keyof BrandDetail },
]


// Limit products per category for initial render (performance optimization)
const PRODUCTS_PER_CATEGORY_LIMIT = 8

// Memoize path maps to avoid recreating on every computed call
const detailPathMap: Record<string, string> = {
  laptop: '/laptop',
  desktop: '/desktop',
  gpu: '/component/gpu',
  motherboard: '/component/motherboard',
  ram: '/component/ram',
  storage: '/component/storage',
  case: '/component/case',
  psu: '/component/psu',
  cooler: '/component/cooler',
  fan: '/component/fan',
  mouse: '/peripheral/mouse',
  keyboard: '/peripheral/keyboard',
  headset: '/peripheral/headset',
  speaker: '/peripheral/speaker',
  monitor: '/peripheral/monitor',
  mousepad: '/peripheral/mousepad',
  webcam: '/peripheral/webcam',
  microphone: '/peripheral/microphone',
  controller: '/peripheral/controller',
  accessory: '/accessory',
}

const availableCategories = computed(() => {
  if (!brand.value) return []
  
  const brandId = brand.value.id
  const queryKeyMap: Record<string, string> = {
    laptop: 'brand',
  }
  
  return tabs
    .map(tab => {
      const categoryData = brand.value![tab.key] as ProductCategoryData | undefined
      const products = categoryData?.data
      
      if (products && Array.isArray(products) && products.length > 0) {
        // Limit products for initial render to improve performance
        const limitedProducts = products.slice(0, PRODUCTS_PER_CATEGORY_LIMIT)
        const hasMore = products.length > PRODUCTS_PER_CATEGORY_LIMIT
        const basePath = detailPathMap[tab.id] || '/'
        const queryKey = queryKeyMap[tab.id] || 'brand_id'
        
        return {
          id: tab.id,
          label: t(tab.labelKey),
          key: tab.key,
          products: limitedProducts,
          allProducts: products,
          totalCount: products.length,
          hasMore,
          detailPath: basePath,
          viewMorePath: {
            path: basePath,
            query: { [queryKey]: brandId.toString() }
          } as RouteLocationRaw
        }
      }
      return null
    })
    .filter((category): category is NonNullable<typeof category> => category !== null)
})

const loadBrandDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Brand ID')
    }

    const data = await fetchBrandDetail(id)
    brand.value = data
  } catch (err) {
    console.error('Error loading brand detail:', err)
    error.value = 'Failed to load brand details. Please try again.'
    brand.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBrandDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadBrandDetail()
  }
})
</script>

<style scoped>
.brand-hero-section {
  background-color: #e0e5ec;
}

.brand-hero-content {
  min-height: 40vh;
  display: flex;
  align-items: center;
}

.brand-logo-container {
  box-shadow: 
    inset 8px 8px 16px rgba(199, 204, 211, 0.4),
    inset -8px -8px 16px rgba(255, 255, 255, 0.6);
}

.brand-logo {
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
}

.brand-name-placeholder {
  word-break: break-word;
  line-height: 1.2;
}

.brand-title {
  line-height: 1.2;
  word-break: break-word;
}

/* Layer 1: Category Section (Outer Neumorphic Card) */
.category-section {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
}

/* Layer 2: Cards Container (Inner Neumorphic Card) */
.cards-container {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 
    4px 4px 8px rgba(199, 204, 211, 0.3), 
    -4px -4px 8px rgba(255, 255, 255, 0.4),
    inset 2px 2px 4px rgba(199, 204, 211, 0.1);
}

.category-title {
  line-height: 1.2;
  word-break: break-word;
}
</style>
