// Re-export all API services for backward compatibility
// You can import from specific files or use this index file

export * from './apiConfig'
export * from './apiComponent'

// Explicit exports from apiHomepage
export type { Banner } from './apiHomepage'
export { fetchBanners } from './apiHomepage'

// Brand exports from apiBrand
export type { Brand, BrandDetail } from './apiBrand'
export { fetchBrands, fetchBrandDetail } from './apiBrand'

// Explicit exports from apiLaptop (excluding Brand to avoid conflict)
export type { LaptopCard, LaptopDetail, LaptopFilters, LaptopSuggestionsRequest } from './apiLaptop'
export { fetchLaptopCards, fetchLaptopDetail, fetchLaptopSuggestions } from './apiLaptop'
export type { Brand as LaptopBrand } from './apiLaptop'

