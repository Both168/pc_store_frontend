<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="gpu"
    :images="gpu?.images || []"
    :product-name="gpu?.name || ''"
    :price="gpu?.price || '0'"
    :discount-price="gpu?.discount_price"
    :description="gpu?.description"
    :show-description-on-left="true"
    @retry="loadGpuDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="gpu?.brand_id"
        :to="`/brandDetail/${gpu.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="gpu.brand"
          :src="gpu.brand"
          :alt="gpu.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
        <div v-else-if="gpu?.type" class="text-xs text-[#8a9ba8]">{{ gpu.type }}</div>
      </router-link>
      <div v-else-if="gpu?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="gpu.brand"
          :alt="gpu.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
      <div v-else-if="gpu?.type" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ gpu.type }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="gpu?.in_stock === 'unavailable' || gpu?.in_stock === 'out of stock' || gpu?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="gpu?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="gpu?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.type }}</div>
        </div>
        <div v-if="gpu?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.color }}</div>
        </div>
        <div v-if="gpu?.processing_unit">
          <div class="text-sm text-[#8a9ba8]">Processing Unit</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.processing_unit }}</div>
        </div>
        <div v-if="gpu?.interface">
          <div class="text-sm text-[#8a9ba8]">Interface</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.interface }}</div>
        </div>
        <div v-if="gpu?.memory">
          <div class="text-sm text-[#8a9ba8]">Memory</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.memory }}</div>
        </div>
        <div v-if="gpu?.memory_speed">
          <div class="text-sm text-[#8a9ba8]">Memory Speed</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.memory_speed }}</div>
        </div>
        <div v-if="gpu?.power_consumption">
          <div class="text-sm text-[#8a9ba8]">Power Consumption</div>
          <div class="text-[#5a6c7d] font-semibold">{{ gpu.power_consumption }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchGpuDetail, type GpuDetail } from '../services/apiComponent'

const route = useRoute()

const gpu = ref<GpuDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadGpuDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid GPU ID')
    }

    const data = await fetchGpuDetail(id)
    gpu.value = data
  } catch (err) {
    console.error('Error loading GPU detail:', err)
    error.value = 'Failed to load GPU details'
    gpu.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadGpuDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadGpuDetail()
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

