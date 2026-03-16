<template>
  <ProductListingLayout
    :carousel-slides="carouselSlides"
    :loading="currentLoading"
    :error="currentError"
    :items="currentItems"
    :empty-message="$t('component.empty')"
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
          <!-- CPU Filters -->
          <CpuFilter
            v-if="activeTab === 'cpu_tab'"
            v-model="filters.cpu"
          />
          <!-- GPU Filters -->
          <GpuFilter
            v-if="activeTab === 'gpu_tab'"
            v-model="filters.gpu"
          />
          <!-- Motherboard Filters -->
          <MotherboardFilter
            v-if="activeTab === 'motherboard_tab'"
            v-model="filters.motherboard"
          />
          <!-- RAM Filters -->
          <RamFilter
            v-if="activeTab === 'ram_tab'"
            v-model="filters.ram"
          />
          <!-- Storage Filters -->
          <StorageFilter
            v-if="activeTab === 'storage_tab'"
            v-model="filters.storage"
          />
          <!-- Case Filters -->
          <CaseFilter
            v-if="activeTab === 'case_tab'"
            v-model="filters.case"
          />
          <!-- Cooler Filters -->
          <CoolerFilter
            v-if="activeTab === 'cooler_tab'"
            v-model="filters.cooler"
          />
          <!-- PSU Filters -->
          <PsuFilter
            v-if="activeTab === 'psu_tab'"
            v-model="filters.psu"
          />
          <!-- Fan Filters -->
          <FanFilter
            v-if="activeTab === 'fan_tab'"
            v-model="filters.fan"
          />

          <!-- Apply and Reset Buttons -->
          <div class="flex items-end gap-2 mt-4">
            <NeumorphicButton
              @click="applyFilters"
              class="flex-1"
            >
              {{ $t('component.apply') }}
            </NeumorphicButton>
            <NeumorphicButton
              @click="resetFilters"
              class="flex-1"
            >
              {{ $t('component.reset') }}
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
import CpuFilter from '../components/pc_part_filter/CpuFilter.vue'
import GpuFilter from '../components/pc_part_filter/GpuFilter.vue'
import MotherboardFilter from '../components/pc_part_filter/MotherboardFilter.vue'
import RamFilter from '../components/pc_part_filter/RamFilter.vue'
import StorageFilter from '../components/pc_part_filter/StorageFilter.vue'
import CaseFilter from '../components/pc_part_filter/CaseFilter.vue'
import CoolerFilter from '../components/pc_part_filter/CoolerFilter.vue'
import PsuFilter from '../components/pc_part_filter/PsuFilter.vue'
import FanFilter from '../components/pc_part_filter/FanFilter.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { BANNER_PAGES } from '../constants/bannerPages'
import cpuIcon from '../assets/icons/component/cpu.png'
import gpuIcon from '../assets/icons/component/gpu.png'
import motherboardIcon from '../assets/icons/component/motherboard.png'
import ramIcon from '../assets/icons/component/ram.png'
import storageIcon from '../assets/icons/component/storage.png'
import caseIcon from '../assets/icons/component/case.png'
import coolerIcon from '../assets/icons/component/cooler.png'
import psuIcon from '../assets/icons/component/psu.png'
import fanIcon from '../assets/icons/component/fan.png'
import {
  fetchCpuCards,
  type CpuCard,
  type CpuFilters,
  fetchGpuCards,
  type GpuCard,
  type GpuFilters,
  fetchMotherboardCards,
  type MotherboardCard,
  type MotherboardFilters,
  fetchRamCards,
  type RamCard,
  type RamFilters,
  fetchStorageCards,
  type StorageCard,
  type StorageFilters,
  fetchCaseCards,
  type CaseCard,
  type CaseFilters,
  fetchCoolerCards,
  type CoolerCard,
  type CoolerFilters,
  fetchPsuCards,
  type PsuCard,
  type PsuFilters,
  fetchFanCards,
  type FanCard,
  type FanFilters,
} from '../services/apiComponent'

interface ComponentCard {
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
const activeTab = ref<string>('cpu_tab')
const cpuCards = ref<ComponentCard[]>([])
const isLoadingCpuCards = ref<boolean>(false)
const cpuPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const gpuCards = ref<ComponentCard[]>([])
const isLoadingGpuCards = ref<boolean>(false)
const gpuPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const motherboardCards = ref<ComponentCard[]>([])
const isLoadingMotherboardCards = ref<boolean>(false)
const motherboardPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const ramCards = ref<ComponentCard[]>([])
const isLoadingRamCards = ref<boolean>(false)
const ramPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const storageCards = ref<ComponentCard[]>([])
const isLoadingStorageCards = ref<boolean>(false)
const storagePagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const caseCards = ref<ComponentCard[]>([])
const isLoadingCaseCards = ref<boolean>(false)
const casePagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const coolerCards = ref<ComponentCard[]>([])
const isLoadingCoolerCards = ref<boolean>(false)
const coolerPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const psuCards = ref<ComponentCard[]>([])
const isLoadingPsuCards = ref<boolean>(false)
const psuPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})
const fanCards = ref<ComponentCard[]>([])
const isLoadingFanCards = ref<boolean>(false)
const fanPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})

// Default filter states for each tab
const defaultFilters = {
  cpu: {
    min_price: null as number | null,
    max_price: null as number | null,
    type: null as string | null, // "AMD" or "Intel" - will convert to cpu_type: 1 or 0
    generation: null as number | null, // Generation ID
    integrated_gpu: null as boolean | null, // true/false - will convert to is_integrated_gpu: 1 or 0
    sort: null as 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null,
  },
  gpu: {
    min_price: null as number | null,
    max_price: null as number | null,
    type: null as string | null,
    brand: null as number | null,
  },
  motherboard: {
    min_price: null as number | null,
    max_price: null as number | null,
    form_factor: null as number | null,
    socket: null as number | null,
    ram_type: null as string | null,
    wifi: null as number | null,
    brand: null as number | null,
    sort: null as 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null,
  },
  ram: {
    min_price: null as number | null,
    max_price: null as number | null,
    brand: null as number | null,
    type: null as number | null,
  },
  storage: {
    min_price: null as number | null,
    max_price: null as number | null,
    brand: null as number | null,
    type: null as number | null,
  },
  case: {
    min_price: null as number | null,
    max_price: null as number | null,
    brand: null as number | null,
  },
  cooler: {
    min_price: null as number | null,
    max_price: null as number | null,
    brand: null as number | null,
    type: null as number | null,
  },
  psu: {
    min_price: null as number | null,
    max_price: null as number | null,
    brand: null as number | null,
    watt: null as number | null,
    plus80: null as string | null,
  },
  fan: {
    min_price: null as number | null,
    max_price: null as number | null,
    brand: null as number | null,
  },
}

// Filter state - load from localStorage or use defaults
const loadFiltersFromStorage = () => {
  try {
    const saved = localStorage.getItem('componentFilters')
    if (saved) {
      const parsed = JSON.parse(saved)
      // Merge saved filters with defaults to ensure all keys exist
      return {
        cpu: { ...defaultFilters.cpu, ...(parsed.cpu || {}) },
        gpu: { ...defaultFilters.gpu, ...(parsed.gpu || {}) },
        motherboard: { ...defaultFilters.motherboard, ...(parsed.motherboard || {}) },
        ram: { ...defaultFilters.ram, ...(parsed.ram || {}) },
        storage: { ...defaultFilters.storage, ...(parsed.storage || {}) },
        case: { ...defaultFilters.case, ...(parsed.case || {}) },
        cooler: { ...defaultFilters.cooler, ...(parsed.cooler || {}) },
        psu: { ...defaultFilters.psu, ...(parsed.psu || {}) },
        fan: { ...defaultFilters.fan, ...(parsed.fan || {}) },
      }
    }
  } catch (error) {
    console.error('Error loading filters from storage:', error)
  }
  return defaultFilters
}

const saveFiltersToStorage = (filters: typeof defaultFilters) => {
  try {
    localStorage.setItem('componentFilters', JSON.stringify(filters))
  } catch (error) {
    console.error('Error saving filters to storage:', error)
  }
}

// Filter states for each tab
// Note: CPU filter uses UI-friendly types, will be converted to API format in loadCpuCards
const filters = ref(loadFiltersFromStorage())

const applyFilters = async () => {
  // Save filters to localStorage
  saveFiltersToStorage(filters.value)
  
  if (activeTab.value === 'cpu_tab') {
    cpuPagination.value.current_page = 1
    await loadCpuCards()
  } else if (activeTab.value === 'gpu_tab') {
    gpuPagination.value.current_page = 1
    await loadGpuCards()
  } else if (activeTab.value === 'motherboard_tab') {
    motherboardPagination.value.current_page = 1
    await loadMotherboardCards()
  } else if (activeTab.value === 'ram_tab') {
    ramPagination.value.current_page = 1
    await loadRamCards()
  } else if (activeTab.value === 'storage_tab') {
    storagePagination.value.current_page = 1
    await loadStorageCards()
  } else if (activeTab.value === 'case_tab') {
    casePagination.value.current_page = 1
    await loadCaseCards()
  } else if (activeTab.value === 'cooler_tab') {
    coolerPagination.value.current_page = 1
    await loadCoolerCards()
  } else if (activeTab.value === 'psu_tab') {
    psuPagination.value.current_page = 1
    await loadPsuCards()
  } else if (activeTab.value === 'fan_tab') {
    fanPagination.value.current_page = 1
    await loadFanCards()
  }
}

const resetFilters = () => {
  const tabKey = activeTab.value.replace('_tab', '') as keyof typeof filters.value
  const tabFilters = filters.value[tabKey]
  
  if (tabFilters) {
    // Reset all filter values for current tab to defaults
    const defaultTabFilters = defaultFilters[tabKey as keyof typeof defaultFilters]
    Object.keys(tabFilters).forEach((key) => {
      ;(tabFilters as any)[key] = (defaultTabFilters as any)[key]
    })
  }
  
  // Save filters to localStorage
  saveFiltersToStorage(filters.value)
  
  // Apply reset filters
  applyFilters()
}

const tabs: Tab[] = [
  { id: 'cpu_tab', label: 'CPU' },
  { id: 'gpu_tab', label: 'GPU' },
  { id: 'motherboard_tab', label: 'Motherboard' },
  { id: 'ram_tab', label: 'RAM' },
  { id: 'storage_tab', label: 'Storage' },
  { id: 'case_tab', label: 'Case' },
  { id: 'cooler_tab', label: 'Cooler' },
  { id: 'psu_tab', label: 'PSU' },
  { id: 'fan_tab', label: 'Fan' },
]

const getTabIcon = (tabId: string): string | undefined => {
  const icons: Record<string, string> = {
    'cpu_tab': cpuIcon,
    'gpu_tab': gpuIcon,
    'motherboard_tab': motherboardIcon,
    'ram_tab': ramIcon,
    'storage_tab': storageIcon,
    'case_tab': caseIcon,
    'cooler_tab': coolerIcon,
    'psu_tab': psuIcon,
    'fan_tab': fanIcon,
  }
  return icons[tabId]
}

// Cards data will be populated from API for each tab
const cardsData: Record<string, ComponentCard[]> = {
  cpu_tab: [], // Populated from API
  motherboard_tab: [], // Populated from API
  // Other tabs will be populated from API when endpoints are ready
  gpu_tab: [],
  ram_tab: [],
  storage_tab: [],
  case_tab: [],
  cooler_tab: [],
  psu_tab: [],
  fan_tab: [],
}

const getCurrentTabCards = (): ComponentCard[] => {
  if (activeTab.value === 'cpu_tab') {
    return cpuCards.value
  }
  if (activeTab.value === 'gpu_tab') {
    return gpuCards.value
  }
  if (activeTab.value === 'motherboard_tab') {
    return motherboardCards.value
  }
  if (activeTab.value === 'ram_tab') {
    return ramCards.value
  }
  if (activeTab.value === 'storage_tab') {
    return storageCards.value
  }
  if (activeTab.value === 'case_tab') {
    return caseCards.value
  }
  if (activeTab.value === 'cooler_tab') {
    return coolerCards.value
  }
  if (activeTab.value === 'psu_tab') {
    return psuCards.value
  }
  if (activeTab.value === 'fan_tab') {
    return fanCards.value
  }
  return []
}

const getCardDetailRoute = (cardId: number): string => {
  if (activeTab.value === 'cpu_tab') {
    return `/component/cpu/${cardId}`
  } else if (activeTab.value === 'gpu_tab') {
    return `/component/gpu/${cardId}`
  } else if (activeTab.value === 'ram_tab') {
    return `/component/ram/${cardId}`
  } else if (activeTab.value === 'motherboard_tab') {
    return `/component/motherboard/${cardId}`
  } else if (activeTab.value === 'storage_tab') {
    return `/component/storage/${cardId}`
  } else if (activeTab.value === 'case_tab') {
    return `/component/case/${cardId}`
  } else if (activeTab.value === 'cooler_tab') {
    return `/component/cooler/${cardId}`
  } else if (activeTab.value === 'psu_tab') {
    return `/component/psu/${cardId}`
  } else if (activeTab.value === 'fan_tab') {
    return `/component/fan/${cardId}`
  }
  // Default to CPU for now, can be extended for other component types
  return '#'
}

const getCurrentLoadingState = (): boolean => {
  if (activeTab.value === 'cpu_tab') {
    return isLoadingCpuCards.value
  }
  if (activeTab.value === 'gpu_tab') {
    return isLoadingGpuCards.value
  }
  if (activeTab.value === 'motherboard_tab') {
    return isLoadingMotherboardCards.value
  }
  if (activeTab.value === 'ram_tab') {
    return isLoadingRamCards.value
  }
  if (activeTab.value === 'storage_tab') {
    return isLoadingStorageCards.value
  }
  if (activeTab.value === 'case_tab') {
    return isLoadingCaseCards.value
  }
  if (activeTab.value === 'cooler_tab') {
    return isLoadingCoolerCards.value
  }
  if (activeTab.value === 'psu_tab') {
    return isLoadingPsuCards.value
  }
  if (activeTab.value === 'fan_tab') {
    return isLoadingFanCards.value
  }
  return false
}

const getCurrentPagination = () => {
  if (activeTab.value === 'cpu_tab') {
    return cpuPagination.value
  }
  if (activeTab.value === 'gpu_tab') {
    return gpuPagination.value
  }
  if (activeTab.value === 'motherboard_tab') {
    return motherboardPagination.value
  }
  if (activeTab.value === 'ram_tab') {
    return ramPagination.value
  }
  if (activeTab.value === 'storage_tab') {
    return storagePagination.value
  }
  if (activeTab.value === 'case_tab') {
    return casePagination.value
  }
  if (activeTab.value === 'cooler_tab') {
    return coolerPagination.value
  }
  if (activeTab.value === 'psu_tab') {
    return psuPagination.value
  }
  if (activeTab.value === 'fan_tab') {
    return fanPagination.value
  }
  return { current_page: 1, per_page: 24, total: 0, last_page: 1 }
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
  const pagination = getCurrentPagination()
  pagination.current_page = page
  
  if (activeTab.value === 'cpu_tab') {
    cpuPagination.value.current_page = page
    loadCpuCards()
  } else if (activeTab.value === 'gpu_tab') {
    gpuPagination.value.current_page = page
    loadGpuCards()
  } else if (activeTab.value === 'motherboard_tab') {
    motherboardPagination.value.current_page = page
    loadMotherboardCards()
  } else if (activeTab.value === 'ram_tab') {
    ramPagination.value.current_page = page
    loadRamCards()
  } else if (activeTab.value === 'storage_tab') {
    storagePagination.value.current_page = page
    loadStorageCards()
  } else if (activeTab.value === 'case_tab') {
    casePagination.value.current_page = page
    loadCaseCards()
  } else if (activeTab.value === 'cooler_tab') {
    coolerPagination.value.current_page = page
    loadCoolerCards()
  } else if (activeTab.value === 'psu_tab') {
    psuPagination.value.current_page = page
    loadPsuCards()
  } else if (activeTab.value === 'fan_tab') {
    fanPagination.value.current_page = page
    loadFanCards()
  }
  
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.COMPONENT)
    
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

const loadCpuCards = async () => {
  try {
    isLoadingCpuCards.value = true
    
    // Build filter object from current filter state, converting UI values to API format
    const cpuFilters: CpuFilters = {
      page: cpuPagination.value.current_page,
    }
    
    if (filters.value.cpu.min_price !== null && filters.value.cpu.min_price !== undefined) {
      cpuFilters.min_price = filters.value.cpu.min_price
    }
    if (filters.value.cpu.max_price !== null && filters.value.cpu.max_price !== undefined) {
      cpuFilters.max_price = filters.value.cpu.max_price
    }
    
    // Convert CPU type: "AMD" -> 1, "Intel" -> 0
    if (filters.value.cpu.type === 'AMD') {
      cpuFilters.cpu_type = 1
    } else if (filters.value.cpu.type === 'Intel') {
      cpuFilters.cpu_type = 0
    }
    
    if (filters.value.cpu.generation !== null && filters.value.cpu.generation !== undefined) {
      cpuFilters.generation = filters.value.cpu.generation
    }
    
    // Convert integrated_gpu: true -> 1, false -> 0
    if (filters.value.cpu.integrated_gpu === true) {
      cpuFilters.is_integrated_gpu = 1
    } else if (filters.value.cpu.integrated_gpu === false) {
      cpuFilters.is_integrated_gpu = 0
    }
    
    if (filters.value.cpu.sort) {
      cpuFilters.sort = filters.value.cpu.sort
    }
    
    const result = await fetchCpuCards(cpuFilters)
    
    cpuCards.value = result.data.map((card: CpuCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    // Update pagination info
    cpuPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    // Also update cardsData for consistency
    cardsData.cpu_tab = cpuCards.value
  } catch (err) {
    console.error('Error loading CPU cards:', err)
  } finally {
    isLoadingCpuCards.value = false
  }
}

const loadGpuCards = async () => {
  try {
    isLoadingGpuCards.value = true
    
    // Build filter object from current filter state
    const gpuFilters: GpuFilters = {
      page: gpuPagination.value.current_page,
    }
    
    if (filters.value.gpu.min_price !== null && filters.value.gpu.min_price !== undefined) {
      gpuFilters.min_price = filters.value.gpu.min_price
    }
    if (filters.value.gpu.max_price !== null && filters.value.gpu.max_price !== undefined) {
      gpuFilters.max_price = filters.value.gpu.max_price
    }
    if (filters.value.gpu.type) {
      gpuFilters.type = filters.value.gpu.type
    }
    if (filters.value.gpu.brand !== null && filters.value.gpu.brand !== undefined) {
      gpuFilters.brand_id = filters.value.gpu.brand
    }
    
    const result = await fetchGpuCards(gpuFilters)
    
    gpuCards.value = result.data.map((card: GpuCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    // Update pagination info
    gpuPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    // Also update cardsData for consistency
    cardsData.gpu_tab = gpuCards.value
  } catch (err) {
    console.error('Error loading GPU cards:', err)
  } finally {
    isLoadingGpuCards.value = false
  }
}

const loadMotherboardCards = async () => {
  try {
    isLoadingMotherboardCards.value = true
    
    // Build filter object from current filter state
    const motherboardFilters: MotherboardFilters = {
      page: motherboardPagination.value.current_page,
    }
    
    if (filters.value.motherboard.min_price !== null && filters.value.motherboard.min_price !== undefined) {
      motherboardFilters.min_price = filters.value.motherboard.min_price
    }
    if (filters.value.motherboard.max_price !== null && filters.value.motherboard.max_price !== undefined) {
      motherboardFilters.max_price = filters.value.motherboard.max_price
    }
    if (filters.value.motherboard.form_factor !== null && filters.value.motherboard.form_factor !== undefined) {
      motherboardFilters.form_factor_id = filters.value.motherboard.form_factor
    }
    if (filters.value.motherboard.socket !== null && filters.value.motherboard.socket !== undefined) {
      motherboardFilters.socket = filters.value.motherboard.socket
    }
    if (filters.value.motherboard.ram_type) {
      motherboardFilters.ram_type = filters.value.motherboard.ram_type
    }
    if (filters.value.motherboard.wifi !== null && filters.value.motherboard.wifi !== undefined) {
      motherboardFilters.wifi_id = filters.value.motherboard.wifi
    }
    if (filters.value.motherboard.brand !== null && filters.value.motherboard.brand !== undefined) {
      motherboardFilters.brand_id = filters.value.motherboard.brand
    }
    if (filters.value.motherboard.sort) {
      motherboardFilters.sort = filters.value.motherboard.sort
    }
    
    const result = await fetchMotherboardCards(motherboardFilters)
    
    motherboardCards.value = result.data.map((card: MotherboardCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    // Update pagination info
    motherboardPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    // Also update cardsData for consistency
    cardsData.motherboard_tab = motherboardCards.value
  } catch (err) {
    console.error('Error loading motherboard cards:', err)
  } finally {
    isLoadingMotherboardCards.value = false
  }
}

const loadRamCards = async () => {
  try {
    isLoadingRamCards.value = true
    
    const ramFilters: RamFilters = {
      page: ramPagination.value.current_page,
    }
    
    if (filters.value.ram.min_price !== null && filters.value.ram.min_price !== undefined) {
      ramFilters.min_price = filters.value.ram.min_price
    }
    if (filters.value.ram.max_price !== null && filters.value.ram.max_price !== undefined) {
      ramFilters.max_price = filters.value.ram.max_price
    }
    if (filters.value.ram.brand !== null && filters.value.ram.brand !== undefined) {
      ramFilters.brand_id = filters.value.ram.brand
    }
    if (filters.value.ram.type !== null && filters.value.ram.type !== undefined) {
      ramFilters.type_id = filters.value.ram.type
    }
    
    const result = await fetchRamCards(ramFilters)
    
    ramCards.value = result.data.map((card: RamCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    ramPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    cardsData.ram_tab = ramCards.value
  } catch (err) {
    console.error('Error loading RAM cards:', err)
  } finally {
    isLoadingRamCards.value = false
  }
}

const loadStorageCards = async () => {
  try {
    isLoadingStorageCards.value = true
    
    const storageFilters: StorageFilters = {
      page: storagePagination.value.current_page,
    }
    
    if (filters.value.storage.min_price !== null && filters.value.storage.min_price !== undefined) {
      storageFilters.min_price = filters.value.storage.min_price
    }
    if (filters.value.storage.max_price !== null && filters.value.storage.max_price !== undefined) {
      storageFilters.max_price = filters.value.storage.max_price
    }
    if (filters.value.storage.brand !== null && filters.value.storage.brand !== undefined) {
      storageFilters.brand_id = filters.value.storage.brand
    }
    if (filters.value.storage.type !== null && filters.value.storage.type !== undefined) {
      storageFilters.type_id = filters.value.storage.type
    }
    
    const result = await fetchStorageCards(storageFilters)
    
    storageCards.value = result.data.map((card: StorageCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    storagePagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    cardsData.storage_tab = storageCards.value
  } catch (err) {
    console.error('Error loading Storage cards:', err)
  } finally {
    isLoadingStorageCards.value = false
  }
}

const loadCaseCards = async () => {
  try {
    isLoadingCaseCards.value = true
    
    const caseFilters: CaseFilters = {
      page: casePagination.value.current_page,
    }
    
    if (filters.value.case.min_price !== null && filters.value.case.min_price !== undefined) {
      caseFilters.min_price = filters.value.case.min_price
    }
    if (filters.value.case.max_price !== null && filters.value.case.max_price !== undefined) {
      caseFilters.max_price = filters.value.case.max_price
    }
    if (filters.value.case.brand !== null && filters.value.case.brand !== undefined) {
      caseFilters.brand_id = filters.value.case.brand
    }
    
    const result = await fetchCaseCards(caseFilters)
    
    caseCards.value = result.data.map((card: CaseCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    casePagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    cardsData.case_tab = caseCards.value
  } catch (err) {
    console.error('Error loading Case cards:', err)
  } finally {
    isLoadingCaseCards.value = false
  }
}

const loadCoolerCards = async () => {
  try {
    isLoadingCoolerCards.value = true
    
    const coolerFilters: CoolerFilters = {
      page: coolerPagination.value.current_page,
    }
    
    if (filters.value.cooler.min_price !== null && filters.value.cooler.min_price !== undefined) {
      coolerFilters.min_price = filters.value.cooler.min_price
    }
    if (filters.value.cooler.max_price !== null && filters.value.cooler.max_price !== undefined) {
      coolerFilters.max_price = filters.value.cooler.max_price
    }
    if (filters.value.cooler.brand !== null && filters.value.cooler.brand !== undefined) {
      coolerFilters.brand_id = filters.value.cooler.brand
    }
    if (filters.value.cooler.type !== null && filters.value.cooler.type !== undefined) {
      coolerFilters.type_id = filters.value.cooler.type
    }
    
    const result = await fetchCoolerCards(coolerFilters)
    
    coolerCards.value = result.data.map((card: CoolerCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    coolerPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    cardsData.cooler_tab = coolerCards.value
  } catch (err) {
    console.error('Error loading Cooler cards:', err)
  } finally {
    isLoadingCoolerCards.value = false
  }
}

const loadPsuCards = async () => {
  try {
    isLoadingPsuCards.value = true
    
    const psuFilters: PsuFilters = {
      page: psuPagination.value.current_page,
    }
    
    if (filters.value.psu.min_price !== null && filters.value.psu.min_price !== undefined) {
      psuFilters.min_price = filters.value.psu.min_price
    }
    if (filters.value.psu.max_price !== null && filters.value.psu.max_price !== undefined) {
      psuFilters.max_price = filters.value.psu.max_price
    }
    if (filters.value.psu.brand !== null && filters.value.psu.brand !== undefined) {
      psuFilters.brand_id = filters.value.psu.brand
    }
    if (filters.value.psu.watt !== null && filters.value.psu.watt !== undefined) {
      psuFilters.watt_id = filters.value.psu.watt
    }
    if (filters.value.psu.plus80) {
      psuFilters.plus80 = filters.value.psu.plus80
    }
    
    const result = await fetchPsuCards(psuFilters)
    
    psuCards.value = result.data.map((card: PsuCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    psuPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    cardsData.psu_tab = psuCards.value
  } catch (err) {
    console.error('Error loading PSU cards:', err)
  } finally {
    isLoadingPsuCards.value = false
  }
}

const loadFanCards = async () => {
  try {
    isLoadingFanCards.value = true
    
    const fanFilters: FanFilters = {
      page: fanPagination.value.current_page,
    }
    
    if (filters.value.fan.min_price !== null && filters.value.fan.min_price !== undefined) {
      fanFilters.min_price = filters.value.fan.min_price
    }
    if (filters.value.fan.max_price !== null && filters.value.fan.max_price !== undefined) {
      fanFilters.max_price = filters.value.fan.max_price
    }
    if (filters.value.fan.brand !== null && filters.value.fan.brand !== undefined) {
      fanFilters.brand_id = filters.value.fan.brand
    }
    
    const result = await fetchFanCards(fanFilters)
    
    fanCards.value = result.data.map((card: FanCard) => ({
      id: card.id,
      name: card.name,
      price: card.price,
      discount_price: card.discount_price,
      image: card.image,
    }))
    
    fanPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
    
    cardsData.fan_tab = fanCards.value
  } catch (err) {
    console.error('Error loading Fan cards:', err)
  } finally {
    isLoadingFanCards.value = false
  }
}

const route = useRoute()

// Watch for tab changes to load data when switching tabs
watch(activeTab, (newTab) => {
  if (newTab === 'gpu_tab' && gpuCards.value.length === 0) {
    loadGpuCards()
  } else if (newTab === 'motherboard_tab' && motherboardCards.value.length === 0) {
    loadMotherboardCards()
  } else if (newTab === 'ram_tab' && ramCards.value.length === 0) {
    loadRamCards()
  } else if (newTab === 'storage_tab' && storageCards.value.length === 0) {
    loadStorageCards()
  } else if (newTab === 'case_tab' && caseCards.value.length === 0) {
    loadCaseCards()
  } else if (newTab === 'cooler_tab' && coolerCards.value.length === 0) {
    loadCoolerCards()
  } else if (newTab === 'psu_tab' && psuCards.value.length === 0) {
    loadPsuCards()
  } else if (newTab === 'fan_tab' && fanCards.value.length === 0) {
    loadFanCards()
  }
})

// Map route paths to tab IDs
const getTabFromRoute = (path: string): string => {
  if (path.includes('/component/ram')) return 'ram_tab'
  if (path.includes('/component/gpu')) return 'gpu_tab'
  if (path.includes('/component/motherboard')) return 'motherboard_tab'
  if (path.includes('/component/storage')) return 'storage_tab'
  if (path.includes('/component/case')) return 'case_tab'
  if (path.includes('/component/cooler')) return 'cooler_tab'
  if (path.includes('/component/psu')) return 'psu_tab'
  if (path.includes('/component/fan')) return 'fan_tab'
  if (path.includes('/component/cpu')) return 'cpu_tab'
  return 'cpu_tab' // default
}

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
      // Apply brand filter to all component filters
      if (filters.value.cpu) filters.value.cpu.brand = brandId
      if (filters.value.gpu) filters.value.gpu.brand = brandId
      if (filters.value.motherboard) filters.value.motherboard.brand = brandId
      if (filters.value.ram) filters.value.ram.brand = brandId
      if (filters.value.storage) filters.value.storage.brand = brandId
      if (filters.value.case) filters.value.case.brand = brandId
      if (filters.value.cooler) filters.value.cooler.brand = brandId
      if (filters.value.psu) filters.value.psu.brand = brandId
      if (filters.value.fan) filters.value.fan.brand = brandId
      saveFiltersToStorage(filters.value)
    }
  }
  
  // Load cards for the active tab
  if (activeTab.value === 'cpu_tab') {
    loadCpuCards()
  } else if (activeTab.value === 'gpu_tab') {
    loadGpuCards()
  } else if (activeTab.value === 'ram_tab') {
    loadRamCards()
  } else if (activeTab.value === 'motherboard_tab') {
    loadMotherboardCards()
  } else if (activeTab.value === 'storage_tab') {
    loadStorageCards()
  } else if (activeTab.value === 'case_tab') {
    loadCaseCards()
  } else if (activeTab.value === 'cooler_tab') {
    loadCoolerCards()
  } else if (activeTab.value === 'psu_tab') {
    loadPsuCards()
  } else if (activeTab.value === 'fan_tab') {
    loadFanCards()
  }
})

// Watch for route changes
watch(() => route.path, (newPath) => {
  const tabFromRoute = getTabFromRoute(newPath)
  if (activeTab.value !== tabFromRoute) {
    activeTab.value = tabFromRoute
    // Load cards for the new tab if not already loaded
    if (activeTab.value === 'gpu_tab' && gpuCards.value.length === 0) {
      loadGpuCards()
    } else if (activeTab.value === 'ram_tab' && ramCards.value.length === 0) {
      loadRamCards()
    } else if (activeTab.value === 'motherboard_tab' && motherboardCards.value.length === 0) {
      loadMotherboardCards()
    } else if (activeTab.value === 'storage_tab' && storageCards.value.length === 0) {
      loadStorageCards()
    } else if (activeTab.value === 'case_tab' && caseCards.value.length === 0) {
      loadCaseCards()
    } else if (activeTab.value === 'cooler_tab' && coolerCards.value.length === 0) {
      loadCoolerCards()
    } else if (activeTab.value === 'psu_tab' && psuCards.value.length === 0) {
      loadPsuCards()
    } else if (activeTab.value === 'fan_tab' && fanCards.value.length === 0) {
      loadFanCards()
    }
  }
})

// Watch for query parameter changes
watch(() => route.query.brand_id, (newBrandId) => {
  if (newBrandId) {
    const brandId = Number(newBrandId)
    if (!isNaN(brandId)) {
      // Apply brand filter to all component filters
      if (filters.value.cpu) filters.value.cpu.brand = brandId
      if (filters.value.gpu) filters.value.gpu.brand = brandId
      if (filters.value.motherboard) filters.value.motherboard.brand = brandId
      if (filters.value.ram) filters.value.ram.brand = brandId
      if (filters.value.storage) filters.value.storage.brand = brandId
      if (filters.value.case) filters.value.case.brand = brandId
      if (filters.value.cooler) filters.value.cooler.brand = brandId
      if (filters.value.psu) filters.value.psu.brand = brandId
      if (filters.value.fan) filters.value.fan.brand = brandId
      saveFiltersToStorage(filters.value)
      
      // Reload current tab
      if (activeTab.value === 'cpu_tab') {
        cpuPagination.value.current_page = 1
        loadCpuCards()
      } else if (activeTab.value === 'gpu_tab') {
        gpuPagination.value.current_page = 1
        loadGpuCards()
      } else if (activeTab.value === 'motherboard_tab') {
        motherboardPagination.value.current_page = 1
        loadMotherboardCards()
      } else if (activeTab.value === 'ram_tab') {
        ramPagination.value.current_page = 1
        loadRamCards()
      } else if (activeTab.value === 'storage_tab') {
        storagePagination.value.current_page = 1
        loadStorageCards()
      } else if (activeTab.value === 'case_tab') {
        casePagination.value.current_page = 1
        loadCaseCards()
      } else if (activeTab.value === 'cooler_tab') {
        coolerPagination.value.current_page = 1
        loadCoolerCards()
      } else if (activeTab.value === 'psu_tab') {
        psuPagination.value.current_page = 1
        loadPsuCards()
      } else if (activeTab.value === 'fan_tab') {
        fanPagination.value.current_page = 1
        loadFanCards()
      }
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
