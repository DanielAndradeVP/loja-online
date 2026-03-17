import type { AuthUser } from '~/stores/auth'

export type User = AuthUser

export interface Customer {
  id: number
  name: string
  email: string
  document?: string | null
  phone?: string | null
}

export interface Product {
  id: number
  name: string
  sku?: string | null
  price: number
  active: boolean
}

export interface OrderItem {
  id: number
  product_id: number
  quantity: number
  unit_price: number
}

export interface Order {
  id: number
  code: string
  customer_id: number
  status: string
  total: number
  created_at: string
  items?: OrderItem[]
}

// — Public / storefront types —

export interface ProductBenefit {
  icon: string
  title: string
  description: string
}

export interface ProductFAQItem {
  question: string
  answer: string
}

export interface ProductReview {
  id: number
  author: string
  avatar?: string | null
  rating: number
  comment: string
  date: string
  verified: boolean
}

export interface ProductPublic {
  id: number
  slug: string
  name: string
  short_description?: string | null
  description?: string | null
  price: number
  compare_price?: number | null
  images: string[]
  benefits: ProductBenefit[]
  faq: ProductFAQItem[]
  reviews?: ProductReview[]
  related?: ProductPublicSummary[]
  in_stock: boolean
  stock_quantity?: number | null
  // i18n: locale-specific content served by backend
  locale?: string
}

export interface ProductPublicSummary {
  id: number
  slug: string
  name: string
  price: number
  image?: string | null
}

// — Tracking types —

export interface TrackingEvent {
  date: string
  description: string
  location?: string | null
}

export interface TrackingResult {
  code: string
  status: string
  status_label: string
  last_update: string
  estimated_delivery?: string | null
  events: TrackingEvent[]
}

// — Checkout types —

export interface CheckoutPayload {
  product_slug: string
  quantity: number
  customer_name: string
  customer_email: string
  customer_document: string
  customer_phone: string
  address_cep: string
  address_street: string
  address_number: string
  address_complement?: string | null
  address_neighborhood: string
  address_city: string
  address_state: string
  coupon_code?: string | null
}

export interface CheckoutResult {
  order_id: number
  order_code: string
  payment_url?: string | null
  redirect_to?: string | null
}

export interface PostSaleOrder {
  id: number
  code: string
  status: string
  total: number
  product_name: string
  customer_name: string
  estimated_delivery?: string | null
  tracking_code?: string | null
}

