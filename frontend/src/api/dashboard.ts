import apiClient from './client'
import type { DashboardSummary } from '../types/Dashboard'

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const response = await apiClient.get<DashboardSummary>('/admin/dashboard')
  return response.data
}