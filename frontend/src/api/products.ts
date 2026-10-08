import apiClient from './client'
import type { Product } from '../types/Product'
import type { PaginatedResponse } from '../types/Pagination'

interface ProductFilters {
  search?: string
  category_id?: number
  page?: number
}

interface ProductPayload {
  category_id: number
  name: string
  description: string
  price: number
  stock: number
}

export async function getProducts(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
  const response = await apiClient.get<PaginatedResponse<Product>>('/products', {
    params: filters,
  })
  return response.data
}

export async function getProduct(id: number): Promise<Product> {
  const response = await apiClient.get<Product>(`/products/${id}`)
  return response.data
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const response = await apiClient.post<Product>('/products', payload)
  return response.data
}

export async function updateProduct(id: number, payload: ProductPayload): Promise<Product> {
  const response = await apiClient.put<Product>(`/products/${id}`, payload)
  return response.data
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`)
}