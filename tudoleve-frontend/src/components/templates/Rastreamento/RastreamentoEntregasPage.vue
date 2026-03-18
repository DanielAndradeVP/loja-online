<script setup lang="ts">
import {
  mockEntregas,
  statusEntregaConfig,
  transportadoraConfig,
  statusEntregaOptions,
  transportadoraOptions,
  type Entrega,
  type StatusEntrega,
  type Transportadora,
} from '~/mocks/rastreamento'

const loading = ref(true)
const hasError = ref(false)

const search = ref('')
const filtroStatus = ref<StatusEntrega | ''>('')
const filtroTransportadora = ref<Transportadora | ''>('')

const entregas = ref<Entrega[]>([])
const entregaSelecionada = ref<Entrega | null>(null)

onMounted(() => {
  carregar()
})

function carregar(simularErro = false) {
  loading.value = true
  hasError.value = false
  entregaSelecionada.value = null

  setTimeout(() => {
    if (simularErro) {
      hasError.value = true
      loading.value = false
      return
    }

    entregas.value = mockEntregas
    entregaSelecionada.value = mockEntregas[0] ?? null
    loading.value = false
  }, 750)
}

const entregasFiltradas = computed(() => {
  let lista = entregas.value

  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(e =>
      e.pedido.toLowerCase().includes(q)
      || e.cliente.toLowerCase().includes(q)
      || (e.codigoRastreio ?? '').toLowerCase().includes(q),
    )
  }

  if (filtroStatus.value) {
    lista = lista.filter(e => e.statusEntrega === filtroStatus.value)
  }

  if (filtroTransportadora.value) {
    lista = lista.filter(e => e.transportadora === filtroTransportadora.value)
  }

  return lista
})

const totalEmTransito = computed(() =>
  entregas.value.filter(e => e.statusEntrega === 'em_transito').length,
)
const totalAtrasadas = computed(() =>
  entregas.value.filter(e => e.statusEntrega === 'atrasada').length,
)
const totalEntregues = computed(() =>
  entregas.value.filter(e => e.statusEntrega === 'entregue').length,
)
const totalProblema = computed(() =>
  entregas.value.filter(e => e.statusEntrega === 'problema').length,
)

const temFiltrosAtivos = computed(
  () => search.value || filtroStatus.value || filtroTransportadora.value,
)

function limparFiltros() {
  search.value = ''
  filtroStatus.value = ''
  filtroTransportadora.value = ''
}

function selecionarEntrega(entrega: Entrega) {
  entregaSelecionada.value = entrega
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
          <span class="font-medium text-slate-600">Rastreamento / Entregas</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Rastreamento e entregas</h1>
        <p class="mt-0.5 text-sm text-slate-500">
          Acompanhe status de envio, atrasos e problemas logísticos dos pedidos.
        </p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
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

    <!-- Cards de resumo -->
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
          v-for="card in [
            { label: 'Em trânsito', valor: totalEmTransito, icon: '🚚', cor: 'text-slate-900' },
            { label: 'Atrasadas', valor: totalAtrasadas, icon: '⏰', cor: 'text-amber-700' },
            { label: 'Entregues', valor: totalEntregues, icon: '✅', cor: 'text-emerald-700' },
            { label: 'Problemas logísticos', valor: totalProblema, icon: '⚠️', cor: 'text-red-700' },
          ]"
          :key="card.label"
          padded
          class="flex items-center justify-between"
        >
          <div>
            <p class="text-[0.7rem] font-medium uppercase tracking-wide text-slate-500">
              {{ card.label }}
            </p>
            <p :class="['mt-1 text-2xl font-bold', card.cor]">
              {{ card.valor }}
            </p>
          </div>
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-lg text-white">
            {{ card.icon }}
          </div>
        </UiAtomsCard>
      </template>
    </div>

    <!-- Layout principal: filtros + tabela + detalhe -->
    <div class="grid gap-4 lg:grid-cols-3">
      <div class="space-y-4 lg:col-span-2">
        <!-- Filtros -->
        <UiAtomsCard padded>
          <div class="flex flex-wrap items-end gap-3">
            <div class="flex-1 min-w-[180px]">
              <label class="mb-1 block text-xs font-medium text-slate-600">Buscar</label>
              <div class="relative">
                <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
                <input
                  v-model="search"
                  type="text"
                  placeholder="Pedido, cliente ou código de rastreio..."
                  class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                >
              </div>
            </div>

            <div class="min-w-[150px]">
              <label class="mb-1 block text-xs font-medium text-slate-600">Status</label>
              <select
                v-model="filtroStatus"
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                <option
                  v-for="opt in statusEntregaOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
            </div>

            <div class="min-w-[170px]">
              <label class="mb-1 block text-xs font-medium text-slate-600">Transportadora</label>
              <select
                v-model="filtroTransportadora"
                class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              >
                <option
                  v-for="opt in transportadoraOptions"
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

        <!-- Tabela de entregas -->
        <UiAtomsCard :padded="false">
          <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div class="flex items-center gap-2">
              <p class="text-sm font-semibold text-slate-900">
                Entregas
              </p>
              <UiAtomsBadge>
                {{ entregasFiltradas.length }} registros
              </UiAtomsBadge>
            </div>
          </div>

          <!-- Erro fake -->
          <div
            v-if="hasError"
            class="flex flex-col items-center justify-center gap-2 py-10 text-center"
          >
            <span class="text-4xl">🚫</span>
            <p class="text-sm font-medium text-slate-700">
              Não foi possível carregar as entregas
            </p>
            <p class="text-xs text-slate-500">
              Este é um estado de erro simulado para a interface.
            </p>
            <UiAtomsButton
              class="mt-1"
              size="sm"
              @click="carregar()"
            >
              Tentar novamente
            </UiAtomsButton>
          </div>

          <!-- Loading skeleton -->
          <div
            v-else-if="loading"
            class="divide-y divide-slate-100"
          >
            <div
              v-for="i in 6"
              :key="i"
              class="flex items-center gap-4 px-4 py-3"
            >
              <div class="h-4 w-16 animate-pulse rounded bg-slate-200" />
              <div class="h-4 w-32 animate-pulse rounded bg-slate-100" />
              <div class="h-4 w-28 animate-pulse rounded bg-slate-100" />
              <div class="h-4 w-24 animate-pulse rounded bg-slate-100" />
              <div class="h-4 w-24 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          <!-- Empty -->
          <div
            v-else-if="entregasFiltradas.length === 0"
            class="flex flex-col items-center justify-center gap-2 py-14 text-center"
          >
            <span class="text-4xl">📭</span>
            <p class="text-sm font-medium text-slate-700">
              Nenhuma entrega encontrada
            </p>
            <p class="text-xs text-slate-500">
              Ajuste os filtros ou verifique o período.
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
                    Pedido
                  </th>
                  <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                    Cliente
                  </th>
                  <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                    Transportadora
                  </th>
                  <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                    Código de rastreio
                  </th>
                  <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                    Status
                  </th>
                  <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                    Previsão
                  </th>
                  <th class="px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 bg-white">
                <tr
                  v-for="entrega in entregasFiltradas"
                  :key="entrega.id"
                  :class="[
                    'cursor-pointer hover:bg-slate-50',
                    entregaSelecionada?.id === entrega.id ? 'bg-slate-50' : '',
                  ]"
                  @click="selecionarEntrega(entrega)"
                >
                  <td class="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                    {{ entrega.pedido }}
                  </td>
                  <td class="px-4 py-3">
                    <p class="text-sm font-medium text-slate-900">
                      {{ entrega.cliente }}
                    </p>
                    <p class="text-[11px] text-slate-400">
                      {{ entrega.cidadeDestino }} / {{ entrega.ufDestino }}
                    </p>
                  </td>
                  <td class="px-4 py-3 text-xs text-slate-600">
                    {{ transportadoraConfig[entrega.transportadora].label }}
                  </td>
                  <td class="px-4 py-3 text-xs">
                    <span
                      v-if="entrega.codigoRastreio"
                      class="rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-900"
                    >
                      {{ entrega.codigoRastreio }}
                    </span>
                    <span
                      v-else
                      class="text-[11px] text-slate-400"
                    >
                      – sem código –
                    </span>
                  </td>
                  <td class="px-4 py-3">
                    <UiAtomsBadge :variant="statusEntregaConfig[entrega.statusEntrega].variant">
                      {{ statusEntregaConfig[entrega.statusEntrega].label }}
                    </UiAtomsBadge>
                    <p
                      v-if="entrega.diasAtraso"
                      class="mt-0.5 text-[10px] font-medium text-amber-700"
                    >
                      {{ entrega.diasAtraso }} dia(s) de atraso
                    </p>
                    <p
                      v-else-if="entrega.statusEntrega === 'em_transito'"
                      class="mt-0.5 text-[10px] text-slate-400"
                    >
                      Rota em andamento
                    </p>
                  </td>
                  <td class="px-4 py-3 text-xs text-slate-600">
                    {{ entrega.previsao }}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <UiAtomsButton
                      variant="ghost"
                      size="sm"
                    >
                      Ver timeline →
                    </UiAtomsButton>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </UiAtomsCard>
      </div>

      <!-- Painel lateral: timeline e "mapa" fake -->
      <div class="space-y-4">
        <UiAtomsCard padded>
          <p class="mb-3 text-sm font-semibold text-slate-900">
            Timeline da entrega
          </p>
          <div v-if="!entregaSelecionada">
            <p class="text-xs text-slate-500">
              Selecione uma entrega na tabela ao lado para visualizar o histórico.
            </p>
          </div>
          <div
            v-else
            class="space-y-3"
          >
            <div class="text-xs text-slate-600">
              <p class="font-semibold text-slate-900">
                {{ entregaSelecionada.pedido }} · {{ entregaSelecionada.cliente }}
              </p>
              <p class="mt-0.5">
                {{ transportadoraConfig[entregaSelecionada.transportadora].label }}
                ·
                {{ entregaSelecionada.cidadeOrigem }} → {{ entregaSelecionada.cidadeDestino }}/{{ entregaSelecionada.ufDestino }}
              </p>
            </div>

            <ol class="relative ml-3 border-l border-slate-200">
              <li
                v-for="(ev, idx) in entregaSelecionada.timeline"
                :key="idx"
                class="mb-3 ml-3"
              >
                <div
                  class="absolute -left-[7px] mt-1 h-3 w-3 rounded-full border border-white"
                  :class="ev.concluido ? 'bg-emerald-500' : ev.atual ? 'bg-slate-900' : 'bg-slate-200'"
                />
                <p
                  class="text-xs font-semibold"
                  :class="ev.atual ? 'text-slate-900' : 'text-slate-600'"
                >
                  {{ ev.status }}
                </p>
                <p class="text-[11px] text-slate-500">
                  {{ ev.descricao }}
                </p>
                <p class="mt-0.5 text-[10px] text-slate-400">
                  {{ ev.data }} · {{ ev.hora }}
                </p>
              </li>
            </ol>

            <div
              v-if="entregaSelecionada.problemas"
              class="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2"
            >
              <p class="text-xs font-semibold text-amber-900">
                Problema logístico identificado
              </p>
              <p class="mt-0.5 text-[11px] text-amber-800">
                {{ entregaSelecionada.problemas }}
              </p>
            </div>
          </div>
        </UiAtomsCard>

        <!-- Bloco visual "mapa" fake -->
        <UiAtomsCard padded>
          <p class="mb-3 text-sm font-semibold text-slate-900">
            Visualização de rota (fake)
          </p>
          <div class="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 text-center">
            <p class="text-[11px] text-slate-500">
              Espaço reservado para um mapa real de rastreamento
              (Google Maps, mapa da transportadora, etc.).
            </p>
            <div class="mt-3 h-28 w-full rounded-md bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100" />
          </div>
        </UiAtomsCard>
      </div>
    </div>
  </section>
</template>

