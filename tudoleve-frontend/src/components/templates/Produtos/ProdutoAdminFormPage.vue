<script setup lang="ts">
import {
  mockProdutos,
  categorias,
  formatCurrency,
  type ProdutoStatus,
  type Produto,
} from '~/mocks/produtos'

const props = defineProps<{
  produtoId?: number
}>()

const router = useRouter()

// ---- Aba ativa ----
type Aba = 'geral' | 'midia' | 'precos' | 'variacoes' | 'seo' | 'publicacao'

const abas: Array<{ key: Aba; label: string; icon: string }> = [
  { key: 'geral',      label: 'Informações Gerais', icon: '📝' },
  { key: 'midia',      label: 'Mídia',              icon: '🖼️' },
  { key: 'precos',     label: 'Preços',             icon: '💰' },
  { key: 'variacoes',  label: 'Variações',          icon: '🎨' },
  { key: 'seo',        label: 'SEO',                icon: '🔍' },
  { key: 'publicacao', label: 'Publicação',         icon: '📢' },
]

const abaAtiva = ref<Aba>('geral')

// ---- Modo edição ou criação ----
const isEdicao = computed(() => !!props.produtoId)
const produtoOriginal = computed(() =>
  props.produtoId ? mockProdutos.find(p => p.id === props.produtoId) ?? null : null
)

// ---- Estado do formulário ----
const form = reactive({
  // Geral
  nome: produtoOriginal.value?.nome ?? '',
  descricao: produtoOriginal.value?.descricao ?? '',
  categoria: produtoOriginal.value?.categoria ?? '',
  tags: produtoOriginal.value?.tags.join(', ') ?? '',
  peso: produtoOriginal.value?.peso?.toString() ?? '',
  dimLargura: produtoOriginal.value?.dimensoes.largura?.toString() ?? '',
  dimAltura: produtoOriginal.value?.dimensoes.altura?.toString() ?? '',
  dimProfundidade: produtoOriginal.value?.dimensoes.profundidade?.toString() ?? '',
  // Preços
  preco: produtoOriginal.value ? (produtoOriginal.value.precoCentavos / 100).toFixed(2) : '',
  precoPromocional: produtoOriginal.value?.precoPromocionalCentavos
    ? (produtoOriginal.value.precoPromocionalCentavos / 100).toFixed(2) : '',
  precoCusto: produtoOriginal.value ? (produtoOriginal.value.precoCustoCentavos / 100).toFixed(2) : '',
  // Variações
  temVariacoes: produtoOriginal.value?.temVariacoes ?? false,
  // SEO
  seoTitulo: produtoOriginal.value?.seoTitulo ?? '',
  seoDescricao: produtoOriginal.value?.seoDescricao ?? '',
  seoSlug: produtoOriginal.value?.seoSlug ?? '',
  // Publicação
  status: (produtoOriginal.value?.status ?? 'rascunho') as ProdutoStatus,
  estoque: produtoOriginal.value?.estoque?.toString() ?? '0',
  estoqueMinimo: produtoOriginal.value?.estoqueMinimo?.toString() ?? '5',
})

// Variações (somente visual)
const variacoes = ref(
  produtoOriginal.value?.variacoes.length
    ? [...produtoOriginal.value.variacoes]
    : [{ id: 1, sku: '', tamanho: 'P', cor: '', preco: 0, estoque: 0 }]
)

function adicionarVariacao() {
  variacoes.value.push({
    id: Date.now(),
    sku: '',
    tamanho: 'M',
    cor: '',
    preco: 0,
    estoque: 0,
  })
}

function removerVariacao(id: number) {
  variacoes.value = variacoes.value.filter(v => v.id !== id)
}

// ---- Margem calculada ----
const margemCalc = computed(() => {
  const preco = parseFloat(form.preco) || 0
  const custo = parseFloat(form.precoCusto) || 0
  if (!preco || !custo) return null
  return (((preco - custo) / preco) * 100).toFixed(1)
})

// ---- SEO slug automático ----
watch(() => form.nome, (v) => {
  if (!isEdicao.value) {
    form.seoSlug = v.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    form.seoTitulo = v ? `${v} – TudoLeve` : ''
  }
})

// ---- Imagens (fake) ----
const imagemPrincipal = ref<string | null>(
  produtoOriginal.value?.imagemEmoji ? `placeholder:${produtoOriginal.value.imagemEmoji}` : null
)

// ---- Canais de venda ----
const canais = ref({
  loja: true,
  marketplace: false,
  instagram: false,
})

// ---- Estado de salvamento ----
const salvando = ref(false)
const salvoComSucesso = ref(false)

async function salvar() {
  salvando.value = true
  await new Promise(r => setTimeout(r, 1200))
  salvando.value = false
  salvoComSucesso.value = true
  setTimeout(() => { salvoComSucesso.value = false }, 3000)
}

function voltar() {
  router.push('/admin/produtos')
}
</script>

<template>
  <section class="space-y-5">

    <!-- Header -->
    <div class="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <nav class="mb-1 flex items-center gap-1 text-xs text-slate-400">
          <NuxtLink to="/admin/produtos" class="hover:text-slate-600">Produtos</NuxtLink>
          <span class="mx-0.5">›</span>
          <span class="font-medium text-slate-600">
            {{ isEdicao ? `Editar: ${produtoOriginal?.nome ?? 'Produto'}` : 'Novo produto' }}
          </span>
        </nav>
        <h1 class="text-xl font-bold text-slate-900">
          {{ isEdicao ? 'Editar produto' : 'Novo produto' }}
        </h1>
        <p class="mt-0.5 text-sm text-slate-500">
          {{ isEdicao ? 'Atualize as informações do produto' : 'Preencha os dados para cadastrar um novo produto' }}
        </p>
      </div>
      <div class="mt-1 flex items-center gap-2 sm:mt-0">
        <UiAtomsButton variant="secondary" size="sm" @click="voltar">Cancelar</UiAtomsButton>
        <UiAtomsButton
          variant="primary"
          size="sm"
          :loading="salvando"
          @click="salvar"
        >
          {{ salvoComSucesso ? '✓ Salvo!' : isEdicao ? 'Salvar alterações' : 'Publicar produto' }}
        </UiAtomsButton>
      </div>
    </div>

    <!-- Feedback de sucesso -->
    <div
      v-if="salvoComSucesso"
      class="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800"
    >
      ✅ Produto salvo com sucesso!
    </div>

    <!-- Layout principal: conteúdo + sidebar -->
    <div class="grid gap-5 lg:grid-cols-3">

      <!-- Conteúdo principal (abas) -->
      <div class="lg:col-span-2 space-y-0">

        <!-- Tabs nav -->
        <div class="overflow-x-auto border-b border-slate-200 bg-white rounded-t-xl">
          <nav class="flex min-w-max px-1">
            <button
              v-for="aba in abas"
              :key="aba.key"
              type="button"
              class="relative flex items-center gap-1.5 px-4 py-3.5 text-xs font-medium transition-colors whitespace-nowrap"
              :class="abaAtiva === aba.key
                ? 'text-slate-900 border-b-2 border-slate-900'
                : 'text-slate-500 hover:text-slate-700'"
              @click="abaAtiva = aba.key"
            >
              <span>{{ aba.icon }}</span>
              {{ aba.label }}
            </button>
          </nav>
        </div>

        <!-- Conteúdo da aba -->
        <div class="rounded-b-xl border border-t-0 border-slate-200 bg-white p-5">

          <!-- ===== GERAL ===== -->
          <div v-if="abaAtiva === 'geral'" class="space-y-5">
            <UiMoleculesFormField label="Nome do produto" required>
              <UiAtomsInput v-model="form.nome" placeholder="Ex: Caixa Organizadora 40L" />
            </UiMoleculesFormField>

            <UiMoleculesFormField label="Descrição">
              <textarea
                v-model="form.descricao"
                rows="5"
                placeholder="Descreva o produto, seus benefícios e características principais..."
                class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </UiMoleculesFormField>

            <div class="grid gap-4 sm:grid-cols-2">
              <UiMoleculesFormField label="Categoria" required>
                <select
                  v-model="form.categoria"
                  class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none"
                >
                  <option value="">Selecionar categoria...</option>
                  <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </UiMoleculesFormField>

              <UiMoleculesFormField label="Tags" description="Separadas por vírgula">
                <UiAtomsInput v-model="form.tags" placeholder="organização, caixa, armazenamento" />
              </UiMoleculesFormField>
            </div>

            <div class="rounded-lg border border-slate-200 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Dimensões e peso</p>
              <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <UiMoleculesFormField label="Peso (g)">
                  <UiAtomsInput v-model="form.peso" type="number" placeholder="850" />
                </UiMoleculesFormField>
                <UiMoleculesFormField label="Largura (cm)">
                  <UiAtomsInput v-model="form.dimLargura" type="number" placeholder="60" />
                </UiMoleculesFormField>
                <UiMoleculesFormField label="Altura (cm)">
                  <UiAtomsInput v-model="form.dimAltura" type="number" placeholder="35" />
                </UiMoleculesFormField>
                <UiMoleculesFormField label="Profund. (cm)">
                  <UiAtomsInput v-model="form.dimProfundidade" type="number" placeholder="40" />
                </UiMoleculesFormField>
              </div>
            </div>
          </div>

          <!-- ===== MÍDIA ===== -->
          <div v-else-if="abaAtiva === 'midia'" class="space-y-5">
            <div>
              <p class="mb-2 text-sm font-semibold text-slate-700">Imagem principal</p>
              <div
                class="flex h-48 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition-colors hover:border-slate-400 hover:bg-slate-100"
              >
                <div v-if="imagemPrincipal" class="text-center">
                  <div class="mb-2 text-5xl">
                    {{ imagemPrincipal.replace('placeholder:', '') }}
                  </div>
                  <p class="text-xs text-slate-500">Clique para substituir</p>
                </div>
                <template v-else>
                  <span class="text-3xl text-slate-400">📷</span>
                  <p class="text-sm font-medium text-slate-600">Clique para fazer upload</p>
                  <p class="text-xs text-slate-400">PNG, JPG ou WEBP · Máx. 5MB</p>
                </template>
              </div>
            </div>

            <div>
              <p class="mb-2 text-sm font-semibold text-slate-700">Galeria de imagens</p>
              <div class="grid grid-cols-4 gap-3">
                <div
                  v-for="i in 4"
                  :key="i"
                  class="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400 transition-colors hover:border-slate-400"
                >
                  <span class="text-xl">+</span>
                  <span class="text-[10px]">Adicionar</span>
                </div>
              </div>
              <p class="mt-2 text-xs text-slate-400">Até 8 imagens adicionais. A primeira será usada como miniatura.</p>
            </div>

            <UiMoleculesFormField label="Texto alternativo (alt)" description="Para acessibilidade e SEO">
              <UiAtomsInput v-model="form.seoTitulo" placeholder="Ex: Caixa organizadora cinza 40L" />
            </UiMoleculesFormField>
          </div>

          <!-- ===== PREÇOS ===== -->
          <div v-else-if="abaAtiva === 'precos'" class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-3">
              <UiMoleculesFormField label="Preço de venda (R$)" required>
                <UiAtomsInput v-model="form.preco" type="number" placeholder="99.90" />
              </UiMoleculesFormField>

              <UiMoleculesFormField label="Preço promocional (R$)" description="Opcional">
                <UiAtomsInput v-model="form.precoPromocional" type="number" placeholder="79.90" />
              </UiMoleculesFormField>

              <UiMoleculesFormField label="Preço de custo (R$)" description="Não visível ao cliente">
                <UiAtomsInput v-model="form.precoCusto" type="number" placeholder="35.00" />
              </UiMoleculesFormField>
            </div>

            <!-- Card de margem calculada -->
            <div v-if="margemCalc !== null" class="grid grid-cols-3 gap-4">
              <div class="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-center">
                <p class="text-xs font-medium text-emerald-700">Margem bruta</p>
                <p class="mt-1 text-2xl font-bold text-emerald-700">{{ margemCalc }}%</p>
              </div>
              <div class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center">
                <p class="text-xs font-medium text-slate-600">Lucro por unidade</p>
                <p class="mt-1 text-2xl font-bold text-slate-900">
                  R$ {{ (parseFloat(form.preco || '0') - parseFloat(form.precoCusto || '0')).toFixed(2) }}
                </p>
              </div>
              <div v-if="form.precoPromocional" class="rounded-lg bg-amber-50 border border-amber-200 p-4 text-center">
                <p class="text-xs font-medium text-amber-700">Desconto aplicado</p>
                <p class="mt-1 text-2xl font-bold text-amber-700">
                  {{ (((parseFloat(form.preco || '0') - parseFloat(form.precoPromocional)) / parseFloat(form.preco || '1')) * 100).toFixed(0) }}%
                </p>
              </div>
            </div>
            <div v-else class="rounded-lg bg-slate-50 border border-slate-200 p-4 text-center text-xs text-slate-500">
              Preencha o preço de venda e o custo para ver a margem calculada
            </div>

            <div class="rounded-lg border border-slate-200 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Configurações fiscais</p>
              <div class="grid gap-4 sm:grid-cols-2">
                <UiMoleculesFormField label="NCM">
                  <UiAtomsInput placeholder="Ex: 3924.10.00" />
                </UiMoleculesFormField>
                <UiMoleculesFormField label="CEST">
                  <UiAtomsInput placeholder="Ex: 10.001.00" />
                </UiMoleculesFormField>
              </div>
            </div>
          </div>

          <!-- ===== VARIAÇÕES ===== -->
          <div v-else-if="abaAtiva === 'variacoes'" class="space-y-5">
            <div class="flex items-center gap-3 rounded-lg bg-slate-50 border border-slate-200 px-4 py-3">
              <label class="relative flex cursor-pointer items-center">
                <input v-model="form.temVariacoes" type="checkbox" class="sr-only peer" />
                <div class="h-5 w-9 rounded-full bg-slate-200 transition-colors peer-checked:bg-slate-900 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
              </label>
              <div>
                <p class="text-sm font-medium text-slate-900">Produto com variações</p>
                <p class="text-xs text-slate-500">Ative para gerenciar tamanhos, cores ou outros atributos</p>
              </div>
            </div>

            <div v-if="form.temVariacoes">
              <div class="mb-3 flex items-center justify-between">
                <p class="text-sm font-semibold text-slate-900">Variações do produto</p>
                <UiAtomsButton variant="secondary" size="sm" @click="adicionarVariacao">
                  + Adicionar variação
                </UiAtomsButton>
              </div>

              <div class="overflow-x-auto rounded-lg border border-slate-200">
                <table class="min-w-full text-sm">
                  <thead class="bg-slate-50">
                    <tr>
                      <th class="px-3 py-2 text-left text-xs font-medium text-slate-500">SKU</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-slate-500">Tamanho</th>
                      <th class="px-3 py-2 text-left text-xs font-medium text-slate-500">Cor</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-slate-500">Preço (R$)</th>
                      <th class="px-3 py-2 text-right text-xs font-medium text-slate-500">Estoque</th>
                      <th class="px-3 py-2"></th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-100">
                    <tr v-for="variacao in variacoes" :key="variacao.id">
                      <td class="px-3 py-2">
                        <input
                          v-model="variacao.sku"
                          type="text"
                          placeholder="SKU-VAR"
                          class="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-slate-900 focus:outline-none"
                        />
                      </td>
                      <td class="px-3 py-2">
                        <select v-model="variacao.tamanho" class="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-slate-900 focus:outline-none">
                          <option v-for="t in ['PP', 'P', 'M', 'G', 'GG', 'Único']" :key="t" :value="t">{{ t }}</option>
                        </select>
                      </td>
                      <td class="px-3 py-2">
                        <input
                          v-model="variacao.cor"
                          type="text"
                          placeholder="Azul"
                          class="w-full rounded border border-slate-200 px-2 py-1 text-xs focus:border-slate-900 focus:outline-none"
                        />
                      </td>
                      <td class="px-3 py-2">
                        <input
                          v-model.number="variacao.preco"
                          type="number"
                          placeholder="0.00"
                          class="w-full rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-slate-900 focus:outline-none"
                        />
                      </td>
                      <td class="px-3 py-2">
                        <input
                          v-model.number="variacao.estoque"
                          type="number"
                          placeholder="0"
                          class="w-full rounded border border-slate-200 px-2 py-1 text-right text-xs focus:border-slate-900 focus:outline-none"
                        />
                      </td>
                      <td class="px-3 py-2 text-center">
                        <button
                          type="button"
                          class="text-red-400 hover:text-red-600"
                          @click="removerVariacao(variacao.id)"
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-else class="flex flex-col items-center gap-2 rounded-lg border border-dashed border-slate-300 py-12 text-center">
              <span class="text-3xl">🎨</span>
              <p class="text-sm text-slate-500">Ative as variações acima para gerenciar tamanhos e cores</p>
            </div>
          </div>

          <!-- ===== SEO ===== -->
          <div v-else-if="abaAtiva === 'seo'" class="space-y-5">
            <div class="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
              <p class="text-xs text-blue-800">
                💡 Um bom SEO aumenta a visibilidade do produto nos buscadores. Preencha todos os campos abaixo.
              </p>
            </div>

            <UiMoleculesFormField label="Título SEO" description="Máx. 60 caracteres">
              <UiAtomsInput v-model="form.seoTitulo" placeholder="Título otimizado para buscadores" />
              <div class="mt-1 text-right text-[10px]" :class="form.seoTitulo.length > 60 ? 'text-red-500' : 'text-slate-400'">
                {{ form.seoTitulo.length }}/60
              </div>
            </UiMoleculesFormField>

            <UiMoleculesFormField label="Meta descrição" description="Máx. 160 caracteres">
              <textarea
                v-model="form.seoDescricao"
                rows="3"
                placeholder="Descrição concisa do produto para aparecer nos resultados de busca..."
                class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none"
              />
              <div class="mt-1 text-right text-[10px]" :class="form.seoDescricao.length > 160 ? 'text-red-500' : 'text-slate-400'">
                {{ form.seoDescricao.length }}/160
              </div>
            </UiMoleculesFormField>

            <UiMoleculesFormField label="URL slug">
              <div class="flex items-center overflow-hidden rounded-md border border-slate-300 bg-white">
                <span class="select-none border-r border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-500">
                  /produto/
                </span>
                <input
                  v-model="form.seoSlug"
                  type="text"
                  class="flex-1 px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  placeholder="nome-do-produto"
                />
              </div>
            </UiMoleculesFormField>

            <!-- Preview SERP -->
            <div class="rounded-xl border border-slate-200 p-4">
              <p class="mb-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Preview nos buscadores</p>
              <div class="max-w-xl">
                <p class="text-[#1a0dab] text-base hover:underline cursor-pointer">
                  {{ form.seoTitulo || 'Título do produto – TudoLeve' }}
                </p>
                <p class="text-xs text-[#006621]">
                  https://tudoleve.com.br/produto/{{ form.seoSlug || 'slug-do-produto' }}
                </p>
                <p class="mt-1 text-sm text-slate-600 line-clamp-2">
                  {{ form.seoDescricao || 'Descrição do produto. Preencha a meta descrição para customizar este texto.' }}
                </p>
              </div>
            </div>
          </div>

          <!-- ===== PUBLICAÇÃO ===== -->
          <div v-else-if="abaAtiva === 'publicacao'" class="space-y-5">
            <div class="grid gap-4 sm:grid-cols-2">
              <UiMoleculesFormField label="Status de publicação">
                <select
                  v-model="form.status"
                  class="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-slate-900 focus:outline-none"
                >
                  <option value="ativo">✅ Ativo – visível na loja</option>
                  <option value="inativo">⛔ Inativo – oculto da loja</option>
                  <option value="rascunho">📝 Rascunho – em elaboração</option>
                  <option value="arquivado">📦 Arquivado – removido do catálogo</option>
                </select>
              </UiMoleculesFormField>

              <UiMoleculesFormField label="Data de publicação">
                <UiAtomsInput type="date" :model-value="new Date().toISOString().split('T')[0]" />
              </UiMoleculesFormField>
            </div>

            <div class="rounded-lg border border-slate-200 p-4">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Canais de venda</p>
              <div class="space-y-3">
                <label class="flex cursor-pointer items-center gap-3">
                  <input v-model="canais.loja" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900" />
                  <div>
                    <p class="text-sm font-medium text-slate-800">Loja online</p>
                    <p class="text-xs text-slate-500">tudoleve.com.br</p>
                  </div>
                </label>
                <label class="flex cursor-pointer items-center gap-3">
                  <input v-model="canais.marketplace" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900" />
                  <div>
                    <p class="text-sm font-medium text-slate-800">Marketplace</p>
                    <p class="text-xs text-slate-500">Mercado Livre, Amazon, Shopee</p>
                  </div>
                </label>
                <label class="flex cursor-pointer items-center gap-3">
                  <input v-model="canais.instagram" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-slate-900" />
                  <div>
                    <p class="text-sm font-medium text-slate-800">Instagram Shopping</p>
                    <p class="text-xs text-slate-500">Produtos vinculados ao Instagram</p>
                  </div>
                </label>
              </div>
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
              <UiMoleculesFormField label="Estoque atual">
                <UiAtomsInput v-model="form.estoque" type="number" placeholder="0" />
              </UiMoleculesFormField>
              <UiMoleculesFormField label="Estoque mínimo (alerta)">
                <UiAtomsInput v-model="form.estoqueMinimo" type="number" placeholder="5" />
              </UiMoleculesFormField>
            </div>
          </div>

        </div>
      </div>

      <!-- Sidebar direita -->
      <div class="space-y-4">

        <!-- Status do produto -->
        <UiAtomsCard padded>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Status rápido</p>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-600">Publicação</span>
              <span
                class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                :class="{
                  'bg-emerald-100 text-emerald-800': form.status === 'ativo',
                  'bg-amber-100 text-amber-800': form.status === 'rascunho',
                  'bg-slate-100 text-slate-700': form.status === 'inativo',
                  'bg-red-100 text-red-800': form.status === 'arquivado',
                }"
              >
                {{ { ativo: 'Ativo', inativo: 'Inativo', rascunho: 'Rascunho', arquivado: 'Arquivado' }[form.status] }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs text-slate-600">Estoque</span>
              <span
                class="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                :class="parseInt(form.estoque) === 0 ? 'bg-red-100 text-red-800' : parseInt(form.estoque) <= parseInt(form.estoqueMinimo) ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'"
              >
                {{ parseInt(form.estoque) === 0 ? 'Sem estoque' : `${form.estoque} un.` }}
              </span>
            </div>
            <div v-if="form.preco" class="flex items-center justify-between">
              <span class="text-xs text-slate-600">Preço</span>
              <span class="text-xs font-semibold text-slate-900">R$ {{ parseFloat(form.preco).toFixed(2).replace('.', ',') }}</span>
            </div>
            <div v-if="margemCalc" class="flex items-center justify-between">
              <span class="text-xs text-slate-600">Margem</span>
              <span class="text-xs font-semibold text-emerald-700">{{ margemCalc }}%</span>
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <UiAtomsButton
              variant="primary"
              size="sm"
              :full-width="true"
              :loading="salvando"
              @click="salvar"
            >
              {{ salvoComSucesso ? '✓ Salvo!' : isEdicao ? 'Salvar alterações' : 'Publicar' }}
            </UiAtomsButton>
            <UiAtomsButton variant="ghost" size="sm" :full-width="true" @click="voltar">
              Cancelar
            </UiAtomsButton>
          </div>
        </UiAtomsCard>

        <!-- Produto original (em edição) -->
        <UiAtomsCard v-if="isEdicao && produtoOriginal" padded>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Informações originais</p>
          <div class="space-y-2 text-xs text-slate-600">
            <div class="flex items-center justify-between">
              <span>SKU</span>
              <span class="font-mono font-semibold text-slate-900">{{ produtoOriginal.sku }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Vendas</span>
              <span class="font-semibold text-slate-900">{{ produtoOriginal.vendas }} unid.</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Criado em</span>
              <span>{{ produtoOriginal.criadoEm }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span>Atualizado</span>
              <span>{{ produtoOriginal.atualizadoEm }}</span>
            </div>
          </div>
        </UiAtomsCard>

        <!-- Completude do produto -->
        <UiAtomsCard padded>
          <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Completude</p>
          <div class="space-y-2">
            <div
              v-for="item in [
                { label: 'Nome', ok: !!form.nome },
                { label: 'Descrição', ok: form.descricao.length > 20 },
                { label: 'Categoria', ok: !!form.categoria },
                { label: 'Imagem', ok: !!imagemPrincipal },
                { label: 'Preço', ok: !!form.preco },
                { label: 'SEO', ok: !!form.seoTitulo && !!form.seoDescricao },
              ]"
              :key="item.label"
              class="flex items-center justify-between"
            >
              <span class="text-xs text-slate-600">{{ item.label }}</span>
              <span :class="item.ok ? 'text-emerald-600' : 'text-slate-300'">{{ item.ok ? '✓' : '○' }}</span>
            </div>
          </div>
          <div class="mt-3">
            <div class="h-1.5 w-full rounded-full bg-slate-100">
              <div
                class="h-1.5 rounded-full bg-emerald-500 transition-all"
                :style="`width: ${([!!form.nome, form.descricao.length > 20, !!form.categoria, !!imagemPrincipal, !!form.preco, !!form.seoTitulo && !!form.seoDescricao].filter(Boolean).length / 6) * 100}%`"
              />
            </div>
            <p class="mt-1 text-right text-[10px] text-slate-500">
              {{ [!!form.nome, form.descricao.length > 20, !!form.categoria, !!imagemPrincipal, !!form.preco, !!form.seoTitulo && !!form.seoDescricao].filter(Boolean).length }}/6 completos
            </p>
          </div>
        </UiAtomsCard>

      </div>
    </div>

  </section>
</template>
