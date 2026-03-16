export const BANNER_PAGES = {
  HOME: 1,
  LAPTOP: 2,
  DESKTOP: 3,
  COMPONENT: 4,
  PERIPHERAL: 5,
  ACCESSORIES: 6,
  BRAND: 7,
} as const

export type BannerPage = typeof BANNER_PAGES[keyof typeof BANNER_PAGES]
