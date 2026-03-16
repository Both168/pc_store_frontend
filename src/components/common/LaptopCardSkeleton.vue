<template>
  <div class="neumorphic-card laptop-card-skeleton">
    <!-- Image Skeleton -->
    <div class="skeleton-image-container">
      <Skeleton variant="rectangular" width="100%" height="100%" :border-radius="'20px'" />
    </div>

    <!-- Content Skeleton -->
    <div class="skeleton-content">
      <!-- Name Skeleton -->
      <Skeleton variant="text" width="90%" height="1rem" />
      <Skeleton variant="text" width="60%" height="1rem" />

      <!-- Price Skeleton -->
      <div class="skeleton-price">
        <Skeleton variant="text" width="4rem" height="1.25rem" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Skeleton from './Skeleton.vue'
</script>

<style scoped>
.laptop-card-skeleton {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-radius: 2rem;
}

.skeleton-image-container {
  width: 100%;
  height: 140px;
  margin-bottom: 0.75rem;
  border-radius: 20px;
  overflow: hidden;
  background: #e0e5ec;
}

.skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-price {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  background: #e0e5ec;
  box-shadow: 20px 20px 40px rgba(204, 209, 216, 0.48000000000000004), -20px -20px 40px rgba(252, 255, 255, 0.6799999999999999);
}

@media (min-width: 640px) {
  .skeleton-image-container {
    height: 160px;
  }
}

@media (min-width: 1024px) {
  .skeleton-image-container {
    height: 180px;
  }
}
</style>

