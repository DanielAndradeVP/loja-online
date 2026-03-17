<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '~/stores/dashboard'

const dashboardStore = useDashboardStore()
const { summary, loading, error, period } = storeToRefs(dashboardStore)

const periodOptions = [
  { label: 'Hoje', value: 'today' },
  { label: 'Últimos 7 dias', value: '7d' },
  { label: 'Últimos 30 dias', value: '30d' },
  { label: 'Últimos 90 dias', value: '90d' }
]

onMounted(() => {
  dashboardStore.fetch()
})

const handleChangePeriod = (value: string | number | null) => {
  if (!value) return
  dashboardStore.setPeriod(value as any)
  dashboardStore.fetch()
}
</script>

<template>
  <section class="space-y-4">
    <UiMoleculesCardSection
      title="Visão geral"
      description="Acompanhe os principais indicadores da TudoLeve."
    >
      <template #actions>
        <UiMoleculesSelect
          :model-value="period"
          :options="periodOptions"
          placeholder="Período"
          @update:model-value="handleChangePeriod"
        />
      </template>
    </UiMoleculesCardSection>

    <div
      v-if="error"
      class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
    >
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <UiMoleculesDashboardCard
        v-for="i in 4"
        :key="i"
        label="Carregando..."
        value="–"
      />
    </div>

    <div
      v-else
      class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <UiMoleculesDashboardCard
        label="Pedidos"
        :value="summary?.total_orders ?? 0"
      />
      <UiMoleculesDashboardCard
        label="Faturamento"
        :value="summary?.total_revenue ?? 0"
      />
      <UiMoleculesDashboardCard
        label="Clientes"
        :value="summary?.total_customers ?? 0"
      />
      <UiMoleculesDashboardCard
        label="Produtos ativos"
        :value="summary?.total_products ?? 0"
      />
    </div>
  </section>
</template>

