<script setup lang="ts">
import {
  mockCampanhas,
  mockCupons,
  mockBanners,
  mockAutomacoes,
  mockEventosCalendario,
  mockKpisMarketing,
  canalConfig,
  campanhaStatusConfig,
  automacaoConfig,
  automacaoStatusConfig,
  formatCurrency,
  calcROI,
  calcCTR,
  type Campanha,
  type Cupom,
} from '~/mocks/marketing'

const loading = ref(true)

onMounted(() => {
  setTimeout(() => { loading.value = false }, 700)
})

// ---- Tabs ----
type Tab = 'campanhas' | 'cupons' | 'banners' | 'automacoes' | 'calendario'

const tabs: Array<{ key: Tab; label: string; icon: string }> = [
  { key: 'campanhas',  label: 'Campanhas',   icon: '📣' },
  { key: 'cupons',     label: 'Cupons',       icon: '🎟️' },
  { key: 'banners',    label: 'Banners',      icon: '🖼️' },
  { key: 'automacoes', label: 'Automações',   icon: '⚙️' },
  { key: 'calendario', label: 'Calendário',   icon: '📅' },
]

const tabAtiva = ref<Tab>('campanhas')

// ---- KPIs topo ----
const kpisTopo = [
  { label: 'Campanhas ativas',     valor: mockKpisMarketing.campanhasAtivas,     icone: '📣', cor: 'text-blue-700',   bg: 'bg-blue-50' },
  { label: 'Cupons ativos',        valor: mockKpisMarketing.cuponsAtivos,         icone: '🎟️', cor: 'text-violet-700', bg: 'bg-violet-50' },
  { label: 'Taxa de conversão',    valor: mockKpisMarketing.taxaConversao,        icone: '📈', cor: 'text-emerald-700',bg: 'bg-emerald-50' },
  { label: 'Carrinhos recuperados',valor: mockKpisMarketing.carrinhoRecuperados,  icone: '🛒', cor: 'text-amber-700',  bg: 'bg-amber-50' },
  { label: 'Receita de campanhas', valor: mockKpisMarketing.receitaTotal,         icone: '💰', cor: 'text-slate-900',  bg: 'bg-slate-50' },
  { label: 'ROI médio',            valor: mockKpisMarketing.roiMedio,             icone: '🎯', cor: 'text-pink-700',   bg: 'bg-pink-50' },
]

// ---- Calendário (Março 2026) ----
const mesCalendario = ref({ ano: 2026, mes: 2 })

const diasNoMes = computed(() => new Date(mesCalendario.value.ano, mesCalendario.value.mes + 1, 0).getDate())
const primeiroDia = computed(() => new Date(mesCalendario.value.ano, mesCalendario.value.mes, 1).getDay())

const semanas = computed(() => {
  const cells: (number | null)[] = [
    ...Array(primeiroDia.value).fill(null),
    ...Array.from({ length: diasNoMes.value }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const rows = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  return rows
})

const eventosPorDia = computed(() => {
  const mapa: Record<number, typeof mockEventosCalendario> = {}
  mockEventosCalendario.forEach(ev => {
    if (!mapa[ev.data]) mapa[ev.data] = []
    mapa[ev.data].push(ev)
  })
  return mapa
})

const mesNome = computed(() => {
  return new Date(mesCalendario.value.ano, mesCalendario.value.mes, 1)
    .toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
})

// ---- Cupons: novo cupom fake ----
const modalNovoCupom = ref(false)
const novoCupom = reactive({ codigo: '', desconto: '', tipo: 'percentual', minPedido: '' })
</script>

<template>
  <section class="space-y-5">

    <!-- Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <span>Admin</span>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">Marketing</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Marketing</h1>
        <p class="mt-0.5 text-sm text-slate-500">Campanhas, cupons, automações e promoções da loja</p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
        <UiAtomsButton variant="secondary" size="sm">📊 Relatório</UiAtomsButton>
        <UiAtomsButton variant="primary" size="sm">+ Nova campanha</UiAtomsButton>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <template v-if="loading">
        <div v-for="i in 6" :key="i" class="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div class="mb-2 h-3 w-20 rounded bg-slate-200" />
          <div class="h-7 w-14 rounded bg-slate-200" />
        </div>
      </template>
      <template v-else>
        <div
          v-for="kpi in kpisTopo"
          :key="kpi.label"
          class="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <p class="text-[0.65rem] font-medium uppercase tracking-wide text-slate-500">{{ kpi.label }}</p>
            <span :class="['flex h-7 w-7 items-center justify-center rounded-lg text-sm', kpi.bg]">{{ kpi.icone }}</span>
          </div>
          <p :class="['mt-1 text-xl font-bold', kpi.cor]">{{ kpi.valor }}</p>
        </div>
      </template>
    </div>

    <!-- Tabs de navegação -->
    <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <nav class="flex min-w-max">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          class="flex items-center gap-1.5 border-b-2 px-5 py-3.5 text-xs font-medium transition-colors whitespace-nowrap"
          :class="tabAtiva === tab.key
            ? 'border-slate-900 text-slate-900'
            : 'border-transparent text-slate-500 hover:text-slate-700'"
          @click="tabAtiva = tab.key"
        >
          <span>{{ tab.icon }}</span>
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- ===== CAMPANHAS ===== -->
    <div v-if="tabAtiva === 'campanhas'" class="space-y-4">

      <!-- Cards de campanhas ativas -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="campanha in mockCampanhas.filter(c => c.status === 'ativa')"
          :key="campanha.id"
          class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="mb-3 flex items-start justify-between gap-2">
            <div class="flex items-center gap-2">
              <span
                :class="['flex h-8 w-8 items-center justify-center rounded-lg text-lg', canalConfig[campanha.canal].bg]"
              >
                {{ canalConfig[campanha.canal].icone }}
              </span>
              <div>
                <p class="text-xs font-semibold text-slate-900">{{ campanha.nome }}</p>
                <p :class="['text-[10px] font-medium', canalConfig[campanha.canal].cor]">
                  {{ canalConfig[campanha.canal].label }}
                </p>
              </div>
            </div>
            <UiAtomsBadge :variant="campanhaStatusConfig[campanha.status].variant">
              {{ campanhaStatusConfig[campanha.status].label }}
            </UiAtomsBadge>
          </div>
          <!-- Barra de gasto do orçamento -->
          <div class="mb-3">
            <div class="mb-1 flex justify-between text-[10px] text-slate-500">
              <span>Orçamento utilizado</span>
              <span class="font-semibold text-slate-700">
                {{ formatCurrency(campanha.gasto) }} / {{ formatCurrency(campanha.orcamento) }}
              </span>
            </div>
            <div class="h-1.5 w-full rounded-full bg-slate-100">
              <div
                class="h-1.5 rounded-full bg-slate-900"
                :style="`width: ${Math.min(100, (campanha.gasto / campanha.orcamento) * 100)}%`"
              />
            </div>
          </div>
          <!-- Métricas -->
          <div class="grid grid-cols-4 gap-1 border-t border-slate-100 pt-3">
            <div class="text-center">
              <p class="text-xs font-bold text-slate-900">{{ campanha.alcance.toLocaleString('pt-BR') }}</p>
              <p class="text-[9px] text-slate-400">Alcance</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-bold text-slate-900">{{ campanha.cliques.toLocaleString('pt-BR') }}</p>
              <p class="text-[9px] text-slate-400">Cliques</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-bold text-emerald-700">{{ campanha.conversoes }}</p>
              <p class="text-[9px] text-slate-400">Conversões</p>
            </div>
            <div class="text-center">
              <p class="text-xs font-bold text-blue-700">{{ calcROI(campanha.receita, campanha.gasto) }}</p>
              <p class="text-[9px] text-slate-400">ROI</p>
            </div>
          </div>
          <p class="mt-2 text-[10px] text-slate-400">{{ campanha.dataInicio }} → {{ campanha.dataFim }}</p>
        </div>
      </div>

      <!-- Tabela completa -->
      <UiAtomsCard :padded="false">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-slate-900">Todas as campanhas</p>
            <UiAtomsBadge>{{ mockCampanhas.length }}</UiAtomsBadge>
          </div>
          <UiAtomsButton variant="secondary" size="sm">+ Nova campanha</UiAtomsButton>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Campanha</th>
                <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Canal</th>
                <th class="w-24 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Status</th>
                <th class="w-32 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Orçamento</th>
                <th class="w-24 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Conversões</th>
                <th class="w-24 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">ROI</th>
                <th class="w-32 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Período</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              <tr v-for="campanha in mockCampanhas" :key="campanha.id" class="hover:bg-slate-50">
                <td class="px-4 py-3">
                  <p class="font-medium text-slate-900">{{ campanha.nome }}</p>
                  <p class="text-[11px] text-slate-400">{{ campanha.descricao }}</p>
                </td>
                <td class="px-4 py-3">
                  <span :class="['inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold', canalConfig[campanha.canal].bg, canalConfig[campanha.canal].cor]">
                    {{ canalConfig[campanha.canal].icone }} {{ canalConfig[campanha.canal].label }}
                  </span>
                </td>
                <td class="px-4 py-3">
                  <UiAtomsBadge :variant="campanhaStatusConfig[campanha.status].variant">
                    {{ campanhaStatusConfig[campanha.status].label }}
                  </UiAtomsBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <p class="text-xs font-semibold text-slate-900">{{ formatCurrency(campanha.orcamento) }}</p>
                  <p class="text-[10px] text-slate-400">{{ formatCurrency(campanha.gasto) }} gasto</p>
                </td>
                <td class="px-4 py-3 text-center text-xs font-semibold text-emerald-700">{{ campanha.conversoes || '–' }}</td>
                <td class="px-4 py-3 text-center text-xs font-semibold text-blue-700">{{ calcROI(campanha.receita, campanha.gasto) }}</td>
                <td class="px-4 py-3 text-xs text-slate-500">{{ campanha.dataInicio }}<br />{{ campanha.dataFim }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiAtomsCard>
    </div>

    <!-- ===== CUPONS ===== -->
    <div v-else-if="tabAtiva === 'cupons'" class="space-y-4">
      <UiAtomsCard :padded="false">
        <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <div class="flex items-center gap-2">
            <p class="text-sm font-semibold text-slate-900">Cupons de desconto</p>
            <UiAtomsBadge>{{ mockCupons.length }}</UiAtomsBadge>
          </div>
          <UiAtomsButton variant="secondary" size="sm" @click="modalNovoCupom = true">
            + Novo cupom
          </UiAtomsButton>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100 text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Código</th>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Desconto</th>
                <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Público</th>
                <th class="w-32 px-4 py-2.5 text-center text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Usos</th>
                <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Validade</th>
                <th class="w-24 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Status</th>
                <th class="w-20 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50 bg-white">
              <tr v-for="cupom in mockCupons" :key="cupom.id" class="hover:bg-slate-50">
                <td class="px-4 py-3">
                  <span class="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-bold text-slate-900">
                    {{ cupom.codigo }}
                  </span>
                  <p class="mt-0.5 text-[10px] text-slate-400">{{ cupom.descricao }}</p>
                </td>
                <td class="px-4 py-3">
                  <p class="text-sm font-bold text-slate-900">
                    <template v-if="cupom.tipo === 'percentual'">{{ cupom.valor }}% off</template>
                    <template v-else-if="cupom.tipo === 'fixo'">{{ formatCurrency(cupom.valor) }} off</template>
                    <template v-else>🚚 Frete grátis</template>
                  </p>
                  <p v-if="cupom.minPedido > 0" class="text-[10px] text-slate-400">
                    Mín. {{ formatCurrency(cupom.minPedido) }}
                  </p>
                </td>
                <td class="px-4 py-3 text-xs text-slate-600">{{ cupom.publico }}</td>
                <td class="px-4 py-3 text-center">
                  <div class="text-xs font-semibold text-slate-900">{{ cupom.usos }} / {{ cupom.limiteUsos }}</div>
                  <div class="mt-1 h-1 w-full rounded-full bg-slate-100">
                    <div
                      class="h-1 rounded-full"
                      :class="cupom.usos >= cupom.limiteUsos ? 'bg-red-500' : 'bg-slate-700'"
                      :style="`width: ${Math.min(100, (cupom.usos / cupom.limiteUsos) * 100)}%`"
                    />
                  </div>
                </td>
                <td class="px-4 py-3 text-xs text-slate-500">{{ cupom.dataExpiracao }}</td>
                <td class="px-4 py-3">
                  <UiAtomsBadge
                    :variant="cupom.status === 'ativo' ? 'success' : cupom.status === 'expirado' ? 'danger' : 'warning'"
                  >
                    {{ cupom.status === 'ativo' ? 'Ativo' : cupom.status === 'expirado' ? 'Expirado' : 'Pausado' }}
                  </UiAtomsBadge>
                </td>
                <td class="px-4 py-3 text-right">
                  <button type="button" class="text-xs text-slate-400 hover:text-slate-700">✏️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UiAtomsCard>
    </div>

    <!-- ===== BANNERS ===== -->
    <div v-else-if="tabAtiva === 'banners'" class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="banner in mockBanners"
          :key="banner.id"
          class="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
          <!-- Preview do banner -->
          <div
            :class="[
              'flex h-28 items-center justify-center bg-gradient-to-r text-5xl',
              banner.imagemCor,
            ]"
          >
            {{ banner.imagemEmoji }}
          </div>
          <!-- Info -->
          <div class="flex flex-1 flex-col p-3">
            <div class="mb-2 flex items-start justify-between gap-2">
              <p class="text-xs font-semibold text-slate-900 leading-tight">{{ banner.nome }}</p>
              <UiAtomsBadge :variant="banner.status === 'ativo' ? 'success' : 'outline'">
                {{ banner.status === 'ativo' ? 'Ativo' : 'Inativo' }}
              </UiAtomsBadge>
            </div>
            <p class="text-[10px] text-slate-500">📍 {{ banner.posicao }}</p>
            <p class="text-[10px] text-slate-400 mt-0.5">{{ banner.dataInicio }} → {{ banner.dataFim }}</p>
            <div class="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
              <span class="text-xs text-slate-500">{{ banner.cliques.toLocaleString('pt-BR') }} cliques</span>
              <div class="flex gap-1.5">
                <UiAtomsButton variant="ghost" size="sm">✏️</UiAtomsButton>
                <UiAtomsButton variant="secondary" size="sm">Ver</UiAtomsButton>
              </div>
            </div>
          </div>
        </div>

        <!-- Card "Adicionar novo banner" -->
        <div class="flex h-full min-h-[180px] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-slate-400">
          <span class="text-3xl">+</span>
          <span class="text-xs font-medium">Novo banner</span>
        </div>
      </div>
    </div>

    <!-- ===== AUTOMAÇÕES ===== -->
    <div v-else-if="tabAtiva === 'automacoes'" class="space-y-3">
      <!-- Info box -->
      <div class="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
        <span class="text-lg">⚙️</span>
        <div>
          <p class="text-xs font-semibold text-blue-900">Automações de marketing</p>
          <p class="text-xs text-blue-700 mt-0.5">
            As automações são fluxos acionados automaticamente por eventos. Configure gatilhos, conteúdo e audiência para cada fluxo.
          </p>
        </div>
      </div>

      <div class="space-y-3">
        <div
          v-for="aut in mockAutomacoes"
          :key="aut.id"
          class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div class="flex items-start gap-3">
              <span :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl', automacaoConfig[aut.tipo]?.cor ?? 'bg-slate-100 text-slate-600']">
                {{ automacaoConfig[aut.tipo]?.icone ?? '⚙️' }}
              </span>
              <div>
                <div class="flex items-center gap-2">
                  <p class="text-sm font-semibold text-slate-900">{{ aut.nome }}</p>
                  <UiAtomsBadge :variant="automacaoStatusConfig[aut.status].variant">
                    {{ automacaoStatusConfig[aut.status].label }}
                  </UiAtomsBadge>
                </div>
                <p class="mt-0.5 text-xs text-slate-500">
                  <span class="font-medium text-slate-700">Gatilho:</span> {{ aut.gatilho }}
                </p>
                <div class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                  <span>📤 {{ aut.enviados.toLocaleString('pt-BR') }} enviados</span>
                  <span>👁️ {{ aut.abertos.toLocaleString('pt-BR') }} abertos
                    <span class="text-slate-400">
                      ({{ aut.enviados ? Math.round((aut.abertos / aut.enviados) * 100) : 0 }}%)
                    </span>
                  </span>
                  <span>✅ {{ aut.convertidos }} conversões</span>
                </div>
              </div>
            </div>

            <div class="flex shrink-0 flex-col gap-1 text-right text-[10px] text-slate-400 sm:min-w-[130px]">
              <span>Última: {{ aut.ultimaExecucao }}</span>
              <span>Próxima: {{ aut.proximaExecucao }}</span>
              <div class="mt-2 flex justify-end gap-1.5">
                <UiAtomsButton variant="ghost" size="sm">✏️ Editar</UiAtomsButton>
                <UiAtomsButton
                  :variant="aut.status === 'ativa' ? 'secondary' : 'primary'"
                  size="sm"
                >
                  {{ aut.status === 'ativa' ? '⏸ Pausar' : '▶ Ativar' }}
                </UiAtomsButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ===== CALENDÁRIO ===== -->
    <div v-else-if="tabAtiva === 'calendario'">
      <UiAtomsCard padded>
        <!-- Header do calendário -->
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-slate-900 capitalize">{{ mesNome }}</h2>
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
              @click="mesCalendario.mes = Math.max(0, mesCalendario.mes - 1)"
            >←</button>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50"
              @click="mesCalendario.mes = Math.min(11, mesCalendario.mes + 1)"
            >→</button>
          </div>
        </div>

        <!-- Legenda de tipos -->
        <div class="mb-4 flex flex-wrap gap-2">
          <span v-for="(cfg, key) in canalConfig" :key="key" class="flex items-center gap-1 text-[10px] text-slate-600">
            <span :class="['h-2.5 w-2.5 rounded-full', cfg.bg.replace('bg-', 'bg-').replace('50', '500')]" style="background-color: currentColor" />
            <span :class="cfg.cor">{{ cfg.icone }} {{ cfg.label }}</span>
          </span>
        </div>

        <!-- Grid do calendário -->
        <div class="overflow-x-auto">
          <div class="min-w-[600px]">
            <!-- Cabeçalho dos dias -->
            <div class="mb-1 grid grid-cols-7 gap-1">
              <div
                v-for="dia in ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']"
                :key="dia"
                class="py-1 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-400"
              >
                {{ dia }}
              </div>
            </div>

            <!-- Semanas -->
            <div class="space-y-1">
              <div
                v-for="(semana, si) in semanas"
                :key="si"
                class="grid grid-cols-7 gap-1"
              >
                <div
                  v-for="(dia, di) in semana"
                  :key="di"
                  class="min-h-[72px] rounded-lg border p-1.5"
                  :class="dia ? 'border-slate-200 bg-white hover:border-slate-300' : 'border-transparent bg-transparent'"
                >
                  <div v-if="dia">
                    <p
                      class="mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold"
                      :class="dia === 17 ? 'bg-slate-900 text-white' : 'text-slate-700'"
                    >
                      {{ dia }}
                    </p>
                    <div class="space-y-0.5">
                      <div
                        v-for="evento in (eventosPorDia[dia] ?? []).slice(0, 2)"
                        :key="evento.id"
                        :class="['rounded px-1 py-0.5 text-[9px] font-medium text-white truncate', evento.cor]"
                        :title="evento.titulo + ': ' + evento.descricao"
                      >
                        {{ evento.titulo }}
                      </div>
                      <div
                        v-if="(eventosPorDia[dia] ?? []).length > 2"
                        class="text-[9px] text-slate-400"
                      >
                        +{{ (eventosPorDia[dia] ?? []).length - 2 }} mais
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UiAtomsCard>
    </div>

    <!-- Modal novo cupom -->
    <UiMoleculesModal
      v-model="modalNovoCupom"
      title="Novo cupom de desconto"
      size="md"
    >
      <div class="space-y-4">
        <div class="grid gap-4 sm:grid-cols-2">
          <UiMoleculesFormField label="Código do cupom" required>
            <UiAtomsInput v-model="novoCupom.codigo" placeholder="EX: PROMO20" />
          </UiMoleculesFormField>
          <UiMoleculesFormField label="Tipo de desconto">
            <select v-model="novoCupom.tipo" class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-slate-900 focus:outline-none">
              <option value="percentual">Percentual (%)</option>
              <option value="fixo">Valor fixo (R$)</option>
              <option value="frete_gratis">Frete grátis</option>
            </select>
          </UiMoleculesFormField>
        </div>
        <div class="grid gap-4 sm:grid-cols-2">
          <UiMoleculesFormField :label="novoCupom.tipo === 'percentual' ? 'Desconto (%)' : 'Valor (R$)'">
            <UiAtomsInput v-model="novoCupom.desconto" type="number" placeholder="20" :disabled="novoCupom.tipo === 'frete_gratis'" />
          </UiMoleculesFormField>
          <UiMoleculesFormField label="Pedido mínimo (R$)">
            <UiAtomsInput v-model="novoCupom.minPedido" type="number" placeholder="0" />
          </UiMoleculesFormField>
        </div>
      </div>
      <template #footer>
        <UiAtomsButton variant="secondary" size="sm" @click="modalNovoCupom = false">Cancelar</UiAtomsButton>
        <UiAtomsButton variant="primary" size="sm" @click="modalNovoCupom = false">Criar cupom</UiAtomsButton>
      </template>
    </UiMoleculesModal>

  </section>
</template>
