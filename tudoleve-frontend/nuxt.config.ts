import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-03-17',
  srcDir: 'src/',
  css: ['~/assets/css/main.css'],
  typescript: {
    strict: true,
    typeCheck: false
  },
  modules: ['@pinia/nuxt', '@nuxtjs/tailwindcss'],
  runtimeConfig: {
    // Server-only: used by SSR inside Docker (env: NUXT_API_BASE_URL).
    // Falls back to the public URL when not set (e.g. local dev without Docker).
    apiBaseUrl: '',
    public: {
      // Exposed to the browser (env: NUXT_PUBLIC_API_BASE_URL).
      apiBaseUrl: ''
    }
  },
  app: {
    head: {
      title: 'TudoLeve Loja Online',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  }
})

