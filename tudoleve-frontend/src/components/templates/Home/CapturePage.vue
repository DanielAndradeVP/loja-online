<script setup lang="ts">
import type { ProductPublicSummary } from '~/types/entities'
import { useFormatters } from '~/composables/useFormatters'
import { useApi } from '~/composables/useApi'

const api = useApi()
const { formatCurrencyBRL } = useFormatters()

const featured = ref<ProductPublicSummary[]>([])
const loadingFeatured = ref(true)

onMounted(async () => {
  const { data } = await api.get<ProductPublicSummary[]>('/public/products/featured', { softError: true })
  loadingFeatured.value = false
  if (data) featured.value = data
})
</script>

<template>
  <div>
    <!-- Hero / capture section -->
    <section class="relative bg-slate-900 text-white overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25px 25px, white 1px, transparent 0); background-size: 50px 50px;" />
      </div>

      <div class="relative mx-auto max-w-6xl px-4 py-20 md:py-28">
        <div class="max-w-2xl space-y-6">
          <div class="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 border border-emerald-500/30 px-3 py-1">
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span class="text-xs font-medium text-emerald-300 uppercase tracking-wide">
              Loja online
            </span>
          </div>

          <h1 class="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
            Tudo que você precisa,
            <span class="text-emerald-400">sempre leve</span>
          </h1>

          <p class="text-slate-300 text-lg leading-relaxed max-w-xl">
            Produtos selecionados com qualidade e entrega rápida para todo o Brasil.
            Compre com segurança e rastreie seu pedido em tempo real.
          </p>

          <div class="flex flex-wrap gap-3">
            <NuxtLink
              to="#produtos"
              class="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-5 py-2.5 text-sm transition-colors"
            >
              🛒 Ver produtos
            </NuxtLink>
            <NuxtLink
              to="/rastreio"
              class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 text-white font-medium px-5 py-2.5 text-sm transition-colors"
            >
              📦 Rastrear pedido
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust bar -->
    <section class="bg-slate-800 text-slate-300 border-b border-slate-700">
      <div class="mx-auto max-w-6xl px-4 py-3 flex flex-wrap justify-center gap-x-8 gap-y-2">
        <div class="flex items-center gap-1.5 text-xs">
          <span>🔒</span>
          <span>Compra segura</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs">
          <span>🚚</span>
          <span>Entrega rápida</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs">
          <span>✅</span>
          <span>Produtos garantidos</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs">
          <span>↩️</span>
          <span>Troca fácil</span>
        </div>
        <div class="flex items-center gap-1.5 text-xs">
          <span>💳</span>
          <span>Parcelamento sem juros</span>
        </div>
      </div>
    </section>

    <!-- Featured products -->
    <section id="produtos" class="mx-auto max-w-6xl px-4 py-14 space-y-8">
      <div class="flex items-end justify-between">
        <div>
          <h2 class="text-2xl font-semibold text-slate-900">
            Produtos em destaque
          </h2>
          <p class="text-sm text-slate-500 mt-1">
            Selecionados especialmente para você
          </p>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loadingFeatured" class="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
        <div v-for="n in 4" :key="n" class="space-y-3">
          <div class="aspect-square rounded-xl bg-slate-200 animate-pulse" />
          <div class="h-4 w-3/4 rounded bg-slate-200 animate-pulse" />
          <div class="h-3 w-1/2 rounded bg-slate-200 animate-pulse" />
        </div>
      </div>

      <!-- Products grid -->
      <div
        v-else-if="featured.length"
        class="grid gap-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
      >
        <NuxtLink
          v-for="product in featured"
          :key="product.id"
          :to="`/produto/${product.slug}`"
          class="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div class="aspect-square bg-slate-100 overflow-hidden">
            <img
              v-if="product.image"
              :src="product.image"
              :alt="product.name"
              class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
            >
            <div v-else class="h-full w-full flex items-center justify-center text-slate-300 text-4xl">
              📦
            </div>
          </div>
          <div class="p-4">
            <p class="text-sm font-medium text-slate-800 line-clamp-2 leading-snug">
              {{ product.name }}
            </p>
            <p class="text-base font-bold text-slate-900 mt-2">
              {{ formatCurrencyBRL(product.price) }}
            </p>
          </div>
        </NuxtLink>
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="flex flex-col items-center gap-3 py-16 text-center text-slate-400"
      >
        <span class="text-4xl">🏪</span>
        <p class="text-sm">
          Em breve novos produtos por aqui.
        </p>
      </div>
    </section>

    <!-- Newsletter / capture section -->
    <section class="bg-slate-50 border-t border-slate-200">
      <div class="mx-auto max-w-2xl px-4 py-14 text-center space-y-4">
        <h2 class="text-xl font-semibold text-slate-900">
          Fique por dentro das novidades
        </h2>
        <p class="text-sm text-slate-500">
          Receba ofertas exclusivas e lançamentos diretamente no seu e-mail.
        </p>
        <form class="flex gap-2 max-w-md mx-auto" @submit.prevent>
          <input
            type="email"
            placeholder="seu@email.com"
            class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
          >
          <UiAtomsButton variant="primary" size="md" type="submit">
            Inscrever
          </UiAtomsButton>
        </form>
        <p class="text-[10px] text-slate-400">
          Sem spam. Cancele a qualquer momento.
        </p>
      </div>
    </section>
  </div>
</template>
