<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="caseItem"
    :images="caseItem?.images || []"
    :product-name="caseItem?.name || ''"
    :price="caseItem?.price || '0'"
    :discount-price="caseItem?.discount_price"
    :description="caseItem?.description"
    :show-description-on-left="true"
    @retry="loadCaseDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="caseItem?.brand_id"
        :to="`/brandDetail/${caseItem.brand_id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="caseItem?.brand"
          :src="caseItem.brand"
          :alt="'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </router-link>
      <div v-else-if="caseItem?.brand" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="caseItem.brand"
          :alt="'Brand'"
          class="brand-logo"
          loading="lazy"
        />
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="caseItem?.in_stock === 'unavailable' || caseItem?.in_stock === 'out of stock' || caseItem?.in_stock === '0'" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
      <div v-else-if="caseItem?.in_stock === 'available'" class="mt-4 text-green-500 font-semibold">
        In Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="caseItem?.form_factors && caseItem.form_factors.length > 0">
          <div class="text-sm text-[#8a9ba8]">Form Factors</div>
          <div class="text-[#5a6c7d] font-semibold">{{ caseItem.form_factors.join(', ') }}</div>
        </div>
        <div v-if="caseItem?.dimension">
          <div class="text-sm text-[#8a9ba8]">Dimension</div>
          <div class="text-[#5a6c7d] font-semibold">{{ caseItem.dimension }}</div>
        </div>
        <div v-if="caseItem?.color">
          <div class="text-sm text-[#8a9ba8]">Color</div>
          <div class="text-[#5a6c7d] font-semibold">{{ caseItem.color }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchCaseDetail, type CaseDetail } from '../services/apiComponent'

const route = useRoute()

const caseItem = ref<CaseDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadCaseDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Case ID')
    }

    const data = await fetchCaseDetail(id)
    caseItem.value = data
  } catch (err) {
    console.error('Error loading Case detail:', err)
    error.value = 'Failed to load Case details'
    caseItem.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCaseDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadCaseDetail()
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
