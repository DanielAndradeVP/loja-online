import type { FetchOptions, FetchRequest } from 'ofetch'
import type { ApiResponse, ApiPaginatedData } from '~/types/api'
import type { HttpErrorPayload } from '~/utils/httpClient'
import { useHttpClient } from '~/utils/httpClient'

export interface ApiRequestOptions extends FetchOptions {
  /**
   * Quando true, erros de validação são retornados como resultado em vez de lançados.
   */
  softError?: boolean
}

export interface ApiResult<T> {
  success: boolean
  data: T | null
  message: string | null
  fieldErrors: HttpErrorPayload['errors'] | null
  raw?: ApiResponse<T> | null
}

const createEmptyResult = <T>(): ApiResult<T> => ({
  success: false,
  data: null,
  message: null,
  fieldErrors: null,
  raw: null
})

export const useApi = () => {
  const http = useHttpClient()

  const handleRequest = async <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: FetchRequest,
    bodyOrOptions?: unknown,
    maybeOptions?: ApiRequestOptions
  ): Promise<ApiResult<T>> => {
    const result = createEmptyResult<T>()

    try {
      const hasBody = ['post', 'put', 'patch'].includes(method)
      const body = hasBody ? bodyOrOptions : undefined
      const options = (hasBody ? maybeOptions : bodyOrOptions) as ApiRequestOptions | undefined

      const response = await (http as any)[method]<ApiResponse<T>>(url, hasBody ? body : options, hasBody ? options : undefined)

      result.success = response.success
      result.data = response.data
      result.message = response.message ?? null
      result.fieldErrors = (response.errors as any) ?? null
      result.raw = response
    } catch (error: any) {
      const payload = error as HttpErrorPayload
      result.success = false
      result.message = payload.message
      result.fieldErrors = payload.errors ?? null

      if (!maybeOptions?.softError && !(bodyOrOptions as ApiRequestOptions)?.softError) {
        throw error
      }
    }

    return result
  }

  const get = <T>(url: FetchRequest, options?: ApiRequestOptions) =>
    handleRequest<T>('get', url, options)

  const post = <T>(url: FetchRequest, body?: unknown, options?: ApiRequestOptions) =>
    handleRequest<T>('post', url, body, options)

  const put = <T>(url: FetchRequest, body?: unknown, options?: ApiRequestOptions) =>
    handleRequest<T>('put', url, body, options)

  const patch = <T>(url: FetchRequest, body?: unknown, options?: ApiRequestOptions) =>
    handleRequest<T>('patch', url, body, options)

  const destroy = <T>(url: FetchRequest, options?: ApiRequestOptions) =>
    handleRequest<T>('delete', url, options)

  return {
    get,
    post,
    put,
    patch,
    delete: destroy
  }
}

export type { ApiResponse, ApiPaginatedData }

