<template>
  <ProductListingLayout
    :carousel-slides="carouselSlides"
    :loading="loading"
    :error="error"
    :items="desktops"
    :empty-message="$t('desktop.empty')"
    :pagination-links="paginationLinks"
    :pagination-meta="paginationMeta"
    @retry="() => loadDesktops(1)"
    @page-change="handlePageChange"
  >
    <!-- Filter Section Slot -->
    <template #filters>
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch">
        <!-- Price Range -->
        <div class="flex-1 space-y-3 min-w-0">
          <label class="text-sm sm:text-base font-semibold text-[#5a6c7d] block mb-3">{{ $t('desktop.filter.priceRange') }}</label>
          <div class="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
            <div class="flex gap-3 items-center flex-1 min-w-0">
              <input
                v-model.number="minPrice"
                type="number"
                :placeholder="$t('desktop.filter.minPrice')"
                class="neumorphic-input flex-1 text-sm sm:text-base min-w-0"
                min="0"
              />
              <span class="text-[#5a6c7d] flex-shrink-0 text-lg font-medium hidden sm:inline">-</span>
              <input
                v-model.number="maxPrice"
                type="number"
                :placeholder="$t('desktop.filter.maxPrice')"
                class="neumorphic-input flex-1 text-sm sm:text-base min-w-0"
                min="0"
              />
            </div>
            <div class="flex gap-3 items-center sm:flex-shrink-0">
              <NeumorphicButton
                @click="applyFilters"
                class="flex-1 sm:flex-shrink-0 px-5 sm:px-6 md:px-8 text-sm sm:text-base whitespace-nowrap"
              >
                {{ $t('desktop.filter.apply') }}
              </NeumorphicButton>
              <NeumorphicButton
                @click="resetFilters"
                class="flex-1 sm:flex-shrink-0 px-5 sm:px-6 md:px-8 text-sm sm:text-base whitespace-nowrap"
              >
                {{ $t('desktop.filter.reset') }}
              </NeumorphicButton>
            </div>
          </div>
        </div>

        <!-- Contact Buttons -->
        <div class="flex-1 space-y-3 min-w-0 lg:border-l lg:border-[#5a6c7d] lg:border-opacity-20 lg:pl-8">
          <label class="text-sm sm:text-base font-semibold text-[#5a6c7d] block mb-3">{{ $t('desktop.contactLabel') }}</label>
          <div class="flex gap-3 sm:gap-4 items-center justify-start flex-wrap">
            <!-- Small Banner Image -->
            <div class="small-banner-container">
              <img
                v-if="customBannerImage"
                :src="customBannerImage"
                :alt="$t('desktop.customBannerAlt')"
                class="small-banner-image"
                loading="lazy"
              />
            </div>
            <button class="contact-button" @click="handleFacebook" title="Facebook">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button class="contact-button" @click="handleTelegram" title="Telegram">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
            </button>
            <button class="contact-button" @click="handlePhone" title="Phone">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </template>

    <!-- Skeleton Slot -->
    <template #skeleton>
      <LaptopCardSkeleton
        v-for="n in 8"
        :key="n"
      />
    </template>

    <!-- Card Slot -->
    <template #card="{ item, index }">
      <LaptopCard
        :key="`desktop-${item.id}`"
        :index="index"
        :laptop="item"
        detail-path="/desktop"
      />
    </template>
  </ProductListingLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import ProductListingLayout from '../components/common/ProductListingLayout.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import LaptopCard, { type LaptopCard as LaptopCardType } from '../components/common/LaptopCard.vue'
import LaptopCardSkeleton from '../components/common/LaptopCardSkeleton.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { BANNER_PAGES } from '../constants/bannerPages'
import { fetchDesktopCards, type DesktopCard, type DesktopFilters } from '../services/apiDesktop'
import type { PaginationLinks, PaginationMeta } from '../services/apiConfig'
import I30l3Image from '../assets/I30l3.gif'

const { t } = useI18n()
const carouselSlides = ref<Array<{ image: string; title?: string; content?: string }>>([])
const desktops = ref<LaptopCardType[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const paginationLinks = ref<PaginationLinks | null>(null)
const paginationMeta = ref<PaginationMeta | null>(null)

// Filter state - load from localStorage or use defaults
const loadFiltersFromStorage = (): DesktopFilters => {
  try {
    const saved = localStorage.getItem('desktopFilters')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        min_price: parsed.min_price ?? null,
        max_price: parsed.max_price ?? null,
      }
    }
  } catch (error) {
    console.error('Error loading filters from storage:', error)
  }
  return {
    min_price: null,
    max_price: null,
  }
}

const saveFiltersToStorage = (filters: DesktopFilters) => {
  try {
    localStorage.setItem('desktopFilters', JSON.stringify(filters))
  } catch (error) {
    console.error('Error saving filters to storage:', error)
  }
}

const savedFilters = loadFiltersFromStorage()
const minPrice = ref<number | null>(savedFilters.min_price ?? null)
const maxPrice = ref<number | null>(savedFilters.max_price ?? null)
const customBannerImage = ref<string>(I30l3Image)

const loadDesktops = async (page: number = 1) => {
  loading.value = true
  error.value = null
  currentPage.value = page

  try {
    const filters: DesktopFilters = {
      min_price: minPrice.value,
      max_price: maxPrice.value,
    }

    const result = await fetchDesktopCards(page, filters)
    
    // Convert DesktopCard to LaptopCardType (add in_stock default)
    desktops.value = result.data.map((desktop: DesktopCard) => ({
      ...desktop,
      in_stock: 1, // Default to in stock for desktops
    }))
    
    paginationLinks.value = result.links
    paginationMeta.value = result.meta
  } catch (err) {
    console.error('Error loading desktops:', err)
    error.value = t('desktop.error')
    desktops.value = []
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  // Save filters to localStorage
  saveFiltersToStorage({
    min_price: minPrice.value,
    max_price: maxPrice.value,
  })
  loadDesktops(1)
}

const resetFilters = () => {
  minPrice.value = null
  maxPrice.value = null
  // Save reset filters to localStorage
  saveFiltersToStorage({
    min_price: null,
    max_price: null,
  })
  loadDesktops(1)
}

const handlePageChange = (page: number) => {
  loadDesktops(page)
}

const handleFacebook = () => {
  // TODO: Implement Facebook contact logic
  console.log('Facebook button clicked')
  // window.open('https://facebook.com/your-page', '_blank')
}

const handleTelegram = () => {
  // TODO: Implement Telegram contact logic
  console.log('Telegram button clicked')
  // window.open('https://t.me/your-username', '_blank')
}

const handlePhone = () => {
  // TODO: Implement phone contact logic
  console.log('Phone button clicked')
  // window.location.href = 'tel:+1234567890'
}

const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.DESKTOP)
    
    // Map banners to carousel format
    carouselSlides.value = banners.map((banner: Banner) => ({
      image: banner.banner_image_url,
      title: `Banner ${banner.id}`,
      content: '',
      product_id: banner.product_id,
    }))
  } catch (err) {
    console.error('Error loading banners:', err)
  }
}

onMounted(() => {
  loadBanners()
  loadDesktops(1)
})
</script>

<style scoped>

/* Contact Buttons - Double Layer Neumorphic */
.contact-button {
  background: #e0e5ec;
  border: none;
  border-radius: 50%;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  padding: 0.5rem;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #5a6c7d;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.contact-button svg {
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease;
}

.contact-button:hover {
  transform: translateY(-3px);
  box-shadow: 6px 6px 8px rgba(207, 212, 219, 0.4), -6px -6px 8px rgba(249, 254, 255, 0.5);
}

.contact-button:hover svg {
  transform: scale(1.1);
}

.contact-button:active {
  transform: scale(0.95) translateY(-1px);
  box-shadow: 
    inset 4px 4px 5px rgba(207, 212, 219, 0.329),
    inset -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
}

/* Small Banner Container */
.small-banner-container {
  width: 180px;
  min-width: 120px;
  max-width: 220px;
  height: 45px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #e0e5ec;
  box-shadow: 4px 4px 5px rgba(207, 212, 219, 0.329), -4px -4px 5px rgba(249, 254, 255, 0.4689999999999999);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.small-banner-container:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 8px rgba(207, 212, 219, 0.4), -6px -6px 8px rgba(249, 254, 255, 0.5);
}

.small-banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* Responsive adjustments for filter section */
@media (max-width: 640px) {
  .small-banner-container {
    width: 140px;
    min-width: 100px;
    max-width: 160px;
    height: 40px;
  }
  
  .contact-button {
    width: 40px;
    height: 40px;
    padding: 0.45rem;
  }
  
  .contact-button svg {
    width: 20px;
    height: 20px;
  }
}

/* Tablet / iPad Portrait (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .small-banner-container {
    width: 160px;
    min-width: 140px;
    max-width: 180px;
    height: 42px;
  }
  
  .contact-button {
    width: 42px;
    height: 42px;
    padding: 0.5rem;
  }
  
  .contact-button svg {
    width: 21px;
    height: 21px;
  }
}

/* iPad Landscape / Small Laptop (1024px - 1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .small-banner-container {
    width: 180px;
    min-width: 160px;
    max-width: 200px;
    height: 45px;
  }
  
  .contact-button {
    width: 44px;
    height: 44px;
    padding: 0.5rem;
  }
  
  .contact-button svg {
    width: 22px;
    height: 22px;
  }
}

/* Large Laptop and Desktop (1280px+) */
@media (min-width: 1280px) {
  .small-banner-container {
    width: 200px;
    min-width: 180px;
    max-width: 220px;
    height: 45px;
  }
}

/* Additional responsive improvements for filter inputs */
@media (min-width: 768px) and (max-width: 1023px) {
  .neumorphic-input {
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
  }
}

@media (min-width: 1024px) and (max-width: 1279px) {
  .neumorphic-input {
    padding: 0.75rem 1.2rem;
    font-size: 0.95rem;
  }
}

/* Filter section improvements */
@media (max-width: 1023px) {
  .lg\:border-l {
    border-left: none !important;
    padding-left: 0 !important;
  }
}

/* Better spacing for filter labels */
label {
  margin-bottom: 0.75rem;
  display: block;
}
</style>
