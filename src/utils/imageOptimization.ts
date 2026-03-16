export function getImageLoadingStrategy(index: number, threshold: number = 3): 'eager' | 'lazy' {
  return index < threshold ? 'eager' : 'lazy'
}

export function getImageFetchPriority(index: number, threshold: number = 3): 'high' | 'auto' {
  return index < threshold ? 'high' : 'auto'
}

export function generateImageSrcSet(url: string, sizes: number[] = [400, 800, 1200]): string {
  if (!url) return ''
  
  return sizes
    .map(size => {
      try {
        const urlObj = new URL(url)
        urlObj.searchParams.set('w', size.toString())
        return `${urlObj.toString()} ${size}w`
      } catch {
        return `${url}?w=${size} ${size}w`
      }
    })
    .join(', ')
}

export function getImageSizes(breakpoints: { mobile: number; tablet: number; desktop: number } = {
  mobile: 100,
  tablet: 50,
  desktop: 33
}): string {
  return `(max-width: 768px) ${breakpoints.mobile}vw, (max-width: 1024px) ${breakpoints.tablet}vw, ${breakpoints.desktop}vw`
}
