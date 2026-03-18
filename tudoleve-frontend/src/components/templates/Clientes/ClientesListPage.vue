<script setup lang="ts">
import ClienteDetalheDrawer from './ClienteDetalheDrawer.vue'
import {
  mockClientes,
  statusConfig,
  statusOptions,
  formatCurrency,
  getIniciais,
  type Cliente,
  type ClienteStatus,
} from '~/mocks/clientes'

const loading = ref(true)
const clientes = ref<Cliente[]>([])

onMounted(() => {
  setTimeout(() => {
    clientes.value = [...mockClientes]
    loading.value = false
  }, 700)
})

// ---- Filtros ----
const search = ref('')
const filtroStatus = ref<ClienteStatus | ''>('')
const filtroDataDe = ref('')
const filtroDataAte = ref('')
const page = ref(1)
const pageSize = 10

const clientesFiltrados = computed(() => {
  let lista = clientes.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(c =>
      c.nome.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.telefone.includes(q)
    )
  }
  if (filtroStatus.value) lista = lista.filter(c => c.status === filtroStatus.value)
  return lista
})

const totalFiltrado = computed(() => clientesFiltrados.value.length)

const clientesPaginados = computed(() => {
  const s = (page.value - 1) * pageSize
  return clientesFiltrados.value.slice(s, s + pageSize)
})

watch([search, filtroStatus, filtroDataDe, filtroDataAte], () => { page.value = 1 })

const limparFiltros = () => {
  search.value = ''
  filtroStatus.value = ''
  filtroDataDe.value = ''
  filtroDataAte.value = ''
}

const temFiltros = computed(() => search.value || filtroStatus.value || filtroDataDe.value || filtroDataAte.value)

// ---- KPIs ----
const kpis = computed(() => {
  const all = clientes.value
  const agora = new Date()
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1)

  return [
    {
      label: 'Total de clientes',
      valor: all.length,
      sub: 'todos os registros',
      cor: 'text-slate-900',
      bg: 'bg-slate-50',
      icone: '👥',
    },
    {
      label: 'Clientes ativos',
      valor: all.filter(c => c.status === 'ativo').length,
      sub: `${Math.round((all.filter(c => c.status === 'ativo').length / all.length) * 100)}% do total`,
      cor: 'text-emerald-700',
      bg: 'bg-emerald-50',
      icone: '✅',
    },
    {
      label: 'Novos este mês',
      valor: 5,
      sub: 'cadastros em março/26',
      cor: 'text-blue-700',
      bg: 'bg-blue-50',
      icone: '🆕',
    },
    {
      label: 'Recorrentes',
      valor: all.filter(c => c.recorrente).length,
      sub: '2+ compras realizadas',
      cor: 'text-violet-700',
      bg: 'bg-violet-50',
      icone: '🔄',
    },
    {
      label: 'Ticket médio geral',
      valor: formatCurrency(Math.round(all.reduce((s, c) => s + c.ticketMedio, 0) / all.length)),
      sub: 'média de todos os clientes',
      cor: 'text-amber-700',
      bg: 'bg-amber-50',
      icone: '💰',
    },
    {
      label: 'Bloqueados',
      valor: all.filter(c => c.status === 'bloqueado').length,
      sub: 'requerem atenção',
      cor: 'text-red-700',
      bg: 'bg-red-50',
      icone: '🚫',
    },
  ]
})

// ---- Drawer ----
const drawerAberto = ref(false)
const clienteSelecionado = ref<Cliente | null>(null)

function abrirDetalhe(c: Cliente) {
  clienteSelecionado.value = c
  drawerAberto.value = true
}

function handleBloquear(c: Cliente) {
  const i = clientes.value.findIndex(x => x.id === c.id)
  if (i !== -1) {
    clientes.value[i] = { ...clientes.value[i], status: 'bloqueado' }
    clienteSelecionado.value = clientes.value[i]
  }
}

function handleDesbloquear(c: Cliente) {
  const i = clientes.value.findIndex(x => x.id === c.id)
  if (i !== -1) {
    clientes.value[i] = { ...clientes.value[i], status: 'ativo' }
    clienteSelecionado.value = clientes.value[i]
  }
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
          <span class="font-medium text-slate-600">Clientes</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Clientes</h1>
        <p class="mt-0.5 text-sm text-slate-500">Gerencie a base de clientes da loja</p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
        <UiAtomsButton variant="secondary" size="sm">⬇️ Exportar</UiAtomsButton>
        <UiAtomsButton variant="primary" size="sm">+ Novo cliente</UiAtomsButton>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div class="mb-2 h-7 w-10 rounded bg-slate-200" />
          <div class="h-3 w-20 rounded bg-slate-100" />
        </div>
      </template>
      <template v-else>
        <div
          v-for="kpi in kpis"
          :key="kpi.label"
          class="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <p class="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">{{ kpi.label }}</p>
            <span :class="['flex h-7 w-7 items-center justify-center rounded-lg text-sm', kpi.bg]">{{ kpi.icone }}</span>
          </div>
          <p :class="['text-xl font-bold', kpi.cor]">{{ kpi.valor }}</p>
          <p class="text-[10px] text-slate-400">{{ kpi.sub }}</p>
        </div>
      </template>
    </div>

    <!-- Filtros -->
    <UiAtomsCard padded>
      <div class="flex flex-wrap items-end gap-3">
        <!-- Busca -->
        <div class="flex-1 min-w-[200px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Buscar cliente</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
            <input
              v-model="search"
              type="text"
              placeholder="Nome, e-mail ou telefone..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="min-w-[160px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Status</label>
          <select
            v-model="filtroStatus"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <!-- Data de cadastro de/até -->
        <div class="min-w-[130px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Cadastro de</label>
          <input v-model="filtroDataDe" type="date" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none" />
        </div>
        <div class="min-w-[130px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Até</label>
          <input v-model="filtroDataAte" type="date" class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none" />
        </div>

        <UiAtomsButton v-if="temFiltros" variant="ghost" size="sm" class="self-end" @click="limparFiltros">
          ✕ Limpar filtros
        </UiAtomsButton>
      </div>
    </UiAtomsCard>

    <!-- Tabela -->
    <UiAtomsCard :padded="false">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-slate-900">Lista de clientes</p>
          <UiAtomsBadge>{{ totalFiltrado }} clientes</UiAtomsBadge>
        </div>
      </div>

      <!-- Skeleton -->
      <div v-if="loading" class="divide-y divide-slate-100">
        <div v-for="i in 6" :key="i" class="flex items-center gap-4 px-4 py-3">
          <div class="h-9 w-9 animate-pulse rounded-full bg-slate-200" />
          <div class="flex-1 space-y-1.5">
            <div class="h-3.5 w-36 animate-pulse rounded bg-slate-200" />
            <div class="h-3 w-48 animate-pulse rounded bg-slate-100" />
          </div>
          <div class="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="clientesPaginados.length === 0" class="flex flex-col items-center gap-2 py-16 text-center">
        <span class="text-4xl">👤</span>
        <p class="text-sm font-medium text-slate-700">Nenhum cliente encontrado</p>
        <UiAtomsButton variant="ghost" size="sm" @click="limparFiltros">Limpar filtros</UiAtomsButton>
      </div>

      <!-- Tabela de dados -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Cliente</th>
              <th class="w-32 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Localização</th>
              <th class="w-24 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Status</th>
              <th class="w-20 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Pedidos</th>
              <th class="w-28 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Total gasto</th>
              <th class="w-28 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Ticket médio</th>
              <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Cadastro</th>
              <th class="w-24 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Ação</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 bg-white">
            <tr
              v-for="cliente in clientesPaginados"
              :key="cliente.id"
              class="group cursor-pointer hover:bg-slate-50 transition-colors"
              @click="abrirDetalhe(cliente)"
            >
              <!-- Cliente (avatar + nome + e-mail) -->
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-bold text-white',
                      cliente.avatarCor,
                    ]"
                  >
                    {{ getIniciais(cliente.nome) }}
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 flex items-center gap-1.5">
                      {{ cliente.nome }}
                      <span
                        v-if="cliente.recorrente"
                        class="rounded-full bg-violet-100 px-1.5 py-0.5 text-[9px] font-semibold text-violet-700"
                      >
                        Recorrente
                      </span>
                    </p>
                    <p class="truncate text-[11px] text-slate-400">{{ cliente.email }}</p>
                  </div>
                </div>
              </td>
              <!-- Localização -->
              <td class="px-4 py-3 text-xs text-slate-600">
                {{ cliente.cidade }}, {{ cliente.estado }}
              </td>
              <!-- Status -->
              <td class="px-4 py-3">
                <UiAtomsBadge :variant="statusConfig[cliente.status].variant">
                  {{ statusConfig[cliente.status].label }}
                </UiAtomsBadge>
              </td>
              <!-- Pedidos -->
              <td class="px-4 py-3 text-center text-sm font-semibold text-slate-900">
                {{ cliente.totalPedidos }}
              </td>
              <!-- Total gasto -->
              <td class="px-4 py-3 text-right text-sm font-semibold text-slate-900">
                {{ formatCurrency(cliente.totalGasto) }}
              </td>
              <!-- Ticket médio -->
              <td class="px-4 py-3 text-right text-xs text-slate-600">
                {{ formatCurrency(cliente.ticketMedio) }}
              </td>
              <!-- Cadastro -->
              <td class="px-4 py-3 text-xs text-slate-500">{{ cliente.dataCadastro }}</td>
              <!-- Ação -->
              <td class="px-4 py-3 text-right" @click.stop>
                <UiAtomsButton variant="ghost" size="sm" @click="abrirDetalhe(cliente)">
                  Ver →
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
          {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, totalFiltrado) }} de {{ totalFiltrado }} clientes
        </p>
        <div class="flex items-center gap-1.5">
          <UiAtomsButton variant="secondary" size="sm" :disabled="page <= 1" @click="page--">← Anterior</UiAtomsButton>
          <span class="px-2 text-xs text-slate-600">{{ page }} / {{ Math.ceil(totalFiltrado / pageSize) }}</span>
          <UiAtomsButton variant="secondary" size="sm" :disabled="page >= Math.ceil(totalFiltrado / pageSize)" @click="page++">Próxima →</UiAtomsButton>
        </div>
      </div>
    </UiAtomsCard>

    <!-- Drawer de detalhe -->
    <ClienteDetalheDrawer
      v-model="drawerAberto"
      :cliente="clienteSelecionado"
      @bloquear="handleBloquear"
      @desbloquear="handleDesbloquear"
    />
  </section>
</template>
