# Vue 3 + TypeScript + Vite + Tailwind CSS + Vue I18n

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn package manager

## Project Setup

### 1. Create New Project (If Starting from Scratch)

```bash
npm create vue@latest my-project
cd my-project
npm install
```

Select the following options when prompted:
- ✅ TypeScript
- ❌ JSX Support (optional)
- ✅ Router (Vue Router)
- ✅ Pinia (State Management)
- ❌ Vitest (optional)
- ❌ End-to-End Testing (optional)
- ❌ ESLint (optional)
- ❌ Prettier (optional)

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 4. Initialize Tailwind Configuration

Create `tailwind.config.js` in the project root:

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 5. Create PostCSS Configuration

Create `postcss.config.js` in the project root:

```js
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default {
  plugins: [
    tailwindcss,
    autoprefixer,
  ],
}
```

### 6. Configure Tailwind Directives

Create or update `src/assets/styles/base/style.css` with Tailwind directives:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Update `src/main.ts` to import the CSS file:

```ts
import { createApp } from 'vue'
import './assets/styles/base/style.css'
import App from './App.vue'
```

### 7. Set Up Project Structure

Create the following directory structure:

```bash
mkdir -p src/api
mkdir -p src/composables
mkdir -p src/constants
mkdir -p src/types
mkdir -p src/utils
mkdir -p src/pages
mkdir -p src/assets/fonts
mkdir -p src/assets/images
mkdir -p src/assets/styles/base
mkdir -p src/assets/styles/components
mkdir -p src/assets/styles/utilities
mkdir -p src/components/common
mkdir -p src/components/layout
mkdir -p src/components/specific
```

### 8. Set Up Vue Router

If not already installed, install Vue Router:

```bash
npm install vue-router@4
```

Create `src/router/index.ts`:

```ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Add your routes here
  ],
})

export default router
```

Update `src/main.ts` to use the router:

```ts
import { createApp } from 'vue'
import './assets/styles/base/style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
```

### 9. Set Up Pinia (State Management)

If not already installed, install Pinia:

```bash
npm install pinia
```

Create `src/stores/index.ts`:

```ts
import { defineStore } from 'pinia'

export const useMainStore = defineStore('main', {
  state: () => ({}),
  getters: {},
  actions: {},
})
```

Update `src/main.ts` to use Pinia:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/base/style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.mount('#app')
```

### 10. Set Up Vue I18n (Internationalization)

Install Vue I18n:

```bash
npm install vue-i18n@9
```

Create the i18n directory structure:

```bash
mkdir -p src/i18n/locales
```

Create translation files for each language:

**`src/i18n/locales/en.ts`** (English):
```ts
export default {
  nav: {
    logo: 'i30l3 store',
    laptop: 'Laptop',
    desktop: 'Desktop',
    brand: 'Brand',
    aboutUs: 'About Us',
  },
  home: {
    title: 'Home Page',
  },
}
```

**`src/i18n/locales/km.ts`** (Khmer):
```ts
export default {
  nav: {
    logo: 'i30l3 store',
    laptop: 'អ័រប័រទុប',
    desktop: 'កុំព្យូទ័រ',
    brand: 'ម៉ាក',
    aboutUs: 'អំពីយើង',
  },
  home: {
    title: 'ទំព័រដើម',
  },
}
```

**`src/i18n/locales/zh.ts`** (Chinese):
```ts
export default {
  nav: {
    logo: 'i30l3 store',
    laptop: '笔记本电脑',
    desktop: '台式电脑',
    brand: '品牌',
    aboutUs: '关于我们',
  },
  home: {
    title: '首页',
  },
}
```

**`src/i18n/locales/th.ts`** (Thai):
```ts
export default {
  nav: {
    logo: 'i30l3 store',
    laptop: 'แล็ปท็อป',
    desktop: 'เดสก์ท็อป',
    brand: 'แบรนด์',
    aboutUs: 'เกี่ยวกับเรา',
  },
  home: {
    title: 'หน้าหลัก',
  },
}
```

**`src/i18n/locales/vi.ts`** (Vietnamese):
```ts
export default {
  nav: {
    logo: 'i30l3 store',
    laptop: 'Máy tính xách tay',
    desktop: 'Máy tính để bàn',
    brand: 'Thương hiệu',
    aboutUs: 'Về chúng tôi',
  },
  home: {
    title: 'Trang chủ',
  },
}
```

Create `src/i18n/index.ts`:

```ts
import { createI18n } from 'vue-i18n'
import en from './locales/en'
import km from './locales/km'
import zh from './locales/zh'
import th from './locales/th'
import vi from './locales/vi'

const messages = {
  en,
  km,
  zh,
  th,
  vi,
}

// Get saved language from localStorage or default to English
const savedLocale = localStorage.getItem('locale') || 'en'
const validLocales = ['en', 'km', 'zh', 'th', 'vi']
const locale = validLocales.includes(savedLocale) ? savedLocale : 'en'

const i18n = createI18n({
  legacy: false,
  locale,
  fallbackLocale: 'en',
  messages,
})

export default i18n
```

Update `src/main.ts` to use i18n:

```ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/styles/base/style.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(i18n)
app.mount('#app')
```

**Using translations in components:**

```vue
<template>
  <div>
    <h1>{{ $t('home.title') }}</h1>
    <a href="#">{{ $t('nav.laptop') }}</a>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

// Change language programmatically
const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>
```

### 11. Development

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Additional Configuration

### TypeScript Configuration

The project uses TypeScript with Vue 3. The TypeScript configuration files are:
- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.app.json` - Application-specific TypeScript config
- `tsconfig.node.json` - Node.js-specific TypeScript config

### Import Path Aliases (Optional)

You can configure path aliases in `vite.config.ts` for cleaner imports:

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
```

Then update `tsconfig.json` and `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Now you can use `@/components/...` instead of `../../components/...`

## Project Structure

src/
├── api/ #API calls (e.g., axios instances, user.api.ts)
├── assets/
│   ├── fonts/
│   ├── images/
│   └── styles/
│       ├── base/
│       ├── components/
│       └── utilities/
├── components/
│   ├── common/  # Highly reusable components (e.g., BaseButton.vue)
│   ├── layout/  # Layout specific components (e.g., Header.vue, Sidebar.vue)
│   └── specific/ # Components used only in specific views/features
├── composables/ # Reusable logic using Composition API functions (e.g., useMouse.ts)
├── constants/   # Immutable values and configuration
├── i18n/        # Internationalization (i18n) configuration
│   ├── locales/ # Translation files for each language
│   │   ├── en.ts # English
│   │   ├── km.ts # Khmer
│   │   ├── zh.ts # Chinese
│   │   ├── th.ts # Thai
│   │   └── vi.ts # Vietnamese
│   └── index.ts # i18n configuration
├── types/       # TypeScript type and interface definitions
├── router/
│   └── index.ts # Vue Router configuration
├── stores/
│   └── index.ts # Pinia store definitions
├── utils/       # Utility functions (e.g., formatters, helper functions)
├── pages/       # Components mapped to routes (pages)
│   ├── HomePage.vue
│   └── AboutPage.vue
├── App.vue      # Main application component
└── main.ts      # Application entry point (createApp, mounting)