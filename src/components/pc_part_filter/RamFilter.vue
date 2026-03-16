<template>
  <!-- Mobile Layout: Price Range full width, then Brand/Type in 1 row -->
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

    <!-- Brand, Type - 1 Row on Mobile -->
    <div class="grid grid-cols-2 gap-2">
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
      <!-- Type -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.type') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.type"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, type: val })"
          :options="typeOptions"
          :placeholder="$t('component.filter.all')"
        />
      </div>
    </div>
  </div>

  <!-- Desktop Layout: All 3 filters in 1 row -->
  <div class="hidden lg:grid lg:grid-cols-3 gap-4">
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
    <!-- Type -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.type') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.type"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, type: val })"
        :options="typeOptions"
        :placeholder="$t('component.filter.all')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NeumorphicDropdown from '../common/Neumorphic/NeumorphicDropdown.vue'
import { fetchBrands, type Brand } from '../../services/apiBrand'

interface RamFilters {
  min_price: number | null
  max_price: number | null
  brand: number | null
  type: number | null
}

const props = defineProps<{
  modelValue: RamFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: RamFilters]
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

const typeOptions = computed(() => [
  { value: null, label: t('component.filter.all') },
  { value: 1, label: 'DDR5' },
  { value: 2, label: 'DDR4' },
])

const updateValue = (key: keyof RamFilters, event: Event) => {
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

