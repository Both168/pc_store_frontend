<template>
  <!-- Mobile Layout: Price Range full width, then CPU Type/Generation/Integrated GPU in 1 row -->
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

    <!-- CPU Type, Generation, Integrated GPU - 1 Row on Mobile -->
    <div class="grid grid-cols-3 gap-2">
      <!-- CPU Type -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.cpuType') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.type"
          @update:model-value="handleCpuTypeDropdownChange"
          :options="cpuTypeOptions"
          :disabled="isLoadingCpuTypes"
          :placeholder="$t('component.filter.all')"
        />
      </div>
      <!-- Generation -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.generation') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.generation"
          @update:model-value="handleGenerationChange"
          :options="generationOptions"
          :disabled="isLoadingGenerations"
          :placeholder="$t('component.filter.all')"
        />
      </div>
      <!-- Integrated GPU -->
      <div class="space-y-2 min-w-0">
        <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.integratedGpu') }}</label>
        <NeumorphicDropdown
          :model-value="modelValue.integrated_gpu === null ? null : modelValue.integrated_gpu"
          @update:model-value="handleIntegratedGpuChange"
          :options="integratedGpuDropdownOptions"
          :disabled="isLoadingIntegratedGpu"
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
    <!-- CPU Type -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.cpuType') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.type"
        @update:model-value="handleCpuTypeDropdownChange"
        :options="cpuTypeOptions"
        :disabled="isLoadingCpuTypes"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- Generation -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.generation') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.generation"
        @update:model-value="handleGenerationChange"
        :options="generationOptions"
        :disabled="isLoadingGenerations"
        :placeholder="$t('component.filter.all')"
      />
    </div>
    <!-- Integrated GPU -->
    <div class="space-y-2 min-w-0">
      <label class="text-sm font-semibold text-[#5a6c7d] block">{{ $t('component.filter.integratedGpu') }}</label>
      <NeumorphicDropdown
        :model-value="modelValue.integrated_gpu === null ? null : modelValue.integrated_gpu"
        @update:model-value="handleIntegratedGpuChange"
        :options="integratedGpuDropdownOptions"
        :disabled="isLoadingIntegratedGpu"
        :placeholder="$t('component.filter.all')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import NeumorphicDropdown from '../common/Neumorphic/NeumorphicDropdown.vue'
import {
  fetchCpuTypes,
  fetchGenerations,
  fetchIntegratedGpu,
  type DropdownOption,
} from '../../services/apiComponent'

interface CpuFilters {
  min_price: number | null
  max_price: number | null
  type: string | null
  generation: number | null // Generation ID (number)
  integrated_gpu: boolean | null
}

const props = defineProps<{
  modelValue: CpuFilters
}>()

const emit = defineEmits<{
  'update:modelValue': [value: CpuFilters]
}>()

const { t } = useI18n()

// Dropdown options
const cpuTypes = ref<DropdownOption[]>([])
const generations = ref<DropdownOption[]>([])
const integratedGpuOptions = ref<DropdownOption[]>([])

// Loading states
const isLoadingCpuTypes = ref(false)
const isLoadingGenerations = ref(false)
const isLoadingIntegratedGpu = ref(false)

// Load CPU types
const loadCpuTypes = async () => {
  try {
    isLoadingCpuTypes.value = true
    cpuTypes.value = await fetchCpuTypes()
  } catch (error) {
    console.error('Error loading CPU types:', error)
  } finally {
    isLoadingCpuTypes.value = false
  }
}

// Load generations (optionally filtered by CPU type)
const loadGenerations = async (cpuType?: number) => {
  try {
    isLoadingGenerations.value = true
    generations.value = await fetchGenerations(cpuType)
  } catch (error) {
    console.error('Error loading generations:', error)
  } finally {
    isLoadingGenerations.value = false
  }
}

// Load integrated GPU options
const loadIntegratedGpu = async () => {
  try {
    isLoadingIntegratedGpu.value = true
    integratedGpuOptions.value = await fetchIntegratedGpu()
  } catch (error) {
    console.error('Error loading integrated GPU options:', error)
  } finally {
    isLoadingIntegratedGpu.value = false
  }
}

// Computed options for dropdowns
const cpuTypeOptions = computed(() => {
  const options: Array<{ value: string | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  cpuTypes.value.forEach(cpuType => {
    options.push({
      value: cpuType.id === 1 ? 'AMD' : 'Intel',
      label: cpuType.name
    })
  })
  return options
})

const generationOptions = computed(() => {
  const options: Array<{ value: number | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  generations.value.forEach(generation => {
    options.push({
      value: generation.id,
      label: generation.name
    })
  })
  return options
})

const integratedGpuDropdownOptions = computed(() => {
  const options: Array<{ value: boolean | null; label: string }> = [{ value: null, label: t('component.filter.all') }]
  integratedGpuOptions.value.forEach(option => {
    options.push({
      value: option.id === 1,
      label: option.name
    })
  })
  return options
})

// Handle CPU type change - reload generations when type changes
const handleCpuTypeDropdownChange = async (value: string | null) => {
  // Update the type value
  emit('update:modelValue', {
    ...props.modelValue,
    type: value,
    generation: null, // Reset generation when type changes
  })
  
  // Convert type string to number for API call
  // "AMD" -> 1, "Intel" -> 0
  const cpuTypeId = value === 'AMD' ? 1 : value === 'Intel' ? 0 : undefined
  
  // Reload generations with the new type filter
  await loadGenerations(cpuTypeId)
}

const handleGenerationChange = (value: number | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    generation: value,
  })
}

const handleIntegratedGpuChange = (value: boolean | null) => {
  emit('update:modelValue', {
    ...props.modelValue,
    integrated_gpu: value,
  })
}

// Watch for type changes to reload generations
watch(
  () => props.modelValue.type,
  async (newType) => {
    if (newType) {
      const cpuTypeId = newType === 'AMD' ? 1 : newType === 'Intel' ? 0 : undefined
      await loadGenerations(cpuTypeId)
    } else {
      // Load all generations if no type is selected
      await loadGenerations()
    }
  }
)

const updateValue = (key: keyof CpuFilters, event: Event) => {
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
    loadCpuTypes(),
    loadGenerations(),
    loadIntegratedGpu(),
  ])
})
</script>

