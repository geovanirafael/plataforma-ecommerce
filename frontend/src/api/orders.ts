import apiClient from './client'
import type { Order, Payment } from '../types/Order'

export async function checkout(): Promise<Order> {
  const response = await apiClient.post<Order>('/orders/checkout')
  return response.data
}

export async function getOrders(): Promise<Order[]> {
  const response = await apiClient.get<Order[]>('/orders')
  return response.data
}

export async function getOrder(id: number): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${id}`)
  return response.data
}

export async function payOrder(id: number): Promise<Payment> {
  const response = await apiClient.post<Payment>(`/orders/${id}/pay`)
  return response.data
}