export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  category: {
    id: number
    name: string
  } | null
  created_at: string
}