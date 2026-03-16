import { computed } from 'vue'
import { transformImageUrl, transformImageUrls } from '../utils/imageUtils'

export function useImageTransform() {
  const transform = (url: string | null | undefined): string => {
    return transformImageUrl(url)
  }

  const transformArray = (urls: (string | null | undefined)[]): string[] => {
    return transformImageUrls(urls)
  }

  const transformComputed = (url: string | null | undefined) => {
    return computed(() => transformImageUrl(url))
  }

  const transformArrayComputed = (urls: (string | null | undefined)[]) => {
    return computed(() => transformImageUrls(urls))
  }

  return {
    transform,
    transformArray,
    transformComputed,
    transformArrayComputed,
  }
}
