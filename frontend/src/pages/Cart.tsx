import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { checkout } from '../api/orders'
import axios from 'axios'

export function Cart() {
  const { cart, updateItem, removeItem, clearCartLocally } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  async function handleCheckout() {
    setError(null)
    setIsCheckingOut(true)

    try {
      const order = await checkout()
      clearCartLocally()
      navigate(`/orders/${order.id}`)
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 422) {
        setError(err.response.data.message ?? 'Não foi possível finalizar a compra.')
      } else {
        setError('Ocorreu um erro ao finalizar a compra.')
      }
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-4">Carrinho</h1>
        <p className="text-ink/60 mb-4">O teu carrinho está vazio.</p>
        <Link to="/" className="text-accent font-medium">Ver produtos</Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink tracking-tight mb-6">Carrinho</h1>

      <div className="space-y-4 mb-8">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between bg-white rounded-2xl p-4 shadow-sm">
            <div>
              <p className="font-semibold text-ink">{item.product_name}</p>
              <p className="text-sm text-ink/60">
                {item.unit_price.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz cada
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(item.id, Number(e.target.value))}
                className="w-16 border border-black/10 rounded-lg px-2 py-1 text-center"
              />
              <p className="font-semibold text-ink w-24 text-right">
                {item.subtotal.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
              </p>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-600 text-sm hover:underline"
              >
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="flex items-center justify-between border-t border-black/10 pt-6">
        <p className="text-lg font-bold text-ink">
          Total: {cart.total.toLocaleString('pt-AO', { minimumFractionDigits: 2 })} Kz
        </p>
        <button
          onClick={handleCheckout}
          disabled={isCheckingOut}
          className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white font-medium px-6 py-3 rounded-xl transition"
        >
          {isCheckingOut ? 'A processar...' : 'Finalizar compra'}
        </button>
      </div>
    </div>
  )
}