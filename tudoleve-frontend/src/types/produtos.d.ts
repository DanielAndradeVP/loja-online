import type { Product } from './entities'
import type { ApiPaginatedData } from './api'

export interface ProdutoListFilters {
  search?: string
  active?: boolean | null
}

export type ProdutoListResponse = ApiPaginatedData<Product>

export interface ProdutoDetailResponse extends Product {}

