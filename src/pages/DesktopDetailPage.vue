<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="desktop"
    :images="desktop?.images || []"
    :product-name="desktop?.name || ''"
    :price="desktop?.price || '0'"
    :discount-price="desktop?.discount_price"
    :description="desktop?.description"
    :show-description-on-left="true"
    @retry="loadDesktopDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="desktop?.brand?.id"
        :to="`/brandDetail/${desktop.brand.id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="desktop.brand.logo"
          :src="desktop.brand.logo"
          :alt="desktop.brand.name"
          class="brand-logo"
          loading="lazy"
        />
        <div v-else-if="desktop.brand.name" class="text-xs text-[#8a9ba8]">{{ desktop.brand.name }}</div>
      </router-link>
      <div v-else-if="desktop?.brand?.logo" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="desktop.brand.logo"
          :alt="desktop.brand.name"
          class="brand-logo"
          loading="lazy"
        />
      </div>
      <div v-else-if="desktop?.brand?.name" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ desktop.brand.name }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <!-- Desktop doesn't have stock status in the API -->
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="desktop?.cpu">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.cpu') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.cpu }}</div>
        </div>
        <div v-if="desktop?.gpu">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.gpu') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.gpu }}</div>
        </div>
        <div v-if="desktop?.motherboard">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.motherboard') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.motherboard }}</div>
        </div>
        <div v-if="desktop?.ram">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.ram') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.ram }}</div>
        </div>
        <div v-if="desktop?.storage">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.storage') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.storage }}</div>
        </div>
        <div v-if="desktop?.psu">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.psu') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.psu }}</div>
        </div>
        <div v-if="desktop?.cooler">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.cooler') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.cooler }}</div>
        </div>
        <div v-if="desktop?.case">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.case') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.case }}</div>
        </div>
        <div v-if="desktop?.fan">
          <div class="text-sm text-[#8a9ba8]">{{ $t('desktop.detail.fan') }}</div>
          <div class="text-[#5a6c7d] font-semibold">{{ desktop.fan }}</div>
        </div>
      </div>
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import { fetchDesktopDetail, type DesktopDetail } from '../services/apiDesktop'

const route = useRoute()
const { t } = useI18n()

const desktop = ref<DesktopDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const loadDesktopDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid desktop ID')
    }

    const data = await fetchDesktopDetail(id)
    desktop.value = data
  } catch (err) {
    console.error('Error loading desktop detail:', err)
    error.value = t('desktop.detail.error')
    desktop.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadDesktopDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadDesktopDetail()
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

