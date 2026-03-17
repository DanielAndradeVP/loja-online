import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '~/types/entities'
import type { ApiPaginatedData } from '~/types/api'
import type { ProdutoListFilters } from '~/types/produtos'
import { useApi } from '~/composables/useApi'

export const useProdutosListStore = defineStore('produtosList', () => {
  const items = ref<Product[]>([])
  const pagination = ref<Pick<ApiPaginatedData<Product>, 'current_page' | 'last_page' | 'per_page' | 'total'>>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filters = ref<ProdutoListFilters>({
    search: '',
    active: null
  })

  const api = useApi()

  const fetch = async (page = 1) => {
    loading.value = true
    error.value = null

    try {
      const { data, message } = await api.get<ApiPaginatedData<Product>>('/catalog/products', {
        params: {
          page,
          search: filters.value.search,
          active: filters.value.active
        },
        softError: true
      })

      if (!data) {
        items.value = []
        pagination.value = {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0
        }
        if (message) error.value = message
        return
      }

      items.value = data.data
      pagination.value = {
        current_page: data.current_page,
        last_page: data.last_page,
        per_page: data.per_page,
        total: data.total
      }
    } catch (e: any) {
      error.value = e?.message || 'Não foi possível carregar os produtos.'
    } finally {
      loading.value = false
    }
  }

  const setSearch = (search: string) => {
    filters.value.search = search
  }

  const setActiveFilter = (active: boolean | null) => {
    filters.value.active = active
  }

  const resetFilters = () => {
    filters.value = {
      search: '',
      active: null
    }
  }

  return {
    items,
    pagination,
    loading,
    error,
    filters,
    fetch,
    setSearch,
    setActiveFilter,
    resetFilters
  }
})

