<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <HeroSection :slides="carouselSlides" height="50vh" />

   

    <!-- Brand Slider Section -->
    <section class="pt-0 pb-6 sm:pb-8 md:pb-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-bold text-[#5a6c7d] mb-4 sm:mb-6 md:mb-8 text-left">
          {{ $t('home.brands.title') }}
        </h2>
        <BrandSlider
          :brands="brands"
          :logo-size="logoSize"
          :autoplay="true"
          :speed="50"
        />
      </div>
    </section>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeroSection from '../components/common/HeroSection.vue'
import Footer from '../components/layout/Footer.vue'
import BrandSlider, { type Brand as BrandSliderBrand } from '../components/common/BrandSlider.vue'
import { fetchBanners, type Banner } from '../services/apiHomepage'
import { fetchBrands, type Brand } from '../services/apiBrand'
import { BANNER_PAGES } from '../constants/bannerPages'

const carouselSlides = ref<Array<{ image: string; title?: string; content?: string }>>([])
const brands = ref<BrandSliderBrand[]>([])
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const logoSize = computed(() => {
  if (windowWidth.value < 640) {
    return '60px'
  } else if (windowWidth.value < 768) {
    return '80px'
  } else {
    return '100px'
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const loadBanners = async () => {
  try {
    const banners = await fetchBanners(BANNER_PAGES.HOME)
    
    // Map banners to carousel format
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
    const brandsData = await fetchBrands()
    brands.value = brandsData.map((brand: Brand) => ({
      id: brand.id,
      name: brand.name, // Use actual brand name from API
      image: brand.brand_image_url,
    }))
  } catch (err) {
    console.error('Error loading brands:', err)
    // If API fails, brands array will remain empty
    brands.value = []
  }
}

onMounted(() => {
  loadBanners()
  loadBrands()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

