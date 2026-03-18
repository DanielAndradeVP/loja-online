<script setup lang="ts">
import { type ItemEstoque } from '~/mocks/estoque'

const props = defineProps<{
  modelValue: boolean
  item: ItemEstoque | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'ajustar', sku: string, tipo: string, quantidade: number, motivo: string): void
}>()

const close = () => emit('update:modelValue', false)

const tipo = ref<'entrada' | 'saida' | 'ajuste'>('entrada')
const quantidade = ref<number | null>(null)
const motivo = ref('')
const salvando = ref(false)
const erro = ref('')

const saldoPrevisto = computed(() => {
  if (!props.item || !quantidade.value) return props.item?.saldoAtual ?? 0
  const q = quantidade.value
  if (tipo.value === 'entrada') return props.item.saldoAtual + q
  if (tipo.value === 'saida') return props.item.saldoAtual - q
  return props.item.saldoAtual + q
})

const tipoLabels = {
  entrada: { label: 'Entrada de estoque', cor: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  saida: { label: 'Saída de estoque', cor: 'text-red-700', bg: 'bg-red-50 border-red-200' },
  ajuste: { label: 'Ajuste manual', cor: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
}

async function confirmar() {
  erro.value = ''
  if (!quantidade.value || quantidade.value <= 0) {
    erro.value = 'Informe uma quantidade válida maior que zero.'
    return
  }
  if (!motivo.value.trim()) {
    erro.value = 'Informe o motivo do ajuste.'
    return
  }
  if (tipo.value === 'saida' && props.item && quantidade.value > props.item.saldoAtual) {
    erro.value = 'Quantidade maior que o saldo atual disponível.'
    return
  }

  salvando.value = true
  await new Promise(r => setTimeout(r, 800))
  salvando.value = false

  emit('ajustar', props.item!.sku, tipo.value, quantidade.value, motivo.value)
  close()
}

watch(() => props.modelValue, (v) => {
  if (!v) {
    tipo.value = 'entrada'
    quantidade.value = null
    motivo.value = ''
    erro.value = ''
  }
})
</script>

<template>
  <UiMoleculesModal
    :model-value="modelValue"
    title="Ajuste de estoque"
    size="md"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-if="!item" class="py-4 text-center text-sm text-slate-500">Nenhum item selecionado.</div>

    <div v-else class="space-y-4">
      <!-- Info do produto -->
      <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
        <p class="text-sm font-semibold text-slate-900">{{ item.produto }}</p>
        <div class="mt-1 flex items-center gap-4 text-xs text-slate-500">
          <span>SKU: <span class="font-mono font-semibold text-slate-700">{{ item.sku }}</span></span>
          <span>Saldo atual: <span class="font-semibold text-slate-700">{{ item.saldoAtual }} un.</span></span>
          <span>Mínimo: <span class="font-semibold text-slate-700">{{ item.minimo }} un.</span></span>
        </div>
      </div>

      <!-- Tipo de movimentação -->
      <div>
        <p class="mb-2 text-xs font-medium text-slate-600">Tipo de movimentação</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="(cfg, key) in tipoLabels"
            :key="key"
            type="button"
            :class="[
              'rounded-lg border px-3 py-2.5 text-xs font-medium transition-all',
              tipo === key
                ? `${cfg.bg} ${cfg.cor} border-current`
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            ]"
            @click="tipo = key as 'entrada' | 'saida' | 'ajuste'"
          >
            {{ cfg.label }}
          </button>
        </div>
      </div>

      <!-- Quantidade -->
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600">
          Quantidade
          <span v-if="tipo === 'ajuste'" class="text-slate-400">(positivo = entrada, negativo = saída)</span>
        </label>
        <input
          v-model.number="quantidade"
          type="number"
          placeholder="Ex: 10"
          class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />
      </div>

      <!-- Preview de saldo -->
      <div
        v-if="quantidade && quantidade !== 0"
        class="flex items-center justify-between rounded-lg bg-slate-50 border border-slate-200 px-4 py-2.5"
      >
        <div class="text-center">
          <p class="text-xs text-slate-500">Saldo atual</p>
          <p class="text-lg font-bold text-slate-900">{{ item.saldoAtual }}</p>
        </div>
        <span class="text-2xl text-slate-400">→</span>
        <div class="text-center">
          <p class="text-xs text-slate-500">Saldo previsto</p>
          <p
            class="text-lg font-bold"
            :class="saldoPrevisto < item.minimo ? 'text-red-700' : 'text-emerald-700'"
          >
            {{ saldoPrevisto }}
          </p>
        </div>
        <div class="text-center">
          <p class="text-xs text-slate-500">Variação</p>
          <p
            class="text-lg font-bold"
            :class="{
              'text-emerald-700': tipo === 'entrada' || (tipo === 'ajuste' && (quantidade ?? 0) > 0),
              'text-red-700': tipo === 'saida' || (tipo === 'ajuste' && (quantidade ?? 0) < 0),
            }"
          >
            {{ tipo === 'saida' ? `-${quantidade}` : `+${Math.abs(quantidade ?? 0)}` }}
          </p>
        </div>
      </div>

      <!-- Motivo -->
      <div>
        <label class="mb-1 block text-xs font-medium text-slate-600">Motivo <span class="text-red-500">*</span></label>
        <textarea
          v-model="motivo"
          rows="2"
          placeholder="Ex: Reposição de estoque, avaria, inventário..."
          class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-slate-900 focus:outline-none"
        />
      </div>

      <!-- Erro -->
      <div v-if="erro" class="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
        {{ erro }}
      </div>
    </div>

    <template #footer>
      <UiAtomsButton variant="secondary" size="sm" @click="close">Cancelar</UiAtomsButton>
      <UiAtomsButton
        variant="primary"
        size="sm"
        :loading="salvando"
        :disabled="!item"
        @click="confirmar"
      >
        Confirmar ajuste
      </UiAtomsButton>
    </template>
  </UiMoleculesModal>
</template>
