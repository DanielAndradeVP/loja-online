import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '~/types/entities'
import type { ApiFieldErrors } from '~/types/api'
import { useApi } from '~/composables/useApi'
import { useForm } from '~/composables/useForm'

export interface ProdutoEditPayload {
  name: string
  sku?: string | null
  price: number | null
  active: boolean
}

export const useProdutosEditStore = defineStore('produtosEdit', () => {
  const api = useApi()
  const item = ref<Product | null>(null)
  const error = ref<string | null>(null)
  const fieldErrors = ref<ApiFieldErrors | null>(null)
  const success = ref(false)
  const loading = ref(false)

  const form = useForm<ProdutoEditPayload>({
    initialValues: {
      name: '',
      sku: '',
      price: null,
      active: true
    }
  })

  const load = async (id: number | string) => {
    loading.value = true
    error.value = null

    try {
      const { data, message } = await api.get<Product>(`/catalog/products/${id}`, {
        softError: true
      })

      if (!data) {
        error.value = message ?? 'Produto não encontrado.'
        return
      }

      item.value = data
      form.setValues({
        name: data.name,
        sku: data.sku ?? '',
        price: data.price,
        active: data.active
      })
    } catch (e: any) {
      error.value = e?.message || 'Não foi possível carregar o produto.'
    } finally {
      loading.value = false
    }
  }

  const submit = async (id: number | string) => {
    fieldErrors.value = null
    error.value = null
    success.value = false

    await form.handleSubmit(async (values) => {
      const payload = {
        name: values.name,
        sku: values.sku,
        price: values.price,
        active: values.active
      }

      const { data, message, fieldErrors: apiErrors, success: apiSuccess } =
        await api.put<Product>(`/catalog/products/${id}`, payload, { softError: true })

      if (!apiSuccess) {
        error.value = message ?? 'Não foi possível atualizar o produto.'
        fieldErrors.value = apiErrors ?? null
        form.setErrors(apiErrors ?? null)
        return
      }

      item.value = data ?? null
      success.value = true
    })
  }

  const reset = () => {
    form.reset()
    item.value = null
    error.value = null
    fieldErrors.value = null
    success.value = false
    loading.value = false
  }

  return {
    form,
    item,
    error,
    fieldErrors,
    success,
    loading,
    load,
    submit,
    reset
  }
})

