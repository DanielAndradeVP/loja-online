<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRastreioStore } from '~/stores/rastreio'

const store = useRastreioStore()
const { result, status, error, code } = storeToRefs(store)

const inputCode = ref('')

const handleConsultar = async () => {
  await store.consultar(inputCode.value)
}

const handleReset = () => {
  store.reset()
  inputCode.value = ''
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') handleConsultar()
}

const statusIcon: Record<string, string> = {
  postado: '📦',
  em_transito: '🚚',
  saiu_para_entrega: '🛵',
  entregue: '✅',
  tentativa_entrega: '🔔',
  devolvido: '↩️',
  aguardando: '⏳'
}

const getStatusIcon = (s: string) => statusIcon[s] ?? '📍'
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-12 space-y-10">
    <!-- Header -->
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-semibold text-slate-900">
        Rastrear pedido
      </h1>
      <p class="text-sm text-slate-500">
        Informe o código de rastreio para acompanhar a entrega do seu pedido.
      </p>
    </div>

    <!-- Truck animation -->
    <div class="h-24 flex items-end">
      <OrganismsRastreio-caminhao-visual :status="status" class="w-full" />
    </div>

    <!-- Search box -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
      <div class="flex gap-2">
        <div class="flex-1">
          <label for="rastreio-code" class="block text-xs font-medium text-slate-600 mb-1">
            Código de rastreio
          </label>
          <input
            id="rastreio-code"
            v-model="inputCode"
            type="text"
            placeholder="Ex.: BR123456789BR"
            class="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
            :disabled="status === 'loading'"
            @keydown="handleKeydown"
          >
        </div>
        <div class="flex items-end">
          <UiAtomsButton
            variant="primary"
            size="md"
            :loading="status === 'loading'"
            :disabled="!inputCode.trim()"
            @click="handleConsultar"
          >
            Consultar
          </UiAtomsButton>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-if="status === 'error' && error"
        class="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2"
      >
        <span class="text-red-500 mt-0.5">⚠️</span>
        <div class="flex-1">
          <p class="text-xs font-medium text-red-700">
            {{ error }}
          </p>
        </div>
        <button
          class="text-xs text-red-500 underline hover:no-underline"
          @click="handleReset"
        >
          Limpar
        </button>
      </div>
    </div>

    <!-- Success: tracking result -->
    <div
      v-if="status === 'success' && result"
      class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
    >
      <!-- Result header -->
      <div class="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div>
          <p class="text-xs text-slate-400 uppercase tracking-wide font-medium">
            Código
          </p>
          <p class="text-lg font-mono font-semibold mt-0.5">
            {{ result.code }}
          </p>
        </div>
        <div class="text-right">
          <p class="text-xs text-slate-400 uppercase tracking-wide font-medium">
            Situação
          </p>
          <p class="text-sm font-medium mt-0.5 text-emerald-400">
            {{ result.status_label }}
          </p>
        </div>
      </div>

      <!-- Metadata -->
      <div class="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100">
        <div class="px-6 py-3">
          <p class="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
            Última atualização
          </p>
          <p class="text-sm font-medium text-slate-700 mt-0.5">
            {{ result.last_update }}
          </p>
        </div>
        <div v-if="result.estimated_delivery" class="px-6 py-3">
          <p class="text-[10px] text-slate-400 uppercase tracking-wide font-medium">
            Previsão de entrega
          </p>
          <p class="text-sm font-medium text-slate-700 mt-0.5">
            {{ result.estimated_delivery }}
          </p>
        </div>
      </div>

      <!-- Events timeline -->
      <div class="px-6 py-4 space-y-0">
        <h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Histórico
        </h3>
        <ol class="relative border-l border-slate-200 space-y-4 ml-2">
          <li
            v-for="(event, i) in result.events"
            :key="i"
            class="ml-5 relative"
          >
            <!-- Timeline dot -->
            <span class="absolute -left-[1.625rem] flex h-4 w-4 items-center justify-center rounded-full bg-white border border-slate-300 text-[10px]">
              {{ getStatusIcon(result.status) }}
            </span>
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm text-slate-700">
                {{ event.description }}
              </p>
              <time class="shrink-0 text-[10px] text-slate-400 whitespace-nowrap">
                {{ event.date }}
              </time>
            </div>
            <p
              v-if="event.location"
              class="text-[10px] text-slate-400 mt-0.5"
            >
              📍 {{ event.location }}
            </p>
          </li>
        </ol>
      </div>

      <!-- Reset action -->
      <div class="px-6 pb-5 pt-2">
        <UiAtomsButton variant="secondary" size="sm" @click="handleReset">
          Consultar outro código
        </UiAtomsButton>
      </div>
    </div>

    <!-- Tip -->
    <p class="text-center text-xs text-slate-400">
      Seu código de rastreio está no e-mail de confirmação do pedido.
    </p>
  </section>
</template>
