import type { FetchOptions, FetchRequest } from 'ofetch'
import { ofetch } from 'ofetch'
import { useRouter, useRuntimeConfig, useAuthStore } from '#imports'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface HttpErrorPayload {
  statusCode: number
  message: string
  errors?: Record<string, string[] | string>
}

export interface HttpClientOptions extends FetchOptions {
  auth?: boolean
}

const createHttpClient = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  const router = useRouter()

  const baseURL = config.public.apiBaseUrl as string

  const instance = ofetch.create({
    baseURL,
    onRequest({ options }) {
      const headers = new Headers(options.headers as HeadersInit)

      if (!headers.has('Accept')) {
        headers.set('Accept', 'application/json')
      }

      const token = authStore.token || useCookie('auth_token').value || null

      if (token) {
        headers.set('Authorization', `Bearer ${token}`)
      }

      options.headers = headers
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        if (process.client) {
          authStore.reset()

          if (router.currentRoute.value.path !== '/login') {
            router.push('/login')
          }
        }
      }

      const payload: HttpErrorPayload = {
        statusCode: response.status,
        message: (response._data as any)?.message ?? 'Erro inesperado',
        errors: (response._data as any)?.errors
      }

      throw payload
    }
  })

  const request = <T>(
    url: FetchRequest,
    method: HttpMethod,
    options: HttpClientOptions = {}
  ) => {
    const fetchOptions: FetchOptions = {
      ...options,
      method
    }

    return instance<T>(url, fetchOptions)
  }

  return {
    get: <T>(url: FetchRequest, options?: HttpClientOptions) =>
      request<T>(url, 'GET', options),
    post: <T>(url: FetchRequest, body?: unknown, options?: HttpClientOptions) =>
      request<T>(url, 'POST', { ...options, body }),
    put: <T>(url: FetchRequest, body?: unknown, options?: HttpClientOptions) =>
      request<T>(url, 'PUT', { ...options, body }),
    patch: <T>(url: FetchRequest, body?: unknown, options?: HttpClientOptions) =>
      request<T>(url, 'PATCH', { ...options, body }),
    delete: <T>(url: FetchRequest, options?: HttpClientOptions) =>
      request<T>(url, 'DELETE', options),
    postForm: <T>(url: FetchRequest, formData: FormData, options?: HttpClientOptions) =>
      request<T>(url, 'POST', {
        ...options,
        body: formData
      })
  }
}

export const useHttpClient = () => {
  return createHttpClient()
}

