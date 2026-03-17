import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '~/types/entities'
import type { ApiFieldErrors } from '~/types/api'
import { useApi } from '~/composables/useApi'
import { useForm } from '~/composables/useForm'

export interface ProdutoCreatePayload {
  name: string
  sku?: string | null
  price: number | null
  active: boolean
}

export const useProdutosCreateStore = defineStore('produtosCreate', () => {
  const api = useApi()
  const lastCreated = ref<Product | null>(null)
  const error = ref<string | null>(null)
  const fieldErrors = ref<ApiFieldErrors | null>(null)
  const success = ref(false)

  const form = useForm<ProdutoCreatePayload>({
    initialValues: {
      name: '',
      sku: '',
      price: null,
      active: true
    }
  })

  const submit = async () => {
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
        await api.post<Product>('/catalog/products', payload, { softError: true })

      if (!apiSuccess) {
        error.value = message ?? 'Não foi possível criar o produto.'
        fieldErrors.value = apiErrors ?? null
        form.setErrors(apiErrors ?? null)
        return
      }

      lastCreated.value = data ?? null
      success.value = true
    })
  }

  const reset = () => {
    form.reset()
    error.value = null
    fieldErrors.value = null
    success.value = false
    lastCreated.value = null
  }

  return {
    form,
    lastCreated,
    error,
    fieldErrors,
    success,
    submit,
    reset
  }
})

