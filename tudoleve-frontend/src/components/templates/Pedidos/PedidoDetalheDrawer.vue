<script setup lang="ts">
import { type Pedido, statusConfig, pagamentoConfig } from '~/mocks/pedidos'

const props = defineProps<{
  modelValue: boolean
  pedido: Pedido | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'atualizarStatus', pedido: Pedido): void
}>()

const close = () => emit('update:modelValue', false)

function formatCurrency(centavos: number) {
  return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const statusAtualizar = ref<string>('')

const statusOpcoes = [
  { label: 'Pendente', value: 'pendente' },
  { label: 'Aprovado', value: 'aprovado' },
  { label: 'Em separação', value: 'em_separacao' },
  { label: 'Enviado', value: 'enviado' },
  { label: 'Entregue', value: 'entregue' },
  { label: 'Cancelado', value: 'cancelado' },
]

const mostrarAtualizarStatus = ref(false)

function handleAtualizarStatus() {
  if (props.pedido && statusAtualizar.value) {
    emit('atualizarStatus', { ...props.pedido, status: statusAtualizar.value as any })
    mostrarAtualizarStatus.value = false
  }
}

watch(() => props.modelValue, (v) => {
  if (!v) {
    statusAtualizar.value = ''
    mostrarAtualizarStatus.value = false
  }
})
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-40 bg-black/40"
        @click.self="close"
      />
    </transition>
    <transition name="slide-right">
      <aside
        v-if="modelValue && pedido"
        class="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:max-w-lg"
      >
        <!-- Header do drawer -->
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p class="text-xs text-slate-500">Detalhes do pedido</p>
            <h2 class="text-lg font-bold text-slate-900">{{ pedido.numero }}</h2>
          </div>
          <div class="flex items-center gap-2">
            <UiAtomsBadge :variant="statusConfig[pedido.status].variant">
              {{ statusConfig[pedido.status].label }}
            </UiAtomsBadge>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              @click="close"
            >
              ✕
            </button>
          </div>
        </div>

        <!-- Conteúdo scrollável -->
        <div class="flex-1 overflow-y-auto">

          <!-- Info do cliente e pedido -->
          <div class="border-b border-slate-100 px-5 py-4">
            <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p class="text-xs text-slate-500">Cliente</p>
                <p class="font-medium text-slate-900">{{ pedido.cliente }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Data</p>
                <p class="font-medium text-slate-900">{{ pedido.data }} às {{ pedido.hora }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">E-mail</p>
                <p class="font-medium text-slate-900 text-xs break-all">{{ pedido.email }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Telefone</p>
                <p class="font-medium text-slate-900">{{ pedido.telefone }}</p>
              </div>
              <div class="col-span-2">
                <p class="text-xs text-slate-500">Endereço de entrega</p>
                <p class="font-medium text-slate-900 text-xs leading-relaxed">{{ pedido.endereco }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">Forma de pagamento</p>
                <p class="font-medium text-slate-900">{{ pagamentoConfig[pedido.formaPagamento] }}</p>
              </div>
              <div v-if="pedido.codigoRastreio">
                <p class="text-xs text-slate-500">Código de rastreio</p>
                <p class="font-mono text-xs font-semibold text-blue-700">{{ pedido.codigoRastreio }}</p>
              </div>
            </div>

            <div v-if="pedido.observacao" class="mt-3 rounded-lg bg-amber-50 border border-amber-100 px-3 py-2">
              <p class="text-xs font-medium text-amber-800">⚠️ Observação</p>
              <p class="mt-0.5 text-xs text-amber-700">{{ pedido.observacao }}</p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="border-b border-slate-100 px-5 py-4">
            <p class="mb-4 text-sm font-semibold text-slate-900">Histórico do pedido</p>
            <ol class="relative space-y-0">
              <li
                v-for="(evento, i) in pedido.timeline"
                :key="i"
                class="relative flex gap-4 pb-5 last:pb-0"
              >
                <!-- Linha vertical (não mostrar no último) -->
                <div
                  v-if="i < pedido.timeline.length - 1"
                  class="absolute left-[11px] top-6 w-0.5 h-full"
                  :class="evento.concluido ? 'bg-slate-300' : 'bg-slate-100'"
                />
                <!-- Dot -->
                <div
                  class="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2"
                  :class="{
                    'border-emerald-500 bg-emerald-500 text-white': evento.concluido && !evento.atual && pedido.status !== 'cancelado',
                    'border-slate-900 bg-slate-900 text-white': evento.atual && pedido.status !== 'cancelado',
                    'border-red-500 bg-red-500 text-white': evento.atual && pedido.status === 'cancelado',
                    'border-red-400 bg-red-50 text-red-500': evento.concluido && pedido.status === 'cancelado' && !evento.atual,
                    'border-slate-200 bg-white text-slate-400': !evento.concluido,
                  }"
                >
                  <span class="text-[10px] font-bold leading-none">
                    {{ evento.concluido ? '✓' : '○' }}
                  </span>
                </div>
                <!-- Conteúdo -->
                <div class="flex-1 pt-0.5">
                  <p
                    class="text-xs font-semibold"
                    :class="{
                      'text-slate-900': evento.atual || evento.concluido,
                      'text-slate-400': !evento.concluido,
                    }"
                  >
                    {{ evento.status }}
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ evento.descricao }}</p>
                  <p v-if="evento.concluido" class="mt-1 text-[10px] text-slate-400">
                    {{ evento.data }} às {{ evento.hora }}
                  </p>
                </div>
              </li>
            </ol>
          </div>

          <!-- Itens do pedido -->
          <div class="border-b border-slate-100 px-5 py-4">
            <p class="mb-3 text-sm font-semibold text-slate-900">Itens do pedido</p>
            <div class="space-y-2.5">
              <div
                v-for="item in pedido.items"
                :key="item.sku"
                class="flex items-start justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2.5"
              >
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-medium text-slate-900">{{ item.produto }}</p>
                  <p class="mt-0.5 text-[10px] text-slate-400">SKU: {{ item.sku }}</p>
                </div>
                <div class="text-right shrink-0">
                  <p class="text-xs text-slate-600">{{ item.quantidade }}× {{ formatCurrency(item.precoUnitario) }}</p>
                  <p class="text-xs font-semibold text-slate-900">{{ formatCurrency(item.total) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Resumo financeiro -->
          <div class="border-b border-slate-100 px-5 py-4">
            <p class="mb-3 text-sm font-semibold text-slate-900">Resumo financeiro</p>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span>{{ formatCurrency(pedido.subtotal) }}</span>
              </div>
              <div class="flex justify-between text-slate-700">
                <span>Frete</span>
                <span :class="pedido.frete === 0 ? 'text-emerald-600 font-medium' : ''">
                  {{ pedido.frete === 0 ? 'Grátis' : formatCurrency(pedido.frete) }}
                </span>
              </div>
              <div v-if="pedido.desconto > 0" class="flex justify-between text-emerald-700">
                <span>Desconto</span>
                <span>– {{ formatCurrency(pedido.desconto) }}</span>
              </div>
              <div class="flex justify-between border-t border-slate-200 pt-2 text-base font-bold text-slate-900">
                <span>Total</span>
                <span>{{ formatCurrency(pedido.total) }}</span>
              </div>
            </div>
          </div>

          <!-- Atualizar status (inline) -->
          <div v-if="mostrarAtualizarStatus" class="border-b border-slate-100 bg-slate-50 px-5 py-4">
            <p class="mb-2 text-sm font-semibold text-slate-900">Atualizar status do pedido</p>
            <div class="flex items-center gap-2">
              <select
                v-model="statusAtualizar"
                class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="">Selecionar novo status...</option>
                <option
                  v-for="opt in statusOpcoes"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </option>
              </select>
              <UiAtomsButton size="sm" :disabled="!statusAtualizar" @click="handleAtualizarStatus">
                Salvar
              </UiAtomsButton>
              <UiAtomsButton variant="ghost" size="sm" @click="mostrarAtualizarStatus = false">
                ✕
              </UiAtomsButton>
            </div>
          </div>

        </div>

        <!-- Ações fixas no rodapé -->
        <div class="border-t border-slate-200 bg-white px-5 py-3">
          <div class="flex flex-wrap gap-2">
            <UiAtomsButton
              variant="primary"
              size="sm"
              @click="mostrarAtualizarStatus = !mostrarAtualizarStatus"
            >
              ✏️ Atualizar status
            </UiAtomsButton>
            <UiAtomsButton variant="secondary" size="sm" @click="() => {}">
              🖨️ Imprimir
            </UiAtomsButton>
            <UiAtomsButton
              variant="danger"
              size="sm"
              :disabled="pedido.status === 'cancelado' || pedido.status === 'entregue'"
              @click="() => {}"
            >
              ✕ Cancelar
            </UiAtomsButton>
          </div>
        </div>
      </aside>
    </transition>
  </Teleport>
</template>

<style scoped>
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
