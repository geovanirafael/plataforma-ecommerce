export interface CartItem {
  id: number
  product_id: number
  product_name: string
  unit_price: number
  quantity: number
  subtotal: number
}

export interface Cart {
  id: number
  items: CartItem[]
  total: number
}