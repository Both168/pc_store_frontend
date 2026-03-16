import { API_BASE_URL, type PaginatedResponse, type ApiResponse } from './apiConfig'

export interface DesktopCard {
  id?: number
  name: string
  image: string
  price: string
  discount_price?: string | null
}

export interface Brand {
  id: number
  name: string
  logo?: string
}

export interface DesktopDetail {
  id: number
  name: string
  brand_id: number
  brand: Brand
  motherboard: string
  cooler: string
  psu: string
  cpu: string
  gpu: string
  ram: string
  case: string
  fan: string
  storage: string
  images: string[]
  price: string
  discount_price?: string | null
  description: string
}

export interface DesktopFilters {
  min_price?: number | null
  max_price?: number | null
}

export const fetchDesktopCards = async (
  page: number = 1,
  filters?: DesktopFilters
): Promise<PaginatedResponse<DesktopCard>> => {
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
    }

    const response = await fetch(`${API_BASE_URL}/desktopCards?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: PaginatedResponse<DesktopCard> = await response.json()

    if (result.data && Array.isArray(result.data) && result.links && result.meta) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching desktop cards:', error)
    throw error
  }
}

export const fetchDesktopDetail = async (id: number): Promise<DesktopDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/desktopDetail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<DesktopDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching desktop detail:', error)
    throw error
  }
}

