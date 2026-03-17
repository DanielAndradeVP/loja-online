export interface DashboardSummary {
  total_orders: number
  total_revenue: number
  total_customers: number
  total_products: number
}

export type DashboardPeriod = 'today' | '7d' | '30d' | '90d'

