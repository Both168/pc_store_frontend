<template>
  <footer class="footer-container py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <!-- About Us -->
        <div>
          <h3 class="text-lg font-semibold text-[#5a6c7d] mb-3">
            {{ $t('footer.aboutUs') }}
          </h3>
          <p class="text-[#5a6c7d] text-sm leading-relaxed">
            {{ $t('footer.description') }}
          </p>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-lg font-semibold text-[#5a6c7d] mb-4">
            {{ $t('footer.contact') }}
          </h3>
          <ul class="space-y-3 text-[#5a6c7d] text-sm">
            <li v-if="contact.telegram" class="flex items-center gap-3">
              <a
                :href="contact.telegram"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 hover:opacity-80 transition-opacity"
                :aria-label="$t('footer.telegram')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 flex-shrink-0">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span>{{ $t('footer.telegram') }}</span>
              </a>
            </li>
            <li v-if="contact.facebook" class="flex items-center gap-3">
              <a
                :href="contact.facebook"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-3 hover:opacity-80 transition-opacity"
                :aria-label="$t('footer.facebook')"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 flex-shrink-0">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>{{ $t('footer.facebook') }}</span>
              </a>
            </li>
            <li v-if="contact.phone" class="flex items-center gap-3">
              <a
                :href="`tel:${contact.phone}`"
                class="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 flex-shrink-0">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span>{{ contact.phone }}</span>
              </a>
            </li>
            <li v-if="contact.location" class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5 flex-shrink-0 mt-0.5">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span>{{ contact.location }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-[#5a6c7d]/20 text-center text-[#5a6c7d] text-xs">
        {{ $t('footer.copyright') }} © {{ new Date().getFullYear() }} {{ $t('footer.logo') }}. {{ $t('footer.rights') }}
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const contact = {
  telegram: 'https://t.me/your_username',
  facebook: 'https://facebook.com/your_page',
  phone: '+1234567890',
  location: computed(() => t('footer.address')),
}
</script>

<style scoped>
.footer-container {
  background-color: #e0e5ec;
  box-shadow: 0 -2px 8px rgba(199, 204, 211, 0.3);
}
</style>
