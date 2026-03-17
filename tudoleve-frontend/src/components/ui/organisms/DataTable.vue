<script setup lang="ts">
type ColumnAlign = 'left' | 'center' | 'right'

export interface DataTableColumn {
  key: string
  label: string
  width?: string
  align?: ColumnAlign
}

const props = withDefaults(defineProps<{
  columns: DataTableColumn[]
  rows: Record<string, any>[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  page?: number
  pageSize?: number
  totalItems?: number
  showToolbar?: boolean
  showSearch?: boolean
}>(), {
  loading: false,
  error: null,
  emptyMessage: 'Nenhum registro encontrado.',
  page: 1,
  pageSize: 10,
  totalItems: 0,
  showToolbar: true,
  showSearch: true
})

const emit = defineEmits<{
  (e: 'rowClick', row: Record<string, any>): void
  (e: 'changePage', page: number): void
  (e: 'search', term: string): void
}>()

const totalPages = computed(() => {
  if (!props.totalItems || !props.pageSize) return 1
  return Math.max(1, Math.ceil(props.totalItems / props.pageSize))
})

const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  emit('changePage', page)
}
</script>

<template>
  <UiAtomsCard padded>
    <!-- Toolbar -->
    <div
      v-if="showToolbar"
      class="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex items-center gap-2">
        <UiAtomsTypography variant="subtitle">
          <slot name="title">
            Listagem
          </slot>
        </UiAtomsTypography>
        <UiAtomsBadge v-if="totalItems">
          {{ totalItems }} itens
        </UiAtomsBadge>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <slot name="filters" />
        <UiMoleculesInputSearch
          v-if="showSearch"
          placeholder="Buscar..."
          @search="emit('search', $event)"
        />
        <slot name="toolbar-actions" />
      </div>
    </div>

    <!-- Estados especiais -->
    <div v-if="error" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 mb-3">
      {{ error }}
    </div>

    <div
      v-if="loading"
      class="flex items-center justify-center py-10 text-sm text-slate-500"
    >
      Carregando...
    </div>

    <UiMoleculesEmptyState
      v-else-if="!rows.length"
      :description="emptyMessage"
    />

    <!-- Tabela -->
    <div
      v-else
      class="overflow-x-auto"
    >
      <table class="min-w-full divide-y divide-slate-200 text-sm">
        <thead class="bg-slate-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              class="px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500"
              :class="{
                'text-left': column.align === 'left' || !column.align,
                'text-center': column.align === 'center',
                'text-right': column.align === 'right'
              }"
              :style="column.width ? { width: column.width } : undefined"
            >
              {{ column.label }}
            </th>
            <th
              v-if="$slots['row-actions']"
              scope="col"
              class="px-3 py-2 text-right text-xs font-medium uppercase tracking-wide text-slate-500"
            >
              Ações
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 bg-white">
          <tr
            v-for="(row, index) in rows"
            :key="index"
            class="hover:bg-slate-50 cursor-pointer"
            @click="emit('rowClick', row)"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-3 py-2 align-middle"
              :class="{
                'text-left': column.align === 'left' || !column.align,
                'text-center': column.align === 'center',
                'text-right': column.align === 'right'
              }"
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="row[column.key]"
              >
                {{ row[column.key] }}
              </slot>
            </td>
            <td
              v-if="$slots['row-actions']"
              class="px-3 py-2 text-right align-middle"
              @click.stop
            >
              <slot
                name="row-actions"
                :row="row"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Paginação -->
    <div
      v-if="totalPages > 1"
      class="mt-4 flex items-center justify-between gap-3 text-xs text-slate-500"
    >
      <span>
        Página {{ page }} de {{ totalPages }}
      </span>
      <div class="flex items-center gap-1.5">
        <UiAtomsButton
          variant="secondary"
          size="sm"
          :disabled="page <= 1"
          @click="changePage(page - 1)"
        >
          Anterior
        </UiAtomsButton>
        <UiAtomsButton
          variant="secondary"
          size="sm"
          :disabled="page >= totalPages"
          @click="changePage(page + 1)"
        >
          Próxima
        </UiAtomsButton>
      </div>
    </div>
  </UiAtomsCard>
</template>

