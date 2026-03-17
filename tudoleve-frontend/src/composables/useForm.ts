import { reactive, ref } from 'vue'
import type { ApiFieldErrors } from '~/types/api'
import type { HttpErrorPayload } from '~/utils/httpClient'

export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T
}

export const useForm = <T extends Record<string, any>>(options: UseFormOptions<T>) => {
  const values = reactive({ ...(options.initialValues) }) as T
  const errors = ref<Partial<ApiFieldErrors>>({})
  const submitting = ref(false)

  const setValues = (partial: Partial<T>) => {
    Object.assign(values, partial)
  }

  const reset = () => {
    Object.assign(values, options.initialValues)
    errors.value = {}
  }

  const setErrors = (fieldErrors: ApiFieldErrors | null | undefined) => {
    if (!fieldErrors) {
      errors.value = {}
      return
    }
    errors.value = fieldErrors
  }

  const clearErrors = (field?: keyof T | string) => {
    if (!field) {
      errors.value = {}
      return
    }

    const current = { ...(errors.value as Record<string, any>) }
    delete current[field as string]
    errors.value = current
  }

  const handleSubmit = async (submitFn: (payload: T) => Promise<unknown>) => {
    submitting.value = true
    errors.value = {}

    try {
      await submitFn(values)
    } catch (error: any) {
      const payload = error as HttpErrorPayload
      setErrors(payload.errors)
      throw error
    } finally {
      submitting.value = false
    }
  }

  return {
    values,
    errors,
    submitting,
    setValues,
    reset,
    setErrors,
    clearErrors,
    handleSubmit
  }
}

