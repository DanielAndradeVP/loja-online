import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '~/types/entities'
import { useApi } from '~/composables/useApi'

export const useProdutosDetailStore = defineStore('produtosDetail', () => {
  const item = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const api = useApi()

  const fetch = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const { data, message } = await api.get<Product>(`/catalog/products/${id}`, {
        softError: true
      })

      if (!data && message) {
        error.value = message
      } else {
        item.value = data
      }
    } catch (e: any) {
      error.value = e?.message || 'Não foi possível carregar o produto.'
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    item.value = null
    error.value = null
  }

  return {
    item,
    loading,
    error,
    fetch,
    reset
  }
})

