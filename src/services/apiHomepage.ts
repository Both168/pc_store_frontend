import { API_BASE_URL, type ApiResponse } from './apiConfig'

export interface Banner {
  id: number
  banner_image_url: string
  page: number
  product_id: number
}

export interface Brand {
  id: number
  brand_image_url: string
  name: string
}

export interface BrandDetail {
  id: number
  name: string
  brand_image_url: string
  description?: string
  website?: string
  founded_year?: number
  country?: string
  [key: string]: any
}

export const fetchBanners = async (page: number = 1): Promise<Banner[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/banners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ page }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: ApiResponse<Banner[]> = await response.json()

    if (result.data && Array.isArray(result.data)) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching banners:', error)
    throw error
  }
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

    const result: ApiResponse<BrandDetail> = await response.json()

    if (result.data) {
      return result.data
    }

    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching brand detail:', error)
    throw error
  }
}

