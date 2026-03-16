import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('../pages/HomePage.vue')
const LaptopPage = () => import('../pages/LaptopPage.vue')
const DesktopPage = () => import('../pages/DesktopPage.vue')
const ComponentPage = () => import('../pages/ComponentPage.vue')
const SetupPage = () => import('../pages/SetupPage.vue')
const PeripheralsPage = () => import('../pages/PeripheralsPage.vue')
const HandheldPage = () => import('../pages/HandheldPage.vue')
const VRPage = () => import('../pages/VRPage.vue')
const AccessoriesPage = () => import('../pages/AccessoriesPage.vue')
const BrandPage = () => import('../pages/BrandPage.vue')
const BrandDetailPage = () => import('../pages/BrandDetailPage.vue')
const LaptopDetailPage = () => import('../pages/LaptopDetailPage.vue')
const DesktopDetailPage = () => import('../pages/DesktopDetailPage.vue')
const CpuDetailPage = () => import('../pages/CpuDetailPage.vue')
const GpuDetailPage = () => import('../pages/GpuDetailPage.vue')
const RamDetailPage = () => import('../pages/RamDetailPage.vue')
const MotherboardDetailPage = () => import('../pages/MotherboardDetailPage.vue')
const StorageDetailPage = () => import('../pages/StorageDetailPage.vue')
const CaseDetailPage = () => import('../pages/CaseDetailPage.vue')
const CoolerDetailPage = () => import('../pages/CoolerDetailPage.vue')
const PsuDetailPage = () => import('../pages/PsuDetailPage.vue')
const FanDetailPage = () => import('../pages/FanDetailPage.vue')
const MouseDetailPage = () => import('../pages/MouseDetailPage.vue')
const KeyboardDetailPage = () => import('../pages/KeyboardDetailPage.vue')
const HeadsetDetailPage = () => import('../pages/HeadsetDetailPage.vue')
const SpeakerDetailPage = () => import('../pages/SpeakerDetailPage.vue')
const MonitorDetailPage = () => import('../pages/MonitorDetailPage.vue')
const MousepadDetailPage = () => import('../pages/MousepadDetailPage.vue')
const WebcamDetailPage = () => import('../pages/WebcamDetailPage.vue')
const MicrophoneDetailPage = () => import('../pages/MicrophoneDetailPage.vue')
const ControllerDetailPage = () => import('../pages/ControllerDetailPage.vue')
const AccessoryDetailPage = () => import('../pages/AccessoryDetailPage.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    return savedPosition ?? { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/laptop',
      name: 'laptop',
      component: LaptopPage,
    },
    {
      path: '/laptop/:id',
      name: 'laptop-detail',
      component: LaptopDetailPage,
    },
    {
      path: '/desktop',
      name: 'desktop',
      component: DesktopPage,
    },
    {
      path: '/desktop/:id',
      name: 'desktop-detail',
      component: DesktopDetailPage,
    },
    {
      path: '/brand',
      name: 'brand',
      component: BrandPage,
    },
    {
      path: '/brandDetail/:id',
      name: 'brand-detail',
      component: BrandDetailPage,
    },
    {
      path: '/component',
      name: 'component',
      component: ComponentPage,
    },
    {
      path: '/component/:type',
      name: 'component-tab',
      component: ComponentPage,
    },
    {
      path: '/component/cpu/:id',
      name: 'cpu-detail',
      component: CpuDetailPage,
    },
    {
      path: '/component/gpu/:id',
      name: 'gpu-detail',
      component: GpuDetailPage,
    },
    {
      path: '/component/ram/:id',
      name: 'ram-detail',
      component: RamDetailPage,
    },
    {
      path: '/component/motherboard/:id',
      name: 'motherboard-detail',
      component: MotherboardDetailPage,
    },
    {
      path: '/component/storage/:id',
      name: 'storage-detail',
      component: StorageDetailPage,
    },
    {
      path: '/component/case/:id',
      name: 'case-detail',
      component: CaseDetailPage,
    },
    {
      path: '/component/cooler/:id',
      name: 'cooler-detail',
      component: CoolerDetailPage,
    },
    {
      path: '/component/psu/:id',
      name: 'psu-detail',
      component: PsuDetailPage,
    },
    {
      path: '/component/fan/:id',
      name: 'fan-detail',
      component: FanDetailPage,
    },
    {
      path: '/setup',
      name: 'setup',
      component: SetupPage,
    },
    {
      path: '/peripherals',
      name: 'peripherals',
      component: PeripheralsPage,
    },
    {
      path: '/peripheral/:category',
      name: 'peripheral-tab',
      component: PeripheralsPage,
    },
    {
      path: '/peripheral/mouse/:id',
      name: 'mouse-detail',
      component: MouseDetailPage,
    },
    {
      path: '/peripheral/keyboard/:id',
      name: 'keyboard-detail',
      component: KeyboardDetailPage,
    },
    {
      path: '/peripheral/headset/:id',
      name: 'headset-detail',
      component: HeadsetDetailPage,
    },
    {
      path: '/peripheral/speaker/:id',
      name: 'speaker-detail',
      component: SpeakerDetailPage,
    },
    {
      path: '/peripheral/monitor/:id',
      name: 'monitor-detail',
      component: MonitorDetailPage,
    },
    {
      path: '/peripheral/mousepad/:id',
      name: 'mousepad-detail',
      component: MousepadDetailPage,
    },
    {
      path: '/peripheral/webcam/:id',
      name: 'webcam-detail',
      component: WebcamDetailPage,
    },
    {
      path: '/peripheral/microphone/:id',
      name: 'microphone-detail',
      component: MicrophoneDetailPage,
    },
    {
      path: '/peripheral/controller/:id',
      name: 'controller-detail',
      component: ControllerDetailPage,
    },
    {
      path: '/handheld',
      name: 'handheld',
      component: HandheldPage,
    },
    {
      path: '/vr',
      name: 'vr',
      component: VRPage,
    },
    {
      path: '/accessories',
      name: 'accessories',
      component: AccessoriesPage,
    },
    {
      path: '/accessory',
      name: 'accessory',
      component: AccessoriesPage,
    },
    {
      path: '/accessory/:id',
      name: 'accessory-detail',
      component: AccessoryDetailPage,
    },
  ],
})

export default router
