import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/app.vue',
    './src/components/**/*.{vue,js,ts}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/plugins/**/*.{js,ts}',
    './src/error.vue'
  ],
  theme: {
    extend: {}
  },
  plugins: []
}

export default config

