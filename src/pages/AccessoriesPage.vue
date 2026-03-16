<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <HeroSection :slides="carouselSlides" />

    <!-- Filter Section -->
    <section class="py-6 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="neumorphic-card p-4 sm:p-6">
          <div class="flex flex-col gap-4">
            <!-- Mobile Layout: Price Range full width, then Brand/Type/Sort in 1 row -->
            <div class="flex flex-col gap-4 lg:hidden">
              <!-- Price Range - Full Width on Mobile -->
              <div class="space-y-2 min-w-0">
                <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.priceRange') }}</label>
                <div class="flex gap-2 items-center">
                  <input
                    v-model.number="filters.min_price"
                    type="number"
                    :placeholder="$t('accessories.filter.min')"
                    class="neumorphic-input flex-1 text-sm min-w-0"
                    min="0"
                  />
                  <span class="text-[#5a6c7d] flex-shrink-0">-</span>
                  <input
                    v-model.number="filters.max_price"
                    type="number"
                    :placeholder="$t('accessories.filter.max')"
                    class="neumorphic-input flex-1 text-sm min-w-0"
                    min="0"
                  />
                </div>
              </div>

              <!-- Brand, Type, Sort - 1 Row on Mobile -->
              <div class="grid grid-cols-3 gap-2">
                <!-- Brand Filter -->
                <div class="space-y-2 min-w-0">
                  <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.brand') }}</label>
                  <NeumorphicDropdown
                    v-model="filters.brand_id"
                    :options="brandOptions"
                    :placeholder="$t('accessories.filter.allBrands')"
                    option-value="value"
                    option-label="name"
                  />
                </div>

                <!-- Type Filter -->
                <div class="space-y-2 min-w-0">
                  <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.type') }}</label>
                  <NeumorphicDropdown
                    v-model="filters.type_accessary_id"
                    :options="typeOptions"
                    :placeholder="$t('accessories.filter.allTypes')"
                    option-value="value"
                    option-label="name"
                  />
                </div>

                <!-- Sort -->
                <div class="space-y-2 min-w-0">
                  <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.sort') }}</label>
                  <NeumorphicDropdown
                    v-model="filters.sort"
                    :options="sortOptions"
                    :placeholder="$t('accessories.filter.default')"
                    option-value="value"
                    option-label="name"
                  />
                </div>
              </div>
            </div>

            <!-- Large Screen Layout: All 4 filters in 1 row -->
            <div class="hidden lg:grid lg:grid-cols-4 gap-4">
              <!-- Price Range -->
              <div class="space-y-2 min-w-0">
                <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.priceRange') }}</label>
                <div class="flex gap-2 items-center">
                  <input
                    v-model.number="filters.min_price"
                    type="number"
                    :placeholder="$t('accessories.filter.min')"
                    class="neumorphic-input flex-1 text-sm min-w-0"
                    min="0"
                  />
                  <span class="text-[#5a6c7d] flex-shrink-0">-</span>
                  <input
                    v-model.number="filters.max_price"
                    type="number"
                    :placeholder="$t('accessories.filter.max')"
                    class="neumorphic-input flex-1 text-sm min-w-0"
                    min="0"
                  />
                </div>
              </div>

              <!-- Brand Filter -->
              <div class="space-y-2 min-w-0">
                <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.brand') }}</label>
                <NeumorphicDropdown
                  v-model="filters.brand_id"
                  :options="brandOptions"
                  :placeholder="$t('accessories.filter.allBrands')"
                  option-value="value"
                  option-label="name"
                />
              </div>

              <!-- Type Filter -->
              <div class="space-y-2 min-w-0">
                <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.type') }}</label>
                <NeumorphicDropdown
                  v-model="filters.type_accessary_id"
                  :options="typeOptions"
                  :placeholder="$t('accessories.filter.allTypes')"
                  option-value="value"
                  option-label="name"
                  :disabled="isLoadingTypes"
                />
              </div>

              <!-- Sort -->
              <div class="space-y-2 min-w-0">
                <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('accessories.filter.sort') }}</label>
                <NeumorphicDropdown
                  v-model="filters.sort"
                  :options="sortOptions"
                  :placeholder="$t('accessories.filter.default')"
                  option-value="value"
                  option-label="name"
                />
              </div>
            </div>

            <!-- Filter Actions -->
            <div class="flex items-end gap-2 min-w-0">
              <NeumorphicButton
                @click="applyFilters"
                class="flex-1"
              >
                {{ $t('accessories.filter.apply') }}
              </NeumorphicButton>
              <NeumorphicButton
                @click="resetFilters"
                class="flex-1"
              >
                {{ $t('accessories.filter.reset') }}
              </NeumorphicButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Page Content -->
    <div class="pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <LaptopCardSkeleton
            v-for="n in 8"
            :key="n"
          />
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <NeumorphicButton @click="() => loadAccessoriesByType()">
            {{ $t('brand.retry') }}
          </NeumorphicButton>
        </div>

        <!-- Accessory Cards by Type -->
        <div v-else-if="accessoryTypes.length > 0" class="space-y-12">
          <template
            v-for="type in (filters.type_accessary_id ? accessoryTypes.filter(t => t.id === filters.type_accessary_id) : accessoryTypes)"
            :key="type.id"
          >
            <div
              :ref="(el) => setSectionRef(el, type.id)"
              class="accessory-type-section"
              :class="{ 'accessory-type-section-empty': !loadingTypes.has(type.id) && (!accessoriesByType.has(type.id) || accessoriesByType.get(type.id)!.length === 0) }"
            >
              <!-- Type Heading -->
              <h2 
                v-show="loadingTypes.has(type.id) || (accessoriesByType.has(type.id) && accessoriesByType.get(type.id)!.length > 0)"
                class="text-2xl md:text-3xl font-bold text-[#5a6c7d] mb-6"
              >
                {{ type.name }}
              </h2>
            
            <!-- Loading State for this Type -->
            <div v-if="loadingTypes.has(type.id)" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <LaptopCardSkeleton
                v-for="n in 4"
                :key="n"
              />
            </div>
            
            <!-- Cards Grid for this Type -->
            <div v-else-if="accessoriesByType.get(type.id) && accessoriesByType.get(type.id)!.length > 0" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <LaptopCard
                v-for="(accessory, index) in accessoriesByType.get(type.id)!"
                :key="`accessory-${accessory.id}-${index}`"
                :index="index"
                :laptop="{
                  id: accessory.id,
                  name: accessory.name,
                  image: accessory.image || '',
                  price: accessory.price,
                  discount_price: accessory.discount_price,
                  in_stock: 1
                }"
                :detail-path="accessory.id ? `/accessory/${accessory.id}` : '#'"
              />
            </div>
            </div>
          </template>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="text-[#5a6c7d] text-lg">{{ $t('accessories.empty') }}</div>
        </div>

      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import HeroSection from '../components/common/HeroSection.vue'
import Footer from '../components/layout/Footer.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import NeumorphicDropdown from '../components/common/Neumorphic/NeumorphicDropdown.vue'
import LaptopCard from '../components/common/LaptopCard.vue'
import LaptopCardSkeleton from '../components/common/LaptopCardSkeleton.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { fetchBrands, type Brand as ApiBrand } from '../services/apiBrand'
import { BANNER_PAGES } from '../constants/bannerPages'
import { fetchAccessoryCards, fetchAccessoryTypes, type AccessoryFilters, type DropdownOption } from '../services/apiAccessory'

interface Brand {
  value: number
  name: string
}

const { t } = useI18n()
const carouselSlides = ref<Array<{ image: string; title?: string; content?: string }>>([])
const accessoriesByType = ref<Map<number, Array<{ id: number; name: string; price: string; discount_price?: string | null; image?: string }>>>(new Map())
const loading = ref(true)
const loadingTypes = ref<Set<number>>(new Set())
const error = ref<string | null>(null)
const accessoryTypes = ref<DropdownOption[]>([])
const isLoadingTypes = ref(false)
const loadedTypes = ref<Set<number>>(new Set())
const preloadingTypes = ref<Set<number>>(new Set())
const sectionRefs = ref<Map<number, HTMLElement>>(new Map())
let intersectionObserver: IntersectionObserver | null = null

// Filter state - load from localStorage or use defaults
const loadFiltersFromStorage = (): AccessoryFilters => {
  try {
    const saved = localStorage.getItem('accessoryFilters')
    if (saved) {
      const parsed = JSON.parse(saved)
      return {
        page: 1,
        min_price: parsed.min_price ?? null,
        max_price: parsed.max_price ?? null,
        brand_id: parsed.brand_id ?? null,
        type_accessary_id: parsed.type_accessary_id ?? null,
        sort: parsed.sort ?? null,
      }
    }
  } catch (error) {
    console.error('Error loading filters from storage:', error)
  }
  return {
    page: 1,
    min_price: null,
    max_price: null,
    brand_id: null,
    type_accessary_id: null,
    sort: null,
  }
}

const saveFiltersToStorage = (filters: AccessoryFilters) => {
  try {
    localStorage.setItem('accessoryFilters', JSON.stringify(filters))
  } catch (error) {
    console.error('Error saving filters to storage:', error)
  }
}

const filters = ref<AccessoryFilters>(loadFiltersFromStorage())

// Available brands loaded from API
const availableBrands = ref<Brand[]>([])

// Computed options for dropdowns
const brandOptions = computed(() => {
  return [
    { value: null, name: t('accessories.filter.allBrands') },
    ...availableBrands.value.map(brand => ({ value: brand.value, name: brand.name }))
  ]
})

const typeOptions = computed(() => {
  return [
    { value: null, name: 'All Types' },
    ...accessoryTypes.value.map(type => ({ value: type.id, name: type.name }))
  ]
})

const sortOptions = computed(() => [
  { value: null, name: t('accessories.filter.default') },
  { value: 'price_asc', name: 'Price: Low to High' },
  { value: 'price_desc', name: 'Price: High to Low' },
  { value: 'name_asc', name: 'Name: A to Z' },
  { value: 'name_desc', name: 'Name: Z to A' },
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

const loadAccessoryTypes = async () => {
  try {
    isLoadingTypes.value = true
    accessoryTypes.value = await fetchAccessoryTypes()
  } catch (error) {
    console.error('Error loading accessory types:', error)
    accessoryTypes.value = []
  } finally {
    isLoadingTypes.value = false
  }
}

const loadAccessoriesForType = async (typeId: number, useFilterType: boolean = false) => {
  if (loadedTypes.value.has(typeId) || loadingTypes.value.has(typeId)) {
    return
  }

  loadingTypes.value.add(typeId)
  try {
    const filtersToSend = {
      ...filters.value,
      page: 1,
    }
    
    // If useFilterType is false (loading all types), override with the specific typeId
    // If useFilterType is true (type filter is selected), use the filter's type_accessary_id
    if (!useFilterType) {
      filtersToSend.type_accessary_id = typeId
    }
    const response = await fetchAccessoryCards(1, filtersToSend)
    if (response.data.length > 0) {
      accessoriesByType.value.set(typeId, response.data.map((card) => ({
        id: card.id,
        name: card.name,
        price: card.price,
        discount_price: card.discount_price,
        image: card.image,
      })))
      
      // Preload the next section only if current section is visible (to prevent cascading)
      const currentSection = sectionRefs.value.get(typeId)
      if (currentSection) {
        const rect = currentSection.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight + 300 && rect.bottom > -300
        
        if (isVisible) {
          const currentIndex = accessoryTypes.value.findIndex(t => t.id === typeId)
          if (currentIndex >= 0 && currentIndex < accessoryTypes.value.length - 1) {
            const nextType = accessoryTypes.value[currentIndex + 1]
            if (nextType && 
                !loadedTypes.value.has(nextType.id) && 
                !loadingTypes.value.has(nextType.id) &&
                !preloadingTypes.value.has(nextType.id)) {
              // Mark as preloading to prevent duplicate preloads
              preloadingTypes.value.add(nextType.id)
              // Load next section in background without blocking
              loadAccessoriesForType(nextType.id, false).finally(() => {
                preloadingTypes.value.delete(nextType.id)
              }).catch(err => {
                console.error(`Error preloading next section ${nextType.id}:`, err)
              })
            }
          }
        }
      }
    }
    // Mark as loaded even if empty, to prevent repeated attempts
    loadedTypes.value.add(typeId)
  } catch (err) {
    console.error(`Error loading accessories for type ${typeId}:`, err)
  } finally {
    loadingTypes.value.delete(typeId)
  }
}

const setSectionRef = (el: any, typeId: number) => {
  if (el) {
    sectionRefs.value.set(typeId, el)
    if (intersectionObserver) {
      intersectionObserver.observe(el)
    } else {
      setupIntersectionObserver()
    }
  }
}

const setupIntersectionObserver = () => {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return
  }

  if (intersectionObserver) {
    return
  }

  intersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const typeId = Array.from(sectionRefs.value.entries()).find(
            ([_, el]) => el === entry.target
          )?.[0]
          
          if (typeId && !loadedTypes.value.has(typeId) && !loadingTypes.value.has(typeId)) {
            loadAccessoriesForType(typeId)
          }
        }
      })
    },
    {
      rootMargin: '300px',
      threshold: 0.01,
    }
  )

  nextTick(() => {
    sectionRefs.value.forEach((el) => {
      if (el && intersectionObserver) {
        intersectionObserver.observe(el)
      }
    })
  })
}

const loadAccessoriesByType = async () => {
  loading.value = true
  error.value = null
  accessoriesByType.value.clear()
  loadedTypes.value.clear()
  preloadingTypes.value.clear()
  sectionRefs.value.clear()
  
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
  
  try {
    if (filters.value.type_accessary_id) {
      // Type filter is selected - load only that type, no infinite scroll
      await loadAccessoriesForType(filters.value.type_accessary_id, true)
    } else {
      // No type filter - load all types with infinite scroll
      if (accessoryTypes.value.length > 0 && accessoryTypes.value[0]) {
        await loadAccessoriesForType(accessoryTypes.value[0].id, false)
        await nextTick()
        await new Promise(resolve => setTimeout(resolve, 200))
        setupIntersectionObserver()
      }
    }
  } catch (err) {
    console.error('Error loading accessories:', err)
    error.value = t('accessories.error')
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  saveFiltersToStorage(filters.value)
  loadAccessoriesByType()
}

const resetFilters = () => {
  filters.value = {
    page: 1,
    min_price: null,
    max_price: null,
    brand_id: null,
    type_accessary_id: null,
    sort: null,
  }
  saveFiltersToStorage(filters.value)
  loadAccessoriesByType()
}


const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.ACCESSORIES)
    
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

const route = useRoute()

onMounted(async () => {
  loadBanners()
  loadBrands()
  
  // Check for brand_id filter from query parameter
  const brandIdFromQuery = route.query.brand_id
  if (brandIdFromQuery) {
    const brandId = Number(brandIdFromQuery)
    if (!isNaN(brandId)) {
      filters.value.brand_id = brandId
      saveFiltersToStorage(filters.value)
    }
  }
  
  await loadAccessoryTypes()
  await loadAccessoriesByType()
})

// Watch for query parameter changes
watch(() => route.query.brand_id, (newBrandId) => {
  if (newBrandId) {
    const brandId = Number(newBrandId)
    if (!isNaN(brandId) && filters.value.brand_id !== brandId) {
      filters.value.brand_id = brandId
      saveFiltersToStorage(filters.value)
      loadAccessoriesByType()
    }
  }
})

onUnmounted(() => {
  if (intersectionObserver) {
    intersectionObserver.disconnect()
    intersectionObserver = null
  }
})
</script>

<style scoped>
.neumorphic-input {
  background: #e0e5ec;
  border: none;
  border-radius: 20px;
  padding: 0.75rem 1rem;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  color: #5a6c7d;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  width: 100%;
}

.neumorphic-input:focus {
  outline: none;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
}

select.neumorphic-input:focus {
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
}

select.neumorphic-input:active {
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
}

.neumorphic-input::placeholder {
  color: #8a9ba8;
}

select.neumorphic-input {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%235a6c7d' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  padding-right: 2.5rem;
}

.neumorphic-button {
  background: #e0e5ec;
  border: none;
  border-radius: 20px;
  padding: 0.75rem 1.5rem;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  color: #5a6c7d;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.neumorphic-button:hover {
  transform: translateY(-2px);
}

.neumorphic-button:active {
  transform: scale(0.98);
}

.accessory-type-section-empty {
  padding: 0;
  margin: 0;
  min-height: 1px;
  height: 1px;
  overflow: hidden;
}

.neumorphic-card {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
}

</style>
