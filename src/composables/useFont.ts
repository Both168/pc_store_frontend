import { computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { fontFamilies, type Locale } from '../constants/fonts'

export function useFont() {
  const { locale } = useI18n()

  const currentFont = computed(() => {
    return fontFamilies[locale.value as Locale] || fontFamilies.en
  })

  const loadFont = (localeCode: string) => {
    const font = fontFamilies[localeCode as Locale] || fontFamilies.en
    
    // Remove existing font link if any
    const existingLink = document.getElementById('dynamic-font-link')
    if (existingLink) {
      existingLink.remove()
    }

    // Only load Google Font if URL is provided
    if (font.googleFont) {
      // Create and add new font link
      const link = document.createElement('link')
      link.id = 'dynamic-font-link'
      link.rel = 'stylesheet'
      link.href = font.googleFont
      document.head.appendChild(link)
    }

    // Apply font to root element
    document.documentElement.style.fontFamily = font.fontFamily
  }

  // Watch for locale changes and update font
  watch(locale, (newLocale) => {
    loadFont(newLocale)
  })

  // Load font on mount
  onMounted(() => {
    loadFont(locale.value)
  })

  return {
    currentFont,
    fontFamily: computed(() => currentFont.value.fontFamily),
  }
}

