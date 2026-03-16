<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="storage"
    :images="storage?.images || []"
    :product-name="storage?.name || ''"
    :price="storage?.price || '0'"
    :discount-price="storage?.discount_price"
    :description="storage?.description"
    :show-description-on-left="true"
    @retry="loadStorageDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="storage?.brand_id"
        :to="`/brandDetail/${storage.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="storage?.brand"
          :src="storage.brand"
          :alt="storage.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </router-link>
      <div v-else-if="storage?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="storage.brand"
          :alt="storage.type || 'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
      <div v-else-if="storage?.type" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ storage.type }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="storage?.in_stock === 'unavailable' || storage?.in_stock === 'out of stock' || storage?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="storage?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="storage?.type">
          <div class="text-sm text-[#8a9ba8]">Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.type }}</div>
        </div>
        <div v-if="storage?.capacity">
          <div class="text-sm text-[#8a9ba8]">Capacity</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.capacity }}</div>
        </div>
        <div v-if="storage?.interface">
          <div class="text-sm text-[#8a9ba8]">Interface</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.interface }}</div>
        </div>
        <div v-if="storage?.form_factor">
          <div class="text-sm text-[#8a9ba8]">Form Factor</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.form_factor }}</div>
        </div>
        <div v-if="storage?.read_speed">
          <div class="text-sm text-[#8a9ba8]">Read Speed</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.read_speed }}</div>
        </div>
        <div v-if="storage?.write_speed">
          <div class="text-sm text-[#8a9ba8]">Write Speed</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.write_speed }}</div>
        </div>
        <div v-if="storage?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ storage.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchStorageDetail, type StorageDetail } from '../services/apiComponent'

const route = useRoute()

const storage = ref<StorageDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadStorageDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Storage ID')
    }

    const data = await fetchStorageDetail(id)
    storage.value = data
  } catch (err) {
    console.error('Error loading Storage detail:', err)
    error.value = 'Failed to load Storage details'
    storage.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStorageDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadStorageDetail()
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
