<template>
  <div v-if="meta && meta.last_page > 1" class="flex items-center justify-center gap-2 mt-8">
    <!-- Previous Button -->
    <button
      @click="goToPage(meta.current_page - 1)"
      :disabled="!links.prev"
      class="pagination-nav-button"
      :class="{ 'pagination-button-disabled': !links.prev }"
      aria-label="Previous page"
    >
      <svg class="w-4 h-4 text-[#5a6c7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Page Numbers -->
    <template v-for="page in visiblePages" :key="page">
      <button
        v-if="page !== '...'"
        @click="goToPage(page as number)"
        class="pagination-page-button"
        :class="{ 'pagination-page-button-active': page === meta.current_page }"
      >
        {{ page }}
      </button>
      <span v-else class="text-[#5a6c7d] px-2 font-semibold">...</span>
    </template>

    <!-- Next Button -->
    <button
      @click="goToPage(meta.current_page + 1)"
      :disabled="!links.next"
      class="pagination-nav-button"
      :class="{ 'pagination-button-disabled': !links.next }"
      aria-label="Next page"
    >
      <svg class="w-4 h-4 text-[#5a6c7d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import type { PaginationLinks, PaginationMeta } from '../../services/apiConfig'

interface Props {
  links: PaginationLinks
  meta: PaginationMeta
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const goToPage = async (page: number) => {
  if (page >= 1 && page <= props.meta.last_page) {
    emit('page-change', page)
    // Scroll to top on mobile screens
    if (window.innerWidth < 768) {
      await nextTick()
      window.scrollTo({ top: 0, behavior: 'smooth' })
      // Also try scrolling the document element as fallback
      document.documentElement.scrollTo({ top: 0, behavior: 'smooth' })
      document.body.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const visiblePages = computed(() => {
  const current = props.meta.current_page
  const last = props.meta.last_page
  const pages: (number | string)[] = []

  // Maximum number of page buttons to show (excluding first, last, and ellipsis)
  const maxVisible = 5

  if (last <= maxVisible + 2) {
    // Show all pages if total pages is small
    for (let i = 1; i <= last; i++) {
      pages.push(i)
    }
  } else {
    // Always show first page
    pages.push(1)

    // Calculate the range of pages to show around current page
    let start = Math.max(2, current - 1)
    let end = Math.min(last - 1, current + 1)

    // Adjust range if we're near the start
    if (current <= 3) {
      start = 2
      end = Math.min(4, last - 1)
    }

    // Adjust range if we're near the end
    if (current >= last - 2) {
      start = Math.max(2, last - 3)
      end = last - 1
    }

    // Add ellipsis before if there's a gap
    if (start > 2) {
      pages.push('...')
    }

    // Add page numbers in the range
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    // Add ellipsis after if there's a gap
    if (end < last - 1) {
      pages.push('...')
    }

    // Always show last page
    pages.push(last)
  }

  return pages
})
</script>

<style scoped>
/* Navigation Buttons (Prev/Next) */
.pagination-nav-button {
  background: #e0e5ec;
  border: none;
  border-radius: 0.5rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a6c7d;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 8px 8px 16px rgba(204, 209, 216, 0.48),
    -8px -8px 16px rgba(252, 255, 255, 0.68);
}

.pagination-nav-button:hover:not(.pagination-button-disabled) {
  box-shadow: 6px 6px 12px rgba(204, 209, 216, 0.5),
    -6px -6px 12px #ffffff;
  transform: translateY(-2px);
}

.pagination-nav-button:active:not(.pagination-button-disabled) {
  box-shadow: inset 4px 4px 8px rgba(204, 209, 216, 0.5),
    inset -4px -4px 8px rgba(252, 255, 255, 0.7);
  transform: scale(0.98);
}

.pagination-button-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* Page Number Buttons - Normal (Pop Up) */
.pagination-page-button {
  background: #e0e5ec;
  border: none;
  border-radius: 0.5rem;
  min-width: 2.5rem;
  height: 2.5rem;
  padding: 0 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5a6c7d;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 8px 8px 16px rgba(204, 209, 216, 0.48),
    -8px -8px 16px rgba(252, 255, 255, 0.68);
}

.pagination-page-button:hover {
  box-shadow: 6px 6px 12px rgba(204, 209, 216, 0.5),
    -6px -6px 12px #ffffff;
  transform: translateY(-2px);
}

.pagination-page-button:active {
  box-shadow: inset 4px 4px 8px rgba(204, 209, 216, 0.5),
    inset -4px -4px 8px rgba(252, 255, 255, 0.7);
  transform: scale(0.98);
}

/* Page Number Button - Active/Pressed State */
.pagination-page-button-active {
  background: #e0e5ec;
  box-shadow: inset 4px 4px 8px rgba(204, 209, 216, 0.5),
    inset -4px -4px 8px rgba(252, 255, 255, 0.7);
  transform: scale(0.98);
  color: #5a6c7d;
}

.pagination-page-button-active:hover {
  box-shadow: inset 4px 4px 8px rgba(204, 209, 216, 0.5),
    inset -4px -4px 8px rgba(252, 255, 255, 0.7);
  transform: scale(0.98);
}

/* Responsive */
@media (min-width: 640px) {
  .pagination-nav-button {
    width: 3rem;
    height: 3rem;
  }
  
  .pagination-page-button {
    min-width: 3rem;
    height: 3rem;
    font-size: 1rem;
  }
}
</style>

