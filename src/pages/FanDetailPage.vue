<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="fan"
    :images="fan?.images || []"
    :product-name="fan?.name || ''"
    :price="fan?.price || '0'"
    :discount-price="fan?.discount_price"
    :description="fan?.description"
    :show-description-on-left="true"
    @retry="loadFanDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="fan?.brand_id"
        :to="`/brandDetail/${fan.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="fan?.brand"
          :src="fan.brand"
          :alt="'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </router-link>
      <div v-else-if="fan?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="fan.brand"
          :alt="'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="fan?.in_stock === 'unavailable' || fan?.in_stock === 'out of stock' || fan?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="fan?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="fan?.lighting">
          <div class="text-sm text-[#8a9ba8]">Lighting</div>
          <div class="text-[#5a6c7d] font-semibold">{{ fan.lighting }}</div>
        </div>
        <div v-if="fan?.speed">
          <div class="text-sm text-[#8a9ba8]">Speed</div>
          <div class="text-[#5a6c7d] font-semibold">{{ fan.speed }}</div>
        </div>
        <div v-if="fan?.dimension">
          <div class="text-sm text-[#8a9ba8]">Dimension</div>
          <div class="text-[#5a6c7d] font-semibold">{{ fan.dimension }}</div>
        </div>
        <div v-if="fan?.interface">
          <div class="text-sm text-[#8a9ba8]">Interface</div>
          <div class="text-[#5a6c7d] font-semibold">{{ fan.interface }}</div>
        </div>
        <div v-if="fan?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ fan.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchFanDetail, type FanDetail } from '../services/apiComponent'

const route = useRoute()

const fan = ref<FanDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadFanDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Fan ID')
    }

    const data = await fetchFanDetail(id)
    fan.value = data
  } catch (err) {
    console.error('Error loading Fan detail:', err)
    error.value = 'Failed to load Fan details'
    fan.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadFanDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadFanDetail()
  }
})
</script>

<style scoped>
.brand-logo {
  max-height: 30px;
  max-width: 80px;
  object-fit: contain;
}

.specifications-scrollable {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 0.5rem;
  scrollbar-width: thin;
  scrollbar-color: rgba(90, 108, 125, 0.3) transparent;
}

.specifications-scrollable::-webkit-scrollbar {
  width: 6px;
}

.specifications-scrollable::-webkit-scrollbar-track {
  background: transparent;
}

.specifications-scrollable::-webkit-scrollbar-thumb {
  background: rgba(90, 108, 125, 0.3);
  border-radius: 3px;
}
</style>
