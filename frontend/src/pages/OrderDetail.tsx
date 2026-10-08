import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder, payOrder } from '../api/orders'
import type { Order } from '../types/Order'

const statusLabels: Record<Order['status'], string> = {
  pending: 'Aguardando pagamento',
  paid: 'Pago',
  shipped: 'Enviado',
  cancelled: 'Cancelado',
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    loadOrder(Number(id))
  }, [id])

  function loadOrder(orderId: number) {
    setIsLoading(true)
    getOrder(orderId)
      .then(setOrder)
      .finally(() => setIsLoading(false))
  }

  async function handlePay() {
    if (!order) return

    setPaymentError(null)
    setIsPaying(true)

    try {
      await payOrder(order.id)
      loadOrder(order.id)
    } catch {
      setPaymentError('Não foi possível processar o pagamento.')
    } finally {
      setIsPaying(false)
    }
  }

  if (isLoading) return <p className="text-ink/50">A carregar...</p>
  if (!order) return <p className="text-red-600">Pedido não encontrado.</p>

  return (
    <div className="max-w-lg">
      <Link to="/orders" className="text-sm text-accent font-medium mb-6 inline-block">
        ← Ver todos os pedidos
      </Link>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-extrabold text-ink">Pedido #{order.id}</h1>
          <span className="text-sm font-medium px-3 py-1 rounded-full bg-accent/10 text-accent">
            {statusLabels[order.status]}
          </span>
        </div>

        <div className="space-y-2 mb-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm text-ink/70">
              <span>{item.product?.name ?? 'Produto'} × {item.quantity}</span>
              <span>{(Number(item.unit_price) * item.quantity).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-ink border-t border-black/10 pt-4 mb-6">
          <span>Total</span>
          <span>{Number(order.total).toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz</span>
        </div>

        {paymentError && <p className="text-red-600 text-sm mb-4">{paymentError}</p>}

        {order.status === 'pending' && (
          <button
            onClick={handlePay}
            disabled={isPaying}
            className="w-full bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium py-3 rounded-xl transition"
          >
            {isPaying ? 'A processar pagamento...' : 'Pagar agora'}
          </button>
        )}

        {order.status === 'paid' && (
          <p className="text-green-700 bg-green-50 rounded-xl px-4 py-3 text-sm font-medium">
            Pagamento confirmado com sucesso.
          </p>
        )}

        {order.status === 'cancelled' && (
          <p className="text-red-700 bg-red-50 rounded-xl px-4 py-3 text-sm font-medium">
            Este pedido foi cancelado (pagamento não aprovado).
          </p>
        )}
      </div>
    </div>
  )
}