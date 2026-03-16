<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="cooler"
    :images="cooler?.images || []"
    :product-name="cooler?.name || ''"
    :price="cooler?.price || '0'"
    :discount-price="cooler?.discount_price"
    :description="cooler?.description"
    :show-description-on-left="true"
    @retry="loadCoolerDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="cooler?.brand_id"
        :to="`/brandDetail/${cooler.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="cooler?.brand"
          :src="cooler.brand"
          :alt="cooler.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </router-link>
      <div v-else-if="cooler?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="cooler.brand"
          :alt="cooler.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
      <div v-else-if="cooler?.type" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ cooler.type }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="cooler?.in_stock === 'unavailable' || cooler?.in_stock === 'out of stock' || cooler?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="cooler?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="cooler?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cooler.type }}</div>
        </div>
        <div v-if="cooler?.compatibility">
          <div class="text-sm text-[#8a9ba8]">Compatibility</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cooler.compatibility }}</div>
        </div>
        <div v-if="cooler?.radiator_size">
          <div class="text-sm text-[#8a9ba8]">Radiator Size</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cooler.radiator_size }}</div>
        </div>
        <div v-if="cooler?.tdp">
          <div class="text-sm text-[#8a9ba8]">TDP</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cooler.tdp }}</div>
        </div>
        <div v-if="cooler?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cooler.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchCoolerDetail, type CoolerDetail } from '../services/apiComponent'

const route = useRoute()

const cooler = ref<CoolerDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadCoolerDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Cooler ID')
    }

    const data = await fetchCoolerDetail(id)
    cooler.value = data
  } catch (err) {
    console.error('Error loading Cooler detail:', err)
    error.value = 'Failed to load Cooler details'
    cooler.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCoolerDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadCoolerDetail()
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
