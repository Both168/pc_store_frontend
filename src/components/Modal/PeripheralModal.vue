<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="modal-overlay" @click.self="close">
        <div class="modal-container neumorphic-card">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button type="button" class="modal-close" aria-label="Close" @click="close">
              <img :src="crossCircleIcon" alt="Close" class="modal-close-icon" />
            </button>
          </div>
          <div class="modal-body">
            <MonitorFilter v-if="apiType === 'monitor'" v-model="monitorFilters" />
            <PeripheralFilter v-else v-model="peripheralFilters" />
            <div v-if="isLoading" class="modal-cards-loading">Loading...</div>
            <template v-else>
              <div class="modal-cards-grid">
                <LaptopCard
                  v-for="(card, index) in cards"
                  :key="card.id ?? index"
                  :laptop="{ id: card.id, name: card.name, image: card.image ?? '', price: card.price, discount_price: card.discount_price, in_stock: 1 }"
                  :detail-path="detailPath"
                  :index="index"
                  :show-add-to-build-on-hover="true"
                  @add-to-build="onSelect"
                />
              </div>
              <Pagination v-if="pagination.last_page > 1" :links="paginationLinks" :meta="paginationMeta" @page-change="onPageChange" />
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import MonitorFilter, { type MonitorFilters } from '../peripheral_filter/MonitorFilter.vue'
import PeripheralFilter, { type PeripheralFilters } from '../peripheral_filter/PeripheralFilter.vue'
import LaptopCard from '../common/LaptopCard.vue'
import crossCircleIcon from '../../assets/icons/setup/cross-circle.png'
import Pagination from '../common/Pagination.vue'
import { fetchPeripheralCards, type PeripheralCard } from '../../services/apiPeripheral'
import type { PaginationLinks, PaginationMeta } from '../../services/apiConfig'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    apiType: 'monitor' | 'mice' | 'keyboard' | 'headset' | 'speaker' | 'webcams' | 'mic'
    title: string
    detailPath: string
  }>(),
  { detailPath: '/peripherals' }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'select', data: { id: number; name: string; price: string; image?: string }): void
}>()

const monitorFilters = ref<MonitorFilters>({
  min_price: null, max_price: null, brand: null, sort: null,
  size: null, form_factor: null, panel_type: null, resolution: null, refresh_rate: null, response_time: null, stand: null, is_build_in_speaker: null,
})
const peripheralFilters = ref<PeripheralFilters>({ min_price: null, max_price: null, brand: null, sort: null })

const cards = ref<PeripheralCard[]>([])
const isLoading = ref(false)
const pagination = ref({ current_page: 1, per_page: 24, total: 0, last_page: 1 })

const paginationLinks = computed((): PaginationLinks => ({
  first: pagination.value.current_page === 1 ? null : '?page=1',
  last: pagination.value.current_page >= pagination.value.last_page ? null : `?page=${pagination.value.last_page}`,
  prev: pagination.value.current_page <= 1 ? null : `?page=${pagination.value.current_page - 1}`,
  next: pagination.value.current_page >= pagination.value.last_page ? null : `?page=${pagination.value.current_page + 1}`,
}))
const paginationMeta = computed((): PaginationMeta => ({
  current_page: pagination.value.current_page, last_page: pagination.value.last_page, per_page: pagination.value.per_page,
  from: pagination.value.total > 0 ? (pagination.value.current_page - 1) * pagination.value.per_page + 1 : null,
  to: pagination.value.total > 0 ? Math.min(pagination.value.current_page * pagination.value.per_page, pagination.value.total) : null,
  total: pagination.value.total,
}))

async function load() {
  isLoading.value = true
  try {
    const apiFilters: any = { page: pagination.value.current_page }
    if (props.apiType === 'monitor') {
      const f = monitorFilters.value
      if (f.min_price != null) apiFilters.min_price = f.min_price
      if (f.max_price != null) apiFilters.max_price = f.max_price
      if (f.brand != null) apiFilters.brand_id = f.brand
      if (f.sort) apiFilters.sort = f.sort
      if (f.size != null) apiFilters.size = f.size
      if (f.form_factor != null) apiFilters.form_factor = f.form_factor
      if (f.panel_type != null) apiFilters.panel_type = f.panel_type
      if (f.resolution != null) apiFilters.resolution = f.resolution
      if (f.refresh_rate != null) apiFilters.refresh_rate = f.refresh_rate
      if (f.response_time != null) apiFilters.response_time = f.response_time
      if (f.stand != null) apiFilters.stand = f.stand
      if (f.is_build_in_speaker != null) apiFilters.is_build_in_speaker = f.is_build_in_speaker
    } else {
      const f = peripheralFilters.value
      if (f.min_price != null) apiFilters.min_price = f.min_price
      if (f.max_price != null) apiFilters.max_price = f.max_price
      if (f.brand != null) apiFilters.brand_id = f.brand
      if (f.sort) apiFilters.sort = f.sort
    }
    const result = await fetchPeripheralCards(props.apiType, apiFilters)
    cards.value = result.data
    pagination.value = {
      current_page: result.meta.current_page,
      per_page: result.meta.per_page,
      total: result.meta.total,
      last_page: result.meta.last_page,
    }
  } catch (err) {
    console.error(err)
    cards.value = []
  } finally {
    isLoading.value = false
  }
}

function onPageChange(page: number) {
  pagination.value.current_page = page
  load()
}

function onSelect(id: number | undefined) {
  if (id == null) return
  const card = cards.value.find(c => c.id === id)
  if (card) {
    const price = card.discount_price && card.discount_price !== '' && parseFloat(card.discount_price) > 0 ? card.discount_price : card.price
    emit('select', { id: card.id, name: card.name, price, image: card.image ?? undefined })
    close()
  }
}

watch(() => [monitorFilters.value, peripheralFilters.value], () => { pagination.value.current_page = 1; load() }, { deep: true })
watch(() => props.modelValue, (v) => { if (v) load() })

function close() {
  emit('update:modelValue', false)
}
</script>

<style scoped>
.modal-overlay { position: fixed; inset: 0; z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1rem; background-color: rgba(90, 108, 125, 0.4); backdrop-filter: blur(4px); }
.modal-container { width: 80vw; height: 80vh; max-width: 80vw; max-height: 80vh; overflow: auto; }
.modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; }
.modal-title { font-size: 1.25rem; font-weight: 600; color: #5a6c7d; margin: 0; }
.modal-close { width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: #5a6c7d; background: #e0e5ec; border: none; border-radius: 50%; cursor: pointer; box-shadow: 4px 4px 4px rgba(199, 204, 211, 0.35), -4px -4px 4px rgba(255, 255, 255, 0.49); }
.modal-close:hover { transform: scale(1.05); }
.modal-close-icon { width: 1.25rem; height: 1.25rem; object-fit: contain; }
.modal-body { color: #5a6c7d; display: flex; flex-direction: column; gap: 1rem; }
.modal-cards-loading { text-align: center; padding: 1.5rem; color: #5a6c7d; }
.modal-cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr)); gap: 1rem; margin-top: 0.5rem; }
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-active .modal-container, .modal-leave-active .modal-container { transition: transform 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-container, .modal-leave-to .modal-container { transform: scale(0.95); }
</style>
