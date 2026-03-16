<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="mouse"
    :images="mouse?.images || []"
    :product-name="mouse?.name || ''"
    :price="mouse?.price || '0'"
    :discount-price="mouse?.discount_price"
    :description="mouse?.description"
    :show-description-on-left="true"
    @retry="loadMouseDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="mouse?.brand_id"
        :to="`/brandDetail/${mouse.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="mouse?.brand" :src="mouse.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="mouse?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="mouse.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="mouse?.in_stock === 'unavailable' || mouse?.in_stock === 'out of stock' || mouse?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="mouse?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="mouse?.connection && mouse.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.connection.join(', ') }}</div>
        </div>
        <div v-if="mouse?.battery">
          <div class="text-sm text-[#8a9ba8]">Battery</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.battery }}</div>
        </div>
        <div v-if="mouse?.interface">
          <div class="text-sm text-[#8a9ba8]">Interface</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.interface }}</div>
        </div>
        <div v-if="mouse?.click">
          <div class="text-sm text-[#8a9ba8]">Click</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.click }}</div>
        </div>
        <div v-if="mouse?.polling_rate">
          <div class="text-sm text-[#8a9ba8]">Polling Rate</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.polling_rate }}</div>
        </div>
        <div v-if="mouse?.dpi">
          <div class="text-sm text-[#8a9ba8]">DPI</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.dpi }}</div>
        </div>
        <div v-if="mouse?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.color }}</div>
        </div>
        <div v-if="mouse?.sensor">
          <div class="text-sm text-[#8a9ba8]">Sensor</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.sensor }}</div>
        </div>
        <div v-if="mouse?.battery_life">
          <div class="text-sm text-[#8a9ba8]">Battery Life</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.battery_life }}</div>
        </div>
        <div v-if="mouse?.weight">
          <div class="text-sm text-[#8a9ba8]">Weight</div>
          <div class="text-[#5a6c7d] font-semibold">{{ mouse.weight }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchMouseDetail, type MouseDetail } from '../services/apiPeripheral'

const route = useRoute()

const mouse = ref<MouseDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadMouseDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Mouse ID')
    }

    const data = await fetchMouseDetail(id)
    mouse.value = data
  } catch (err) {
    console.error('Error loading mouse detail:', err)
    error.value = 'Failed to load mouse details'
    mouse.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMouseDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadMouseDetail()
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
