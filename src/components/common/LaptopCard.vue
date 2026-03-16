<template>
  <component
    :is="laptop.id ? 'router-link' : 'div'"
    :to="laptop.id ? getDetailRoute(laptop.id) : undefined"
    class="neumorphic-card laptop-card block"
    :class="{ 'out-of-stock-card': isOutOfStock, 'add-to-build-mode': showAddToBuildOnHover }"
  >
    <!-- Image Container -->
    <div class="image-container" :class="{ 'out-of-stock-image': isOutOfStock }">
      <img
        :src="laptop.image"
        :alt="laptop.name"
        class="laptop-image"
        :class="{ 'out-of-stock-img': isOutOfStock }"
        :loading="imageLoading"
        :fetchpriority="imageFetchPriority"
      />
      <!-- Out of Stock Badge -->
      <div v-if="isOutOfStock" class="out-of-stock-badge">
        <img :src="soldoutImage" alt="Sold Out" class="soldout-image" />
      </div>
    </div>

    <!-- Content -->
    <div class="content">
      <h3 class="laptop-name">{{ laptop.name }}</h3>
      
      <!-- Price Section -->
      <div class="price-section neumorphic">
        <template v-if="showAddToBuildOnHover">
          <span class="price-on-hover">
            <span v-if="hasDiscount" class="original-price">${{ laptop.price }}</span>
            <span class="current-price">${{ displayPrice }}</span>
          </span>
          <button
            type="button"
            class="add-to-build-btn"
            @click.stop.prevent="$emit('add-to-build', laptop.id)"
          >
            + Add to build
          </button>
        </template>
        <template v-else>
          <span v-if="hasDiscount" class="original-price">
            ${{ laptop.price }}
          </span>
          <span class="current-price">
            ${{ displayPrice }}
          </span>
        </template>
      </div>
    </div>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getImageLoadingStrategy, getImageFetchPriority } from '../../utils/imageOptimization'
import soldoutImage from '../../assets/images/soldout.png'

export interface LaptopCard {
  id?: number
  name: string
  image: string
  price: string
  discount_price?: string | null
  in_stock: number // 1 = in stock, 0 = out of stock
}

const props = withDefaults(defineProps<{
  laptop: LaptopCard
  detailPath?: string
  index?: number
  showAddToBuildOnHover?: boolean
}>(), {
  detailPath: '/laptop',
  index: undefined,
  showAddToBuildOnHover: false,
})

defineEmits<{
  (e: 'add-to-build', id: number | undefined): void
}>()

const getDetailRoute = (id: number): string => {
  // If detailPath already contains a number (like /component/cpu/2), use it as-is
  if (/\d+$/.test(props.detailPath)) {
    return props.detailPath
  }
  // Otherwise, append the ID (for paths like /laptop, /desktop)
  return `${props.detailPath}/${id}`
}

const imageLoading = computed(() => {
  if (props.index !== undefined) {
    return getImageLoadingStrategy(props.index)
  }
  return 'lazy'
})

const imageFetchPriority = computed(() => {
  if (props.index !== undefined) {
    return getImageFetchPriority(props.index)
  }
  return 'auto'
})

// Check if in_stock is 0 (out of stock)
// in_stock: 1 = in stock, 0 = out of stock
const isOutOfStock = computed(() => {
  return props.laptop.in_stock === 0
})

// Check if discount_price exists and is not null, 0, or empty
const hasDiscount = computed(() => {
  const discount = props.laptop.discount_price
  if (discount === null || discount === undefined || discount === '' || discount === '0') {
    return false
  }
  // Convert to number and check if it's greater than 0
  const discountNum = parseFloat(discount)
  return !isNaN(discountNum) && discountNum > 0
})

// Display price: use discount_price if available, otherwise use regular price
const displayPrice = computed(() => {
  return hasDiscount.value ? props.laptop.discount_price! : props.laptop.price
})
</script>

<style scoped>
.laptop-card {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  /* Increased intensity neumorphic style */
  box-shadow: 
    30px 30px 60px rgba(199, 204, 211, 0.5), 
    -30px -30px 60px rgba(255, 255, 255, 0.7),
    inset 2px 2px 4px rgba(199, 204, 211, 0.1);
  border-radius: 2rem;
}

.laptop-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    35px 35px 70px rgba(199, 204, 211, 0.6), 
    -35px -35px 70px rgba(255, 255, 255, 0.8),
    inset 2px 2px 4px rgba(199, 204, 211, 0.1);
}

.out-of-stock-card {
  position: relative;
}

.out-of-stock-badge {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.soldout-image {
  width: auto;
  height: 4rem;
  object-fit: contain;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}

@media (min-width: 640px) {
  .soldout-image {
    height: 4.5rem;
  }
}

@media (min-width: 1024px) {
  .soldout-image {
    height: 5rem;
  }
}

.out-of-stock-image {
  position: relative;
}

.out-of-stock-image::after {
  /* No overlay for sold out items */
}

.out-of-stock-img {
  /* No blur or grayscale for sold out items */
}

.image-container {
  width: 100%;
  height: 140px;
  margin-bottom: 0.75rem;
  border-radius: 20px;
  overflow: hidden;
  background: #e0e5ec;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Increased intensity inset shadow for depth */
  box-shadow: 
    inset 8px 8px 16px rgba(199, 204, 211, 0.4),
    inset -8px -8px 16px rgba(255, 255, 255, 0.6);
}

.laptop-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center;
  transition: transform 0.3s ease;
}

.laptop-card:hover .laptop-image {
  transform: scale(1.05);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.laptop-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #5a6c7d;
  line-height: 1.3;
  margin: 0;
}

.price-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  /* Increased intensity neumorphic pop-up effect for price */
  box-shadow: 
    12px 12px 24px rgba(199, 204, 211, 0.5), 
    -12px -12px 24px rgba(255, 255, 255, 0.7),
    inset 1px 1px 2px rgba(199, 204, 211, 0.1);
}

.add-to-build-mode .price-section {
  position: relative;
  min-height: 2.75rem;
}

.add-to-build-mode .price-on-hover {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: opacity 0.2s ease;
}

.add-to-build-mode .add-to-build-btn {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  opacity: 0;
  border: none;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5a6c7d;
  background: #e0e5ec;
  cursor: pointer;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.49);
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.add-to-build-mode:hover .add-to-build-btn {
  opacity: 1;
  pointer-events: auto;
}

.add-to-build-mode:hover .price-on-hover {
  opacity: 0;
  pointer-events: none;
}

.add-to-build-btn:hover {
  transform: translateY(-1px);
}

.original-price {
  font-size: 0.75rem;
  color: #8a9ba8;
  text-decoration: line-through;
}

.current-price {
  font-size: 1rem;
  font-weight: 700;
  color: #5a6c7d;
}

@media (min-width: 640px) {
  .image-container {
    height: 160px;
  }
  
  .laptop-name {
    font-size: 0.9375rem;
  }
  
  .current-price {
    font-size: 1.125rem;
  }
}

@media (min-width: 1024px) {
  .image-container {
    height: 180px;
  }
  
  .laptop-name {
    font-size: 1rem;
  }
  
  .current-price {
    font-size: 1.25rem;
  }
}
</style>

