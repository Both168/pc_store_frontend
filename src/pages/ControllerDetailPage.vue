<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="controller"
    :images="controller?.images || []"
    :product-name="controller?.name || ''"
    :price="controller?.price || '0'"
    :discount-price="controller?.discount_price"
    :description="controller?.description"
    :show-description-on-left="true"
    @retry="loadControllerDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="controller?.brand_id"
        :to="`/brandDetail/${controller.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img v-if="controller?.brand" :src="controller.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </router-link>
      <div v-else-if="controller?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img :src="controller.brand" :alt="'Brand logo'" class="brand-logo" loading="lazy" />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="controller?.in_stock === 'unavailable' || controller?.in_stock === 'out of stock' || controller?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="controller?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="controller?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ controller.type }}</div>
        </div>
        <div v-if="controller?.connection && controller.connection.length > 0">
          <div class="text-sm text-[#8a9ba8]">Connection</div>
          <div class="text-[#5a6c7d] font-semibold">{{ controller.connection.join(', ') }}</div>
        </div>
        <div v-if="controller?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ controller.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchControllerDetail, type ControllerDetail } from '../services/apiPeripheral'

const route = useRoute()

const controller = ref<ControllerDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadControllerDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Controller ID')
    }

    const data = await fetchControllerDetail(id)
    controller.value = data
  } catch (err) {
    console.error('Error loading controller detail:', err)
    error.value = 'Failed to load controller details'
    controller.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadControllerDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadControllerDetail()
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
