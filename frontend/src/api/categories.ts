import apiClient from './client'
import type { Category } from '../types/Category'

export async function getCategories(): Promise<Category[]> {
  const response = await apiClient.get<Category[]>('/categories')
  return response.data
}

export async function createCategory(name: string): Promise<Category> {
  const response = await apiClient.post<Category>('/categories', { name })
  return response.data
}

export async function updateCategory(id: number, name: string): Promise<Category> {
  const response = await apiClient.put<Category>(`/categories/${id}`, { name })
  return response.data
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`)
}