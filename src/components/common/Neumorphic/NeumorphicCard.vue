<template>
  <div class="neumorphic-card" :class="customClass">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  customClass?: string
}>()
</script>

<style scoped>
.neumorphic-card {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  padding: 2rem;
  color: #5a6c7d;
}
</style>

