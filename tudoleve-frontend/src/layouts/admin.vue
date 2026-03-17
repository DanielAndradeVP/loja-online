<script setup lang="ts">
const route = useRoute()

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

type AdminMenuItem = {
  label: string
  to: string
}

type AdminMenuSection = {
  label: string
  items: AdminMenuItem[]
}

const menuSections: AdminMenuSection[] = [
  {
    label: 'Visão geral',
    items: [
      { label: 'Dashboard', to: '/admin' }
    ]
  },
  {
    label: 'Operações',
    items: [
      { label: 'Pedidos', to: '/admin/pedidos' },
      { label: 'Produtos', to: '/admin/produtos' },
      { label: 'Estoque', to: '/admin/estoque' },
      { label: 'Clientes', to: '/admin/clientes' },
      { label: 'Rastreamento / Entregas', to: '/admin/rastreamento-entregas' }
    ]
  },
  {
    label: 'Crescimento',
    items: [
      { label: 'Marketing', to: '/admin/marketing' },
      { label: 'Anúncios / Marketplace', to: '/admin/anuncios-marketplace' },
      { label: 'Importação de produtos', to: '/admin/importacao-produtos' },
      { label: 'Relatórios', to: '/admin/relatorios' }
    ]
  },
  {
    label: 'Loja e conteúdo',
    items: [
      { label: 'Conteúdo do site', to: '/admin/conteudo-site' },
      { label: 'Aparência', to: '/admin/aparencia' }
    ]
  },
  {
    label: 'Administração',
    items: [
      { label: 'Financeiro', to: '/admin/financeiro' },
      { label: 'Usuários e permissões', to: '/admin/usuarios-permissoes' },
      { label: 'Integrações', to: '/admin/integacoes' },
      { label: 'Configurações', to: '/admin/configuracoes' },
      { label: 'Logs e sistema', to: '/admin/logs-sistema' }
    ]
  }
]

const isActive = (to: string) => {
  const currentPath = route.path

  if (to === '/admin') {
    return currentPath === '/admin'
  }

  return currentPath.startsWith(to)
}
</script>

<template>
  <div class="min-h-screen flex bg-slate-100 text-slate-900">
    <!-- Sidebar desktop -->
    <aside class="hidden md:flex w-64 bg-slate-950 text-slate-50 flex-col">
      <div class="px-4 py-4 border-b border-slate-800">
        <div class="text-lg font-semibold tracking-tight">TudoLeve</div>
        <div class="text-xs text-slate-400 mt-1 uppercase tracking-wide">
          Admin
        </div>
      </div>

      <nav class="flex-1 px-3 py-4 text-sm space-y-4 overflow-y-auto">
        <div
          v-for="section in menuSections"
          :key="section.label"
          class="space-y-1"
        >
          <div class="px-3 text-[0.68rem] font-medium uppercase tracking-wide text-slate-500">
            {{ section.label }}
          </div>

          <NuxtLink
            v-for="item in section.items"
            :key="item.to"
            :to="item.to"
            class="flex items-center gap-2 rounded-md px-3 py-2 transition-colors"
            :class="[
              isActive(item.to)
                ? 'bg-slate-800 text-slate-50'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            ]"
          >
            <span class="truncate">
              {{ item.label }}
            </span>
          </NuxtLink>
        </div>
      </nav>
    </aside>

    <!-- Mobile sidebar -->
    <div class="md:hidden">
      <transition name="fade">
        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-40 bg-black/40"
          @click="toggleMobileMenu"
        />
      </transition>

      <transition name="slide">
        <aside
          v-if="isMobileMenuOpen"
          class="fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 text-slate-50 flex flex-col shadow-xl"
        >
          <div class="px-4 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <div class="text-lg font-semibold tracking-tight">TudoLeve</div>
              <div class="text-xs text-slate-400 mt-1 uppercase tracking-wide">
                Admin
              </div>
            </div>
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-md p-1 text-slate-400 hover:text-white hover:bg-slate-800"
              @click="toggleMobileMenu"
            >
              <span class="sr-only">Fechar menu</span>
              ✕
            </button>
          </div>

          <nav class="flex-1 px-3 py-4 text-sm space-y-4 overflow-y-auto">
            <div
              v-for="section in menuSections"
              :key="section.label"
              class="space-y-1"
            >
              <div class="px-3 text-[0.68rem] font-medium uppercase tracking-wide text-slate-500">
                {{ section.label }}
              </div>

              <NuxtLink
                v-for="item in section.items"
                :key="item.to"
                :to="item.to"
                class="flex items-center gap-2 rounded-md px-3 py-2 transition-colors"
                :class="[
                  isActive(item.to)
                    ? 'bg-slate-800 text-slate-50'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                ]"
                @click="isMobileMenuOpen = false"
              >
                <span class="truncate">
                  {{ item.label }}
                </span>
              </NuxtLink>
            </div>
          </nav>
        </aside>
      </transition>
    </div>

    <!-- Conteúdo principal -->
    <div class="flex-1 flex flex-col">
      <header class="h-14 border-b bg-white/90 backdrop-blur flex items-center px-3 md:px-4 justify-between">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-md p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden"
            @click="toggleMobileMenu"
          >
            <span class="sr-only">Abrir menu</span>
            ☰
          </button>

          <h1 class="text-sm font-medium text-slate-900">
            <slot name="title">
              Área administrativa
            </slot>
          </h1>
        </div>

        <div class="flex items-center gap-3 text-xs text-slate-500">
          <div class="hidden sm:block">
            <span class="font-medium text-slate-700">TudoLeve</span>
            <span class="mx-1 text-slate-400">•</span>
            <span>Admin</span>
          </div>
          <NuxtLink
            to="/"
            class="rounded-full border border-slate-200 bg-white px-3 py-1 text-[0.7rem] font-medium text-slate-700 hover:bg-slate-50"
          >
            Ver loja
          </NuxtLink>
        </div>
      </header>

      <main class="flex-1 p-3 md:p-4 lg:p-6">
        <div class="mx-auto max-w-6xl">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>
