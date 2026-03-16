<template>
  <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
    <!-- Min Price -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.minPrice') }}</label>
      <input
        type="number"
        :value="modelValue.min_price"
        @input="updateValue('min_price', $event)"
        class="neumorphic-input w-full px-4 py-2"
        :placeholder="$t('peripherals.filter.min')"
      />
    </div>

    <!-- Max Price -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.maxPrice') }}</label>
      <input
        type="number"
        :value="modelValue.max_price"
        @input="updateValue('max_price', $event)"
        class="neumorphic-input w-full px-4 py-2"
        :placeholder="$t('peripherals.filter.max')"
      />
    </div>

    <!-- Brand Filter -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.brand') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.brand"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, brand: val })"
        :options="brandOptions"
        :placeholder="$t('peripherals.filter.allBrands')"
      />
    </div>

    <!-- Size -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.size') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.size"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, size: val })"
        :options="sizeOptions"
        :disabled="isLoadingSizes"
        :placeholder="$t('peripherals.filter.allSizes')"
      />
    </div>

    <!-- Form Factor -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.formFactor') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.form_factor"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, form_factor: val })"
        :options="formFactorOptions"
        :disabled="isLoadingFormFactors"
        :placeholder="$t('peripherals.filter.allFormFactors')"
      />
    </div>

    <!-- Panel Type -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.panelType') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.panel_type"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, panel_type: val })"
        :options="panelTypeOptions"
        :disabled="isLoadingPanelTypes"
        :placeholder="$t('peripherals.filter.allPanelTypes')"
      />
    </div>

    <!-- Resolution -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.resolution') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.resolution"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, resolution: val })"
        :options="resolutionOptions"
        :disabled="isLoadingResolutions"
        :placeholder="$t('peripherals.filter.allResolutions')"
      />
    </div>

    <!-- Refresh Rate -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.refreshRate') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.refresh_rate"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, refresh_rate: val })"
        :options="refreshRateOptions"
        :disabled="isLoadingRefreshRates"
        :placeholder="$t('peripherals.filter.allRefreshRates')"
      />
    </div>

    <!-- Response Time -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.responseTime') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.response_time"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, response_time: val })"
        :options="responseTimeOptions"
        :disabled="isLoadingResponseTimes"
        :placeholder="$t('peripherals.filter.allResponseTimes')"
      />
    </div>

    <!-- Stand -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.stand') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.stand"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, stand: val })"
        :options="standOptions"
        :disabled="isLoadingStands"
        :placeholder="$t('peripherals.filter.allStands')"
      />
    </div>

    <!-- Built-in Speaker -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.builtInSpeaker') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.is_build_in_speaker"
        @update:model-value="(val) => emit('update:modelValue', { ...modelValue, is_build_in_speaker: val })"
        :options="speakerOptions"
        :disabled="isLoadingSpeakers"
        :placeholder="$t('peripherals.filter.all')"
      />
    </div>

    <!-- Sort -->
    <div>
      <label class="block text-sm text-[#5a6c7d] mb-2">{{ $t('peripherals.filter.sort') }}</label>
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
import {
  fetchMonitorSizes,
  fetchMonitorFormFactors,
  fetchMonitorPanelTypes,
  fetchMonitorResolutions,
  fetchMonitorRefreshRates,
  fetchMonitorResponseTimes,
  fetchMonitorStands,
  fetchMonitorSpeakers,
  type DropdownOption,
} from '../../services/apiPeripheral'

export interface MonitorFilters {
  min_price: number | null
  max_price: number | null
  brand: number | null
  size: number | null
  form_factor: number | null
  panel_type: number | null
  resolution: number | null
  refresh_rate: number | null
  response_time: number | null
  stand: number | null
  is_build_in_speaker: number | null
  sort: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | null
}

const props = defineProps<{
  modelValue: MonitorFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: MonitorFilters]
}>()

const { t } = useI18n()
const brands = ref<Brand[]>([])
const sizes = ref<DropdownOption[]>([])
const formFactors = ref<DropdownOption[]>([])
const panelTypes = ref<DropdownOption[]>([])
const resolutions = ref<DropdownOption[]>([])
const refreshRates = ref<DropdownOption[]>([])
const responseTimes = ref<DropdownOption[]>([])
const stands = ref<DropdownOption[]>([])
const speakers = ref<DropdownOption[]>([])

const isLoadingSizes = ref(false)
const isLoadingFormFactors = ref(false)
const isLoadingPanelTypes = ref(false)
const isLoadingResolutions = ref(false)
const isLoadingRefreshRates = ref(false)
const isLoadingResponseTimes = ref(false)
const isLoadingStands = ref(false)
const isLoadingSpeakers = ref(false)

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

const sizeOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allSizes') }]
  sizes.value.forEach(size => {
    options.push({
      value: size.id,
      label: size.name
    })
  })
  return options
})

const formFactorOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allFormFactors') }]
  formFactors.value.forEach(formFactor => {
    options.push({
      value: formFactor.id,
      label: formFactor.name
    })
  })
  return options
})

const panelTypeOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allPanelTypes') }]
  panelTypes.value.forEach(panelType => {
    options.push({
      value: panelType.id,
      label: panelType.name
    })
  })
  return options
})

const resolutionOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allResolutions') }]
  resolutions.value.forEach(resolution => {
    options.push({
      value: resolution.id,
      label: resolution.name
    })
  })
  return options
})

const refreshRateOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allRefreshRates') }]
  refreshRates.value.forEach(refreshRate => {
    options.push({
      value: refreshRate.id,
      label: refreshRate.name
    })
  })
  return options
})

const responseTimeOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allResponseTimes') }]
  responseTimes.value.forEach(responseTime => {
    options.push({
      value: responseTime.id,
      label: responseTime.name
    })
  })
  return options
})

const standOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.allStands') }]
  stands.value.forEach(stand => {
    options.push({
      value: stand.id,
      label: stand.name
    })
  })
  return options
})

const speakerOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('peripherals.filter.all') }]
  speakers.value.forEach(speaker => {
    options.push({
      value: speaker.id,
      label: speaker.name
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

const updateValue = (key: keyof MonitorFilters, event: Event) => {
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

const loadSizes = async () => {
  try {
    isLoadingSizes.value = true
    sizes.value = await fetchMonitorSizes()
  } catch (error) {
    console.error('Error loading monitor sizes:', error)
  } finally {
    isLoadingSizes.value = false
  }
}

const loadFormFactors = async () => {
  try {
    isLoadingFormFactors.value = true
    formFactors.value = await fetchMonitorFormFactors()
  } catch (error) {
    console.error('Error loading monitor form factors:', error)
  } finally {
    isLoadingFormFactors.value = false
  }
}

const loadPanelTypes = async () => {
  try {
    isLoadingPanelTypes.value = true
    panelTypes.value = await fetchMonitorPanelTypes()
  } catch (error) {
    console.error('Error loading monitor panel types:', error)
  } finally {
    isLoadingPanelTypes.value = false
  }
}

const loadResolutions = async () => {
  try {
    isLoadingResolutions.value = true
    resolutions.value = await fetchMonitorResolutions()
  } catch (error) {
    console.error('Error loading monitor resolutions:', error)
  } finally {
    isLoadingResolutions.value = false
  }
}

const loadRefreshRates = async () => {
  try {
    isLoadingRefreshRates.value = true
    refreshRates.value = await fetchMonitorRefreshRates()
  } catch (error) {
    console.error('Error loading monitor refresh rates:', error)
  } finally {
    isLoadingRefreshRates.value = false
  }
}

const loadResponseTimes = async () => {
  try {
    isLoadingResponseTimes.value = true
    responseTimes.value = await fetchMonitorResponseTimes()
  } catch (error) {
    console.error('Error loading monitor response times:', error)
  } finally {
    isLoadingResponseTimes.value = false
  }
}

const loadStands = async () => {
  try {
    isLoadingStands.value = true
    stands.value = await fetchMonitorStands()
  } catch (error) {
    console.error('Error loading monitor stands:', error)
  } finally {
    isLoadingStands.value = false
  }
}

const loadSpeakers = async () => {
  try {
    isLoadingSpeakers.value = true
    speakers.value = await fetchMonitorSpeakers()
  } catch (error) {
    console.error('Error loading monitor speakers:', error)
  } finally {
    isLoadingSpeakers.value = false
  }
}

onMounted(() => {
  loadBrands()
  loadSizes()
  loadFormFactors()
  loadPanelTypes()
  loadResolutions()
  loadRefreshRates()
  loadResponseTimes()
  loadStands()
  loadSpeakers()
})
</script>
