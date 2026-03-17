<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from '#imports'
import { useProdutosDetailStore } from '~/stores/produtosDetail'
import { useFormatters } from '~/composables/useFormatters'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const route = useRoute()
const router = useRouter()
const detailStore = useProdutosDetailStore()
const { item, loading, error } = storeToRefs(detailStore)
const { formatCurrencyBRL, formatDateTime } = useFormatters()

onMounted(() => {
  if (route.params.id) {
    detailStore.fetch(route.params.id as string)
  }
})

const goBack = () => {
  router.push('/admin/produtos')
}

const goToEdit = () => {
  if (!route.params.id) return
  router.push(`/admin/produtos/${route.params.id}/edit`)
}
</script>

<template>
  <section class="space-y-4">
    <UiMoleculesCardSection
      title="Produto"
      description="Detalhes do produto selecionado."
    >
      <template #actions>
        <UiAtomsButton
          size="sm"
          variant="secondary"
          @click="goBack"
        >
          Voltar
        </UiAtomsButton>
        <UiAtomsButton
          size="sm"
          @click="goToEdit"
        >
          Editar
        </UiAtomsButton>
      </template>
    </UiMoleculesCardSection>

    <UiAtomsCard>
      <div
        v-if="loading"
        class="py-6 text-sm text-slate-500"
      >
        Carregando produto...
      </div>
      <div
        v-else-if="error"
        class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"
      >
        {{ error }}
      </div>
      <div
        v-else-if="item"
        class="space-y-4 text-sm"
      >
        <div class="flex items-center justify-between gap-4">
          <div>
            <UiAtomsTypography variant="h2">
              {{ item.name }}
            </UiAtomsTypography>
            <UiAtomsTypography
              v-if="item.sku"
              variant="caption"
              muted
            >
              SKU: {{ item.sku }}
            </UiAtomsTypography>
          </div>
          <UiAtomsBadge :variant="item.active ? 'success' : 'outline'">
            {{ item.active ? 'Ativo' : 'Inativo' }}
          </UiAtomsBadge>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <UiAtomsTypography variant="caption" muted>
              Preço
            </UiAtomsTypography>
            <UiAtomsTypography variant="body">
              {{ formatCurrencyBRL(item.price) }}
            </UiAtomsTypography>
          </div>

          <div>
            <UiAtomsTypography variant="caption" muted>
              Criado em
            </UiAtomsTypography>
            <UiAtomsTypography variant="body">
              {{ formatDateTime(item.created_at) || '-' }}
            </UiAtomsTypography>
          </div>
        </div>
      </div>
      <div
        v-else
        class="py-6 text-sm text-slate-500"
      >
        Produto não encontrado.
      </div>
    </UiAtomsCard>
  </section>
</template>

