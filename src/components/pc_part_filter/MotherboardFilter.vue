<template>
  <!-- Mobile Layout: Price Range full width, then filters in rows -->
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

    <!-- Form Factor, Socket, RAM Type, WIFI - 2 Rows on Mobile -->
    <div class="grid grid-cols-2 gap-2">
      <!-- Form Factor -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.formFactor') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.form_factor"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, form_factor: val })"
          :options="formFactorOptions"
          :disabled="isLoadingFormFactors"
          :placeholder="$t('component.filter.all')"
        />
      </div>
      <!-- Socket -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.socket') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.socket"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, socket: val })"
          :options="socketOptions"
          :disabled="isLoadingSockets"
          :placeholder="$t('component.filter.all')"
        />
      </div>
      <!-- RAM Type -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.ramType') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.ram_type"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, ram_type: val })"
          :options="ramTypeOptions"
          :disabled="isLoadingRamTypes"
          :placeholder="$t('component.filter.all')"
        />
      </div>
      <!-- WIFI -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.wifi') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.wifi"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, wifi: val })"
          :options="wifiDropdownOptions"
          :disabled="isLoadingWifis"
          :placeholder="$t('component.filter.all')"
        />
      </div>
    </div>

    <!-- Brand, Sort - 1 Row on Mobile -->
    <div class="grid grid-cols-2 gap-2">
      <!-- Brand -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.brand') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.brand"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
          :options="brandOptions"
          :disabled="isLoadingBrands"
          :placeholder="$t('component.filter.allBrands')"
        />
      </div>
      <!-- Sort -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.sort') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.sort"
          @update:model-value="(val) => emit('update:modelValue', { ...modelValue, sort: val })"
          :options="sortOptions"
          :placeholder="$t('component.filter.default')"
        />
      </div>
    </div>
  </div>

  <!-- Desktop Layout: All 8 filters in 1 row (xl) or 4 columns (lg) -->
  <div class="hidden lg:grid lg:grid-cols-4 xl:grid-cols-8 gap-4">
    <!-- Price Range -->
    <div class="space-y-2 min-w-0 lg:col-span-2 xl:col-span-2">
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
    <!-- Form Factor -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.formFactor') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.form_factor"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, form_factor: val })"
        :options="formFactorOptions"
        :disabled="isLoadingFormFactors"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- Socket -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.socket') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.socket"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, socket: val })"
        :options="socketOptions"
        :disabled="isLoadingSockets"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- RAM Type -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.ramType') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.ram_type"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, ram_type: val })"
        :options="ramTypeOptions"
        :disabled="isLoadingRamTypes"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- WIFI -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.wifi') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.wifi"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, wifi: val })"
        :options="wifiDropdownOptions"
        :disabled="isLoadingWifis"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- Brand -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.brand') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.brand"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
        :options="brandOptions"
        :disabled="isLoadingBrands"
        :placeholder="$t('component.filter.allBrands')"
      />
    </div>
    <!-- Sort -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.sort') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.sort"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, sort: val })"
        :options="sortOptions"
        :placeholder="$t('component.filter.default')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import NeumorphicDropdown from '../common/Neumorphic/NeumorphicDropdown.vue'
import { fetchBrands, type Brand } from '../../services/apiBrand'
import {
  fetchFormFactors,
  fetchSockets,
  fetchRamTypes,
  fetchWifis,
  type DropdownOption,
  type StringDropdownOption,
} from '../../services/apiComponent'

interface MotherboardFilters {
  min_price: number | null
  max_price: number | null
  form_factor: number | null
  socket: number | null
  ram_type: string | null
  wifi: number | null
  brand: number | null
  sort: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

const props = defineProps<{
  modelValue: MotherboardFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MotherboardFilters]
}>()

const { t } = useI18n()

// Dropdown options
const formFactors = ref<StringDropdownOption[]>([])
const sockets = ref<DropdownOption[]>([])
const ramTypes = ref<StringDropdownOption[]>([])
const wifiOptions = ref<StringDropdownOption[]>([])
const brands = ref<Brand[]>([])

// Loading states
const isLoadingFormFactors = ref(false)
const isLoadingSockets = ref(false)
const isLoadingRamTypes = ref(false)
const isLoadingWifis = ref(false)
const isLoadingBrands = ref(false)

// Computed options for dropdowns
const formFactorOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  formFactors.value.forEach(formFactor => {
    options.push({
      value: Number(formFactor.id),
      label: formFactor.name
    })
  })
  return options
})

const socketOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  sockets.value.forEach(socket => {
    options.push({
      value: socket.id,
      label: socket.name
    })
  })
  return options
})

const ramTypeOptions = computed(() => {
  const options: Array<{ value: string | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  ramTypes.value.forEach(ramType => {
    options.push({
      value: ramType.id as string,
      label: ramType.name
    })
  })
  return options
})

const wifiDropdownOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  wifiOptions.value.forEach(wifiOption => {
    options.push({
      value: Number(wifiOption.id),
      label: wifiOption.name
    })
  })
  return options
})

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

const sortOptions = computed<Array<{ value: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null; label: string }>>(() => [
  { value: null, label: t('component.filter.default') },
  { value: 'price_asc', label: t('component.filter.priceLowHigh') },
  { value: 'price_desc', label: t('component.filter.priceHighLow') },
  { value: 'name_asc', label: t('component.filter.nameAtoZ') },
  { value: 'name_desc', label: t('component.filter.nameZtoA') },
])

// Load form factors
const loadFormFactors = async () => {
  try {
    isLoadingFormFactors.value = true
    formFactors.value = await fetchFormFactors()
  } catch (error) {
    console.error('Error loading form factors:', error)
  } finally {
    isLoadingFormFactors.value = false
  }
}

// Load sockets
const loadSockets = async () => {
  try {
    isLoadingSockets.value = true
    sockets.value = await fetchSockets()
  } catch (error) {
    console.error('Error loading sockets:', error)
  } finally {
    isLoadingSockets.value = false
  }
}

// Load RAM types
const loadRamTypes = async () => {
  try {
    isLoadingRamTypes.value = true
    ramTypes.value = await fetchRamTypes()
  } catch (error) {
    console.error('Error loading RAM types:', error)
  } finally {
    isLoadingRamTypes.value = false
  }
}

// Load WiFi options
const loadWifis = async () => {
  try {
    isLoadingWifis.value = true
    wifiOptions.value = await fetchWifis()
  } catch (error) {
    console.error('Error loading WiFi options:', error)
  } finally {
    isLoadingWifis.value = false
  }
}

// Load brands
const loadBrands = async () => {
  try {
    isLoadingBrands.value = true
    brands.value = await fetchBrands()
  } catch (error) {
    console.error('Error loading brands:', error)
  } finally {
    isLoadingBrands.value = false
  }
}

const updateValue = (key: keyof MotherboardFilters, event: Event) => {
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

// Load all dropdown options on mount
onMounted(async () => {
  await Promise.all([
    loadFormFactors(),
    loadSockets(),
    loadRamTypes(),
    loadWifis(),
    loadBrands(),
  ])
})
</script>
