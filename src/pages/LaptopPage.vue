<template>
  <ProductListingLayout
    :carousel-slides="carouselSlides"
    :loading="loading"
    :error="error"
    :items="laptops"
    :empty-message="$t('laptop.empty')"
    :pagination-links="paginationLinks"
    :pagination-meta="paginationMeta"
    @retry="() => loadLaptops(1)"
    @page-change="handlePageChange"
  >
    <!-- Filter Section Slot -->
    <template #filters>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <!-- Price Range -->
        <div class="space-y-2 min-w-0">
          <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('laptop.filter.priceRange') }}</label>
          <div class="flex gap-2 items-center">
            <input
              v-model.number="filters.min_price"
              type="number"
              :placeholder="$t('laptop.filter.minPrice')"
              class="neumorphic-input flex-1 text-sm min-w-0"
              min="0"
            />
            <span class="text-[#5a6c7d] flex-shrink-0">-</span>
            <input
              v-model.number="filters.max_price"
              type="number"
              :placeholder="$t('laptop.filter.maxPrice')"
              class="neumorphic-input flex-1 text-sm min-w-0"
              min="0"
            />
          </div>
        </div>

        <!-- Brand Filter -->
        <div class="space-y-2 min-w-0">
          <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('laptop.filter.brand') }}</label>
          <NeumorphicDropdown
            v-model="filters.brand"
            :options="brandOptions"
            :placeholder="$t('laptop.filter.allBrands')"
            option-value="value"
            option-label="name"
          />
        </div>

        <!-- Laptop Type Filter -->
        <div class="space-y-2 min-w-0">
          <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('laptop.filter.laptopType') }}</label>
          <NeumorphicDropdown
            v-model="filters.is_gaming"
            :options="laptopTypeOptions"
            :placeholder="$t('laptop.filter.allTypes')"
            option-value="value"
            option-label="name"
          />
        </div>

        <!-- Sort -->
        <div class="space-y-2 min-w-0">
          <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('laptop.filter.sort') }}</label>
          <NeumorphicDropdown
            v-model="filters.sort"
            :options="sortOptions"
            :placeholder="$t('laptop.filter.default')"
            option-value="value"
            option-label="name"
          />
        </div>

        <!-- Filter Actions -->
        <div class="flex items-end gap-2 min-w-0">
          <NeumorphicButton
            @click="applyFilters"
            class="flex-1"
          >
            {{ $t('laptop.filter.apply') }}
          </NeumorphicButton>
          <NeumorphicButton
            @click="resetFilters"
            class="flex-1"
          >
            {{ $t('laptop.filter.reset') }}
          </NeumorphicButton>
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
        :key="`laptop-${item.name}-${item.image}`"
        :index="index"
        :laptop="item"
      />
    </template>
  </ProductListingLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductListingLayout from '../components/common/ProductListingLayout.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import NeumorphicDropdown from '../components/common/Neumorphic/NeumorphicDropdown.vue'
import LaptopCard, { type LaptopCard as LaptopCardType } from '../components/common/LaptopCard.vue'
import LaptopCardSkeleton from '../components/common/LaptopCardSkeleton.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { fetchBrands, type Brand as ApiBrand } from '../services/apiBrand'
import { BANNER_PAGES } from '../constants/bannerPages'
import { fetchLaptopCards, type LaptopFilters } from '../services/apiLaptop'
import type { PaginationLinks, PaginationMeta } from '../services/apiConfig'

interface Brand {
  value: number
  name: string
}

const route = useRoute()
const { t } = useI18n()

const carouselSlides = ref<Array<{ image: string; title?: string; content?: string }>>([])
const laptops = ref<LaptopCardType[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const currentPage = ref(1)
const paginationLinks = ref<PaginationLinks | null>(null)
const paginationMeta = ref<PaginationMeta | null>(null)

// Filter state - load from localStorage or use defaults
const loadFiltersFromStorage = (): LaptopFilters => {
  try {
    const saved = localStorage.getItem('laptopFilters')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        min_price: parsed.min_price ?? null,
        max_price: parsed.max_price ?? null,
        brand: parsed.brand ?? null,
        is_gaming: parsed.is_gaming ?? null,
        sort: parsed.sort ?? null,
      }
    }
  } catch (error) {
    console.error('Error loading filters from storage:', error)
  }
  return {
    min_price: null,
    max_price: null,
    brand: null,
    is_gaming: null,
    sort: null,
  }
}

const saveFiltersToStorage = (filters: LaptopFilters) => {
  try {
    localStorage.setItem('laptopFilters', JSON.stringify(filters))
  } catch (error) {
    console.error('Error saving filters to storage:', error)
  }
}

const filters = ref<LaptopFilters>(loadFiltersFromStorage())

// Available brands loaded from API
const availableBrands = ref<Brand[]>([])

// Computed options for dropdowns
const brandOptions = computed(() => {
  const brands = availableBrands.value.map(brand => ({
    value: brand.value,
    name: brand.name,
  }))
  return [{ value: null, name: t('laptop.filter.allBrands') }, ...brands]
})

const laptopTypeOptions = computed(() => [
  { value: 1, name: t('laptop.filter.gamingLaptop') },
  { value: 0, name: t('laptop.filter.laptop') },
])

const sortOptions = computed(() => [
  { value: 'price_asc', name: t('laptop.filter.priceLowToHigh') },
  { value: 'price_desc', name: t('laptop.filter.priceHighToLow') },
  { value: 'name_asc', name: t('laptop.filter.nameAtoZ') },
  { value: 'name_desc', name: t('laptop.filter.nameZtoA') },
])

const loadBrands = async () => {
  try {
    const apiBrands = await fetchBrands()
    // Map API brands to the format expected by the filter (id -> value)
    availableBrands.value = apiBrands.map((brand: ApiBrand) => ({
      value: brand.id,
      name: brand.name,
    }))
  } catch (error) {
    console.error('Error loading brands:', error)
    availableBrands.value = []
  }
}

const loadLaptops = async (page: number = 1) => {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetchLaptopCards(page, filters.value)
    laptops.value = response.data
    paginationLinks.value = response.links
    paginationMeta.value = response.meta
    currentPage.value = page
  } catch (err) {
    console.error('Error loading laptops:', err)
    error.value = t('laptop.error')
    laptops.value = []
    paginationLinks.value = null
    paginationMeta.value = null
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  saveFiltersToStorage(filters.value)
  currentPage.value = 1
  loadLaptops(1)
}

const resetFilters = () => {
  filters.value = {
    min_price: null,
    max_price: null,
    brand: null,
    is_gaming: null,
    sort: null,
  }
  saveFiltersToStorage(filters.value)
  currentPage.value = 1
  loadLaptops(1)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  loadLaptops(page)
  // Scroll to top of page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.LAPTOP)
    
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
  loadBrands()
  
  // Check for brand filter from query parameter
  const brandFromQuery = route.query.brand
  if (brandFromQuery) {
    const brandId = Number(brandFromQuery)
    if (!isNaN(brandId)) {
      filters.value.brand = brandId
      saveFiltersToStorage(filters.value)
    }
  }
  
  // Load laptops with saved filters on mount
  loadLaptops(1)
})

// Watch for query parameter changes
watch(() => route.query.brand, (newBrand) => {
  if (newBrand) {
    const brandId = Number(newBrand)
    if (!isNaN(brandId) && filters.value.brand !== brandId) {
      filters.value.brand = brandId
      saveFiltersToStorage(filters.value)
      currentPage.value = 1
      loadLaptops(1)
    }
  }
})
</script>

