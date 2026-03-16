<template>
  <!-- Mobile Layout: Price Range full width, then Brand in 1 row -->
  <div class="flex flex-col gap-4 lg:hidden">
    <!-- Price Range - Full Width on Mobile -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.priceRange') }}</label>
      <div class="flex gap-2 items-center">
        <input
          :value="modelValue.min_price"
          @input="updateValue('min_price', $event)"
          type="number"
          :placeholder="$t('component.filter.min')"
          class="neumorphic-input flex-1 text-sm min-w-0"
          min="0"
        />
        <span class="text-[#5a6c7d] flex-shrink-0">-</span>
        <input
          :value="modelValue.max_price"
          @input="updateValue('max_price', $event)"
          type="number"
          :placeholder="$t('component.filter.max')"
          class="neumorphic-input flex-1 text-sm min-w-0"
          min="0"
        />
      </div>
    </div>

    <!-- Brand - Full Width on Mobile -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.brand') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.brand"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
        :options="brandOptions"
        :placeholder="$t('component.filter.allBrands')"
      />
    </div>
  </div>

  <!-- Desktop Layout: All 2 filters in 1 row -->
  <div class="hidden lg:grid lg:grid-cols-2 gap-4">
    <!-- Price Range -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.priceRange') }}</label>
      <div class="flex gap-2 items-center">
        <input
          :value="modelValue.min_price"
          @input="updateValue('min_price', $event)"
          type="number"
          :placeholder="$t('component.filter.min')"
          class="neumorphic-input flex-1 text-sm min-w-0"
          min="0"
        />
        <span class="text-[#5a6c7d] flex-shrink-0">-</span>
        <input
          :value="modelValue.max_price"
          @input="updateValue('max_price', $event)"
          type="number"
          :placeholder="$t('component.filter.max')"
          class="neumorphic-input flex-1 text-sm min-w-0"
          min="0"
        />
      </div>
    </div>
    <!-- Brand -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.brand') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.brand"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
        :options="brandOptions"
        :placeholder="$t('component.filter.allBrands')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NeumorphicDropdown from '../common/Neumorphic/NeumorphicDropdown.vue'
import { fetchBrands, type Brand } from '../../services/apiBrand'

interface FanFilters {
  min_price: number | null
  max_price: number | null
  brand: number | null
}

const props = defineProps<{
  modelValue: FanFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: FanFilters]
}>()

const { t } = useI18n()
const brands = ref<Brand[]>([])

const brandOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('component.filter.allBrands') }]
  brands.value.forEach(brand => {
    options.push({
      value: brand.id,
      label: brand.name
    })
  })
  return options
})

const updateValue = (key: keyof FanFilters, event: Event) => {
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

onMounted(async () => {
  try {
    brands.value = await fetchBrands()
  } catch (error) {
    console.error('Error loading brands:', error)
  }
})
</script>

