<template>
  <div class="relative neumorphic-dropdown" @click.stop="toggleDropdown">
    <button
      type="button"
      class="neumorphic-input w-full text-sm px-4 py-2 text-left flex items-center justify-between min-h-[2.5rem]"
      :class="{ 'dropdown-open': isOpen }"
    >
      <span class="truncate">{{ displayValue }}</span>
      <svg
        class="w-4 h-4 flex-shrink-0 ml-2 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
    <!-- Dropdown Menu -->
    <div
      v-if="isOpen"
      class="absolute top-full left-0 right-0 mt-1 neumorphic-card min-w-full py-2 z-50 max-h-60 overflow-y-auto"
    >
      <button
        v-for="option in options"
        :key="getOptionValue(option)"
        type="button"
        class="w-full text-left px-4 py-2 text-[#5a6c7d] hover:bg-[rgba(199,204,211,0.1)] text-sm font-medium transition-all flex items-center justify-between rounded-[20px] mx-1"
        :class="{ 'bg-[rgba(199,204,211,0.15)]': isSelected(option) }"
        @click="selectOption(option)"
      >
        <span>{{ getOptionLabel(option) }}</span>
        <svg
          v-if="isSelected(option)"
          class="w-4 h-4 text-[#5a6c7d]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface Props {
  modelValue: any
  options: Array<{ [key: string]: any }>
  placeholder?: string
  optionValue?: string
  optionLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select an option',
  optionValue: 'value',
  optionLabel: 'label',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const isOpen = ref(false)

const getOptionValue = (option: any): any => {
  if (props.optionValue === 'value') {
    return option.value !== undefined ? option.value : (option.id !== undefined ? option.id : option)
  }
  return option[props.optionValue] !== undefined ? option[props.optionValue] : (option.id !== undefined ? option.id : option)
}

const getOptionLabel = (option: any): string => {
  if (props.optionLabel === 'label') {
    return option.label ?? option.name ?? String(option)
  }
  return option[props.optionLabel] ?? option.name ?? String(option)
}

const isSelected = (option: any): boolean => {
  const optionValue = getOptionValue(option)
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
    return optionValue === null || optionValue === undefined || optionValue === ''
  }
  return optionValue === props.modelValue
}

const displayValue = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined || props.modelValue === '') {
    return props.placeholder
  }
  const selectedOption = props.options.find(opt => {
    const optValue = getOptionValue(opt)
    return optValue === props.modelValue
  })
  return selectedOption ? getOptionLabel(selectedOption) : props.placeholder
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const selectOption = (option: any) => {
  const value = getOptionValue(option)
  emit('update:modelValue', value)
  closeDropdown()
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.neumorphic-dropdown')) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.neumorphic-dropdown .neumorphic-card {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  animation: fadeIn 0.2s ease-in-out;
}

.neumorphic-dropdown button.neumorphic-input {
  cursor: pointer;
}

.neumorphic-dropdown button.neumorphic-input.dropdown-open {
  box-shadow: inset 2px 2px 4px rgba(204, 209, 216, 0.3),
    inset -2px -2px 4px rgba(252, 255, 255, 0.5);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

