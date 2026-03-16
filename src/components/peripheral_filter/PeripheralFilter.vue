<template>
  <!-- Mobile Layout: Price Range full width, then Brand/Sort in 1 row -->
  <div class="flex flex-col gap-4 lg:hidden">
    <!-- Price Range - Full Width on Mobile -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('peripherals.filter.priceRange') }}</label>
      <div class="flex gap-2 items-center">
        <input
          type="number"
          :value="modelValue.min_price"
          @input="updateValue('min_price', $event)"
          class="neumorphic-input flex-1 text-sm min-w-0 px-4 py-2"
          :placeholder="$t('peripherals.filter.min')"
        />
        <span class="text-[#5a6c7d] flex-shrink-0">-</span>
        <input
          type="number"
          :value="modelValue.max_price"
          @input="updateValue('max_price', $event)"
          class="neumorphic-input flex-1 text-sm min-w-0 px-4 py-2"
          :placeholder="$t('peripherals.filter.max')"
        />
      </div>
    </div>

    <!-- Brand, Sort - 1 Row on Mobile -->
    <div class="grid grid-cols-2 gap-2">
      <!-- Brand Filter -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('peripherals.filter.brand') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.brand"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
          :options="brandOptions"
          :placeholder="$t('peripherals.filter.allBrands')"
        />
      </div>

      <!-- Sort -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('peripherals.filter.sort') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.sort"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, sort: val })"
          :options="sortOptions"
          :placeholder="$t('peripherals.filter.default')"
        />
      </div>
    </div>
  </div>

  <!-- Desktop Layout: All 3 filters in 1 row -->
  <div class="hidden lg:grid lg:grid-cols-3 gap-4">
    <!-- Price Range -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('peripherals.filter.priceRange') }}</label>
      <div class="flex gap-2 items-center">
        <input
          type="number"
          :value="modelValue.min_price"
          @input="updateValue('min_price', $event)"
          class="neumorphic-input flex-1 text-sm min-w-0 px-4 py-2"
          :placeholder="$t('peripherals.filter.min')"
        />
        <span class="text-[#5a6c7d] flex-shrink-0">-</span>
        <input
          type="number"
          :value="modelValue.max_price"
          @input="updateValue('max_price', $event)"
          class="neumorphic-input flex-1 text-sm min-w-0 px-4 py-2"
          :placeholder="$t('peripherals.filter.max')"
        />
      </div>
    </div>

    <!-- Brand Filter -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('peripherals.filter.brand') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.brand"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
        :options="brandOptions"
        :placeholder="$t('peripherals.filter.allBrands')"
      />
    </div>

    <!-- Sort -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('peripherals.filter.sort') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.sort"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, sort: val })"
        :options="sortOptions"
        :placeholder="$t('peripherals.filter.default')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NeumorphicDropdown from '../common/Neumorphic/NeumorphicDropdown.vue'
import { fetchBrands, type Brand } from '../../services/apiBrand'

export interface PeripheralFilters {
  min_price: number | null
  max_price: number | null
  brand: number | null
  sort: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

const props = defineProps<{
  modelValue: PeripheralFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PeripheralFilters]
}>()

const { t } = useI18n()
const brands = ref<Brand[]>([])

const brandOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allBrands') }]
  brands.value.forEach(brand => {
    options.push({
      value: brand.id,
      label: brand.name
    })
  })
  return options
})

const sortOptions = computed<Array<{ value: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null; label: string }>>(() => [
  { value: null, label: t('peripherals.filter.default') },
  { value: 'price_asc', label: t('peripherals.filter.priceLowHigh') },
  { value: 'price_desc', label: t('peripherals.filter.priceHighLow') },
  { value: 'name_asc', label: t('peripherals.filter.nameAtoZ') },
  { value: 'name_desc', label: t('peripherals.filter.nameZtoA') },
])

const updateValue = (key: keyof PeripheralFilters, event: Event) => {
  const target = event.target as HTMLInputElement
  let value: any = null
  
  if (target.type === 'number') {
    value = target.value ? Number(target.value) : null
  }
  
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  })
}

const loadBrands = async () => {
  try {
    const fetchedBrands = await fetchBrands()
    brands.value = fetchedBrands
  } catch (error) {
    console.error('Error loading brands:', error)
  }
}

onMounted(() => {
  loadBrands()
})
</script>

