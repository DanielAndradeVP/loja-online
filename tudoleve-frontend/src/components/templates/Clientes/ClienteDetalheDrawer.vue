<script setup lang="ts">
import { type Cliente, statusConfig, formatCurrency, getIniciais } from '~/mocks/clientes'

const props = defineProps<{
  modelValue: boolean
  cliente: Cliente | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'bloquear', cliente: Cliente): void
  (e: 'desbloquear', cliente: Cliente): void
}>()

const close = () => emit('update:modelValue', false)

const pedidoStatusBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'outline' | 'danger' | 'default' }> = {
  aprovado:     { label: 'Aprovado',     variant: 'success' },
  enviado:      { label: 'Enviado',      variant: 'outline' },
  entregue:     { label: 'Entregue',     variant: 'success' },
  pendente:     { label: 'Pendente',     variant: 'warning' },
  cancelado:    { label: 'Cancelado',    variant: 'danger' },
  em_separacao: { label: 'Em separação', variant: 'default' },
}

const observacoesEditadas = ref(props.cliente?.observacoes ?? '')
const editandoObs = ref(false)
const salvandoObs = ref(false)

watch(() => props.cliente, (c) => {
  observacoesEditadas.value = c?.observacoes ?? ''
  editandoObs.value = false
})

async function salvarObservacoes() {
  salvandoObs.value = true
  await new Promise(r => setTimeout(r, 600))
  salvandoObs.value = false
  editandoObs.value = false
}

function handleBloquear() {
  if (props.cliente) emit('bloquear', props.cliente)
}

function handleDesbloquear() {
  if (props.cliente) emit('desbloquear', props.cliente)
}
</script>

<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="modelValue" class="fixed inset-0 z-40 bg-black/40" @click.self="close" />
    </transition>

    <transition name="slide-right">
      <aside
        v-if="modelValue && cliente"
        class="fixed inset-y-0 right-0 z-50 flex w-full flex-col bg-white shadow-2xl sm:max-w-lg"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div class="flex items-center gap-3">
            <div
              :class="[
                'flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-sm font-bold text-white',
                cliente.avatarCor
              ]"
            >
              {{ getIniciais(cliente.nome) }}
            </div>
            <div>
              <h2 class="text-base font-bold text-slate-900">{{ cliente.nome }}</h2>
              <p class="text-xs text-slate-500">Cliente desde {{ cliente.dataCadastro }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UiAtomsBadge :variant="statusConfig[cliente.status].variant">
              {{ statusConfig[cliente.status].label }}
            </UiAtomsBadge>
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
              @click="close"
            >✕</button>
          </div>
        </div>

        <!-- Corpo scrollável -->
        <div class="flex-1 overflow-y-auto">

          <!-- Mini KPIs -->
          <div class="grid grid-cols-4 divide-x divide-slate-100 border-b border-slate-100">
            <div class="px-3 py-3 text-center">
              <p class="text-xl font-bold text-slate-900">{{ cliente.totalPedidos }}</p>
              <p class="text-[10px] text-slate-500">Pedidos</p>
            </div>
            <div class="px-3 py-3 text-center">
              <p class="text-sm font-bold text-slate-900">{{ formatCurrency(cliente.totalGasto) }}</p>
              <p class="text-[10px] text-slate-500">Total gasto</p>
            </div>
            <div class="px-3 py-3 text-center">
              <p class="text-sm font-bold text-slate-900">{{ formatCurrency(cliente.ticketMedio) }}</p>
              <p class="text-[10px] text-slate-500">Ticket médio</p>
            </div>
            <div class="px-3 py-3 text-center">
              <p class="text-sm font-bold" :class="cliente.recorrente ? 'text-emerald-700' : 'text-slate-500'">
                {{ cliente.recorrente ? 'Sim' : 'Não' }}
              </p>
              <p class="text-[10px] text-slate-500">Recorrente</p>
            </div>
          </div>

          <!-- Dados cadastrais -->
          <div class="border-b border-slate-100 px-5 py-4">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Dados cadastrais</p>
            <div class="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <div>
                <p class="text-xs text-slate-400">E-mail</p>
                <p class="break-all text-xs font-medium text-slate-900">{{ cliente.email }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400">Telefone</p>
                <p class="text-xs font-medium text-slate-900">{{ cliente.telefone }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400">CPF</p>
                <p class="font-mono text-xs font-medium text-slate-900">{{ cliente.cpf }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-400">Último acesso</p>
                <p class="text-xs font-medium text-slate-900">{{ cliente.ultimoAcesso }}</p>
              </div>
            </div>
          </div>

          <!-- Endereço -->
          <div class="border-b border-slate-100 px-5 py-4">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Endereço principal</p>
            <div class="rounded-lg bg-slate-50 px-4 py-3 text-xs text-slate-700 leading-relaxed">
              <p class="font-medium">{{ cliente.endereco.logradouro }}, {{ cliente.endereco.numero }}
                <span v-if="cliente.endereco.complemento"> – {{ cliente.endereco.complemento }}</span>
              </p>
              <p>{{ cliente.endereco.bairro }}</p>
              <p>{{ cliente.endereco.cidade }} / {{ cliente.endereco.estado }} – {{ cliente.endereco.cep }}</p>
            </div>
          </div>

          <!-- Histórico de pedidos -->
          <div class="border-b border-slate-100 px-5 py-4">
            <div class="mb-3 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Histórico de pedidos</p>
              <span class="text-[10px] text-slate-400">{{ cliente.pedidos.length }} pedidos</span>
            </div>

            <div v-if="cliente.pedidos.length === 0" class="py-4 text-center text-xs text-slate-400">
              Nenhum pedido encontrado.
            </div>

            <div v-else class="space-y-2">
              <div
                v-for="pedido in cliente.pedidos"
                :key="pedido.numero"
                class="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div class="flex items-center gap-3">
                  <span class="font-mono text-xs font-bold text-slate-900">{{ pedido.numero }}</span>
                  <span class="text-[10px] text-slate-400">{{ pedido.data }}</span>
                </div>
                <div class="flex items-center gap-3">
                  <UiAtomsBadge :variant="pedidoStatusBadge[pedido.status]?.variant ?? 'default'">
                    {{ pedidoStatusBadge[pedido.status]?.label ?? pedido.status }}
                  </UiAtomsBadge>
                  <span class="text-xs font-semibold text-slate-900">{{ formatCurrency(pedido.total) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Observações -->
          <div class="px-5 py-4">
            <div class="mb-2 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Observações internas</p>
              <button
                v-if="!editandoObs"
                type="button"
                class="text-xs text-slate-500 underline hover:text-slate-900"
                @click="editandoObs = true"
              >Editar</button>
            </div>

            <div v-if="!editandoObs" class="min-h-[48px] rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-700">
              {{ cliente.observacoes || 'Nenhuma observação registrada.' }}
            </div>

            <div v-else class="space-y-2">
              <textarea
                v-model="observacoesEditadas"
                rows="3"
                class="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-slate-900 focus:outline-none"
                placeholder="Adicione observações internas sobre este cliente..."
              />
              <div class="flex justify-end gap-2">
                <UiAtomsButton variant="ghost" size="sm" @click="editandoObs = false">Cancelar</UiAtomsButton>
                <UiAtomsButton size="sm" :loading="salvandoObs" @click="salvarObservacoes">Salvar</UiAtomsButton>
              </div>
            </div>
          </div>

        </div>

        <!-- Ações fixas -->
        <div class="flex flex-wrap gap-2 border-t border-slate-200 bg-white px-5 py-3">
          <UiAtomsButton variant="secondary" size="sm" @click="() => {}">
            ✏️ Editar dados
          </UiAtomsButton>
          <NuxtLink to="/admin/pedidos">
            <UiAtomsButton variant="secondary" size="sm">
              📦 Ver pedidos
            </UiAtomsButton>
          </NuxtLink>
          <UiAtomsButton
            v-if="cliente.status !== 'bloqueado'"
            variant="danger"
            size="sm"
            @click="handleBloquear"
          >
            🚫 Bloquear
          </UiAtomsButton>
          <UiAtomsButton
            v-else
            variant="secondary"
            size="sm"
            @click="handleDesbloquear"
          >
            ✅ Desbloquear
          </UiAtomsButton>
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
