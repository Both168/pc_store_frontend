<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <HeroSection :slides="carouselSlides" />

    <!-- Brands Section -->
    <section class="py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Loading State -->
        <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <div
            v-for="n in 12"
            :key="n"
            class="neumorphic-card p-6 aspect-square flex items-center justify-center"
          >
            <div class="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-20">
          <div class="text-red-500 text-lg mb-4">{{ error }}</div>
          <NeumorphicButton @click="loadBrands">
            {{ $t('brand.retry') }}
          </NeumorphicButton>
        </div>

        <!-- Brands Grid -->
        <div v-else-if="brands.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          <router-link
            v-for="brand in brands"
            :key="brand.id"
            :to="`/brandDetail/${brand.id}`"
            class="brand-card neumorphic-card p-4 sm:p-5 md:p-6 flex flex-col items-center justify-center cursor-pointer"
          >
            <!-- Logo Container with Inset Shadow -->
            <div class="brand-logo-container w-full flex-1 flex items-center justify-center mb-3 sm:mb-4">
              <img
                v-if="brand.brand_image_url"
                :src="brand.brand_image_url"
                :alt="brand.name"
                class="brand-logo w-full h-full object-contain transition-transform duration-300"
                loading="lazy"
              />
              <div
                v-else
                class="brand-name-placeholder text-[#5a6c7d] font-semibold text-sm sm:text-base md:text-lg text-center px-2"
              >
                {{ brand.name }}
              </div>
            </div>
            <!-- Brand Name -->
            <h3 class="brand-name text-[#5a6c7d] font-semibold text-xs sm:text-sm md:text-base text-center line-clamp-2 w-full">
              {{ brand.name }}
            </h3>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-20">
          <div class="text-[#5a6c7d] text-lg">{{ $t('brand.empty') }}</div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import HeroSection from '../components/common/HeroSection.vue'
import Footer from '../components/layout/Footer.vue'
import NeumorphicButton from '../components/common/Neumorphic/NeumorphicButton.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { fetchBrands, type Brand } from '../services/apiBrand'
import { BANNER_PAGES } from '../constants/bannerPages'

const { t } = useI18n()
const carouselSlides = ref<Array<{ image: string; title?: string; content?: string }>>([])
const brands = ref<Brand[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.BRAND)
    carouselSlides.value = banners.map((banner: Banner) => ({
      image: banner.banner_image_url,
      title: `Banner ${banner.id}`,
      content: '',
      product_id: banner.product_id,
    }))
  } catch (err) {
    console.error('Error loading banners:', err)
  }
}

const loadBrands = async () => {
  try {
    loading.value = true
    error.value = null
    const brandsData = await fetchBrands()
    brands.value = brandsData
  } catch (err) {
    console.error('Error loading brands:', err)
    error.value = t('brand.error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBanners()
  loadBrands()
})
</script>

<style scoped>
.brand-card {
  min-height: 180px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 
    30px 30px 60px rgba(199, 204, 211, 0.5), 
    -30px -30px 60px rgba(255, 255, 255, 0.7),
    inset 2px 2px 4px rgba(199, 204, 211, 0.1);
  border-radius: 2rem;
  text-decoration: none;
  color: inherit;
  display: flex;
}

.brand-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    35px 35px 70px rgba(199, 204, 211, 0.6), 
    -35px -35px 70px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(199, 204, 211, 0.1);
}

.brand-logo-container {
  width: 100%;
  min-height: 100px;
  height: 120px;
  border-radius: 1.25rem;
  overflow: hidden;
  background: #e0e5ec;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  box-shadow: 
    inset 8px 8px 16px rgba(199, 204, 211, 0.4),
    inset -8px -8px 16px rgba(255, 255, 255, 0.6);
  transition: box-shadow 0.3s ease;
}

.brand-card:hover .brand-logo-container {
  box-shadow: 
    inset 10px 10px 20px rgba(199, 204, 211, 0.5),
    inset -10px -10px 20px rgba(255, 255, 255, 0.7);
}

.brand-logo {
  max-width: 90%;
  max-height: 90%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease, filter 0.3s ease;
}

.brand-card:hover .brand-logo {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));
}

.brand-name-placeholder {
  word-break: break-word;
  line-height: 1.3;
  padding: 0.5rem;
}

.brand-name {
  line-height: 1.4;
  min-height: 2.8em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 640px) {
  .brand-card {
    min-height: 200px;
  }
  
  .brand-logo-container {
    min-height: 120px;
    height: 140px;
  }
}

@media (min-width: 1024px) {
  .brand-card {
    min-height: 220px;
  }
  
  .brand-logo-container {
    min-height: 140px;
    height: 160px;
  }
}
</style>
