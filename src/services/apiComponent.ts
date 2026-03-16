import { API_BASE_URL, type ApiResponse } from './apiConfig'

export interface CpuCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface CpuFilters {
  min_price?: number | null
  max_price?: number | null
  cpu_type?: number | null // 1 = AMD, 0 = Intel
  generation?: number | null
  is_integrated_gpu?: number | null // 1 = has integrated GPU, 0 = no integrated GPU
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
  page?: number
}

export interface LaravelPaginatedResponse<T> {
  data: T[]
  current_page: number
  per_page: number
  total: number
  last_page: number
}

function normalizeLaravelPaginated<T>(raw: any): LaravelPaginatedResponse<T> {
  const meta = raw.meta
  return {
    data: Array.isArray(raw.data) ? raw.data : [],
    current_page: meta?.current_page ?? raw.current_page ?? 1,
    per_page: meta?.per_page ?? raw.per_page ?? 24,
    total: meta?.total ?? raw.total ?? 0,
    last_page: meta?.last_page ?? raw.last_page ?? 1,
  }
}

export interface DropdownOption {
  id: number
  name: string
}

export interface StringDropdownOption {
  id: string
  name: string
}

export const fetchCpuCards = async (
  filters?: CpuFilters
): Promise<LaravelPaginatedResponse<CpuCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.cpu_type !== null && filters.cpu_type !== undefined) {
        body.cpu_type = filters.cpu_type
      }
      if (filters.generation !== null && filters.generation !== undefined) {
        body.generation = filters.generation
      }
      if (filters.is_integrated_gpu !== null && filters.is_integrated_gpu !== undefined) {
        body.is_integrated_gpu = filters.is_integrated_gpu
      }
      if (filters.sort) {
        body.sort = filters.sort
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/cpuCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<CpuCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching CPU cards:', error)
    throw error
  }
}

export interface CpuDetail {
  id: number
  name: string
  brand_type: string
  brand_id?: number
  price: string
  discount_price?: string | null
  color?: string
  performance_cores?: number
  total_threads?: number
  base_frequency?: string
  max_turbo_frequency?: string
  cache?: string
  socket_supported?: string
  generation?: string
  is_integrated_gpu?: string
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchCpuDetail = async (id: number): Promise<CpuDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cpuDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<CpuDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching CPU detail:', error)
    throw error
  }
}

export interface GpuDetail {
  id: number
  name: string
  type: string
  brand?: string
  brand_id?: number
  price: string
  discount_price?: string | null
  color?: string
  processing_unit?: string
  interface?: string
  memory?: string
  memory_speed?: string
  power_consumption?: string
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchGpuDetail = async (id: number): Promise<GpuDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/gpuDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<GpuDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching GPU detail:', error)
    throw error
  }
}

export interface RamDetail {
  id: number
  name: string
  capacity?: string
  speed?: string
  cas_latency?: string
  ram_type?: string
  brand_id?: number
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchRamDetail = async (id: number): Promise<RamDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ramDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<RamDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching RAM detail:', error)
    throw error
  }
}

export interface MotherboardDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  type?: string
  price: string
  discount_price?: string | null
  generation?: string
  color?: string
  form_factor?: string
  socket_supported?: string
  ram_type?: string
  wifi?: string
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchMotherboardDetail = async (id: number): Promise<MotherboardDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/motherboardDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<MotherboardDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Motherboard detail:', error)
    throw error
  }
}

export interface StorageDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  type?: string
  capacity?: string
  interface?: string
  form_factor?: string
  read_speed?: string
  write_speed?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchStorageDetail = async (id: number): Promise<StorageDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/storageDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<StorageDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Storage detail:', error)
    throw error
  }
}

export interface CaseDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  form_factors?: string[]
  dimension?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchCaseDetail = async (id: number): Promise<CaseDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/caseDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<CaseDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Case detail:', error)
    throw error
  }
}

export interface CoolerDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  type?: string
  compatibility?: string
  radiator_size?: string
  tdp?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchCoolerDetail = async (id: number): Promise<CoolerDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coolerDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<CoolerDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Cooler detail:', error)
    throw error
  }
}

export interface PsuDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  wattage?: string
  form_factor?: string
  cable_management?: string
  power_rating?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchPsuDetail = async (id: number): Promise<PsuDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/psuDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<PsuDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching PSU detail:', error)
    throw error
  }
}

export interface FanDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  lighting?: string
  speed?: string
  dimension?: string
  interface?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description?: string
  in_stock?: string
}

export const fetchFanDetail = async (id: number): Promise<FanDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/fanDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<FanDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Fan detail:', error)
    throw error
  }
}

export const fetchCpuTypes = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cpuTypes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching CPU types:', error)
    throw error
  }
}

export const fetchGenerations = async (type?: number): Promise<DropdownOption[]> => {
  try {
    const body: any = {}
    if (type !== null && type !== undefined) {
      body.type = type
    }

    const response = await fetch(`${API_BASE_URL}/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching generations:', error)
    throw error
  }
}

export const fetchIntegratedGpu = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/integratedGpu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching integrated GPU options:', error)
    throw error
  }
}

// GPU interfaces and functions
export interface GpuCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface GpuFilters {
  min_price?: number | null
  max_price?: number | null
  type?: string | null // "AMD" or "NVIDIA"
  brand_id?: number | null
  page?: number
}

export const fetchGpuCards = async (
  filters?: GpuFilters
): Promise<LaravelPaginatedResponse<GpuCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.type) {
        body.type = filters.type
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/gpuCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<GpuCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching GPU cards:', error)
    throw error
  }
}

// Motherboard interfaces and functions
export interface MotherboardCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface MotherboardFilters {
  min_price?: number | null
  max_price?: number | null
  form_factor_id?: number | null
  socket?: number | null
  ram_type?: string | null
  wifi_id?: number | null
  brand_id?: number | null
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
  page?: number
}

export const fetchMotherboardCards = async (
  filters?: MotherboardFilters
): Promise<LaravelPaginatedResponse<MotherboardCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.form_factor_id !== null && filters.form_factor_id !== undefined) {
        body.form_factor_id = filters.form_factor_id
      }
      if (filters.socket !== null && filters.socket !== undefined) {
        body.socket = filters.socket
      }
      if (filters.ram_type) {
        body.ram_type = filters.ram_type
      }
      if (filters.wifi_id !== null && filters.wifi_id !== undefined) {
        body.wifi_id = filters.wifi_id
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.sort) {
        body.sort = filters.sort
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/motherboardCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<MotherboardCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching motherboard cards:', error)
    throw error
  }
}

// RAM interfaces and functions
export interface RamCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface RamFilters {
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  type_id?: number | null
  page?: number
}

export const fetchRamCards = async (
  filters?: RamFilters
): Promise<LaravelPaginatedResponse<RamCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.type_id !== null && filters.type_id !== undefined) {
        body.type_id = filters.type_id
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/ramCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<RamCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching RAM cards:', error)
    throw error
  }
}

// Storage interfaces and functions
export interface StorageCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface StorageFilters {
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  type_id?: number | null
  page?: number
}

export const fetchStorageCards = async (
  filters?: StorageFilters
): Promise<LaravelPaginatedResponse<StorageCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.type_id !== null && filters.type_id !== undefined) {
        body.type_id = filters.type_id
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/storageCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<StorageCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Storage cards:', error)
    throw error
  }
}

// Case interfaces and functions
export interface CaseCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface CaseFilters {
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  page?: number
}

export const fetchCaseCards = async (
  filters?: CaseFilters
): Promise<LaravelPaginatedResponse<CaseCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/caseCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<CaseCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Case cards:', error)
    throw error
  }
}

// Cooler interfaces and functions
export interface CoolerCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface CoolerFilters {
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  type_id?: number | null
  page?: number
}

export const fetchCoolerCards = async (
  filters?: CoolerFilters
): Promise<LaravelPaginatedResponse<CoolerCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.type_id !== null && filters.type_id !== undefined) {
        body.type_id = filters.type_id
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/coolerCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<CoolerCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Cooler cards:', error)
    throw error
  }
}

// PSU interfaces and functions
export interface PsuCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface PsuFilters {
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  watt_id?: number | null
  plus80?: string | null
  page?: number
}

export const fetchPsuCards = async (
  filters?: PsuFilters
): Promise<LaravelPaginatedResponse<PsuCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.watt_id !== null && filters.watt_id !== undefined) {
        body.watt_id = filters.watt_id
      }
      if (filters.plus80) {
        body.plus80 = filters.plus80
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/psuCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<PsuCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching PSU cards:', error)
    throw error
  }
}

// Fan interfaces and functions
export interface FanCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image: string
}

export interface FanFilters {
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  page?: number
}

export const fetchFanCards = async (
  filters?: FanFilters
): Promise<LaravelPaginatedResponse<FanCard>> => {
  try {
    const body: any = {}

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        body.brand_id = filters.brand_id
      }
      if (filters.page) {
        body.page = filters.page
      }
    }

    const response = await fetch(`${API_BASE_URL}/fanCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const raw = await response.json()
    if (raw.data && Array.isArray(raw.data)) {
      return normalizeLaravelPaginated<FanCard>(raw)
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching Fan cards:', error)
    throw error
  }
}

export const fetchFormFactors = async (): Promise<StringDropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/formFactors`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: StringDropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching form factors:', error)
    throw error
  }
}

export const fetchSockets = async (type?: number): Promise<DropdownOption[]> => {
  try {
    const body: any = {}
    if (type !== null && type !== undefined) {
      body.type = type
    }

    const response = await fetch(`${API_BASE_URL}/sockets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching sockets:', error)
    throw error
  }
}

export const fetchRamTypes = async (): Promise<StringDropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ramTypes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: StringDropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching RAM types:', error)
    throw error
  }
}

export const fetchWifis = async (): Promise<StringDropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wifis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: StringDropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching WiFi options:', error)
    throw error
  }
}

export const fetchWattage = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/wattage`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching wattage options:', error)
    throw error
  }
}

export const fetchCoolerTypes = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/coolertype`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: DropdownOption[] = await response.json()

    if (Array.isArray(result)) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching cooler types:', error)
    throw error
  }
}

