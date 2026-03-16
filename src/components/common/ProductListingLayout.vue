<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <HeroSection :slides="carouselSlides" />

    <!-- Desktop Layout (>= 1024px) -->
    <ProductListingDesktop
      v-if="screenSize === 'desktop'"
      :loading="loading"
      :error="error"
      :items="items"
      :empty-message="emptyMessage"
      :pagination-links="paginationLinks"
      :pagination-meta="paginationMeta"
      @retry="$emit('retry')"
      @page-change="$emit('page-change', $event)"
    >
      <template #filters>
        <slot name="filters"></slot>
      </template>
      <template #skeleton>
        <slot name="skeleton"></slot>
      </template>
      <template #card="{ item, index }">
        <slot name="card" :item="item" :index="index"></slot>
      </template>
    </ProductListingDesktop>

    <!-- Tablet Layout (768px - 1023px) -->
    <ProductListingTablet
      v-else-if="screenSize === 'tablet'"
      :loading="loading"
      :error="error"
      :items="items"
      :empty-message="emptyMessage"
      :pagination-links="paginationLinks"
      :pagination-meta="paginationMeta"
      @retry="$emit('retry')"
      @page-change="$emit('page-change', $event)"
    >
      <template #filters>
        <slot name="filters"></slot>
      </template>
      <template #skeleton>
        <slot name="skeleton"></slot>
      </template>
      <template #card="{ item, index }">
        <slot name="card" :item="item" :index="index"></slot>
      </template>
    </ProductListingTablet>

    <!-- Mobile Layout (< 768px) -->
    <ProductListingMobile
      v-else
      :loading="loading"
      :error="error"
      :items="items"
      :empty-message="emptyMessage"
      :pagination-links="paginationLinks"
      :pagination-meta="paginationMeta"
      @retry="$emit('retry')"
      @page-change="$emit('page-change', $event)"
    >
      <template #filters>
        <slot name="filters"></slot>
      </template>
      <template #skeleton>
        <slot name="skeleton"></slot>
      </template>
      <template #card="{ item, index }">
        <slot name="card" :item="item" :index="index"></slot>
      </template>
    </ProductListingMobile>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, defineAsyncComponent } from 'vue'
import HeroSection from './HeroSection.vue'
import Footer from '../layout/Footer.vue'
import type { PaginationLinks, PaginationMeta } from '../../services/apiConfig'

const ProductListingDesktop = defineAsyncComponent(() => import('./ProductListingLayout/ProductListingDesktop.vue'))
const ProductListingTablet = defineAsyncComponent(() => import('./ProductListingLayout/ProductListingTablet.vue'))
const ProductListingMobile = defineAsyncComponent(() => import('./ProductListingLayout/ProductListingMobile.vue'))

interface Props {
  carouselSlides: Array<{ image: string; title?: string; content?: string }>
  loading: boolean
  error: string | null
  items: any[] | null
  emptyMessage?: string
  paginationLinks?: PaginationLinks | null
  paginationMeta?: PaginationMeta | null
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'No items found',
  paginationLinks: null,
  paginationMeta: null,
})

defineEmits<{
  (e: 'retry'): void
  (e: 'page-change', page: number): void
}>()

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1024)

const screenSize = computed(() => {
  if (windowWidth.value < 768) {
    return 'mobile'
  } else if (windowWidth.value < 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize)
  }
})
</script>

<style scoped>
</style>

