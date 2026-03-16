<template>
  <nav class="navbar-container fixed top-0 left-0 right-0 z-50 w-screen">
    <div class="navbar-content w-full px-4 sm:px-6 lg:px-8">
      <!-- Desktop Layout (>= 1024px) -->
      <div class="hidden lg:flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 cursor-pointer">
          <h1 class="text-lg xl:text-2xl font-bold text-[#5a6c7d]">
            {{ $t("nav.logo") }}
          </h1>
        </router-link>

        <!-- Navigation Links -->
        <div class="flex items-center gap-2 xl:gap-4">
          <router-link
            to="/laptop"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/laptop' }"
          >
            {{ $t("nav.laptop") }}
          </router-link>
          <router-link
            to="/desktop"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/desktop' }"
          >
            {{ $t("nav.desktop") }}
          </router-link>
          <router-link
            to="/component"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/component' }"
          >
            {{ $t("nav.component") }}
          </router-link>
          <router-link
            to="/peripherals"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/peripherals' }"
          >
            {{ $t("nav.peripherals") }}
          </router-link>
          <router-link
            to="/accessories"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/accessories' }"
          >
            {{ $t("nav.accessories") }}
          </router-link>
          <router-link
            to="/brand"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/brand' }"
          >
            {{ $t("nav.brand") }}
          </router-link>
          <router-link
            to="/setup"
            class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all"
            :class="{ 'nav-link-active': route.path === '/setup' }"
          >
            {{ $t("nav.buildPc") }}
          </router-link>
          <!-- Gaming Dropdown -->
          <!-- <div class="relative gaming-dropdown" @mouseenter="isGamingDropdownOpen = true" @mouseleave="isGamingDropdownOpen = false">
            <button
              class="nav-link text-[#5a6c7d] px-2 xl:px-4 py-2 text-xs xl:text-base font-medium transition-all flex items-center gap-1"
              :class="{ 'nav-link-active': isGamingRouteActive }"
            >
              Gaming
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <div
              v-if="isGamingDropdownOpen"
              class="absolute top-full left-0 mt-1 neumorphic-card min-w-[160px] py-2 z-50"
            >
              <router-link
                to="/console"
                class="block px-4 py-2 text-[#5a6c7d] hover:bg-[rgba(199,204,211,0.1)] text-sm font-medium transition-all rounded-[20px]"
                :class="{ 'bg-[rgba(199,204,211,0.15)]': route.path === '/console' }"
                @click="isGamingDropdownOpen = false"
              >
                Console
              </router-link>
              <router-link
                to="/handheld"
                class="block px-4 py-2 text-[#5a6c7d] hover:bg-[rgba(199,204,211,0.1)] text-sm font-medium transition-all rounded-[20px]"
                :class="{ 'bg-[rgba(199,204,211,0.15)]': route.path === '/handheld' }"
                @click="isGamingDropdownOpen = false"
              >
                Handheld
              </router-link>
              <router-link
                to="/vr"
                class="block px-4 py-2 text-[#5a6c7d] hover:bg-[rgba(199,204,211,0.1)] text-sm font-medium transition-all rounded-[20px]"
                :class="{ 'bg-[rgba(199,204,211,0.15)]': route.path === '/vr' }"
                @click="isGamingDropdownOpen = false"
              >
                VR
              </router-link>
            </div>
          </div> -->
        </div>

        <div class="flex items-center gap-2 xl:gap-4">
           <!-- Language Switcher -->
           <div>
             <select
               v-model="currentLocale"
               @change="changeLanguage"
               class="neumorphic-input p-2 text-sm h-10"
             >
              <option value="en">English</option>
              <option value="km">ភាសាខ្មែរ</option>
              <option value="zh">中文</option>
              <option value="th">ไทย</option>
              <option value="vi">Tiếng Việt</option>
            </select>
          </div>

          <!-- Search Button -->
          <div>
            <button
              @click="handleSearch"
              class="neumorphic p-2 rounded-[20px]"
              :title="$t('nav.search')"
            >
              <svg
                class="h-5 w-5 text-[#5a6c7d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile & Tablet Layout (< 1024px) -->
      <div class="lg:hidden flex items-center justify-between h-16">
        <!-- Burger Icon -->
        <button
          @click="toggleMobileMenu"
          class="neumorphic inline-flex items-center justify-center p-2 focus:outline-none rounded-[20px]"
          :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
        >
          <svg
            class="h-5 w-5 text-[#5a6c7d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              v-if="!isMobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex-shrink-0 cursor-pointer">
          <h1 class="text-lg font-bold text-[#5a6c7d]">
            {{ $t("nav.logo") }}
          </h1>
        </router-link>

        <!-- Language Dropdown and Search Button -->
        <div class="flex items-center gap-2">
          <!-- Language Dropdown -->
          <div>
            <select
              v-model="currentLocale"
              @change="changeLanguage"
              class="neumorphic-input p-1.5 text-xs h-8"
            >
              <option value="en">EN</option>
              <option value="km">KM</option>
              <option value="zh">ZH</option>
              <option value="th">TH</option>
              <option value="vi">VI</option>
            </select>
          </div>

          <!-- Search Button -->
          <button
            @click="handleSearch"
            class="neumorphic p-1.5 rounded-lg"
            :title="$t('nav.search')"
          >
            <svg
              class="h-4 w-4 text-[#5a6c7d]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Sidebar Overlay -->
    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300"
        @click="closeMobileMenu"
        style="pointer-events: auto;"
      ></div>

      <!-- Sidebar -->
      <div
        class="lg:hidden fixed top-0 left-0 h-full w-64 z-[70] transform transition-transform duration-300 ease-in-out"
        :class="isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'"
        style="pointer-events: auto;"
      >
      <div class="neumorphic-card h-full w-full p-4 overflow-y-auto relative" style="border-radius: 0;">
        <!-- Close Button - Top Right Corner -->
        <button
          @click="closeMobileMenu"
          class="neumorphic absolute top-2 right-2 p-2 z-10 rounded-[20px]"
          aria-label="Close menu"
        >
          <svg
            class="h-5 w-5 text-[#5a6c7d]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex justify-center mb-6 mt-2 cursor-pointer" @click="closeMobileMenu">
          <h1 class="text-xl font-bold text-[#5a6c7d]">
            {{ $t("nav.logo") }}
          </h1>
        </router-link>

        <!-- Navigation Links -->
        <nav class="flex flex-col space-y-3">
          <router-link
            to="/laptop"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/laptop' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.laptop") }}
          </router-link>
          <router-link
            to="/desktop"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/desktop' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.desktop") }}
          </router-link>
          <router-link
            to="/component"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/component' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.component") }}
          </router-link>
          <router-link
            to="/peripherals"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/peripherals' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.peripherals") }}
          </router-link>
          <router-link
            to="/accessories"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/accessories' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.accessories") }}
          </router-link>
          <router-link
            to="/brand"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/brand' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.brand") }}
          </router-link>
          <router-link
            to="/setup"
            class="nav-link-mobile w-full text-left px-4 py-3 text-[#5a6c7d] font-medium transition-all block"
            :class="{ 'nav-link-mobile-active': route.path === '/setup' }"
            @click="closeMobileMenu"
          >
            {{ $t("nav.buildPc") }}
          </router-link>
        </nav>
      </div>
    </div>
    </Teleport>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute } from "vue-router";

const { locale } = useI18n();
const route = useRoute();
const isMobileMenuOpen = ref(false);
const searchQuery = ref("");

const currentLocale = computed({
  get: () => locale.value,
  set: (value) => {
    locale.value = value;
  },
});

// Active state is now handled directly in template using route.path

const changeLanguage = () => {
  localStorage.setItem("locale", locale.value);
  // Font will be updated automatically via useFont composable
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Handle search functionality here
    console.log("Searching for:", searchQuery.value);
    // You can emit an event or navigate to search results page
  }
};


const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<style scoped>
.navbar-container {
  background-color: #e0e5ec;
  box-shadow: 0 4px 8px rgba(199, 204, 211, 0.3), 0 -2px 4px rgba(255, 255, 255, 0.4);
}

.navbar-content {
  max-width: 1280px;
  margin: 0 auto;
}

/* Desktop Nav Links */
.nav-link {
  position: relative;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(199, 204, 211, 0.1);
  box-shadow: 4px 4px 4px rgba(199, 204, 211, 0.3), -4px -4px 4px rgba(255, 255, 255, 0.45);
}

.nav-link-active {
  background: #e0e5ec;
  box-shadow: inset 3px 3px 10px rgba(199, 204, 211, 0.6), inset -3px -3px 10px rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(199, 204, 211, 0.827);
  transform: scale(0.98);
}

/* Mobile Nav Links */
.nav-link-mobile {
  border-radius: 10px;
  transition: all 0.3s ease;
  background: #e0e5ec;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
}

.nav-link-mobile:hover {
  box-shadow: 4px 4px 4px rgba(199, 204, 211, 0.4), -4px -4px 4px rgba(255, 255, 255, 0.5);
}

.nav-link-mobile-active {
  background: #e0e5ec;
  box-shadow: inset 3px 3px 10px rgba(199, 204, 211, 0.6), inset -3px -3px 10px rgba(255, 255, 255, 0.7);
  border-radius: 10px;
  border: 1px solid rgba(199, 204, 211, 0.827);
  transform: scale(0.98);
}

/* Gaming Dropdown */
.gaming-dropdown {
  position: relative;
}

.gaming-dropdown .neumorphic-card {
  background: #e0e5ec;
  border-radius: 20px;
  box-shadow: 6px 6px 5px rgba(199, 204, 211, 0.35), -6px -6px 5px rgba(255, 255, 255, 0.48999999999999994);
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
