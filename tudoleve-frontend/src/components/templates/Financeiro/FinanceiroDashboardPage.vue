<script setup lang="ts">
import {
  mockResumoKpisFinanceiro,
  mockGraficoEntradasPeriodo,
  mockTransacoesFinanceiras,
  mockResumoRepasses,
  mockResumoChargebacks,
  mockFluxoCaixaResumo,
  statusTransacaoConfig,
  meioPagamentoConfigFinanceiro,
  statusTransacaoOptions,
  meioPagamentoOptionsFinanceiro,
  type StatusTransacao,
  type MeioPagamentoFinanceiro,
  formatCurrency,
} from '~/mocks/financeiro'

const loading = ref(true)
const hasError = ref(false)

const filtroStatus = ref<StatusTransacao | ''>('')
const filtroMeioPagamento = ref<MeioPagamentoFinanceiro | ''>('')
const filtroPeriodo = ref('7d')
const search = ref('')

const transacoes = ref([...mockTransacoesFinanceiras])

onMounted(() => {
  carregar()
})

function carregar(simularErro = false) {
  loading.value = true
  hasError.value = false

  setTimeout(() => {
    if (simularErro) {
      hasError.value = true
      loading.value = false
      return
    }

    transacoes.value = [...mockTransacoesFinanceiras]
    loading.value = false
  }, 750)
}

const transacoesFiltradas = computed(() => {
  let lista = transacoes.value

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(t =>
      (t.pedido ?? '').toLowerCase().includes(q)
      || t.descricao.toLowerCase().includes(q),
    )
  }

  if (filtroStatus.value) {
    lista = lista.filter(t => t.status === filtroStatus.value)
  }

  if (filtroMeioPagamento.value) {
    lista = lista.filter(t => t.meioPagamento === filtroMeioPagamento.value)
  }

  return lista
})

const totalTransacoes = computed(() => transacoesFiltradas.value.length)

const totalBrutoFiltrado = computed(() =>
  transacoesFiltradas.value.reduce((acc, t) => acc + t.valorBruto, 0),
)

const totalLiquidoFiltrado = computed(() =>
  transacoesFiltradas.value.reduce((acc, t) => acc + t.valorLiquido, 0),
)

const temFiltrosAtivos = computed(
  () => search.value || filtroStatus.value || filtroMeioPagamento.value || filtroPeriodo.value !== '7d',
)

function limparFiltros() {
  search.value = ''
  filtroStatus.value = ''
  filtroMeioPagamento.value = ''
  filtroPeriodo.value = '7d'
}

const chartMax = Math.max(
  ...mockGraficoEntradasPeriodo.map(p => p.entradas),
  1,
)

function barAlt(valor: number) {
  return (valor / chartMax) * 80
}
</script>

<template>
  <section class="space-y-5">
    <!-- Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <span>Admin</span>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">Financeiro</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">
          Visão financeira
        </h1>
        <p class="mt-0.5 text-sm text-slate-500">
          Acompanhe faturamento, transações, repasses e fluxo de caixa da operação.
        </p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
        <UiAtomsButton
          variant="secondary"
          size="sm"
        >
          📄 Exportar relatório
        </UiAtomsButton>
        <UiAtomsButton
          variant="secondary"
          size="sm"
          @click="carregar()"
        >
          ↻ Atualizar
        </UiAtomsButton>
        <UiAtomsButton
          variant="ghost"
          size="sm"
          class="text-[11px] text-slate-400"
          @click="carregar(true)"
        >
          Simular erro
        </UiAtomsButton>
      </div>
    </div>

    <!-- Cards principais -->
    <div class="grid grid-cols-2 gap-3 md:grid-cols-4">
      <template v-if="loading">
        <div
          v-for="i in 4"
          :key="i"
          class="h-20 animate-pulse rounded-lg border border-slate-200 bg-white"
        />
      </template>
      <template v-else>
        <UiAtomsCard
          padded
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
              Faturamento bruto (hoje)
            </p>
            <p class="mt-1 text-2xl font-bold text-slate-900">
              {{ formatCurrency(mockResumoKpisFinanceiro.faturamentoBrutoHoje) }}
            </p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
            💰
          </div>
        </UiAtomsCard>

        <UiAtomsCard
          padded
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
              Faturamento líquido (hoje)
            </p>
            <p class="mt-1 text-2xl font-bold text-emerald-700">
              {{ formatCurrency(mockResumoKpisFinanceiro.faturamentoLiquidoHoje) }}
            </p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-lg text-emerald-700">
            📈
          </div>
        </UiAtomsCard>

        <UiAtomsCard
          padded
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
              Recebimentos pendentes
            </p>
            <p class="mt-1 text-2xl font-bold text-amber-700">
              {{ formatCurrency(mockResumoKpisFinanceiro.recebimentosPendentes) }}
            </p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-lg text-amber-700">
            ⏳
          </div>
        </UiAtomsCard>

        <UiAtomsCard
          padded
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
              Reembolsos / chargebacks
            </p>
            <p class="mt-1 text-2xl font-bold text-red-700">
              {{ formatCurrency(mockResumoKpisFinanceiro.totalReembolsos) }}
            </p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-lg text-red-700">
            🔄
          </div>
        </UiAtomsCard>
      </template>
    </div>

    <!-- Gráfico + Resumo fluxo de caixa -->
    <div class="grid gap-4 lg:grid-cols-3">
      <UiAtomsCard
        padded
        class="lg:col-span-2"
      >
        <div class="mb-4 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-slate-900">
              Entradas por período
            </p>
            <p class="mt-0.5 text-xs text-slate-500">
              Faturamento bruto, saídas e líquido por dia
            </p>
          </div>
          <div class="flex items-center gap-2">
            <select
              v-model="filtroPeriodo"
              class="rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
              <option value="7d">
                Últimos 7 dias
              </option>
              <option value="30d">
                Últimos 30 dias (fake)
              </option>
              <option value="custom">
                Período personalizado (fake)
              </option>
            </select>
          </div>
        </div>

        <div v-if="loading">
          <div class="h-32 w-full animate-pulse rounded bg-slate-100" />
        </div>
        <div
          v-else
          class="flex items-end gap-3 overflow-x-auto pt-2"
        >
          <div
            v-for="ponto in mockGraficoEntradasPeriodo"
            :key="ponto.label"
            class="flex min-w-[40px] flex-1 flex-col items-center gap-1 text-center"
          >
            <div class="flex h-24 w-6 flex-col justify-end gap-1">
              <div
                class="w-full rounded bg-red-200"
                :style="{ height: `${barAlt(ponto.saidas)}px` }"
              />
              <div
                class="w-full rounded bg-emerald-500"
                :style="{ height: `${barAlt(ponto.entradas)}px` }"
              />
            </div>
            <p class="mt-1 text-[10px] text-slate-500">
              {{ ponto.label }}
            </p>
          </div>
        </div>

        <div
          v-if="!loading"
          class="mt-4 flex flex-wrap gap-4 border-t border-slate-100 pt-3 text-[11px]"
        >
          <div class="flex items-center gap-1 text-slate-600">
            <span class="h-2 w-3 rounded bg-emerald-500" />
            Entradas
          </div>
          <div class="flex items-center gap-1 text-slate-600">
            <span class="h-2 w-3 rounded bg-red-200" />
            Saídas
          </div>
          <span class="text-slate-400">
            * Gráfico ilustrativo apenas para layout
          </span>
        </div>
      </UiAtomsCard>

      <UiAtomsCard padded>
        <p class="mb-2 text-sm font-semibold text-slate-900">
          Fluxo de caixa (resumo)
        </p>
        <p class="mb-3 text-xs text-slate-500">
          Visão simplificada de saldo atual e projeção para os próximos 7 dias.
        </p>
        <div class="space-y-2.5 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Saldo disponível em conta</span>
            <span class="font-semibold text-slate-900">
              {{ formatCurrency(mockFluxoCaixaResumo.saldoAtual) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Entradas previstas (7 dias)</span>
            <span class="font-semibold text-emerald-700">
              {{ formatCurrency(mockFluxoCaixaResumo.entradas7dias) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Saídas previstas (7 dias)</span>
            <span class="font-semibold text-red-700">
              {{ formatCurrency(mockFluxoCaixaResumo.saidas7dias) }}
            </span>
          </div>
          <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span class="text-[11px] font-medium text-slate-600">
              Saldo projetado (7 dias)
            </span>
            <span class="text-sm font-bold text-slate-900">
              {{ formatCurrency(mockFluxoCaixaResumo.saldoPrevisto7dias) }}
            </span>
          </div>
        </div>
      </UiAtomsCard>
    </div>

    <!-- Filtros + tabela de transações -->
    <UiAtomsCard padded>
      <div class="flex flex-wrap items-end gap-3">
        <div class="flex-1 min-w-[180px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">
            Buscar transações
          </label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              v-model="search"
              type="text"
              placeholder="Pedido, descrição..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            >
          </div>
        </div>

        <div class="min-w-[150px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">
            Status
          </label>
          <select
            v-model="filtroStatus"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option
              v-for="opt in statusTransacaoOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <div class="min-w-[170px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">
            Meio de pagamento
          </label>
          <select
            v-model="filtroMeioPagamento"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option
              v-for="opt in meioPagamentoOptionsFinanceiro"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <UiAtomsButton
          v-if="temFiltrosAtivos"
          variant="ghost"
          size="sm"
          class="self-end"
          @click="limparFiltros"
        >
          ✕ Limpar filtros
        </UiAtomsButton>
      </div>
    </UiAtomsCard>

    <UiAtomsCard :padded="false">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-slate-900">
            Transações
          </p>
          <UiAtomsBadge>
            {{ totalTransacoes }} registros
          </UiAtomsBadge>
        </div>
        <div class="flex flex-col items-end text-[11px] text-slate-500 sm:flex-row sm:items-center sm:gap-4">
          <span>
            Bruto: <span class="font-semibold text-slate-800">{{ formatCurrency(totalBrutoFiltrado) }}</span>
          </span>
          <span>
            Líquido: <span class="font-semibold text-slate-800">{{ formatCurrency(totalLiquidoFiltrado) }}</span>
          </span>
        </div>
      </div>

      <!-- Erro fake -->
      <div
        v-if="hasError"
        class="flex flex-col items-center justify-center gap-2 py-10 text-center"
      >
        <span class="text-4xl">🚫</span>
        <p class="text-sm font-medium text-slate-700">
          Não foi possível carregar as transações
        </p>
        <p class="text-xs text-slate-500">
          Estado de erro simulado para a interface de financeiro.
        </p>
        <UiAtomsButton
          class="mt-1"
          size="sm"
          @click="carregar()"
        >
          Tentar novamente
        </UiAtomsButton>
      </div>

      <!-- Loading -->
      <div
        v-else-if="loading"
        class="divide-y divide-slate-100"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center gap-4 px-4 py-3"
        >
          <div class="h-4 w-20 animate-pulse rounded bg-slate-200" />
          <div class="h-4 w-16 animate-pulse rounded bg-slate-100" />
          <div class="h-4 flex-1 animate-pulse rounded bg-slate-100" />
          <div class="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
          <div class="h-4 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="transacoesFiltradas.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-14 text-center"
      >
        <span class="text-4xl">📭</span>
        <p class="text-sm font-medium text-slate-700">
          Nenhuma transação encontrada
        </p>
        <p class="text-xs text-slate-500">
          Ajuste os filtros de busca ou período.
        </p>
        <UiAtomsButton
          variant="ghost"
          size="sm"
          class="mt-1"
          @click="limparFiltros"
        >
          Limpar filtros
        </UiAtomsButton>
      </div>

      <!-- Tabela -->
      <div
        v-else
        class="overflow-x-auto"
      >
        <table class="min-w-full divide-y divide-slate-100 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Data
              </th>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Pedido
              </th>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Tipo
              </th>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Meio
              </th>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th class="px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Bruto
              </th>
              <th class="px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Taxas
              </th>
              <th class="px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Líquido
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 bg-white">
            <tr
              v-for="t in transacoesFiltradas"
              :key="t.id"
              class="hover:bg-slate-50"
            >
              <td class="px-4 py-3 text-xs text-slate-600">
                {{ t.data }}<br>
                <span class="text-[10px] text-slate-400">{{ t.hora }}</span>
              </td>
              <td class="px-4 py-3 text-xs text-slate-700">
                <span v-if="t.pedido">
                  {{ t.pedido }}
                </span>
                <span
                  v-else
                  class="text-slate-400"
                >
                  – N/A –
                </span>
                <p class="mt-0.5 text-[10px] text-slate-400">
                  {{ t.descricao }}
                </p>
              </td>
              <td class="px-4 py-3 text-xs text-slate-600">
                <span v-if="t.tipo === 'recebimento'">Recebimento</span>
                <span v-else-if="t.tipo === 'estorno'">Estorno</span>
                <span v-else-if="t.tipo === 'taxa'">Taxa</span>
                <span v-else-if="t.tipo === 'repasse'">Repasse</span>
                <span v-else>Ajuste</span>
              </td>
              <td class="px-4 py-3 text-xs text-slate-600">
                <span v-if="t.meioPagamento">
                  {{ meioPagamentoConfigFinanceiro[t.meioPagamento] }}
                </span>
                <span
                  v-else
                  class="text-slate-400"
                >
                  – sistema –
                </span>
              </td>
              <td class="px-4 py-3">
                <UiAtomsBadge :variant="statusTransacaoConfig[t.status].variant">
                  {{ statusTransacaoConfig[t.status].label }}
                </UiAtomsBadge>
              </td>
              <td class="px-4 py-3 text-right text-xs font-semibold" :class="t.valorBruto < 0 ? 'text-red-700' : 'text-slate-900'">
                {{ formatCurrency(t.valorBruto) }}
              </td>
              <td class="px-4 py-3 text-right text-xs text-slate-500">
                {{ t.taxas ? formatCurrency(t.taxas) : '–' }}
              </td>
              <td class="px-4 py-3 text-right text-xs font-semibold" :class="t.valorLiquido < 0 ? 'text-red-700' : 'text-emerald-700'">
                {{ formatCurrency(t.valorLiquido) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UiAtomsCard>

    <!-- Bloco de repasses e chargebacks -->
    <div class="grid gap-4 md:grid-cols-2">
      <UiAtomsCard padded>
        <p class="mb-2 text-sm font-semibold text-slate-900">
          Repasses para conta bancária (fake)
        </p>
        <p class="mb-3 text-xs text-slate-500">
          Simulação de visão de repasses do intermediador de pagamento.
        </p>
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Próximo ciclo</span>
            <span class="font-medium text-slate-900">{{ mockResumoRepasses.proximoCiclo }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Valor previsto</span>
            <span class="font-semibold text-slate-900">
              {{ formatCurrency(mockResumoRepasses.valorPrevisto) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Em análise de risco</span>
            <span class="font-semibold text-amber-700">
              {{ formatCurrency(mockResumoRepasses.valorEmAnalise) }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Bloqueado (chargebacks, disputas)</span>
            <span class="font-semibold text-red-700">
              {{ formatCurrency(mockResumoRepasses.valorBloqueado) }}
            </span>
          </div>
        </div>
      </UiAtomsCard>

      <UiAtomsCard padded>
        <p class="mb-2 text-sm font-semibold text-slate-900">
          Chargebacks e reembolsos (fake)
        </p>
        <p class="mb-3 text-xs text-slate-500">
          Visão consolidada de disputas, estornos e reembolsos recentes.
        </p>
        <div class="space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Total de casos</span>
            <span class="font-semibold text-slate-900">
              {{ mockResumoChargebacks.totalChargebacks }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Em análise</span>
            <span class="font-semibold text-amber-700">
              {{ mockResumoChargebacks.emAnalise }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-500">Estornados</span>
            <span class="font-semibold text-red-700">
              {{ mockResumoChargebacks.estornados }}
            </span>
          </div>
          <div class="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
            <span class="text-[11px] font-medium text-slate-600">
              Impacto financeiro acumulado
            </span>
            <span class="text-sm font-bold text-slate-900">
              {{ formatCurrency(mockResumoChargebacks.valorTotal) }}
            </span>
          </div>
        </div>
      </UiAtomsCard>
    </div>
  </section>
</template>

