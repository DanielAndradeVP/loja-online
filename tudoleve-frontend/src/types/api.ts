export interface ApiFieldErrors {
  [field: string]: string[] | string
}

export interface ApiPaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface ApiPaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from?: number | null
  to?: number | null
  links?: ApiPaginationLink[]
}

export interface ApiMeta {
  pagination?: ApiPaginationMeta
  [key: string]: unknown
}

/**
 * Contrato padrão de resposta da API Laravel.
 */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string | null
  errors?: ApiFieldErrors | null
  meta?: ApiMeta | null
}

/**
 * Estrutura de dados paginada esperada pelo frontend.
 * Corresponde aos campos típicos do paginator do Laravel.
 */
export interface ApiPaginatedData<T> {
  current_page: number
  data: T[]
  last_page: number
  per_page: number
  total: number
  links: ApiPaginationLink[]
}

