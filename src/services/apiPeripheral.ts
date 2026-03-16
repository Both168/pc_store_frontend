import { API_BASE_URL, type PaginatedResponse, type PaginationLinks, type PaginationMeta, type ApiResponse } from './apiConfig'

function normalizePaginatedResponse<T>(raw: any): PaginatedResponse<T> {
  const data = Array.isArray(raw.data) ? raw.data : []
  const meta = raw.meta || {}
  const current = meta.current_page ?? raw.current_page ?? 1
  const last = meta.last_page ?? raw.last_page ?? 1
  const perPage = meta.per_page ?? raw.per_page ?? 24
  const total = meta.total ?? raw.total ?? 0
  const from = meta.from ?? (total > 0 ? (current - 1) * perPage + 1 : null)
  const to = meta.to ?? (total > 0 ? Math.min(current * perPage, total) : null)
  const normalizedMeta: PaginationMeta = {
    current_page: current,
    last_page: last,
    per_page: perPage,
    total,
    from,
    to,
  }
  let links: PaginationLinks = raw.links
  if (!links || typeof links !== 'object') {
    links = {
      first: current === 1 ? null : '?page=1',
      last: current === last ? null : `?page=${last}`,
      prev: current <= 1 ? null : `?page=${current - 1}`,
      next: current >= last ? null : `?page=${current + 1}`,
    }
  }
  return { data, links, meta: normalizedMeta }
}

export interface DropdownOption {
  id: number
  name: string
}

export interface PeripheralCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image?: string
}

export interface MouseDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  connection: string[]
  battery?: string
  interface?: string
  click?: string
  polling_rate?: string
  dpi?: string
  color?: string
  sensor?: string
  battery_life?: string
  weight?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface KeyboardDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  connection?: string[]
  switch_type?: string
  layout?: string
  backlight?: string
  color?: string
  interface?: string
  battery?: string
  battery_life?: string
  weight?: string
  dimensions?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface HeadsetDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  type?: string
  connection?: string[]
  audio_driver?: string
  sound_channel?: string
  is_microphone?: string
  weight?: string
  battery?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface SpeakerDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  connection?: string[]
  type?: string
  output_power_rms?: string
  is_rgb?: string
  power_source?: string
  dimension?: string
  weight?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface MonitorDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  size?: string
  form_factor?: string
  panel_type?: string
  resolution?: string
  refresh_rate?: string
  response_time?: string
  stand?: string
  is_build_in_speaker?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface MousepadDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  size?: string
  material?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface WebcamDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  connection?: string[]
  resolution?: string
  is_microphone?: string
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface MicrophoneDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  type?: string
  is_rgb?: string
  connection?: string[]
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface ControllerDetail {
  id: number
  name: string
  brand?: string
  brand_id?: number
  type?: string
  connection?: string[]
  color?: string
  price: string
  discount_price?: string | null
  images: string[]
  description: string
  in_stock?: string
}

export interface PeripheralFilters {
  page: number
  min_price?: number
  max_price?: number
  brand_id?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

export interface MonitorFilters extends PeripheralFilters {
  size?: number | null
  form_factor?: number | null
  panel_type?: number | null
  resolution?: number | null
  refresh_rate?: number | null
  response_time?: number | null
  stand?: number | null
  is_build_in_speaker?: number | null
}

const getPeripheralTypeEndpoint = (type: string): string => {
  const typeMap: Record<string, string> = {
    'mice': 'miceCards',
    'keyboard': 'keyboardCards',
    'headset': 'headsetCards',
    'speaker': 'speakerCards',
    'monitor': 'monitorCards',
    'mousepad': 'mousepadCards',
    'webcams': 'webcamCards',
    'mic': 'microphoneCards',
    'controller': 'controllerCards',
    'cables_hubs': 'cablesHubsCards',
  }
  
  return typeMap[type] || 'peripheralCards'
}

export const fetchPeripheralCards = async (
  type: string,
  filters: PeripheralFilters | MonitorFilters
): Promise<PaginatedResponse<PeripheralCard>> => {
  try {
    const endpoint = getPeripheralTypeEndpoint(type)
    
    // For monitors, use GET with query parameters
    if (type === 'monitor') {
      const params = new URLSearchParams()
      
      // Existing filters
      if (filters.page) params.append('page', filters.page.toString())
      if (filters.min_price !== null && filters.min_price !== undefined) {
        params.append('min_price', filters.min_price.toString())
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        params.append('max_price', filters.max_price.toString())
      }
      if (filters.brand_id !== null && filters.brand_id !== undefined) {
        params.append('brand_id', filters.brand_id.toString())
      }
      if (filters.sort) params.append('sort', filters.sort)
      
      // Monitor-specific filters
      const monitorFilters = filters as MonitorFilters
      if (monitorFilters.size !== null && monitorFilters.size !== undefined) {
        params.append('size', monitorFilters.size.toString())
      }
      if (monitorFilters.form_factor !== null && monitorFilters.form_factor !== undefined) {
        params.append('form_factor', monitorFilters.form_factor.toString())
      }
      if (monitorFilters.panel_type !== null && monitorFilters.panel_type !== undefined) {
        params.append('panel_type', monitorFilters.panel_type.toString())
      }
      if (monitorFilters.resolution !== null && monitorFilters.resolution !== undefined) {
        params.append('resolution', monitorFilters.resolution.toString())
      }
      if (monitorFilters.refresh_rate !== null && monitorFilters.refresh_rate !== undefined) {
        params.append('refresh_rate', monitorFilters.refresh_rate.toString())
      }
      if (monitorFilters.response_time !== null && monitorFilters.response_time !== undefined) {
        params.append('response_time', monitorFilters.response_time.toString())
      }
      if (monitorFilters.stand !== null && monitorFilters.stand !== undefined) {
        params.append('stand', monitorFilters.stand.toString())
      }
      if (monitorFilters.is_build_in_speaker !== null && monitorFilters.is_build_in_speaker !== undefined) {
        params.append('is_build_in_speaker', monitorFilters.is_build_in_speaker.toString())
      }
      
      const response = await fetch(`${API_BASE_URL}/${endpoint}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const jsonResult = await response.json()
      const data = Array.isArray(jsonResult.data) ? jsonResult.data : jsonResult.data?.data
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid API response format')
      }
      const raw = Array.isArray(jsonResult.data) ? jsonResult : (jsonResult.data || jsonResult)
      return normalizePaginatedResponse<PeripheralCard>(raw)
    } else {
      // For other peripherals, use POST with JSON body
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const jsonResult = await response.json()
      const data = Array.isArray(jsonResult.data) ? jsonResult.data : jsonResult.data?.data
      if (!data || !Array.isArray(data)) {
        throw new Error('Invalid API response format')
      }
      const raw = Array.isArray(jsonResult.data) ? jsonResult : (jsonResult.data || jsonResult)
      return normalizePaginatedResponse<PeripheralCard>(raw)
    }
  } catch (error) {
    console.error(`Error fetching ${type} cards:`, error)
    throw error
  }
}

export const fetchMouseDetail = async (id: number): Promise<MouseDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mouseDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<MouseDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching mouse detail:', error)
    throw error
  }
}

export const fetchKeyboardDetail = async (id: number): Promise<KeyboardDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/keyboardDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<KeyboardDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching keyboard detail:', error)
    throw error
  }
}

export const fetchHeadsetDetail = async (id: number): Promise<HeadsetDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/headsetDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<HeadsetDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching headset detail:', error)
    throw error
  }
}

export const fetchSpeakerDetail = async (id: number): Promise<SpeakerDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/speakerDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<SpeakerDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching speaker detail:', error)
    throw error
  }
}

export const fetchMonitorDetail = async (id: number): Promise<MonitorDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<MonitorDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching monitor detail:', error)
    throw error
  }
}

export const fetchMousepadDetail = async (id: number): Promise<MousepadDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/mousepadDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<MousepadDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching mousepad detail:', error)
    throw error
  }
}

export const fetchWebcamDetail = async (id: number): Promise<WebcamDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/webcamDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<WebcamDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching webcam detail:', error)
    throw error
  }
}

export const fetchMicrophoneDetail = async (id: number): Promise<MicrophoneDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/microphoneDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<MicrophoneDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching microphone detail:', error)
    throw error
  }
}

export const fetchControllerDetail = async (id: number): Promise<ControllerDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/controllerDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<ControllerDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching controller detail:', error)
    throw error
  }
}

// Monitor Filter Options API Functions
export const fetchMonitorSizes = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorSizes`, {
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
    console.error('Error fetching monitor sizes:', error)
    throw error
  }
}

export const fetchMonitorFormFactors = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorFormFactors`, {
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
    console.error('Error fetching monitor form factors:', error)
    throw error
  }
}

export const fetchMonitorPanelTypes = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorPanelTypes`, {
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
    console.error('Error fetching monitor panel types:', error)
    throw error
  }
}

export const fetchMonitorResolutions = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorResolutions`, {
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
    console.error('Error fetching monitor resolutions:', error)
    throw error
  }
}

export const fetchMonitorRefreshRates = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorRefreshRates`, {
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
    console.error('Error fetching monitor refresh rates:', error)
    throw error
  }
}

export const fetchMonitorResponseTimes = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorResponseTimes`, {
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
    console.error('Error fetching monitor response times:', error)
    throw error
  }
}

export const fetchMonitorStands = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorStands`, {
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
    console.error('Error fetching monitor stands:', error)
    throw error
  }
}

export const fetchMonitorSpeakers = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/monitorSpeakers`, {
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
    console.error('Error fetching monitor speakers:', error)
    throw error
  }
}

