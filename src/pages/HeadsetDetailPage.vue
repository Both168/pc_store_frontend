<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="headset"
    :images="headset?.images || []"
    :product-name="headset?.name || ''"
    :price="headset?.price || '0'"
    :discount-price="headset?.discount_price"
    :description="headset?.description"
    :show-description-on-left="true"
    @retry="loadHeadsetDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="headset?.brand_id"
        :to="`/brandDetail/${headset.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="headset?.brand" :src="headset.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="headset?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="headset.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="headset?.in_stock === 'unavailable' || headset?.in_stock === 'out of stock' || headset?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="headset?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="headset?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.type }}</div>
        </div>
        <div v-if="headset?.connection && headset.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.connection.join(', ') }}</div>
        </div>
        <div v-if="headset?.audio_driver">
          <div class="text-sm text-[#8a9ba8]">Audio Driver</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.audio_driver }}</div>
        </div>
        <div v-if="headset?.sound_channel">
          <div class="text-sm text-[#8a9ba8]">Sound Channel</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.sound_channel }}</div>
        </div>
        <div v-if="headset?.is_microphone">
          <div class="text-sm text-[#8a9ba8]">Microphone</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.is_microphone }}</div>
        </div>
        <div v-if="headset?.weight">
          <div class="text-sm text-[#8a9ba8]">Weight</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.weight }}</div>
        </div>
        <div v-if="headset?.battery">
          <div class="text-sm text-[#8a9ba8]">Battery</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.battery }}</div>
        </div>
        <div v-if="headset?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ headset.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchHeadsetDetail, type HeadsetDetail } from '../services/apiPeripheral'

const route = useRoute()

const headset = ref<HeadsetDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadHeadsetDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Headset ID')
    }

    const data = await fetchHeadsetDetail(id)
    headset.value = data
  } catch (err) {
    console.error('Error loading headset detail:', err)
    error.value = 'Failed to load headset details'
    headset.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadHeadsetDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadHeadsetDetail()
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
