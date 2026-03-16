<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="motherboard"
    :images="motherboard?.images || []"
    :product-name="motherboard?.name || ''"
    :price="motherboard?.price || '0'"
    :discount-price="motherboard?.discount_price"
    :description="motherboard?.description"
    :show-description-on-left="true"
    @retry="loadMotherboardDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="motherboard?.brand_id"
        :to="`/brandDetail/${motherboard.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="motherboard?.brand"
          :src="motherboard.brand"
          :alt="motherboard.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </router-link>
      <div v-else-if="motherboard?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="motherboard.brand"
          :alt="motherboard.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
      <div v-else-if="motherboard?.type" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ motherboard.type }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="motherboard?.in_stock === 'unavailable' || motherboard?.in_stock === 'out of stock' || motherboard?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="motherboard?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="motherboard?.type">
          <div class="text-sm text-[#8a9ba8]">CPU Supported</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.type }}</div>
        </div>
        <div v-if="motherboard?.generation">
          <div class="text-sm text-[#8a9ba8]">Generation</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.generation }}</div>
        </div>
        <div v-if="motherboard?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.color }}</div>
        </div>
        <div v-if="motherboard?.form_factor">
          <div class="text-sm text-[#8a9ba8]">Form Factor</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.form_factor }}</div>
        </div>
        <div v-if="motherboard?.socket_supported">
          <div class="text-sm text-[#8a9ba8]">Socket Supported</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.socket_supported }}</div>
        </div>
        <div v-if="motherboard?.ram_type">
          <div class="text-sm text-[#8a9ba8]">RAM Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.ram_type }}</div>
        </div>
        <div v-if="motherboard?.wifi">
          <div class="text-sm text-[#8a9ba8]">WiFi</div>
          <div class="text-[#5a6c7d] font-semibold">{{ motherboard.wifi }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchMotherboardDetail, type MotherboardDetail } from '../services/apiComponent'

const route = useRoute()

const motherboard = ref<MotherboardDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadMotherboardDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Motherboard ID')
    }

    const data = await fetchMotherboardDetail(id)
    motherboard.value = data
  } catch (err) {
    console.error('Error loading Motherboard detail:', err)
    error.value = 'Failed to load Motherboard details'
    motherboard.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMotherboardDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadMotherboardDetail()
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
