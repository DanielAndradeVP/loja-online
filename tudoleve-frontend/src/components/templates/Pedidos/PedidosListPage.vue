<script setup lang="ts">
import PedidoDetalheDrawer from './PedidoDetalheDrawer.vue'
import {
  mockPedidos,
  statusConfig,
  pagamentoConfig,
  statusOptions,
  pagamentoOptions,
  type Pedido,
  type PedidoStatus,
  type FormaPagamento,
} from '~/mocks/pedidos'

// ---- Estado dos filtros ----
const search = ref('')
const filtroStatus = ref<PedidoStatus | ''>('')
const filtroDataDe = ref('')
const filtroDataAte = ref('')
const filtroPagamento = ref<FormaPagamento | ''>('')
const page = ref(1)
const pageSize = 8

// ---- Estado da tabela ----
const loading = ref(true)
const pedidos = ref<Pedido[]>([])

onMounted(() => {
  setTimeout(() => {
    pedidos.value = mockPedidos
    loading.value = false
  }, 700)
})

// ---- Filtro computado ----
const pedidosFiltrados = computed(() => {
  let lista = pedidos.value

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(p =>
      p.numero.toLowerCase().includes(q) ||
      p.cliente.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    )
  }

  if (filtroStatus.value) {
    lista = lista.filter(p => p.status === filtroStatus.value)
  }

  if (filtroPagamento.value) {
    lista = lista.filter(p => p.formaPagamento === filtroPagamento.value)
  }

  return lista
})

const totalFiltrado = computed(() => pedidosFiltrados.value.length)

const pedidosPaginados = computed(() => {
  const start = (page.value - 1) * pageSize
  return pedidosFiltrados.value.slice(start, start + pageSize)
})

watch([search, filtroStatus, filtroDataDe, filtroDataAte, filtroPagamento], () => {
  page.value = 1
})

// ---- Drawer de detalhe ----
const drawerAberto = ref(false)
const pedidoSelecionado = ref<Pedido | null>(null)

function abrirDetalhe(pedido: Pedido) {
  pedidoSelecionado.value = pedido
  drawerAberto.value = true
}

function handleAtualizarStatus(pedidoAtualizado: Pedido) {
  const i = pedidos.value.findIndex(p => p.id === pedidoAtualizado.id)
  if (i !== -1) {
    pedidos.value[i] = pedidoAtualizado
    pedidoSelecionado.value = pedidoAtualizado
  }
}

// ---- Colunas ----
const columns = [
  { key: 'numero', label: 'Pedido', width: '90px' },
  { key: 'data', label: 'Data', width: '110px' },
  { key: 'cliente', label: 'Cliente' },
  { key: 'formaPagamento', label: 'Pagamento', width: '140px' },
  { key: 'status', label: 'Status', width: '130px' },
  { key: 'total', label: 'Total', width: '110px', align: 'right' as const },
]

function formatCurrency(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// ---- Stats rápidos no topo ----
const statsRapidos = computed(() => {
  const todos = pedidos.value
  return [
    { label: 'Total de pedidos', valor: todos.length, cor: 'text-slate-900' },
    { label: 'Pendentes', valor: todos.filter(p => p.status === 'pendente').length, cor: 'text-amber-700' },
    { label: 'Aprovados', valor: todos.filter(p => p.status === 'aprovado').length, cor: 'text-emerald-700' },
    { label: 'Em separação', valor: todos.filter(p => p.status === 'em_separacao').length, cor: 'text-blue-700' },
    { label: 'Enviados', valor: todos.filter(p => p.status === 'enviado').length, cor: 'text-slate-600' },
    { label: 'Cancelados', valor: todos.filter(p => p.status === 'cancelado').length, cor: 'text-red-700' },
  ]
})

function limparFiltros() {
  search.value = ''
  filtroStatus.value = ''
  filtroDataDe.value = ''
  filtroDataAte.value = ''
  filtroPagamento.value = ''
}

const temFiltrosAtivos = computed(
  () => search.value || filtroStatus.value || filtroDataDe.value || filtroDataAte.value || filtroPagamento.value
)
</script>

<template>
  <section class="space-y-5">

    <!-- Page Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <span>Admin</span>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">Pedidos</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Pedidos</h1>
        <p class="mt-0.5 text-sm text-slate-500">Gerencie e acompanhe todos os pedidos da loja</p>
      </div>
      <div class="flex items-center gap-2 mt-1 sm:mt-0">
        <UiAtomsButton variant="secondary" size="sm">
          ⬇️ Exportar
        </UiAtomsButton>
      </div>
    </div>

    <!-- Stats rápidos -->
    <div v-if="!loading" class="grid grid-cols-3 gap-3 sm:grid-cols-6">
      <div
        v-for="stat in statsRapidos"
        :key="stat.label"
        class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm"
      >
        <p :class="['text-xl font-bold', stat.cor]">{{ stat.valor }}</p>
        <p class="mt-0.5 text-[10px] font-medium text-slate-500">{{ stat.label }}</p>
      </div>
    </div>
    <div v-else class="grid grid-cols-3 gap-3 sm:grid-cols-6">
      <div
        v-for="i in 6"
        :key="i"
        class="h-16 animate-pulse rounded-lg border border-slate-200 bg-white"
      />
    </div>

    <!-- Filtros -->
    <UiAtomsCard padded>
      <div class="flex flex-wrap items-end gap-3">
        <!-- Busca -->
        <div class="flex-1 min-w-[180px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Buscar pedido</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              v-model="search"
              type="text"
              placeholder="Número, cliente ou e-mail..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="min-w-[160px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Status</label>
          <select
            v-model="filtroStatus"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option
              v-for="opt in statusOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Pagamento -->
        <div class="min-w-[160px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Pagamento</label>
          <select
            v-model="filtroPagamento"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          >
            <option
              v-for="opt in pagamentoOptions"
              :key="opt.value"
              :value="opt.value"
            >
              {{ opt.label }}
            </option>
          </select>
        </div>

        <!-- Data de -->
        <div class="min-w-[130px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Data de</label>
          <input
            v-model="filtroDataDe"
            type="date"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <!-- Data até -->
        <div class="min-w-[130px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Data até</label>
          <input
            v-model="filtroDataAte"
            type="date"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <!-- Botão limpar -->
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

    <!-- Tabela -->
    <UiAtomsCard :padded="false">
      <!-- Toolbar interno -->
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-slate-900">Lista de pedidos</p>
          <UiAtomsBadge>{{ totalFiltrado }} pedidos</UiAtomsBadge>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="divide-y divide-slate-100">
        <div
          v-for="i in 6"
          :key="i"
          class="flex items-center gap-4 px-4 py-3"
        >
          <div class="h-4 w-16 animate-pulse rounded bg-slate-200" />
          <div class="h-4 w-20 animate-pulse rounded bg-slate-100" />
          <div class="h-4 flex-1 animate-pulse rounded bg-slate-100" />
          <div class="h-5 w-24 animate-pulse rounded-full bg-slate-100" />
          <div class="h-4 w-20 animate-pulse rounded bg-slate-100" />
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="pedidosPaginados.length === 0"
        class="flex flex-col items-center justify-center gap-2 py-16 text-center"
      >
        <span class="text-4xl">📭</span>
        <p class="text-sm font-medium text-slate-700">Nenhum pedido encontrado</p>
        <p class="text-xs text-slate-500">Tente ajustar os filtros de busca</p>
        <UiAtomsButton variant="ghost" size="sm" class="mt-1" @click="limparFiltros">
          Limpar filtros
        </UiAtomsButton>
      </div>

      <!-- Tabela de dados -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th
                v-for="col in columns"
                :key="col.key"
                scope="col"
                class="px-4 py-2.5 text-[0.65rem] font-medium uppercase tracking-wider text-slate-400"
                :class="{
                  'text-left': col.align !== 'right',
                  'text-right': col.align === 'right',
                }"
                :style="col.width ? { width: col.width } : undefined"
              >
                {{ col.label }}
              </th>
              <th scope="col" class="px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 bg-white">
            <tr
              v-for="pedido in pedidosPaginados"
              :key="pedido.id"
              class="group cursor-pointer hover:bg-slate-50 transition-colors"
              @click="abrirDetalhe(pedido)"
            >
              <!-- Número -->
              <td class="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                {{ pedido.numero }}
              </td>
              <!-- Data -->
              <td class="px-4 py-3 text-slate-500 text-xs">
                {{ pedido.data }}<br />
                <span class="text-[10px] text-slate-400">{{ pedido.hora }}</span>
              </td>
              <!-- Cliente -->
              <td class="px-4 py-3">
                <p class="font-medium text-slate-900">{{ pedido.cliente }}</p>
                <p class="text-[11px] text-slate-400">{{ pedido.email }}</p>
              </td>
              <!-- Pagamento -->
              <td class="px-4 py-3 text-xs text-slate-600">
                {{ pagamentoConfig[pedido.formaPagamento] }}
              </td>
              <!-- Status -->
              <td class="px-4 py-3">
                <UiAtomsBadge :variant="statusConfig[pedido.status].variant">
                  {{ statusConfig[pedido.status].label }}
                </UiAtomsBadge>
              </td>
              <!-- Total -->
              <td class="px-4 py-3 text-right font-semibold text-slate-900">
                {{ formatCurrency(pedido.total) }}
              </td>
              <!-- Ações -->
              <td class="px-4 py-3 text-right" @click.stop>
                <UiAtomsButton
                  variant="ghost"
                  size="sm"
                  @click="abrirDetalhe(pedido)"
                >
                  Ver detalhe →
                </UiAtomsButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginação -->
      <div
        v-if="!loading && totalFiltrado > pageSize"
        class="flex items-center justify-between border-t border-slate-100 px-4 py-3"
      >
        <p class="text-xs text-slate-500">
          Mostrando {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, totalFiltrado) }} de {{ totalFiltrado }} pedidos
        </p>
        <div class="flex items-center gap-1.5">
          <UiAtomsButton
            variant="secondary"
            size="sm"
            :disabled="page <= 1"
            @click="page--"
          >
            ← Anterior
          </UiAtomsButton>
          <span class="px-2 text-xs text-slate-600">
            Página {{ page }} de {{ Math.ceil(totalFiltrado / pageSize) }}
          </span>
          <UiAtomsButton
            variant="secondary"
            size="sm"
            :disabled="page >= Math.ceil(totalFiltrado / pageSize)"
            @click="page++"
          >
            Próxima →
          </UiAtomsButton>
        </div>
      </div>
    </UiAtomsCard>

    <!-- Drawer de detalhe -->
    <PedidoDetalheDrawer
      v-model="drawerAberto"
      :pedido="pedidoSelecionado"
      @atualizar-status="handleAtualizarStatus"
    />

  </section>
</template>
