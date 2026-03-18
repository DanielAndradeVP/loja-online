<script setup lang="ts">
import EstoqueAjusteModal from './EstoqueAjusteModal.vue'
import {
  mockEstoque,
  mockMovimentacoes,
  getEstoqueStatus,
  tipoConfig,
  type ItemEstoque,
  type MovimentacaoEstoque,
} from '~/mocks/estoque'

// ---- Estado ----
const loading = ref(true)
const estoque = ref<ItemEstoque[]>([])
const movimentacoes = ref<MovimentacaoEstoque[]>([])

onMounted(() => {
  setTimeout(() => {
    estoque.value = [...mockEstoque]
    movimentacoes.value = [...mockMovimentacoes]
    loading.value = false
  }, 700)
})

// ---- Filtros tabela principal ----
const search = ref('')
const filtroNivel = ref<'todos' | 'zero' | 'critico' | 'baixo' | 'normal'>('todos')

const estoqueFiltrado = computed(() => {
  let lista = estoque.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(i =>
      i.produto.toLowerCase().includes(q) ||
      i.sku.toLowerCase().includes(q)
    )
  }
  if (filtroNivel.value !== 'todos') {
    lista = lista.filter(i => getEstoqueStatus(i).nivel === filtroNivel.value)
  }
  return lista
})

// ---- Filtro movimentações ----
const searchMovs = ref('')
const movsFiltradas = computed(() => {
  if (!searchMovs.value.trim()) return movimentacoes.value
  const q = searchMovs.value.toLowerCase()
  return movimentacoes.value.filter(m =>
    m.produto.toLowerCase().includes(q) ||
    m.sku.toLowerCase().includes(q) ||
    m.motivo.toLowerCase().includes(q)
  )
})

// ---- KPI cards ----
const kpis = computed(() => {
  const all = estoque.value
  const semEstoque = all.filter(i => i.saldoAtual === 0).length
  const criticos = all.filter(i => i.saldoAtual > 0 && i.saldoAtual <= i.minimo).length
  const baixo = all.filter(i => i.saldoAtual > i.minimo && i.saldoAtual <= i.minimo * 2).length
  const totalSKUs = all.length
  const valorTotal = all.reduce((sum, i) => sum + i.saldoAtual * i.precoCusto, 0)

  return [
    { id: 'skus', label: 'Total de SKUs', valor: totalSKUs, cor: 'text-slate-900', bg: 'bg-slate-50', icone: '🗂️' },
    { id: 'semEstoque', label: 'Sem estoque', valor: semEstoque, cor: 'text-red-700', bg: 'bg-red-50', icone: '⚠️' },
    { id: 'criticos', label: 'Estoque crítico', valor: criticos, cor: 'text-red-600', bg: 'bg-red-50', icone: '🔴' },
    { id: 'baixo', label: 'Estoque baixo', valor: baixo, cor: 'text-amber-700', bg: 'bg-amber-50', icone: '🟡' },
    { id: 'valor', label: 'Valor em estoque', valor: (valorTotal / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }), cor: 'text-emerald-700', bg: 'bg-emerald-50', icone: '💰' },
  ]
})

// ---- Produtos críticos (alertas) ----
const alertasCriticos = computed(() =>
  estoque.value.filter(i => i.saldoAtual <= i.minimo)
)

// ---- Modal de ajuste ----
const modalAberto = ref(false)
const itemSelecionado = ref<ItemEstoque | null>(null)

function abrirAjuste(item: ItemEstoque) {
  itemSelecionado.value = item
  modalAberto.value = true
}

function handleAjuste(sku: string, tipo: string, quantidade: number, motivo: string) {
  const i = estoque.value.findIndex(e => e.sku === sku)
  if (i === -1) return

  const saldoAnterior = estoque.value[i].saldoAtual
  let saldoPosterior = saldoAnterior

  if (tipo === 'entrada') saldoPosterior += quantidade
  else if (tipo === 'saida') saldoPosterior -= quantidade
  else saldoPosterior += quantidade

  estoque.value[i] = {
    ...estoque.value[i],
    saldoAtual: Math.max(0, saldoPosterior),
    disponivel: Math.max(0, saldoPosterior - estoque.value[i].reservado),
    ultimaMovimentacao: new Date().toLocaleDateString('pt-BR'),
  }

  movimentacoes.value.unshift({
    id: Date.now(),
    sku,
    produto: estoque.value[i].produto,
    tipo: tipo as any,
    quantidade: Math.abs(quantidade),
    saldoAnterior,
    saldoPosterior: Math.max(0, saldoPosterior),
    motivo,
    data: new Date().toLocaleDateString('pt-BR'),
    hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    usuario: 'Admin (você)',
  })
}

// ---- Seção ativa ----
const secaoAtiva = ref<'estoque' | 'movimentacoes'>('estoque')
</script>

<template>
  <section class="space-y-5">

    <!-- Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <span>Admin</span>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">Estoque</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Controle de Estoque</h1>
        <p class="mt-0.5 text-sm text-slate-500">Monitore e gerencie o estoque de todos os produtos</p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
        <UiAtomsButton variant="secondary" size="sm">⬇️ Exportar</UiAtomsButton>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      <template v-if="loading">
        <div
          v-for="i in 5"
          :key="i"
          class="animate-pulse rounded-xl border border-slate-200 bg-white p-4"
        >
          <div class="mb-2 h-3 w-20 rounded bg-slate-200" />
          <div class="h-7 w-14 rounded bg-slate-200" />
        </div>
      </template>
      <template v-else>
        <div
          v-for="kpi in kpis"
          :key="kpi.id"
          :class="['flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm', kpi.id === 'semEstoque' && kpi.valor > 0 ? 'border-red-200' : '']"
        >
          <div :class="['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xl', kpi.bg]">
            {{ kpi.icone }}
          </div>
          <div>
            <p class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">{{ kpi.label }}</p>
            <p :class="['mt-1 text-xl font-bold', kpi.cor]">{{ kpi.valor }}</p>
          </div>
        </div>
      </template>
    </div>

    <!-- Alertas de estoque crítico -->
    <div v-if="!loading && alertasCriticos.length > 0">
      <div class="mb-2 flex items-center gap-2">
        <p class="text-sm font-semibold text-red-700">⚠️ Produtos com estoque crítico ou zerado</p>
        <UiAtomsBadge variant="danger">{{ alertasCriticos.length }}</UiAtomsBadge>
      </div>
      <div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in alertasCriticos"
          :key="item.sku"
          class="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3"
        >
          <div class="min-w-0">
            <p class="truncate text-xs font-semibold text-red-900">{{ item.produto }}</p>
            <p class="font-mono text-[10px] text-red-600">{{ item.sku }}</p>
            <div class="mt-0.5 flex items-center gap-2 text-[10px] text-red-700">
              <span>Saldo: <strong>{{ item.saldoAtual }}</strong></span>
              <span>·</span>
              <span>Mínimo: <strong>{{ item.minimo }}</strong></span>
            </div>
          </div>
          <UiAtomsButton variant="secondary" size="sm" @click="abrirAjuste(item)">
            Ajustar
          </UiAtomsButton>
        </div>
      </div>
    </div>

    <!-- Tabs: Estoque | Movimentações -->
    <div class="flex overflow-hidden rounded-xl border border-slate-200">
      <button
        type="button"
        class="flex-1 px-5 py-3 text-sm font-medium transition-colors"
        :class="secaoAtiva === 'estoque' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
        @click="secaoAtiva = 'estoque'"
      >
        📦 Estoque atual
      </button>
      <button
        type="button"
        class="flex-1 border-l border-slate-200 px-5 py-3 text-sm font-medium transition-colors"
        :class="secaoAtiva === 'movimentacoes' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
        @click="secaoAtiva = 'movimentacoes'"
      >
        🔄 Movimentações
      </button>
    </div>

    <!-- ===== TABELA DE ESTOQUE ===== -->
    <div v-if="secaoAtiva === 'estoque'">
      <!-- Filtros -->
      <UiAtomsCard padded class="mb-4">
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex-1 min-w-[180px]">
            <label class="mb-1 block text-xs font-medium text-slate-600">Buscar produto ou SKU</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
              <input
                v-model="search"
                type="text"
                placeholder="Nome ou SKU..."
                class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="(label, key) in { todos: 'Todos', zero: 'Sem estoque', critico: 'Crítico', baixo: 'Baixo', normal: 'Normal' }"
              :key="key"
              type="button"
              class="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              :class="filtroNivel === key
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'"
              @click="filtroNivel = key as any"
            >
              {{ label }}
            </button>
          </div>
        </div>
      </UiAtomsCard>

      <!-- Tabela -->
      <UiAtomsCard :padded="false">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-slate-900">Posição de estoque</p>
            <UiAtomsBadge>{{ estoqueFiltrado.length }} SKUs</UiAtomsBadge>
          </div>
        </div>

        <div v-if="loading" class="divide-y divide-slate-100">
          <div v-for="i in 8" :key="i" class="flex items-center gap-4 px-4 py-3">
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 w-48 animate-pulse rounded bg-slate-200" />
              <div class="h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>
            <div class="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>

        <div v-else-if="estoqueFiltrado.length === 0" class="flex flex-col items-center gap-2 py-12 text-center">
          <span class="text-3xl">📭</span>
          <p class="text-sm text-slate-500">Nenhum item encontrado</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Produto</th>
                <th class="w-32 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">SKU</th>
                <th class="w-24 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Saldo atual</th>
                <th class="w-20 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Mínimo</th>
                <th class="w-24 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Reservado</th>
                <th class="w-24 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Disponível</th>
                <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Status</th>
                <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Última mov.</th>
                <th class="w-24 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Ação</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              <tr
                v-for="item in estoqueFiltrado"
                :key="item.sku"
                class="hover:bg-slate-50 transition-colors"
                :class="item.saldoAtual === 0 ? 'bg-red-50/30' : item.saldoAtual <= item.minimo ? 'bg-amber-50/30' : ''"
              >
                <td class="px-4 py-3">
                  <p class="font-medium text-slate-900">{{ item.produto }}</p>
                  <p class="text-[11px] text-slate-400">{{ item.categoria }}</p>
                </td>
                <td class="px-4 py-3 font-mono text-xs text-slate-600">{{ item.sku }}</td>
                <td class="px-4 py-3 text-center">
                  <span
                    class="text-sm font-bold"
                    :class="{
                      'text-red-600': item.saldoAtual === 0,
                      'text-amber-600': item.saldoAtual > 0 && item.saldoAtual <= item.minimo,
                      'text-slate-900': item.saldoAtual > item.minimo
                    }"
                  >
                    {{ item.saldoAtual }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center text-xs text-slate-500">{{ item.minimo }}</td>
                <td class="px-4 py-3 text-center text-xs text-slate-500">{{ item.reservado }}</td>
                <td class="px-4 py-3 text-center">
                  <span class="text-sm font-semibold text-slate-900">{{ item.disponivel }}</span>
                </td>
                <td class="px-4 py-3">
                  <UiAtomsBadge :variant="getEstoqueStatus(item).variant">
                    {{ getEstoqueStatus(item).label }}
                  </UiAtomsBadge>
                </td>
                <td class="px-4 py-3 text-xs text-slate-500">{{ item.ultimaMovimentacao }}</td>
                <td class="px-4 py-3 text-right">
                  <UiAtomsButton variant="secondary" size="sm" @click="abrirAjuste(item)">
                    Ajustar
                  </UiAtomsButton>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiAtomsCard>
    </div>

    <!-- ===== MOVIMENTAÇÕES ===== -->
    <div v-if="secaoAtiva === 'movimentacoes'">
      <!-- Filtro movimentações -->
      <div class="mb-4">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
          <input
            v-model="searchMovs"
            type="text"
            placeholder="Buscar por produto, SKU ou motivo..."
            class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 shadow-sm focus:border-slate-400 focus:outline-none"
          />
        </div>
      </div>

      <UiAtomsCard :padded="false">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-slate-900">Histórico de movimentações</p>
            <UiAtomsBadge>{{ movsFiltradas.length }} registros</UiAtomsBadge>
          </div>
        </div>

        <div v-if="loading" class="divide-y divide-slate-100">
          <div v-for="i in 6" :key="i" class="flex items-center gap-4 px-4 py-3">
            <div class="flex-1 space-y-1.5">
              <div class="h-3.5 w-48 animate-pulse rounded bg-slate-200" />
              <div class="h-3 w-64 animate-pulse rounded bg-slate-100" />
            </div>
          </div>
        </div>

        <div v-else-if="movsFiltradas.length === 0" class="flex flex-col items-center gap-2 py-12 text-center">
          <span class="text-3xl">📋</span>
          <p class="text-sm text-slate-500">Nenhuma movimentação encontrada</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Data/Hora</th>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Produto / SKU</th>
                <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Tipo</th>
                <th class="w-24 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Qtd.</th>
                <th class="w-28 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Saldo ant.</th>
                <th class="w-28 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Saldo post.</th>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Motivo</th>
                <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Usuário</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              <tr
                v-for="mov in movsFiltradas"
                :key="mov.id"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="px-4 py-3 text-xs text-slate-600">
                  {{ mov.data }}<br />
                  <span class="text-[10px] text-slate-400">{{ mov.hora }}</span>
                </td>
                <td class="px-4 py-3">
                  <p class="text-xs font-medium text-slate-900">{{ mov.produto }}</p>
                  <p class="font-mono text-[10px] text-slate-400">{{ mov.sku }}</p>
                </td>
                <td class="px-4 py-3">
                  <span :class="['rounded-full px-2 py-0.5 text-[10px] font-semibold', tipoConfig[mov.tipo].cor]">
                    {{ tipoConfig[mov.tipo].label }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <span
                    class="text-sm font-bold"
                    :class="{
                      'text-emerald-700': mov.tipo === 'entrada' || mov.tipo === 'cancelamento',
                      'text-red-700': mov.tipo === 'saida' || mov.tipo === 'reserva',
                      'text-blue-700': mov.tipo === 'ajuste',
                    }"
                  >
                    {{ tipoConfig[mov.tipo].sinal }}{{ Math.abs(mov.quantidade) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center text-xs text-slate-500">{{ mov.saldoAnterior }}</td>
                <td class="px-4 py-3 text-center text-xs font-semibold text-slate-900">{{ mov.saldoPosterior }}</td>
                <td class="px-4 py-3 max-w-xs">
                  <p class="truncate text-xs text-slate-600">{{ mov.motivo }}</p>
                </td>
                <td class="px-4 py-3 text-xs text-slate-500">{{ mov.usuario }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiAtomsCard>
    </div>

    <!-- Modal de ajuste -->
    <EstoqueAjusteModal
      v-model="modalAberto"
      :item="itemSelecionado"
      @ajustar="handleAjuste"
    />

  </section>
</template>
