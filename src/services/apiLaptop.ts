import { API_BASE_URL, type PaginatedResponse, type ApiResponse } from './apiConfig'

export interface LaptopCard {
  id?: number
  name: string
  image: string
  price: string
  discount_price?: string | null
  in_stock: number // 1 = in stock, 0 = out of stock
}

export interface Brand {
  id: number
  name: string
  logo?: string
}

export interface LaptopDetail {
  id: number
  name: string
  brand_id: number
  brand: Brand
  processor: string
  gpu: string
  ram: string
  storage: string
  screen_size: string
  screen_type: string
  weight: string
  battery: string
  os: string
  ports: string
  images: string[]
  price: string
  discount_price?: string | null
  description: string
  in_stock: number // 1 = in stock, 0 = out of stock
  is_gaming: number // 1 = gaming, 0 = laptop
}

export interface LaptopFilters {
  min_price?: number | null
  max_price?: number | null
  brand?: number | null
  is_gaming?: 1 | 0 | null
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

export const fetchLaptopCards = async (
  page: number = 1,
  filters?: LaptopFilters
): Promise<PaginatedResponse<LaptopCard>> => {
  try {
    const params = new URLSearchParams()
    params.append('page', page.toString())

    const body: any = {
      page,
    }

    if (filters) {
      if (filters.min_price !== null && filters.min_price !== undefined) {
        body.min_price = filters.min_price
      }
      if (filters.max_price !== null && filters.max_price !== undefined) {
        body.max_price = filters.max_price
      }
      if (filters.brand) {
        body.brand = filters.brand
      }
      if (filters.is_gaming !== null && filters.is_gaming !== undefined) {
        body.is_gaming = filters.is_gaming
      }
      if (filters.sort) {
        body.sort = filters.sort
      }
    }

    const response = await fetch(`${API_BASE_URL}/laptopCards?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: PaginatedResponse<LaptopCard> = await response.json()

    if (result.data && Array.isArray(result.data) && result.links && result.meta) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching laptop cards:', error)
    throw error
  }
}

export const fetchLaptopDetail = async (id: number): Promise<LaptopDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/laptopDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<LaptopDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching laptop detail:', error)
    throw error
  }
}

export interface LaptopSuggestionsRequest {
  price: number
  brand_id?: number
  exclude_id?: number
}

export const fetchLaptopSuggestions = async (
  request: LaptopSuggestionsRequest
): Promise<LaptopCard[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/laptopSuggestions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<LaptopCard[]> = await response.json()

    if (result.data && Array.isArray(result.data)) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching laptop suggestions:', error)
    throw error
  }
}

