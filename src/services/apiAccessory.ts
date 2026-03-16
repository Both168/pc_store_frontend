import { API_BASE_URL, type PaginatedResponse } from './apiConfig'

export interface AccessoryCard {
  id: number
  name: string
  price: string
  discount_price?: string | null
  image?: string
}

export interface AccessoryFilters {
  page: number
  min_price?: number | null
  max_price?: number | null
  brand_id?: number | null
  type_accessary_id?: number | null
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

export interface DropdownOption {
  id: number
  name: string
}

export const fetchAccessoryCards = async (
  page: number = 1,
  filters: AccessoryFilters
): Promise<PaginatedResponse<AccessoryCard>> => {
  try {
    const body: any = {
      page,
    }

    if (filters.min_price !== null && filters.min_price !== undefined) {
      body.min_price = filters.min_price
    }
    if (filters.max_price !== null && filters.max_price !== undefined) {
      body.max_price = filters.max_price
    }
    if (filters.brand_id !== null && filters.brand_id !== undefined) {
      body.brand_id = filters.brand_id
    }
    if (filters.type_accessary_id !== null && filters.type_accessary_id !== undefined) {
      body.type_accessary_id = filters.type_accessary_id
    }
    if (filters.sort) {
      body.sort = filters.sort
    }

    const response = await fetch(`${API_BASE_URL}/accessoryCards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const jsonResult = await response.json()

    let result: PaginatedResponse<AccessoryCard>
    
    if (jsonResult.data && jsonResult.links && jsonResult.meta) {
      result = jsonResult
    } else if (jsonResult.data?.data && jsonResult.data?.links && jsonResult.data?.meta) {
      result = jsonResult.data
    } else {
      console.error('Unexpected API response format:', jsonResult)
      throw new Error('Invalid API response format')
    }

    if (result.data && Array.isArray(result.data) && result.links && result.meta) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching accessory cards:', error)
    throw error
  }
}

export const fetchAccessoryTypes = async (): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/type_accessories`, {
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
    console.error('Error fetching accessory types:', error)
    throw error
  }
}

export interface AccessoryDetail {
  id: number
  name: string
  brand: string | null
  brand_id?: number
  type_accessary: string | null
  color: string | null
  price: string
  discount_price: string | null
  images: string[]
  description: string | null
  in_stock: string
}

export const fetchAccessoryDetail = async (id: number): Promise<AccessoryDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/accessoryDetail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: AccessoryDetail = await response.json()

    if (result && result.id) {
      return result
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching accessory detail:', error)
    throw error
  }
}

