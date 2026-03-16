<template>
  <div class="min-h-screen relative" style="background-color: #e0e5ec;">
    <Navbar />
    <div class="pt-20 px-4 sm:px-6 lg:px-8 py-12">
      <div class="max-w-3xl mx-auto">
        <div class="summary-row text-3xl md:text-4xl font-bold text-[#5a6c7d] mb-8">
          <div class="summary-cell">
            <span class="summary-icon-wrap summary-icon-wrap-price">
              <img :src="priceIcon" :alt="$t('setup.price')" class="summary-icon" />
            </span>
            <span class="summary-value summary-value-price">${{ totalPrice }}</span>
          </div>
          <div class="summary-cell">
            <button
              type="button"
              class="neumorphic-button px-4 py-2 text-base font-medium w-full"
              @click="onReset"
            >
              {{ $t('setup.reset') }}
            </button>
          </div>
          <div class="summary-cell">
            <button
              type="button"
              class="neumorphic-button px-4 py-2 text-base font-medium w-full"
              @click="onExportPdf"
            >
              {{ $t('setup.exportToPdf') }}
            </button>
          </div>
        </div>

        <section class="neumorphic-card mb-8">
          <h2 class="text-lg font-semibold text-[#5a6c7d] mb-4">{{ $t('setup.mainComponents') }}</h2>
          <ul class="space-y-1">
            <li
              v-for="item in mainComponents"
              :key="item.id"
              class="build-pc-row flex items-center justify-between gap-4 py-3 px-4 rounded-[20px] transition-all"
            >
              <div class="flex items-center gap-3 min-w-0">
                <img
                  :src="getRowIcon(item)"
                  :alt="getRowName(item)"
                  class="build-pc-icon flex-shrink-0 object-contain"
                  :class="{ 'build-pc-icon-case': getSelected(item.id)?.image }"
                />
                <span class="text-[#5a6c7d] font-medium">{{ getRowName(item) }}</span>
              </div>
              <template v-if="buildPartIds.includes(item.id)">
                <template v-if="getSelected(item.id)">
                  <span class="build-row-case-price font-medium flex-shrink-0">${{ getSelected(item.id)!.price }}</span>
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button type="button" class="neumorphic-button build-row-replace-btn" :aria-label="$t('setup.replace')" @click="openModal(item.id)">
                      <img :src="replaceIcon" alt="Replace" class="build-row-replace-icon" />
                    </button>
                    <button type="button" class="build-row-remove" :aria-label="$t('setup.remove')" @click="clearPart(item.id)">
                      <img :src="crossCircleIcon" alt="Remove" class="build-row-remove-icon" />
                    </button>
                  </div>
                </template>
                <button v-else type="button" class="neumorphic-button flex-shrink-0 px-4 py-2 text-sm font-medium" @click="openModal(item.id)">
                  {{ $t('setup.addPart') }}
                </button>
              </template>
              <router-link v-else :to="item.to" class="neumorphic-button flex-shrink-0 px-4 py-2 text-sm font-medium">
                {{ $t('setup.addPart') }}
              </router-link>
            </li>
          </ul>
        </section>
      </div>
    </div>

    <CaseModal :model-value="openModalId === 'case'" @update:model-value="(v) => { if (!v) openModalId = null }" @select-case="(d) => onPartSelected('case', d)" />
    <CpuModal :model-value="openModalId === 'cpu'" @update:model-value="(v) => { if (!v) openModalId = null }" @select-cpu="(d) => onPartSelected('cpu', d)" />
    <GpuModal :model-value="openModalId === 'gpu'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('gpu', d)" />
    <MotherboardModal :model-value="openModalId === 'motherboard'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('motherboard', d)" />
    <RamModal :model-value="openModalId === 'ram'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('ram', d)" />
    <CoolerModal :model-value="openModalId === 'cooler'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('cooler', d)" />
    <StorageModal :model-value="openModalId === 'storage'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('storage', d)" />
    <PsuModal :model-value="openModalId === 'psu'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('psu', d)" />
    <FanModal :model-value="openModalId === 'fan'" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('fan', d)" />
    <PeripheralModal :model-value="openModalId === 'monitor'" api-type="monitor" title="Add Monitor" detail-path="/peripheral/monitor" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('monitor', d)" />
    <PeripheralModal :model-value="openModalId === 'mouse'" api-type="mice" title="Add Mouse" detail-path="/peripheral/mouse" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('mouse', d)" />
    <PeripheralModal :model-value="openModalId === 'keyboard'" api-type="keyboard" title="Add Keyboard" detail-path="/peripheral/keyboard" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('keyboard', d)" />
    <PeripheralModal :model-value="openModalId === 'speaker'" api-type="speaker" title="Add Speaker" detail-path="/peripheral/speaker" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('speaker', d)" />
    <PeripheralModal :model-value="openModalId === 'headphones'" api-type="headset" title="Add Headphones" detail-path="/peripheral/headset" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('headphones', d)" />
    <PeripheralModal :model-value="openModalId === 'microphone'" api-type="mic" title="Add Microphone" detail-path="/peripheral/microphone" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('microphone', d)" />
    <PeripheralModal :model-value="openModalId === 'webcam'" api-type="webcams" title="Add Webcam" detail-path="/peripheral/webcam" @update:model-value="(v) => { if (!v) openModalId = null }" @select="(d) => onPartSelected('webcam', d)" />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { jsPDF } from 'jspdf'
import Navbar from '../components/layout/Navbar.vue'
import Footer from '../components/layout/Footer.vue'
import CaseModal from '../components/Modal/CaseModal.vue'
import CpuModal from '../components/Modal/CpuModal.vue'
import GpuModal from '../components/Modal/GpuModal.vue'
import MotherboardModal from '../components/Modal/MotherboardModal.vue'
import RamModal from '../components/Modal/RamModal.vue'
import CoolerModal from '../components/Modal/CoolerModal.vue'
import StorageModal from '../components/Modal/StorageModal.vue'
import PsuModal from '../components/Modal/PsuModal.vue'
import FanModal from '../components/Modal/FanModal.vue'
import PeripheralModal from '../components/Modal/PeripheralModal.vue'
import caseIcon from '../assets/icons/component/case.png'
import cpuIcon from '../assets/icons/component/cpu.png'
import motherboardIcon from '../assets/icons/component/motherboard.png'
import gpuIcon from '../assets/icons/component/gpu.png'
import ramIcon from '../assets/icons/component/ram.png'
import coolerIcon from '../assets/icons/component/cooler.png'
import storageIcon from '../assets/icons/component/storage.png'
import psuIcon from '../assets/icons/component/psu.png'
import fanIcon from '../assets/icons/component/fan.png'
import monitorIcon from '../assets/icons/peripheral/monitor.png'
import mouseIcon from '../assets/icons/peripheral/mouse.png'
import keyboardIcon from '../assets/icons/peripheral/keyboard.png'
import speakerIcon from '../assets/icons/peripheral/speaker.png'
import headsetIcon from '../assets/icons/peripheral/headset.png'
import micIcon from '../assets/icons/peripheral/mic.png'
import webcamIcon from '../assets/icons/peripheral/webcam.png'
import priceIcon from '../assets/icons/setup/dollar.png'
import replaceIcon from '../assets/icons/setup/replace.png'
import crossCircleIcon from '../assets/icons/setup/cross-circle.png'

const mainComponents = [
  { id: 'case', name: 'Case', to: '/component', icon: caseIcon },
  { id: 'cpu', name: 'CPU', to: '/component', icon: cpuIcon },
  { id: 'motherboard', name: 'Motherboard', to: '/component', icon: motherboardIcon },
  { id: 'gpu', name: 'GPU', to: '/component', icon: gpuIcon },
  { id: 'ram', name: 'RAM', to: '/component', icon: ramIcon },
  { id: 'cooler', name: 'CPU Cooler', to: '/component', icon: coolerIcon },
  { id: 'storage', name: 'Storage', to: '/component', icon: storageIcon },
  { id: 'psu', name: 'Power Supply', to: '/component', icon: psuIcon },
  { id: 'fan', name: 'Case Fan', to: '/component', icon: fanIcon },
  { id: 'monitor', name: 'Monitor', to: '/peripherals', icon: monitorIcon },
  { id: 'mouse', name: 'Mouse', to: '/peripherals', icon: mouseIcon },
  { id: 'keyboard', name: 'Keyboard', to: '/peripherals', icon: keyboardIcon },
  { id: 'speaker', name: 'Speaker', to: '/peripherals', icon: speakerIcon },
  { id: 'headphones', name: 'Headphones', to: '/peripherals', icon: headsetIcon },
  { id: 'microphone', name: 'Microphone', to: '/peripherals', icon: micIcon },
  { id: 'webcam', name: 'Webcam', to: '/peripherals', icon: webcamIcon },
]

const buildPartIds = ['case', 'cpu', 'motherboard', 'gpu', 'ram', 'cooler', 'storage', 'psu', 'fan', 'monitor', 'mouse', 'keyboard', 'speaker', 'headphones', 'microphone', 'webcam']

const SETUP_STORAGE_KEY = 'setup-selected-parts'

type PartItem = { id: number; name: string; price: string; image?: string }
const selectedParts = ref<Record<string, PartItem | null>>({})
const openModalId = ref<string | null>(null)

function loadSavedBuild() {
  try {
    const raw = localStorage.getItem(SETUP_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as Record<string, PartItem | null>
    if (parsed && typeof parsed === 'object') selectedParts.value = parsed
  } catch {
    // ignore invalid stored data
  }
}

function saveBuild() {
  try {
    localStorage.setItem(SETUP_STORAGE_KEY, JSON.stringify(selectedParts.value))
  } catch {
    // ignore quota / privacy errors
  }
}

watch(selectedParts, saveBuild, { deep: true })
onMounted(loadSavedBuild)

const totalPrice = computed(() => {
  let sum = 0
  for (const part of Object.values(selectedParts.value)) {
    if (part?.price) sum += parseFloat(part.price) || 0
  }
  return sum.toFixed(2)
})

function openModal(id: string) {
  openModalId.value = id
}

function clearPart(id: string) {
  const next = { ...selectedParts.value, [id]: null }
  selectedParts.value = next
}

function getSelected(id: string): PartItem | null {
  return selectedParts.value[id] ?? null
}

function onPartSelected(partId: string, data: PartItem) {
  selectedParts.value = { ...selectedParts.value, [partId]: data }
  openModalId.value = null
}

function getRowIcon(item: { id: string; name: string; icon: string }) {
  const part = getSelected(item.id)
  if (part?.image) return part.image
  return item.icon
}

function getRowName(item: { id: string; name: string }) {
  const part = getSelected(item.id)
  if (part) return part.name
  return item.name
}

function onReset() {
  selectedParts.value = {}
  localStorage.removeItem(SETUP_STORAGE_KEY)
}

function onExportPdf() {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  let y = 20

  doc.setFontSize(18)
  doc.text('PC Build Summary', pageW / 2, y, { align: 'center' })
  y += 15

  doc.setFontSize(11)
  const entries = mainComponents
    .filter((m) => selectedParts.value[m.id])
    .map((m) => {
      const part = selectedParts.value[m.id]!
      return { category: m.name, name: part.name, price: part.price }
    })

  if (entries.length === 0) {
    doc.text('No parts selected.', 20, y)
    y += 10
  } else {
    doc.setFont('helvetica', 'bold')
    doc.text('Component', 20, y)
    doc.text('Product', 70, y)
    doc.text('Price', pageW - 25, y, { align: 'right' })
    y += 8
    doc.setFont('helvetica', 'normal')

    for (const e of entries) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }
      const name = doc.splitTextToSize(e.name, pageW - 70 - 35)
      doc.text(e.category, 20, y)
      doc.text(name, 70, y)
      doc.text('$' + e.price, pageW - 20, y, { align: 'right' })
      y += name.length * 6 + 4
    }

    y += 6
    doc.setDrawColor(180, 180, 180)
    doc.line(20, y, pageW - 20, y)
    y += 10
    doc.setFont('helvetica', 'bold')
    doc.text('Total', 20, y)
    doc.text('$' + totalPrice.value, pageW - 20, y, { align: 'right' })
  }

  doc.save('pc-build.pdf')
}
</script>

<style scoped>
.summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0;
  align-items: stretch;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 6px 6px 12px #bebebe, -6px -6px 12px #ffffff;
  background: #e0e5ec;
}

.summary-cell {
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-align: center;
  border-right: 1px solid rgba(90, 108, 125, 0.15);
}

.summary-cell:last-child {
  border-right: none;
}

.summary-icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25em;
  border-radius: 0.375em;
}

.summary-icon-wrap-price {
  background-color: rgba(21, 128, 61, 0.2);
}

.summary-icon {
  width: 1em;
  height: 1em;
  object-fit: contain;
  flex-shrink: 0;
}

.summary-value-price {
  color: #15803d;
}

@media (max-width: 768px) {
  .summary-row {
    grid-template-columns: 1fr;
  }

  .summary-cell {
    border-right: none;
    border-bottom: 1px solid rgba(90, 108, 125, 0.15);
  }

  .summary-cell:last-child {
    border-bottom: none;
  }
}

.build-pc-row:hover {
  background: rgba(199, 204, 211, 0.15);
  box-shadow: inset 2px 2px 4px rgba(199, 204, 211, 0.2);
}

.build-pc-icon {
  width: 2rem;
  height: 2rem;
}

.build-pc-icon-case {
  width: 5rem;
  height: 5rem;
}

.build-row-case-price {
  color: #15803d;
}

/* Shared style for Replace and Remove buttons */
.build-row-replace-btn,
.build-row-remove {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e0e5ec;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  box-shadow:
    3px 3px 6px rgba(199, 204, 211, 0.4),
    -3px -3px 6px rgba(255, 255, 255, 0.6),
    inset 1px 1px 2px rgba(255, 255, 255, 0.5);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.build-row-replace-btn:hover,
.build-row-remove:hover {
  transform: scale(1.06);
  box-shadow:
    4px 4px 8px rgba(199, 204, 211, 0.45),
    -4px -4px 8px rgba(255, 255, 255, 0.65),
    inset 1px 1px 2px rgba(255, 255, 255, 0.5);
}

.build-row-replace-btn:active,
.build-row-remove:active {
  transform: scale(0.98);
  box-shadow:
    inset 2px 2px 4px rgba(199, 204, 211, 0.3),
    inset -2px -2px 4px rgba(255, 255, 255, 0.4);
}

/* Unify icon color so both match the UI grey */
.build-row-replace-icon {
  width: 1.25rem;
  height: 1.25rem;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(42%) sepia(15%) saturate(1200%) hue-rotate(170deg);
}

.build-row-remove-icon {
  width: 1.5rem;
  height: 1.5rem;
  object-fit: contain;
  filter: brightness(0) saturate(100%) invert(42%) sepia(15%) saturate(1200%) hue-rotate(170deg);
}
</style>
