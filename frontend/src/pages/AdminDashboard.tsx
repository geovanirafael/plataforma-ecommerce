import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getDashboardSummary } from '../api/dashboard'
import type { DashboardSummary } from '../types/Dashboard'

const statusLabels: Record<string, string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
}

export function AdminDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getDashboardSummary()
      .then(setSummary)
      .catch(() => setError('Não foi possível carregar o dashboard.'))
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="text-ink/50">A carregar...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!summary) return null

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Dashboard</h1>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm text-ink/60 mb-1">Faturação total</p>
          <p className="text-2xl font-bold text-ink">
            {summary.total_sales.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
          </p>
        </div>

        {Object.entries(summary.orders_by_status).map(([status, count]) => (
          <div key={status} className="bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-ink/60 mb-1">{statusLabels[status] ?? status}</p>
            <p className="text-2xl font-bold text-ink">{count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top produtos */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-ink mb-4">Produtos mais vendidos</h2>
          {summary.top_products.length === 0 ? (
            <p className="text-sm text-ink/50">Ainda sem vendas.</p>
          ) : (
            <ul className="space-y-3">
              {summary.top_products.map((product) => (
                <li key={product.product_id} className="flex justify-between text-sm">
                  <span className="text-ink">{product.name}</span>
                  <span className="text-ink/60">{product.total_sold} vendidos</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Stock baixo */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-semibold text-ink mb-4">Alerta de stock baixo</h2>
          {summary.low_stock_products.length === 0 ? (
            <p className="text-sm text-ink/50">Nenhum produto com stock baixo.</p>
          ) : (
            <ul className="space-y-3">
              {summary.low_stock_products.map((product) => (
                <li key={product.id} className="flex justify-between text-sm">
                  <span className="text-ink">{product.name}</span>
                  <span className="text-red-600 font-medium">{product.stock} restantes</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Pedidos recentes */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mt-6">
        <h2 className="font-semibold text-ink mb-4">Pedidos recentes</h2>
        {summary.recent_orders.length === 0 ? (
          <p className="text-sm text-ink/50">Ainda sem pedidos.</p>
        ) : (
          <div className="space-y-2">
            {summary.recent_orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="flex items-center justify-between text-sm py-2 border-b border-black/5 last:border-0 hover:bg-surface -mx-2 px-2 rounded-lg transition"
              >
                <div>
                  <span className="text-ink font-medium">#{order.id}</span>
                  <span className="text-ink/50 ml-2">{order.user.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-ink/60">
                    {Number(order.total).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
                  </span>
                  <span className="text-accent">{statusLabels[order.status] ?? order.status}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}