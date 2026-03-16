<template>
  <router-link
    :to="routePath"
    class="suggestion-card"
    :class="screenSize"
  >
    <div class="card-image-container">
      <img
        v-if="image"
        :src="image"
        :alt="name"
        class="card-image"
        loading="lazy"
      />
      <div v-else class="card-image-placeholder">
        <svg class="placeholder-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    </div>
    <div class="card-content">
      <h3 class="card-name">{{ name }}</h3>
      <div class="card-price-section">
        <span v-if="hasDiscount" class="card-price-original">${{ price }}</span>
        <span class="card-price-current">${{ displayPrice }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface Props {
  id: number | string
  name: string
  image?: string | null
  price: string
  discountPrice?: string | null
  discount_price?: string | null
  routePath: string
}

const props = withDefaults(defineProps<Props>(), {
  image: null,
  discountPrice: null,
  discount_price: null,
})

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

const hasDiscount = computed(() => {
  const discount = props.discountPrice || props.discount_price
  if (!discount) return false
  if (discount === '' || discount === '0') return false
  const discountNum = parseFloat(discount)
  return !isNaN(discountNum) && discountNum > 0
})

const displayPrice = computed(() => {
  const discount = props.discountPrice || props.discount_price
  return hasDiscount.value ? discount! : props.price
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
.suggestion-card {
  display: flex;
  flex-direction: column;
  background: #e0e5ec;
  border-radius: 0.5rem !important;
  box-shadow: 4px 4px 8px rgba(207, 212, 219, 0.329), -4px -4px 8px rgba(249, 254, 255, 0.4689999999999999);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  cursor: pointer;
}

.suggestion-card:hover {
  transform: translateY(-4px);
  box-shadow: 6px 6px 12px rgba(207, 212, 219, 0.4), -6px -6px 12px rgba(249, 254, 255, 0.5);
}

.card-image-container {
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e5ec;
  overflow: hidden;
  position: relative;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 0.5rem;
}

.card-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e5ec;
  color: #8a9ba8;
}

.placeholder-icon {
  width: 40%;
  height: 40%;
}

.card-content {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.card-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #5a6c7d;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
}

.card-price-section {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.card-price-original {
  font-size: 0.75rem;
  color: #8a9ba8;
  text-decoration: line-through;
}

.card-price-current {
  font-size: 0.875rem;
  font-weight: 700;
  color: #5a6c7d;
}

/* Mobile Styles (< 768px) */
.suggestion-card.mobile .card-content {
  padding: 0.5rem;
  gap: 0.375rem;
}

.suggestion-card.mobile .card-name {
  font-size: 0.75rem;
  -webkit-line-clamp: 2;
}

.suggestion-card.mobile .card-price-original {
  font-size: 0.625rem;
}

.suggestion-card.mobile .card-price-current {
  font-size: 0.75rem;
}

.suggestion-card.mobile .card-image {
  padding: 0.375rem;
}

/* Tablet Styles (768px - 1023px) */
@media (min-width: 768px) {
  .suggestion-card.tablet .card-content {
    padding: 0.75rem;
    gap: 0.5rem;
  }

  .suggestion-card.tablet .card-name {
    font-size: 0.875rem;
    -webkit-line-clamp: 2;
  }

  .suggestion-card.tablet .card-price-original {
    font-size: 0.75rem;
  }

  .suggestion-card.tablet .card-price-current {
    font-size: 0.875rem;
  }

  .suggestion-card.tablet .card-image {
    padding: 0.5rem;
  }
}

/* Desktop Styles (>= 1024px) */
@media (min-width: 1024px) {
  .suggestion-card.desktop .card-content {
    padding: 1rem;
    gap: 0.625rem;
  }

  .suggestion-card.desktop .card-name {
    font-size: 0.9375rem;
    -webkit-line-clamp: 2;
  }

  .suggestion-card.desktop .card-price-original {
    font-size: 0.8125rem;
  }

  .suggestion-card.desktop .card-price-current {
    font-size: 1rem;
  }

  .suggestion-card.desktop .card-image {
    padding: 0.75rem;
  }
}
</style>

