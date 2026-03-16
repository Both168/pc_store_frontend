<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="microphone"
    :images="microphone?.images || []"
    :product-name="microphone?.name || ''"
    :price="microphone?.price || '0'"
    :discount-price="microphone?.discount_price"
    :description="microphone?.description"
    :show-description-on-left="true"
    @retry="loadMicrophoneDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="microphone?.brand_id"
        :to="`/brandDetail/${microphone.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="microphone?.brand" :src="microphone.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="microphone?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="microphone.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="microphone?.in_stock === 'unavailable' || microphone?.in_stock === 'out of stock' || microphone?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="microphone?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="microphone?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ microphone.type }}</div>
        </div>
        <div v-if="microphone?.connection && microphone.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ microphone.connection.join(', ') }}</div>
        </div>
        <div v-if="microphone?.is_rgb">
          <div class="text-sm text-[#8a9ba8]">RGB</div>
          <div class="text-[#5a6c7d] font-semibold">{{ microphone.is_rgb }}</div>
        </div>
        <div v-if="microphone?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ microphone.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchMicrophoneDetail, type MicrophoneDetail } from '../services/apiPeripheral'

const route = useRoute()

const microphone = ref<MicrophoneDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadMicrophoneDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Microphone ID')
    }

    const data = await fetchMicrophoneDetail(id)
    microphone.value = data
  } catch (err) {
    console.error('Error loading microphone detail:', err)
    error.value = 'Failed to load microphone details'
    microphone.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadMicrophoneDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadMicrophoneDetail()
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
