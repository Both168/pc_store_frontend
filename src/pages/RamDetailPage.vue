<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="ram"
    :images="ram?.images || []"
    :product-name="ram?.name || ''"
    :price="ram?.price || '0'"
    :discount-price="ram?.discount_price"
    :description="ram?.description"
    :show-description-on-left="true"
    @retry="loadRamDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="ram?.brand_id"
        :to="`/brandDetail/${ram.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <div v-if="ram?.ram_type" class="text-xs text-[#8a9ba8]">{{ ram.ram_type }}</div>
      </router-link>
      <div v-else-if="ram?.ram_type" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ ram.ram_type }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="ram?.in_stock === 'unavailable' || ram?.in_stock === 'out of stock' || ram?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="ram?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="ram?.ram_type">
          <div class="text-sm text-[#8a9ba8]">RAM Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ ram.ram_type }}</div>
        </div>
        <div v-if="ram?.capacity">
          <div class="text-sm text-[#8a9ba8]">Capacity</div>
          <div class="text-[#5a6c7d] font-semibold">{{ ram.capacity }}</div>
        </div>
        <div v-if="ram?.speed">
          <div class="text-sm text-[#8a9ba8]">Speed</div>
          <div class="text-[#5a6c7d] font-semibold">{{ ram.speed }}</div>
        </div>
        <div v-if="ram?.cas_latency">
          <div class="text-sm text-[#8a9ba8]">CAS Latency</div>
          <div class="text-[#5a6c7d] font-semibold">{{ ram.cas_latency }}</div>
        </div>
        <div v-if="ram?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ ram.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchRamDetail, type RamDetail } from '../services/apiComponent'

const route = useRoute()

const ram = ref<RamDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadRamDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid RAM ID')
    }

    const data = await fetchRamDetail(id)
    ram.value = data
  } catch (err) {
    console.error('Error loading RAM detail:', err)
    error.value = 'Failed to load RAM details'
    ram.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadRamDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadRamDetail()
  }
})
</script>

<style scoped>
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
