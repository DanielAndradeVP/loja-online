<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useProdutosListStore } from '~/stores/produtosList'
import { useProdutosDeleteStore } from '~/stores/produtosDelete'
import type { DataTableColumn } from '~/components/ui/organisms/DataTable.vue'
import { useFormatters } from '~/composables/useFormatters'

const listStore = useProdutosListStore()
const deleteStore = useProdutosDeleteStore()

const { items, pagination, loading, error } = storeToRefs(listStore)
const { target, confirming, loading: deleting, error: deleteError } = storeToRefs(deleteStore)

const { formatCurrencyBRL } = useFormatters()

const columns: DataTableColumn[] = [
  { key: 'name', label: 'Produto' },
  { key: 'sku', label: 'SKU' },
  { key: 'price', label: 'Preço', align: 'right' },
  { key: 'active', label: 'Status' }
]

const router = useRouter()

onMounted(() => {
  listStore.fetch()
})

const handleSearch = (term: string) => {
  listStore.setSearch(term)
  listStore.fetch(1)
}

const handleChangePage = (page: number) => {
  listStore.fetch(page)
}

const handleNew = () => {
  router.push('/admin/produtos/create')
}

const handleView = (row: any) => {
  router.push(`/admin/produtos/${row.id}`)
}

const handleEdit = (row: any) => {
  router.push(`/admin/produtos/${row.id}/edit`)
}

const confirmDelete = (row: any) => {
  deleteStore.confirm(row)
}

const performDelete = async () => {
  await deleteStore.perform()
  if (deleteStore.success) {
    listStore.fetch(pagination.value.current_page)
  }
}
</script>

<template>
  <section class="space-y-4">
    <UiMoleculesCardSection
      title="Produtos"
      description="Gerencie o catálogo de produtos da loja."
    >
      <template #actions>
        <UiAtomsButton
          size="sm"
          variant="primary"
          @click="handleNew"
        >
          Novo produto
        </UiAtomsButton>
      </template>
    </UiMoleculesCardSection>

    <UiOrganismsDataTable
      :columns="columns"
      :rows="items"
      :loading="loading"
      :error="error"
      :total-items="pagination.total"
      :page="pagination.current_page"
      :page-size="pagination.per_page"
      @changePage="handleChangePage"
      @search="handleSearch"
      @rowClick="handleView"
    >
      <template #filters>
        <UiMoleculesSelect
          :model-value="listStore.filters.active"
          :options="[
            { label: 'Todos', value: null },
            { label: 'Ativos', value: true },
            { label: 'Inativos', value: false }
          ]"
          placeholder="Status"
          @update:model-value="(value: any) => { listStore.setActiveFilter(value as boolean | null); listStore.fetch(1) }"
        />
      </template>

      <template #cell-price="{ value }">
        <span class="font-medium">
          {{ formatCurrencyBRL(value) }}
        </span>
      </template>

      <template #cell-active="{ value }">
        <UiAtomsBadge :variant="value ? 'success' : 'outline'">
          {{ value ? 'Ativo' : 'Inativo' }}
        </UiAtomsBadge>
      </template>

      <template #row-actions="{ row }">
        <div class="flex justify-end gap-2">
          <UiAtomsButton
            size="sm"
            variant="secondary"
            @click="handleEdit(row)"
          >
            Editar
          </UiAtomsButton>
          <UiAtomsButton
            size="sm"
            variant="danger"
            @click="confirmDelete(row)"
          >
            Excluir
          </UiAtomsButton>
        </div>
      </template>
    </UiOrganismsDataTable>

    <UiMoleculesModal
      v-model="confirming"
      title="Excluir produto"
      size="sm"
    >
      <p class="text-sm text-slate-700">
        Tem certeza que deseja excluir o produto
        <span class="font-medium">{{ target?.name }}</span>?
      </p>
      <p
        v-if="deleteError"
        class="mt-2 text-xs text-red-600"
      >
        {{ deleteError }}
      </p>

      <template #footer>
        <UiAtomsButton
          variant="secondary"
          size="sm"
          :disabled="deleting"
          @click="deleteStore.reset()"
        >
          Cancelar
        </UiAtomsButton>
        <UiAtomsButton
          variant="danger"
          size="sm"
          :loading="deleting"
          @click="performDelete"
        >
          Confirmar exclusão
        </UiAtomsButton>
      </template>
    </UiMoleculesModal>
  </section>
</template>

