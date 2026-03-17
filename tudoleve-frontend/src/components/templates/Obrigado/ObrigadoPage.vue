<script setup lang="ts">
/**
 * Post-sale page — shows order confirmation and upsell/order-bump area.
 * Order data is fetched from the backend (read-only).
 */
import type { PostSaleOrder } from '~/types/entities'
import { useFormatters } from '~/composables/useFormatters'
import { useApi } from '~/composables/useApi'

const props = defineProps<{
  orderId: string
}>()

const api = useApi()
const { formatCurrencyBRL } = useFormatters()

const order = ref<PostSaleOrder | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

onMounted(async () => {
  const { data, message } = await api.get<PostSaleOrder>(
    `/public/orders/${props.orderId}/confirmation`,
    { softError: true }
  )

  loading.value = false

  if (!data) {
    error.value = message ?? 'Pedido não encontrado.'
    return
  }

  order.value = data
})
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-12 space-y-8">

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div class="h-20 w-20 rounded-full bg-slate-200 animate-pulse mx-auto" />
      <div class="h-6 w-1/2 rounded bg-slate-200 animate-pulse mx-auto" />
      <div class="h-4 w-3/4 rounded bg-slate-200 animate-pulse mx-auto" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center space-y-3">
      <div class="text-4xl">⚠️</div>
      <p class="text-base font-medium text-slate-800">
        Não foi possível carregar seu pedido
      </p>
      <p class="text-sm text-slate-500">
        {{ error }}
      </p>
    </div>

    <!-- Success content -->
    <template v-else-if="order">
      <!-- Hero confirmation -->
      <div class="text-center space-y-3">
        <div class="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-4xl mx-auto">
          🎉
        </div>
        <h1 class="text-2xl font-semibold text-slate-900">
          Pedido confirmado!
        </h1>
        <p class="text-slate-500">
          Obrigado, <strong class="text-slate-700">{{ order.customer_name }}</strong>! Seu pedido foi recebido com sucesso.
        </p>
      </div>

      <!-- Order card -->
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div>
            <p class="text-xs text-slate-400 uppercase tracking-wide">Número do pedido</p>
            <p class="font-mono text-lg font-semibold mt-0.5">
              #{{ order.code }}
            </p>
          </div>
          <div class="text-right">
            <p class="text-xs text-slate-400 uppercase tracking-wide">Total</p>
            <p class="text-lg font-bold mt-0.5 text-emerald-400">
              {{ formatCurrencyBRL(order.total) }}
            </p>
          </div>
        </div>
        <div class="px-6 py-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Produto</span>
            <span class="font-medium text-slate-800">{{ order.product_name }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-slate-500">Status</span>
            <UiAtomsBadge variant="success">
              {{ order.status }}
            </UiAtomsBadge>
          </div>
          <div v-if="order.estimated_delivery" class="flex justify-between text-sm">
            <span class="text-slate-500">Previsão de entrega</span>
            <span class="font-medium text-slate-800">{{ order.estimated_delivery }}</span>
          </div>
          <div v-if="order.tracking_code" class="flex justify-between text-sm">
            <span class="text-slate-500">Código de rastreio</span>
            <NuxtLink
              :to="`/rastreio?code=${order.tracking_code}`"
              class="font-mono font-medium text-slate-900 underline hover:no-underline"
            >
              {{ order.tracking_code }}
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- What happens next -->
      <div class="rounded-xl border border-slate-100 bg-slate-50 px-6 py-4 space-y-3">
        <h2 class="text-sm font-semibold text-slate-700">
          O que acontece agora?
        </h2>
        <ol class="space-y-2 text-sm text-slate-600">
          <li class="flex items-start gap-2">
            <span class="text-emerald-500 font-bold shrink-0">1.</span>
            Você receberá um e-mail de confirmação com os detalhes do pedido.
          </li>
          <li class="flex items-start gap-2">
            <span class="text-slate-400 font-bold shrink-0">2.</span>
            Assim que o pedido for enviado, você receberá o código de rastreio.
          </li>
          <li class="flex items-start gap-2">
            <span class="text-slate-400 font-bold shrink-0">3.</span>
            Acompanhe a entrega em tempo real na nossa
            <NuxtLink to="/rastreio" class="underline hover:no-underline text-slate-800 font-medium">
              página de rastreio
            </NuxtLink>.
          </li>
        </ol>
      </div>

      <!-- Upsell / order bump section — content driven by backend -->
      <!-- Structure prepared; products served via API -->
      <div class="rounded-xl border border-amber-200 bg-amber-50 px-6 py-5 space-y-3">
        <div class="flex items-center gap-2">
          <span class="text-amber-500 text-xl">⚡</span>
          <h2 class="text-sm font-semibold text-amber-800">
            Oferta exclusiva para você
          </h2>
        </div>
        <p class="text-xs text-amber-700">
          Clientes que compraram este produto também levaram estes itens com desconto especial.
        </p>
        <!-- Upsell products rendered here when backend provides them -->
        <div class="rounded-lg border border-amber-200 bg-white/60 p-4 text-center text-xs text-amber-600">
          Nenhuma oferta disponível no momento.
        </div>
      </div>

      <!-- Back to store -->
      <div class="text-center">
        <NuxtLink to="/" class="text-sm text-slate-500 underline hover:text-slate-700">
          Continuar comprando
        </NuxtLink>
      </div>
    </template>
  </div>
</template>
