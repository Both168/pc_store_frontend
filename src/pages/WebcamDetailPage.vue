<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="webcam"
    :images="webcam?.images || []"
    :product-name="webcam?.name || ''"
    :price="webcam?.price || '0'"
    :discount-price="webcam?.discount_price"
    :description="webcam?.description"
    :show-description-on-left="true"
    @retry="loadWebcamDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="webcam?.brand_id"
        :to="`/brandDetail/${webcam.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="webcam?.brand" :src="webcam.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="webcam?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="webcam.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="webcam?.in_stock === 'unavailable' || webcam?.in_stock === 'out of stock' || webcam?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="webcam?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="webcam?.connection && webcam.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ webcam.connection.join(', ') }}</div>
        </div>
        <div v-if="webcam?.resolution">
          <div class="text-sm text-[#8a9ba8]">Resolution</div>
          <div class="text-[#5a6c7d] font-semibold">{{ webcam.resolution }}</div>
        </div>
        <div v-if="webcam?.is_microphone">
          <div class="text-sm text-[#8a9ba8]">Microphone</div>
          <div class="text-[#5a6c7d] font-semibold">{{ webcam.is_microphone }}</div>
        </div>
        <div v-if="webcam?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ webcam.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchWebcamDetail, type WebcamDetail } from '../services/apiPeripheral'

const route = useRoute()

const webcam = ref<WebcamDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadWebcamDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Webcam ID')
    }

    const data = await fetchWebcamDetail(id)
    webcam.value = data
  } catch (err) {
    console.error('Error loading webcam detail:', err)
    error.value = 'Failed to load webcam details'
    webcam.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadWebcamDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadWebcamDetail()
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
