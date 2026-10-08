export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: string
  product?: {
    id: number
    name: string
  }
}

export interface Order {
  id: number
  user_id: number
  total: string
  status: 'pending' | 'paid' | 'shipped' | 'cancelled'
  created_at: string
  items: OrderItem[]
}

export interface Payment {
  id: number
  order_id: number
  provider: string
  status: 'approved' | 'failed'
  amount: string
  created_at: string
}