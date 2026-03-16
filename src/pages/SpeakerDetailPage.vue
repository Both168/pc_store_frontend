<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="speaker"
    :images="speaker?.images || []"
    :product-name="speaker?.name || ''"
    :price="speaker?.price || '0'"
    :discount-price="speaker?.discount_price"
    :description="speaker?.description"
    :show-description-on-left="true"
    @retry="loadSpeakerDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="speaker?.brand_id"
        :to="`/brandDetail/${speaker.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="speaker?.brand" :src="speaker.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="speaker?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="speaker.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="speaker?.in_stock === 'unavailable' || speaker?.in_stock === 'out of stock' || speaker?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="speaker?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="speaker?.connection && speaker.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.connection.join(', ') }}</div>
        </div>
        <div v-if="speaker?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.type }}</div>
        </div>
        <div v-if="speaker?.output_power_rms">
          <div class="text-sm text-[#8a9ba8]">Output Power (RMS)</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.output_power_rms }}</div>
        </div>
        <div v-if="speaker?.is_rgb">
          <div class="text-sm text-[#8a9ba8]">RGB</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.is_rgb }}</div>
        </div>
        <div v-if="speaker?.power_source">
          <div class="text-sm text-[#8a9ba8]">Power Source</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.power_source }}</div>
        </div>
        <div v-if="speaker?.dimension">
          <div class="text-sm text-[#8a9ba8]">Dimension</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.dimension }}</div>
        </div>
        <div v-if="speaker?.weight">
          <div class="text-sm text-[#8a9ba8]">Weight</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.weight }}</div>
        </div>
        <div v-if="speaker?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ speaker.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchSpeakerDetail, type SpeakerDetail } from '../services/apiPeripheral'

const route = useRoute()

const speaker = ref<SpeakerDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadSpeakerDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Speaker ID')
    }

    const data = await fetchSpeakerDetail(id)
    speaker.value = data
  } catch (err) {
    console.error('Error loading speaker detail:', err)
    error.value = 'Failed to load speaker details'
    speaker.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadSpeakerDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadSpeakerDetail()
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
