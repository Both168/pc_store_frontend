import { API_BASE_URL, type ApiResponse } from './apiConfig'

export interface Brand {
  id: number
  brand_image_url: string
  name: string
}

export interface ProductCard {
  id: number
  name: string
  image: string
  price: string
  discount_price?: string | null
  in_stock?: number
}

export interface ProductCategoryData {
  data: ProductCard[]
}

export interface BrandDetail {
  id: number
  name: string
  image: string
  country?: string
  status?: number | string
  laptop?: ProductCategoryData
  desktop?: ProductCategoryData
  gpu?: ProductCategoryData
  motherboard?: ProductCategoryData
  ram?: ProductCategoryData
  storage?: ProductCategoryData
  case?: ProductCategoryData
  psu?: ProductCategoryData
  cooler?: ProductCategoryData
  fan?: ProductCategoryData
  mouse?: ProductCategoryData
  keyboard?: ProductCategoryData
  headset?: ProductCategoryData
  speaker?: ProductCategoryData
  monitor?: ProductCategoryData
  mousepad?: ProductCategoryData
  accessory?: ProductCategoryData
  webcam?: ProductCategoryData
  microphone?: ProductCategoryData
  controller?: ProductCategoryData
}

export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Brand[]> = await response.json()

    if (result.data && Array.isArray(result.data)) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching brands:', error)
    throw error
  }
}

export const fetchBrandDetail = async (id: number): Promise<BrandDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}/brandDetail?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()

    // Handle both wrapped and direct response formats
    if (result.data && typeof result.data === 'object' && 'id' in result.data) {
      // Response is wrapped in { data: ... }
      return result.data as BrandDetail
    } else if (result.id && typeof result === 'object') {
      // Response is direct: { id: ..., name: ..., ... }
      return result as BrandDetail
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching brand detail:', error)
    throw error
  }
}
