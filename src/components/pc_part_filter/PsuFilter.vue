<template>
  <!-- Mobile Layout: Price Range full width, then Brand/Watt/80 Plus in 1 row -->
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

    <!-- Brand, Watt, 80 Plus - 1 Row on Mobile -->
    <div class="grid grid-cols-3 gap-2">
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
      <!-- Watt -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.watt') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.watt"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, watt: val })"
          :options="wattageDropdownOptions"
          :disabled="isLoadingWattage"
          :placeholder="$t('component.filter.all')"
        />
      </div>
      <!-- 80 Plus -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.plus80') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.plus80"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, plus80: val })"
          :options="plus80Options"
          :placeholder="$t('component.filter.all')"
        />
      </div>
    </div>
  </div>

  <!-- Desktop Layout: All 4 filters in 1 row -->
  <div class="hidden lg:grid lg:grid-cols-4 gap-4">
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
    <!-- Watt -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.watt') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.watt"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, watt: val })"
        :options="wattageDropdownOptions"
        :disabled="isLoadingWattage"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- 80 Plus -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.plus80') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.plus80"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, plus80: val })"
        :options="plus80Options"
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
import { fetchWattage, type DropdownOption } from '../../services/apiComponent'

interface PsuFilters {
  min_price: number | null
  max_price: number | null
  brand: number | null
  watt: number | null
  plus80: string | null
}

const props = defineProps<{
  modelValue: PsuFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: PsuFilters]
}>()

const { t } = useI18n()
const brands = ref<Brand[]>([])
const wattageOptions = ref<DropdownOption[]>([])
const isLoadingWattage = ref(false)

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

const wattageDropdownOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  wattageOptions.value.forEach(wattage => {
    options.push({
      value: wattage.id,
      label: wattage.name
    })
  })
  return options
})

const plus80Options = computed(() => [
  { value: null, label: t('component.filter.all') },
  { value: '80 Plus', label: '80 Plus' },
  { value: '80 Plus Bronze', label: '80 Plus Bronze' },
  { value: '80 Plus Silver', label: '80 Plus Silver' },
  { value: '80 Plus Gold', label: '80 Plus Gold' },
  { value: '80 Plus Platinum', label: '80 Plus Platinum' },
  { value: '80 Plus Titanium', label: '80 Plus Titanium' },
])

const updateValue = (key: keyof PsuFilters, event: Event) => {
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

const loadWattage = async () => {
  try {
    isLoadingWattage.value = true
    wattageOptions.value = await fetchWattage()
  } catch (error) {
    console.error('Error loading wattage options:', error)
  } finally {
    isLoadingWattage.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([
      fetchBrands().then(brandsData => brands.value = brandsData),
      loadWattage()
    ])
  } catch (error) {
    console.error('Error loading data:', error)
  }
})
</script>

