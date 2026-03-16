import { createI18n } from 'vue-i18n'
import en from './locales/en'
import km from './locales/km'
import zh from './locales/zh'
import th from './locales/th'
import vi from './locales/vi'

const messages = {
  en,
  km,
  zh,
  th,
  vi,
}

// Get saved language from localStorage or default to English
const savedLocale = localStorage.getItem('locale') || 'en'
const validLocales = ['en', 'km', 'zh', 'th', 'vi']
const locale = validLocales.includes(savedLocale) ? savedLocale : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

export default i18n

