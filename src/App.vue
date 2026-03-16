<script setup lang="ts">
import { useFont } from './composables/useFont'

// Initialize font based on current locale
useFont()
</script>

<template>
  <router-view />
</template>
