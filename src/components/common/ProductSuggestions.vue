<template>
  <div v-if="items && items.length > 0" class="product-suggestions" :class="screenSize">
    <div class="suggestions-container">
      <h2 class="suggestions-title">Suggested Products</h2>
      <div class="suggestions-grid">
        <template v-for="(item, index) in items" :key="`suggested-${item.id || index}`">
          <slot :item="item" :index="index">
            <!-- Default slot: Use SuggestionCard if no custom card provided -->
            <SuggestionCard
              :id="item.id"
              :name="item.name"
              :image="item.image"
              :price="item.price"
              :discount-price="item.discount_price || item.discountPrice"
              :route-path="getRoutePath(item)"
            />
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import SuggestionCard from './SuggestionCard.vue'

interface Props {
  items: any[] | null
  routePathBuilder?: (item: any) => string
}

const props = withDefaults(defineProps<Props>(), {
  routePathBuilder: undefined,
})

const getRoutePath = (item: any): string => {
  if (props.routePathBuilder) {
    return props.routePathBuilder(item)
  }
  // Default route path - can be overridden
  return `#`
}

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
.product-suggestions {
  background-color: #e0e5ec;
  width: 100%;
}

.suggestions-container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
}

.suggestions-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #5a6c7d;
  margin-bottom: 1rem;
  text-align: left;
}

.suggestions-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
}

/* Mobile Styles (< 768px) */
.product-suggestions.mobile .suggestions-container {
  padding: 1rem 0.75rem;
}

.product-suggestions.mobile .suggestions-title {
  font-size: 1rem;
  margin-bottom: 0.75rem;
}

.product-suggestions.mobile .suggestions-grid {
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 0.75rem;
}

/* Tablet Styles (768px - 1023px) */
@media (min-width: 768px) {
  .product-suggestions.tablet .suggestions-container {
    padding: 1.5rem 1.5rem;
  }

  .product-suggestions.tablet .suggestions-title {
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .product-suggestions.tablet .suggestions-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
  }
}

/* Desktop Styles (>= 1024px) */
@media (min-width: 1024px) {
  .product-suggestions.desktop .suggestions-container {
    padding: 1.5rem 2rem;
  }

  .product-suggestions.desktop .suggestions-title {
    font-size: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .product-suggestions.desktop .suggestions-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1.5rem;
  }
}

/* Hover effects for suggestion items */
.suggestions-grid > * {
  transition: transform 0.3s ease;
}

.suggestions-grid > *:hover {
  transform: translateY(-4px);
}
</style>

