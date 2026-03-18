<script setup lang="ts">
import {
  mockKpiCards,
  mockVendasSemana,
  mockPedidosPorDia,
  mockPedidosRecentesDash,
  mockTopProdutos,
  mockAlertas,
  mockAtalhos,
  mockStatusOperacao,
  type PedidoStatusSimples,
} from '~/mocks/dashboard'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => { loading.value = false }, 900)
})

// ---- Bar chart (vendas) ----
const BAR_W = 280
const BAR_BASELINE = 100
const BAR_MAX_H = 78
const slotW = BAR_W / mockVendasSemana.length
const barWidth = 22
const maxVendas = Math.max(...mockVendasSemana.map(p => p.value))

function barX(i: number) { return i * slotW + (slotW - barWidth) / 2 }
function barH(v: number) { return (v / maxVendas) * BAR_MAX_H }
function barY(v: number) { return BAR_BASELINE - barH(v) }

// ---- Line chart (pedidos) ----
const LINE_W = 280
const maxPedidos = Math.max(...mockPedidosPorDia.map(p => p.value))
const lineSlotW = LINE_W / mockPedidosPorDia.length

const linePoints = computed(() =>
  mockPedidosPorDia.map((p, i) => ({
    x: i * lineSlotW + lineSlotW / 2,
    y: 90 - (p.value / maxPedidos) * 68,
    label: p.label,
    value: p.value,
  }))
)

const linePath = computed(() =>
  linePoints.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
)

const areaPath = computed(() => {
  const pts = linePoints.value
  return `${pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')} L${pts.at(-1)!.x},95 L${pts[0].x},95 Z`
})

// ---- Status config ----
const statusBadge: Record<PedidoStatusSimples, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  pendente: { label: 'Pendente', variant: 'warning' },
  aprovado: { label: 'Aprovado', variant: 'success' },
  em_separacao: { label: 'Em separação', variant: 'default' },
  enviado: { label: 'Enviado', variant: 'outline' },
  entregue: { label: 'Entregue', variant: 'success' },
  cancelado: { label: 'Cancelado', variant: 'danger' },
}

const alertStyle: Record<string, { bg: string; border: string; text: string; iconBg: string }> = {
  warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', iconBg: 'bg-amber-100' },
  danger: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', iconBg: 'bg-red-100' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', iconBg: 'bg-blue-100' },
}

const alertIcon: Record<string, string> = {
  warning: '⚠️', danger: '🔴', info: 'ℹ️',
}
</script>

<template>
  <section class="space-y-6">

    <!-- Page Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <span>Admin</span>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">Dashboard</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Visão geral</h1>
        <p class="mt-0.5 text-sm text-slate-500">Acompanhe os indicadores da loja em tempo real</p>
      </div>
      <div class="flex items-center gap-2 mt-1 sm:mt-0">
        <span class="text-xs text-slate-400">Atualizado há 2 min</span>
        <UiAtomsButton variant="secondary" size="sm">↻ Atualizar</UiAtomsButton>
      </div>
    </div>

    <!-- Alertas -->
    <div v-if="!loading" class="space-y-2">
      <div
        v-for="alerta in mockAlertas"
        :key="alerta.titulo"
        :class="[
          'flex items-center justify-between gap-3 rounded-lg border px-4 py-2.5',
          alertStyle[alerta.tipo].bg,
          alertStyle[alerta.tipo].border
        ]"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <span
            :class="['flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs', alertStyle[alerta.tipo].iconBg]"
          >
            {{ alertIcon[alerta.tipo] }}
          </span>
          <div class="min-w-0">
            <span :class="['text-xs font-semibold', alertStyle[alerta.tipo].text]">{{ alerta.titulo }}:</span>
            <span :class="['ml-1 text-xs', alertStyle[alerta.tipo].text]">{{ alerta.mensagem }}</span>
          </div>
        </div>
        <NuxtLink
          :to="alerta.link"
          :class="['shrink-0 text-xs font-medium underline underline-offset-2', alertStyle[alerta.tipo].text]"
        >
          {{ alerta.acao }} →
        </NuxtLink>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <!-- Skeleton -->
      <template v-if="loading">
        <div
          v-for="i in 5"
          :key="i"
          class="animate-pulse rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="mb-3 h-3 w-24 rounded bg-slate-200" />
          <div class="h-7 w-28 rounded bg-slate-200" />
          <div class="mt-2 h-2.5 w-20 rounded bg-slate-100" />
        </div>
      </template>
      <!-- Cards -->
      <template v-else>
        <div
          v-for="kpi in mockKpiCards"
          :key="kpi.id"
          class="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="truncate text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
                {{ kpi.label }}
              </p>
              <p class="mt-2 text-2xl font-bold tracking-tight text-slate-900">{{ kpi.value }}</p>
              <p
                class="mt-1.5 text-[0.7rem] font-medium"
                :class="{
                  'text-emerald-600': kpi.trendVariant === 'up',
                  'text-red-500': kpi.trendVariant === 'down',
                  'text-amber-600': kpi.trendVariant === 'neutral',
                }"
              >
                {{ kpi.trendLabel }}
              </p>
            </div>
            <div
              :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-base', kpi.iconBg, kpi.iconColor]"
            >
              {{ kpi.icon }}
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- Charts Row -->
    <div class="grid gap-4 lg:grid-cols-2">

      <!-- Bar Chart: Vendas da semana -->
      <UiAtomsCard padded>
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Vendas da semana</p>
            <p class="text-xs text-slate-500 mt-0.5">Faturamento diário (R$)</p>
          </div>
          <UiAtomsBadge variant="success">↑ +8% vs semana anterior</UiAtomsBadge>
        </div>
        <div v-if="loading" class="h-28 animate-pulse rounded bg-slate-100" />
        <svg v-else viewBox="0 0 280 124" class="w-full" aria-hidden="true">
          <!-- Grid lines -->
          <line x1="0" y1="22" x2="280" y2="22" stroke="#f1f5f9" stroke-width="1" />
          <line x1="0" y1="48" x2="280" y2="48" stroke="#f1f5f9" stroke-width="1" />
          <line x1="0" y1="74" x2="280" y2="74" stroke="#f1f5f9" stroke-width="1" />
          <line x1="0" y1="100" x2="280" y2="100" stroke="#e2e8f0" stroke-width="1" />
          <!-- Bars -->
          <rect
            v-for="(point, i) in mockVendasSemana"
            :key="point.label"
            :x="barX(i)"
            :y="barY(point.value)"
            :width="barWidth"
            :height="barH(point.value)"
            rx="3"
            :fill="point.label === 'Sex' ? '#0f172a' : '#cbd5e1'"
          />
          <!-- Labels -->
          <text
            v-for="(point, i) in mockVendasSemana"
            :key="`lbl-${point.label}`"
            :x="barX(i) + barWidth / 2"
            y="116"
            text-anchor="middle"
            font-size="9"
            fill="#94a3b8"
          >{{ point.label }}</text>
          <!-- Active label -->
          <text
            :x="barX(4) + barWidth / 2"
            :y="barY(mockVendasSemana[4].value) - 5"
            text-anchor="middle"
            font-size="8"
            font-weight="600"
            fill="#0f172a"
          >R$4.872</text>
        </svg>
      </UiAtomsCard>

      <!-- Line Chart: Pedidos por dia -->
      <UiAtomsCard padded>
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">Pedidos por dia</p>
            <p class="text-xs text-slate-500 mt-0.5">Volume nos últimos 7 dias</p>
          </div>
          <UiAtomsBadge variant="default">Total: 226 pedidos</UiAtomsBadge>
        </div>
        <div v-if="loading" class="h-28 animate-pulse rounded bg-slate-100" />
        <svg v-else viewBox="0 0 280 110" class="w-full" aria-hidden="true">
          <!-- Grid lines -->
          <line x1="0" y1="22" x2="280" y2="22" stroke="#f1f5f9" stroke-width="1" />
          <line x1="0" y1="50" x2="280" y2="50" stroke="#f1f5f9" stroke-width="1" />
          <line x1="0" y1="78" x2="280" y2="78" stroke="#f1f5f9" stroke-width="1" />
          <!-- Area fill -->
          <path :d="areaPath" fill="#0f172a" fill-opacity="0.06" />
          <!-- Line -->
          <path
            :d="linePath"
            fill="none"
            stroke="#0f172a"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Dots -->
          <circle
            v-for="pt in linePoints"
            :key="pt.label"
            :cx="pt.x"
            :cy="pt.y"
            r="3"
            fill="white"
            stroke="#0f172a"
            stroke-width="2"
          />
          <!-- Peak label -->
          <text
            :x="linePoints[5]?.x"
            :y="(linePoints[5]?.y ?? 0) - 7"
            text-anchor="middle"
            font-size="8"
            font-weight="600"
            fill="#0f172a"
          >47</text>
          <!-- X labels -->
          <text
            v-for="pt in linePoints"
            :key="`lbl-${pt.label}`"
            :x="pt.x"
            y="106"
            text-anchor="middle"
            font-size="9"
            fill="#94a3b8"
          >{{ pt.label }}</text>
        </svg>
      </UiAtomsCard>
    </div>

    <!-- Bottom Row: Recent Orders (2/3) + Top Products (1/3) -->
    <div class="grid gap-4 lg:grid-cols-3">

      <!-- Pedidos Recentes -->
      <UiAtomsCard padded class="lg:col-span-2">
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-900">Pedidos recentes</p>
          <NuxtLink
            to="/admin/pedidos"
            class="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-900"
          >
            Ver todos →
          </NuxtLink>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-8 animate-pulse rounded bg-slate-100" />
        </div>
        <div v-else class="overflow-x-auto">
          <table class="min-w-full text-xs">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="pb-2 pr-4 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Pedido</th>
                <th class="pb-2 pr-4 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Cliente</th>
                <th class="pb-2 pr-4 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Status</th>
                <th class="pb-2 pr-4 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Pagamento</th>
                <th class="pb-2 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Total</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="pedido in mockPedidosRecentesDash"
                :key="pedido.numero"
                class="hover:bg-slate-50"
              >
                <td class="py-2.5 pr-4 font-mono font-semibold text-slate-900">{{ pedido.numero }}</td>
                <td class="py-2.5 pr-4 text-slate-700">{{ pedido.cliente }}</td>
                <td class="py-2.5 pr-4">
                  <UiAtomsBadge :variant="statusBadge[pedido.status].variant">
                    {{ statusBadge[pedido.status].label }}
                  </UiAtomsBadge>
                </td>
                <td class="py-2.5 pr-4 text-slate-500">{{ pedido.pagamento }}</td>
                <td class="py-2.5 text-right font-semibold text-slate-900">{{ pedido.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiAtomsCard>

      <!-- Top Produtos -->
      <UiAtomsCard padded>
        <div class="mb-4 flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-900">Mais vendidos</p>
          <NuxtLink
            to="/admin/produtos"
            class="text-xs font-medium text-slate-500 underline underline-offset-2 hover:text-slate-900"
          >
            Ver todos →
          </NuxtLink>
        </div>
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 5" :key="i" class="h-10 animate-pulse rounded bg-slate-100" />
        </div>
        <div v-else class="space-y-3.5">
          <div
            v-for="(produto, i) in mockTopProdutos"
            :key="produto.nome"
            class="flex items-start gap-2.5"
          >
            <div
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-500"
            >
              {{ i + 1 }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-medium text-slate-800">{{ produto.nome }}</p>
              <div class="mt-0.5 flex items-center gap-1.5">
                <span class="text-[10px] text-slate-500">{{ produto.vendas }} vendas</span>
                <span class="text-slate-300">·</span>
                <span
                  class="text-[10px] font-medium"
                  :class="produto.estoque === 0
                    ? 'text-red-600'
                    : produto.estoque < 10
                      ? 'text-amber-600'
                      : 'text-slate-400'"
                >
                  {{ produto.estoque === 0 ? 'Sem estoque' : `${produto.estoque} un.` }}
                </span>
              </div>
            </div>
            <span class="shrink-0 text-[11px] font-semibold text-slate-700">{{ produto.receita }}</span>
          </div>
        </div>
      </UiAtomsCard>
    </div>

    <!-- Status Operação + Atalhos Rápidos -->
    <div class="grid gap-4 lg:grid-cols-2">

      <!-- Status da Operação -->
      <UiAtomsCard padded>
        <p class="mb-4 text-sm font-semibold text-slate-900">Status da operação</p>
        <div v-if="loading" class="space-y-2.5">
          <div v-for="i in 6" :key="i" class="h-6 animate-pulse rounded bg-slate-100" />
        </div>
        <div v-else class="divide-y divide-slate-50">
          <div
            v-for="item in mockStatusOperacao"
            :key="item.label"
            class="flex items-center justify-between py-2"
          >
            <div class="flex items-center gap-2.5">
              <span :class="['inline-flex h-2 w-2 rounded-full', item.cor]" />
              <span class="text-xs text-slate-700">{{ item.label }}</span>
            </div>
            <span class="text-xs font-semibold text-slate-900">
              {{ item.texto ?? item.valor }}
            </span>
          </div>
        </div>
      </UiAtomsCard>

      <!-- Atalhos Rápidos -->
      <UiAtomsCard padded>
        <p class="mb-4 text-sm font-semibold text-slate-900">Atalhos rápidos</p>
        <div class="grid grid-cols-3 gap-3">
          <NuxtLink
            v-for="atalho in mockAtalhos"
            :key="atalho.label"
            :to="atalho.link"
            class="group flex flex-col items-center gap-2 rounded-xl border border-slate-200 p-3 text-center transition-all hover:border-slate-300 hover:shadow-sm"
          >
            <div
              :class="[
                'flex h-10 w-10 items-center justify-center rounded-lg text-xl transition-transform group-hover:scale-110',
                atalho.color,
              ]"
            >
              {{ atalho.icon }}
            </div>
            <span class="text-[10px] font-medium leading-tight text-slate-700">{{ atalho.label }}</span>
          </NuxtLink>
        </div>
      </UiAtomsCard>
    </div>

  </section>
</template>
