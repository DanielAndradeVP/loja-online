<script setup lang="ts">
import {
  mockProdutos,
  statusConfig,
  statusOptions,
  categoriaOptions,
  formatCurrency,
  getStockBadge,
  type Produto,
  type ProdutoStatus,
} from '~/mocks/produtos'

const router = useRouter()

// ---- Estado ----
const loading = ref(true)
const produtos = ref<Produto[]>([])
const viewMode = ref<'table' | 'grid'>('table')
const search = ref('')
const filtroStatus = ref<ProdutoStatus | ''>('')
const filtroCategoria = ref('')
const page = ref(1)
const pageSize = 10

const menuAberto = ref<number | null>(null)

onMounted(() => {
  setTimeout(() => {
    produtos.value = mockProdutos
    loading.value = false
  }, 600)
})

// ---- Filtros ----
const produtosFiltrados = computed(() => {
  let lista = produtos.value
  if (search.value.trim()) {
    const q = search.value.toLowerCase()
    lista = lista.filter(p =>
      p.nome.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    )
  }
  if (filtroStatus.value) lista = lista.filter(p => p.status === filtroStatus.value)
  if (filtroCategoria.value) lista = lista.filter(p => p.categoria === filtroCategoria.value)
  return lista
})

const totalFiltrado = computed(() => produtosFiltrados.value.length)

const produtosPaginados = computed(() => {
  const s = (page.value - 1) * pageSize
  return produtosFiltrados.value.slice(s, s + pageSize)
})

watch([search, filtroStatus, filtroCategoria], () => { page.value = 1 })

// ---- Stats ----
const stats = computed(() => {
  const all = produtos.value
  return [
    { label: 'Total', valor: all.length, cor: 'text-slate-900' },
    { label: 'Ativos', valor: all.filter(p => p.status === 'ativo').length, cor: 'text-emerald-700' },
    { label: 'Inativos', valor: all.filter(p => p.status === 'inativo').length, cor: 'text-slate-500' },
    { label: 'Rascunhos', valor: all.filter(p => p.status === 'rascunho').length, cor: 'text-amber-700' },
    { label: 'Sem estoque', valor: all.filter(p => p.estoque === 0).length, cor: 'text-red-700' },
  ]
})

// ---- Ações ----
function irParaCriacao() { router.push('/admin/produtos/create') }
function irParaDetalhe(p: Produto) { router.push(`/admin/produtos/${p.id}`) }
function irParaEdicao(p: Produto) { router.push(`/admin/produtos/${p.id}/edit`) }

function duplicar(p: Produto) {
  menuAberto.value = null
  alert(`Produto "${p.nome}" duplicado com sucesso! (simulação)`)
}

function arquivar(p: Produto) {
  menuAberto.value = null
  const i = produtos.value.findIndex(x => x.id === p.id)
  if (i !== -1) produtos.value[i] = { ...produtos.value[i], status: 'arquivado' }
}

function toggleMenu(id: number, event: Event) {
  event.stopPropagation()
  menuAberto.value = menuAberto.value === id ? null : id
}

function fecharMenus() { menuAberto.value = null }

const limparFiltros = () => {
  search.value = ''
  filtroStatus.value = ''
  filtroCategoria.value = ''
}

const temFiltros = computed(() => search.value || filtroStatus.value || filtroCategoria.value)
</script>

<template>
  <section class="space-y-5" @click="fecharMenus">

    <!-- Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <span>Admin</span>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">Produtos</span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">Produtos</h1>
        <p class="mt-0.5 text-sm text-slate-500">Gerencie o catálogo de produtos da loja</p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
        <UiAtomsButton variant="secondary" size="sm">⬇️ Exportar</UiAtomsButton>
        <UiAtomsButton variant="primary" size="sm" @click="irParaCriacao">
          + Novo produto
        </UiAtomsButton>
      </div>
    </div>

    <!-- Stats rápidos -->
    <div class="grid grid-cols-3 gap-3 sm:grid-cols-5">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm"
      >
        <p :class="['text-xl font-bold', stat.cor]">{{ loading ? '–' : stat.valor }}</p>
        <p class="mt-0.5 text-[10px] font-medium text-slate-500">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Filtros + Toggle de vista -->
    <UiAtomsCard padded>
      <div class="flex flex-wrap items-end gap-3">
        <!-- Busca -->
        <div class="flex-1 min-w-[200px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Buscar produto</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">🔍</span>
            <input
              v-model="search"
              type="text"
              placeholder="Nome ou SKU..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
        </div>

        <!-- Status -->
        <div class="min-w-[150px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Status</label>
          <select
            v-model="filtroStatus"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          >
            <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <!-- Categoria -->
        <div class="min-w-[160px]">
          <label class="mb-1 block text-xs font-medium text-slate-600">Categoria</label>
          <select
            v-model="filtroCategoria"
            class="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-400 focus:outline-none"
          >
            <option v-for="opt in categoriaOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <UiAtomsButton
          v-if="temFiltros"
          variant="ghost"
          size="sm"
          class="self-end"
          @click="limparFiltros"
        >
          ✕ Limpar
        </UiAtomsButton>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Toggle view -->
        <div class="self-end flex overflow-hidden rounded-lg border border-slate-200">
          <button
            type="button"
            class="px-3 py-2 text-sm transition-colors"
            :class="viewMode === 'table' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
            @click="viewMode = 'table'"
          >
            ☰ Tabela
          </button>
          <button
            type="button"
            class="px-3 py-2 text-sm transition-colors border-l border-slate-200"
            :class="viewMode === 'grid' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'"
            @click="viewMode = 'grid'"
          >
            ⊞ Grade
          </button>
        </div>
      </div>
    </UiAtomsCard>

    <!-- ===== TABELA ===== -->
    <UiAtomsCard v-if="viewMode === 'table'" :padded="false">
      <div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div class="flex items-center gap-2">
          <p class="text-sm font-semibold text-slate-900">Lista de produtos</p>
          <UiAtomsBadge>{{ totalFiltrado }} produtos</UiAtomsBadge>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="divide-y divide-slate-100">
        <div v-for="i in 6" :key="i" class="flex items-center gap-4 px-4 py-3">
          <div class="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />
          <div class="flex-1 space-y-1.5">
            <div class="h-3.5 w-40 animate-pulse rounded bg-slate-200" />
            <div class="h-3 w-24 animate-pulse rounded bg-slate-100" />
          </div>
          <div class="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
          <div class="h-5 w-16 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="produtosPaginados.length === 0" class="flex flex-col items-center gap-2 py-16 text-center">
        <span class="text-4xl">🗃️</span>
        <p class="text-sm font-medium text-slate-700">Nenhum produto encontrado</p>
        <UiAtomsButton variant="ghost" size="sm" @click="limparFiltros">Limpar filtros</UiAtomsButton>
      </div>

      <!-- Tabela -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-100 text-sm">
          <thead class="bg-slate-50">
            <tr>
              <th class="w-12 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400"></th>
              <th class="px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Produto</th>
              <th class="w-32 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">SKU</th>
              <th class="w-32 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Categoria</th>
              <th class="w-28 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Preço</th>
              <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Status</th>
              <th class="w-28 px-4 py-2.5 text-left text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Estoque</th>
              <th class="w-36 px-4 py-2.5 text-right text-[0.65rem] font-medium uppercase tracking-wider text-slate-400">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 bg-white">
            <tr
              v-for="produto in produtosPaginados"
              :key="produto.id"
              class="group cursor-pointer hover:bg-slate-50 transition-colors"
              @click="irParaDetalhe(produto)"
            >
              <!-- Imagem -->
              <td class="px-4 py-3">
                <div
                  :class="[
                    'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br text-xl',
                    produto.imagemCor
                  ]"
                >
                  {{ produto.imagemEmoji }}
                </div>
              </td>
              <!-- Nome -->
              <td class="px-4 py-3">
                <p class="font-semibold text-slate-900 group-hover:text-slate-700">{{ produto.nome }}</p>
                <p class="text-[11px] text-slate-400">{{ produto.vendas }} vendas</p>
              </td>
              <!-- SKU -->
              <td class="px-4 py-3 font-mono text-xs text-slate-600">{{ produto.sku }}</td>
              <!-- Categoria -->
              <td class="px-4 py-3 text-xs text-slate-600">{{ produto.categoria }}</td>
              <!-- Preço -->
              <td class="px-4 py-3 text-right">
                <p class="font-semibold text-slate-900">{{ formatCurrency(produto.precoCentavos) }}</p>
                <p v-if="produto.precoPromocionalCentavos" class="text-[11px] text-emerald-600 line-through-none">
                  Promo: {{ formatCurrency(produto.precoPromocionalCentavos) }}
                </p>
              </td>
              <!-- Status -->
              <td class="px-4 py-3">
                <UiAtomsBadge :variant="statusConfig[produto.status].variant">
                  {{ statusConfig[produto.status].label }}
                </UiAtomsBadge>
              </td>
              <!-- Estoque -->
              <td class="px-4 py-3">
                <UiAtomsBadge :variant="getStockBadge(produto.estoque, produto.estoqueMinimo).variant">
                  {{ getStockBadge(produto.estoque, produto.estoqueMinimo).label }}
                </UiAtomsBadge>
              </td>
              <!-- Ações -->
              <td class="px-4 py-3 text-right" @click.stop>
                <div class="flex items-center justify-end gap-1">
                  <UiAtomsButton variant="ghost" size="sm" @click="irParaDetalhe(produto)">Ver</UiAtomsButton>
                  <UiAtomsButton variant="secondary" size="sm" @click="irParaEdicao(produto)">Editar</UiAtomsButton>
                  <!-- Dropdown -->
                  <div class="relative">
                    <button
                      type="button"
                      class="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      @click="toggleMenu(produto.id, $event)"
                    >
                      ⋮
                    </button>
                    <div
                      v-if="menuAberto === produto.id"
                      class="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                    >
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                        @click="duplicar(produto)"
                      >
                        📋 Duplicar
                      </button>
                      <button
                        type="button"
                        class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
                        @click="arquivar(produto)"
                      >
                        📦 Arquivar
                      </button>
                    </div>
                  </div>
                </div>
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
          {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, totalFiltrado) }} de {{ totalFiltrado }} produtos
        </p>
        <div class="flex items-center gap-1.5">
          <UiAtomsButton variant="secondary" size="sm" :disabled="page <= 1" @click="page--">← Anterior</UiAtomsButton>
          <span class="px-2 text-xs text-slate-600">{{ page }} / {{ Math.ceil(totalFiltrado / pageSize) }}</span>
          <UiAtomsButton variant="secondary" size="sm" :disabled="page >= Math.ceil(totalFiltrado / pageSize)" @click="page++">Próxima →</UiAtomsButton>
        </div>
      </div>
    </UiAtomsCard>

    <!-- ===== GRADE ===== -->
    <div v-if="viewMode === 'grid'">
      <div class="mb-3 flex items-center gap-2">
        <p class="text-sm font-semibold text-slate-900">Lista de produtos</p>
        <UiAtomsBadge>{{ totalFiltrado }} produtos</UiAtomsBadge>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div v-for="i in 8" :key="i" class="animate-pulse rounded-xl border border-slate-200 bg-white p-4">
          <div class="mb-3 h-32 rounded-lg bg-slate-200" />
          <div class="mb-2 h-4 w-3/4 rounded bg-slate-200" />
          <div class="h-3 w-1/2 rounded bg-slate-100" />
        </div>
      </div>

      <!-- Empty state -->
      <div v-else-if="produtosPaginados.length === 0" class="flex flex-col items-center gap-2 py-16 text-center">
        <span class="text-4xl">🗃️</span>
        <p class="text-sm font-medium text-slate-700">Nenhum produto encontrado</p>
        <UiAtomsButton variant="ghost" size="sm" @click="limparFiltros">Limpar filtros</UiAtomsButton>
      </div>

      <!-- Cards grid -->
      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="produto in produtosPaginados"
          :key="produto.id"
          class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-md"
        >
          <!-- Imagem -->
          <div
            :class="[
              'flex h-36 items-center justify-center bg-gradient-to-br text-5xl',
              produto.imagemCor
            ]"
          >
            {{ produto.imagemEmoji }}
          </div>

          <!-- Info -->
          <div class="flex flex-1 flex-col p-4">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold text-slate-900">{{ produto.nome }}</p>
                <p class="font-mono text-[11px] text-slate-400">{{ produto.sku }}</p>
              </div>
              <UiAtomsBadge :variant="statusConfig[produto.status].variant">
                {{ statusConfig[produto.status].label }}
              </UiAtomsBadge>
            </div>

            <div class="mt-2 flex items-center justify-between">
              <p class="text-xs text-slate-500">{{ produto.categoria }}</p>
              <UiAtomsBadge :variant="getStockBadge(produto.estoque, produto.estoqueMinimo).variant">
                {{ getStockBadge(produto.estoque, produto.estoqueMinimo).label }}
              </UiAtomsBadge>
            </div>

            <div class="mt-3 flex items-baseline gap-2">
              <p class="text-base font-bold text-slate-900">{{ formatCurrency(produto.precoCentavos) }}</p>
              <p v-if="produto.precoPromocionalCentavos" class="text-xs font-medium text-emerald-600">
                Promo: {{ formatCurrency(produto.precoPromocionalCentavos) }}
              </p>
            </div>

            <!-- Ações -->
            <div class="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <UiAtomsButton variant="secondary" size="sm" class="flex-1" @click="irParaDetalhe(produto)">
                Ver
              </UiAtomsButton>
              <UiAtomsButton variant="primary" size="sm" class="flex-1" @click="irParaEdicao(produto)">
                Editar
              </UiAtomsButton>
              <div class="relative" @click.stop>
                <button
                  type="button"
                  class="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                  @click="toggleMenu(produto.id, $event)"
                >
                  ⋮
                </button>
                <div
                  v-if="menuAberto === produto.id"
                  class="absolute right-0 z-10 mt-1 w-40 rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
                >
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50" @click="duplicar(produto)">📋 Duplicar</button>
                  <button type="button" class="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50" @click="arquivar(produto)">📦 Arquivar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Paginação grade -->
      <div
        v-if="!loading && totalFiltrado > pageSize"
        class="mt-4 flex items-center justify-between"
      >
        <p class="text-xs text-slate-500">
          {{ (page - 1) * pageSize + 1 }}–{{ Math.min(page * pageSize, totalFiltrado) }} de {{ totalFiltrado }} produtos
        </p>
        <div class="flex items-center gap-1.5">
          <UiAtomsButton variant="secondary" size="sm" :disabled="page <= 1" @click="page--">← Anterior</UiAtomsButton>
          <UiAtomsButton variant="secondary" size="sm" :disabled="page >= Math.ceil(totalFiltrado / pageSize)" @click="page++">Próxima →</UiAtomsButton>
        </div>
      </div>
    </div>

  </section>
</template>
