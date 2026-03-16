<template>
  <ProductDetailLayout
    :loading="loading"
    :error="error"
    :product="laptop"
    :images="laptop?.images || []"
    :product-name="laptop?.name || ''"
    :price="laptop?.price || '0'"
    :discount-price="laptop?.discount_price"
    :description="laptop?.description"
    :show-description-on-left="true"
    @retry="loadLaptopDetail"
  >
    <!-- Brand Badge Slot -->
    <template #brand-badge>
      <router-link
        v-if="laptop?.brand?.id"
        :to="`/brandDetail/${laptop.brand.id}`"
        class="neumorphic-card p-2 absolute -top-2 right-0 cursor-pointer hover:scale-105 transition-transform"
        style="text-decoration: none; color: inherit;"
      >
        <img
          v-if="laptop.brand.logo"
          :src="laptop.brand.logo"
          :alt="laptop.brand.name"
          class="brand-logo"
          loading="lazy"
        />
        <div v-else-if="laptop.brand.name" class="text-xs text-[#8a9ba8]">{{ laptop.brand.name }}</div>
      </router-link>
      <div v-else-if="laptop?.brand?.logo" class="neumorphic-card p-2 absolute -top-2 right-0">
        <img
          :src="laptop.brand.logo"
          :alt="laptop.brand.name"
          class="brand-logo"
          loading="lazy"
        />
      </div>
      <div v-else-if="laptop?.brand?.name" class="neumorphic-card p-2 absolute -top-2 right-0">
        <div class="text-xs text-[#8a9ba8]">{{ laptop.brand.name }}</div>
      </div>
    </template>

    <!-- Stock Status Slot -->
    <template #stock-status>
      <div v-if="laptop?.in_stock === 0" class="mt-4 text-red-500 font-semibold">
        Out of Stock
      </div>
    </template>

    <!-- Specifications Slot -->
    <template #specifications>
      <div class="specifications-scrollable grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-if="laptop?.processor">
          <div class="text-sm text-[#8a9ba8]">Processor</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.processor }}</div>
        </div>
        <div v-if="laptop?.gpu">
          <div class="text-sm text-[#8a9ba8]">GPU</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.gpu }}</div>
        </div>
        <div v-if="laptop?.ram">
          <div class="text-sm text-[#8a9ba8]">RAM</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.ram }}</div>
        </div>
        <div v-if="laptop?.storage">
          <div class="text-sm text-[#8a9ba8]">Storage</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.storage }}</div>
        </div>
        <div v-if="laptop?.screen_size">
          <div class="text-sm text-[#8a9ba8]">Screen Size</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.screen_size }}</div>
        </div>
        <div v-if="laptop?.screen_type">
          <div class="text-sm text-[#8a9ba8]">Screen Type</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.screen_type }}</div>
        </div>
        <div v-if="laptop?.weight">
          <div class="text-sm text-[#8a9ba8]">Weight</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.weight }} kg</div>
        </div>
        <div v-if="laptop?.battery">
          <div class="text-sm text-[#8a9ba8]">Battery</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.battery }}</div>
        </div>
        <div v-if="laptop?.os">
          <div class="text-sm text-[#8a9ba8]">OS</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.os }}</div>
        </div>
        <div v-if="laptop?.ports">
          <div class="text-sm text-[#8a9ba8]">Ports</div>
          <div class="text-[#5a6c7d] font-semibold">{{ laptop.ports }}</div>
        </div>
      </div>
    </template>

    <!-- Suggestions Slot -->
    <template #suggestions>
      <ProductSuggestions
        :items="suggestedLaptops"
        :route-path-builder="(item) => `/laptop/${item.id}`"
      />
    </template>
  </ProductDetailLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import ProductDetailLayout from '../components/common/ProductDetailLayout.vue'
import ProductSuggestions from '../components/common/ProductSuggestions.vue'
import { fetchLaptopDetail, fetchLaptopSuggestions, type LaptopDetail, type LaptopCard as LaptopCardType } from '../services/apiLaptop'

const route = useRoute()
const { t } = useI18n()

const laptop = ref<LaptopDetail | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const suggestedLaptops = ref<LaptopCardType[]>([])

const loadLaptopDetail = async () => {
  loading.value = true
  error.value = null

  try {
    const id = Number(route.params.id || route.query.id)
    if (!id || isNaN(id)) {
      throw new Error('Invalid Laptop ID')
    }

    const data = await fetchLaptopDetail(id)
    laptop.value = data

    if (data.price) {
      const priceNum = parseFloat(data.price)
      if (!isNaN(priceNum) && priceNum > 0) {
        try {
          const suggestions = await fetchLaptopSuggestions({
            price: priceNum,
            brand_id: data.brand_id,
            exclude_id: id,
          })
          suggestedLaptops.value = suggestions
        } catch (suggestionError) {
          console.error('Error loading suggestions:', suggestionError)
          suggestedLaptops.value = []
        }
      }
    }
  } catch (err) {
    console.error('Error loading laptop detail:', err)
    error.value = t('laptop.error')
    laptop.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadLaptopDetail()
})

watch(() => route.params.id, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadLaptopDetail()
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
