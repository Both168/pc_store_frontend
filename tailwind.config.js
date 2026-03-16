/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-cream-50',
    'bg-beigeLight-50',
    'text-brown-500',
    'text-taupe-500',
    'border-taupe-200',
    'border-taupe-300',
    'border-taupe-400',
    'bg-cream-100',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        khmer: ['"Kdam Thmor Pro"', 'Khmer', 'system-ui', 'sans-serif'],
        chinese: ['Noto Sans SC', 'Microsoft YaHei', 'SimHei', 'sans-serif'],
        thai: ['Kanit', 'Noto Sans Thai', 'system-ui', 'sans-serif'],
        vietnamese: ['Inter', 'Be Vietnam Pro', 'system-ui', 'sans-serif'],
      },
      colors: {
        beige: {
          50: '#F5F1EB',
          100: '#E8E0D6',
          200: '#D4C4B0',
          300: '#C0A88A',
          400: '#AC8C64',
          500: '#98703E',
        },
        brown: {
          50: '#8B7355',
          100: '#7A6347',
          200: '#695339',
          300: '#58432B',
          400: '#47331D',
          500: '#36230F',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FAF8F3',
          200: '#F5F1E7',
          300: '#F0EADB',
          400: '#EBE3CF',
          500: '#E6DCC3',
        },
        taupe: {
          50: '#D4CCC4',
          100: '#C4B8AE',
          200: '#B4A498',
          300: '#A49082',
          400: '#947C6C',
          500: '#846856',
        },
        beigeLight: {
          50: '#FAF8F5',
          100: '#F5F0E9',
          200: '#EBE1D3',
          300: '#E1D2BD',
          400: '#D7C3A7',
          500: '#CDB491',
        },
        neumorphic: {
          background: '#e0e5ec',
          text: '#5a6c7d',
          shadowDark: 'rgba(204, 209, 216, 0.48)',
          shadowLight: 'rgba(252, 255, 255, 0.68)',
        },
      },
    },
  },
  plugins: [],
}

