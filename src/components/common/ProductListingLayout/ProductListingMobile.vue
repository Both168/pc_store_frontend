<template>
  <div class="product-listing-mobile">
    <!-- Filter Section -->
    <section class="py-4 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="neumorphic-card p-4">
          <div class="filter-content-mobile">
            <slot name="filters"></slot>
          </div>
        </div>
      </div>
    </section>

    <!-- Page Content -->
    <div class="pb-8 px-4">
      <div class="max-w-7xl mx-auto">
        <!-- Skeleton Loading State -->
        <div v-if="loading" class="grid grid-cols-2 gap-4">
          <slot name="skeleton">
            <div v-for="n in 8" :key="n" class="skeleton-card">
              <div class="skeleton-image"></div>
              <div class="skeleton-content">
                <div class="skeleton-line"></div>
                <div class="skeleton-line short"></div>
              </div>
            </div>
          </slot>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-16">
          <div class="text-red-500 text-base mb-4">{{ error }}</div>
          <NeumorphicButton @click="$emit('retry')">
            Retry
          </NeumorphicButton>
        </div>

        <!-- Product Cards Grid -->
        <div v-else-if="items && items.length > 0" class="grid grid-cols-2 gap-4">
          <slot name="cards" :items="items">
            <div v-for="(item, index) in items" :key="`item-${item.id || index}`">
              <slot name="card" :item="item" :index="index"></slot>
            </div>
          </slot>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="text-[#5a6c7d] text-base">{{ emptyMessage }}</div>
        </div>

        <!-- Pagination -->
        <Pagination
          v-if="!loading && !error && paginationMeta && paginationLinks"
          :links="paginationLinks"
          :meta="paginationMeta"
          @page-change="$emit('page-change', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NeumorphicButton from '../Neumorphic/NeumorphicButton.vue'
import Pagination from '../Pagination.vue'
import type { PaginationLinks, PaginationMeta } from '../../../services/apiConfig'

interface Props {
  loading: boolean
  error: string | null
  items: any[] | null
  emptyMessage?: string
  paginationLinks?: PaginationLinks | null
  paginationMeta?: PaginationMeta | null
}

withDefaults(defineProps<Props>(), {
  emptyMessage: 'No items found',
  paginationLinks: null,
  paginationMeta: null,
})

defineEmits<{
  (e: 'retry'): void
  (e: 'page-change', page: number): void
}>()
</script>

<style scoped>
:deep(.neumorphic-card) {
  border-radius: 0.5rem !important;
}

.filter-content-mobile {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-content-mobile :deep(.grid) {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.filter-content-mobile :deep(.space-y-2) {
  margin-bottom: 0;
  width: 100%;
}

.filter-content-mobile :deep(label) {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #5a6c7d;
}

.filter-content-mobile :deep(.neumorphic-input) {
  font-size: 0.875rem;
  padding: 0.625rem 0.875rem;
  width: 100%;
  min-width: 0;
}

.filter-content-mobile :deep(.flex.items-end) {
  margin-top: 0;
  width: 100%;
  gap: 0.75rem;
}

.filter-content-mobile :deep(.flex.items-end .neumorphic-button) {
  font-size: 0.875rem;
  padding: 0.625rem 1rem;
  flex: 1;
  min-width: 0;
}

.filter-content-mobile :deep(.flex.gap-2.items-center) {
  width: 100%;
  gap: 0.5rem;
}

.filter-content-mobile :deep(.flex.gap-2.items-center input) {
  flex: 1;
  min-width: 0;
}

.skeleton-card {
  background: #e0e5ec;
  border-radius: 0.5rem;
  box-shadow: 4px 4px 8px rgba(207, 212, 219, 0.329), -4px -4px 8px rgba(249, 254, 255, 0.4689999999999999);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-image {
  width: 100%;
  height: 120px;
  background: linear-gradient(90deg, #e0e5ec 0%, #d0d5dc 50%, #e0e5ec 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.5rem;
}

.skeleton-content {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.skeleton-line {
  height: 0.75rem;
  background: linear-gradient(90deg, #e0e5ec 0%, #d0d5dc 50%, #e0e5ec 100%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: 0.25rem;
}

.skeleton-line.short {
  width: 60%;
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

