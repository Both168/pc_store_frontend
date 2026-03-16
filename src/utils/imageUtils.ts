const OLD_IMAGE_DOMAIN = 'wedding.tuysotheavy.online'
const NEW_IMAGE_DOMAIN = 'ceshi1.fsa2.xyz'

export function transformImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  if (typeof url !== 'string') return ''
  
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname === OLD_IMAGE_DOMAIN) {
      urlObj.hostname = NEW_IMAGE_DOMAIN
      return urlObj.toString()
    }
    return url
  } catch {
    if (url.includes(OLD_IMAGE_DOMAIN)) {
      return url.replace(OLD_IMAGE_DOMAIN, NEW_IMAGE_DOMAIN)
    }
    return url
  }
}

export function transformImageUrls(urls: (string | null | undefined)[]): string[] {
  return urls.map(transformImageUrl).filter(Boolean) as string[]
}
