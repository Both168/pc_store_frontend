<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="monitor"
    :images="monitor?.images || []"
    :product-name="monitor?.name || ''"
    :price="monitor?.price || '0'"
    :discount-price="monitor?.discount_price"
    :description="monitor?.description"
    :show-description-on-left="true"
    @retry="loadMonitorDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="monitor?.brand_id"
        :to="`/brandDetail/${monitor.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="monitor?.brand" :src="monitor.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="monitor?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="monitor.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="monitor?.in_stock === 'unavailable' || monitor?.in_stock === 'out of stock' || monitor?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="monitor?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="monitor?.size">
          <div class="text-sm text-[#8a9ba8]">Size</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.size }}</div>
        </div>
        <div v-if="monitor?.form_factor">
          <div class="text-sm text-[#8a9ba8]">Form Factor</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.form_factor }}</div>
        </div>
        <div v-if="monitor?.panel_type">
          <div class="text-sm text-[#8a9ba8]">Panel Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.panel_type }}</div>
        </div>
        <div v-if="monitor?.resolution">
          <div class="text-sm text-[#8a9ba8]">Resolution</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.resolution }}</div>
        </div>
        <div v-if="monitor?.refresh_rate">
          <div class="text-sm text-[#8a9ba8]">Refresh Rate</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.refresh_rate }}</div>
        </div>
        <div v-if="monitor?.response_time">
          <div class="text-sm text-[#8a9ba8]">Response Time</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.response_time }}</div>
        </div>
        <div v-if="monitor?.stand">
          <div class="text-sm text-[#8a9ba8]">Stand</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.stand }}</div>
        </div>
        <div v-if="monitor?.is_build_in_speaker">
          <div class="text-sm text-[#8a9ba8]">Built-in Speaker</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.is_build_in_speaker }}</div>
        </div>
        <div v-if="monitor?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ monitor.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchMonitorDetail, type MonitorDetail } from '../services/apiPeripheral'

const route = useRoute()

const monitor = ref<MonitorDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadMonitorDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Monitor ID')
    }

    const data = await fetchMonitorDetail(id)
    monitor.value = data
  } catch (err) {
    console.error('Error loading monitor detail:', err)
    error.value = 'Failed to load monitor details'
    monitor.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMonitorDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadMonitorDetail()
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
