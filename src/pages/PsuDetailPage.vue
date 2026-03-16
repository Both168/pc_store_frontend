<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="psu"
    :images="psu?.images || []"
    :product-name="psu?.name || ''"
    :price="psu?.price || '0'"
    :discount-price="psu?.discount_price"
    :description="psu?.description"
    :show-description-on-left="true"
    @retry="loadPsuDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="psu?.brand_id"
        :to="`/brandDetail/${psu.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="psu?.brand"
          :src="psu.brand"
          :alt="'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </router-link>
      <div v-else-if="psu?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="psu.brand"
          :alt="'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="psu?.in_stock === 'unavailable' || psu?.in_stock === 'out of stock' || psu?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="psu?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="psu?.wattage">
          <div class="text-sm text-[#8a9ba8]">Wattage</div>
          <div class="text-[#5a6c7d] font-semibold">{{ psu.wattage }}</div>
        </div>
        <div v-if="psu?.form_factor">
          <div class="text-sm text-[#8a9ba8]">Form Factor</div>
          <div class="text-[#5a6c7d] font-semibold">{{ psu.form_factor }}</div>
        </div>
        <div v-if="psu?.cable_management">
          <div class="text-sm text-[#8a9ba8]">Cable Management</div>
          <div class="text-[#5a6c7d] font-semibold">{{ psu.cable_management }}</div>
        </div>
        <div v-if="psu?.power_rating">
          <div class="text-sm text-[#8a9ba8]">Power Rating</div>
          <div class="text-[#5a6c7d] font-semibold">{{ psu.power_rating }}</div>
        </div>
        <div v-if="psu?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ psu.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchPsuDetail, type PsuDetail } from '../services/apiComponent'

const route = useRoute()

const psu = ref<PsuDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadPsuDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid PSU ID')
    }

    const data = await fetchPsuDetail(id)
    psu.value = data
  } catch (err) {
    console.error('Error loading PSU detail:', err)
    error.value = 'Failed to load PSU details'
    psu.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPsuDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadPsuDetail()
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
