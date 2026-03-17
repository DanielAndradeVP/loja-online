import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '~/types/entities'
import { useApi } from '~/composables/useApi'

export const useProdutosDeleteStore = defineStore('produtosDelete', () => {
  const target = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const confirming = ref(false)

  const api = useApi()

  const confirm = (product: Product) => {
    target.value = product
    confirming.value = true
    error.value = null
    success.value = false
  }

  const reset = () => {
    target.value = null
    loading.value = false
    error.value = null
    success.value = false
    confirming.value = false
  }

  const perform = async () => {
    if (!target.value) return

    loading.value = true
    error.value = null
    success.value = false

    try {
      const { success: apiSuccess, message } = await api.delete<null>(`/catalog/products/${target.value.id}`, {
        softError: true
      })

      if (!apiSuccess) {
        error.value = message ?? 'Não foi possível excluir o produto.'
        return
      }

      success.value = true
      confirming.value = false
    } catch (e: any) {
      error.value = e?.message || 'Erro inesperado ao excluir o produto.'
    } finally {
      loading.value = false
    }
  }

  return {
    target,
    loading,
    error,
    success,
    confirming,
    confirm,
    reset,
    perform
  }
})

