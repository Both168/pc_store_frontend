<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="modal-overlay"
        @click.self="close"
      >
        <div class="modal-container neumorphic-card">
          <div class="modal-header">
            <h2 class="modal-title">Add CPU</h2>
            <button
              type="button"
              class="modal-close"
              aria-label="Close"
              @click="close"
            >
              <img :src="crossCircleIcon" alt="Close" class="modal-close-icon" />
            </button>
          </div>
          <div class="modal-body">
            <CpuFilter v-model="cpuFilters" />
            <div v-if="isLoadingCpuCards" class="modal-cards-loading">Loading CPUs...</div>
            <template v-else>
              <div class="modal-cards-grid">
                <LaptopCard
                  v-for="(card, index) in cpuCards"
                  :key="card.id ?? index"
                  :laptop="{
                    id: card.id,
                    name: card.name,
                    image: card.image ?? '',
                    price: card.price,
                    discount_price: card.discount_price,
                    in_stock: 1,
                  }"
                  :detail-path="'/component/cpu'"
                  :index="index"
                  :show-add-to-build-on-hover="true"
                  @add-to-build="onAddCpuToBuild"
                />
              </div>
              <Pagination
                v-if="cpuPagination.last_page > 1"
                :links="cpuPaginationLinks"
                :meta="cpuPaginationMeta"
                @page-change="onPageChange"
              />
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import CpuFilter from '../pc_part_filter/CpuFilter.vue'
import LaptopCard from '../common/LaptopCard.vue'
import crossCircleIcon from '../../assets/icons/setup/cross-circle.png'
import Pagination from '../common/Pagination.vue'
import { fetchCpuCards, type CpuCard } from '../../services/apiComponent'
import type { CpuFilters as ApiCpuFilters } from '../../services/apiComponent'
import type { PaginationLinks, PaginationMeta } from '../../services/apiConfig'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select-cpu', cpuData: { id: number; name: string; price: string; image?: string }): void
}>()

const cpuFilters = ref({
  min_price: null as number | null,
  max_price: null as number | null,
  type: null as string | null,
  generation: null as number | null,
  integrated_gpu: null as boolean | null,
})

const cpuCards = ref<CpuCard[]>([])
const isLoadingCpuCards = ref(false)
const cpuPagination = ref({
  current_page: 1,
  per_page: 24,
  total: 0,
  last_page: 1,
})

function convertPaginationToLinks(p: { current_page: number; last_page: number }): PaginationLinks {
  return {
    first: p.current_page === 1 ? null : '?page=1',
    last: p.current_page >= p.last_page ? null : `?page=${p.last_page}`,
    prev: p.current_page <= 1 ? null : `?page=${p.current_page - 1}`,
    next: p.current_page >= p.last_page ? null : `?page=${p.current_page + 1}`,
  }
}
function convertPaginationToMeta(p: { current_page: number; per_page: number; total: number; last_page: number }): PaginationMeta {
  const from = p.total > 0 ? (p.current_page - 1) * p.per_page + 1 : null
  const to = p.total > 0 ? Math.min(p.current_page * p.per_page, p.total) : null
  return {
    current_page: p.current_page,
    last_page: p.last_page,
    per_page: p.per_page,
    from,
    to,
    total: p.total,
  }
}

const cpuPaginationLinks = computed(() => convertPaginationToLinks(cpuPagination.value))
const cpuPaginationMeta = computed(() => convertPaginationToMeta(cpuPagination.value))

function toApiFilters(): ApiCpuFilters & { page?: number } {
  const f: ApiCpuFilters & { page?: number } = { page: cpuPagination.value.current_page }
  if (cpuFilters.value.min_price != null) f.min_price = cpuFilters.value.min_price
  if (cpuFilters.value.max_price != null) f.max_price = cpuFilters.value.max_price
  if (cpuFilters.value.type === 'AMD') f.cpu_type = 1
  else if (cpuFilters.value.type === 'Intel') f.cpu_type = 0
  if (cpuFilters.value.generation != null) f.generation = cpuFilters.value.generation
  if (cpuFilters.value.integrated_gpu === true) f.is_integrated_gpu = 1
  else if (cpuFilters.value.integrated_gpu === false) f.is_integrated_gpu = 0
  return f
}

async function loadCpuCards() {
  isLoadingCpuCards.value = true
  try {
    const result = await fetchCpuCards(toApiFilters())
    cpuCards.value = result.data
    cpuPagination.value = {
      current_page: result.current_page,
      per_page: result.per_page,
      total: result.total,
      last_page: result.last_page,
    }
  } catch (err) {
    console.error('Error loading CPU cards:', err)
    cpuCards.value = []
  } finally {
    isLoadingCpuCards.value = false
  }
}

function onPageChange(page: number) {
  cpuPagination.value.current_page = page
  loadCpuCards()
}

function onAddCpuToBuild(cpuId: number | undefined) {
  if (cpuId == null) return
  const card = cpuCards.value.find(c => c.id === cpuId)
  if (card) {
    emit('select-cpu', {
      id: card.id,
      name: card.name,
      price: card.discount_price && card.discount_price !== '' && parseFloat(card.discount_price) > 0 ? card.discount_price : card.price,
      image: card.image,
    })
    close()
  }
}

watch(
  () => cpuFilters.value,
  () => {
    cpuPagination.value.current_page = 1
    loadCpuCards()
  },
  { deep: true }
)

watch(
  () => props.modelValue,
  (visible) => {
    if (visible) loadCpuCards()
  }
)

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(90, 108, 125, 0.4);
  backdrop-filter: blur(4px);
}

.modal-container {
  width: 80vw;
  height: 80vh;
  max-width: 80vw;
  max-height: 80vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #5a6c7d;
  margin: 0;
}

.modal-close {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  line-height: 1;
  color: #5a6c7d;
  background: #e0e5ec;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 4px 4px 4px rgba(199, 204, 211, 0.35), -4px -4px 4px rgba(255, 255, 255, 0.49);
  transition: all 0.2s ease;
}

.modal-close:hover {
  transform: scale(1.05);
}

.modal-close-icon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
}

.modal-body {
  color: #5a6c7d;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-cards-loading {
  text-align: center;
  padding: 1.5rem;
  color: #5a6c7d;
}

.modal-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
