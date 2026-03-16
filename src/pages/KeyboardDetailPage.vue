<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="keyboard"
    :images="keyboard?.images || []"
    :product-name="keyboard?.name || ''"
    :price="keyboard?.price || '0'"
    :discount-price="keyboard?.discount_price"
    :description="keyboard?.description"
    :show-description-on-left="true"
    @retry="loadKeyboardDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="keyboard?.brand_id"
        :to="`/brandDetail/${keyboard.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="keyboard?.brand" :src="keyboard.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="keyboard?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="keyboard.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="keyboard?.in_stock === 'unavailable' || keyboard?.in_stock === 'out of stock' || keyboard?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="keyboard?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="keyboard?.connection && keyboard.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.connection.join(', ') }}</div>
        </div>
        <div v-if="keyboard?.switch_type">
          <div class="text-sm text-[#8a9ba8]">Switch Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.switch_type }}</div>
        </div>
        <div v-if="keyboard?.layout">
          <div class="text-sm text-[#8a9ba8]">Layout</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.layout }}</div>
        </div>
        <div v-if="keyboard?.backlight">
          <div class="text-sm text-[#8a9ba8]">Backlight</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.backlight }}</div>
        </div>
        <div v-if="keyboard?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.color }}</div>
        </div>
        <div v-if="keyboard?.interface">
          <div class="text-sm text-[#8a9ba8]">Interface</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.interface }}</div>
        </div>
        <div v-if="keyboard?.battery">
          <div class="text-sm text-[#8a9ba8]">Battery</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.battery }}</div>
        </div>
        <div v-if="keyboard?.battery_life">
          <div class="text-sm text-[#8a9ba8]">Battery Life</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.battery_life }}</div>
        </div>
        <div v-if="keyboard?.weight">
          <div class="text-sm text-[#8a9ba8]">Weight</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.weight }}</div>
        </div>
        <div v-if="keyboard?.dimensions">
          <div class="text-sm text-[#8a9ba8]">Dimensions</div>
          <div class="text-[#5a6c7d] font-semibold">{{ keyboard.dimensions }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchKeyboardDetail, type KeyboardDetail } from '../services/apiPeripheral'

const route = useRoute()

const keyboard = ref<KeyboardDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadKeyboardDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Keyboard ID')
    }

    const data = await fetchKeyboardDetail(id)
    keyboard.value = data
  } catch (err) {
    console.error('Error loading keyboard detail:', err)
    error.value = 'Failed to load keyboard details'
    keyboard.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadKeyboardDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadKeyboardDetail()
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
