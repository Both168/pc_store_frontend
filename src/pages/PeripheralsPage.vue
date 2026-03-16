<template>
  <ProductListingLayout
    :carousel-slides="carouselSlides"
    :loading="currentLoading"
    :error="currentError"
    :items="currentItems"
    :empty-message="$t('peripherals.empty')"
    :pagination-links="currentPaginationLinks"
    :pagination-meta="currentPaginationMeta"
    @retry="handleRetry"
    @page-change="handlePageChange"
  >
    <!-- Filter Section Slot (includes Tabs and Filters) -->
    <template #filters>
      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 sm:gap-3 mb-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          class="neumorphic-button px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium transition-all whitespace-nowrap flex items-center justify-center"
          :class="{
            'active-tab': activeTab === tab.id,
            'inactive-tab': activeTab !== tab.id
          }"
        >
          <!-- Icon (Mobile only) -->
          <img
            v-if="getTabIcon(tab.id)"
            :src="getTabIcon(tab.id)"
            :alt="tab.label"
            class="w-8 h-8 md:hidden object-contain"
          />
          <!-- Label (Desktop only) -->
          <span class="hidden md:inline">{{ tab.label }}</span>
        </button>
      </div>

      <!-- Filter Section -->
      <div class="mb-6 pb-6 border-b border-[#5a6c7d] border-opacity-20">
        <div>
          <!-- Monitor Filters -->
          <MonitorFilter
            v-if="activeTab === 'monitor_tab' && filters[activeTab]"
            :model-value="filters[activeTab] as MonitorFilters"
            @update:model-value="(value) => { if (filters[activeTab]) filters[activeTab] = value }"
          />
          <!-- Peripheral Filters -->
          <PeripheralFilter
            v-else-if="filters[activeTab]"
            :model-value="filters[activeTab]!"
            @update:model-value="(value) => { if (filters[activeTab]) filters[activeTab] = value }"
          />

          <!-- Apply and Reset Buttons -->
          <div class="flex items-end gap-2 mt-4">
            <NeumorphicButton
              @click="applyFilters"
              class="flex-1"
            >
              {{ $t('peripherals.apply') }}
            </NeumorphicButton>
            <NeumorphicButton
              @click="resetFilters"
              class="flex-1"
            >
              {{ $t('peripherals.reset') }}
            </NeumorphicButton>
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
        :key="`${activeTab}-${item.id || item.name}`"
        :index="index"
        :laptop="{
          id: item.id,
          name: item.name,
          image: item.image || '',
          price: item.price,
          discount_price: item.discount_price,
          in_stock: 1
        }"
        :detail-path="item.id ? getCardDetailRoute(item.id) : '#'"
      />
    </template>
  </ProductListingLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductListingLayout from '../components/common/ProductListingLayout.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import LaptopCard from '../components/common/LaptopCard.vue'
import LaptopCardSkeleton from '../components/common/LaptopCardSkeleton.vue'
import type { PaginationLinks, PaginationMeta } from '../services/apiConfig'
import PeripheralFilter from '../components/peripheral_filter/PeripheralFilter.vue'
import MonitorFilter, { type MonitorFilters } from '../components/peripheral_filter/MonitorFilter.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { BANNER_PAGES } from '../constants/bannerPages'
import { fetchPeripheralCards, type PeripheralCard } from '../services/apiPeripheral'
import mouseIcon from '../assets/icons/peripheral/mouse.png'
import keyboardIcon from '../assets/icons/peripheral/keyboard.png'
import headsetIcon from '../assets/icons/peripheral/headset.png'
import speakerIcon from '../assets/icons/peripheral/speaker.png'
import monitorIcon from '../assets/icons/peripheral/monitor.png'
import mousepadIcon from '../assets/icons/peripheral/mousepad.png'
import webcamIcon from '../assets/icons/peripheral/webcam.png'
import micIcon from '../assets/icons/peripheral/mic.png'
import controllerIcon from '../assets/icons/peripheral/controller.png'

interface PeripheralFilters {
  min_price: number | null
  max_price: number | null
  brand: number | null
  sort: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

type FilterType = PeripheralFilters | MonitorFilters

interface PeripheralCardData {
  id?: number
  name: string
  price: string
  discount_price?: string | null
  image?: string
}

interface Tab {
  id: string
  label: string
}

const carouselSlides = ref<Array<{ image: string; title?: string; content?: string }>>([])
const activeTab = ref<string>('mice_tab')

const tabs: Tab[] = [
  { id: 'mice_tab', label: 'Mouse' },
  { id: 'keyboard_tab', label: 'Keyboard' },
  { id: 'headset_tab', label: 'Headphones' },
  { id: 'speaker_tab', label: 'Speaker' },
  { id: 'monitor_tab', label: 'Monitor' },
  { id: 'mousepad_tab', label: 'Mouse Pad' },
  { id: 'webcams_tab', label: 'Webcam' },
  { id: 'mic_tab', label: 'Microphone' },
  { id: 'controller_tab', label: 'Controller' },
]

const peripheralCards = ref<Record<string, PeripheralCardData[]>>({
  mice_tab: [],
  keyboard_tab: [],
  headset_tab: [],
  speaker_tab: [],
  monitor_tab: [],
  mousepad_tab: [],
  webcams_tab: [],
  mic_tab: [],
  controller_tab: [],
})

const isLoadingStates = ref<Record<string, boolean>>({
  mice_tab: false,
  keyboard_tab: false,
  headset_tab: false,
  speaker_tab: false,
  monitor_tab: false,
  mousepad_tab: false,
  webcams_tab: false,
  mic_tab: false,
  controller_tab: false,
})

const pagination = ref<Record<string, {
  current_page: number
  per_page: number
  total: number
  last_page: number
}>>({})

tabs.forEach(tab => {
  pagination.value[tab.id] = {
    current_page: 1,
    per_page: 24,
    total: 0,
    last_page: 1,
  }
})

const defaultFilters: Record<string, FilterType> = {}
tabs.forEach(tab => {
  if (tab.id === 'monitor_tab') {
    defaultFilters[tab.id] = {
      min_price: null,
      max_price: null,
      brand: null,
      size: null,
      form_factor: null,
      panel_type: null,
      resolution: null,
      refresh_rate: null,
      response_time: null,
      stand: null,
      is_build_in_speaker: null,
      sort: null,
    } as MonitorFilters
  } else {
    defaultFilters[tab.id] = {
      min_price: null,
      max_price: null,
      brand: null,
      sort: null,
    } as PeripheralFilters
  }
})

const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem('peripheralFilters')
    if (saved) {
      const parsed = JSON.parse(saved)
      const loaded: Record<string, FilterType> = {}
      tabs.forEach(tab => {
        loaded[tab.id] = { ...defaultFilters[tab.id], ...(parsed[tab.id] || {}) }
      })
      return loaded
    }
  } catch (error) {
    console.error('Error loading filters from storage:', error)
  }
  return defaultFilters
}

const saveFiltersToStorage = (filters: Record<string, FilterType>) => {
  try {
    localStorage.setItem('peripheralFilters', JSON.stringify(filters))
  } catch (error) {
    console.error('Error saving filters to storage:', error)
  }
}

const filters = ref<Record<string, FilterType>>(loadFiltersFromStorage())

const getTabType = (tabId: string): string => {
  return tabId.replace('_tab', '')
}

const getTabIcon = (tabId: string): string | undefined => {
  const icons: Record<string, string> = {
    'mice_tab': mouseIcon,
    'keyboard_tab': keyboardIcon,
    'headset_tab': headsetIcon,
    'speaker_tab': speakerIcon,
    'monitor_tab': monitorIcon,
    'mousepad_tab': mousepadIcon,
    'webcams_tab': webcamIcon,
    'mic_tab': micIcon,
    'controller_tab': controllerIcon,
  }
  return icons[tabId]
}

const applyFilters = async () => {
  saveFiltersToStorage(filters.value)
  
  const tabType = getTabType(activeTab.value)
  const currentTab = activeTab.value
  if (pagination.value[currentTab]) {
    pagination.value[currentTab].current_page = 1
  }
  await loadPeripheralCards(tabType)
}

const resetFilters = () => {
  const currentTab = activeTab.value
  if (filters.value[currentTab] && defaultFilters[currentTab]) {
    if (currentTab === 'monitor_tab') {
      filters.value[currentTab] = {
        min_price: null,
        max_price: null,
        brand: null,
        size: null,
        form_factor: null,
        panel_type: null,
        resolution: null,
        refresh_rate: null,
        response_time: null,
        stand: null,
        is_build_in_speaker: null,
        sort: null,
      } as MonitorFilters
    } else {
      filters.value[currentTab] = {
        min_price: null,
        max_price: null,
        brand: null,
        sort: null,
      } as PeripheralFilters
    }
  }
  
  saveFiltersToStorage(filters.value)
  applyFilters()
}

const getCurrentTabCards = (): PeripheralCardData[] => {
  return peripheralCards.value[activeTab.value] || []
}

const getCardDetailRoute = (cardId: number): string => {
  if (activeTab.value === 'mice_tab') {
    return `/peripheral/mouse/${cardId}`
  } else if (activeTab.value === 'keyboard_tab') {
    return `/peripheral/keyboard/${cardId}`
  } else if (activeTab.value === 'headset_tab') {
    return `/peripheral/headset/${cardId}`
  } else if (activeTab.value === 'speaker_tab') {
    return `/peripheral/speaker/${cardId}`
  } else if (activeTab.value === 'monitor_tab') {
    return `/peripheral/monitor/${cardId}`
  } else if (activeTab.value === 'mousepad_tab') {
    return `/peripheral/mousepad/${cardId}`
  } else if (activeTab.value === 'webcams_tab') {
    return `/peripheral/webcam/${cardId}`
  } else if (activeTab.value === 'mic_tab') {
    return `/peripheral/microphone/${cardId}`
  } else if (activeTab.value === 'controller_tab') {
    return `/peripheral/controller/${cardId}`
  }
  return '#'
}

const getCurrentLoadingState = (): boolean => {
  return isLoadingStates.value[activeTab.value] || false
}

const getCurrentPagination = () => {
  return pagination.value[activeTab.value] || { current_page: 1, per_page: 24, total: 0, last_page: 1 }
}

const convertPaginationToLinks = (pagination: { current_page: number; last_page: number }): PaginationLinks => {
  return {
    first: pagination.current_page === 1 ? null : '?page=1',
    last: pagination.current_page === pagination.last_page ? null : `?page=${pagination.last_page}`,
    prev: pagination.current_page <= 1 ? null : `?page=${pagination.current_page - 1}`,
    next: pagination.current_page >= pagination.last_page ? null : `?page=${pagination.current_page + 1}`,
  }
}

const convertPaginationToMeta = (pagination: { current_page: number; per_page: number; total: number; last_page: number }): PaginationMeta => {
  const from = (pagination.current_page - 1) * pagination.per_page + 1
  const to = Math.min(pagination.current_page * pagination.per_page, pagination.total)
  return {
    current_page: pagination.current_page,
    last_page: pagination.last_page,
    per_page: pagination.per_page,
    from: pagination.total > 0 ? from : 0,
    to: pagination.total > 0 ? to : 0,
    total: pagination.total,
  }
}

const currentLoading = computed(() => getCurrentLoadingState())
const currentError = computed(() => null)
const currentItems = computed(() => getCurrentTabCards())
const currentPaginationLinks = computed(() => convertPaginationToLinks(getCurrentPagination()))
const currentPaginationMeta = computed(() => convertPaginationToMeta(getCurrentPagination()))

const handleRetry = () => {
  applyFilters()
}

const handlePageChange = (page: number) => {
  const currentTab = activeTab.value
  if (pagination.value[currentTab]) {
    pagination.value[currentTab].current_page = page
  }
  const tabType = getTabType(currentTab)
  loadPeripheralCards(tabType)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.PERIPHERAL)
    
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

const loadPeripheralCards = async (type: string) => {
  const currentTab = activeTab.value
  if (!pagination.value[currentTab] || !filters.value[currentTab]) {
    return
  }
  
  try {
    isLoadingStates.value[currentTab] = true
    
    const currentFilters = filters.value[currentTab]
    const apiFilters: any = {
      page: pagination.value[currentTab].current_page,
    }
    
    if (currentFilters.min_price !== null && currentFilters.min_price !== undefined) {
      apiFilters.min_price = currentFilters.min_price
    }
    if (currentFilters.max_price !== null && currentFilters.max_price !== undefined) {
      apiFilters.max_price = currentFilters.max_price
    }
    // Handle brand conversion (UI uses 'brand', API uses 'brand_id')
    if ('brand' in currentFilters && currentFilters.brand !== null && currentFilters.brand !== undefined) {
      apiFilters.brand_id = currentFilters.brand
    } else if ('brand_id' in currentFilters && currentFilters.brand_id !== null && currentFilters.brand_id !== undefined) {
      apiFilters.brand_id = currentFilters.brand_id
    }
    if (currentFilters.sort !== null && currentFilters.sort !== undefined) {
      apiFilters.sort = currentFilters.sort
    }
    
    // Add monitor-specific filters
    if (currentTab === 'monitor_tab' && 'size' in currentFilters) {
      const monitorFilters = currentFilters as MonitorFilters
      if (monitorFilters.size !== null && monitorFilters.size !== undefined) {
        apiFilters.size = monitorFilters.size
      }
      if (monitorFilters.form_factor !== null && monitorFilters.form_factor !== undefined) {
        apiFilters.form_factor = monitorFilters.form_factor
      }
      if (monitorFilters.panel_type !== null && monitorFilters.panel_type !== undefined) {
        apiFilters.panel_type = monitorFilters.panel_type
      }
      if (monitorFilters.resolution !== null && monitorFilters.resolution !== undefined) {
        apiFilters.resolution = monitorFilters.resolution
      }
      if (monitorFilters.refresh_rate !== null && monitorFilters.refresh_rate !== undefined) {
        apiFilters.refresh_rate = monitorFilters.refresh_rate
      }
      if (monitorFilters.response_time !== null && monitorFilters.response_time !== undefined) {
        apiFilters.response_time = monitorFilters.response_time
      }
      if (monitorFilters.stand !== null && monitorFilters.stand !== undefined) {
        apiFilters.stand = monitorFilters.stand
      }
      if (monitorFilters.is_build_in_speaker !== null && monitorFilters.is_build_in_speaker !== undefined) {
        apiFilters.is_build_in_speaker = monitorFilters.is_build_in_speaker
      }
    }
    
    const result = await fetchPeripheralCards(type, apiFilters)
    peripheralCards.value[currentTab] = result.data.map((card: PeripheralCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    pagination.value[currentTab] = {
      current_page: result.meta.current_page,
      per_page: result.meta.per_page,
      total: result.meta.total,
      last_page: result.meta.last_page,
    }
  } catch (err) {
    console.error(`Error loading ${type} cards:`, err)
  } finally {
    isLoadingStates.value[currentTab] = false
  }
}

const route = useRoute()

// Map route paths to tab IDs
const getTabFromRoute = (path: string): string => {
  if (path.includes('/peripheral/mouse')) return 'mice_tab'
  if (path.includes('/peripheral/keyboard')) return 'keyboard_tab'
  if (path.includes('/peripheral/headset')) return 'headset_tab'
  if (path.includes('/peripheral/speaker')) return 'speaker_tab'
  if (path.includes('/peripheral/monitor')) return 'monitor_tab'
  if (path.includes('/peripheral/mousepad')) return 'mousepad_tab'
  if (path.includes('/peripheral/webcam')) return 'webcams_tab'
  if (path.includes('/peripheral/microphone')) return 'mic_tab'
  if (path.includes('/peripheral/controller')) return 'controller_tab'
  return 'mice_tab' // default
}

watch(activeTab, (newTab) => {
  const tabType = getTabType(newTab)
  loadPeripheralCards(tabType)
})

onMounted(() => {
  loadBanners()
  
  // Set active tab based on route
  const tabFromRoute = getTabFromRoute(route.path)
  activeTab.value = tabFromRoute
  
  // Check for brand_id filter from query parameter
  const brandIdFromQuery = route.query.brand_id
  if (brandIdFromQuery) {
    const brandId = Number(brandIdFromQuery)
    if (!isNaN(brandId)) {
      // Apply brand filter to all peripheral filters
      tabs.forEach(tab => {
        const filter = filters.value[tab.id]
        if (filter) {
          if ('brand' in filter) {
            (filter as any).brand = brandId
          }
        }
      })
      saveFiltersToStorage(filters.value)
    }
  }
  
  const tabType = getTabType(activeTab.value)
  loadPeripheralCards(tabType)
})

// Watch for route changes
watch(() => route.path, (newPath) => {
  const tabFromRoute = getTabFromRoute(newPath)
  if (activeTab.value !== tabFromRoute) {
    activeTab.value = tabFromRoute
    const tabType = getTabType(activeTab.value)
    loadPeripheralCards(tabType)
  }
})

// Watch for query parameter changes
watch(() => route.query.brand_id, (newBrandId) => {
  if (newBrandId) {
    const brandId = Number(newBrandId)
    if (!isNaN(brandId)) {
      // Apply brand filter to all peripheral filters
      tabs.forEach(tab => {
        const filter = filters.value[tab.id]
        if (filter) {
          if ('brand' in filter) {
            (filter as any).brand = brandId
          }
        }
      })
      saveFiltersToStorage(filters.value)
      
      // Reload current tab
      const tabType = getTabType(activeTab.value)
      loadPeripheralCards(tabType)
    }
  }
})
</script>

<style scoped>
.neumorphic-button {
  background: #e0e5ec;
  border: none;
  border-radius: 10px;
  box-shadow: 4px 4px 8px rgba(207, 212, 219, 0.329),
    -4px -4px 8px rgba(249, 254, 255, 0.4689999999999999);
  color: #5a6c7d;
  transition: all 0.3s ease;
}

.neumorphic-button:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 10px rgba(207, 212, 219, 0.4),
    -6px -6px 10px rgba(249, 254, 255, 0.5);
}

.active-tab {
  background: #e0e5ec;
  box-shadow: inset 3px 3px 10px rgba(199, 204, 211, 0.6), inset -3px -3px 10px rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(199, 204, 211, 0.827);
  transform: scale(0.98);
}

.inactive-tab {
  box-shadow: 4px 4px 8px rgba(207, 212, 219, 0.329),
    -4px -4px 8px rgba(249, 254, 255, 0.4689999999999999);
}


</style>
