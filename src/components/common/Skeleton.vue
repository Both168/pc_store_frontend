<template>
  <div class="skeleton" :class="skeletonClass" :style="skeletonStyle"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string
  height?: string
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'rectangular',
  width: '100%',
  height: '1rem',
  borderRadius: '0.5rem',
})

const skeletonClass = computed(() => {
  return `skeleton-${props.variant}`
})

const skeletonStyle = computed(() => {
  return {
    width: props.width,
    height: props.height,
    borderRadius: props.borderRadius,
  }
})
</script>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    #e0e5ec 0%,
    #d0d5dc 50%,
    #e0e5ec 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}

.skeleton-text {
  height: 1rem;
  border-radius: 0.25rem;
}

.skeleton-circular {
  border-radius: 50%;
  aspect-ratio: 1;
}

.skeleton-rectangular {
  border-radius: 0.5rem;
}

.skeleton-card {
  border-radius: 2rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: #e0e5ec;
  box-shadow: 20px 20px 40px rgba(204, 209, 216, 0.48000000000000004), -20px -20px 40px rgba(252, 255, 255, 0.6799999999999999);
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>

