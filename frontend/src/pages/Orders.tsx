import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOrders } from '../api/orders'
import type { Order } from '../types/Order'

const statusLabels: Record<Order['status'], string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) return <p className="text-ink/50">A carregar...</p>

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-4">Os meus pedidos</h1>
        <p className="text-ink/60">Ainda não fizeste nenhum pedido.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Os meus pedidos</h1>

      <div className="space-y-3">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-ink">Pedido #{order.id}</p>
              <p className="text-sm text-ink/60">
                {new Date(order.created_at).toLocaleDateString('pt-AO')}
              </p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-ink">
                {Number(order.total).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
              </p>
              <p className="text-sm text-accent">{statusLabels[order.status]}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}