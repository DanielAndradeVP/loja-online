<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProdutoPublicoStore } from '~/stores/produtoPublico'
import { useFormatters } from '~/composables/useFormatters'

const props = defineProps<{
  slug: string
}>()

const store = useProdutoPublicoStore()
const { product, loading, error } = storeToRefs(store)
const { formatCurrencyBRL } = useFormatters()

onMounted(() => {
  store.fetch(props.slug)
})

onUnmounted(() => {
  store.reset()
})

const averageRating = computed(() => {
  if (!product.value?.reviews?.length) return 0
  const sum = product.value.reviews.reduce((acc, r) => acc + r.rating, 0)
  return Math.round((sum / product.value.reviews.length) * 10) / 10
})

const discount = computed(() => {
  if (!product.value?.compare_price || !product.value.price) return null
  const pct = Math.round(((product.value.compare_price - product.value.price) / product.value.compare_price) * 100)
  return pct > 0 ? pct : null
})

const handleBuy = () => {
  if (!product.value) return
  // Checkout is owned by the backend — redirect to checkout page
  navigateTo(`/checkout/${product.value.slug}`)
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">

    <!-- Loading skeleton -->
    <div v-if="loading" class="grid gap-8 md:grid-cols-2">
      <div class="space-y-3">
        <div class="aspect-square w-full rounded-xl bg-slate-200 animate-pulse" />
        <div class="flex gap-2">
          <div v-for="n in 4" :key="n" class="h-16 w-16 rounded-lg bg-slate-200 animate-pulse" />
        </div>
      </div>
      <div class="space-y-4 pt-4">
        <div class="h-8 w-3/4 rounded bg-slate-200 animate-pulse" />
        <div class="h-5 w-1/3 rounded bg-slate-200 animate-pulse" />
        <div class="h-12 w-1/2 rounded bg-slate-200 animate-pulse" />
        <div class="h-10 w-full rounded bg-slate-200 animate-pulse" />
      </div>
    </div>

    <!-- Error state -->
    <div
      v-else-if="error"
      class="flex flex-col items-center gap-4 py-20 text-center"
    >
      <div class="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400 text-2xl">
        ⚠️
      </div>
      <div>
        <p class="text-base font-medium text-slate-800">
          Produto não encontrado
        </p>
        <p class="mt-1 text-sm text-slate-500">
          {{ error }}
        </p>
      </div>
      <UiAtomsButton variant="secondary" size="sm" @click="() => store.fetch(slug)">
        Tentar novamente
      </UiAtomsButton>
    </div>

    <!-- Product content -->
    <div v-else-if="product" class="space-y-12">
      <!-- Main product section: gallery + details -->
      <div class="grid gap-8 md:grid-cols-2">

        <!-- Left: Gallery -->
        <OrganismsProduto-produto-galeria
          :images="product.images"
          :name="product.name"
        />

        <!-- Right: Details -->
        <div class="space-y-5">
          <!-- Title -->
          <div>
            <h1 class="text-2xl font-semibold text-slate-900 leading-snug">
              {{ product.name }}
            </h1>
            <!-- Reviews summary -->
            <div
              v-if="product.reviews?.length"
              class="mt-2 flex items-center gap-2"
            >
              <div class="flex gap-0.5">
                <span
                  v-for="star in 5"
                  :key="star"
                  class="text-sm"
                  :class="star <= Math.round(averageRating) ? 'text-amber-400' : 'text-slate-200'"
                >★</span>
              </div>
              <span class="text-xs text-slate-500">
                {{ averageRating }} ({{ product.reviews.length }} avaliações)
              </span>
            </div>
          </div>

          <!-- Price -->
          <div class="space-y-1">
            <div v-if="product.compare_price" class="flex items-center gap-2">
              <span class="text-sm text-slate-400 line-through">
                {{ formatCurrencyBRL(product.compare_price) }}
              </span>
              <span
                v-if="discount"
                class="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-wide"
              >
                -{{ discount }}%
              </span>
            </div>
            <p class="text-3xl font-bold text-slate-900">
              {{ formatCurrencyBRL(product.price) }}
            </p>
            <p class="text-xs text-slate-500">
              ou 12x de {{ formatCurrencyBRL(product.price / 12) }} sem juros
            </p>
          </div>

          <!-- Short description -->
          <p
            v-if="product.short_description"
            class="text-sm text-slate-600 leading-relaxed"
          >
            {{ product.short_description }}
          </p>

          <!-- Visual triggers -->
          <OrganismsProduto-produto-gatilhos
            :in-stock="product.in_stock"
            :stock-quantity="product.stock_quantity"
          />

          <!-- CTA button -->
          <UiAtomsButton
            variant="primary"
            size="lg"
            full-width
            :disabled="!product.in_stock"
            @click="handleBuy"
          >
            <span class="text-base">
              {{ product.in_stock ? '🛒 Comprar agora' : 'Produto esgotado' }}
            </span>
          </UiAtomsButton>

          <!-- Rastreio quick link -->
          <p class="text-center text-xs text-slate-400">
            Já comprou?
            <NuxtLink to="/rastreio" class="underline hover:text-slate-600">
              Rastreie seu pedido
            </NuxtLink>
          </p>
        </div>
      </div>

      <!-- Description -->
      <div
        v-if="product.description"
        class="rounded-xl border border-slate-200 bg-white p-6 space-y-3"
      >
        <h2 class="text-base font-semibold text-slate-800">
          Descrição do produto
        </h2>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="prose prose-sm max-w-none text-slate-600" v-html="product.description" />
      </div>

      <!-- Benefits -->
      <OrganismsProduto-produto-beneficios
        v-if="product.benefits?.length"
        :benefits="product.benefits"
      />

      <!-- FAQ -->
      <OrganismsProduto-produto-f-a-q
        v-if="product.faq?.length"
        :items="product.faq"
      />

      <!-- Reviews -->
      <div v-if="product.reviews?.length" class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-800">
            Avaliações dos clientes
          </h2>
          <span class="text-sm text-slate-500">
            {{ averageRating }} / 5 ★
          </span>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <div
            v-for="review in product.reviews"
            :key="review.id"
            class="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-2"
          >
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium text-slate-600">
                  {{ review.author.slice(0, 1).toUpperCase() }}
                </div>
                <div>
                  <p class="text-xs font-medium text-slate-800">
                    {{ review.author }}
                  </p>
                  <div class="flex gap-0.5">
                    <span
                      v-for="star in 5"
                      :key="star"
                      class="text-[10px]"
                      :class="star <= review.rating ? 'text-amber-400' : 'text-slate-200'"
                    >★</span>
                  </div>
                </div>
              </div>
              <span
                v-if="review.verified"
                class="shrink-0 text-[9px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-full px-2 py-0.5"
              >
                Compra verificada
              </span>
            </div>
            <p class="text-xs text-slate-600 leading-relaxed">
              {{ review.comment }}
            </p>
            <time class="text-[10px] text-slate-400 block">
              {{ review.date }}
            </time>
          </div>
        </div>
      </div>

      <!-- Related products (structure prepared for backend data) -->
      <div v-if="product.related?.length" class="space-y-4">
        <h2 class="text-base font-semibold text-slate-800">
          Produtos relacionados
        </h2>
        <div class="grid gap-4 grid-cols-2 sm:grid-cols-4">
          <NuxtLink
            v-for="rel in product.related"
            :key="rel.id"
            :to="`/produto/${rel.slug}`"
            class="group rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
          >
            <div class="aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
              <img
                v-if="rel.image"
                :src="rel.image"
                :alt="rel.name"
                class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
              >
              <div v-else class="text-slate-300 text-3xl">📦</div>
            </div>
            <div class="p-3">
              <p class="text-xs font-medium text-slate-800 line-clamp-2 leading-snug">
                {{ rel.name }}
              </p>
              <p class="text-sm font-semibold text-slate-900 mt-1">
                {{ formatCurrencyBRL(rel.price) }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
