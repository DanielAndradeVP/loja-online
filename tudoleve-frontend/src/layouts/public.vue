<script setup lang="ts">
const primaryLinks = [
  { label: 'Início', to: '/' },
  { label: 'Rastrear pedido', to: '/rastreio' }
]

const secondaryLinks = [
  { label: 'Área admin', to: '/login' }
]

const mobileMenuOpen = ref(false)
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50 text-slate-900">
    <header class="sticky top-0 z-30 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0" @click="mobileMenuOpen = false">
          <div class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
            TL
          </div>
          <div class="flex flex-col">
            <span class="text-base font-semibold leading-tight">TudoLeve</span>
            <span class="text-[0.65rem] text-slate-500 uppercase tracking-wide">
              Loja online
            </span>
          </div>
        </NuxtLink>

        <!-- Desktop nav -->
        <div class="hidden sm:flex items-center gap-6">
          <div class="flex gap-5 text-sm text-slate-600">
            <NuxtLink
              v-for="link in primaryLinks"
              :key="link.to"
              :to="link.to"
              class="hover:text-slate-900 transition-colors"
              active-class="text-slate-900 font-medium"
            >
              {{ link.label }}
            </NuxtLink>
          </div>

          <div class="flex gap-2">
            <NuxtLink
              v-for="link in secondaryLinks"
              :key="link.to"
              :to="link.to"
              class="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              {{ link.label }}
            </NuxtLink>
          </div>
        </div>

        <!-- Mobile: hamburger -->
        <button
          class="sm:hidden p-1.5 rounded-md text-slate-600 hover:bg-slate-100 transition-colors"
          :aria-label="mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <svg v-if="!mobileMenuOpen" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </nav>

      <!-- Mobile menu -->
      <div
        v-if="mobileMenuOpen"
        class="sm:hidden border-t border-slate-100 bg-white px-4 pb-4 pt-2 space-y-1"
      >
        <NuxtLink
          v-for="link in primaryLinks"
          :key="link.to"
          :to="link.to"
          class="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          active-class="bg-slate-100 font-medium text-slate-900"
          @click="mobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <div class="pt-2 border-t border-slate-100">
          <NuxtLink
            v-for="link in secondaryLinks"
            :key="link.to"
            :to="link.to"
            class="block rounded-md px-3 py-2 text-sm text-slate-500 hover:bg-slate-50 transition-colors"
            @click="mobileMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

    <footer class="border-t bg-white">
      <div class="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <div class="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[9px] font-semibold text-white">TL</div>
            <span class="text-sm font-semibold text-slate-800">TudoLeve</span>
          </div>
          <p class="text-xs text-slate-500 max-w-xs">
            Loja online com produtos selecionados e entrega rápida para todo o Brasil.
          </p>
        </div>
        <div class="flex gap-8 text-xs">
          <div class="space-y-1.5">
            <p class="font-semibold text-slate-700 mb-2">Loja</p>
            <NuxtLink to="/" class="block text-slate-500 hover:text-slate-900">Início</NuxtLink>
            <NuxtLink to="/rastreio" class="block text-slate-500 hover:text-slate-900">Rastrear pedido</NuxtLink>
          </div>
          <div class="space-y-1.5">
            <p class="font-semibold text-slate-700 mb-2">Conta</p>
            <NuxtLink to="/login" class="block text-slate-500 hover:text-slate-900">Área admin</NuxtLink>
          </div>
        </div>
      </div>
      <div class="border-t border-slate-100">
        <div class="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[10px] text-slate-400">
          <span>© {{ new Date().getFullYear() }} TudoLeve. Todos os direitos reservados.</span>
          <span class="uppercase tracking-wide">Etapa 8 — Área pública</span>
        </div>
      </div>
    </footer>
  </div>
</template>

