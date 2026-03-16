<template>
  <button
    :class="buttonClass"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'circle'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  disabled: false,
  type: 'button',
})

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClass = computed(() => {
  const classes = ['neumorphic-button-base']
  
  if (props.variant === 'circle') {
    classes.push('neumorphic-button-circle')
  } else {
    classes.push('neumorphic-button-default')
  }
  
  if (props.size === 'sm') {
    classes.push('neumorphic-button-sm')
  } else if (props.size === 'lg') {
    classes.push('neumorphic-button-lg')
  }
  
  if (props.disabled) {
    classes.push('neumorphic-button-disabled')
  }
  
  return classes.join(' ')
})
</script>

<style scoped>
.neumorphic-button-base {
  background: #e0e5ec;
  border: none;
  color: #5a6c7d;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Default Button (Rectangular) */
.neumorphic-button-default {
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  padding: 0.5rem 1.5rem;
  font-size: 0.875rem;
}

.neumorphic-button-default:hover:not(.neumorphic-button-disabled) {
  transform: translateY(-2px);
}

.neumorphic-button-default:active:not(.neumorphic-button-disabled) {
  transform: scale(0.98);
}

/* Circle Button */
.neumorphic-button-circle {
  border-radius: 50%;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.neumorphic-button-circle:hover:not(.neumorphic-button-disabled) {
  transform: translateY(-2px);
}

.neumorphic-button-circle:active:not(.neumorphic-button-disabled) {
  transform: scale(0.98);
}

/* Sizes */
.neumorphic-button-sm {
  padding: 0.375rem 1rem;
  font-size: 0.75rem;
}

.neumorphic-button-sm.neumorphic-button-circle {
  width: 1.5rem;
  height: 1.5rem;
}

.neumorphic-button-lg {
  padding: 0.75rem 2rem;
  font-size: 1rem;
}

.neumorphic-button-lg.neumorphic-button-circle {
  width: 3rem;
  height: 3rem;
}

/* Disabled State */
.neumorphic-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Responsive */
@media (min-width: 640px) {
  .neumorphic-button-circle {
    width: 2.5rem;
    height: 2.5rem;
  }
  
  .neumorphic-button-sm.neumorphic-button-circle {
    width: 2rem;
    height: 2rem;
  }
}

@media (min-width: 1024px) {
  .neumorphic-button-circle {
    width: 3rem;
    height: 3rem;
  }
  
  .neumorphic-button-sm.neumorphic-button-circle {
    width: 2.5rem;
    height: 2.5rem;
  }
}
</style>

