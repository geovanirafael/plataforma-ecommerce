export interface DashboardSummary {
  total_sales: number
  orders_by_status: Record<string, number>
  top_products: {
    product_id: number
    name: string
    total_sold: number
  }[]
  low_stock_products: {
    id: number
    name: string
    stock: number
  }[]
  recent_orders: {
    id: number
    total: string
    status: string
    created_at: string
    user: {
      id: number
      name: string
      email: string
    }
  }[]
}