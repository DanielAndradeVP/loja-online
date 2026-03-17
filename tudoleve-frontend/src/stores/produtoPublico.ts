import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ProductPublic } from '~/types/entities'
import { useApi } from '~/composables/useApi'

export const useProdutoPublicoStore = defineStore('produtoPublico', () => {
  const product = ref<ProductPublic | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Prepared for IP/locale alignment: backend serves locale-aware content
  const currentSlug = ref<string | null>(null)

  const api = useApi()

  const fetch = async (slug: string) => {
    if (loading.value) return
    loading.value = true
    error.value = null
    currentSlug.value = slug

    try {
      const { data, message } = await api.get<ProductPublic>(`/public/products/${slug}`, {
        softError: true
      })

      if (!data) {
        product.value = null
        error.value = message ?? 'Produto não encontrado.'
        return
      }

      product.value = data
    } catch (e: any) {
      product.value = null
      error.value = e?.message ?? 'Não foi possível carregar o produto.'
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    product.value = null
    loading.value = false
    error.value = null
    currentSlug.value = null
  }

  return {
    product,
    loading,
    error,
    currentSlug,
    fetch,
    reset
  }
})
