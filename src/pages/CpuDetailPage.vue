<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="cpu"
    :images="cpu?.images || []"
    :product-name="cpu?.name || ''"
    :price="cpu?.price || '0'"
    :discount-price="cpu?.discount_price"
    :description="cpu?.description"
    :show-description-on-left="true"
    @retry="loadCpuDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="cpu?.brand_id"
        :to="`/brandDetail/${cpu.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <div v-if="cpu?.brand_type" class="text-xs text-[#8a9ba8]">{{ cpu.brand_type }}</div>
      </router-link>
      <div v-else-if="cpu?.brand_type" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ cpu.brand_type }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="cpu?.in_stock === 'unavailable' || cpu?.in_stock === 'out of stock' || cpu?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="cpu?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="cpu?.brand_type">
          <div class="text-sm text-[#8a9ba8]">Brand Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.brand_type }}</div>
        </div>
        <div v-if="cpu?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.color }}</div>
        </div>
        <div v-if="cpu?.performance_cores">
          <div class="text-sm text-[#8a9ba8]">Performance Cores</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.performance_cores }}</div>
        </div>
        <div v-if="cpu?.total_threads">
          <div class="text-sm text-[#8a9ba8]">Total Threads</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.total_threads }}</div>
        </div>
        <div v-if="cpu?.base_frequency">
          <div class="text-sm text-[#8a9ba8]">Base Frequency</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.base_frequency }}</div>
        </div>
        <div v-if="cpu?.max_turbo_frequency">
          <div class="text-sm text-[#8a9ba8]">Max Turbo Frequency</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.max_turbo_frequency }}</div>
        </div>
        <div v-if="cpu?.cache">
          <div class="text-sm text-[#8a9ba8]">Cache</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.cache }}</div>
        </div>
        <div v-if="cpu?.socket_supported">
          <div class="text-sm text-[#8a9ba8]">Socket Supported</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.socket_supported }}</div>
        </div>
        <div v-if="cpu?.generation">
          <div class="text-sm text-[#8a9ba8]">Generation</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.generation }}</div>
        </div>
        <div v-if="cpu?.is_integrated_gpu">
          <div class="text-sm text-[#8a9ba8]">Integrated GPU</div>
          <div class="text-[#5a6c7d] font-semibold">{{ cpu.is_integrated_gpu }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchCpuDetail, type CpuDetail } from '../services/apiComponent'

const route = useRoute()

const cpu = ref<CpuDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadCpuDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid CPU ID')
    }

    const data = await fetchCpuDetail(id)
    cpu.value = data
  } catch (err) {
    console.error('Error loading CPU detail:', err)
    error.value = 'Failed to load CPU details'
    cpu.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCpuDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadCpuDetail()
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
