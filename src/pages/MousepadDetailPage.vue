<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="mousepad"
    :images="mousepad?.images || []"
    :product-name="mousepad?.name || ''"
    :price="mousepad?.price || '0'"
    :discount-price="mousepad?.discount_price"
    :description="mousepad?.description"
    :show-description-on-left="true"
    @retry="loadMousepadDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="mousepad?.brand_id"
        :to="`/brandDetail/${mousepad.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="mousepad?.brand" :src="mousepad.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="mousepad?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="mousepad.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="mousepad?.in_stock === 'unavailable' || mousepad?.in_stock === 'out of stock' || mousepad?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="mousepad?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="mousepad?.size">
          <div class="text-sm text-[#8a9ba8]">Size</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mousepad.size }}</div>
        </div>
        <div v-if="mousepad?.material">
          <div class="text-sm text-[#8a9ba8]">Material</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mousepad.material }}</div>
        </div>
        <div v-if="mousepad?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mousepad.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchMousepadDetail, type MousepadDetail } from '../services/apiPeripheral'

const route = useRoute()

const mousepad = ref<MousepadDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadMousepadDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Mousepad ID')
    }

    const data = await fetchMousepadDetail(id)
    mousepad.value = data
  } catch (err) {
    console.error('Error loading mousepad detail:', err)
    error.value = 'Failed to load mousepad details'
    mousepad.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMousepadDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadMousepadDetail()
  }
})
</script>

<style scoped>
.brand-logo {
  max-height: 30px;
  max-width: 80px;
  object-fit: contain;
}
</style>
