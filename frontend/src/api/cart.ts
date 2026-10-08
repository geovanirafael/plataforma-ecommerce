import apiClient from './client'
import type { Cart } from '../types/Cart'

export async function getCart(): Promise<Cart> {
  const response = await apiClient.get<Cart>('/cart')
  return response.data
}

export async function addCartItem(productId: number, quantity: number): Promise<Cart> {
  const response = await apiClient.post<Cart>('/cart/items', { product_id: productId, quantity })
  return response.data
}

export async function updateCartItem(itemId: number, quantity: number): Promise<Cart> {
  const response = await apiClient.put<Cart>(`/cart/items/${itemId}`, { quantity })
  return response.data
}

export async function removeCartItem(itemId: number): Promise<Cart> {
  const response = await apiClient.delete<Cart>(`/cart/items/${itemId}`)
  return response.data
}